import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "../styles/ChatApp.css"

export default function ChatApp({ selectedChat, userId, closeChat }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const chatBoxRef = useRef(null);
    const socket = useRef(null);

    useEffect(() => {
        socket.current = io("http://localhost:8000");

        socket.current.on("receiveMessage", (msg) => {
            if (msg.communicationId === selectedChat.communicationId) {
                setMessages((prevMessages) => [...prevMessages, msg]);
            }
        });

        return () => {
            socket.current.disconnect();
        };
    }, [selectedChat]);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/v1/message/${selectedChat.communicationId}`)
            .then(response => setMessages(response.data.messages || []))
            .catch(error => console.error("Error fetching messages:", error));
    }, [selectedChat]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
    
        const newMsg = {
            userId1: userId,
            userId2: selectedChat.userId,
            messagedUserId: userId,
            content: newMessage,
            messageType: "text",
            communicationId: selectedChat.communicationId
        };
    
        try {
            const response = await axios.post("http://localhost:8000/api/v1/message/create", newMsg);
            socket.current.emit("sendMessage", response.data.chat.messages.slice(-1)[0]);
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="chat-container">
            <div className="chat-header">
                <button className="back-button" onClick={closeChat}>⬅</button>
                <img src={selectedChat.profilePic ? user.profilePic : "./src/assets/shopping-product-3.png"} alt="Profile" className="profile-pic" />
                <span className="username">{selectedChat.username}</span>
            </div>
            
            <div className="chat-box" ref={chatBoxRef}>
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`message ${msg.messagedUserId === userId ? "user-message" : "other-message"}`}
                    >
                        {msg.content}
                    </div>
                ))}
            </div>

            <div className="input-area">
                <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Type a message..." 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage} className="send-button">Send</button>
            </div>
        </div>
    );
}
