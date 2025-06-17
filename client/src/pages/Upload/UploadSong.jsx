// // import React, { useState } from 'react';
// // import styles from './UploadSong.module.css';
// // import APIRequests from '../../services/APIRequests'; // Adjust the path as necessary

// // const UploadSong = () => {
// //   const [formData, setFormData] = useState({
// //     name: '',
// //     lyrics: '',
// //     artist_name: '',
// //     genre: '',
// //     file_path: '',
// //   });
// //   const [message, setMessage] = useState('');

// //   const handleChange = (e) => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       [e.target.name]: e.target.value,
// //     }));
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     try {
// //       const res = await APIRequests.postRequest('songs', formData);
// //       if (res.ok) {
// //         setMessage('✅ השיר הועלה וממתין לאישור מנהל.');
// //         setFormData({ name: '', lyrics: '', artist_name: '', genre: '', file_path: '' });
// //       } else {
// //         setMessage('❌ תקלה בהעלאה. נסה שוב.');
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       setMessage('❌ תקלה בשרת. נסה מאוחר יותר.');
// //     }
// //   };

// //   return (
// //     <div className={styles.container}>
// //       <h2 className={styles.title}>העלאת שיר חדש</h2>
// //       <form onSubmit={handleSubmit} className={styles.form}>
// //         <input
// //           name="name"
// //           value={formData.name}
// //           onChange={handleChange}
// //           placeholder="שם השיר"
// //           className={styles.input}
// //           required
// //         />
// //         <textarea
// //           name="lyrics"
// //           value={formData.lyrics}
// //           onChange={handleChange}
// //           placeholder="מילים"
// //           className={styles.textarea}
// //         />
// //         <input
// //           name="artist_name"
// //           value={formData.artist_name}
// //           onChange={handleChange}
// //           placeholder="שם האמן"
// //           className={styles.input}
// //           required
// //         />
// //         <input
// //           name="genre"
// //           value={formData.genre}
// //           onChange={handleChange}
// //           placeholder="ז׳אנר"
// //           className={styles.input}
// //           required
// //         />
// //         <input
// //           name="file_path"
// //           value={formData.file_path}
// //           onChange={handleChange}
// //           placeholder="קובץ (URL או נתיב)"
// //           className={styles.input}
// //           required
// //         />
// //         <button type="submit" className={styles.button}>העלה שיר</button>
// //       </form>
// //       {message && <p className={styles.message}>{message}</p>}
// //     </div>
// //   );
// // };

// // export default UploadSong;







// import React, { useState, useEffect } from 'react';
// import styles from './UploadSong.module.css';
// import APIRequests from '../../services/APIRequests';

// const UploadSong = () => {
//   const [form, setForm] = useState({
//     name: '',
//     lyrics: '',
//     genre: '',
//     file_path: '',
//     album_id: ''
//   });

//   const [albums, setAlbums] = useState([]);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     const fetchAlbums = async () => {
//       try {
//         const res = await APIRequests.getRequest('albums');
//         setAlbums(res);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchAlbums();
//   }, []);

//   const handleChange = e => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleAlbumChange = e => {
//     const selected = albums.find(album => album.name === e.target.value);
//     setForm({ ...form, album_id: selected?.id || '' });
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       await APIRequests.postRequest('songs', form);
//       setMessage('✅ השיר הועלה וממתין לאישור מנהל.');
//       setForm({
//         name: '',
//         lyrics: '',
//         genre: '',
//         file_path: '',
//         album_id: ''
//       });
//     } catch (err) {
//       setMessage('❌ שגיאה בהעלאת השיר');
//       console.error(err);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <form className={styles.form} onSubmit={handleSubmit}>
//         <h2 className={styles.title}>העלאת שיר</h2>

//         <input name="name" placeholder="שם השיר" value={form.name} onChange={handleChange} required />
//         <textarea name="lyrics" placeholder="מילים לשיר" value={form.lyrics} onChange={handleChange} required />
//         <input name="genre" placeholder="ז'אנר" value={form.genre} onChange={handleChange} required />
//         <input name="file_path" placeholder="נתיב קובץ" value={form.file_path} onChange={handleChange} required />

//         <select className={styles.select} onChange={handleAlbumChange} required defaultValue="">
//           <option value="" disabled>בחר אלבום</option>
//           {albums.map(album => (
//             <option key={album.id} value={album.name}>{album.name}</option>
//           ))}
//         </select>

//         <button className={styles.submit} type="submit">העלה שיר</button>
//         {message && <div className={styles.message}>{message}</div>}
//       </form>
//     </div>
//   );
// };

// export default UploadSong;
import React, { useState, useEffect } from 'react';
import styles from './UploadSong.module.css';
import APIRequests from '../../services/APIRequests';

const UploadSong = () => {
  const [form, setForm] = useState({
    name: '',
    lyrics: '',
    genre: '',
    file_path: '',
    album_id: ''
  });

  const [albums, setAlbums] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await APIRequests.getRequest('albums');
        setAlbums(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAlbums();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAlbumChange = e => {
    const selected = albums.find(album => album.name === e.target.value);
    setForm({ ...form, album_id: selected?.id || '' });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await APIRequests.postRequest('songs', form);
      setMessage('✅ Song uploaded and pending admin approval.');
      setForm({
        name: '',
        lyrics: '',
        genre: '',
        file_path: '',
        album_id: ''
      });
    } catch (err) {
      setMessage('❌ Error uploading song');
      console.error(err);
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
