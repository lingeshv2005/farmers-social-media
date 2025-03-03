import React, { useState, useEffect } from 'react';
import axios from "axios";

import logo from "../assets/farmdoc.svg";
import farming from "../assets/farming.png";

import "../styles/Post.css";

const Post=(()=>{    

    const [userDetailsMap, setUserDetailsMap] =useState(null);
    const [posts, setPosts] =useState(null);
    const [loading, setLoading] =useState(false);
    const [commentInputs, setCommentInputs] = useState({});
    const [expandedComments, setExpandedComments] = useState({});

    useEffect(()=>{ 

        const fetchData =async ()=>{
                try{
                    setLoading(true);

                    // // const data = localStorage.getItem("userId");
                    // const userDataResponse=await axios.get(`https://farmers-social-media-backend.onrender.com/api/getuserdetails/${data}`); 
                    // console.log(userDataResponse.data);
                    // setUserDetails(userDataResponse.data);

                    const postsResponse=await axios.get("http://localhost:8000/api/v1/posts/getposts"); 
                    console.log(postsResponse.data.posts);
                    setPosts(postsResponse.data.posts);

                    const uniqueUserIds=[...new Set(postsResponse.data.posts.map(post => post.userId))];
                    const userDetailsPromisis=uniqueUserIds.map(userId =>
                        axios.get(`http://localhost:8000/api/v1/userdetails/getuserdetails/${userId}`)
                    )

                    const userDetailsResponses=await Promise.all(userDetailsPromisis);
                    const userDetailsData=userDetailsResponses.reduce((acc,response)=>{
                        acc[response.data.userId]=response.data;
                        return acc;
                    }, {}); 

                    setUserDetailsMap(userDetailsData);
                }catch(err){
                    console.log(err);
                }finally{
                    setLoading(false);
                }
            }
            fetchData();
        },[]);


        const handleComment = async (postId) => {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                alert("Please log in to comment.");
                return;
            }

            const content = commentInputs[postId] || "";
            if (!content.trim()) {
                alert("Comment cannot be empty.");
                return;
            }
            try {
                const response = await axios.post(
                    `http://localhost:8000/api/v1/comments/comment/${postId}`,
                    { commentedUserId: userId, content }
                );
                setPosts((prevPosts) => {
                    return prevPosts.map((post) =>
                        post.postId === postId
                            ? { 
                                ...post, 
                                comments: response.data.post.comments,
                                commentCount: response.data.post.comments.length // Update count
                            }
                            : post
                    );
                });
                setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
            } catch (error) {
                console.error("Error adding comment:", error);
                alert("Failed to add comment. Please try again.");
            }
        };


        const handleToggleComments = async(postId) => {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                alert("Please log in to comment.");
                return;
            }
            setExpandedComments((prev) => ({
                ...prev,
                [postId]: !prev[postId],
            }));

            if(!expandedComments[postId]){
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/v1/comments/getcomment/${postId}`,
                );
                console.log(response.data);
                setPosts((prevPosts) => {
                    return prevPosts.map((post) =>
                        post.postId === postId
                            ? { 
                                ...post, 
                                comments: response.data.comments || [],
                                commentCount: response.data.comments.length || 0
                            }
                            : post
                    );
                });
            } catch (error) {
                console.error("Error reterving comment:", error);
                alert("Failed to get comment. Please try again.");
            }
        }
        };

        const handleLike = async (postId, index) => {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                alert("Please log in to like posts.");
                return;
            }    
            try {
                await axios.put(`http://localhost:8000/api/v1/posts/addlike/${postId}`, {
                    likeUserId: userId
                });
                setPosts((prevPosts) => {
                    const updatedPosts = [...prevPosts];
                    const updatedPost = { ...updatedPosts[index] };

                    if (!updatedPost.likeUsers.includes(userId)) {
                        updatedPost.likeUsers = [...updatedPost.likeUsers, userId];
                        updatedPost.likeCount = (updatedPost.likeCount || 0) + 1;
                    }

                    updatedPosts[index] = updatedPost;
                    return updatedPosts;
                });
            } catch (error) {
                console.error("Error liking post:", error);
                alert("Failed to like the post. Please try again.");
            }
        };
    
        if (loading) return <div>Loading...</div>;
        if (!posts) return <div>Error fetching posts. Please try again later.</div>;
        if (posts.length===0) return <div>No posts available.</div>;
    
    // const data=posts.posts;

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
      };
      
    return(
        <>
            {posts.map((post,index)=>{
            const userDetails = userDetailsMap[post.userId];

            if (!userDetails) return <div key={index}>Loading user details...</div>;

            return(
                <div key={index} className="post">
                <div className="header">
                    <img src={logo} alt="Profile Logo" className="profile-logo" />
                    <div className="username-bio-time">
                        <div className="username">{userDetails.username}</div>
                        <div className="bio">{userDetails.bio}</div>
                        <div className="time">{formatDate(post.createdAt)}</div>
                        </div>
                    <button className='follow-btn'>Follow</button>
                </div>
                <div className="content">{post.content}</div>
                <div className="content">
                    <div className="content-tags">
                    {post.tags && post.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                    ))}
                    </div>
                </div>
                <div className="content">PostType: {post.postType}</div>
                <img src={farming} alt="PostImage" className="content-img"/>
                <div className="actions-container1">
                    <span>{post.likeCount || 0} Likes</span>
                    <span>{post.commentCount || 0} Comments</span>
                    <span>{post.repostCount || 0} Reposts</span>
                </div>
                <div className="actions-container2">
                    <button 
                        className="action-btn" 
                        style={{ backgroundColor: post.likeUsers?.includes(localStorage.getItem("userId")) ? 'lightgreen' : 'transparent' }} 
                        onClick={() => handleLike(post.postId, index)}>
                        👍 Like
                    </button>
                    <button className="action-btn" onClick={() => handleToggleComments(post.postId)}>
                        💬 Comment
                    </button>
                    <button className="action-btn">🔗 Share</button>
                    <button className="action-btn">🔁 Repost</button>
                </div>
                {expandedComments[post.postId] && (
                    <div className="comments-section">
                        <input
                            type="text"
                            className="comment-input"
                            placeholder="Write a comment..."
                            value={commentInputs[post.postId] || ""}
                            onChange={(e) =>
                                setCommentInputs((prev) => ({
                                    ...prev,
                                    [post.postId]: e.target.value,
                                }))
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleComment(post.postId);
                                }
                            }}
                        
                        />
                    <div className="comments-list">
                        {post.comments && post.comments.length > 0 ? (
                            post.comments.map((comment, idx) => {
                                const user = userDetailsMap[comment.commentedUserId];
                                return (
                                    <div key={idx} className="comment">
                                        <strong>{user ? user.username : 'Unknown User'}</strong>: {comment.content}
                                    </div>
                                );
                            })
                        ) : (
                            <div>No comments yet.</div>
                        )}
                    </div>
                    </div>
                    )}
                </div> 
            );
            })}
        </>
    );
});

export default Post;
