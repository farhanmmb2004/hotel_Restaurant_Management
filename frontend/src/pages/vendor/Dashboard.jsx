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
  const [expandedBooking, setExpandedBooking] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const listingsResponse = await api.vendor.getListings(user?._id);
        setListings(listingsResponse.data || []);
        
        const bookingsResponse = await api.vendor.getVendorBookings();
        // console.log(bookingsResponse.data);
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

  const toggleDetails = (id) => {
    setExpandedBooking(expandedBooking === id ? null : id);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.vendor.updateBookingStatus(id, newStatus);
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === id ? { ...booking, status: newStatus } : booking
        )
      );
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  if (isLoading) return <div className="text-center py-10 text-lg font-semibold">Loading dashboard...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 text-center">Vendor Dashboard</h1>
      <p className="text-gray-600 text-center mt-2">Welcome back, <span className="font-semibold">{user?.name}</span></p>
      
      <div className="mt-6 bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-700">Quick Actions</h2>
        <div className="flex space-x-4 mt-4">
          <Link to="/vendor/listings/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add New Listing</Link>
          <Link to="/vendor/listings" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Manage Listings</Link>
          <Link to="/vendor/bookings" className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">Manage Bookings</Link>
        </div>
      </div>
      
      <div className="mt-6 bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-700">Your Hotels and Restaurant ({listings.length})</h2>
        {listings.length === 0 ? (
          <p className="text-gray-600 mt-4">You don't have any listings yet. Create your first listing to start receiving bookings.</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.slice(0, 3).map(listing => (
              <div key={listing._id} className="p-4 bg-gray-50 border rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800">{listing.name}</h3>
                <p className="text-gray-600">{listing.pricing ? `$${listing.pricing}` : 'Price varies'}</p>
                <Link to={`/vendor/listings/${listing._id}`} className="text-blue-600 mt-2 inline-block hover:underline">View Details</Link>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-6 bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-700">Recent Bookings ({bookings.length})</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-600 mt-4">No bookings yet.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {bookings.slice(0,4).map(booking => (
              <div key={booking._id} className="p-4 border rounded-lg shadow-sm">
                <p className="text-gray-600">Date: {new Date(booking.bookingDates).toLocaleDateString()}</p>
                <p className="text-gray-600">Time: {booking.bookingTime}</p>
                <p className="text-gray-600">Status: {booking.status}</p>
                <p className="text-gray-600">Customer: {booking.customerDetails?.name}</p>
                {expandedBooking === booking._id && (
                <div>
                  <div className="mt-4 p-3 border rounded-lg bg-gray-100">
                  <h4 className="text-md font-semibold">{booking.listingDetails.type} Details</h4>
                  <p className="text-gray-600"><strong>Name:</strong> {booking.listingDetails?.name}</p>
                  <p className="text-gray-600"><strong>address:</strong> {booking.listingDetails?.address}</p>
                </div>
                <div className="mt-4 p-3 border rounded-lg bg-gray-100">
                  <h4 className="text-md font-semibold">Customer Details</h4>
                  <p className="text-gray-600"><strong>Name:</strong> {booking.customerDetails?.name}</p>
                  <p className="text-gray-600"><strong>Email:</strong> {booking.customerDetails?.email}</p>
                  <p className="text-gray-600"><strong>Phone:</strong> {booking.customerDetails?.phone}</p>
                </div>
              </div>)}
                <div className="flex space-x-2 mt-2">
                  <button onClick={() => toggleDetails(booking._id)} className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600">{expandedBooking===booking._id?"hide":"view details"}</button>
                </div>
                
              </div>
            ))}
           <Link to="/vendor/bookings" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
  see all booking
</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
