import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ProfileDashboard.css";
import "../styles/Post.css";
import CreatePostBox from "./CreatePostBox";
import UpdateProfile from "./UpdateProfileDetails";

const ProfileDashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCreatePostBox, setShowCreatePostBox] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("❌ No userId found in localStorage!");
          return;
        }
  
        console.log("🔍 Fetching data for userId:", userId);
  
        const [userResponse, postResponse] = await Promise.all([
          axios.get(`http://localhost:8000/api/v1/userdetails/getuserdetails/${userId}`),
          axios.get(`http://localhost:8000/api/v1/posts/getpost/user/${userId}`)
        ]);
  
        console.log("✅ User Details Fetched:", userResponse.data);
        console.log("✅ User Posts Fetched:", postResponse.data.posts);
  
        setUserDetails(userResponse.data || {});
        setUserPosts(postResponse.data.posts || []);
      } catch (err) {
        console.error("❌ Failed to load data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % userPosts.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? userPosts.length - 1 : prevIndex - 1));
  };

  return (
    <div className="profile-dashboard">
      {/* Profile Background */}
      <img
        src={userDetails.profileBackgroundImage || "./src/assets/shopping-product-4.png"}
        alt="Background"
        className="profile-background"
      />

      {/* Profile Picture */}
      <img
        src={userDetails.profilePicture ? `http://localhost:8000${userDetails.profilePicture}` : "./src/assets/farmdoc.svg"}
        alt="Profile"
        className="profile-picture"
      />

      {/* Profile Header */}
      <div className="profile-header">
        <h1>{userDetails.name || "No Name"}</h1>
        {userDetails.verificationStatus && <span className="verified-badge">✔</span>}
        <button className="edit-btn" onClick={() => setShowUpdateDialog(true)}>✏️</button>
      </div>

      {/* Edit Dialog */}
      {showUpdateDialog && (
        <div className="dialog-overlay" onClick={() => setShowUpdateDialog(false)}>
          <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
            <UpdateProfile userId={userDetails.userId} onClose={() => setShowUpdateDialog(false)} />
          </div>
        </div>
      )}

      {/* Username */}
      <p>@{userDetails.username || "No Username"}</p>

      {/* Bio */}
      <p>{userDetails.bio || "No bio available"}</p>

      {/* User Type */}
      <p>Role: {userDetails.userType || "Unknown"}</p>

      {/* Location */}
      <p>📍 {userDetails.location || "No location provided"}</p>

      {/* Followers Count */}
      <p>{userDetails.followers || 0} Followers</p>

      {/* Social Links */}
      <div className="social-links">
        <p>🌐 Website: {userDetails.website || "No website"}</p>
        <p>📘 Facebook: {userDetails.facebook || "Not linked"}</p>
        <p>📸 Instagram: {userDetails.instagram || "Not linked"}</p>
        <p>🐦 Twitter: {userDetails.twitter || "Not linked"}</p>
        <p>📲 WhatsApp: {userDetails.whatsapp || "Not linked"}</p>
      </div>

      {/* Recent Activity */}
      <div className="activity-container">
        <div className="activity-header">
          <h2>Recent Activity</h2>
          <button className="add-post-btn" onClick={() => setShowCreatePostBox(true)}>+</button>
        </div>

        {userPosts.length > 0 ? (
          <div className="post">
            <div className="content">{userPosts[currentIndex]?.content || "No content"}</div>

            {userPosts[currentIndex]?.images && (
              <img
                src={`http://localhost:8000${userPosts[currentIndex]?.images}`}
                alt="User Post"
                className="content-img"
              />
            )}

            <div className="carousel-buttons">
              <button onClick={handlePrev} className="prev-btn">◀</button>
              <button onClick={handleNext} className="next-btn">▶</button>
            </div>
          </div>
        ) : (
          <p>No posts yet!</p>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreatePostBox && <CreatePostBox userDetails={userDetails} onClose={() => setShowCreatePostBox(false)} />}
    </div>
  );
};

export default ProfileDashboard;
