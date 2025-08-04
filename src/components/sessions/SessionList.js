import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import SessionItem from './SessionItem';

const SessionList = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        // Use the configured api instance instead of axios directly
        const res = await api.get('/sessions');
        setSessions(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching sessions', err);
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Filter sessions based on type
  const filteredSessions = filter === 'all' 
    ? sessions 
    : sessions.filter(session => session.type === filter);

  if (loading) {
    return <div>Loading sessions...</div>;
  }

  return (
    <div className="sessions-container">
      <h1>Wellness Sessions</h1>
      <div className="filter-container">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${filter === 'yoga' ? 'active' : ''}`}
          onClick={() => setFilter('yoga')}
        >
          Yoga
        </button>
        <button 
          className={`filter-btn ${filter === 'meditation' ? 'active' : ''}`}
          onClick={() => setFilter('meditation')}
        >
          Meditation
        </button>
        <button 
          className={`filter-btn ${filter === 'fitness' ? 'active' : ''}`}
          onClick={() => setFilter('fitness')}
        >
          Fitness
        </button>
      </div>
      {filteredSessions.length > 0 ? (
        <div className="session-grid">
          {filteredSessions.map(session => (
            <SessionItem key={session._id} session={session} />
          ))}
        </div>
      ) : (
        <p>No sessions found</p>
      )}
    </div>
  );
};

export default SessionList;