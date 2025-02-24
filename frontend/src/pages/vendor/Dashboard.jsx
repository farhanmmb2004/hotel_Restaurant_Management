import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const VendorDashboard = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch vendor's listings
        const listingsResponse = await api.vendor.getListings(user?._id);
        console.log(listingsResponse);
        setListings(listingsResponse.data || []);
        
        // Fetch recent bookings
        const bookingsResponse = await api.vendor.getVendorBookings();
        setBookings(bookingsResponse.data || []);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error('Dashboard data error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) return <div>Loading dashboard...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Vendor Dashboard</h1>
      <p>Welcome back, {user?.name}</p>
      
      <div>
        <h2>Quick Actions</h2>
        <div>
          <Link to="/vendor/listings/new">Add New Listing</Link>
          <Link to="/vendor/listings">Manage Listings</Link>
          <Link to="/vendor/bookings">Manage Bookings</Link>
        </div>
      </div>
      
      <div>
        <h2>Your Recent Listings ({listings.length})</h2>
        {listings.length === 0 ? (
          <p>You don't have any listings yet. Create your first listing to start receiving bookings.</p>
        ) : (
          <div>
            {listings.slice(0, 3).map(listing => (
              <div key={listing._id}>
                <h3>{listing.name}</h3>
                <p>{listing.pricing ? `$${listing.pricing}` : 'Price varies'}</p>
                <Link to={`/vendor/listings/${listing._id}`}>View Details</Link>
              </div>
            ))}
            {listings.length > 3 && <Link to="/vendor/listings">View all listings</Link>}
          </div>
        )}
      </div>
      
      <div>
        <h2>Recent Bookings ({bookings.length})</h2>
        {bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <div>
            {bookings.slice(0, 5).map(booking => (
              <div key={booking._id}>
                <p>Booking ID: {booking._id}</p>
                <p>Status: {booking.status}</p>
                <p>Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                <Link to={`/vendor/bookings/${booking._id}`}>View Details</Link>
              </div>
            ))}
            {bookings.length > 5 && <Link to="/vendor/bookings">View all bookings</Link>}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;