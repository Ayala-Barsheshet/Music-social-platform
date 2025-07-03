import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import APIRequests from "../../services/APIRequests.jsx";
import styles from "./Song.module.css";
import Comments from "../../comp/comments/Comments.jsx";

const Song = () => {
  const { songId } = useParams();
  const [song, setSong] = useState(null);
  const [liked, setLiked] = useState(false);
  const [loved, setLoved] = useState(false);
  const [hasLikeRow, setHasLikeRow] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [songError, setSongError] = useState(null);
  const [likesError, setLikesError] = useState(null);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    fetchSong();
    fetchLikes();
  }, [songId]);

  const fetchSong = async () => {
    try {
      const res = await APIRequests.getRequest(`songs/${songId}`);
      setSong(res);
      setSongError(null);
    } catch (err) {
      setSongError(err.message || "Error loading the song.");
    }
  };

  const fetchLikes = async () => {
    try {
      const res = await APIRequests.getRequest(`likes-loves/${songId}`);
      if (res.liked === null && res.loved === null) {
        setHasLikeRow(false);
        setLiked(false);
        setLoved(false);
      } else {
        setLiked(res.liked);
        setLoved(res.loved);
        setHasLikeRow(true);
      }
      if (res.likeCount !== undefined) {
        setLikeCount(res.likeCount);
      }
      setLikesError(null);
    } catch (err) {
      setLikesError(err.message || "Error loading likes.");
    }
  };

  const handleAction = async (field, stateSetter, currentValue) => {
    const newValue = !currentValue;
    stateSetter(newValue);
    try {
      if (!hasLikeRow) {
        await APIRequests.postRequest(`likes-loves/${songId}`);
        setHasLikeRow(true);
      }
      const res = await APIRequests.patchRequest(`likes-loves/${songId}`, {
        field,
        value: newValue,
      });

      if (field === "liked" && res.likeCount !== undefined) {
        setLikeCount(res.likeCount);
      }
      
      setActionError(null);
    } catch (err) {
      stateSetter(!newValue);
      setActionError(err.message || `Error updating ${field}`);
    }
  };

  if (!song) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.singleSongPage}>
      {songError && <div className={styles.error}>{songError}</div>}
      {likesError && <div className={styles.error}>{likesError}</div>}
      {actionError && <div className={styles.error}>{actionError}</div>}

      <video controls className={styles.myVideo}>
        <source src={`http://localhost:3000${song.file_path}`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className={styles.songInfo}>
        <div className={styles.songDetails}>
          <div className={styles.nameArtist}>
            {song.name} | {song.artist_name}
          </div>
          <div className={styles.createdAt}>
            {new Date(song.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        <div className={styles.songActionsInInfo}>
          <div className={`${styles.icon} ${styles.like}`} onClick={() => handleAction("liked", setLiked, liked)} title="Like">
            {liked ? "👍" : "👍🏻"} <span className={styles.likeCount}>{likeCount}</span>
          </div>
          <div className={`${styles.icon} ${styles.love}`} onClick={() => handleAction("loved", setLoved, loved)} title="Add to favorites">
            {loved ? "❤️" : "🤍"}
          </div>
        </div>

        {song.lyrics && (
          <div className={styles.lyricsInInfo}>
            <button className={styles.lyricsBtn} onClick={() => setShowLyrics((prev) => !prev)}>
              {showLyrics ? "Hide lyrics" : "Show lyrics"}
            </button>
            {showLyrics && <pre className={styles.lyrics}>{song.lyrics}</pre>}
          </div>
        )}
      </div>

      <Comments songId={songId} />
    </div>
  );
};

export default Song;