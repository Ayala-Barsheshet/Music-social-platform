import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AccessControl.module.css";
import APIRequests from "../../../services/APIRequests";

const AccessControl = () => {
  const [unapprovedSongs, setUnapprovedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [artistRequests, setArtistRequests] = useState([]);
  const [artistLoading, setArtistLoading] = useState(true);
  const [artistError, setArtistError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnapprovedSongs = async () => {
      try {
        const data = await APIRequests.getRequest('songs/unapproved');
        setUnapprovedSongs(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchUnapprovedSongs();
  }, []);

  useEffect(() => {
    const fetchArtistRequests = async () => {
      try {
        const data = await APIRequests.getRequest('users/requested-artist-access');
        setArtistRequests(data);
        setArtistLoading(false);
      } catch (error) {
        setArtistError(error.message);
        setArtistLoading(false);
      }
    };
    fetchArtistRequests();
  }, []);

  const handleApprove = async (songId) => {
    try {
      await APIRequests.patchRequest(`songs/${songId}`, { approved: 1 });
      setUnapprovedSongs((prev) => prev.filter((s) => s.id !== songId));
    } catch (err) {
      console.error("Approval failed", err);
    }
  };

  const handleDelete = async (songId) => {
    try {
      await APIRequests.deleteRequest(`songs/${songId}`);
      setUnapprovedSongs((prev) => prev.filter((s) => s.id !== songId));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleArtistApprove = async (user) => {
    try {
      const res = await APIRequests.patchRequest(`users`, {
        requested_artist: 0,
        access_type: "artist",
        userIdToUpdate: user.id,
      });
      setArtistRequests((prev) => prev.filter((u) => u.id !== user.id));

      setUser(updatedUser);
    } catch (err) {
      console.error("Approval failed", err);
    }
  };

  const handleArtistReject = async (user) => {
    try {
      await APIRequests.patchRequest(`users`, {
        requested_artist: 0,
        userIdToUpdate: user.id,
      });
      setArtistRequests((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) {
      console.error("Rejection failed", err);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Access Control</h1>

      {/* Artist Role Requests */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Artist Role Requests</h2>
        <div className={styles.card}>
          {artistLoading ? (
            <p>Loading...</p>
          ) : artistRequests.length === 0 ? (
            <p>No artist requests yet.</p>
          ) : (
            <ul className={styles.songList}>
              {artistRequests.map((user) => (
                <li key={user.id || user._id} className={styles.songItem}>
                  <span className={styles.songInfo}>
                    {user.username} ({user.email})
                  </span>
                  <div className={styles.actions}>
                    <button
                      className={styles.approve}
                      onClick={() => handleArtistApprove(user)}
                    >
                      ✔️
                    </button>
                    <button
                      className={styles.delete}
                      onClick={() => handleArtistReject(user)}
                    >
                      ❌
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Song Upload Approvals */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Pending Song Approvals</h2>
        <div className={styles.card}>
          {loading ? (
            <p>Loading...</p>
          ) : unapprovedSongs.length === 0 ? (
            <p>No pending song uploads.</p>
          ) : (
            <ul className={styles.songList}>
              {unapprovedSongs.map((song) => (
                <li key={song.id || song._id} className={styles.songItem}>
                  <span
                    className={styles.songInfo}
                    onClick={() => navigate(`/songs/${song.id}`)}
                  >
                    {song.name} {song.artist_name && `by ${song.artist_name}`}
                  </span>
                  <div className={styles.actions}>
                    <button
                      className={styles.approve}
                      onClick={() => handleApprove(song.id)}
                    >
                      ✔️
                    </button>
                    <button
                      className={styles.delete}
                      onClick={() => handleDelete(song.id)}
                    >
                      ❌
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default AccessControl;
