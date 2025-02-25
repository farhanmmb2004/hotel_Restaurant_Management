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
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Add New Unit</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-500">{error}</div>}
        
        <div>
          <label className="block font-medium text-gray-700">Name/Room Number</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block font-medium text-gray-700">Type</label>
          <select 
            name="type" 
            value={formData.type} 
            onChange={handleChange} 
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Standard">Standard</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Suite">Suite</option>
            <option value="Table">Table (Restaurant)</option>
          </select>
        </div>
        
        <div>
          <label className="block font-medium text-gray-700">Capacity (people)</label>
          <input
            type="number"
            name="capacity"
            min="1"
            value={formData.capacity}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            min="0"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            name="availability"
            checked={formData.availability}
            onChange={handleChange}
            className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-gray-700">Available for Booking</label>
        </div>
        
        <div className="flex space-x-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Adding...' : 'Add Unit'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate(`/vendor/listings/${listingId}`)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUnit;