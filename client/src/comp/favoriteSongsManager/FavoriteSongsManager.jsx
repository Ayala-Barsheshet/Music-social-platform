import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import APIRequests from "../../services/APIRequests";
import styles from "./FavoriteSongsManager.module.css";

const FavoriteSongsManager = () => {
  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavoriteSongs();
  }, []);

  const fetchFavoriteSongs = async () => {
    try {
      const res = await APIRequests.getRequest("songs/user-favorites");
      setFavoriteSongs(res);
    } catch (err) {
      setError(err.message);
    }
  };

  const goToSong = (songId) => {
    navigate(`/songs/${songId}`);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Favorite Songs:</h2>
      {error && <p className={styles.errorMessage}>{error}</p>}

      {favoriteSongs.length === 0 ? (
        <p className={styles.empty}>You haven't favorited any songs yet.</p>
      ) : (
        <div className={styles.songList}>
          {favoriteSongs.map((song) => (
            <div
              key={song.id}
              className={styles.songRow}
              onClick={() => goToSong(song.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") goToSong(song.id);
              }}
            >
              <div className={styles.songInfo}>
                <span className={styles.songName}>{song.name}</span>
                <span className={styles.songArtist}>{song.artist_name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteSongsManager;
