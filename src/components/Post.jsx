import React from "react";

import logo from "../assets/farmdoc.svg";
import farming from "../assets/farming.png";

import "../styles/Post.css";

const Post=(({posts=[],userDetails={}})=>{
    const data=posts.posts;
    console.log(posts);
    console.log(userDetails);
    return(
        <>
            {data.map((post,index)=>(
            <div key={index} className="post">
            <div className="header">
                <img src={logo} alt="Profile Logo" className="profile-logo" />
                <div className="username-bio-time">
                    <div className="username">{userDetails.username}</div>
                    <div className="bio">{userDetails.bio}</div>
                    <div className="time">{post.createdAt}</div>
                </div>
            </div>
            <div className="content">{post.content}</div>
            <div className="content">{post.tags}</div>
            <div className="content">PostType: {post.postType}</div>
            <img src={farming} alt="PostImage" className="content-img"/>
            <div className="actions-container1">
                <span>{post.likeCount} Likes</span>
                <span>{post.commentCount} Comments</span>
                <span>{post.repostCount} Reposts</span>
            </div>
            <div className="actions-container2">
                <button className="action-btn">👍 Like</button>
                <button className="action-btn">💬 Comment</button>
                <button className="action-btn">🔗 Share</button>
                <button className="action-btn">🔁 Repost</button>
            </div>
            </div> 
            ))}
        </>
    );
});

export default Post;
