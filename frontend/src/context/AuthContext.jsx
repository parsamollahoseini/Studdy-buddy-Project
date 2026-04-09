import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('access_token'));
  const [user, setUser] = useState(null);

  // Decode JWT payload (base64) to get user info — no verification needed client-side
  const decodeToken = (t) => {
    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      return payload;
    } catch {
      return null;
    }
  };

  // Sync axios default header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(decodeToken(token));
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('access_token', newToken);
    setToken(newToken);
  };

  const logout = async () => {
    const currentUser = decodeToken(token);
    if (token && currentUser?.demo) {
      try {
        await axios.post('http://localhost:8000/api/auth/demo/reset');
      } catch (error) {
        console.error('Failed to reset demo account during logout', error);
      }
    }

    Object.keys(localStorage)
      .filter(key => key.startsWith('quiz_result_') || key.startsWith('note_'))
      .forEach(key => localStorage.removeItem(key));
    localStorage.removeItem('access_token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
