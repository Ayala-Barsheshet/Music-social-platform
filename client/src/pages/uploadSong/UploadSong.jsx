import { useState, useEffect } from 'react';
import styles from './UploadSong.module.css';
import APIRequests from '../../services/APIRequests';
import { useUser } from "../../services/UserProvider";

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

const UploadSong = () => {
  const [albums, setAlbums] = useState([]);
  const [message, setMessage] = useState('');
  const { user } = useUser();
  const [songs, setSongs] = useState([]);
  const [songsLoading, setSongsLoading] = useState(true);
  const [songsError, setSongsError] = useState(null);
  const [form, setForm] = useState({
    name: '',
    lyrics: '',
    genre: '',
    file_path: '',
    album_id: ''
  });

  const fetchMySongs = async () => {
    try {
      setSongsLoading(true);
      const data = await APIRequests.getRequest('my-songs');
      setSongs(data);
    } catch (err) {
      setSongsError(err.message || 'Failed to load your songs');
    } finally {
      setSongsLoading(false);
    }
  };

  const fetchAlbums = async () => {
    try {
      const res = await APIRequests.getRequest('albums');
      setAlbums(res);
    } catch (err) {
      setMessage(err.message || 'Error getRequest albums');
    }
  };

  useEffect(() => {
    fetchAlbums();
    fetchMySongs();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAlbumChange = e => {
    setForm({ ...form, album_id: e.target.value === 'null' ? null : Number(e.target.value) });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await APIRequests.postRequest('songs', form);
      setMessage(user.accessType === 'admin'
        ? 'Song uploaded successfully.'
        : 'Song uploaded and pending admin approval.');
      setForm({
        name: '',
        lyrics: '',
        genre: '',
        file_path: '',
        album_id: ''
      });
      fetchMySongs();
    } catch (err) {
      setMessage(err.message || 'Error uploading song');
    }
  };

  return (
    <div className={styles.pageWrap}>
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Upload New Song</h2>

        <input
          name="name"
          placeholder="Song Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="lyrics"
          placeholder="Lyrics"
          value={form.lyrics}
          onChange={handleChange}
          required
        />
        <input
          name="genre"
          placeholder="Genre"
          value={form.genre}
          onChange={handleChange}
          required
        />
        <input
          name="file_path"
          placeholder="File Path (URL or local path)"
          value={form.file_path}
          onChange={handleChange}
          required
        />

        <select
          className={styles.select}
          onChange={handleAlbumChange}
          required
          defaultValue=""
        >
          <option value="" disabled>Select Album</option>
          <option value="null">No Album</option>
          {albums.map(album => (
            <option key={album.id} value={album.name}>
              {album.name}
            </option>
          ))}
        </select>

        <button className={styles.submit} type="submit">Upload Song</button>
        {message && <div className={styles.message}>{message}</div>}
      </form>
    </div><div className={styles.dashboard}>
        <h2 className={styles.dashTitle}>My Songs & Status</h2>
        
        {songsLoading && <p className={styles.dashLoading}>Loading your songs...</p>}
        
        {songsError && <div className={styles.msgError}>{songsError}</div>}
        
        {!songsLoading && !songsError && songs.length === 0 && (
          <p className={styles.emptyMsg}>No songs uploaded yet.</p>
        )}

        {!songsLoading && !songsError && songs.length > 0 && (
          <div className={styles.songsList}>
            {songs.map(song => (
              <div 
                key={song.id} 
                className={`${styles.songCard} ${song.approved ? styles.cardApproved : styles.cardPending}`}
              >
                <div className={styles.songHeader}>
                  <span className={styles.songName}>{song.name}</span>
                  <span className={`${styles.badge} ${song.approved ? styles.badgeApproved : styles.badgePending}`}>
                    {song.approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                
                <div className={styles.songMeta}>
                  {song.genre && <span className={styles.metaTag}>{song.genre}</span>}
                  {song.album_name && <span className={styles.metaTag}>💿 {song.album_name}</span>}
                  <span className={styles.metaDate}>{fmtDate(song.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default UploadSong;
