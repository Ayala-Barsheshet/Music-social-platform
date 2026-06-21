import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import APIRequests from "../../services/APIRequests";
import { useUser } from "../../services/UserProvider";
import styles from "./Home.module.css"

const Home = () => {
  const [mostLikedSongs, setMostLikedSongs] = useState([]);
  const [recentSongs, setRecentSongs] = useState([]);
  const [mostLikedOffset, setMostLikedOffset] = useState(0);
  const [recentOffset, setRecentOffset] = useState(0);
  const [hasMoreMostLiked, setHasMoreMostLiked] = useState(true);
  const [hasMoreRecent, setHasMoreRecent] = useState(true);
  const [message, setMessage] = useState(null)

  const { user } = useUser();
  const navigate = useNavigate();

  const LIMIT = 5;
  const FETCH_LIMIT = LIMIT + 1;

  useEffect(() => {
    loadMoreSongs({
      endpoint: "most-liked",
      offset: mostLikedOffset,
      setOffset: setMostLikedOffset,
      songsSetter: setMostLikedSongs,
      hasMoreSetter: setHasMoreMostLiked,
    });

    loadMoreSongs({
      endpoint: "recent",
      offset: recentOffset,
      setOffset: setRecentOffset,
      songsSetter: setRecentSongs,
      hasMoreSetter: setHasMoreRecent,
    });
  }, []);

  const loadMoreSongs = async ({
    endpoint,
    offset,
    setOffset,
    songsSetter,
    hasMoreSetter,
  }) => {
    try {
      const newSongs = await APIRequests.getRequest(
        `songs/${endpoint}?limit=${FETCH_LIMIT}&offset=${offset}`
      );

      if (newSongs.length < FETCH_LIMIT) {
        hasMoreSetter(false);
      }

      const songsToAdd = newSongs.slice(0, LIMIT);
      songsSetter((prev) => [...prev, ...songsToAdd]);
      setOffset((prev) => prev + LIMIT);
    } catch (error) {
      setMessage(error.message || "Failed to load songs");
      hasMoreSetter(false);
    }
  };

  const renderSongs = (songs) => (
    <div className={styles.songsContainer}>
      {songs.map((song) => (
        <div
          key={song.id}
          onClick={() => navigate(`/songs/${song.id}`)}
          className={styles.songCard}
        >
          <p className={styles.songTitle}>{song.name}</p>
          <p className={styles.songArtist}>{song.artist_name}</p>
          <p className={styles.songGenre}>{song.genre}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.songSearchPage}>
      {message && <div className={styles.message}>{message}</div>}
      <h1 className={styles.homeTitle}>
        Welcome {user.username} to Spotify & Share
      </h1>

      <div className={styles.songsByAlbum}>
        <h2 className={styles.albumTitle}>🎧Most liked songs on Spotify & Share</h2>
        {renderSongs(mostLikedSongs)}
        {hasMoreMostLiked && (
          <button
            className={styles.loadMoreBtn}
            onClick={() =>
              loadMoreSongs({
                endpoint: "most-liked",
                offset: mostLikedOffset,
                setOffset: setMostLikedOffset,
                songsSetter: setMostLikedSongs,
                hasMoreSetter: setHasMoreMostLiked,
              })
            }
          >
            load more...
          </button>
        )}
      </div>

      <div className={styles.songsByAlbum}>
        <h2 className={styles.albumTitle}>🕒Recently uploaded songs</h2>
        {renderSongs(recentSongs)}
        {hasMoreRecent && (
          <button
            className={styles.loadMoreBtn}
            onClick={() =>
              loadMoreSongs({
                endpoint: "recent",
                offset: recentOffset,
                setOffset: setRecentOffset,
                songsSetter: setRecentSongs,
                hasMoreSetter: setHasMoreRecent,
              })
            }
          >
            load more...
          </button>
        )}{/* === PLATFORM FOOTER SECTION === */}
        <div className={styles.platformSection}>
          <div className={styles.platformLogo}>
            🎵 <span className={styles.logoText}>Spotify & Share</span>
          </div>
          <p className={styles.platformSlogan}>Share the music. Share the moment.</p>

          <div className={styles.platformFeatures}>
            <div className={styles.featureCard}>
              <span className={styles.featureIcon}>🎤</span>
              <h3 className={styles.featureTitle}>A Platform for Real Artists</h3>
              <p className={styles.featureText}>
                Every song goes through admin approval before publishing - so you'll always find quality music here only.
              </p>
            </div>
            <div className={styles.featureCard}>
              <span className={styles.featureIcon}>🤝</span>
              <h3 className={styles.featureTitle}>A Community That Connects</h3>
              <p className={styles.featureText}>
                Loved a song? Comment, save it to a playlist, and help the artist grow. Here, every like matters.
              </p>
            </div>
            <div className={styles.featureCard}>
              <span className={styles.featureIcon}>🚀</span>
              <h3 className={styles.featureTitle}>Your Path to Becoming an Artist</h3>
              <p className={styles.featureText}>
                A listener who wants to share music? Request a promotion to artist status and start uploading your creations.
              </p>
            </div>
          </div>

          <p className={styles.platformTagline}>
            The place where listeners meet artists - and artists find an audience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;