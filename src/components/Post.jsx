import React from "react";
import logo from "../assets/farmdoc.svg";
import farming from "../assets/farming.png";

const Post=()=>{
    const data=[
        {"username":"lingesh","bio":"nice man","time":"5h"},
        {"username":"puvi","bio":"i am very cute","time":"1m"},
        {"username":"elava","bio":"thursday's amenity","time":"3yr"},
        {"username":"akash","bio":"dont know when to cut the class","time":"1d"},
    ];
    return(
        <>
            <div className="post">
            <div className="header">
                <img src={logo} alt="Profile Logo" className="profile-logo" />
                <div className="username-bio-time">
                    <div className="username">Username</div>
                    <div className="bio">Bio</div>
                    <div className="time">5h</div>
                </div>
            </div>
            <div className="content">
                So, actually this is more than just okay, it is necessary for us to become exposed to things that at first seem frightening yet then become acclimated to and even embrace.
                Many things in life that are unknown to us can seem harrowing; however, once we get exposed, we become introduced to new possibilities and sometimes even embrace and rejoice in what previously seemed daunting.
                At some point, everything that is familiar to us now was once a new experience and exposure.
                The beauty of life is there is so much more to uncover, and who knows:
                Maybe what lurks under that next metaphorical box we open will be exactly what we need.
            </div>
            <img src={farming} alt="IMAGE" className="content-img"/>
            <div className="actions-container1">
                <span>10 Likes</span>
                <span>5 Comments</span>
            </div>

            <div class="actions-container2">
                <button class="action-btn">👍 Like</button>
                <button class="action-btn">💬 Comment</button>
                <button class="action-btn">🔗 Share</button>
            </div>
            </div> 
        </>
    );
};

export default Post;