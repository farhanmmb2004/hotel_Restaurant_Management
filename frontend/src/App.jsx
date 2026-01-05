import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/customer/Dashboard';
import Unauthorized from './pages/Unauthorized.jsx';

// Customer
import { Listings } from './pages/customer/Listings.jsx';
import { ListingDetails } from './pages/customer/ListingDetails.jsx';
import { BookingHistory } from './pages/customer/bookingHistory.jsx';
import { Booking } from './pages/customer/Booking.jsx';
import { Review } from './pages/customer/Review.jsx';

// Vendor
import VendorDashboard from './pages/vendor/Dashboard';
import ManageListings from './pages/vendor/ManageListings';
import AddListing from './pages/vendor/AddListing';
import ListingDetail from './pages/vendor/ListingDetail';
import EditListing from './pages/vendor/EditListing';
import AddUnit from './pages/vendor/AddUnit';
import ManageBookings from './pages/vendor/ManageBookings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Customer Routes */}
            <Route path="/customer/dashboard" element={<PrivateRoute allowedRoles={['customer']}><CustomerDashboard /></PrivateRoute>} />
            <Route path="/customer/listings" element={<PrivateRoute allowedRoles={['customer']}><Listings /></PrivateRoute>} />
            <Route path="/customer/listings/:listingId" element={<PrivateRoute allowedRoles={['customer']}><ListingDetails /></PrivateRoute>} />
            <Route path="/customer/booking/:listingId/:unitId" element={<PrivateRoute allowedRoles={['customer']}><Booking /></PrivateRoute>} />
            <Route path="/customer/booking/history" element={<PrivateRoute allowedRoles={['customer']}><BookingHistory /></PrivateRoute>} />
            <Route path="/customer/booking/review/:bookingId" element={<PrivateRoute allowedRoles={['customer']}><Review /></PrivateRoute>} />

            {/* Vendor Routes */}
            <Route path="/vendor/dashboard" element={<PrivateRoute allowedRoles={['vendor']}><VendorDashboard /></PrivateRoute>} />
            <Route path="/vendor/listings" element={<PrivateRoute allowedRoles={['vendor']}><ManageListings /></PrivateRoute>} />
            <Route path="/vendor/listings/new" element={<PrivateRoute allowedRoles={['vendor']}><AddListing /></PrivateRoute>} />
            <Route path="/vendor/listings/:id" element={<PrivateRoute allowedRoles={['vendor']}><ListingDetail /></PrivateRoute>} />
            <Route path="/vendor/listings/:id/edit" element={<PrivateRoute allowedRoles={['vendor']}><EditListing /></PrivateRoute>} />
            <Route path="/vendor/listings/:id/units/add" element={<PrivateRoute allowedRoles={['vendor']}><AddUnit /></PrivateRoute>} />
            <Route path="/vendor/bookings" element={<PrivateRoute allowedRoles={['vendor']}><ManageBookings /></PrivateRoute>} />
          </Routes>
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
