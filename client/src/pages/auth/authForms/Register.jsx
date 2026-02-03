import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../../services/UserProvider';
import APIRequests from '../../../services/APIRequests';
import styles from './AuthForms.module.css'; 

export function Register() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    verifyPassword: '',
    email: '',
  });

  const handleInputChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.verifyPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await APIRequests.postRequest(`users/register`, {
        username: formData.username,
        password: formData.password,
        email: formData.email,
      });
      const user = response.user;
      const token = response.token;
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      sessionStorage.setItem('token', token);
      setUser(user);
      navigate('/home');
    } catch (error) {
      setError(error.message || 'An error occurred during registration');
    }
  };

  return (
    <div className={styles.pageBackground}>
      <div className={styles.container}>
        <h2 className={styles.title}>Register</h2>
        <form onSubmit={handleRegister}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              className={styles.input}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              className={styles.input}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              className={styles.input}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Verify Password:</label>
            <input
              type="password"
              name="verifyPassword"
              value={formData.verifyPassword}
              className={styles.input}
              onChange={handleInputChange}
              required
            />
          </div>
          {error && <p className={styles.message}>{error}</p>}
          <button type="submit" className={styles.submitButton}>
            Register
          </button>
        </form>
        <Link to='/login' className={styles.link}>
          Already registered? Login here
        </Link>
      </div>
    </div>
  );
}

export default Register;
