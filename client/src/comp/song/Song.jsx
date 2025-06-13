import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import APIRequests from ".../services/APIRequests.jsx"; // הנחה שאתה משתמש בקובץ שירותים
import "./Song.css"; // קובץ CSS שתכף אצור
import Comments from "../comments/comments.jsx"; // קומפוננטה שתשתול מתחת לשיר

const Song = () => {
  const { songId } = useParams(); // מתוך ה-URL
  const [song, setSong] = useState(null);
  const [liked, setLiked] = useState(false);
  const [loved, setLoved] = useState(false);

  useEffect(() => {
    const fetchSong = async () => {
      const res = await APIRequests.get(`/songs/${songId}`);
      setSong(res.data);
    };

    const fetchLikes = async () => {
      const res = await APIRequests.get(`/likes/${songId}`);
      setLiked(res.data.liked);
      setLoved(res.data.loved);
    };

    fetchSong();
    fetchLikes();
  }, [songId]);

  const handleLike = async () => {
    await APIRequests.post(`/likes/${songId}/like`);
    setLiked((prev) => !prev);
  };

  const handleLove = async () => {
    await APIRequests.post(`/likes/${songId}/love`);
    setLoved((prev) => !prev);
  };

  if (!song) return <div>Loading...</div>;

  return (
    <div className="single-song-page">
      <audio controls src={song.file_path} />

      <div className="song-actions">
        <div
          className={`icon like ${liked ? "active" : ""}`}
          onClick={handleLike}
          title="Like"
        >
          👍
        </div>
        <div
          className={`icon love ${loved ? "active" : ""}`}
          onClick={handleLove}
          title="Add to favorites"
        >
          ❤️
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

      {/* קומפוננטת תגובות */}
      <Comments songId={songId} />
    </div>
  );
};

export default Song;
