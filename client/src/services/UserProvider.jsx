import { useEffect, createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);

  }, []);

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
