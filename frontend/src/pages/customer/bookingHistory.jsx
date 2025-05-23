import React, { useState, useEffect } from 'react';
import { customerService } from '../../services/api';
import { Link } from 'react-router-dom';

export const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await customerService.getBookingHistory();
      setBookings(data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load booking history. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const timeAgo = (dateString) => {
    const updatedAt = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - updatedAt) / 1000);

    if (seconds < 60) return `${seconds} sec ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Booking History</h1>

      {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">{error}</div>}
      
      {loading ? (
        <div className="text-center py-8">Loading your bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-8">
          <p className="mb-4">You don't have any bookings yet.</p>
          <Link to="/customer/listings" className="text-blue-600 font-medium">Browse listings</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.id} className="border rounded p-4 shadow">
              
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-1">{booking.listingData.name}</h3>
                  <p className="text-gray-600">{booking.listingData.address}</p>
                  <div className="mt-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {booking.status}
                    </span>
                    <span className="ml-2 text-gray-500 text-sm">
                      {booking.status === 'Pending' 
                        ? `Pending from ${timeAgo(booking.updatedAt)}` 
                        : timeAgo(booking.updatedAt)}
                    </span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <p className="text-sm">
                    <span className="font-medium">Check-in:</span> {formatDate(booking.bookingDates)}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Check-in-time:</span> {booking.bookingTime}
                  </p>
                  <p className="font-bold mt-2">${booking.unitData.price}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t flex justify-end">
                {booking.status === 'Completed' ? (
                  booking.hasReviewed ? (
                    <span className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm">
                      Reviewed ✅
                    </span>
                  ) : (
                    <Link 
                      to={`/customer/booking/review/${booking._id}`}
                      className="bg-green-600 text-white px-4 py-2 rounded text-sm"
                    >
                      Leave Review
                    </Link>
                  )
                ) : null}
                <Link 
                  to={`/customer/listings/${booking.listingId}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm ml-2"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
