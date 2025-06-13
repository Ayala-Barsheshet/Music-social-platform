import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../services/UserProvider';
import APIRequests from '../../services/APIRequests';
// import axios from 'axios';
// import "../Auth/Login.css"

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await APIRequests.getRequest(`users?username=${username}&password=${password}`)
      const user = response.username;
      const token = response.token; 
      setUser(user);
      localStorage.setItem('token', JSON.stringify(token));//for server
      localStorage.setItem('currentUser', JSON.stringify(user));//for UI porpose the username
      navigate(`/home`);
    } catch (error) {
      setError(error.response?.data?.error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label> User Name:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
        <button type="submit">Connect</button>
      </form>
      <Link to="/register">Don't have an account? Register here</Link>
    </div>
  );
}

export default Login;
