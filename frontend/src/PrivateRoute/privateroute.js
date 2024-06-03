import React, { useState, useEffect, createContext } from 'react'
import { Navigate } from 'react-router-dom';
import { isTokenExpired } from '../App'

const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('data'));
  const isLoggedIn = user && !isTokenExpired(user?.token);

  return isLoggedIn ? children : <Navigate to="/" />;
};

export default PrivateRoute