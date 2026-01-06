import React, { useState, useEffect } from 'react';
import { customerService } from '../../services/api';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Explore Properties 🏨
          </h1>
          <p className="text-gray-600">Discover amazing hotels and restaurants for your next visit</p>
        </div>
      
        <Card className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🔍 Filter Your Search</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">📍 Location</label>
              <input 
                type="text" 
                name="location"
                placeholder="Enter city or area"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">💰 Max Price</label>
              <input 
                type="number" 
                name="maxPrice"
                placeholder="Enter max price"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">🏷️ Property Type</label>
              <select 
                name="type"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="Hotel">🏨 Hotel</option>
                <option value="Restaurant">🍽️ Restaurant</option>
              </select>
            </div>
          </div>
        </Card>

        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}
      
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4"></div>
                <div className="flex items-start justify-between mb-2">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-28"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No Properties Found"
            description="No listings match your search criteria. Try adjusting your filters."
          />
        ) : (
          <>
            <div className="mb-4 text-gray-600">
              Found <span className="font-bold text-gray-900">{listings.length}</span> {listings.length === 1 ? 'property' : 'properties'}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map(listing => (
                <Card key={listing._id} className="cursor-pointer" onClick={() => window.location.href = `/customer/listings/${listing._id}`}>
                  {listing.image ? (
                    <div className="aspect-video rounded-lg mb-4 overflow-hidden">
                      <img 
                        src={listing.image} 
                        alt={listing.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mb-4 flex items-center justify-center text-4xl">
                      {listing.type === 'Hotel' ? '🏨' : '🍽️'}
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg text-gray-900 flex-1">{listing.name}</h3>
                    <Badge variant={listing.type === 'Hotel' ? 'primary' : 'accent'}>
                      {listing.type}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-1">📍 {listing.address}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div>
                      <span className="text-2xl font-bold text-purple-600">${listing.pricing}</span>
                      <span className="text-sm text-gray-500">/night</span>
                    </div>
                    <Button variant="primary" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/customer/listings/${listing._id}`;
                    }}>
                      View Details →
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
    </div>
  );
};
