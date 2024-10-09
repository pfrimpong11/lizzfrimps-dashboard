import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Check, Image as ImageIcon } from 'lucide-react';
import '../styles/AdminUpload.css';

const AdminUpload: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      const imageSizeInMB = selectedImage.size / 1024 / 1024;

      if (imageSizeInMB > 1) {
        setError('Image size must be less than 1MB');
        setFormData({ ...formData, image: null });
        setImagePreview(null);
      } else {
        setFormData({ ...formData, image: selectedImage });
        setImagePreview(URL.createObjectURL(selectedImage));
        setError(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setError(null);

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('price', formData.price);

    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/cakes/upload`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadSuccess(true);
      setTimeout(() => {
        setFormData({ name: '', category: '', price: '', image: null });
        setImagePreview(null);
        setUploadSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error uploading cake', error);
      setError('Failed to upload cake. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    gap: '2rem',
  };

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    flex: '1',
  };

  const previewContainerStyle: React.CSSProperties = {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7fafc',
    borderRadius: '8px',
    padding: '1rem',
  };

  const inputGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 'bold',
    color: '#4A5568',
  };

  const inputStyle: React.CSSProperties = {
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #E2E8F0',
    fontSize: '1rem',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '0.75rem',
    backgroundColor: '#ED8936',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'background-color 0.3s',
  };

  const imagePreviewStyle: React.CSSProperties = {
    maxWidth: '100%',
    maxHeight: '300px',
    objectFit: 'contain',
    borderRadius: '4px',
  };

  const errorStyle: React.CSSProperties = {
    color: '#E53E3E',
    marginTop: '0.5rem',
  };

  const successStyle: React.CSSProperties = {
    color: '#38A169',
    marginTop: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  return (
    <div style={containerStyle} className="admin-upload-container">
      <div style={formStyle}>
        <h2 style={{ marginBottom: '1.5rem', color: '#2D3748' }}>Upload Cake</h2>
        <form onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <label htmlFor="name" style={labelStyle}>Cake Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={inputStyle}
              className="admin-upload-input"
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="category" style={labelStyle}>Category:</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              style={inputStyle}
              className="admin-upload-input"
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="price" style={labelStyle}>Price:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              style={inputStyle}
              className="admin-upload-input"
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="image" style={labelStyle}>Image:</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              required
              style={{ ...inputStyle, padding: '0.5rem' }}
              className="admin-upload-input"
            />
          </div>

          {error && <p style={errorStyle}>{error}</p>}

          <button 
            type="submit" 
            style={buttonStyle} 
            className="admin-upload-button"
            disabled={isUploading || !!error}
          >
            {isUploading ? (
              <>
                <Upload size={18} /> Uploading...
              </>
            ) : (
              <>
                <Upload size={18} /> Upload Cake
              </>
            )}
          </button>

          {uploadSuccess && (
            <div style={successStyle}>
              <Check size={18} />
              Cake uploaded successfully!
            </div>
          )}
        </form>
      </div>
      <div style={previewContainerStyle}>
        {imagePreview ? (
          <>
            <h4 style={{ marginBottom: '0.5rem', color: '#4A5568' }}>Image Preview:</h4>
            <img src={imagePreview} alt="Preview" style={imagePreviewStyle} />
          </>
        ) : (
          <div style={{ textAlign: 'center', color: '#A0AEC0' }}>
            <ImageIcon size={48} style={{ marginBottom: '1rem' }} />
            <p>No image selected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUpload;