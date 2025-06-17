import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AccessControl.module.css";
import APIRequests from "../../../services/APIRequests";

const AccessControl = () => {
  const [unapprovedSongs, setUnapprovedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleApprove = async (songId) => {
    try {
      await APIRequests.patchRequest(`songs/${songId}`, { approved: true });
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

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Access Control</h1>

      {/* Artist Role Requests */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Artist Role Requests</h2>
        <div className={styles.card}>
          <p>No artist requests yet.</p>
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
