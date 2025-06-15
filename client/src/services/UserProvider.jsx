// import { useEffect, createContext, useContext, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const UserContext = createContext();

// export function UserProvider({ children }) {

//   const navigate = useNavigate()

//   useEffect(() => {
//     const storedUser = JSON.parse(sessionStorage.getItem('currentUser'));
//     if (storedUser) {
//       setUser(storedUser);
//     }
//     else if (!window.location.pathname.includes('/login')) {
//       alert('אנא הכנס - לא תנתן אפשרות כניסה ללא שם משתמש\n אתה יכול להמשיך להתחכם מלא זמן זה לא יעזור לך!!!')
//       navigate('/login')
//     }
//   }, []);

//   const [user, setUser] = useState(null);

//   const logout = () => {
//     setUser(null);
//     sessionStorage.removeItem('currentUser');
//   };

//   return (
//     <UserContext.Provider value={{ user, setUser, logout }}>
//       {children}
//     </UserContext.Provider>
//   );
// }

// export function useUser() {
//   return useContext(UserContext);
// }


import { useEffect, createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('currentUser');
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
