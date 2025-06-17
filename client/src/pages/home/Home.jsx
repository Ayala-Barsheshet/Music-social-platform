

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import APIRequests from "../services/APIRequests";
// import { useUser } from '../services/UserProvider';

// // import "./SongSearch.css";

// const Home = () => {

//   const [recommendedSongs, setRecommendedSongs] = useState([]);
//   const [recentSongs, setRecentSongs] = useState([]);
//   const [recommendedOffset, setRecommendedOffset] = useState(0);
//   const [recentOffset, setRecentOffset] = useState(0);
//   const [hasMoreRecommended, setHasMoreRecommended] = useState(true);
//   const [hasMoreRecent, setHasMoreRecent] = useState(true);

//   const { user } = useUser();

//   const navigate = useNavigate();
//   const LIMIT = 5;

//   useEffect(() => {
//     loadMoreRecommended();
//     loadMoreRecent();
//   }, []);

//   const loadMoreRecommended = async () => {
//     const newSongs = await APIRequests.getRequest(`songs/recommended?limit=${LIMIT}&offset=${recommendedOffset}`);
//     if (newSongs.length < LIMIT) {
//       setHasMoreRecommended(false); // אין יותר שירים להציג
//     }


//     setRecommendedSongs(prev => [...prev, ...newSongs]);
//     setRecommendedOffset(prev => prev + LIMIT);
//   };

//   const loadMoreRecent = async () => {
//     const newSongs = await APIRequests.getRequest(`songs/recent?limit=${LIMIT}&offset=${recentOffset}`);
//     console.log("New recent songs:", newSongs);
//     if (newSongs.length < LIMIT) {
//       setHasMoreRecent(false); // אין יותר שירים להציג
//     }

//     setRecentSongs(prev => [...prev, ...newSongs]);
//     setRecentOffset(prev => prev + LIMIT);
//   };

//   const renderSongs = (songs) => (
//     <div className="songs-container">
//       {songs.map((song) => (
//         <div
//           key={song.id}
//           onClick={() => navigate(`/songs/${song.id}`)}
//           className="song-card"
//         >
//           <p className="song-title">{song.name}</p>
//           <p className="song-artist">{song.artist_name}</p>
//           <p className="song-genre">{song.genre}</p>
//         </div>
//       ))}
//     </div>
//   );

//   return (
//     <div className="song-search-page">
//       <h1 className="home-title">Welcome {user.username} to spotify & share </h1>

//       <div className="songs-by-album">
//         <h2 className="album-title">🎧Most loved songs on Spotify</h2>
//         {renderSongs(recommendedSongs)}
//         {hasMoreRecommended && <button className="load-more-btn" onClick={loadMoreRecommended}>load more... </button>}
//       </div>

//       <div className="songs-by-album">
//         <h2 className="album-title">🕒Recently uploaded songs</h2>
//         {renderSongs(recentSongs)}
//         {hasMoreRecent && <button className="load-more-btn" onClick={loadMoreRecent}>load more...</button>}
//       </div>
//     </div>
//   );
// };

// export default Home;




import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import APIRequests from "../../services/APIRequests";
import { useUser } from "../../services/UserProvider";

const Home = () => {
  const [recommendedSongs, setRecommendedSongs] = useState([]);
  const [recentSongs, setRecentSongs] = useState([]);
  const [recommendedOffset, setRecommendedOffset] = useState(0);
  const [recentOffset, setRecentOffset] = useState(0);
  const [hasMoreRecommended, setHasMoreRecommended] = useState(true);
  const [hasMoreRecent, setHasMoreRecent] = useState(true);

  const { user } = useUser();
  const navigate = useNavigate();

  const LIMIT = 5;
  const FETCH_LIMIT = LIMIT + 1;

  useEffect(() => {
    loadMoreSongs({
      endpoint: "recommended",
      offset: recommendedOffset,
      setOffset: setRecommendedOffset,
      songsSetter: setRecommendedSongs,
      hasMoreSetter: setHasMoreRecommended,
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
    const newSongs = await APIRequests.getRequest(
      `songs/${endpoint}?limit=${FETCH_LIMIT}&offset=${offset}`
    );

    if (newSongs.length < FETCH_LIMIT) {
      hasMoreSetter(false);
    }

    const songsToAdd = newSongs.slice(0, LIMIT);
    songsSetter((prev) => [...prev, ...songsToAdd]);
    setOffset((prev) => prev + LIMIT);
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
      <h1 className="home-title">
        Welcome {user.username} to spotify & share
      </h1>

      <div className="songs-by-album">
        <h2 className="album-title">🎧Most loved songs on Spotify</h2>
        {renderSongs(recommendedSongs)}
        {hasMoreRecommended && (
          <button
            className="load-more-btn"
            onClick={() =>
              loadMoreSongs({
                endpoint: "recommended",
                offset: recommendedOffset,
                setOffset: setRecommendedOffset,
                songsSetter: setRecommendedSongs,
                hasMoreSetter: setHasMoreRecommended,
              })
            }
          >
            load more...
          </button>
        )}
      </div>

      <div className="songs-by-album">
        <h2 className="album-title">🕒Recently uploaded songs</h2>
        {renderSongs(recentSongs)}
        {hasMoreRecent && (
          <button
            className="load-more-btn"
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
        )}
      </div>
    </div>
  );
};

export default Home;
