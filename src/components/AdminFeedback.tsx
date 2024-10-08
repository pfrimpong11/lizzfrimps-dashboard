import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define the Feedback interface
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

  useEffect(() => {
    // Fetch all feedbacks from the backend
    axios.get(`${import.meta.env.VITE_BACKEND_API}/api/admin/feedback`)
      .then((response) => {
        setFeedbacks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching feedbacks:", error);
        setLoading(false);
      });
  }, []);

  const handleDeleteFeedback = (id: string) => {
    // Delete feedback
    axios.delete(`${import.meta.env.VITE_BACKEND_API}/api/admin/feedback/${id}`)
      .then(() => {
        setFeedbacks(feedbacks.filter(feedback => feedback._id !== id));
        alert('Feedback deleted successfully.');
      })
      .catch((error) => {
        console.error("Error deleting feedback:", error);
      });
  };

  if (loading) return <p>Loading feedback...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Admin Feedback Page</h1>
      {feedbacks.length === 0 ? (
        <p>No feedback submitted yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>Name</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>Email</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>Subject</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>Message</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback) => (
              <tr key={feedback._id}>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{feedback.name}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{feedback.email}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{feedback.subject}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{feedback.message}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                  <button
                    style={{
                      backgroundColor: '#ff4d4d',
                      color: 'white',
                      padding: '5px 10px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleDeleteFeedback(feedback._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminFeedback;
