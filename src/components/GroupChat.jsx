import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import "../styles/GroupChat.css";

export default function GroupChat() {
    const { communicationId } = useParams();
    const [group, setGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const chatBoxRef = useRef(null);
    const socket = useRef(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchGroupChat = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/v1/message/group-chat/${communicationId}`);
                setGroup(res.data);
                setMessages(res.data.messages);
            } catch (error) {
                console.error("Error fetching group chat:", error);
            }
        };

        fetchGroupChat();
    }, [communicationId]);

    useEffect(() => {
        if (!socket.current) {
            socket.current = io("http://localhost:8000");

            socket.current.on("receiveGroupMessage", (msg) => {
                console.log("📩 New group message received:", msg);

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
            const newMsg = {
                communicationId,
                senderId: userId,
                content: newMessage,
                messageType: "text",
            };

            setMessages((prevMessages) => [...prevMessages, newMsg]);

            const response = await axios.post(`http://localhost:8000/api/v1/message/sendmessagetogroup`, newMsg);

            if (socket.current?.connected) {
                socket.current.emit("sendGroupMessage", response.data.message);
            }

            setNewMessage("");
        } catch (error) {
            console.error("🚨 Error sending message:", error.response?.data || error.message);
        }
    };

    return (
        <div className="group-chat-container">
            <div className="group-chat-header">
                <button onClick={() => navigate("/chat")}>⬅</button>
                <span className="group-name">{group?.groupName}</span>
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
