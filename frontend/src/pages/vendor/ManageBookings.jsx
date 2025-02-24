import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await api.vendor.getVendorBookings();
      setBookings(response.data || []);
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
      
      // Update booking in the state
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

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status.toLowerCase() === filter);

  if (isLoading) return <div>Loading bookings...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Manage Bookings</h1>
      
      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('pending')}>Pending</button>
        <button onClick={() => setFilter('confirmed')}>Confirmed</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>
      
      {filteredBookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div>
          {filteredBookings.map(booking => (
            <div key={booking._id}>
              <h3>Booking #{booking._id}</h3>
              <p>Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
              <p>Time: {booking.bookingTime}</p>
              <p>Status: {booking.status}</p>
              <p>Customer: {booking.customerName}</p>
              
              {booking.status === 'Pending' && (
                <button onClick={() => handleStatusChange(booking._id, 'Confirmed')}>
                  Confirm Booking
                </button>
              )}
              
              {booking.status === 'Confirmed' && (
                <button onClick={() => handleStatusChange(booking._id, 'Completed')}>
                  Mark as Completed
                </button>
              )}
              
              {booking.status === 'Pending' && (
                <button onClick={() => handleStatusChange(booking._id, 'Cancelled')}>
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageBookings;