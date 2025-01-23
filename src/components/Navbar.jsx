import React from "react";
import logo from "../assets/farmdoc.svg";

const Navbar=()=>{
    return(
        <>
            <nav className="nav-bar">
                <img src={logo} alt="Farmdoc Logo" className="navbar-logo"/>FarmDoc
                <div className="nav-links">
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/health-posts">Health Posts</a></li>
                        <li><a href="/farm-updates">Farm Updates</a></li>
                        <li><a href="/community">Community</a></li>
                        <li><a href="/marketplace">Marketplace</a></li>
                        <li><a href="/events">Events</a></li>
                        <li><a href="/notifications">Notifications</a></li>
                        <li><a href="/profile">Profile</a></li>
                    </ul>
                </div>
            </nav>
        </>
    );
}

export default Navbar;