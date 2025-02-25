import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    facilities: '',
    pricing: '',
    type: 'Hotel'
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchListingDetails();
  }, [id]);

  const fetchListingDetails = async () => {
    setIsLoading(true);
    try {
      const response = await api.vendor.getListingDetails(id);
      const listing = response.data;
      
      setFormData({
        name: listing.name || '',
        address: listing.address || '',
        description: listing.description || '',
        facilities: listing.facilities || '',
        pricing: listing.pricing || '',
        type: listing.type || 'Hotel'
      });
      
      setError(null);
    } catch (err) {
      setError('Failed to load listing details. Please try again later.');
      console.error('Listing details error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await api.vendor.updateListing(id, formData);
      alert('Listing updated successfully!');
      navigate(`/vendor/listings/${id}`);
    } catch (err) {
      setError('Failed to update listing. Please check your information and try again.');
      console.error('Update listing error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="text-center text-gray-600">Loading listing details...</div>;
  if (error && !isSubmitting) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Edit Listing</h1>
      
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
            className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200"
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
            className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200"
          />
        </div>
        
        <div>
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200"
          />
        </div>
        
        <div>
          <label className="block text-gray-700">Facilities (comma separated)</label>
          <input
            type="text"
            name="facilities"
            value={formData.facilities}
            onChange={handleChange}
            placeholder="WiFi,Parking,Pool"
            className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200"
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
            className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200"
          />
        </div>
        
        <div>
          <label className="block text-gray-700">Type</label>
          <select 
            name="type" 
            value={formData.type} 
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200"
          >
            <option value="Hotel">Hotel</option>
            <option value="Restaurant">Restaurant</option>
          </select>
        </div>
        
        <div className="flex justify-between">
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {isSubmitting ? 'Updating...' : 'Update Listing'}
          </button>
          <button type="button" onClick={() => navigate(`/vendor/listings/${id}`)} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditListing;
