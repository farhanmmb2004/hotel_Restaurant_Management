import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import moment from 'moment'; // Install moment.js for time formatting

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [expandedBooking, setExpandedBooking] = useState(null); // Track expanded booking
  
  useEffect(() => {
    fetchBookings();
  }, []);
  // const getUserNameFromToken = () => {
  //   const token = localStorage.getItem('accessToken');
  
  //   if (!token) return null;
  
  //   try {
  //     // JWT structure: header.payload.signature
  //     const payloadBase64 = token.split('.')[1]; // Extract payload part
  //     const decodedPayload = JSON.parse(atob(payloadBase64)); // Decode base64
  
  //     return decodedPayload.name || null; // Return the 'name' field if present
  //   } catch (error) {
  //     console.error('Invalid token format:', error);
  //     return null;
  //   }
  // };
  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await api.vendor.getVendorBookings();
      setBookings(response.data || []);
      console.log(response.data);
//       const userName = getUserNameFromToken();
// console.log('User Name:', userName);
      setError(null);
    } catch (err) {
      setError('Failed to load bookings. Please try again later.');
      console.error('Bookings error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await api.vendor.updateBookingStatus(bookingId, { status: newStatus });
      setBookings(bookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: newStatus } 
          : booking
      ));
      alert(`Booking status updated to ${newStatus}`);
    } catch (err) {
      alert('Failed to update booking status. Please try again.');
      console.error('Update booking error:', err);
    }
  };

  const toggleDetails = (bookingId) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status.toLowerCase() === filter);

  if (isLoading) return <div className="text-center text-gray-600">Loading bookings...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Manage Bookings</h1>
      
      <div className="flex space-x-4 mb-4">
        {['all', 'pending', 'confirmed', 'completed'].map(status => (
          <button 
            key={status} 
            onClick={() => setFilter(status)} 
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${filter === status ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>
      
      {filteredBookings.length === 0 ? (
        <p className="text-gray-600 text-center">No bookings found.</p>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map(booking => (
            <div key={booking._id} className="p-4 border rounded-lg shadow-sm">
              <p className="text-gray-600">Date: {new Date(booking.bookingDates).toLocaleDateString()}</p>
              <p className="text-gray-600">Time: {booking.bookingTime}</p>
              
              {/* Highlighted Status */}
              <p className={`px-2 py-1 inline-block rounded-lg font-semibold p-4 
  ${booking.status === 'Pending' ? 'text-yellow-500' :
    booking.status === 'Cancelled' ? 'text-red-500' :
    booking.status === 'Confirmed' ? 'text-green-500' :
    booking.status === 'Completed' ? 'text-blue-500' :
    'text-gray-500'}`}>
  {booking.status}
</p>


              {/* Time Ago Feature */}
              <p className="text-gray-500 text-sm italic">Requested {moment(booking.createdAt).fromNow()}</p>

              <p className="text-gray-600">Customer: {booking.customerName}</p>
              
              <div className="flex space-x-2 mt-2">
                <button 
                  onClick={() => toggleDetails(booking._id)} 
                  className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  {expandedBooking === booking._id ? 'Hide Details' : 'View Details'}
                </button>

                {booking.status === 'Pending' && (
                  <button 
                    onClick={() => handleStatusChange(booking._id, 'Confirmed')} 
                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Confirm Booking
                  </button>
                )}
                {booking.status === 'Confirmed' && (
                  <button 
                    onClick={() => handleStatusChange(booking._id, 'Completed')} 
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Mark as Completed
                  </button>
                )}
                {booking.status === 'Pending' && (
                  <button 
                    onClick={() => handleStatusChange(booking._id, 'Cancelled')} 
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>

              {expandedBooking === booking._id && (
                <div>
                  <div className="mt-4 p-3 border rounded-lg bg-gray-100">
                    <h4 className="text-md font-semibold">{booking.listingDetails?.type} Details</h4>
                    <p className="text-gray-600"><strong>Name:</strong> {booking.listingDetails?.name}</p>
                    <p className="text-gray-600"><strong>Address:</strong> {booking.listingDetails?.address}</p>
                  </div>
                  <div className="mt-4 p-3 border rounded-lg bg-gray-100">
                    <h4 className="text-md font-semibold">Customer Details</h4>
                    <p className="text-gray-600"><strong>Name:</strong> {booking.customerDetails?.name}</p>
                    <p className="text-gray-600"><strong>Email:</strong> {booking.customerDetails?.email}</p>
                    <p className="text-gray-600"><strong>Phone:</strong> {booking.customerDetails?.phone}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
