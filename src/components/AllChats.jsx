import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/AllChat.css';

export default function AllChats() {
    const [communicationIds, setCommunicationIds] = useState([]);
    const [chatUsers, setChatUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState(""); // ✅ Search state
    const [searchResults, setSearchResults] = useState([]); // ✅ Store searched users

    // Get userId from localStorage
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchCommunicationIds = async () => {
            if (!userId) {
                setError("User ID not found. Please log in again.");
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(`http://localhost:8000/api/v1/userdetails/${userId}/communicationids`);
                setCommunicationIds(res.data.communicationIds || []);
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
                        return res.data;
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

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (!query) {
            setSearchResults([]); // Clear results if input is empty
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
            {/* ✅ Search Bar */}
            <input 
                type="text" 
                placeholder="Search users..." 
                value={searchQuery} 
                onChange={handleSearch} 
                className="search-input"
            />

            {/* ✅ Show search results */}
            {searchResults.length > 0 && (
                <div className="search-results">
                    {searchResults.map((user) => (
                        <div key={user.userId} className="chat-item" onClick={() => navigate(`/chat/${user.userId}`)}>
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
            ) : communicationIds.length === 0 ? (
                <div className="get-started">
                    <h3>Welcome to ChatApp</h3>
                    <p>Start chatting by sending a message.</p>
                </div>
            ) : (
                chatUsers.map((user, index) => (
                    <div key={user.userId || `chat-${index}`} className="chat-item" onClick={() => navigate(`/chat/${user.userId}`)}>
                        <img 
                            src={user.profilePic || "./src/assets/default-profile.png"} 
                            alt="Profile" 
                            className="profile-pic" 
                        />
                        <span>{user.username}</span>
                        <span>{user.userId}</span>
                    </div>
                ))
            )}
        </div>
    );
}
