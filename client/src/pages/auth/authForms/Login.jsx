import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../../services/UserProvider';
import APIRequests from '../../../services/APIRequests';
import styles from './AuthForms.module.css';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await APIRequests.postRequest(`users/login`, {
        username,
        password,
      });
      const user = response.user;
      const token = response.token;
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      setUser(user);
      navigate(`/home`);
    } catch (error) {
      setError(error.message || 'An error occurred during login');
    }
  };

  return (
    <div className={styles.pageBackground}>
      <div className={styles.container}>
        <h2 className={styles.title}>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>User Name:</label>
            <input
              type="text"
              value={username}
              className={styles.input}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              className={styles.input}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            {error && <p className={styles.message}>{error}</p>}
          </div>
          <button type="submit" className={styles.submitButton}>
            Connect
          </button>
        </form>
        <Link to="/register" className={styles.link}>
          Don't have an account? Register here
        </Link>
      </div>
    </div>
  );
}

export default Login;
