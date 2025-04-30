import React, { useState, useEffect } from 'react'; 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/AllChat.css';
import CreateGroupBox from "./CreateGroupBox";
import CreateChannelBox from "./CreateChannelBox";

export default function AllChats() {
    const [communicationIds, setCommunicationIds] = useState([]);
    const [groupCommunicationIds, setGroupCommunicationIds] = useState([]);
    const [channelCommunicationIds, setChannelCommunicationIds] = useState([]); 
    const [chatUsers, setChatUsers] = useState([]);
    const [groupChats, setGroupChats] = useState([]);
    const [channelChats, setChannelChats] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [modalType, setModalType] = useState("");
    const [showMenu, setShowMenu] = useState(false);

    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const fetchCommunicationData = async (url, setterFunction, dataKey) => {
        try {
            const res = await axios.get(url);
            setterFunction(res.data[dataKey] || []);
        } catch (err) {
            console.error(`Error fetching data from ${url}:`, err);
            setError(`Failed to load ${dataKey}.`);
        }
    };

    const fetchCommunicationIds = async () => {
        if (!userId) {
            setError("User ID not found. Please log in again.");
            setLoading(false);
            return;
        }

        setLoading(true);
        await Promise.all([
            fetchCommunicationData(`http://localhost:8000/api/v1/userdetails/${userId}/communicationids`, setCommunicationIds, "communicationIds"),
            fetchCommunicationData(`http://localhost:8000/api/v1/userdetails/${userId}/groupcommunicationids`, setGroupCommunicationIds, "groupCommunicationIds"),
            fetchCommunicationData(`http://localhost:8000/api/v1/userdetails/${userId}/channelcommunicationids`, setChannelCommunicationIds, "channelCommunicationIds")
        ]);
        setLoading(false);
    };

    useEffect(() => {
        fetchCommunicationIds();
    }, [userId]);

    useEffect(() => {
        if (communicationIds.length === 0) return;
        const fetchChatUsers = async () => {
            try {
                const seen = new Set();
                const usersData = [];

                for (const commId of communicationIds) {
                    if (seen.has(commId)) continue;
                    seen.add(commId);

                    const commRes = await axios.get(`http://localhost:8000/api/v1/message/${commId}`);
                    const commData = commRes.data;
                    console.log(commData);
                    const otherUserId = commData.userId1 === userId ? commData.userId2 : commData.userId1;
                    const userRes = await axios.get(`http://localhost:8000/api/v1/userdetails/getuserdetails/${otherUserId}`);
                    console.log("Fetched user details:", userRes.data);

                    usersData.push({
                        ...userRes.data,
                        communicationId: commId
                    });
                }

                setChatUsers(usersData);
            } catch (err) {
                console.error("Error fetching user details:", err);
                setError("Failed to load chat users.");
            }
        };
        fetchChatUsers();
    }, [communicationIds]);

    useEffect(() => {
        if (groupCommunicationIds.length === 0) return;

        const fetchGroupChats = async () => {
            try {
                const seen = new Set();
                const groups = [];

                for (const groupCommId of groupCommunicationIds) {
                    if (seen.has(groupCommId)) continue;
                    seen.add(groupCommId);

                    const res = await axios.get(`http://localhost:8000/api/v1/message/group-chat/${groupCommId}`);
                    groups.push({ ...res.data, communicationId: groupCommId, isGroup: true });
                }

                setGroupChats(groups);
            } catch (err) {
                console.error("Error fetching group chats:", err);
                setError("Failed to load group chats.");
            }
        };

        fetchGroupChats();
    }, [groupCommunicationIds]);

    useEffect(() => {
        if (channelCommunicationIds.length === 0) return;

        const fetchChannelChats = async () => {
            try {
                const seen = new Set();
                const channels = [];

                for (const channelCommId of channelCommunicationIds) {
                    if (seen.has(channelCommId)) continue;
                    seen.add(channelCommId);

                    const res = await axios.get(`http://localhost:8000/api/v1/message/channel/${channelCommId}`);
                    channels.push({ ...res.data, communicationId: channelCommId, isChannel: true });
                }

                setChannelChats(channels);
            } catch (err) {
                console.error("Error fetching channel chats:", err);
                setError("Failed to load channel chats.");
            }
        };

        fetchChannelChats();
    }, [channelCommunicationIds]);

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
            <input 
                type="text" 
                placeholder="Search users..." 
                value={searchQuery} 
                onChange={handleSearch} 
                className="search-input"
            />

            <div className="chat-header">
                <h2>Chats</h2>
                <div className="dropdown-container">
                    <button className="three-dots-btn" onClick={() => setShowMenu(prev => !prev)}>⋮</button>
                    {showMenu && (
                        <div className="dropdown-menu">
                            <div onClick={() => { setModalType("group"); setShowMenu(false); }}>Create Group</div>
                            <div onClick={() => { setModalType("channel"); setShowMenu(false); }}>Create Channel</div>
                        </div>
                    )}
                </div>
            </div>

            {modalType === "group" && (
                <CreateGroupBox 
                    userId={userId} 
                    closeModal={() => {
                        setModalType("");
                        fetchCommunicationIds();
                    }} 
                />
            )}

            {modalType === "channel" && (
                <CreateChannelBox 
                    userId={userId} 
                    closeModal={() => {
                        setModalType("");
                        fetchCommunicationIds();
                    }} 
                />
            )}

            {searchResults.length > 0 && (
                <div className="search-results">
                    {searchResults.map((user) => (
                        <div 
                            key={`search-${user.userId}`} 
                            className="chat-item" 
                            onClick={() => navigate(`/chat/${user.userId}`, { state: { isNewChat: true } })}
                        >
                            <img src={user.profilePic || "./src/assets/default-profile.png"} alt="Profile" className="profile-pic" />
                            <span>{user.username}</span>
                        </div>
                    ))}
                </div>
            )}

            {loading ? (
                <p>Loading chats...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <>
                    {communicationIds.length === 0 && groupChats.length === 0 && channelChats.length === 0 ? (
                        <div className="get-started">
                            <h3>Welcome to ChatApp</h3>
                            <p>Start chatting by sending a message.</p>
                        </div>
                    ) : (
                        <>
                            {chatUsers.length > 0 && (
                                <div className="chats-section">
                                    <h3>Direct Messages</h3>
                                    {chatUsers.map((user) => (
                                        <div 
                                            key={`dm-${user.communicationId}-${user.userId}`} 
                                            className="chat-item" 
                                            onClick={() => navigate(`/chat/${user.userId}`, { state: { isNewChat: false, communicationId: user.communicationId } })}
                                        >
                                            <img 
                                                src={user.profilePic || "./src/assets/person.jpeg"} 
                                                alt="Profile" 
                                                className="profile-pic" 
                                            />
                                        <span>{user.username || "No username"}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {groupChats.length > 0 && (
                                <div className="chats-section">
                                    <h3>Group Chats</h3>
                                    {groupChats.map((group) => (
                                        <div 
                                            key={`group-${group.communicationId}`}  
                                            className="chat-item group-chat" 
                                            onClick={() => navigate(`/group/${group.communicationId}`)}
                                        >
                                            <img src={"./src/assets/group.png"} alt="Group" className="profile-pic" />
                                            <span>{group.groupName || "Unnamed Group"}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {channelChats.length > 0 && (
                                <div className="chats-section">
                                    <h3>Channel Chats</h3>
                                    {channelChats.map((channel) => (
                                        <div 
                                            key={`channel-${channel.communicationId}`}  
                                            className="chat-item channel-chat" 
                                            onClick={() => navigate(`/channel/${channel.communicationId}`)}
                                        >
                                            <img 
                                                src={"./src/assets/group.png"} // or use channel.channelProfilePic if you add that in schema
                                                alt="Channel" 
                                                className="profile-pic" 
                                            />
                                            <span>{channel.channelName || "Unnamed Channel"}</span>
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
