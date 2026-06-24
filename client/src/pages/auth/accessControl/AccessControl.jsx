import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AccessControl.module.css";
import APIRequests from "../../../services/APIRequests";

const AccessControl = () => {
  const [unapprovedSongs, setUnapprovedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [becomeArtistRequests, setBecomeArtistRequests] = useState([]);
  const [artistLoading, setArtistLoading] = useState(true);
  const [artistError, setArtistError] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');

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
    const fetchPendingArtistAccess = async () => {
      try {
        const data = await APIRequests.getRequest('users/requested-artist-access');
        setBecomeArtistRequests(data);
        setArtistLoading(false);
      } catch (error) {
        setArtistError(error.message);
        setArtistLoading(false);
      }
    };
    fetchPendingArtistAccess();
  }, []);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const data = await APIRequests.getRequest('users');
        setAllUsers(data);
        setUsersLoading(false);
      } catch (error) {
        setUsersError(error.message);
        setUsersLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

  const handleApprove = async (songId) => {
    try {
      await APIRequests.patchRequest(`songs/${songId}`, { approved: 1 });
      setUnapprovedSongs((prev) => prev.filter((s) => s.id !== songId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (songId) => {
    try {
      await APIRequests.deleteRequest(`songs/${songId}`);
      setUnapprovedSongs((prev) => prev.filter((s) => s.id !== songId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleArtistApprove = async (user) => {
    try {
      await APIRequests.patchRequest(`users`, {
        requested_artist: 0,
        access_type: "artist",
        userIdToUpdate: user.id,
      });
      setBecomeArtistRequests((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) {
      setArtistError(err.message);
    }
  };

  const handleArtistReject = async (user) => {
    try {
      await APIRequests.patchRequest(`users`, {
        requested_artist: 0,
        userIdToUpdate: user.id,
      });
      setBecomeArtistRequests((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) {
      setArtistError(err.message);
    }
  };

  const handleChangeRole = async (user, newRole) => {
    try {
      await APIRequests.patchRequest('users', {
        access_type: newRole,
        userIdToUpdate: user.id,
      });
      setAllUsers(prev =>
        prev.map(u => u.id === user.id ? { ...u, access_type: newRole } : u)
      );
    } catch (err) {
      setUsersError(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await APIRequests.deleteRequest(`users/${userId}`);
      setAllUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      setUsersError(err.message);
    }
  };

  const filteredUsers = allUsers.filter(u => {
    const matchSearch =
      u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = filterRole ? u.access_type === filterRole : true;
    return matchSearch && matchRole;
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Access Control</h1>

      {/* Artist Role Requests */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Artist Role Requests</h2>
        <div className={styles.card}>
          {artistLoading ? (
            <p>Loading...</p>
          ) : becomeArtistRequests.length === 0 ? (
            <p>No artist requests yet.</p>
          ) : (
            <ul className={styles.songList}>
              {becomeArtistRequests.map((user) => (
                <li key={user.id || user._id} className={styles.songItem}>
                  <span className={styles.songInfo}>
                    {user.username} ({user.email})
                  </span>
                  <div className={styles.actions}>
                    <button
                      className={styles.approve}
                      onClick={() => handleArtistApprove(user)}
                    >
                      v
                    </button>
                    <button
                      className={styles.delete}
                      onClick={() => handleArtistReject(user)}
                    >
                      x
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {artistError && <p className={styles.error}>{artistError}</p>}
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
                      v
                    </button>
                    <button
                      className={styles.delete}
                      onClick={() => handleDelete(song.id)}
                    >
                      x
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {error && <p className={styles.error}>{error}</p>}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>User Management</h2>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <select value={filterRole} onChange={e => setFilterRole(e.target.value)}>
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="artist">Artist</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className={styles.card}>
          {usersLoading ? <p>Loading...</p> : (
            <ul className={styles.songList}>
              {filteredUsers.map(user => (
                <li key={user.id} className={styles.songItem}>
                  <span className={styles.songInfo}>
                    {user.username} ({user.email}) — {user.access_type}
                  </span>
                  <div className={styles.actions}>
                    <select
                      value={user.access_type}
                      onChange={e => handleChangeRole(user, e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="artist">Artist</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      className={styles.delete}
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      🗑
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {usersError && <p className={styles.error}>{usersError}</p>}
        </div>
      </section>
    </div>
  );
};

export default AccessControl;
