import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Loader, AlertCircle, Mail, User, MessageSquare } from 'lucide-react';
import '../styles/AdminFeedback.css';

interface Feedback {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}

const AdminFeedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/admin/feedback`);
      setFeedbacks(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setError("Failed to fetch feedbacks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_API}/api/admin/feedback/${id}`);
        setFeedbacks(feedbacks.filter(feedback => feedback._id !== id));
        setError(null);
      } catch (error) {
        console.error("Error deleting feedback:", error);
        setError("Failed to delete feedback. Please try again.");
      }
    }
  };

  const containerStyle: React.CSSProperties = {
    padding: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    marginBottom: '20px',
    transition: 'box-shadow 0.3s ease',
  };

  const cardHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  return (
    <div style={containerStyle} className="admin-feedback">
      <div style={headerStyle}>
        <h1>Admin Feedback Page</h1>
        <button 
          onClick={fetchFeedbacks} 
          style={{...buttonStyle, backgroundColor: '#4A5568', color: 'white'}}
          className="refresh-button"
        >
          Refresh Feedbacks
        </button>
      </div>

      {loading && (
        <div className="loading">
          <Loader size={24} className="animate-spin" />
          <span>Loading feedbacks...</span>
        </div>
      )}

      {error && (
        <div className="error">
          <AlertCircle size={24} />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && feedbacks.length === 0 && (
        <p className="no-feedback">No feedback submitted yet.</p>
      )}

      {!loading && !error && feedbacks.length > 0 && (
        <div>
          {feedbacks.map((feedback) => (
            <div key={feedback._id} style={cardStyle} className="feedback-card">
              <div style={cardHeaderStyle}>
                <h2>{feedback.subject}</h2>
                <button
                  onClick={() => handleDeleteFeedback(feedback._id)}
                  style={{...buttonStyle, backgroundColor: '#FED7D7', color: '#9B2C2C'}}
                  className="delete-button"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="feedback-info">
                <p><User size={16} /> {feedback.name}</p>
                <p><Mail size={16} /> {feedback.email}</p>
              </div>
              <div className="feedback-message">
                <MessageSquare size={16} />
                <p>
                  {expandedFeedback === feedback._id
                    ? feedback.message
                    : `${feedback.message.slice(0, 100)}${feedback.message.length > 100 ? '...' : ''}`}
                </p>
              </div>
              {feedback.message.length > 100 && (
                <button
                  onClick={() => setExpandedFeedback(expandedFeedback === feedback._id ? null : feedback._id)}
                  style={{...buttonStyle, backgroundColor: '#EDF2F7', color: '#4A5568'}}
                  className="expand-button"
                >
                  {expandedFeedback === feedback._id ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;