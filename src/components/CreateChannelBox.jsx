import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateChannelBox({ closeModal }) {
    const [channelName, setChannelName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Get the userId from local storage
    const userId = localStorage.getItem("userId");

    // Create Channel
    const handleCreateChannel = async () => {
        if (!channelName.trim()) {
            setError("Channel name is required.");
            return;
        }
    
        if (!userId) {
            setError("User not logged in.");
            return;
        }
    
        setLoading(true);
        setError(null);
    
        try {
            // Step 1: Create the channel
            const response = await axios.post("http://localhost:8000/api/v1/message/createchannel", {
                channelName,
                adminId: userId,
            });
    
            const { communicationId } = response.data.channel;
    
            // Step 2: Add this communicationId to user's channelCommunicationIds
            await axios.put(`http://localhost:8000/api/v1/userdetails/addchannelcommunicationid/${userId}`, {
                communicationId
            });
    
            // Step 3: Navigate to the channel page
            navigate(`/channel/${communicationId}`);
            closeModal();
    
        } catch (err) {
            console.error("Error creating or updating channel communication ID:", err);
            setError("Failed to create the channel.");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="create-group-modal">
            <div className="modal-content">
                <h3>Create Channel</h3>
                <input
                    type="text"
                    placeholder="Channel Name"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    className="group-name-input"
                />

                {error && <p className="error-message">{error}</p>}

                {/* Action Buttons */}
                <div className="modal-actions">
                    <button onClick={handleCreateChannel} disabled={loading}>
                        {loading ? "Creating..." : "Create Channel"}
                    </button>
                    <button onClick={closeModal}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
