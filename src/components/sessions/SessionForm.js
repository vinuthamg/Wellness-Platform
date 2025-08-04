import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SessionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Add videoUrl and thumbnailUrl to the initial state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'yoga',
    duration: 30,
    content: '',
    videoUrl: '',
    thumbnailUrl: '',
    published: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If id exists, fetch session data for editing
    if (id) {
      const fetchSession = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            navigate('/login');
            return;
          }

          const config = {
            headers: {
              'x-auth-token': token
            }
          };

          const res = await axios.get(`/api/sessions/${id}`, config);
          setFormData({
            title: res.data.title,
            description: res.data.description,
            type: res.data.type,
            duration: res.data.duration,
            content: res.data.content,
            videoUrl: res.data.videoUrl || '',
            thumbnailUrl: res.data.thumbnailUrl || '',
            published: res.data.published
          });
        } catch (err) {
          console.error('Error fetching session', err);
        }
      };

      fetchSession();
    }
  }, [id, navigate]);

  const { title, description, type, duration, content, videoUrl, thumbnailUrl, published } = formData;

  const onChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };

      if (id) {
        // Update existing session
        await axios.put(`/api/sessions/${id}`, formData, config);
      } else {
        // Create new session
        await axios.post('/api/sessions', formData, config);
      }

      navigate('/sessions');
    } catch (err) {
      console.error('Error saving session', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="session-form-container">
      <h1>{id ? 'Edit Session' : 'Create New Session'}</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="type">Type</label>
          <select id="type" name="type" value={type} onChange={onChange}>
            <option value="yoga">Yoga</option>
            <option value="meditation">Meditation</option>
            <option value="fitness">Fitness</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="duration">Duration (minutes)</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={duration}
            onChange={onChange}
            min="1"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={onChange}
            rows="10"
            required
          />
        </div>
        {/* Move video fields inside the form */}
        <div className="form-group">
          <label htmlFor="videoUrl">Video URL (optional)</label>
          <input
            type="text"
            id="videoUrl"
            placeholder="Enter video URL"
            name="videoUrl"
            value={videoUrl}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="thumbnailUrl">Thumbnail URL (optional)</label>
          <input
            type="text"
            id="thumbnailUrl"
            placeholder="Enter thumbnail URL"
            name="thumbnailUrl"
            value={thumbnailUrl}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="published"
              checked={published}
              onChange={onChange}
            />
            Publish this session
          </label>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Session'}
        </button>
      </form>
    </div>
  );
};

export default SessionForm;