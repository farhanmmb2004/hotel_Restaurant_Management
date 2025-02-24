import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [units, setUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchListingDetails();
  }, [id]);

  const fetchListingDetails = async () => {
    setIsLoading(true);
    try {
      const listingResponse = await api.vendor.getListingDetails(id);
      setListing(listingResponse.data);
      if (listingResponse.data.unitDetails) {
        setUnits(listingResponse.data.unitDetails);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to load listing details. Please try again later.');
      console.error('Listing details error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUnit = async (unitId) => {
    if (!window.confirm('Are you sure you want to delete this unit?')) {
      return;
    }
    
    try {
      await api.vendor.deleteUnit(unitId);
      // Remove the deleted unit from state
      setUnits(units.filter(unit => unit._id !== unitId));
      alert('Unit deleted successfully');
    } catch (err) {
      alert('Failed to delete unit. Please try again.');
      console.error('Delete unit error:', err);
    }
  };

  if (isLoading) return <div>Loading listing details...</div>;
  if (error) return <div>{error}</div>;
  if (!listing) return <div>Listing not found</div>;

  return (
    <div>
      <h1>{listing.name}</h1>
      
      <div>
        <button onClick={() => navigate(`/vendor/listings/${id}/edit`)}>Edit Listing</button>
        <button onClick={() => navigate('/vendor/listings')}>Back to Listings</button>
      </div>
      
      <div>
        <h2>Listing Details</h2>
        <p><strong>Address:</strong> {listing.address}</p>
        <p><strong>Type:</strong> {listing.type}</p>
        <p><strong>Base Price:</strong> ${listing.pricing}</p>
        <p><strong>Facilities:</strong> {listing.facilities}</p>
        <p><strong>Description:</strong> {listing.description}</p>
        {listing.image && (
          <div>
            <strong>Image:</strong>
            <img src={listing.image} alt={listing.name} style={{ maxWidth: '300px' }} />
          </div>
        )}
      </div>
      
      <div>
        <h2>Units/Rooms</h2>
        <Link to={`/vendor/listings/${id}/units/add`}>Add New Unit</Link>
        
        {units.length === 0 ? (
          <p>No units/rooms added yet. Add units to make this listing bookable.</p>
        ) : (
          <div>
            {units.map(unit => (
              <div key={unit._id}>
                <h3>{unit.type || unit.name}</h3>
                <p>Capacity: {unit.capacity} people</p>
                <p>Price: ${unit.price}</p>
                <p>Available: {unit.availability ? 'Yes' : 'No'}</p>
                <button onClick={() => navigate(`/vendor/units/${unit._id}/edit`)}>
                  Edit
                </button>
                <button onClick={() => handleDeleteUnit(unit._id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingDetail;