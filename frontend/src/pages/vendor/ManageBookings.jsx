import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import moment from 'moment';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

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

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Manage Bookings 📋
          </h1>
          <p className="text-gray-600">View and manage all your property bookings</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-3">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                filter === status
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">
                {status === 'all' ? bookings.length : bookings.filter(b => b.status.toLowerCase() === status).length}
              </span>
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No Bookings Found"
            description={filter === 'all' 
              ? "You don't have any bookings yet. Once customers start booking, they'll appear here." 
              : `No ${filter} bookings at the moment.`}
          />
        ) : (
          <div className="space-y-4">
            {filteredBookings.map(booking => (
              <Card key={booking._id}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Booking Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-gray-900">
                        {booking.listingDetails?.name || 'Unknown Listing'}
                      </h3>
                      <Badge 
                        variant={
                          booking.status === 'Pending' ? 'warning' :
                          booking.status === 'Confirmed' ? 'success' :
                          booking.status === 'Completed' ? 'primary' :
                          booking.status === 'Cancelled' ? 'danger' :
                          'secondary'
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>👤</span>
                        <span>{booking.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>📅</span>
                        <span>{new Date(booking.bookingDates).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>🕐</span>
                        <span>{booking.bookingTime}</span>
                      </div>
                    </div>

                    <p className="text-gray-500 text-xs mt-2 italic">
                      Requested {moment(booking.createdAt).fromNow()}
                    </p>

                    {/* Expanded Details */}
                    {expandedBooking === booking._id && (
                      <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {booking.listingDetails?.type} Details
                          </h4>
                          <div className="space-y-1 text-sm">
                            <p className="text-gray-700">
                              <span className="font-medium">Name:</span> {booking.listingDetails?.name}
                            </p>
                            <p className="text-gray-700">
                              <span className="font-medium">Address:</span> {booking.listingDetails?.address}
                            </p>
                          </div>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Customer Details</h4>
                          <div className="space-y-1 text-sm">
                            <p className="text-gray-700">
                              <span className="font-medium">Name:</span> {booking.customerDetails?.name}
                            </p>
                            <p className="text-gray-700">
                              <span className="font-medium">Email:</span> {booking.customerDetails?.email}
                            </p>
                            <p className="text-gray-700">
                              <span className="font-medium">Phone:</span> {booking.customerDetails?.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 lg:items-end">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => toggleDetails(booking._id)}
                    >
                      {expandedBooking === booking._id ? '👆 Hide Details' : '👁️ View Details'}
                    </Button>

                    {booking.status === 'Pending' && (
                      <div className="flex gap-2">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleStatusChange(booking._id, 'Confirmed')}
                        >
                          ✓ Confirm
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleStatusChange(booking._id, 'Cancelled')}
                        >
                          ✗ Cancel
                        </Button>
                      </div>
                    )}

                    {booking.status === 'Confirmed' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleStatusChange(booking._id, 'Completed')}
                      >
                        ✓ Mark Completed
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ManageBookings;
