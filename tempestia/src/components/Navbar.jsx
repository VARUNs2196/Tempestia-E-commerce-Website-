import React, { useState } from "react";
import { useTheme } from "../components/ThemeContext";
import "../css/Navbar.css";
import { useNavigate } from 'react-router-dom';
import profileLight from '../assets/profile-light.png';
import profileDark from '../assets/profile-dark.png';
import cartIcon from '../assets/shopping-cart.png';
import bellIcon from '../assets/bell.png';
import bellIcon2 from '../assets/bell2.png';
import axios from 'axios';
import { useAuth } from "../auth/AuthContext"; // Added

const Navbar = ({ isLoggedIn, onCategorySelect }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { darkMode, toggleTheme } = useTheme();
    const { user } = useAuth(); // Added
    const navigate = useNavigate();

    const categories = [
        { label: "Men", value: "men's clothing" },
        { label: "Women", value: "women's clothing" },
        { label: "Electronics", value: "electronics" },
        { label: "Jewelry", value: "jewelery" }
    ];

    const handleCategoryClick = (cat) => {
        if (isLoggedIn && onCategorySelect) {
            onCategorySelect(cat);
        } else {
            navigate(`/category/${encodeURIComponent(cat.toLowerCase())}`);
        }
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleVendorRequest = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.post("http://localhost:5000/api/users/request-vendor", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Vendor request submitted successfully!");
        } catch (err) {
            console.error(err);
            alert("You may have already submitted a request.");
        }
    };

    return (
        <header className={`navbar ${darkMode ? "dark" : ""}`}>
            <h1 className="site-title">Tempestia</h1>

            <nav className="nav-links">
                {categories.map((cat) => (
                    <span
                        key={cat.value}
                        className="nav-link"
                        onClick={() => handleCategoryClick(cat.value)}
                        style={{ cursor: "pointer", margin: "0 10px" }}
                    >
                        {cat.label}
                    </span>
                ))}

                <input className="search-bar" type="text" placeholder="Search products..." />

                {!isLoggedIn ? (
                    <>
                        <a href="/contact">Contact Us</a>
                        <a href="/">Home</a>
                        <button className="login-button" onClick={handleLoginClick}>Login</button>
                    </>
                ) : (
                    <>
                        <div
                            className="profile-menu"
                            onMouseEnter={() => setShowDropdown(true)}
                            onMouseLeave={() => setShowDropdown(false)}
                        >
                            <img
                                src={darkMode ? profileDark : profileLight}
                                alt="Profile"
                                className="profile-icon"
                            />

                            {showDropdown && (
                                <div className="dropdown-menu">
                                    <a href="/support">Help & Support</a>
                                    <a href="/track">Track Order</a>
                                    <a href="/orders">My Orders</a>

                                    {user?.role === "user" && !user?.vendorRequest && (
                                        <button
                                            className="dropdown-btn"
                                            onClick={handleVendorRequest}
                                        >
                                            Become a Vendor
                                        </button>
                                    )}

                                    {user?.vendorRequest && (
                                        <p className="pending-text">Vendor request pending</p>
                                    )}
                                </div>
                            )}
                        </div>
                        <img src={cartIcon} alt="Cart" className="nav-icon" />
                        <img src={darkMode ? bellIcon2 : bellIcon} alt="Notifications" className="nav-icon" />
                    </>
                )}
                <button className="dark-toggle" onClick={toggleTheme}>
                    {darkMode ? "☀️" : "🌙"}
                </button>
            </nav>
        </header>
    );
};

export default Navbar;
