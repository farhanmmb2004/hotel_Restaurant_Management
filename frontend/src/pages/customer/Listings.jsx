import React, { useState, useEffect } from 'react';
import { customerService } from '../../services/api';
import { Link } from 'react-router-dom';

export const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const data = await customerService.getListings(filters);
      setListings(data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load listings. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Available Hotels/Restaurant</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-3">Filter Hotels/Restaurent</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">Location</label>
            <input 
              type="text" 
              name="location"
              className="w-full p-2 border rounded"
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Max Price</label>
            <input 
              type="number" 
              name="maxPrice"
              className="w-full p-2 border rounded"
              onChange={handleFilterChange}
              placeholder="Enter max price"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Type</label>
            <select 
              name="type"
              className="w-full p-2 border rounded"
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="Hotel">Hotel</option>
              <option value="Restaurant">Restaurant</option>
            </select>
          </div>
        </div>
      </div>

      {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">{error}</div>}
      
      {loading ? (
        <div className="text-center py-8">Loading listings...</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-8">No listings found matching your criteria.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map(listing => (
            <div key={listing._id} className="border rounded overflow-hidden shadow">
              {listing.image && (
                <img src={listing.image} alt={listing.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <h3 className="font-bold text-lg">{listing.name}</h3>
                <p className="text-gray-600">{listing.address}</p>
                <p className="text-gray-800 mt-2">${listing.pricing}/night</p>
                <div className="mt-4">
                  <Link 
                    to={`/customer/listings/${listing._id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded inline-block"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
