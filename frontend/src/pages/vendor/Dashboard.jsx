import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import LoadingSpinner from '../../components/LoadingSpinner';

const VendorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  const stats = [
    { label: 'Total Listings', value: listings.length, icon: '🏨', color: 'from-blue-600 to-blue-700' },
    { label: 'Total Bookings', value: bookings.length, icon: '📅', color: 'from-green-600 to-green-700' },
    { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, icon: '⏳', color: 'from-yellow-600 to-yellow-700' },
    { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, icon: '✅', color: 'from-purple-600 to-purple-700' },
  ];

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="max-w-md">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-red-500">{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Vendor Dashboard <span className="text-purple-600">🏢</span>
          </h1>
          <p className="text-gray-600 text-lg">Welcome back, <span className="font-semibold text-purple-600">{user?.name}</span>! Manage your properties and bookings.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white" hover={false}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="text-5xl">{stat.icon}</div>
              </div>
              <div className={`mt-4 h-2 bg-gradient-to-r ${stat.color} rounded-full`}></div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="primary"
              size="lg"
              className="w-full justify-center"
              onClick={() => navigate('/vendor/listings/new')}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Listing
            </Button>
            <Button
              variant="accent"
              size="lg"
              className="w-full justify-center"
              onClick={() => navigate('/vendor/listings')}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Manage Listings
            </Button>
            <Button
              variant="success"
              size="lg"
              className="w-full justify-center"
              onClick={() => navigate('/vendor/bookings')}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Manage Bookings
            </Button>
          </div>
        </Card>

        {/* Your Properties */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Properties ({listings.length})</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/vendor/listings')}>
              View All
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>

          {listings.length === 0 ? (
            <Card className="text-center py-12">
              <div className="text-6xl mb-4">🏨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Listings Yet</h3>
              <p className="text-gray-600 mb-6">Create your first listing to start receiving bookings.</p>
              <Button variant="primary" onClick={() => navigate('/vendor/listings/new')}>
                Create First Listing
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.slice(0, 3).map(listing => (
                <Card key={listing._id} className="cursor-pointer" onClick={() => navigate(`/vendor/listings/${listing._id}`)}>
                  {listing.image ? (
                    <div className="aspect-video rounded-lg mb-4 overflow-hidden">
                      <img 
                        src={listing.image} 
                        alt={listing.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mb-4 flex items-center justify-center text-4xl">
                      {listing.type === 'Hotel' ? '🏨' : '🍽️'}
                    </div>
                  )}
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{listing.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{listing.address}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-purple-600">${listing.pricing}</span>
                    <Badge variant="purple">{listing.type}</Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Bookings ({bookings.length})</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/vendor/bookings')}>
              View All
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>

          {bookings.length === 0 ? (
            <Card className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Bookings Yet</h3>
              <p className="text-gray-600">Bookings will appear here once customers start booking.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookings.slice(0, 4).map(booking => (
                <Card key={booking._id} hover={false}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant={booking.status}>{booking.status}</Badge>
                        <span className="text-sm text-gray-500">{new Date(booking.bookingDates).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-900 font-semibold">{booking.customerDetails?.name}</p>
                      <p className="text-sm text-gray-600">Time: {booking.bookingTime}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleDetails(booking._id)}
                      >
                        {expandedBooking === booking._id ? 'Hide Details' : 'View Details'}
                      </Button>
                    </div>
                  </div>

                  {expandedBooking === booking._id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">{booking.listingDetails?.type} Details</h4>
                          <p className="text-sm text-gray-600"><strong>Name:</strong> {booking.listingDetails?.name}</p>
                          <p className="text-sm text-gray-600"><strong>Address:</strong> {booking.listingDetails?.address}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">Customer Details</h4>
                          <p className="text-sm text-gray-600"><strong>Email:</strong> {booking.customerDetails?.email}</p>
                          <p className="text-sm text-gray-600"><strong>Phone:</strong> {booking.customerDetails?.phone}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VendorDashboard;
