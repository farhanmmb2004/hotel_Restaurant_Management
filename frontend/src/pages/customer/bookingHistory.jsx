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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Booking History</h1>

      {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">{error}</div>}
      
      {loading ? (
        <div className="text-center py-8">Loading your bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-8">
          <p className="mb-4">You don't have any bookings yet.</p>
          <Link to="/" className="text-blue-600 font-medium">Browse listings</Link>
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
                  </div>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <p className="text-sm">
                    <span className="font-medium">Check-in:</span> {formatDate(booking.bookingDates)}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Check-in-time:</span> {booking.bookingTime}
                  </p>
                  {/* <p className="text-sm">
                    <span className="font-medium">Guests:</span> {booking.guests}
                  </p> */}
                  <p className="font-bold mt-2">${booking.unitId.price}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t flex justify-end">
                {booking.status === 'Completed' && !booking.hasReviewrd && (
                  <Link 
                    to={`customer/booking/review/${booking._id}`}
                    className="bg-green-600 text-white px-4 py-2 rounded text-sm"
                  >
                    Leave Review
                  </Link>
                )}
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