import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

import logo from "../src/assets/farmdoc.svg";

const Navbar= ()=>{
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const authStatus = localStorage.getItem('isAuth') === 'true';
        setIsAuthenticated(authStatus);
      }, []);
    
      const handleLogout = () => {
        localStorage.removeItem('isAuth');
        setIsAuthenticated(false);
      };
    
        return(
            <nav className="nav-bar">
                <img src={logo} alt="Farmdoc Logo" className="navbar-logo"/>
                <span>FarmDoc</span>
                <div className="nav-links">
                    <ul>
                    {isAuthenticated ? (
                        <>
                            <li><Link to="/home">Home</Link></li>
                            <li><Link to="/profile-dashboard">Profile</Link></li>
                            <li><Link to="/notifications">Notifications</Link></li>
                            <li><button onClick={handleLogout}>Logout</button></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/home">Home</Link></li>
                            <li><Link to="/signup">Sign Up</Link></li>
                            <li><Link to="/">Login</Link></li>
                        </>
                    )}
                    </ul>
                </div>
            </nav>
    );
}

export default Navbar;

// layout route
// main layout
// outlet
// query params
// lingesh1    21fd35d9-aa25-44d9-812a-face5e1ed5d6