import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import APIRequests from '../../services/APIRequests';
import styles from './Playlist.module.css';

const Playlist = () => {
  const { playlistId } = useParams();
  const [songs, setSongs] = useState([]);
  const [playlistInfo, setPlaylistInfo] = useState({ name: '', description: '' });
  const navigate = useNavigate();
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPlaylistData = async () => {
      try {
        const res = await APIRequests.getRequest(`playlist-songs/${playlistId}`);

        setPlaylistInfo({
          name: res[0].playlist_name || 'Playlist',
          description: res[0].playlist_description || ''
        });

        const filteredSongs = res.filter((row) => row.id !== null);//real songs

        const formattedSongs = filteredSongs.map((song) => ({
          id: song.id,
          name: song.name,
          artist_name: song.artist_name,
          genre: song.genre
        }));

        setSongs(formattedSongs);
        
      } catch (err) {
        setError(err.message || 'An error occurred while loading the songs');
      }
    };

    fetchPlaylistData();
  }, [playlistId]);

  const goToSong = (songId) => {
    navigate(`/songs/${songId}`);
  };

  const removeSongFromPlaylist = async (songId) => {
    try {
      await APIRequests.deleteRequest(`playlist-songs/${playlistId}/songs/${songId}`);
      setSongs((prevSongs) => prevSongs.filter(song => song.id !== songId));
    } catch (err) {
      setError(err.message || 'An error occurred while removing the song');
    }
  };

  const searchSongToAdd = () => {
    navigate(`/search/add-to-playlist/${playlistId}`);
  };

  return (
    <div className={styles.container}>
      {error && <div className={styles.error}>{error}</div>}
      <h1 className={styles.playlistName}>{playlistInfo.name}</h1>
      <p className={styles.playlistDescription}>{playlistInfo.description}</p>

      <div className={styles.songList}>
        {songs.map((song) => (
          <div key={song.id} className={styles.songRow}>
            <div
              onClick={() => goToSong(song.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  goToSong(song.id);
                }
              }}
              className={styles.songInfo}
            >
              <span className={styles.songName}>{song.name}</span>
              <span className={styles.artistName}>{song.artist_name}</span>
              <span className={styles.genre}>{song.genre}</span>
            </div>

            <button
              onClick={() => removeSongFromPlaylist(song.id)}
              className={styles.removeButton}
            >
              delete song from playlist
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={searchSongToAdd}
        className={styles.addButton}
      >
        search song to add to playlist
      </button>
    </div>
  );
};

export default Playlist;
