// import React from "react";
// import { Route, Routes, Navigate } from "react-router-dom";
// import Login from "../pages/Auth/Login";
// import Register from "../pages/Auth/Register";
// import Home from "../pages/Home";
// import Library from "../pages/personalArea";
// import Search from "../pages/Search";
// import Upload from "../pages/Upload";
// import Settings from "../pages/Settings";// Assuming you have a Song component for displaying individual songs

// const MainRoutes = () => {
//   return (
//     <Routes>
//       <Route path="/home" element={<Home />} />
//       <Route path="/" element={<Navigate to="/login" />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//       <Route path="/library" element={<Library />} />
//       <Route path="/search" element={<Search />} />
//       <Route path="/upload" element={<Upload />} />
//       <Route path="/settings" element={<Settings />} />
//       {/* <Route path="/songs/:songId" element={<Song />} /> */}
//     </Routes>
//   );
// };

// export default MainRoutes;



import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../services/UserProvider.jsx";

import Navbar from "../comp/Navbar.jsx";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Home from "../pages/Home";
import Library from "../pages/personalArea";
import Search from "../pages/Search";
import Upload from "../pages/Upload";
import Settings from "../pages/Settings";
import Song from "../comp/Song/Song.jsx"; // Assuming you have a Song component for displaying individual songs

const MainRoutes = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = !!user;

  useEffect(() => {
    if (!isAuthenticated && !location.pathname.includes("login") && !location.pathname.includes("register")) {
      alert("אנא הכנס - לא תנתן אפשרות כניסה ללא שם משתמש!");
      navigate("/login");
    }
  }, [isAuthenticated, location.pathname]);

  return (
    <div className="app-container">
      {isAuthenticated && <Navbar />}
      <main className="main-content">
        <Routes>
          {!isAuthenticated ? (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route path="/home" element={<Home />} />
              <Route path="/library" element={<Library />} />
              <Route path="/search" element={<Search />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/song/:songId" element={<Song />} />
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="*" element={<Navigate to="/home" />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
};

export default MainRoutes;
