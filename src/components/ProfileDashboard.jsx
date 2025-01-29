import img1 from "../assets/shopping-product-1.png";
import img2 from "../assets/shopping-product-2.png";
import img3 from "../assets/shopping-product-3.png";
import img4 from "../assets/shopping-product-4.png";

import { useState } from "react";

import "../styles/ProfileDashboard.css";
import "../styles/Post.css";
import CreatePostBox from "./CreatePostBox";

const ProfileDashboard = ({userDetails={},userPost={}}) => {
  const data = {
    ...userDetails,
    profileBackgroundImage: img1,
    profilePicture: img4,
  };

  const posts = [userPost];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCreatePostBox, setSowCreatePostBox] = useState(false);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      return prevIndex === posts.length - 1 ? 0 : prevIndex + 1;
    });
  };
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      return prevIndex === 0 ? posts.length - 1 : prevIndex - 1;
    });
  };

  return (
    <div className="profile-dashboard">
      <img
        src={data.profileBackgroundImage}
        alt="Background for the profile"
        className="profile-background"
      />
      <img
        src={data.profilePicture}
        alt="User profile"
        className="profile-picture"
      />
      <h1>{data.name}</h1>
      <p>@{data.username}</p>
      <p>{data.bio}</p>
      <p>{data.userType}</p>
      <p>{data.location}</p>
      <p>1M Followers</p>

      <h2>Animal Types</h2>
      <ul>
        {data.animalTypes.map((animal) => (
          <li key={animal._id}>
            {animal.animalName}: {animal.total}
          </li>
        ))}
      </ul>

      <h2>Contact Information</h2>
      <p>Email: {data.email}</p>

      <h2>Social Media</h2>
      <p>
        <a href={data.facebook} target="_blank" rel="noopener noreferrer">
          Facebook
        </a>
      </p>
      <p>
        <a href={data.instagram} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
      </p>
      <p>
        <a href={data.twitter} target="_blank" rel="noopener noreferrer">
          Twitter
        </a>
      </p>
      <p>
        <a href={data.website} target="_blank" rel="noopener noreferrer">
          Website
        </a>
      </p>

      <h2>Account Status</h2>
      <p>Verification Status: {data.verificationStatus? <span className="verified-badge">✔</span> : "Not Verified"}</p>

      <div className="activity-container">
        <h2>Recent Activity</h2>
        <button className="add-new" onClick={()=>setSowCreatePostBox(true)}>New Post</button>
        {showCreatePostBox && <CreatePostBox onClose={()=>setSowCreatePostBox(false)} />}
        <div className="content">
          <div className="header">
            <img
              src={data.profilePicture}
              alt="User profile"
              className="profile-logo"
            />
            <div className="username-bio-time">
              <div className="username">{data.username}</div>
              <div className="bio">{data.bio}</div>
              <div className="time">Just now</div>
            </div>
          </div>
          <div className="content">{posts[currentIndex].post.content}</div>
          <img
            src={img3}
            alt={`Post ${currentIndex + 1}`}
            className="content-img"
          />
          <div className="actions-container1">
            <span>{posts[currentIndex].post.likeCount} Likes</span>
            <span>{posts[currentIndex].post.commentCount} Comments</span>
            <span>{posts[currentIndex].post.repostCount} Reposts</span>
          </div>
        </div>
        <div className="actions-container2">
          <button className="action-btn">👍 Like</button>
          <button className="action-btn">💬 Comment</button>
          <button className="action-btn">🔗 Share</button>
          <button className="action-btn">🔁 Repost</button>
        </div>
        <div className="carousel-buttons">
          <button onClick={handlePrev} className="prev-btn">
            {"<"}
          </button>
          <button onClick={handleNext} className="next-btn">
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
};


export default ProfileDashboard;
