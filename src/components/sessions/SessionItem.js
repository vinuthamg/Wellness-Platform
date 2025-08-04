import React from 'react';
import { Link } from 'react-router-dom';

const SessionItem = ({ session }) => {
  const { _id, title, description, type, duration, creator } = session;

  return (
    <div className="session-item">
      <div className={`session-type-badge ${type}`}>{type}</div>
      <h3>{title}</h3>
      <p>{description.substring(0, 100)}...</p>
      <div className="session-meta">
        <span className="session-duration">{duration} min</span>
        <span className="session-creator">By: {creator.name}</span>
      </div>
      <Link to={`/sessions/${_id}`} className="btn btn-primary">
        View Session
      </Link>
    </div>
  );
};

export default SessionItem;