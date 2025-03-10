import { useState } from "react";
import axios from "axios";

export default function CreateGroupBox({ userId, closeModal }) {
    const [groupName, setGroupName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Search Users
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

    // Add Participant
    const addParticipant = (user) => {
        if (!selectedUsers.some((u) => u.userId === user.userId)) {
            setSelectedUsers((prev) => [...prev, user]);
        }
    };

    // Remove Participant
    const removeParticipant = (userId) => {
        setSelectedUsers((prev) => prev.filter((user) => user.userId !== userId));
    };

    // Create Group Chat
    const handleCreateGroup = async () => {
        if (!groupName.trim()) {
            setError("Group name is required.");
            return;
        }
        if (selectedUsers.length === 0) {
            setError("At least one participant is required.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const participants = selectedUsers.map((user) => user.userId);
            const response = await axios.post("http://localhost:8000/api/v1/message/creategroup", {
                groupName,
                adminId: userId,
                participants,
            });

            const { communicationId } = response.data.group;

            // Update user details for admin and participants
            await Promise.all([
                axios.put(`http://localhost:8000/api/v1/userdetails/addgroupcommunicationid/${userId}`, { communicationId }),
                ...participants.map((participantId) =>
                    axios.put(`http://localhost:8000/api/v1/userdetails/addgroupcommunicationid/${participantId}`, { communicationId })
                ),
            ]);

            alert("Group created successfully!");
            closeModal();
        } catch (err) {
            console.error("Error creating group:", err);
            setError("Failed to create the group.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-group-modal">
            <div className="modal-content">
                <h3>Create Group</h3>
                <input
                    type="text"
                    placeholder="Group Name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="group-name-input"
                />
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="search-input"
                />

                {/* Search Results */}
                <div className="search-results">
                    {searchResults.map((user) => (
                        <div key={user.userId} className="search-item" onClick={() => addParticipant(user)}>
                            <img src={user.profilePic || "./src/assets/default-profile.png"} alt="Profile" className="profile-pic" />
                            <span>{user.username}</span>
                        </div>
                    ))}
                </div>

                {/* Selected Users */}
                {selectedUsers.length > 0 && (
                    <div className="selected-users">
                        {selectedUsers.map((user) => (
                            <div key={user.userId} className="selected-user">
                                <span>{user.username}</span>
                                <button onClick={() => removeParticipant(user.userId)}>❌</button>
                            </div>
                        ))}
                    </div>
                )}

                {error && <p className="error-message">{error}</p>}

                {/* Action Buttons */}
                <div className="modal-actions">
                    <button onClick={handleCreateGroup} disabled={loading}>
                        {loading ? "Creating..." : "Create Group"}
                    </button>
                    <button onClick={closeModal}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
