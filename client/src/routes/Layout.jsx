import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../services/UserProvider.jsx";
import Navbar from "../comp/navbar/Navbar.jsx";
import MainRoutes from "./MainRoutes.jsx";

const Layout = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = !!user

  useEffect(() => {
    if (!isAuthenticated && !location.pathname.includes("login") && !location.pathname.includes("register")) {
      alert("Please log in - access is not allowed without authentication!");
      navigate("/login");
    }
  }, [isAuthenticated, location.pathname]);

  return (
    <div className="app-container">
      {isAuthenticated && <Navbar />}
      <main className="main-content">
        <MainRoutes isAuthenticated ={isAuthenticated} />
      </main>
    </div>
  );
};

export default Layout;
