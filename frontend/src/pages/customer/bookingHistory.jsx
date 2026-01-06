import React, { useState, useEffect } from 'react';
import { customerService } from '../../services/api';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

export const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToFavorite, setAddingToFavorite] = useState(null);

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

  const handleAddToFavorites = async (unitId, bookingId) => {
    try {
      setAddingToFavorite(bookingId);
      await customerService.addToFavorites(unitId);
      // Update the booking's isFavorite status
      setBookings(prev => prev.map(booking => 
        booking._id === bookingId 
          ? { ...booking, isFavorite: true }
          : booking
      ));
    } catch (err) {
      console.error('Failed to add to favorites:', err);
      setError('Failed to add to favorites. Please try again.');
    } finally {
      setAddingToFavorite(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Booking History 📋
          </h1>
          <p className="text-gray-600">View and manage all your past and upcoming bookings</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}
      
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-7 bg-gray-200 rounded w-48"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-64 mb-2"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-4 bg-gray-200 rounded w-40"></div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="h-9 bg-gray-200 rounded w-32"></div>
                    <div className="h-9 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <EmptyState
            icon="📅"
            title="No Bookings Yet"
            description="You haven't made any bookings yet. Start exploring properties to make your first reservation!"
            actionLabel="Browse Listings"
            onAction={() => window.location.href = '/customer/listings'}
          />
        ) : (
          <div className="space-y-6">
            {bookings.map(booking => (
              <Card key={booking.id}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{booking.listingData.name}</h3>
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
                    
                    <p className="text-gray-600 mb-2">{booking.listingData.address}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <span>📅</span>
                        <span><strong>Check-in:</strong> {formatDate(booking.bookingDates)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <span>🕐</span>
                        <span><strong>Time:</strong> {booking.bookingTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <span>💰</span>
                        <span><strong>Price:</strong> ${booking.unitData.price}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-xs">
                        <span>🕒</span>
                        <span>
                          {booking.status === 'Pending' 
                            ? `Pending from ${timeAgo(booking.updatedAt)}` 
                            : `Updated ${timeAgo(booking.updatedAt)}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    {!booking.isFavorite ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full sm:w-auto"
                        onClick={() => handleAddToFavorites(booking.unitId, booking._id)}
                        disabled={addingToFavorite === booking._id}
                      >
                        {addingToFavorite === booking._id ? '...' : '❤️ Add to Favorites'}
                      </Button>
                    ) : (
                      <Badge variant="danger" className="flex items-center justify-center">
                        ❤️ Favorited
                      </Badge>
                    )}
                    {booking.status === 'Completed' && (
                      booking.hasReviewed ? (
                        <Badge variant="success" className="flex items-center justify-center">
                          Reviewed ✅
                        </Badge>
                      ) : (
                        <Link to={`/customer/booking/review/${booking._id}`}>
                          <Button variant="accent" size="sm" className="w-full sm:w-auto">
                            ⭐ Leave Review
                          </Button>
                        </Link>
                      )
                    )}
                    <Link to={`/customer/listings/${booking.listingId}`}>
                      <Button variant="primary" size="sm" className="w-full sm:w-auto">
                        👁️ View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
    </div>
  );
};
