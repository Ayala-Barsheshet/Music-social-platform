import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../services/UserProvider.jsx";
import Navbar from "../../comp/navbar/Navbar.jsx";
import MainRoutes from "../MainRoutes.jsx";
import styles from "./Layout.module.css"; 

const Layout = () => {
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>

  const isAuthenticated = !!user;

  return (
    <div className={styles.layoutContainer}>
      {isAuthenticated && (
        <aside className={styles.sidebar}>
          <Navbar />
        </aside>
      )}
      <main className={`${styles.mainContent} ${isAuthenticated ? styles.mainContentWithSidebar : ''}`}>
        <MainRoutes isAuthenticated={isAuthenticated} />
      </main>
    </div>
  );
};

export default Layout;