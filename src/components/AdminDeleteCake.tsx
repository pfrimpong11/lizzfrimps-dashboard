import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Loader, AlertCircle } from 'lucide-react';
import '../styles/AdminDeleteCake.css';

interface Cake {
  _id: string;
  name: string;
  category: string;
  price: number;
  imageId: string;
}

const AdminDeleteCake: React.FC = () => {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);

  useEffect(() => {
    fetchCakes();
  }, []);

  const fetchCakes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/cakes`);
      setCakes(response.data);
    } catch (error) {
      console.error('Error fetching cakes', error);
      setError('Failed to fetch cakes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirmation !== id) {
      setDeleteConfirmation(id);
      return;
    }

    try {
      setIsLoading(true);
      await axios.delete(`${import.meta.env.VITE_BACKEND_API}/api/cakes/${id}`);
      setCakes(cakes.filter(cake => cake._id !== id));
      setDeleteConfirmation(null);
    } catch (error) {
      console.error('Error deleting cake', error);
      setError('Failed to delete cake. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '2rem',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '2rem',
  };

  const cakeItemStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  };

  const cakeImageStyle: React.CSSProperties = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  };

  const cakeInfoStyle: React.CSSProperties = {
    padding: '1rem',
  };

  const deleteButtonStyle: React.CSSProperties = {
    backgroundColor: '#E53E3E',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: '0.5rem',
    transition: 'background-color 0.3s',
  };

  const confirmDeleteStyle: React.CSSProperties = {
    ...deleteButtonStyle,
    backgroundColor: '#C53030',
  };

  return (
    <div style={containerStyle} className="admin-delete-cake">
      {/* <h2>Delete Cakes</h2> */}
      {isLoading && (
        <div className="loading">
          <Loader size={24} className="animate-spin" />
          <span>Loading cakes...</span>
        </div>
      )}
      {error && (
        <div className="error">
          <AlertCircle size={24} />
          <span>{error}</span>
        </div>
      )}
      {!isLoading && !error && cakes.length === 0 && (
        <p className="no-cakes">No cakes found</p>
      )}
      {!isLoading && !error && cakes.length > 0 && (
        <div style={gridStyle}>
          {cakes.map(cake => (
            <div key={cake._id} style={cakeItemStyle} className="cake-item">
              <img 
                src={`${import.meta.env.VITE_BACKEND_API}/api/cakes/image/${cake.imageId}`} 
                alt={cake.name} 
                style={cakeImageStyle}
              />
              <div style={cakeInfoStyle}>
                <h3>{cake.name}</h3>
                <p>Category: {cake.category}</p>
                <p>Price: GHS {cake.price.toFixed(2)}</p>
                <button 
                  onClick={() => handleDelete(cake._id)}
                  style={deleteConfirmation === cake._id ? confirmDeleteStyle : deleteButtonStyle}
                  className="delete-button"
                >
                  <Trash2 size={16} style={{ marginRight: '0.5rem' }} />
                  {deleteConfirmation === cake._id ? 'Confirm Delete' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDeleteCake;