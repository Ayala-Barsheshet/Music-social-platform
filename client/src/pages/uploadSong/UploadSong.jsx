import { useState, useEffect } from 'react';
import styles from './UploadSong.module.css';
import APIRequests from '../../services/APIRequests';
import { useUser } from "../../services/UserProvider";


const UploadSong = () => {
  const [albums, setAlbums] = useState([]);
  const [message, setMessage] = useState('');
  const { user } = useUser();
  const [form, setForm] = useState({
    name: '',
    lyrics: '',
    genre: '',
    file_path: '',
    album_id: ''
  });

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await APIRequests.getRequest('albums');
        setAlbums(res);
      } catch (err) {
        setMessage(err.message || 'Error getRequest albums');
      }
    };
    fetchAlbums();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // const handleAlbumChange = e => {
  //   const selected = albums.find(album => album.name === e.target.value);
  //   setForm({ ...form, album_id: selected?.id || '' });
  // };
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
    } catch (err) {
      setMessage(err.message || 'Error uploading song');
    }
  };

  return (
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
    </div>
  );
};

export default UploadSong;
