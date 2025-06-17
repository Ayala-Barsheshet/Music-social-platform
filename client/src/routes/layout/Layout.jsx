// import React, { useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useUser } from "../../services/UserProvider.jsx";
// import Navbar from "../../comp/navbar/Navbar.jsx";
// import MainRoutes from "../MainRoutes.jsx";

// const Layout = () => {
//   const { user } = useUser();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const isAuthenticated = !!user

//   // useEffect(() => {
//   //   if (!isAuthenticated && !location.pathname.includes("login") && !location.pathname.includes("register")) {
//   //     alert("Please log in - access is not allowed without authentication!");
//   //     navigate("/login");
//   //   }
//   // }, [isAuthenticated, location.pathname]);

// //   useEffect(() => {
// //   // if (user === null) return;
// //   if (
// //     !user &&
// //     !location.pathname.includes("login") &&
// //     !location.pathname.includes("register")
// //   ) {
// //     alert("Please log in - access is not allowed without authentication!");
// //     navigate("/login");
// //   }
// // }, [user]);
// useEffect(() => {
//   if (
//     !user &&
//     !location.pathname.includes("login") &&
//     !location.pathname.includes("register")
//   ) {
//     alert("Please log in - access is not allowed without authentication!");
//     navigate("/login");
//   }
// }, [user, location.pathname]);


//   return (
//     <div className="app-container">
//       {isAuthenticated && <Navbar />}
//       <main className="main-content">
//         <MainRoutes isAuthenticated ={isAuthenticated} />
//       </main>
//     </div>
//   );
// };

// export default Layout;
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../services/UserProvider.jsx";
import Navbar from "../../comp/navbar/Navbar.jsx";
import MainRoutes from "../MainRoutes.jsx";
import styles from "./Layout.module.css"; // ← הוספנו את המודול

const Layout = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = !!user;

  useEffect(() => {
    if (
      !user &&
      !location.pathname.includes("login") &&
      !location.pathname.includes("register")
    ) {
      alert("Please log in - access is not allowed without authentication!");
      navigate("/login");
    }
  }, [user, location.pathname]);

  return (
    <div className={styles.layoutContainer}>
      {isAuthenticated && (
        <aside className={styles.sidebar}>
          <Navbar />
        </aside>
      )}
      <main className={styles.mainContent}>
        <MainRoutes isAuthenticated={isAuthenticated} />
      </main>
    </div>
  );
};

export default Layout;
