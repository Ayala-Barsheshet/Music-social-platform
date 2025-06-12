import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Library from "../pages/Library";
import Search from "../pages/Search";
import Upload from "../pages/Upload";
import Settings from "../pages/Settings";

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/library" element={<Library />} />
      <Route path="/search" element={<Search />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};

export default MainRoutes;

