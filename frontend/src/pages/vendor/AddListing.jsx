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

      // Ensure no missing fields before sending the request
      if (!formData.name || !formData.address || !formData.description || !formData.pricing) {
        setError("All fields are required.");
        setIsSubmitting(false);
        return;
      }

      // Convert facilities to an array
      // const facilitiesArray = formData.facilities.split(",").map((item) => item.trim());

      // Append fields to FormData
      data.append("name", formData.name);
      data.append("address", formData.address);
      data.append("description", formData.description);
      data.append("facilities", formData.facilities); // Store as JSON string
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
    <div>
      <h1>Add New Listing</h1>
      
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
            required
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
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="Hotel">Hotel</option>
            <option value="Restaurant">Restaurant</option>
          </select>
        </div>
        
        <div>
          <label>Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>
        
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
};

export default AddListing;
