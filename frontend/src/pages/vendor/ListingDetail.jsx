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
      setUnits(units.filter(unit => unit._id !== unitId));
      alert('Unit deleted successfully');
    } catch (err) {
      alert('Failed to delete unit. Please try again.');
      console.error('Delete unit error:', err);
    }
  };

  if (isLoading) return <div className="text-center text-gray-600">Loading listing details...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!listing) return <div className="text-gray-500 text-center">Listing not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{listing.name}</h1>
      
      <div className="flex gap-4 mb-6">
        <button onClick={() => navigate(`/vendor/listings/${id}/edit`)} className="px-4 py-2 bg-blue-600 text-white rounded">Edit Listing</button>
        <button onClick={() => navigate('/vendor/listings')} className="px-4 py-2 bg-gray-500 text-white rounded">Back to Listings</button>
      </div>
      
      <div className="border p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold">Listing Details</h2>
        <p><strong>Address:</strong> {listing.address}</p>
        <p><strong>Type:</strong> {listing.type}</p>
        <p><strong>Base Price:</strong> ${listing.pricing}</p>
        <p><strong>Facilities:</strong> {listing.facilities}</p>
        <p><strong>Description:</strong> {listing.description}</p>
        {listing.image && (
          <div className="mt-4">
            <strong>Image:</strong>
            <img src={listing.image} alt={listing.name} className="w-64 h-40 object-cover mt-2 rounded-lg" />
          </div>
        )}
      </div>
      
      <div className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Units/Rooms</h2>
        <Link to={`/vendor/listings/${id}/units/add`} className="px-4 py-2 bg-green-600 text-white rounded">Add New Unit</Link>
        
        {units.length === 0 ? (
          <p className="text-gray-500 mt-4">No units/rooms added yet. Add units to make this listing bookable.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {units.map(unit => (
              <div key={unit._id} className="border p-4 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{unit.type || unit.name}</h3>
                  <p>Capacity: {unit.capacity} people</p>
                  <p>Price: ${unit.price}</p>
                  <p>Available: {unit.availability ? 'Yes' : 'No'}</p>
                </div>
                <div className="space-x-2">
                  <button onClick={() => navigate(`/vendor/units/${unit._id}/edit`)} className="px-3 py-1 bg-yellow-500 text-white rounded">Edit</button>
                  <button onClick={() => handleDeleteUnit(unit._id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingDetail;
