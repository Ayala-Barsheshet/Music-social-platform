import React from "react";
import { NavLink } from "react-router-dom";
import "../comp/Navbar.css"; // Adjust the path as necessary

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="logo">MySpotify</h2>
      <ul className="nav-links">
        <li><NavLink to="/" end>בית</NavLink></li>
        <li><NavLink to="/library">ספרייה</NavLink></li>
        <li><NavLink to="/search">חיפוש</NavLink></li>
        <li><NavLink to="/upload">העלאה</NavLink></li>
        <li><NavLink to="/settings">הגדרות</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;