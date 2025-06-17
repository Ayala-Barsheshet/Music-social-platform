import React, { useEffect, useState } from "react";
import APIRequests from "../../services/APIRequests";
import { useUser } from "../../services/UserProvider";
import styles from "./Settings.module.css";

const Settings = () => {
  const { user, setUser } = useUser();
  const [form, setForm] = useState({ username: "", email: "" });
  const [message, setMessage] = useState("");
  const [artistMessage, setArtistMessage] = useState("");


  // Load user details into the form
  useEffect(() => {
    if (user) {
      setForm({ username: user.username, email: user.email });
    }
  }, [user]);

  // Update personal info
  const handleUpdateInfo = async () => {
    try {
      await APIRequests.patchRequest('users', { username: form.username, email: form.email });
      const updatedUser = { ...user, ...form };
      setUser(updatedUser);
      sessionStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setMessage("Details updated successfully");
    } catch (error) {
      setMessage("Error updating details");
    }
  };

  // Request to become an artist
  const handleArtistRequest = async () => {
    try {
      await APIRequests.patchRequest('users', { requested_artist: 1 });
      setArtistMessage("Your request has been sent and is awaiting admin approval.");
    }
    catch (err) {
      setArtistMessage(err.message);
    }
  };

  return (
    <div className={styles.settings}>
      <h2>User Settings</h2>

      {/* Update details */}
      <h3>Personal Details</h3>
      <input
        type="text"
        value={form.username}
        placeholder="Username"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        type="email"
        value={form.email}
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <button onClick={handleUpdateInfo}>Update Details</button>

      {/* Request to become an artist */}
      {user.accessType === "user" && (
        <>
          <h3>Request to Become an Artist</h3>
          {user.requested_artist ? (
            <p>Your request has already been sent. Please wait for admin approval.</p>
          ) : (
            <button onClick={handleArtistRequest}>Send Request to Become an Artist</button>
          )}
        </>
      )}

      {message && <p className={styles.successMessage}>{message}</p>}
      {artistMessage && <p>{artistMessage}</p>}
    </div>
  );
};

export default Settings;
