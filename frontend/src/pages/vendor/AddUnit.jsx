import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AddUnit = () => {
  const { id: listingId } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'Standard',
    capacity: 2,
    price: '',
    availability: true
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await api.vendor.addUnit(listingId, formData);
      alert('Unit added successfully!');
      navigate(`/vendor/listings/${listingId}`);
    } catch (err) {
      setError('Failed to add unit. Please check your information and try again.');
      console.error('Add unit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Add New Unit</h1>
      
      <form onSubmit={handleSubmit}>
        {error && <div>{error}</div>}
        
        <div>
          <label>Name/Room Number</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Type</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="Standard">Standard</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Suite">Suite</option>
            <option value="Table">Table (Restaurant)</option>
          </select>
        </div>
        
        <div>
          <label>Capacity (people)</label>
          <input
            type="number"
            name="capacity"
            min="1"
            value={formData.capacity}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Price</label>
          <input
            type="number"
            name="price"
            min="0"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>
            <input
              type="checkbox"
              name="availability"
              checked={formData.availability}
              onChange={handleChange}
            />
            Available for Booking
          </label>
        </div>
        
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Unit'}
        </button>
        <button type="button" onClick={() => navigate(`/vendor/listings/${listingId}`)}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddUnit;