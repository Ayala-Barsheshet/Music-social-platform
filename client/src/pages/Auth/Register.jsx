import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../services/UserProvider';
import axios from 'axios';

export function Register() {
  // const { currentUser } = useUser(); 
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    website: '',
    verifyWebsite: '',
    email: '',
    phone: '',
    id: '',
    name: '',
  });

  const handleInputChange = ({ target: { name, value } }) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.website !== formData.verifyWebsite) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post(`http://localhost:3000/users`, {
        username: formData.username, password: formData.website,
      });
      const user = response.data;
      setUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      setStep(2);
      setError('');
    } catch (error) {
      setError(error.response?.data?.error);
    }
  };

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    try {  
      const response = await axios.patch(`http://localhost:3000/users`, formData ); 
      const user = response.data;  
      localStorage.setItem('currentUser', JSON.stringify(user));
      setUser(user);
      navigate(`/home`)
    } catch (error) {
      setError(error.response?.data?.error);
    }
  };

  return (
    <div>
      <h2>{step === 1 ? 'Register' : 'Complete Your Registration'}</h2>

      {step === 1 ? (
        <>
          <form onSubmit={handleRegister}>
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
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Verify Password:</label>
              <input
                type="password"
                name="verifyWebsite"
                value={formData.verifyWebsite}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
            <button type="submit">Register</button>

          </form>
          <Link to='/login'>Already registered? Login here</Link>
        </>

      ) : (
        <form onSubmit={handleCompleteRegistration}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
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
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>ID:</label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Complete Registration</button>
        </form>
      )}

    </div>
  );
}

export default Register;
