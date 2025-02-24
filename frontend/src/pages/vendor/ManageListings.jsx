import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ManageListings = () => {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const response = await api.vendor.getListings();
      setListings(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load listings. Please try again later.');
      console.error('Listings error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }
    
    try {
      await api.vendor.deleteListing(listingId);
      // Remove the deleted listing from state
      setListings(listings.filter(listing => listing._id !== listingId));
    } catch (err) {
      alert('Failed to delete listing. Please try again.');
      console.error('Delete listing error:', err);
    }
  };

  if (isLoading) return <div>Loading listings...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Manage Listings</h1>
      <Link to="/vendor/listings/new">Add New Listing</Link>
      
      {listings.length === 0 ? (
        <p>You don't have any listings yet.</p>
      ) : (
        <div>
          {listings.map(listing => (
            <div key={listing._id}>
              <h3>{listing.name}</h3>
              <p>{listing.address}</p>
              <p>{listing.pricing ? `$${listing.pricing}` : 'Price varies'}</p>
              <div>
                <button onClick={() => navigate(`/vendor/listings/${listing._id}`)}>
                  View Details
                </button>
                <button onClick={() => navigate(`/vendor/listings/${listing._id}/edit`)}>
                  Edit
                </button>
                <button onClick={() => handleDelete(listing._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageListings;