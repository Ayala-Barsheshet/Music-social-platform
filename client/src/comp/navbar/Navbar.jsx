import React from "react";
import { NavLink } from "react-router-dom";
import "../navbar/Navbar.css"; // Adjust the path as necessary
import { useUser } from "../../services/UserProvider"; // התאימי את הנתיב לפי הפרויקט שלך

const Navbar = () => {
  const { logout } = useUser();
  return (
    <nav className="navbar">
      <h2 className="logo">MySpotify</h2>
      <ul className="nav-links">
        <button className="logout-button" onClick={logout}>התנתק</button>
        <li><NavLink to="/" end>בית</NavLink></li>
        <li><NavLink to="/my-library">ספריה שלי</NavLink></li>
        <li><NavLink to="/search">חיפוש</NavLink></li>
        <li><NavLink to="/upload-song">העלאה</NavLink></li>
        <li><NavLink to="/settings">הגדרות</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;