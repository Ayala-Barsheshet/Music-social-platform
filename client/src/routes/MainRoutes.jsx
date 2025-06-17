import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../services/UserProvider.jsx";

import Login from "../pages/Auth/Login.jsx";
import Register from "../pages/Auth/Register.jsx";
import Home from "../pages/Home.jsx";
import MyLibrary from "../pages/myLibrary/MyLibrary.jsx";
import Playlist from "../pages/playlist/Playlist.jsx";
import SongSearch from "../pages/songSearch/SongSearch.jsx";
import UploadSong from "../pages/Upload/UploadSong.jsx";
import Settings from "../pages/settings/Settings.jsx";
import Song from "../comp/song/Song.jsx";
import AccessControl from "../pages/Auth/accessControl/AccessControl.jsx"; 

const MainRoutes = ({ isAuthenticated }) => {

  return (<Routes>
    {!isAuthenticated ? (
      <>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </>
    ) : (
      <>
        <Route path="/home" element={<Home />} />
        <Route path="/My-library" element={<MyLibrary />} />
        <Route path="/playlists-songs/:playlistId" element={<Playlist />} />
        <Route path="/search" element={<SongSearch />} />
        <Route path="/search/add-to-playlist/:playlistId" element={<SongSearch />} />
        <Route path="/upload-song" element={<UploadSong />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/access-control" element={<AccessControl />} />
        <Route path="/songs/:songId" element={<Song />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </>
    )}
  </Routes>
  );
};

export default MainRoutes;
