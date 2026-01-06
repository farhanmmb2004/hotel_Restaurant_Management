import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { customerService } from '../../services/api.js';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const { getListings, getDashboard } = customerService;
  const [recentListings, setRecentListings] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    fetchRecentListings();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchRecentListings = async () => {
    try {
      const response = await getListings({ limit: 6 });
      setRecentListings(response.data.slice(0, 6));
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickStats = dashboardData ? [
    { label: 'Total Bookings', value: dashboardData.totalBookings?.toString() || '0', icon: '📅', color: 'from-blue-600 to-blue-700' },
    { label: 'Active Bookings', value: dashboardData.activeBookings?.toString() || '0', icon: '✅', color: 'from-green-600 to-green-700' },
    { label: 'Favorites', value: dashboardData.favorites?.toString() || '0', icon: '❤️', color: 'from-red-600 to-red-700' },
    { label: 'Reviews Given', value: dashboardData.totalReviews?.toString() || '0', icon: '⭐', color: 'from-yellow-600 to-yellow-700' },
  ] : [
    { label: 'Total Bookings', value: '0', icon: '📅', color: 'from-blue-600 to-blue-700' },
    { label: 'Active Bookings', value: '0', icon: '✅', color: 'from-green-600 to-green-700' },
    { label: 'Favorites', value: '0', icon: '❤️', color: 'from-red-600 to-red-700' },
    { label: 'Reviews Given', value: '0', icon: '⭐', color: 'from-yellow-600 to-yellow-700' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, <span className="text-blue-600">{dashboardData?.name || user?.name}! 👋</span>
          </h1>
          <p className="text-gray-600 text-lg">Ready to plan your next amazing experience?</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="bg-white" hover={false}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`text-5xl`}>{stat.icon}</div>
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
              onClick={() => navigate('/customer/listings')}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse Properties
            </Button>
            <Button
              variant="accent"
              size="lg"
              className="w-full justify-center"
              onClick={() => navigate('/customer/booking/history')}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              My Bookings
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full justify-center"
              onClick={() => navigate('/customer/favorites')}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Favorites
            </Button>
          </div>
        </Card>

        {/* Recommended Listings */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/customer/listings')}>
              View All
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentListings.map((listing) => (
                <Card key={listing._id} className="cursor-pointer" onClick={() => navigate(`/customer/listings/${listing._id}`)}>
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-4 overflow-hidden">
                    {listing.image ? (
                      <img 
                        src={listing.image} 
                        alt={listing.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        {listing.propertyType === 'hotel' ? '🏨' : '🍽️'}
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{listing.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{listing.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-yellow-500">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-sm font-medium text-gray-700">4.5</span>
                    </div>
                    <span className="text-sm font-semibold text-blue-600 capitalize">{listing.propertyType}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Profile Completion */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Complete Your Profile</h3>
              <p className="text-gray-600 mb-4">Add more details to get personalized recommendations</p>
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-700">70%</span>
              </div>
              <Button variant="primary" size="sm">
                Complete Profile
              </Button>
            </div>
            <div className="hidden md:block text-6xl">✨</div>
          </div>
        </Card>
    </div>
  );
};

export default CustomerDashboard;

