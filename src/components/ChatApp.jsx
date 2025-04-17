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
    const [chatUserId, setChatUserId] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { communicationId, chatUserId: paramChatUserId } = useParams();
    const userId = localStorage.getItem("userId");

    const { isNewChat } = location.state || {};

    // Fetch chat user and messages (using getMessagesIfExists API if needed)
    useEffect(() => {
        const fetchChatDetails = async () => {
            try {
                if (communicationId) {
                    const res = await axios.get(
                        `http://localhost:8000/api/v1/message/getChatUserByCommunicationId/${communicationId}`
                    );
                    const userDetails = res.data;
                    const otherUserId = userDetails.userId1 === userId ? userDetails.userId2 : userDetails.userId1;
                    setChatUserId(otherUserId);
                    setSelectedChat(userDetails);
                    console.log("Selected chat userDetails:", userDetails); // Log here

                    const messagesRes = await axios.get(`http://localhost:8000/api/v1/message/${communicationId}`);
                    setMessages(messagesRes.data.messages || []);
                } else if (paramChatUserId) {
                    setChatUserId(paramChatUserId);
                    const res = await axios.get(
                        `http://localhost:8000/api/v1/message/getMessagesIfExists/${userId}/${paramChatUserId}`
                    );

                    if (res.data.communicationId) {
                        setSelectedChat({
                            communicationId: res.data.communicationId,
                            userId1: userId,
                            userId2: paramChatUserId,
                        });
                        setMessages(res.data.messages || []);
                    } else {
                        // No previous chat, fetch basic user details for UI
                        const userRes = await axios.get(
                            `http://localhost:8000/api/v1/userdetails/getuserdetails/${paramChatUserId}`
                        );
                        setSelectedChat(userRes.data);
                        console.log("Fetched user details:", userRes.data); // Log here
                        setMessages([]);
                    }
                }
            } catch (err) {
                console.error("Error fetching chat user or messages:", err);
            }
        };

        fetchChatDetails();
    }, [communicationId, paramChatUserId, userId]);

    // Socket setup
    useEffect(() => {
        if (!socket.current) {
            socket.current = io("http://localhost:8000");

            socket.current.on("receiveMessage", (msg) => {
                console.log("📩 New message received:", msg);
                if (msg.communicationId === selectedChat?.communicationId) {
                    setMessages((prevMessages) => [...prevMessages, msg]);
                }
                setTimeout(() => {
                    if (chatBoxRef.current) {
                        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
                    }
                }, 100);
            });

            return () => socket.current.disconnect();
        }
    }, [selectedChat]);

    // Auto-scroll
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    // Send a message
    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            let commId = selectedChat?.communicationId;

            if (isNewChat && !commId && chatUserId) {
                const response = await axios.get(
                    `http://localhost:8000/api/v1/message/getOrCreateCommunicationId/${userId}/${chatUserId}`
                );
                commId = response.data.communicationId;

                await axios.put(
                    `http://localhost:8000/api/v1/userdetails/addcommunicationid/${userId}`,
                    { communicationId: commId }
                );

                setSelectedChat((prev) => ({ ...prev, communicationId: commId }));
            }

            const newMsg = {
                userId1: userId,
                userId2: chatUserId,
                messagedUserId: userId,
                content: newMessage,
                messageType: "text",
                communicationId: commId,
            };

            setMessages((prevMessages) => [...prevMessages, newMsg]); // Optimistic UI update

            // API call to send message
            const response = await axios.post("http://localhost:8000/api/v1/message/create", newMsg);
            setNewMessage(""); // Clear input field after sending
        } catch (error) {
            console.error("🚨 Error sending message:", error);
            // Optionally, handle reverting optimistic UI changes if needed
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <button onClick={() => navigate("/chat")}>⬅</button>
                <img
                    src={selectedChat?.profilePic || "./src/assets/default-profile.png"}
                    alt="Profile"
                    className="profile-pic"
                />
                <span className="username">
                    {selectedChat?.username || "Loading..."} {/* Fix for username display */}
                </span>
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
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}
