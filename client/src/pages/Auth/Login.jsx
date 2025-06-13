// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useUser } from '../Auth/UserProvider';
// import axios from 'axios';

// export function Login() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const { setUser } = useUser();
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.get(`http://localhost:3000/users/?username=${username}`, {
//         params: { password: password }
//       })
//       const user = response.data;
//       setUser(user);
//       localStorage.setItem('currentUser', JSON.stringify(user));
//       navigate(`/home`);
//     } catch (error) {
//       setError(error.response?.data?.error); 
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <form onSubmit={handleLogin}>
//         <div>
//           <label> User Name:</label>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           {error && <p style={{ color: 'red' }}>{error}</p>}
//         </div>
//         <button type="submit">Connect</button>
//       </form>
//       <Link to="/register">Don't have an account? Register here</Link>
//     </div>
//   );
// }

// export default Login;
