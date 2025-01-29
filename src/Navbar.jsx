import React, { useState, useEffect } from 'react';
import axios from "axios";
import { BrowserRouter , Routes, Route, Link, useParams } from "react-router-dom";

import logo from "../src/assets/farmdoc.svg";

import Post from "./components/Post";
import ProfileDashboard from "./components/ProfileDashboard";



const Navbar= ()=>{
    const [userDetails, setUserDetails] =useState(null);
    const [userPost, setUserPost] =useState(null);
    const [loading, setLoading] =useState(true);

    useEffect(()=>{
        const fetchUserData =async ()=>{
            try{
                const response=await axios.get("https://farmers-social-media-backend.onrender.com/api/getuserdetails/e280e321-6a19-4f76-900e-92345ae1c6e9"); 
                console.log(response.data);
                setUserDetails(response.data);
                setLoading(false);
            }catch(err){
                console.log(err);
                setLoading(false);
            }
        };
        const fetchPost =async ()=>{
            try{
                const response=await axios.get("https://farmers-social-media-backend.onrender.com/api/getpost/3701d9c1-f52f-4326-bdb2-566f33356b6e"); 
                console.log(response.data);
                setUserPost(response.data);
                setLoading(false);
            }catch(err){
                console.log(err);
                setLoading(false);
            }
        };
        fetchPost();
        fetchUserData();
    },[]);

    if(loading) return <div>Loading...</div>

        return(
            <BrowserRouter>
                <nav className="nav-bar">
                    <img src={logo} alt="Farmdoc Logo" className="navbar-logo"/>
                    <span>FarmDoc</span>
                    <div className="nav-links">
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/health-posts">Health Posts</Link></li>
                            <li><Link to="/profile-dashboard">Profile</Link></li>
                            <li><Link to="/farm-updates">Farm Updates</Link></li>
                            <li><Link to="/community">Community</Link></li>
                            <li><Link to="/marketplace">Marketplace</Link></li>
                            <li><Link to="/events">Events</Link></li>
                            <li><Link to="/notifications">Notifications</Link></li>
                        </ul>
                    </div>
                </nav>
                <Routes>
                    <Route path="/" element={<Post />} />
                    <Route path="/profile-dashboard" element={<ProfileDashboard userDetails={userDetails} userPost={userPost}/>} />
                    {/* <Route path="/health-posts" element={<HealthPost userDetails={userDetails}/>} />
                    <Route path="/farm-updates" element={<FarmUpdates userDetails={userDetails}/>} /> */}
                </Routes>
            </BrowserRouter>
    );
}

// layout route
// main layout
// outlet
// query params


export default Navbar;