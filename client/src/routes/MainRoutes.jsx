import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
// import Login  from "../pages/Auth/Login";
import Home from "../pages/Home";
import Library from "../pages/Library";
import Search from "../pages/Search";
import Upload from "../pages/Upload";
import Settings from "../pages/Settings";// Assuming you have a Song component for displaying individual songs

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} /> 
      {/* <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} /> */}
      <Route path="/library" element={<Library />} />
      <Route path="/search" element={<Search />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/settings" element={<Settings />} />
      {/* <Route path="/songs/:songId" element={<Song />} /> */}
    </Routes>
  );
};

export default MainRoutes;

