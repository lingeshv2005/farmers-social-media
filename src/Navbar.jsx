import React  from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import logo from "../src/assets/farmdoc.svg";

import Post from "./components/Post";
import ProfileDashboard from "./components/ProfileDashboard";


const Navbar=()=>{
    return(
            <Router>
                <nav className="nav-bar">
                    <img src={logo} alt="Farmdoc Logo" className="navbar-logo"/>
                    <span>FarmDoc</span>
                    <div className="nav-links">
                        <ul>
                            <li><Link to="/home">Home</Link></li>
                            <li><Link to="/health-posts">Health Posts</Link></li>
                            <li><Link to="/profile">Profile</Link></li>
                            <li><Link to="/farm-updates">Farm Updates</Link></li>
                            <li><Link to="/community">Community</Link></li>
                            <li><Link to="/marketplace">Marketplace</Link></li>
                            <li><Link to="/events">Events</Link></li>
                            <li><Link to="/notifications">Notifications</Link></li>
                        </ul>
                    </div>
                </nav>
                <Routes>
                    <Route path="/profile" element={<ProfileDashboard />} />
                    <Route path="/home" element={<Post />} />
                </Routes>
            </Router>
    );
}



export default Navbar;