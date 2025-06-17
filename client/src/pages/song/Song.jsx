
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import APIRequests from "../../services/APIRequests.jsx";
// import styles from "./Song.css";
import Comments from "../../comp/comments/comments.jsx";

const Song = () => {
  const { songId } = useParams();
  const [song, setSong] = useState(null);
  const [liked, setLiked] = useState(false);
  const [loved, setLoved] = useState(false);
  const [hasLikeRow, setHasLikeRow] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    fetchSong();
    fetchLikes();
  }, [songId]);

  const fetchSong = async () => {
    try {
      const res = await APIRequests.getRequest(`songs/${songId}`);
      setSong(res);
    } catch (err) {
      console.error("Failed to fetch song:", err);
    }
  };

  const fetchLikes = async () => {
    try {
      const res = await APIRequests.getRequest(`likes-loves/${songId}`);
      if (res.liked === null && res.loved === null) {
        setHasLikeRow(false);
        setLiked(false);
        setLoved(false);
      }
      else {
        setLiked(res.liked);
        setLoved(res.loved);
        setHasLikeRow(true);
      }
      if (res.likeCount !== undefined) {
        setLikeCount(res.likeCount);
      }
    } catch (err) {
      console.warn("No like row found, not liked/loved yet.");
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
      console.log(res.likeCount);

      if (field === "liked" && res.likeCount !== undefined) {
        setLikeCount(res.likeCount);
      }
    } catch (err) {
      console.error(`Failed to update ${field}:`, err);
      stateSetter(!newValue);
    }
  };


  if (!song) return <div>Loading...</div>;

  return (
    <div className="single-song-page">
      <video controls className="my-video">
        <source src={song.file_path} type="video/mp4" />
        הדפדפן שלך לא תומך בוידאו.
      </video>

      <div className="song-actions">
        <div className="icon like" onClick={() => handleAction("liked", setLiked, liked)} title="Like">
          {liked ? "👍" : "👍🏻"} <span className="like-count">{likeCount}</span>
        </div>
        <div className="icon love" onClick={() => handleAction("loved", setLoved, loved)} title="Add to favorites">
          {loved ? "❤️" : "🤍"}
        </div>
      </div>

      <div className="song-info">
        <div className="name-artist">
          {song.name} | {song.artist_name}
        </div>
        <div className="created-at">
          {new Date(song.created_at).toLocaleDateString("he-IL", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {song.lyrics && (
        <div className="lyrics-section">
          <button onClick={() => setShowLyrics((prev) => !prev)}>
            {showLyrics ? "Hide lyrics" : "Show lyrics"}
          </button>
          {showLyrics && <pre className="lyrics">{song.lyrics}</pre>}
        </div>
      )}

      <Comments songId={songId} />
    </div>
  );
};

export default Song;

