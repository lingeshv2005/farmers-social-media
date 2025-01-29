import React, { useState, useEffect, useDebugValue } from 'react';
import axios from "axios";
import { BrowserRouter , Routes, Route, Link, useParams } from "react-router-dom";

import logo from "../src/assets/farmdoc.svg";

import Post from "./components/Post";
import ProfileDashboard from "./components/ProfileDashboard";



const Navbar= ()=>{
    const [userDetails, setUserDetails] =useState(null);
    const [posts, setPosts] =useState(null);
    const [userPostById, setUserPostById] =useState(null);
    const [loading, setLoading] =useState(true);

    useEffect(()=>{
        const fetchData =async ()=>{
            try{
                const userDataResponse=await axios.get("https://farmers-social-media-backend.onrender.com/api/getuserdetails/e280e321-6a19-4f76-900e-92345ae1c6e9"); 
                console.log(userDataResponse.data);
                setUserDetails(userDataResponse.data);

                const postsResponse=await axios.get("http://localhost:3001/api/getposts"); 
                console.log(postsResponse.data);
                setPosts(postsResponse.data);

                const userPostsResponse=await axios.get("http://localhost:3001/api/getpost/user/e280e321-6a19-4f76-900e-92345ae1c6e9"); 
                console.log(userPostsResponse.data);
                setUserPostById(userPostsResponse.data);

            }catch(err){
                console.log(err);
                setLoading(false);
            }finally{
                setLoading(false);
            }
        };
        fetchData();
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
                    <Route path="/" element={<Post userDetails={userDetails} posts={posts}/>} />
                    <Route path="/profile-dashboard" element={<ProfileDashboard userDetails={userDetails} userPostById={userPostById}/>} />
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