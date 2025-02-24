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

  if (isLoading) return <div>Loading listing details...</div>;
  if (error && !isSubmitting) return <div>{error}</div>;

  return (
    <div>
      <h1>Edit Listing</h1>
      
      <form onSubmit={handleSubmit}>
        {error && <div>{error}</div>}
        
        <div>
          <label>Listing Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Facilities (comma separated)</label>
          <input
            type="text"
            name="facilities"
            value={formData.facilities}
            onChange={handleChange}
            placeholder="WiFi,Parking,Pool"
          />
        </div>
        
        <div>
          <label>Base Price</label>
          <input
            type="number"
            name="pricing"
            value={formData.pricing}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Type</label>
          <select 
            name="type" 
            value={formData.type} 
            onChange={handleChange}
          >
            <option value="Hotel">Hotel</option>
            <option value="Restaurant">Restaurant</option>
          </select>
        </div>
        
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update Listing'}
        </button>
        <button type="button" onClick={() => navigate(`/vendor/listings/${id}`)}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditListing;