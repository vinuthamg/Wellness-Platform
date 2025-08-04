import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './redux/slices/authSlice';

// Components
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import SessionList from './components/sessions/SessionList';
import SessionDetail from './components/sessions/SessionDetail';
import SessionForm from './components/sessions/SessionForm';
import DraftList from './components/drafts/DraftList';
import DraftEditor from './components/drafts/DraftEditor';
import PrivateRoute from './components/routing/PrivateRoute';

// CSS
import './App.css';

// Check for token in localStorage
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/sessions" element={
              <PrivateRoute>
                <SessionList />
              </PrivateRoute>
            } />
            <Route path="/sessions/:id" element={
              <PrivateRoute>
                <SessionDetail />
              </PrivateRoute>
            } />
            <Route path="/create-session" element={
              <PrivateRoute>
                <SessionForm />
              </PrivateRoute>
            } />
            <Route path="/edit-session/:id" element={
              <PrivateRoute>
                <SessionForm />
              </PrivateRoute>
            } />
            <Route path="/drafts" element={
              <PrivateRoute>
                <DraftList />
              </PrivateRoute>
            } />
            <Route path="/drafts/:id" element={
              <PrivateRoute>
                <DraftEditor />
              </PrivateRoute>
            } />
            <Route path="/create-draft" element={
              <PrivateRoute>
                <DraftEditor />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
