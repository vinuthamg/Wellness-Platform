import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../../redux/slices/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { name, email, password, password2 } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      console.error('Passwords do not match');
      return;
    }

    try {
      await dispatch(register({ name, email, password })).unwrap();
      
      // Increase timeout to ensure token is properly set
      setTimeout(() => {
        console.log('Redirecting to sessions page...');
        console.log('Auth token in localStorage:', localStorage.getItem('token'));
        navigate('/sessions');
      }, 1000); // Increased from 500ms to 1000ms
    } catch (err) {
      console.error('Registration error', err);
    }
  };

  return (
    <div className="register-container">
      <h1>Sign Up</h1>
      <p>Create Your Account</p>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>
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
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
};

export default Register;