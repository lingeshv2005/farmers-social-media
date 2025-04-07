import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../styles/ChatApp.css";

export default function ChatApp() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [selectedChat, setSelectedChat] = useState(null);
    const chatBoxRef = useRef(null);
    const socket = useRef(null);
    const [chatUserId,setChatUserId] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const userId = localStorage.getItem("userId");

    const { isNewChat, communicationId: existingCommId } = location.state || {};

    useEffect(() => {
        const fetchChatUserDetails = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/v1/userdetails/getuserdetails/${chatUserId}`);
                const userDetails = res.data;

                // console.log(userDetails);
                if (!isNewChat) {
                    userDetails.communicationId = existingCommId;
                }

                setSelectedChat(userDetails);
            } catch (err) {
                console.error("Error fetching chat user details:", err);
            }
        };

        fetchChatUserDetails();
    }, [chatUserId, isNewChat, existingCommId]);

    useEffect(() => {
        if (!socket.current) {
            socket.current = io("http://localhost:8000");
    
            socket.current.on("receiveMessage", (msg) => {
                console.log("📩 New message received:", msg);
    
                setMessages((prevMessages) => {
                    if (msg.communicationId === selectedChat?.communicationId) {
                        return [...prevMessages, msg];
                    }
                    return prevMessages;
                });
    
                setTimeout(() => {
                    if (chatBoxRef.current) {
                        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
                    }
                }, 100); // ✅ Small delay to ensure message is rendered before scrolling
            });
    
            return () => {
                socket.current.disconnect();
            };
        }
    }, [selectedChat]); // ✅ Ensures listener updates when chat changes
    
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]); // ✅ Triggers auto-scroll when messages update
    
    useEffect(() => {
        if (selectedChat?.communicationId) {
            axios.get(`http://localhost:8000/api/v1/message/${selectedChat.communicationId}`)
                .then(response => {
                    setMessages(response.data.messages || []);
                    setChatUserId(response.data.userId1===userId?response.data.userId2:response.data.userId1);
                    // console.log(messages);
                    // console.log("user",response.data);
                })
                .catch(error => console.error("Error fetching messages:", error));
        }
    }, [selectedChat]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
    
        try {
            let commId = selectedChat?.communicationId;
    
            if (isNewChat && !commId) {
                const response = await axios.get(
                    `http://localhost:8000/api/v1/message/getOrCreateCommunicationId/${userId}/${chatUserId}`
                );
                commId = response.data.communicationId;
    
                console.log("New communicationId:", commId);
    
                // Update userDetails with the communicationId
                const response1=await axios.put(`http://localhost:8000/api/v1/userdetails/addcommunicationid/${userId}`, {
                    communicationId: commId
                });
    
                console.log(response1);
                setSelectedChat(prev => ({ ...prev, communicationId: commId }));
            }

            const newMsg = {
                userId1: userId,
                userId2: chatUserId,
                messagedUserId: userId,
                content: newMessage,
                messageType: "text",
                communicationId: commId,
            };
    
            setMessages((prevMessages) => [...prevMessages, newMsg]); // ✅ Instant UI update before API call
    
            const response = await axios.post("http://localhost:8000/api/v1/message/create", newMsg);
    
            if (socket.current?.connected) {
                socket.current.emit("sendMessage", response.data.chat.messages.slice(-1)[0]);
            }
    
            setNewMessage("");
        } catch (error) {
            console.error("🚨 Error sending message:", error.response?.data || error.message);
        }
    };
        
    return (
        <div className="chat-container">
            <div className="chat-header">
                <button onClick={() => navigate("/chat")}>⬅</button>
                <img src={selectedChat?.profilePic || "./src/assets/default-profile.png"} alt="Profile" className="profile-pic" />
                <span className="username">{selectedChat?.username}</span>
            </div>
            <div className="chat-box" ref={chatBoxRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.messagedUserId === userId ? "user-message" : "other-message"}`}>
                        {msg.content}
                    </div>
                ))}
            </div>
            <div className="input-area">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}
