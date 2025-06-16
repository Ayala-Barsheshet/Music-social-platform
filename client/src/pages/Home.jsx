

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import APIRequests from "../services/APIRequests";
// import "./SongSearch.css";

const Home = () => {
  const [recommendedSongs, setRecommendedSongs] = useState([]);
  const [recentSongs, setRecentSongs] = useState([]);
  const [recommendedOffset, setRecommendedOffset] = useState(0);
  const [recentOffset, setRecentOffset] = useState(0);
  const navigate = useNavigate();
  const LIMIT = 5;

  useEffect(() => {
    loadMoreRecommended();
    loadMoreRecent();
  }, []);

  const loadMoreRecommended = async () => {
    const newSongs = await APIRequests.getRequest(`songs/recommended?limit=${LIMIT}&offset=${recommendedOffset}`);
    setRecommendedSongs(prev => [...prev, ...newSongs]);
    setRecommendedOffset(prev => prev + LIMIT);
  };

  const loadMoreRecent = async () => {
    const newSongs = await APIRequests.getRequest(`songs/recent?limit=${LIMIT}&offset=${recentOffset}`);
    console.log("New recent songs:", newSongs);
    setRecentSongs(prev => [...prev, ...newSongs]);
    setRecentOffset(prev => prev + LIMIT);
  };

  const renderSongs = (songs) => (
    <div className="songs-container">
      {songs.map((song) => (
        <div
          key={song.id}
          onClick={() => navigate(`/songs/${song.id}`)}
          className="song-card"
        >
          <p className="song-title">{song.name}</p>
          <p className="song-artist">{song.artist_name}</p>
          <p className="song-genre">{song.genre}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="song-search-page">
      <h1 className="home-title">ברוך הבא ל-MySpotify!</h1>

      <div className="songs-by-album">
        <h2 className="album-title">🎧 שירים מומלצים</h2>
        {renderSongs(recommendedSongs)}
        <button className="load-more-btn" onClick={loadMoreRecommended}>טען עוד מומלצים</button>
      </div>

      <div className="songs-by-album">
        <h2 className="album-title">🕒 שירים שהועלו לאחרונה</h2>
        {renderSongs(recentSongs)}
        <button className="load-more-btn" onClick={loadMoreRecent}>טען עוד אחרונים</button>
      </div>
    </div>
  );
};

export default Home;
