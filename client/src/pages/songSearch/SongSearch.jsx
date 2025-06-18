import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import APIRequests from "../../services/APIRequests";
import styles from "./SongSearch.module.css";

const SongSearch = () => {
    const { playlistId } = useParams();
    const [songs, setSongs] = useState([]);
    const [searchType, setSearchType] = useState("name");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [filteredSongs, setFilteredSongs] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [addedSongs, setAddedSongs] = useState([]);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const mode = playlistId ? "add-to-playlist" : "search";

    const searchTypes = {
        name: "Song Name",
        artist_name: "Artist",
        album_name: "Album",
    };

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const data = await APIRequests.getRequest("songs");
                setSongs(data);
            } catch (err) {
                setError(err.message || "Failed to fetch songs");
            }
        };
        fetchSongs();
    }, []);

    useEffect(() => {
        let filtered = [...songs];

        if (searchQuery) {
            filtered = filtered.filter((song) =>
                song[searchType]?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        switch (sortOption) {
            case "date":
                filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case "genre":
                filtered.sort((a, b) => a.genre.localeCompare(b.genre));
                break;
            case "album":
                filtered.sort((a, b) => a.album_name.localeCompare(b.album_name));
                break;
        }

        setFilteredSongs(filtered);
    }, [songs, searchQuery, searchType, sortOption]);

    useEffect(() => {
        const handleClickOutside = (e) =>
            !e.target.closest(`.${styles.searchWrapper}`) && setDropdownOpen(false);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const groupByAlbum = (songsList) => {
        const grouped = {};
        songsList.forEach((song) => {
            if (!grouped[song.album_name]) grouped[song.album_name] = [];
            grouped[song.album_name].push(song);
        });
        return grouped;
    };

    const handleAddSongToPlaylist = async (songId) => {
        try {
            await APIRequests.postRequest(`playlist-songs/${playlistId}/songs/${songId}`);
            setAddedSongs((prev) => [...prev, songId]);
        } catch (err) {
          setError(err.message || "Failed to fetch add song to playlist");
        }
    };

    return (
        <div className={styles.songSearchPage}>
        {error && (
            <div className={styles.errorMessage}>
                {error}
            </div>
        )}
            <div className={styles.searchControls}>
                <div className={styles.searchWrapper}>
                    <input
                        type="text"
                        placeholder={`Search by ${searchTypes[searchType]}`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        type="button"
                        className={styles.searchDropdownButton}
                        onClick={() => setDropdownOpen((prev) => !prev)}
                    >
                        🔻
                    </button>

                    {dropdownOpen && (
                        <div className={styles.searchDropdown}>
                            {Object.entries(searchTypes).map(([key, label]) => (
                                <div
                                    key={key}
                                    onClick={() => {
                                        setSearchType(key);
                                        setDropdownOpen(false);
                                    }}
                                >
                                    {label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className={styles.searchSelect}
                >
                    <option value="">Sort by</option>
                    <option value="date">Date</option>
                    <option value="genre">Genre</option>
                    <option value="album">Album</option>
                </select>
            </div>

            {mode === "add-to-playlist" && (
                <button
                    className={styles.backToPlaylistButton}
                    onClick={() => navigate(`/playlists-songs/${playlistId}`)}
                >
                    ← Back to Playlist
                </button>
            )}

            <div className={styles.songsSection}>
                {sortOption === "album" ? (
                    Object.entries(groupByAlbum(filteredSongs)).map(
                        ([albumName, songs]) => (
                            <div key={albumName} className={styles.songsByAlbum}>
                                <h2 className={styles.albumTitle}> '{albumName}' by {songs[0].artist_name}</h2>
                                <div className={styles.songsContainer}>
                                    {songs.map((song) => (
                                        <div
                                            key={song.id}
                                            onClick={() => navigate(`/songs/${song.id}`)}
                                            className={styles.songCard}
                                        >
                                            <p className={styles.songTitle}>{song.name}</p>
                                            <p className={styles.songArtist}>{song.artist_name}</p>
                                            <p className={styles.songGenre}>{song.genre}</p>
                                            {mode === "add-to-playlist" && (
                                                <button
                                                    className={`${styles.addButton} ${addedSongs.includes(song.id) ? styles.added : ""
                                                        }`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAddSongToPlaylist(song.id);
                                                    }}
                                                    disabled={addedSongs.includes(song.id)}
                                                >
                                                    {addedSongs.includes(song.id) ? "v" : "+"}
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    )
                ) : (
                    <div className={styles.songsContainer}>
                        {filteredSongs.map((song) => (
                            <div
                                key={song.id}
                                onClick={() => navigate(`/songs/${song.id}`)}
                                className={styles.songCard}
                            >
                                <p className={styles.songTitle}>{song.name}</p>
                                <p className={styles.songArtist}>{song.artist_name}</p>
                                <p className={styles.songGenre}>{song.genre}</p>
                                {mode === "add-to-playlist" && (
                                    <button
                                        className={`${styles.addButton} ${addedSongs.includes(song.id) ? styles.added : ""
                                            }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddSongToPlaylist(song.id);
                                        }}
                                        disabled={addedSongs.includes(song.id)}
                                    >
                                        {addedSongs.includes(song.id) ? "v" : "+"}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SongSearch;
