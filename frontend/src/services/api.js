import axios from 'axios';

const BASE_URL = 'https://heliverse-assingment-1.onrender.com/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/users/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  loginUser: async (credentials) => {
    try {
      const response = await api.post('/users/login', credentials);
      console.log("hello");
      if (response.data.data.accessToken) {
        localStorage.setItem('token', response.data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
        console.log(error);
      throw error.response?.data || error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/users/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// Customer Services
export const customerService = {
  getListings: async (filters = {}) => {
    try {
      const response = await api.get('/users/listings', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getListingDetails: async (listingId) => {
    try {
      const response = await api.get(`/users/listings/${listingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createBooking: async (listingId, unitId, bookingData) => {
    try {
      const response = await api.post(`/users/bookings/${listingId}/${unitId}`, bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getBookingHistory: async () => {
    try {
      const response = await api.get('/users/bookings/history');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  submitReview: async (bookingId, reviewData) => {
    try {
      const response = await api.post(`/users/reviews/${bookingId}`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// Vendor Services

export const vendorService = {
    getListingDetails: async (listingId) => {
        try {
          const response = await api.get(`/users/listings/${listingId}`);
          return response.data;
        } catch (error) {
          throw error.response?.data || error;
        }
      },
    getListings: async (vendorId) => {
        try {
          const response = await api.get(`vendors/listings/${vendorId}`);
          return response.data;
        } catch (error) {
          throw error.response?.data || error;
        }
      },
  createListing: async (listingData) => {
    try {
        console.log(listingData);
      const response = await api.post('/vendors', listingData);
      return response.data;
    } catch (error) {
        console.error(error)
      throw error.response?.data || error;
    }
  },

  updateListing: async (listingId, updateData) => {
    try {
      const response = await api.patch(`vendors/${listingId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteListing: async (listingId) => {
    try {
      const response = await api.delete(`/${listingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getVendorBookings: async () => {
    try {
      const response = await api.get(`/vendors/bookings`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateBookingStatus: async (bookingId, status) => {
    try {
      const response = await api.patch(`/vendors${bookingId}`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  addUnit: async (listingId, unitData) => {
    try {
      const response = await api.post(`vendors/unit/${listingId}`, unitData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateUnit: async (unitId, unitData) => {
    try {
      const response = await api.patch(`vendors/unit/${unitId}`, unitData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteUnit: async (unitId) => {
    try {
      const response = await api.delete(`vendors/unit/${unitId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAnalytics: async () => {
    try {
      const response = await api.get('vendors/analytics');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default {
  auth: authService,
  customer: customerService,
  vendor: vendorService
};