import { useState, useEffect, useMemo } from 'react';
import { AES, enc } from 'crypto-js';
import { useNavigate } from 'react-router-dom';

const ENCRYPTION_SECRET = 'MySecretKey'; // Replace with your secret key

const useLocalStorageUser = () => {
  // State to store user data
  const [user, setUser] = useState(null);
  const navigate = useNavigate()

  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        // Decrypt the data and parse it as JSON
        const decryptedUser = AES.decrypt(storedUser, ENCRYPTION_SECRET).toString(enc.Utf8);
        setUser(JSON.parse(decryptedUser));
      } catch (error) {
        // Handle any error that occurs during parsing or decryption
        console.error('Error loading user data:', error);
      }
    }
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      try {
        // Encrypt the data before saving to localStorage
        const encryptedUser = AES.encrypt(JSON.stringify(user), ENCRYPTION_SECRET).toString();
        localStorage.setItem('user', encryptedUser);
      } catch (error) {
        // Handle any error that occurs during encryption or JSON.stringify
        console.error('Error saving user data:', error);
      }
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Memoize the user data to avoid unnecessary re-renders
  const memoizedUser = useMemo(() => user, [user]);

  return {
    user: memoizedUser,
    setUser,
  };
};

export default useLocalStorageUser;
