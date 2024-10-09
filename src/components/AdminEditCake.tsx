import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Edit2, X, Check, Loader } from 'lucide-react';
import '../styles/AdminEditCake.css';

interface Cake {
  _id: string;
  name: string;
  category: string;
  price: number;
  imageId: string;
}

const AdminEditCake: React.FC = () => {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [selectedCake, setSelectedCake] = useState<Cake | null>(null);
  const [formData, setFormData] = useState<{ name: string; category: string; price: number }>({
    name: '',
    category: '',
    price: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchCakes = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/cakes`);
        setCakes(response.data);
      } catch (error) {
        console.error('Error fetching cakes:', error);
        setError('Failed to fetch cakes. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCakes();
  }, []);

  const handleEditClick = (cake: Cake) => {
    setSelectedCake(cake);
    setFormData({
      name: cake.name,
      category: cake.category,
      price: cake.price,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedCake) {
      try {
        setIsUpdating(true);
        await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/cakes/edit/${selectedCake._id}`, formData);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/cakes`);
        setCakes(response.data);
        setSelectedCake(null);
        setFormData({ name: '', category: '', price: 0 });
      } catch (error) {
        console.error('Error updating cake:', error);
        setError('Failed to update cake. Please try again.');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    gap: '2rem',
  };

  const listContainerStyle: React.CSSProperties = {
    flex: '1 1 60%',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1rem',
  };

  const cakeItemStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    transition: 'transform 0.3s ease',
  };

  const cakeImageStyle: React.CSSProperties = {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
  };

  const cakeInfoStyle: React.CSSProperties = {
    padding: '1rem',
  };

  const editButtonStyle: React.CSSProperties = {
    backgroundColor: '#ED8936',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '0.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: '0.5rem',
  };

  const formContainerStyle: React.CSSProperties = {
    flex: '1 1 40%',
    position: 'sticky',
    top: '2rem',
    height: 'fit-content',
  };

  const formStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    borderRadius: '4px',
    border: '1px solid #E2E8F0',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '0.75rem 1rem',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  };

  return (
    <div style={containerStyle} className="admin-edit-cake">
      <div style={listContainerStyle}>
        {isLoading ? (
          <div className="loading">
            <Loader size={24} className="animate-spin" />
            <span>Loading cakes...</span>
          </div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div style={gridStyle}>
            {cakes.map((cake) => (
              <div key={cake._id} style={cakeItemStyle} className="cake-item">
                <img 
                  src={`${import.meta.env.VITE_BACKEND_API}/api/cakes/image/${cake.imageId}`} 
                  alt={cake.name} 
                  style={cakeImageStyle}
                />
                <div style={cakeInfoStyle}>
                  <strong>{cake.name}</strong>
                  <p>{cake.category}</p>
                  <p>GHS {cake.price.toFixed(2)}</p>
                  <button 
                    onClick={() => handleEditClick(cake)} 
                    style={editButtonStyle}
                    className="edit-button"
                  >
                    <Edit2 size={16} style={{ marginRight: '0.5rem' }} />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={formContainerStyle}>
        {selectedCake ? (
          <div style={formStyle} className="edit-form">
            <h2>Edit Cake</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={inputStyle}
                placeholder="Cake Name"
              />
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                style={inputStyle}
                placeholder="Category"
              />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                style={inputStyle}
                placeholder="Price"
                step="0.01"
              />
              <div className="button-group">
                <button 
                  type="submit" 
                  style={{ ...buttonStyle, backgroundColor: '#48BB78', color: 'white' }}
                  className="submit-button"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <Loader size={16} className="animate-spin" style={{ marginRight: '0.5rem' }} />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Check size={16} style={{ marginRight: '0.5rem' }} />
                      Update Cake
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  onClick={() => setSelectedCake(null)}
                  style={{ ...buttonStyle, backgroundColor: '#E53E3E', color: 'white' }}
                  className="cancel-button"
                >
                  <X size={16} style={{ marginRight: '0.5rem' }} />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div style={formStyle} className="no-cake-selected">
            <h2>Edit Cake</h2>
            <p>Select a cake from the list to edit its details.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEditCake;