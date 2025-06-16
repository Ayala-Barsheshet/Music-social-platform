
import React, { useEffect, useState } from "react";
import APIRequests from "../services/APIRequests";
import { useNavigate } from "react-router-dom";
import "./SongSearchPage.css";

const SongSearchPage = () => {
    const [songs, setSongs] = useState([]);
    const [searchType, setSearchType] = useState("name");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [filteredSongs, setFilteredSongs] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const navigate = useNavigate();

    const searchTypes = {
        name: "Song Name",
        artist_name: "Artist",
        album_name: "Album",
    };

    useEffect(() => {
        APIRequests.getRequest("songs").then(setSongs);  
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
                filtered.sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );
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
        const f = (e) => !e.target.closest(".search-wrapper") && setDropdownOpen(false);
        document.addEventListener("click", f);
        return () => document.removeEventListener("click", f);
    }, []);

    const groupByAlbum = (songsList) => {
        const grouped = {};
        songsList.forEach((song) => {
            if (!grouped[song.album_name]) grouped[song.album_name] = [];
            grouped[song.album_name].push(song);
        });
        return grouped;
    };

    return (
        <div className="song-search-page">
            <div className="search-controls">
                <div className="search-wrapper">
                    <input
                        type="text"
                        placeholder={`Search by ${searchTypes[searchType]}`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        type="button"
                        className="search-dropdown-button"
                        onClick={() => setDropdownOpen((prev) => !prev)}
                    >
                    🔻
                    </button>

                    {dropdownOpen && (
                        <div className="search-dropdown">
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
                    className="search-select"
                >
                    <option value="">Sort by</option>
                    <option value="date">Date</option>
                    <option value="genre">Genre</option>
                    <option value="album">Album</option>
                </select>
            </div>

            <div className="songs-section">
                {sortOption === "album" ? (
                    Object.entries(groupByAlbum(filteredSongs)).map(
                        ([albumName, songs]) => (
                            <div key={albumName} className="songs-by-album">
                                <h2 className="album-title">Album: {albumName}</h2>
                                <div className="songs-container">
                                    {songs.map((song) => (
                                        <div
                                            key={song.id}
                                            onClick={() => navigate(`/song/${song.id}`)}
                                            className="song-card"
                                        >
                                            <p className="song-title">{song.name}</p>
                                            <p className="song-artist">{song.artist_name}</p>
                                            <p className="song-genre">{song.genre}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    )
                ) : (
                    <div className="songs-container">
                        {filteredSongs.map((song) => (
                            <div
                                key={song.id}
                                onClick={() => navigate(`/song/${song.id}`)}
                                className="song-card"
                            >
                                <p className="song-title">{song.name}</p>
                                <p className="song-artist">{song.artist_name}</p>
                                <p className="song-genre">{song.genre}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SongSearchPage;

