import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useUser } from "../../services/UserProvider";

const Navbar = () => {
  const { logout } = useUser();
  const { user } = useUser();

  return (
    <nav className={styles.navbar}>
      <h2 className={styles.logo}>MySpotify</h2>
      <ul className={styles.navLinks}>
        <button className={styles.logoutButton} onClick={logout}></button>
        <li><NavLink to="/" end></NavLink></li>
        <li><NavLink to="/my-library"></NavLink></li>
        <li><NavLink to="/search"></NavLink></li>
        <li><NavLink to="/settings"></NavLink></li>
        {(user.accessType === "artist" || user.accessType === "admin") && (
          <>
            <li><NavLink to="/upload-song"></NavLink></li>
            {user.accessType === "admin" && (
              <li><NavLink to="/access-control"></NavLink></li>
            )}
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;