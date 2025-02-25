import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AddListing = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    facilities: '',
    pricing: '',
    type: 'Hotel',
    image: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const data = new FormData();
      if (!formData.name || !formData.address || !formData.description || !formData.pricing) {
        setError("All fields are required.");
        setIsSubmitting(false);
        return;
      }
      
      data.append("name", formData.name);
      data.append("address", formData.address);
      data.append("description", formData.description);
      data.append("facilities", formData.facilities);
      data.append("pricing", formData.pricing);
      data.append("type", formData.type);
      if (formData.image) {
        data.append("image", formData.image);
      }
      
      const response = await api.vendor.createListing(data);
      alert('Listing created successfully!');
      navigate(`/vendor/listings/${response.data._id}`);
    } catch (err) {
      setError('Failed to create listing. Please check your information and try again.');
      console.error('Create listing error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Add New Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-500">{error}</div>}
        
        <div>
          <label className="block text-gray-700">Listing Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-gray-700">Facilities (comma separated)</label>
          <input
            type="text"
            name="facilities"
            value={formData.facilities}
            onChange={handleChange}
            placeholder="WiFi, Parking, Pool"
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-gray-700">Base Price</label>
          <input
            type="number"
            name="pricing"
            value={formData.pricing}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-gray-700">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="Hotel">Hotel</option>
            <option value="Restaurant">Restaurant</option>
          </select>
        </div>
        
        <div>
          <label className="block text-gray-700">Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          {isSubmitting ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
};

export default AddListing;
