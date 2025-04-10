import img1 from "../assets/shopping-product-1.png";
import img2 from "../assets/shopping-product-2.png";
import img3 from "../assets/shopping-product-3.png";
import img4 from "../assets/shopping-product-4.png";

import { useState, useEffect } from "react";
import axios from "axios";

import "../styles/ProfileDashboard.css";
import "../styles/Post.css";
import CreatePostBox from "./CreatePostBox";

const ProfileDashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [userPostById, setUserPostById] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCreatePostBox, setShowCreatePostBox] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = localStorage.getItem("userId");

        const userDataResponse = await axios.get(
          `http://localhost:8000/api/v1/userdetails/getuserdetails/${data}`
        );
        setUserDetails(userDataResponse.data);

        const userPostsResponse = await axios.get(
          `http://localhost:8000/api/v1/posts/getpost/user/${data}`
        );
        setUserPostById(userPostsResponse.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !userDetails || !userPostById) {
    return <div>Loading...</div>;
  }

  const posts = userPostById.posts;
  const data = {
    ...userDetails,
    profileBackgroundImage: img1,
    profilePicture: img4,
  };

  const handleNext = () => {
    if (posts.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex === posts.length - 1 ? 0 : prevIndex + 1));
  };

  const handlePrev = () => {
    if (posts.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? posts.length - 1 : prevIndex - 1));
  };

  return (
    <div className="profile-dashboard">
      <img src={data.profileBackgroundImage} alt="Background" className="profile-background" />
      <img src={data.profilePicture} alt="User profile" className="profile-picture" />

      <h1>
        {data.name}
        {data.verificationStatus && <span className="verified-badge">✔</span>}
      </h1>

      <button className="add-new" onClick={() => setShowUpdateDialog(true)}> / </button>
      <p>@{data.username}</p>
      <p>{data.bio}</p>
      <p>{data.userType}</p>
      <p>{data.location}</p>
      <p>1M Followers</p>

      {data.animalTypes && data.animalTypes.length > 0 && (
        <>
          <h2>Animal Types</h2>
          <ul>
            {data.animalTypes.map((animal) => (
              <li key={animal._id}>
                {animal.animalName}: {animal.total}
              </li>
            ))}
          </ul>
        </>
      )}

      {(data.email || data.phone) && (
        <>
          <h2>Contact Information</h2>
          {data.email && <p>Email: {data.email}</p>}
          {data.phone && <p>Phone: {data.phone}</p>}
        </>
      )}

      {(data.facebook || data.instagram || data.twitter || data.website) && (
        <>
          <h2>Social Media</h2>
          {data.facebook && (
            <p>
              <a href={data.facebook} target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            </p>
          )}
          {data.instagram && (
            <p>
              <a href={data.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </p>
          )}
          {data.twitter && (
            <p>
              <a href={data.twitter} target="_blank" rel="noopener noreferrer">
                Twitter
              </a>
            </p>
          )}
          {data.website && (
            <p>
              <a href={data.website} target="_blank" rel="noopener noreferrer">
                Website
              </a>
            </p>
          )}
        </>
      )}

      <div className="activity-container">
        <div className="activity-header">
          <h2>Recent Activity</h2>
          <button className="add-new" onClick={() => setShowCreatePostBox(true)}>
            +
          </button>
        </div>
        {posts.length > 0 ? (
          <div className="post">
            <div className="header">
              <img src={data.profilePicture} alt="User profile" className="profile-logo" />
              <div className="username-bio-time">
                <div className="username">
                  {data.username}
                  {data.verificationStatus && <span className="verified-badge">✔</span>}
                </div>
                <div className="bio">{data.bio}</div>
                <div className="time">Posted {new Date(posts[0].createdAt).toLocaleString()}</div>
              </div>
            </div>
            <div className="content">{posts[currentIndex].content}</div>
            <div className="content-tags">
              {posts[currentIndex]?.tags &&
                posts[currentIndex]?.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
            </div>
            <div className="content">Post Type: {posts[currentIndex]?.postType}</div>
            <img src={img3} alt={`Post ${currentIndex + 1}`} className="content-img" />

            <div className="actions-container1">
              <span>{posts[currentIndex]?.likeCount} Likes</span>
              <span>{posts[currentIndex]?.commentCount} Comments</span>
              <span>{posts[currentIndex]?.repostCount} Reposts</span>
            </div>
            <div className="carousel-buttons">
              <button onClick={handlePrev} className="prev-btn">
                <i className="fas fa-chevron-left"></i>
              </button>
              <button onClick={handleNext} className="next-btn">
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
            <div className="actions-container2">
              <button className="action-btn">👍 Like</button>
              <button className="action-btn">💬 Comment</button>
              <button className="action-btn">🔗 Share</button>
              <button className="action-btn">🔁 Repost</button>
            </div>
          </div>
        ) : (
          <p>No posts yet!</p>
        )}
        {showCreatePostBox && <CreatePostBox userDetails={userDetails} onClose={() => setShowCreatePostBox(false)} />}
        {showUpdateDialog && (
  <div className="update-dialog">
    <h2>Update Profile</h2>
    {/* Add form inputs for updating user details */}
    <button onClick={() => setShowUpdateDialog(false)}>Cancel</button>
    <button onClick={handleUpdate}>Update</button>
  </div>
)}

      </div>
    </div>
  );
};

export default ProfileDashboard;
