import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useParams, Link } from 'react-router-dom';

const SessionDetail = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        // Use the configured api instance instead of axios directly
        const res = await api.get(`/sessions/${id}`);
        setSession(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching session', err);
        setLoading(false);
      }
    };

    fetchSession();
  }, [id]);

  // Helper function to determine if URL is from YouTube
  const isYouTubeUrl = (url) => {
    return url && url.includes('youtube.com') || url.includes('youtu.be');
  };

  // Function to extract YouTube video ID
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    
    // Handle youtu.be format
    if (url.includes('youtu.be')) {
      return url.split('/').pop();
    }
    
    // Handle youtube.com format
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get('v');
  };

  if (loading) {
    return <div>Loading session...</div>;
  }

  if (!session) {
    return <div>Session not found</div>;
  }

  return (
    <div className="session-detail">
      <Link to="/sessions" className="btn btn-light">
        Back to Sessions
      </Link>
      <div className="session-header">
        <h1>{session.title}</h1>
        <div className="session-meta">
          <span className={`session-type ${session.type}`}>{session.type}</span>
          <span className="session-duration">{session.duration} min</span>
          <span className="session-creator">By: {session.creator.name}</span>
        </div>
      </div>
      <div className="session-description">
        <h2>Description</h2>
        <p>{session.description}</p>
      </div>
      <div className="session-content">
        <h2>Session Content</h2>
        <div className="content-container">
          {session.videoUrl ? (
            <div className="video-container">
              <h3>Watch Session</h3>
              {isYouTubeUrl(session.videoUrl) ? (
                <iframe
                  width="100%"
                  height="480"
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(session.videoUrl)}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video 
                  controls 
                  width="100%" 
                  src={session.videoUrl}
                  poster={session.thumbnailUrl || ''}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: session.content }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionDetail;