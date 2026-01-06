import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { customerService } from '../../services/api';
import { Navigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
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
    return <LoadingSpinner />;
  }
  if (booked) {
    return <Navigate to="/customer/booking/history" />;
  }
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Error</h3>
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg mb-4">
              <p className="text-red-800">{error}</p>
            </div>
            <Button variant="secondary" onClick={() => navigate(-1)}>← Back to Listing</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!listing || !unit) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">🏨</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Not Found</h3>
          <p className="text-gray-600 mb-6">The listing or unit you're looking for doesn't exist.</p>
          <Button variant="primary" onClick={() => navigate('/customer/listings')}>Browse Listings</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>← Back to Listing</Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Complete Your Booking 📅</h1>
          <p className="text-gray-600">Just a few more details to confirm your reservation</p>
        </div>
      
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date *</label>
                  <input
                    type="date"
                    name="bookingDate"
                    value={bookingDetails.bookingDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Time *</label>
                  <input
                    type="time"
                    name="bookingTime"
                    value={bookingDetails.bookingTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    '✓ Confirm Booking'
                  )}
                </Button>
              </form>
            </Card>
          </div>
          
          <div>
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Reservation Summary</h2>
              
              {listing.image ? (
                <div className="aspect-video rounded-lg mb-6 overflow-hidden">
                  <img
                    src={listing.image}
                    alt={listing.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mb-6 flex items-center justify-center text-4xl">
                  {listing.type === 'Hotel' ? '🏨' : '🍽️'}
                </div>
              )}
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{unit.name || unit.type}</h3>
              <p className="text-gray-600 mb-6">{listing.address}</p>
              
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 font-medium">💰 Price</span>
                  <span className="text-2xl font-bold text-purple-600">${unit.price}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 font-medium">👥 Capacity</span>
                  <span className="text-gray-900 font-semibold">{unit.capacity || 2} guests</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">🏷️ Type</span>
                  <span className="text-gray-900 font-semibold">{unit.type}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">✨ Property Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {listing.facilities &&
                  listing.facilities.split(",").map((facility, index) => (
                    <div key={index} className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>{facility.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
    </div>
  );
};