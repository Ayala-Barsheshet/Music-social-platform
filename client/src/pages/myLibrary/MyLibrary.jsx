import React from "react";
import PlaylistsManager from "../../comp/playlistsManager/PlaylistsManager";
import FavoriteSongsManager from "../../comp/favoriteSongsManager/FavoriteSongsManager";
import styles from "./MyLibrary.module.css";

const MyLibrary = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Library</h1>
      <p className={styles.subtitle}>Here you can find your saved music and playlists.</p>

      <div className={styles.content}>
        <div className={styles.leftPanel}>
          <PlaylistsManager />
        </div>
        <div className={styles.rightPanel}>
          <FavoriteSongsManager />
        </div>
      </div>
    </div>
  );
};

export default MyLibrary;
