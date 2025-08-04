import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/slices/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      console.log('Attempting login...');
      const result = await dispatch(login({ email, password })).unwrap();
      console.log('Login successful:', result);
      
      // Increase timeout to ensure token is properly set
      setTimeout(() => {
        console.log('Redirecting to sessions page...');
        console.log('Auth token in localStorage:', localStorage.getItem('token'));
        navigate('/sessions');
      }, 1000); // Increased from 500ms to 1000ms
    } catch (err) {
      console.error('Login error', err);
    }
  };

  return (
    <div className="login-container">
      <h1>Sign In</h1>
      <p>Sign into your account</p>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;