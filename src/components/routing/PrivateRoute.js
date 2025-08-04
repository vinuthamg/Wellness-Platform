import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser } from '../../redux/slices/authSlice';

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      console.log('PrivateRoute - Token in localStorage:', token);
      
      if (token && !isAuthenticated && !loading) {
        console.log('PrivateRoute - Attempting to load user with token');
        try {
          await dispatch(loadUser()).unwrap();
        } catch (err) {
          console.error('Failed to load user:', err);
        }
      }
      setIsChecking(false);
    };
    
    checkAuth();
  }, [dispatch, isAuthenticated, loading]);

  if (loading || isChecking) {
    console.log('PrivateRoute - Loading...');
    return <div>Loading...</div>;
  }
  
  console.log('PrivateRoute - isAuthenticated:', isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;