import { Routes, Route, Navigate} from "react-router-dom";
import Login from "../pages/auth/authForms/Login.jsx";
import Register from "../pages/auth/authForms/Register.jsx";
import Home from "../pages/home/Home.jsx";
import MyLibrary from "../pages/myLibrary/MyLibrary.jsx";
import Playlist from "../pages/playlist/Playlist.jsx";
import SongSearch from "../pages/songSearch/SongSearch.jsx";
import UploadSong from "../pages/uploadSong/UploadSong.jsx";
import Settings from "../pages/settings/Settings.jsx";
import Song from "../pages/song/Song.jsx";
import AccessControl from "../pages/auth/accessControl/AccessControl.jsx"; 

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
