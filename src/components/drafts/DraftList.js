import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DraftList = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
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

        const res = await axios.get('/api/drafts', config);
        setDrafts(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching drafts', err);
        setLoading(false);
      }
    };

    fetchDrafts();
  }, []);

  if (loading) {
    return <div>Loading drafts...</div>;
  }

  return (
    <div className="drafts-container">
      <h1>My Drafts</h1>
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
  );
};

export default DraftList;