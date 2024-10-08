// AdminDeleteCake.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Cake {
  _id: string;
  name: string;
  category: string;
  price: number;
  imageId: string;
}

const AdminDeleteCake: React.FC = () => {
  const [cakes, setCakes] = useState<Cake[]>([]);

  useEffect(() => {
    fetchCakes();
  }, []);

  const fetchCakes = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/cakes`);
      setCakes(response.data);
    } catch (error) {
      console.error('Error fetching cakes', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_API}/api/cakes/${id}`);
      alert('Cake deleted successfully!');
      setCakes(cakes.filter(cake => cake._id !== id));
    } catch (error) {
      console.error('Error deleting cake', error);
      alert('Failed to delete cake');
    }
  };

  return (
    <div>
      <h2>Delete Cakes</h2>
      {cakes.length > 0 ? (
        <ul>
          {cakes.map(cake => (
            <li key={cake._id}>
              <img src={`${import.meta.env.VITE_BACKEND_API}/api/cakes/image/${cake.imageId}`} alt={cake.name} width="100" height="100" />
              <h3>{cake.name}</h3>
              <p>Category: {cake.category}</p>
              <p>Price: GHS {cake.price}</p>
              <button onClick={() => handleDelete(cake._id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No cakes found</p>
      )}
    </div>
  );
};

export default AdminDeleteCake;
