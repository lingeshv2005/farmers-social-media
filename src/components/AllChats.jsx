import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/AllChat.css';
import CreateGroupBox from "./CreateGroupBox";

export default function AllChats() {
    const [communicationIds, setCommunicationIds] = useState([]);
    const [groupCommunicationIds, setGroupCommunicationIds] = useState([]);
    const [chatUsers, setChatUsers] = useState([]);
    const [groupChats, setGroupChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showCreateGroup, setShowCreateGroup] = useState(false); // State for modal
    const navigate = useNavigate();

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchCommunicationIds = async () => {
            if (!userId) {
                setError("User ID not found. Please log in again.");
                setLoading(false);
                return;
            }

            try {
                const [userCommRes, groupCommRes] = await Promise.all([
                    axios.get(`http://localhost:8000/api/v1/userdetails/${userId}/communicationids`),
                    axios.get(`http://localhost:8000/api/v1/userdetails/${userId}/groupcommunicationids`)
                ]);

                setCommunicationIds(userCommRes.data.communicationIds || []);
                setGroupCommunicationIds(groupCommRes.data.groupCommunicationIds || []);
            } catch (err) {
                console.error("Error fetching communication IDs:", err);
                setError("Failed to load chat conversations.");
            }
        };

        fetchCommunicationIds();
    }, [userId]);

    useEffect(() => {
        if (communicationIds.length === 0) {
            setLoading(false);
            return;
        }

        const fetchChatUsers = async () => {
            try {
                const usersData = await Promise.all(
                    communicationIds.map(async (commId) => {
                        const res = await axios.get(`http://localhost:8000/api/v1/userdetails/getuserdetails/${commId}`);
                        return { ...res.data, communicationId: commId };
                    })
                );
                setChatUsers(usersData);
            } catch (err) {
                console.error("Error fetching user details:", err);
                setError("Failed to load chat users.");
            } finally {
                setLoading(false);
            }
        };

        fetchChatUsers();
    }, [communicationIds]);

    useEffect(() => {
        if (groupCommunicationIds.length === 0) return;

        const fetchGroupChats = async () => {
            try {
                const groups = await Promise.all(
                    groupCommunicationIds.map(async (groupCommId) => {
                        const res = await axios.get(`http://localhost:8000/api/v1/message/group-chat/${groupCommId}`);
                        return { ...res.data, communicationId: groupCommId, isGroup: true };
                    })
                );
                setGroupChats(groups);
            } catch (err) {
                console.error("Error fetching group chats:", err);
                setError("Failed to load group chats.");
            }
        };

        fetchGroupChats();
    }, [groupCommunicationIds]);

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (!query) {
            setSearchResults([]);
            return;
        }

        try {
            const res = await axios.get(`http://localhost:8000/api/v1/users/search?query=${query}`);
            setSearchResults(res.data);
        } catch (err) {
            console.error("Error searching users:", err);
        }
    };

    return (
        <div className="chat-list-container">
            {/* Search Bar */}
            <input 
                type="text" 
                placeholder="Search users..." 
                value={searchQuery} 
                onChange={handleSearch} 
                className="search-input"
            />

            {/* Header with Create Group Button */}
            <div className="chat-header">
                <h2>Chats</h2>
                <button className="three-dots-btn" onClick={() => setShowCreateGroup(true)}>⋮</button>
            </div>

            {/* Create Group Modal */}
            {showCreateGroup && <CreateGroupBox userId={userId} closeModal={() => setShowCreateGroup(false)} />}

            {/* Search Results */}
            {searchResults.length > 0 && (
                <div className="search-results">
                    {searchResults.map((user) => (
                        <div 
                            key={user.userId} 
                            className="chat-item" 
                            onClick={() => navigate(`/chat/${user.userId}`, { state: { isNewChat: true } })}
                        >
                            <img src={user.profilePic || "./src/assets/default-profile.png"} alt="Profile" className="profile-pic" />
                            <span>{user.username}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Chat List */}
            {loading ? (
                <p>Loading chats...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <>
                    {/* No Chats */}
                    {communicationIds.length === 0 && groupChats.length === 0 ? (
                        <div className="get-started">
                            <h3>Welcome to ChatApp</h3>
                            <p>Start chatting by sending a message.</p>
                        </div>
                    ) : (
                        <>
                            {/* Individual Chats */}
                            {chatUsers.length > 0 && (
                                <div className="chats-section">
                                    <h3>Direct Messages</h3>
                                    {chatUsers.map((user) => (
                                        <div 
                                            key={user.communicationId || user.userId}
                                            className="chat-item" 
                                            onClick={() => navigate(`/chat/${user.userId}`, { state: { isNewChat: false, communicationId: user.communicationId } })}
                                        >
                                            <img 
                                                src={user.profilePic || "./src/assets/default-profile.png"} 
                                                alt="Profile" 
                                                className="profile-pic" 
                                            />
                                            <span>{user.username}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Group Chats */}
                            {groupChats.length > 0 && (
                                <div className="chats-section">
                                    <h3>Group Chats</h3>
                                    {groupChats.map((group) => (
                                        <div 
                                            key={group.communicationId}  
                                            className="chat-item group-chat" 
                                            onClick={() => navigate(`/group-chat/${group.communicationId}`)}
                                        >
                                            <img src={"./src/assets/group-icon.png"} alt="Group" className="profile-pic" />
                                            <span>{group.groupName}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}
