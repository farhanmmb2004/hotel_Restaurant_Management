import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute.jsx';
import Login from './pages/Login';
import CustomerDashboard from './pages/customer/Dashboard';
import Unauthorized from './pages/unAuthorized.jsx';
//customer
import {Listings} from './pages/customer/Listings.jsx';
import {ListingDetails} from './pages/customer/ListingDetails.jsx';
import { BookingHistory } from './pages/customer/bookingHistory.jsx';
import { Booking } from './pages/customer/Booking.jsx';
import { Review } from './pages/customer/Review.jsx';
//vendor
import VendorDashboard from './pages/vendor/Dashboard';
import ManageListings from './pages/vendor/ManageListings';
import AddListing from './pages/vendor/AddListing';
import ListingDetail from './pages/vendor/ListingDetail';
import EditListing from './pages/vendor/EditListing';
import AddUnit from './pages/vendor/AddUnit';
// import EditUnit from './pages/vendor/EditUnit';
import ManageBookings from './pages/vendor/ManageBookings';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}
          <Route 
            path="/customer/dashboard" 
            element={
              <PrivateRoute allowedRoles={['customer']}>
                <CustomerDashboard />
              </PrivateRoute>
            } 
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route 
            path="/vendor/dashboard" 
            element={
              <PrivateRoute allowedRoles={['vendor']}>
                <VendorDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/customer/listings" 
            element={
              <PrivateRoute allowedRoles={['customer']}>
                <Listings />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/customer/listings/:listingId" 
            element={
              <PrivateRoute allowedRoles={['customer']}>
                <ListingDetails/>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/customer/booking/:listingId/:unitId" 
            element={
              <PrivateRoute allowedRoles={['customer']}>
                <Booking/>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/customer/booking/history" 
            element={
              <PrivateRoute allowedRoles={['customer']}>
                <BookingHistory/>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/customer/booking/review/:bookingId" 
            element={
              <PrivateRoute allowedRoles={['customer']}>
                <Review/>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/vendor/listings" 
            element={
              <PrivateRoute allowedRoles={['vendor']}>
                <ManageListings />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/vendor/listings/new" 
            element={
              <PrivateRoute allowedRoles={['vendor']}>
                <AddListing />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/vendor/listings/:id" 
            element={
              <PrivateRoute allowedRoles={['vendor']}>
                <ListingDetail />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/vendor/listings/:id/edit" 
            element={
              <PrivateRoute allowedRoles={['vendor']}>
                <EditListing />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/vendor/listings/:id/units/add" 
            element={
              <PrivateRoute allowedRoles={['vendor']}>
                <AddUnit />
              </PrivateRoute>
            } 
          />
          {/* <Route 
            path="/vendor/units/:id/edit" 
            element={
              <PrivateRoute allowedRoles={['vendor']}>
                <EditUnit />
              </PrivateRoute>
            } 
          /> */}
          <Route 
            path="/vendor/bookings" 
            element={
              <PrivateRoute allowedRoles={['vendor']}>
                <ManageBookings />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;