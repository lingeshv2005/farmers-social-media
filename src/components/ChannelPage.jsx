import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import "../styles/GroupChat.css"; // Create this CSS file or reuse styles

export default function ChannelPage() {
    const { communicationId } = useParams();
    const [channel, setChannel] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const chatBoxRef = useRef(null);
    const socket = useRef(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchChannel = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/message/channel/${communicationId}`);
                setChannel(response.data);
                setMessages(response.data.messages);
            } catch (error) {
                console.error("Error fetching channel:", error);
            }
        };

        fetchChannel();
    }, [communicationId]);

    useEffect(() => {
        if (!socket.current) {
            socket.current = io("http://localhost:8000");

            socket.current.on("receiveChannelMessage", (msg) => {
                console.log("📩 New channel message received:", msg);

                if (msg.communicationId === communicationId) {
                    setMessages((prevMessages) => [...prevMessages, msg]);
                }

                setTimeout(() => {
                    if (chatBoxRef.current) {
                        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
                    }
                }, 100);
            });

            return () => {
                socket.current.disconnect();
            };
        }
    }, [communicationId]);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            // Check if the user is allowed to send the message (admin-only logic)
            const isAdmin = channel?.adminId === userId;
            if (isAdmin) {
                const newMsg = {
                    communicationId,
                    senderId: userId,
                    content: newMessage,
                    messageType: "text",
                };

                setMessages((prevMessages) => [...prevMessages, newMsg]);

                const response = await axios.post(`http://localhost:8000/api/v1/message/sendmessagetochannel`, newMsg);

                if (socket.current?.connected) {
                    socket.current.emit("sendChannelMessage", response.data.message);
                }

                setNewMessage("");
            } else {
                alert("You are not authorized to send messages in this channel.");
            }
        } catch (error) {
            console.error("🚨 Error sending message:", error.response?.data || error.message);
        }
    };

    return (
        <div className="group-chat-container">
            <div className="group-chat-header">
                <button onClick={() => navigate("/chat")}>⬅</button>
                <span className="group-name">{channel?.channelName}</span>
            </div>

            <div className="group-chat-box" ref={chatBoxRef}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`group-message ${msg.senderId === userId ? "user-message" : "other-message"}`}
                    >
                        <strong>{msg.senderId === userId ? "You" : msg.senderId}:</strong> {msg.content}
                    </div>
                ))}
            </div>

            {/* Input field for all users */}
            <div className="group-input-area">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}
