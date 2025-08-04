import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DraftEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'yoga',
    duration: 30,
    content: ''
  });
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch draft data if editing an existing draft
  useEffect(() => {
    const fetchDraft = async () => {
      if (!id || id === 'new') {
        setLoading(false);
        return;
      }

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

        const res = await axios.get(`/api/drafts/${id}`, config);
        setFormData({
          title: res.data.title || '',
          description: res.data.description || '',
          type: res.data.type || 'yoga',
          duration: res.data.duration || 30,
          content: res.data.content || ''
        });
        setLastSaved(new Date(res.data.lastSaved));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching draft', err);
        setLoading(false);
      }
    };

    fetchDraft();
  }, [id, navigate]);

  // Auto-save function with debounce
  const autoSave = useCallback(
    async (data) => {
      if (!data.title && !data.description && !data.content) {
        return; // Don't save empty drafts
      }

      setSaving(true);

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

        let response;

        if (id && id !== 'new') {
          // Update existing draft
          response = await axios.put(`/api/drafts/${id}`, data, config);
        } else {
          // Create new draft
          response = await axios.post('/api/drafts', data, config);
          // Update URL with new draft ID without reloading page
          navigate(`/drafts/${response.data._id}`, { replace: true });
        }

        setLastSaved(new Date());
      } catch (err) {
        console.error('Error saving draft', err);
      } finally {
        setSaving(false);
      }
    },
    [id, navigate]
  );

  // Debounce function to limit auto-save calls
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Create debounced version of autoSave
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedAutoSave = useCallback(
    debounce(autoSave, 2000), // 2 seconds delay
    [autoSave]
  );

  const onChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const updatedFormData = { ...formData, [e.target.name]: value };
    setFormData(updatedFormData);
    debouncedAutoSave(updatedFormData);
  };

  const handlePublish = async () => {
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

      // Create a new session from the draft
      const sessionData = {
        ...formData,
        published: true
      };

      await axios.post('/api/sessions', sessionData, config);

      // Optionally delete the draft after publishing
      if (id && id !== 'new') {
        await axios.delete(`/api/drafts/${id}`, config);
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Error publishing draft', err);
    }
  };

  if (loading) {
    return <div>Loading draft...</div>;
  }

  return (
    <div className="draft-editor">
      <div className="draft-editor-header">
        <h1>{id && id !== 'new' ? 'Edit Draft' : 'New Draft'}</h1>
        <div className="draft-status">
          {saving ? (
            <span className="saving">Saving...</span>
          ) : lastSaved ? (
            <span className="saved">Last saved: {lastSaved.toLocaleString()}</span>
          ) : null}
        </div>
      </div>

      <div className="draft-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={onChange}
            placeholder="Enter title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={onChange}
            placeholder="Enter description"
            rows="3"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select id="type" name="type" value={formData.type} onChange={onChange}>
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
              value={formData.duration}
              onChange={onChange}
              min="1"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={onChange}
            placeholder="Enter session content here..."
            rows="15"
          />
        </div>

        <div className="draft-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handlePublish}
            disabled={!formData.title || !formData.description || !formData.content}
          >
            Publish Session
          </button>
          <button
            type="button"
            className="btn btn-light"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default DraftEditor;