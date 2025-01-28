import React from "react";

import logo from "../assets/farmdoc.svg";
import farming from "../assets/farming.png";

import "../styles/Post.css";

const Post=(()=>{
    const data=[
        {"username":"lingesh","bio":"nice man","time":"5h","postId":1001,"postContent":"So, actually this is more than just okay, it is necessary for us to become exposed to things that at first seem frightening yet then become acclimated to and even embrace. Many things in life that are unknown to us can seem harrowing; however, once we get exposed, we become introduced to new possibilities and sometimes even embrace and rejoice in what previously seemed daunting. At some point, everything that is familiar to us now was once a new experience and exposure. The beauty of life is there is so much more to uncover, and who knows: Maybe what lurks under that next metaphorical box we open will be exactly what we need.","logoURL":"../assets/farming.png","totalLikes":"100","totalComments":"10"},
        {"username":"puvi","bio":"i am very cute","time":"1m","postId":1002,"postContent":"So, actually this is more than just okay, it is necessary for us to become exposed to things that at first seem frightening yet then become acclimated to and even embrace. Many things in life that are unknown to us can seem harrowing; however, once we get exposed, we become introduced to new possibilities and sometimes even embrace and rejoice in what previously seemed daunting. At some point, everything that is familiar to us now was once a new experience and exposure. The beauty of life is there is so much more to uncover, and who knows: Maybe what lurks under that next metaphorical box we open will be exactly what we need.","logoURL":"../assets/farming.png","totalLikes":"1B","totalComments":"20M"},
        {"username":"elava","bio":"thursday's amenity","time":"3yr","postId":1003,"postContent":"So, actually this is more than just okay, it is necessary for us to become exposed to things that at first seem frightening yet then become acclimated to and even embrace. Many things in life that are unknown to us can seem harrowing; however, once we get exposed, we become introduced to new possibilities and sometimes even embrace and rejoice in what previously seemed daunting. At some point, everything that is familiar to us now was once a new experience and exposure. The beauty of life is there is so much more to uncover, and who knows: Maybe what lurks under that next metaphorical box we open will be exactly what we need.","logoURL":"../assets/farming.png","totalLikes":"200k","totalComments":"30k"},
        {"username":"akash","bio":"dont know when to cut the class","time":"1d","postId":1004,"postContent":"So, actually this is more than just okay, it is necessary for us to become exposed to things that at first seem frightening yet then become acclimated to and even embrace. Many things in life that are unknown to us can seem harrowing; however, once we get exposed, we become introduced to new possibilities and sometimes even embrace and rejoice in what previously seemed daunting. At some point, everything that is familiar to us now was once a new experience and exposure. The beauty of life is there is so much more to uncover, and who knows: Maybe what lurks under that next metaphorical box we open will be exactly what we need.","logoURL":"../assets/farming.png","totalLikes":"1M","totalComments":"1k"},
];
    return(
        <>
            {data.map((user,index)=>(
            <div key={index} className="post">
            <div className="header">
                <img src={logo} alt="Profile Logo" className="profile-logo" />
                <div className="username-bio-time">
                    <div className="username">{user.username}</div>
                    <div className="bio">{user.bio}</div>
                    <div className="time">{user.time}</div>
                </div>
            </div>
            <div className="content">{user.postContent}</div>
            <img src={farming} alt="PostImage" className="content-img"/>
            <div className="actions-container1">
                <span>{user.totalLikes} Likes</span>
                <span>{user.totalComments} Comments</span>
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
