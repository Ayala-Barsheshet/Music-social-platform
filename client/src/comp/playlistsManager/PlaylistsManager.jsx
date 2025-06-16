import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import APIRequests from "../../services/APIRequests";
import styles from "./PlaylistsManager.module.css";


const PlaylistsManager = () => {
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({ name: "", description: "" });
  const [editPlaylistId, setEditPlaylistId] = useState(null);
  const [editPlaylist, setEditPlaylist] = useState({ name: "", description: "" });

  const navigate = useNavigate();

  useEffect(() => {
    fetchPlaylists();
  }, []);;

  const fetchPlaylists = async () => {
    try {
      const res = await APIRequests.getRequest("playlists");
      setPlaylists(res);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddPlaylist = async () => {
    try {
      await APIRequests.postRequest("playlists", newPlaylist);
      setNewPlaylist({ name: "", description: "" });
      setShowAddForm(false);
      fetchPlaylists();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdatePlaylist = async () => {
    try {
      await APIRequests.patchRequest(`playlists/${editPlaylistId}`, editPlaylist);
      setEditPlaylistId(null);
      setEditPlaylist({ name: "", description: "" });
      fetchPlaylists();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeletePlaylist = async (id) => {
    try {
      await APIRequests.deleteRequest(`playlists/${id}`);
      fetchPlaylists();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.subtitle}>Your Playlists:</h2>

      {error && <p className={styles.errorMessage}>{error}</p>}

      <div className={styles.playlistList}>
        {playlists.map((playlist) => (
          <div key={playlist.id} className={styles.playlistRow}>
            {editPlaylistId === playlist.id ? (
              <>
                <input
                  type="text"
                  value={editPlaylist.name}
                  onChange={(e) => setEditPlaylist({ ...editPlaylist, name: e.target.value })}
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={editPlaylist.description}
                  onChange={(e) => setEditPlaylist({ ...editPlaylist, description: e.target.value })}
                  placeholder="Description"
                />
                <div className={styles.actions}>
                  <button className={styles.smallBtn} onClick={handleUpdatePlaylist}>Save</button>
                  <button className={styles.smallBtn} onClick={() => setEditPlaylistId(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <span onClick={() => navigate(`/playlists-songs/${playlist.id}`)} className={styles.playlistName}>
                  {playlist.name}
                </span>
                <div className={styles.actions}>
                  <button
                    className={styles.smallBtn}
                    onClick={() => {
                      setEditPlaylistId(playlist.id);
                      setEditPlaylist({ name: playlist.name, description: playlist.description });
                    }}
                  >
                    Edit Details
                  </button>
                  <button
                    className={styles.smallBtn}
                    onClick={() => handleDeletePlaylist(playlist.id)}
                  >
                    Delete Playlist
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {!showAddForm ? (
        <button className={styles.addBtn} onClick={() => setShowAddForm(true)}>
          Add Playlist
        </button>
      ) : (
        <div className={styles.addForm}>
          <input
            type="text"
            placeholder="Playlist Name"
            value={newPlaylist.name}
            onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            value={newPlaylist.description}
            onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
          />
          <button className={styles.smallBtn} onClick={handleAddPlaylist}>Save</button>
          <button className={styles.smallBtn} onClick={() => setShowAddForm(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default PlaylistsManager;
