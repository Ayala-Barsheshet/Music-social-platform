// import React, { useState } from "react";
// import APIRequests from "../../services/APIRequests";
// import { useUser } from '../../services/UserProvider';

// import styles from "./Settings.module.css"; // אפשר לעצב איך שתרצי

// const Settings = () => {
//     const { user } = useUser();

//   const [form, setForm] = useState({ username: user.username, email: user.email });
//   const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
//   const [message, setMessage] = useState("");

//   const handleAllChanges = async (e) => {
//     e.preventDefault();
//     let msg = "";

//     // שלב 1 – עדכון פרטים אישיים
//     const infoRes = await APIRequests.updateUserInfo(user.id, form);
//     if (infoRes.success) {
//       sessionStorage.setItem("currentUser", JSON.stringify({ ...user, ...form }));
//       setUser({ ...user, ...form });
//       msg += "הפרטים עודכנו. ";
//     }

//     // שלב 2 – שינוי סיסמה
//     if (passwords.current && passwords.new && passwords.confirm) {
//       if (passwords.new !== passwords.confirm) {
//         msg += "סיסמה חדשה ואימות לא תואמים. ";
//       } else {
//         const passRes = await APIRequests.changePassword(user.id, passwords);
//         msg += passRes.success ? "סיסמה עודכנה. " : (passRes.message || "שגיאה בשינוי סיסמה. ");
//       }
//     }

//     // שלב 3 – בקשת אמן
//     if (!user.requested_artist) {
//       const artistRes = await APIRequests.requestArtist(user.id);
//       if (artistRes.success) {
//         const updatedUser = { ...user, requested_artist: 1 };
//         setUser(updatedUser);
//         sessionStorage.setItem("currentUser", JSON.stringify(updatedUser));
//         msg += "בקשתך להפוך לאמן נשלחה. ";
//       }
//     }

//     setMessage(msg);
//   };

//   return (
//     <div className={styles.settings}>
//       <h2>הגדרות משתמש</h2>
//       <form onSubmit={handleAllChanges}>
//         <h3>פרטים אישיים</h3>
//         <input
//           type="text"
//           value={form.username}
//           onChange={(e) => setForm({ ...form, username: e.target.value })}
//           placeholder="שם משתמש"
//         />
//         <input
//           type="email"
//           value={form.email}
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//           placeholder="אימייל"
//         />

//         <h3>שינוי סיסמה</h3>
//         <input
//           type="password"
//           placeholder="סיסמה נוכחית"
//           onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
//         />
//         <input
//           type="password"
//           placeholder="סיסמה חדשה"
//           onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
//         />
//         <input
//           type="password"
//           placeholder="אימות סיסמה חדשה"
//           onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
//         />

//         <h3>בקשה להפוך לאמן</h3>
//         {user.requested_artist ? (
//           <p>בקשה נשלחה – ממתינה לאישור</p>
//         ) : (
//           <p>לחיצה על כפתור "שמור שינויים" תשלח גם בקשה להפוך לאמן</p>
//         )}

//         <button type="submit">שמור שינויים</button>
//       </form>

//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default Settings;


import React, { useEffect, useState } from "react";
import APIRequests from "../../services/APIRequests";
import { useUser } from "../../services/UserProvider";
import styles from "./Settings.module.css";

const Settings = () => {
  const { user, setUser } = useUser();
  const [form, setForm] = useState({ username: "", email: "" });
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [message, setMessage] = useState("");
  const [artistMessage, setArtistMessage] = useState("");

  // טען את פרטי המשתמש לתוך הטופס
  useEffect(() => {
    if (user) {
      setForm({ username: user.username, email: user.email });
    }
  }, [user]);

  // עדכון פרטים אישיים
  const handleUpdateInfo = async () => {
    const res = await APIRequests.updateUserInfo(user.id, form);
    if (res.success) {
      const updatedUser = { ...user, ...form };
      setUser(updatedUser);
      sessionStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setMessage("הפרטים עודכנו בהצלחה.");
    } else {
      setMessage("שגיאה בעדכון פרטים.");
    }
  };

  // שינוי סיסמה
  const handlePasswordChange = async () => {
    const { current, new: newPass, confirm } = passwords;
    if (!current || !newPass || !confirm) {
      return setMessage("יש למלא את כל שדות הסיסמה.");
    }
    if (newPass !== confirm) {
      return setMessage("סיסמה חדשה ואימות אינם תואמים.");
    }
    console.log({ email: null, phone: null, name: null, username: null, currentPassword: current, newPassword: newPass });

    const res = await APIRequests.patchRequest('users',{ email: null, phone: null, name: null, username: null, currentPassword: current, newPassword: newPass }
);
    if (res) {
      setMessage("הסיסמה עודכנה בהצלחה.");
      setPasswords({ current: "", new: "", confirm: "" });
    } else {
      setMessage(res.message || "שגיאה בעדכון סיסמה.");
    }
  };

  // בקשה להפוך לאמן
  const handleArtistRequest = async () => {
    if (user.requested_artist) {
      setArtistMessage("כבר שלחת בקשה.");
      return;
    }
    const res = await APIRequests.patchRequest('users' , { requested_artist: 1 });
    if (res.success) { 
      setArtistMessage("הבקשה נשלחה וממתינה לאישור מנהל.");
    } else {
      setArtistMessage("שגיאה בשליחת הבקשה.");
    }
  };

  return (
    <div className={styles.settings}>
      <h2>הגדרות משתמש</h2>

      {/* שינוי פרטים */}
      <h3>פרטים אישיים</h3>
      <input
        type="text"
        value={form.username}
        placeholder="שם משתמש"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        type="email"
        value={form.email}
        placeholder="אימייל"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <button onClick={handleUpdateInfo}>עדכן פרטים</button>

      {/* שינוי סיסמה */}
      <h3>שינוי סיסמה</h3>
      <input
        type="password"
        placeholder="סיסמה נוכחית"
        value={passwords.current}
        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
      />
      <input
        type="password"
        placeholder="סיסמה חדשה"
        value={passwords.new}
        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
      />
      <input
        type="password"
        placeholder="אימות סיסמה חדשה"
        value={passwords.confirm}
        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
      />
      <button onClick={handlePasswordChange}>שנה סיסמה</button>

      {/* בקשה להיות אמן */}
      <h3>בקשה להפוך לאמן</h3>
      {user.requested_artist ? (
        <p>בקשתך כבר נשלחה. המתן לאישור המנהל.</p>
      ) : (
        <button onClick={handleArtistRequest}>שלח בקשה להפוך לאמן</button>
      )}

      {/* הודעות */}
      {message && <p>{message}</p>}
      {artistMessage && <p>{artistMessage}</p>}
    </div>
  );
};

export default Settings;
