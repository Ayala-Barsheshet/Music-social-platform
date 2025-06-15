import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../services/UserProvider';
import APIRequests from '../../services/APIRequests';

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
        email: formData.email
      });
      const user = response.user;
      const token = response.token;
      setUser(user);
      sessionStorage.setItem('token', JSON.stringify(token));//for server
      sessionStorage.setItem('currentUser', JSON.stringify(user));//for UI purpose
      navigate('/home');
    } catch (error) {
      setError(error.message || 'An error occurred during registration');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
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
            onChange={handleInputChange}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Register</button>
      </form>
      <Link to='/login'>Already registered? Login here</Link>
    </div>
  );
}

export default Register;
