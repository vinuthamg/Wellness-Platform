import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Set auth token for request
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        const config = {
          headers: {
            'x-auth-token': token
          }
        };

        // Get user's sessions
        const sessionsRes = await axios.get('/api/sessions/user/me', config);
        setSessions(sessionsRes.data);

        // Get user's drafts
        const draftsRes = await axios.get('/api/drafts', config);
        setDrafts(draftsRes.data);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard-container">
        <div className="dashboard-sessions">
          <h2>My Sessions</h2>
          {sessions.length > 0 ? (
            <div className="session-list">
              {sessions.map(session => (
                <div key={session._id} className="session-item">
                  <h3>{session.title}</h3>
                  <p>{session.description.substring(0, 100)}...</p>
                  <div className="session-meta">
                    <span className={`session-type ${session.type}`}>{session.type}</span>
                    <span className="session-duration">{session.duration} min</span>
                    <span className="session-status">
                      {session.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <Link to={`/sessions/${session._id}`} className="btn btn-primary">
                    View
                  </Link>
                  <Link to={`/sessions/edit/${session._id}`} className="btn btn-light">
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p>You haven't created any sessions yet.</p>
          )}
          <Link to="/sessions/new" className="btn btn-primary">
            Create New Session
          </Link>
        </div>

        <div className="dashboard-drafts">
          <h2>My Drafts</h2>
          {drafts.length > 0 ? (
            <div className="draft-list">
              {drafts.map(draft => (
                <div key={draft._id} className="draft-item">
                  <h3>{draft.title || 'Untitled Draft'}</h3>
                  <p>
                    {draft.description
                      ? `${draft.description.substring(0, 100)}...`
                      : 'No description yet'}
                  </p>
                  <div className="draft-meta">
                    <span className="draft-type">{draft.type}</span>
                    <span className="draft-duration">{draft.duration} min</span>
                    <span className="draft-last-saved">
                      Last saved: {new Date(draft.lastSaved).toLocaleString()}
                    </span>
                  </div>
                  <Link to={`/drafts/${draft._id}`} className="btn btn-primary">
                    Continue Editing
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p>You don't have any drafts.</p>
          )}
          <Link to="/drafts/new" className="btn btn-primary">
            Start New Draft
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;