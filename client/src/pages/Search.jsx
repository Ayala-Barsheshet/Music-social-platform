
import React, { useEffect, useState } from "react";
import APIRequests from "../services/APIRequests";
import { useNavigate } from "react-router-dom";
import "./SongSearchPage.css"; // ✅ חיבור לקובץ העיצוב

const SongSearchPage = () => {
    const [songs, setSongs] = useState([]);
    const [searchType, setSearchType] = useState("name");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [filteredSongs, setFilteredSongs] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem(
            "token",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoibXl2dXNlciIsImFjY2Vzc1R5cGUiOiJhZG1pbiJ9.d-zDT3JPsYovlJbmTrIdnVHZCzIocva9mM_e8d3349k"
        );
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
                <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="search-select"
                >
                    <option value="name">Song Name</option>
                    <option value="artist_name">Artist</option>
                    <option value="album_name">Album</option>
                </select>

                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />

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









// import React, { useEffect, useState } from "react";
// import APIRequests from "../services/APIRequests"
// import { useNavigate } from "react-router-dom";

// const SongSearchPage = () => {
//     const [songs, setSongs] = useState([]);
//     const [searchType, setSearchType] = useState("name");
//     const [searchQuery, setSearchQuery] = useState("");
//     const [sortOption, setSortOption] = useState("");
//     const [filteredSongs, setFilteredSongs] = useState([]);

//     const navigate = useNavigate();

//     useEffect(() => {
//         localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoibXl2dXNlciIsImFjY2Vzc1R5cGUiOiJhZG1pbiJ9.d-zDT3JPsYovlJbmTrIdnVHZCzIocva9mM_e8d3349k");
//         APIRequests.getRequest("songs").then(setSongs);
//     }, []);

//     useEffect(() => {
//         let filtered = [...songs];

//         if (searchQuery) {
//             filtered = filtered.filter(song =>
//                 song[searchType]?.toLowerCase().includes(searchQuery.toLowerCase())
//             );
//         }

//         switch (sortOption) {
//             case "date":
//                 filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
//                 break;
//             case "genre":
//                 filtered.sort((a, b) => a.genre.localeCompare(b.genre));
//                 break;
//             case "album":
//                 filtered.sort((a, b) => a.album_name.localeCompare(b.album_name));
//                 break;
//         }

//         setFilteredSongs(filtered);
//     }, [songs, searchQuery, searchType, sortOption]);

//     const groupByAlbum = (songsList) => {
//         const grouped = {};
//         songsList.forEach(song => {
//             if (!grouped[song.album_name]) grouped[song.album_name] = [];
//             grouped[song.album_name].push(song);
//         });
//         return grouped;
//     };

//     return (
//         <div className="p-6">
//             <div className="flex gap-4 mb-6 items-center">
//                 <select
//                     value={searchType}
//                     onChange={(e) => setSearchType(e.target.value)}
//                     className="p-2 border rounded"
//                 >
//                     <option value="name">Song Name</option>
//                     <option value="artist_name">Artist</option>
//                     <option value="album_name">Album</option>
//                 </select>

//                 <input
//                     type="text"
//                     placeholder="Search..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-[300px] p-2 border rounded"
//                 />

//                 <select
//                     value={sortOption}
//                     onChange={(e) => setSortOption(e.target.value)}
//                     className="p-2 border rounded"
//                 >
//                     <option value="">Sort by</option>
//                     <option value="date">Date</option>
//                     <option value="genre">Genre</option>
//                     <option value="album">Album</option>
//                 </select>
//             </div>

//             <div className="grid grid-cols-7 gap-4">
//                 {sortOption === "album" ? (
//                     Object.entries(groupByAlbum(filteredSongs)).map(([albumName, songs]) => (
//                         <div key={albumName} className="col-span-7">
//                             <h2 className="text-xl font-bold mb-2">Album: {albumName}</h2>
//                             <div className="grid grid-cols-7 gap-2">
//                                 {songs.map((song) => (
//                                     <div
//                                         key={song.id}
//                                         onClick={() => navigate(`/song/${song.id}`)}
//                                         className="p-2 rounded-lg shadow hover:bg-gray-100 cursor-pointer"
//                                     >
//                                         <p className="font-semibold">{song.name}</p>
//                                         <p className="text-sm">{song.artist_name}</p>
//                                         <p className="text-xs text-gray-500">{song.genre}</p>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     filteredSongs.map((song) => (
//                         <div
//                             key={song.id}
//                             onClick={() => navigate(`/song/${song.id}`)}
//                             className="p-2 rounded-lg shadow hover:bg-gray-100 cursor-pointer"
//                         >
//                             <p className="font-semibold">{song.name}</p>
//                             <p className="text-sm">{song.artist_name}</p>
//                             <p className="text-xs text-gray-500">{song.genre}</p>
//                         </div>
//                     ))
//                 )}
//             </div>
//         </div>
//     );
// };

// export default SongSearchPage;




















// // import React, { useEffect, useState } from "react";
// // import APIRequests from "../api/APIRequests";
// // import { useNavigate } from "react-router-dom";
// // import { Input } from "@/components/ui/input";
// // import { Button } from "@/components/ui/button";
// // import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

// // const SongSearchPage = () => {
// //   const [songs, setSongs] = useState([]);
// //   const [searchType, setSearchType] = useState("name");
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [sortOption, setSortOption] = useState("");
// //   const [filteredSongs, setFilteredSongs] = useState([]);

// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     APIRequests.getRequest("songs").then(setSongs);
// //   }, []);

// //   useEffect(() => {
// //     let filtered = [...songs];

// //     if (searchQuery) {
// //       filtered = filtered.filter(song =>
// //         song[searchType]?.toLowerCase().includes(searchQuery.toLowerCase())
// //       );
// //     }

// //     switch (sortOption) {
// //       case "date":
// //         filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
// //         break;
// //       case "genre":
// //         filtered.sort((a, b) => a.genre.localeCompare(b.genre));
// //         break;
// //       case "album":
// //         filtered.sort((a, b) => a.album_id - b.album_id);
// //         break;
// //     }

// //     setFilteredSongs(filtered);
// //   }, [songs, searchQuery, searchType, sortOption]);

// //   const groupByAlbum = (songsList) => {
// //     const grouped = {};
// //     songsList.forEach(song => {
// //       if (!grouped[song.album_id]) grouped[song.album_id] = [];
// //       grouped[song.album_id].push(song);
// //     });
// //     return grouped;
// //   };

// //   return (
// //     <div className="p-6">
// //       <div className="flex gap-4 mb-6 items-center">
// //         <Select onValueChange={setSearchType} defaultValue="name">
// //           <SelectTrigger className="w-[150px]">
// //             <SelectValue placeholder="Search by" />
// //           </SelectTrigger>
// //           <SelectContent>
// //             <SelectItem value="name">Song Name</SelectItem>
// //             <SelectItem value="artist_name">Artist</SelectItem>
// //             <SelectItem value="album_id">Album ID</SelectItem>
// //           </SelectContent>
// //         </Select>

// //         <Input
// //           placeholder="Search..."
// //           value={searchQuery}
// //           onChange={(e) => setSearchQuery(e.target.value)}
// //           className="w-[300px]"
// //         />

// //         <Select onValueChange={setSortOption} defaultValue="">
// //           <SelectTrigger className="w-[180px]">
// //             <SelectValue placeholder="Sort by" />
// //           </SelectTrigger>
// //           <SelectContent>
// //             <SelectItem value="date">Date</SelectItem>
// //             <SelectItem value="genre">Genre</SelectItem>
// //             <SelectItem value="album">Album</SelectItem>
// //           </SelectContent>
// //         </Select>
// //       </div>

// //       <div className="grid grid-cols-7 gap-4">
// //         {sortOption === "album" ? (
// //           Object.entries(groupByAlbum(filteredSongs)).map(([albumId, songs]) => (
// //             <div key={albumId} className="col-span-7">
// //               <h2 className="text-xl font-bold mb-2">Album #{albumId}</h2>
// //               <div className="grid grid-cols-7 gap-2">
// //                 {songs.map((song) => (
// //                   <div
// //                     key={song.id}
// //                     onClick={() => navigate(`/song/${song.id}`)}
// //                     className="p-2 rounded-lg shadow hover:bg-gray-100 cursor-pointer"
// //                   >
// //                     <p className="font-semibold">{song.name}</p>
// //                     <p className="text-sm">{song.artist_name}</p>
// //                     <p className="text-xs text-gray-500">{song.genre}</p>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           ))
// //         ) : (
// //           filteredSongs.map((song) => (
// //             <div
// //               key={song.id}
// //               onClick={() => navigate(`/song/${song.id}`)}
// //               className="p-2 rounded-lg shadow hover:bg-gray-100 cursor-pointer"
// //             >
// //               <p className="font-semibold">{song.name}</p>
// //               <p className="text-sm">{song.artist_name}</p>
// //               <p className="text-xs text-gray-500">{song.genre}</p>
// //             </div>
// //           ))
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default SongSearchPage;
