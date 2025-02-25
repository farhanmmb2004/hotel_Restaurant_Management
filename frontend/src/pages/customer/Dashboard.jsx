import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerService } from '../../services/api.js';

const CustomerDashboard = () => {
  const { getListings } = customerService;
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve and parse
  const userName = user?.name || 'Guest'; // Extract name or fallback to 'Guest'

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    try {
      const response = await getListings(filters);
      setListings(response.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-xl font-semibold mb-4">Welcome, {userName}</h1>
      <div className="justify-between mb-4">
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => navigate('/customer/booking/history')}
        >
          View Booking History
        </button>
        
        <button 
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          onClick={() => navigate('/customer/listings')}
        >
          Browse Hotels & Restaurants
        </button>
      </div>
    </div>
  );
};

export default CustomerDashboard;
