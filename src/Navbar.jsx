import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Navbar.css";
import logo from "../src/assets/farmdoc.svg";

const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const authStatus = localStorage.getItem("isAuth") === "true";
        setIsAuthenticated(authStatus);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("isAuth");
        localStorage.removeItem("userId");
        setIsAuthenticated(false);
        toast.success("Logged out successfully!", { position: "top-right", autoClose: 2000 });
    };

    return (
        <nav className="nav-bar">
            <div className="nav-left">
                <motion.img 
                    src={logo} 
                    alt="Farmdoc Logo" 
                    className="navbar-logo"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                />
                <motion.span 
                    className="brand-name"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Sow & Grow
                </motion.span>
            </div>

            {/* Desktop Navigation */}
            <div className="nav-links desktop">
                <ul>
                    <li><Link to="/home">Home</Link></li>
                    {isAuthenticated ? (
                        <>
                            <li><Link to="/ecomHome">Ecommerce </Link></li>

                            {/* <li><Link to="/notifications">Notifications</Link></li> */}
                            <li><Link to="/chat">Chat</Link></li>  {/* ✅ Added Chat Link */}
                            <li><Link to="/llm">Llm</Link></li>
                            <li><Link to="/profile-dashboard">Profile</Link></li>

                            <li>
                                <motion.button 
                                    className="logout-btn" 
                                    onClick={handleLogout}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    Logout
                                </motion.button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/signup">Sign Up</Link></li>
                            <li><Link to="/login">Login</Link></li>
                        </>
                    )}
                </ul>
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button 
                className="menu-toggle"
                onClick={() => setMenuOpen(!menuOpen)}
                whileTap={{ scale: 0.9 }}
            >
                ☰
            </motion.button>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div 
                        className="nav-links mobile"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ul>
                            <li><Link to="/home">Home</Link></li>
                            {isAuthenticated ? (
                                <>
                                    <li><Link to="/profile-dashboard">Profile</Link></li>
                                    <li><Link to="/notifications">Notifications</Link></li>
                                    <li><Link to="/chat">Chat</Link></li> {/* ✅ Added Chat Link */}
                                    <li><Link to="/llm">Llm</Link></li>
                                    <li>
                                        <motion.button 
                                            className="logout-btn" 
                                            onClick={handleLogout}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            Logout
                                        </motion.button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/signup">Sign Up</Link></li>
                                    <li><Link to="/login">Login</Link></li>
                                </>
                            )}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
