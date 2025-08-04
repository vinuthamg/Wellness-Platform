import axios from 'axios';
import api from './api';

const setAuthToken = token => {
  if (token) {
    // Set token in both axios defaults and the api instance
    axios.defaults.headers.common['x-auth-token'] = token;
    api.defaults.headers.common['x-auth-token'] = token;
    localStorage.setItem('token', token);
  } else {
    // Remove token from both places
    delete axios.defaults.headers.common['x-auth-token'];
    delete api.defaults.headers.common['x-auth-token'];
    localStorage.removeItem('token');
  }
};

export default setAuthToken;