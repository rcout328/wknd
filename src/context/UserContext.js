'use client'
import { createContext, useContext, useState, useEffect } from 'react';

// Create a User Context
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    // Check local storage for email on mount
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  const updateUserEmail = (email) => {
    setUserEmail(email);
    localStorage.setItem('userEmail', email); // Store email in local storage
  };

  const clearUserEmail = () => {
    setUserEmail(null);
    localStorage.removeItem('userEmail'); // Clear email from local storage
  };

  return (
    <UserContext.Provider value={{ userEmail, setUserEmail: updateUserEmail, clearUserEmail }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the User Context
export const useUser = () => {
  return useContext(UserContext);
};