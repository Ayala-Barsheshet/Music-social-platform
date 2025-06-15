// // import React, { useEffect, useState } from "react";
// // import { useParams } from "react-router-dom";
// // import APIRequests from "../../services/APIRequests.jsx";
// // import "./f.css"

// // import Comments from "../comments/comments.jsx"; // קומפוננטה שתשתול מתחת לשיר

// // const Song = () => {
// //   const { songId } = useParams(); // מתוך ה-URL
// //   const [song, setSong] = useState(null);
// //   const [liked, setLiked] = useState(false);
// //   const [loved, setLoved] = useState(false);

// //   useEffect(() => {
// //     const fetchSong = async () => {
// //       const res = await APIRequests.getRequest(`songs/${songId}`);
// //       console.log(res);

// //       setSong(res);
// //       console.log(song);

// //     };

// //     const fetchLikes = async () => {
// //       const res = await APIRequests.getRequest(`likes-loves/${songId}`);
// //       console.log(res.liked, res.loved);

// //       setLiked(res.liked);
// //       setLoved(res.loved);
// //     };

// //     fetchSong();
// //     fetchLikes();
// //   }, [songId]);

// //   const handleLike = async () => {
// //     await APIRequests.postRequest(`likes-loves/${songId}/like`);
// //     setLiked((prev) => !prev);
// //   };

// //   const handleLove = async () => {
// //     await APIRequests.postRequest(`likes-loves/${songId}/love`);
// //     setLoved((prev) => !prev);
// //   };

// //   if (!song) return <div>Loading...</div>;

// //   return (
// //     <div className="single-song-page">
// //       <audio controls src={song.file_path} />

// //       <div className="song-actions">

// //         <div className={`icon like`} onClick={handleLike} title="Like">
// //           {liked ? "👍🏻" : "👍"}
// //         </div>
// // <div className={`icon love`} onClick={handleLove} title="Add to favorites">
// //   {loved ? "❤️" : "🤍"}
// // </div>

// //       </div>

// //       <div className="song-info">
// //         <div className="name-artist">
// //           {song.name} | {song.artist_name}
// //         </div>
// //         <div className="created-at">
// //           {new Date(song.created_at).toLocaleDateString("he-IL", {
// //             year: "numeric",
// //             month: "long",
// //             day: "numeric",
// //           })}
// //         </div>
// //       </div>

// //       {/* קומפוננטת תגובות */}
// //       <Comments songId={songId} />
// //     </div>
// //   );
// // };

// // export default Song;




// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import APIRequests from "../../services/APIRequests.jsx";
// import "./f.css";

// import Comments from "../comments/comments.jsx"; // קומפוננטה שתשתול מתחת לשיר

// const Song = () => {
//   const { songId } = useParams(); // מתוך ה-URL
//   const [song, setSong] = useState(null);
//   const [liked, setLiked] = useState(false);
//   const [loved, setLoved] = useState(false);

//   useEffect(() => {
//     const fetchSong = async () => {
//       const res = await APIRequests.getRequest(`songs/${songId}`);
//       setSong(res);
//     };

//     const fetchLikes = async () => {
//       const res = await APIRequests.getRequest(`likes-loves/${songId}`);
//       setLiked(res.liked);
//       setLoved(res.loved);
//     };

//     fetchSong();
//     fetchLikes();
//   }, [songId]);

//   const handleLike = async () => {
//     const newValue = !liked;
//     setLiked(newValue);
//     try {
//       await APIRequests.patchRequest(`likes-loves/${songId}`, {
//         field: "liked",
//         value: newValue,
//       });
//     } catch (err) {
//       console.error("Failed to update like:", err);
//       setLiked(!newValue);
//     }
//   };

//   const handleLove = async () => {
//     const newValue = !loved;
//     setLoved(newValue);
//     try {
//       await APIRequests.patchRequest(`likes-loves/${songId}`, {
//         field: "loved",
//         value: newValue,
//       });
//     } catch (err) {
//       console.error("Failed to update love:", err);
//       setLoved(!newValue);
//     }
//   };

//   if (!song) return <div>Loading...</div>;

//   return (
//     <div className="single-song-page">
//       <audio controls src={song.file_path} />

//       <div className="song-actions">
//         <div className="icon like" onClick={handleLike} title="Like">
//           {liked ? "👍🏻" : "👍"}
//         </div>
//         <div className="icon love" onClick={handleLove} title="Add to favorites">
//           {loved ? "❤️" : "🤍"}
//         </div>
//       </div>

//       <div className="song-info">
//         <div className="name-artist">
//           {song.name} | {song.artist_name}
//         </div>
//         <div className="created-at">
//           {new Date(song.created_at).toLocaleDateString("he-IL", {
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//           })}
//         </div>
//       </div>

//       {/* קומפוננטת תגובות */}
//       <Comments songId={songId} />
//     </div>
//   );
// };

// export default Song;




import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import APIRequests from "../../services/APIRequests.jsx";
import "./f.css";

import Comments from "../comments/comments.jsx"; // קומפוננטה שתשתול מתחת לשיר

const Song = () => {
  const { songId } = useParams();
  const [song, setSong] = useState(null);
  const [liked, setLiked] = useState(false);
  const [loved, setLoved] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false); // ← שליטה בהצגת המילים

  useEffect(() => {
    const fetchSong = async () => {
      const res = await APIRequests.getRequest(`songs/${songId}`);
      setSong(res);
      console.log(res.file_path);
    };

    const fetchLikes = async () => {
      const res = await APIRequests.getRequest(`likes-loves/${songId}`);
      setLiked(res.liked);
      setLoved(res.loved);
    };

    fetchSong();
    fetchLikes();
  }, [songId]);

  const handleLike = async () => {
    const newValue = !liked;
    setLiked(newValue);
    try {
      await APIRequests.patchRequest(`likes-loves/${songId}`, {
        field: "liked",
        value: newValue,
      });
    } catch (err) {
      console.error("Failed to update like:", err);
      setLiked(!newValue);
    }
  };

  const handleLove = async () => {
    const newValue = !loved;
    setLoved(newValue);
    try {
      await APIRequests.patchRequest(`likes-loves/${songId}`, {
        field: "loved",
        value: newValue,
      });
    } catch (err) {
      console.error("Failed to update love:", err);
      setLoved(!newValue);
    }
  };

  if (!song) return <div>Loading...</div>;

  return (
    <div className="single-song-page">
      <audio controls src={song.file_path}/>
      <div className="song-actions">
        <div className="icon like" onClick={handleLike} title="Like">
          {liked ? "👍🏻" : "👍"}
        </div>
        <div className="icon love" onClick={handleLove} title="Add to favorites">
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

      {/* כפתור הצגת מילים */}
      {song.lyrics && (
        <div className="lyrics-section">
          <button onClick={() => setShowLyrics((prev) => !prev)}>
            {showLyrics ? "Hide lyrics" : "Show lyrics"}
          </button>
          {showLyrics && (
            <pre className="lyrics">
              {song.lyrics}
            </pre>
          )}
        </div>
      )}

      {/* קומפוננטת תגובות */}
      <Comments songId={songId} />
    </div>
  );
};

export default Song;

