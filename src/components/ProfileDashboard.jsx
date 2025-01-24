import img1 from "../assets/shopping-product-1.png";
import img2 from "../assets/shopping-product-2.png";
import img3 from "../assets/shopping-product-3.png";
import img4 from "../assets/shopping-product-4.png";

import { useState } from "react";

import "../styles/ProfileDashboard.css";
import "../styles/Post.css";

const ProfileDashboard = () => {
  const data = {
    profileBackgroundImage: img1,
    profilePicture: img4,
    username: "johnDoe",
    bio: "I am a Farmer",
    userType: "farmer",
    location: "Nigeria",
    followers: "1M",
  };

  const posts = [
    {
      postId: "1001",
      postContent: "🌟 Consistency in problem-solving!",
      imageURL: img2,
      totalLikes: "10k",
      totalComments: "50",
    },
    {
      postId: "1002",
      postContent: "💻 Tackled 250+ problems on LeetCode!",
      imageURL: img3,
      totalLikes: "12k",
      totalComments: "60",
    },
    {
      postId: "1003",
      postContent: "📚 Explored 60+ problems on GeeksforGeeks.",
      imageURL: img4,
      totalLikes: "15k",
      totalComments: "80",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

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
      <h1>{data.username}</h1>
      <p>{data.bio}</p>
      <p>{data.userType}</p>
      <p>{data.location}</p>
      <p>{data.followers} Followers</p>

      <div className="activity-container">
        <h2>Recent Activity</h2>
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
          <div className="content">{posts[currentIndex].postContent}</div>
          <img
            src={posts[currentIndex].imageURL}
            alt={`Post ${currentIndex + 1}`}
            className="content-img"
          />
          <div className="actions-container1">
            <span>{posts[currentIndex].totalLikes} Likes</span>
            <span>{posts[currentIndex].totalComments} Comments</span>
          </div>
        </div>
        <div className="actions-container2">
          <button className="action-btn">👍 Like</button>
          <button className="action-btn">💬 Comment</button>
          <button className="action-btn">🔗 Share</button>
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
