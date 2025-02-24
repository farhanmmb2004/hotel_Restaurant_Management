import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { customerService } from '../../services/api';
import { Navigate } from 'react-router-dom';
export const Booking = () => {
  const { listingId, unitId } = useParams();
  const navigate = useNavigate();
  const[booked,setBooked]=useState(false);
  const [listing, setListing] = useState(null);
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    bookingDate: '',
    bookingTime: ''
  });

  useEffect(() => {
    fetchData();
  }, [listingId, unitId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await customerService.getListingDetails(listingId);
      setListing(data.data);
      
      // Find the selected unit
      const selectedUnit = data.data.unitDetails.find(u => u._id === unitId);
      if (!selectedUnit) {
        throw new Error('Unit not found');
      }
      setUnit(selectedUnit);
      
      setError(null);
    } catch (err) {
      setError('Failed to load booking details. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await customerService.createBooking(listingId, unitId, bookingDetails);
    //   navigate('customer/bookings/history');
    setBooked(true);
    } catch (err) {
      setError('Failed to create booking. Please try again.');
      console.error(err);
      setLoading(false);
    }
  };

  if (loading && (!listing || !unit)) {
    return <div className="container mx-auto p-4 text-center">Loading booking details...</div>;
  }
  if (booked) {
    return <Navigate to="/customer/booking/history" />;
  }
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>
        <div className="mt-4">
          <button 
            onClick={() => navigate(-1)}
            className="text-blue-600"
          >
            ← Back to Listing
          </button>
        </div>
      </div>
    );
  }

  if (!listing || !unit) {
    return (
      <div className="container mx-auto p-4 text-center">
        Listing or unit not found
        <div className="mt-4">
          <button 
            onClick={() => navigate('/listings')}
            className="text-blue-600"
          >
            Browse Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="text-blue-600"
        >
          ← Back to Listing
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6">Book Your Stay</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-white p-6 border rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Booking Date</label>
                <input
                  type="date"
                  name="bookingDate"
                  value={bookingDetails.bookingDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Booking Time</label>
                <input
                  type="time"
                  name="bookingTime"
                  value={bookingDetails.bookingTime}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 disabled:bg-blue-300"
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
        
        <div>
          <div className="bg-white p-6 border rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Unit Details</h2>
            
            <div className="mb-4">
              {listing.image ? (
                <img
                  src={listing.image}
                  alt={listing.name}
                  className="w-full h-48 object-cover rounded"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded">
                  <span>No image available</span>
                </div>
              )}
            </div>
            
            <h3 className="text-lg font-bold mb-2">{unit.name}</h3>
            <p className="text-gray-700 mb-4">{unit.description}</p>
            
            <div className="text-sm space-y-2">
              <p><span className="font-medium">Location:</span> {listing.location}</p>
              <p><span className="font-medium">Price:</span> ${unit.price}/night</p>
              <p><span className="font-medium">Capacity:</span> {unit.capacity || 'N/A'} guests</p>
              <p><span className="font-medium">Size:</span> {unit.size || 'N/A'}</p>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium mb-2">Property Amenities</h3>
              <div className="grid grid-cols-2 gap-2">
              {listing.facilities &&
              listing.facilities.split(",").map((facility, index) => (
               <div key={index} className="flex items-center">
               <span>✓</span>
               <span className="ml-2">{facility.trim()}</span>
               </div>
  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};