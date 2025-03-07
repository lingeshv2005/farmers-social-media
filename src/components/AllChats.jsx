import { useEffect, useState } from "react";
import axios from "axios";
import '../styles/AllChat.css';

export default function AllChats({ userId, openChat }) {
    const [communicationIds, setCommunicationIds] = useState([]);
    const [chatUsers, setChatUsers] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/v1/userdetails/${userId}/communicationids`)
            .then(res => setCommunicationIds(res.data.communicationIds))
            .catch(err => console.error("Error fetching communication IDs:", err));
    }, [userId]);

    useEffect(() => {
        if (communicationIds.length > 0) {
            Promise.all(communicationIds.map(id =>
                axios.get(`http://localhost:8000/api/v1/userdetails/getuserdetails/${userId}`)
            )).then(results => setChatUsers(results.map(r => r.data)));
        }
    }, [communicationIds]);

    return (
        <div className="chat-list-container">
            <h2>Chats</h2>
            {communicationIds.length === 0 ? (
                <div className="get-started">
                    <h3>Welcome to ChatApp</h3>
                    <p>Start chatting by sending a message.</p>
                </div>
            ) : (
                chatUsers.map(user => (
                    <div key={user.userId} className="chat-item" onClick={() => openChat(user)}>
                    <img 
                        src={user.profilePic ? user.profilePic : "./src/assets/shopping-product-3.png"} 
                        alt="Profile" 
                        className="profile-pic" 
                    />
                    <span>{user.username}</span>
                    </div>
                ))
            )}
        </div>
    );
}
