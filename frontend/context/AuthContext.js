import { router } from 'expo-router';
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentWorker, setCurrentWorker] = useState(null)
  const [selectedCamera, setSelectedCamera] = useState(null)
  const [currentToken, setCurrentToken] = useState('')

  useEffect(() => {
    const loadWorker = async () => {
      token = await AsyncStorage.getItem('token')
      if(token){
        me(token)
      }
    };
    loadWorker();
  }, []);

  async function login(email, password) {
    try {
      const response = await axios.post(
        'https://ковромер.рф/api/workers/token', 
        new URLSearchParams({
          username: email,
          password: password
        }), 
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      if(response.data.access_token){
        me(response.data.access_token)
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.detail);
      } else {
        alert(error.message);
      }
    }
  };

  async function me(token) {
    try {
      const response = await axios.get(
        'https://ковромер.рф/api/workers/me', 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if(response.data.id){
        console.log(response.data)
        await AsyncStorage.setItem('token', token)
        setCurrentWorker(response.data)
        setCurrentToken(token)
        router.replace('/(drawer)/first_step')
      }

    } catch (error) {
      if (error.response) {
        alert(error.response.data.detail);
      } else {
        alert(error.message);
      }
    }
  };

  const logout = async() => {
    setCurrentWorker(null)
    await AsyncStorage.removeItem('token')
    router.replace('auth/login')
  };

  return (
    <AuthContext.Provider value={{ currentWorker, login, logout, selectedCamera, setSelectedCamera, currentToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);