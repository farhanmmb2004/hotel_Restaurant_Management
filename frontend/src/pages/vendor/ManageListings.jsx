import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Badge from "../../components/Badge";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";

const ManageListings = () => {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, listingId: null, listingName: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const userString = localStorage.getItem("user") || sessionStorage.getItem("user");

      if (!userString) {
        throw new Error("Vendor ID not found. Please log in again.");
      }

      const user = JSON.parse(userString);
      const { _id } = user;
      const response = await api.vendor.getListings(_id);
      setListings(response.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to load listings. Please try again later.");
      console.error("Listings error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (listingId) => {
    try {
      await api.vendor.deleteListing(listingId);
      setListings(listings.filter((listing) => listing._id !== listingId));
      setDeleteModal({ open: false, listingId: null, listingName: '' });
    } catch (err) {
      alert("Failed to delete listing. Please try again.");
      console.error("Delete listing error:", err);
    }
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Manage Listings 🏨
              </h1>
              <p className="text-gray-600">View and manage all your properties</p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/vendor/listings/new')}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Listing
            </Button>
          </div>
        </div>

        {error && (
          <Card className="mb-6 bg-red-50 border-2 border-red-200">
            <p className="text-red-800 text-center">{error}</p>
          </Card>
        )}

        {listings.length === 0 ? (
          <EmptyState
            title="No Listings Yet"
            description="Create your first listing to start receiving bookings and grow your business."
            icon="🏨"
            actionLabel="Create First Listing"
            onAction={() => navigate('/vendor/listings/new')}
          />
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {listings.length} {listings.length === 1 ? 'listing' : 'listings'}
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <Card key={listing._id} hover={true} className="relative group">
                  {/* Image or Icon */}
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mb-4 flex items-center justify-center text-5xl overflow-hidden">
                    {listing.image ? (
                      <img src={listing.image} alt={listing.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{listing.type === 'Hotel' ? '🏨' : '🍽️'}</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{listing.name}</h3>
                      <Badge variant="purple" size="sm">{listing.type}</Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {listing.address}
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      ${listing.pricing || 0}
                      <span className="text-sm font-normal text-gray-500">/night</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/vendor/listings/${listing._id}`)}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/vendor/listings/${listing._id}/edit`)}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setDeleteModal({ open: true, listingId: listing._id, listingName: listing.name })}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, listingId: null, listingName: '' })}
        title="Delete Listing"
        size="md"
      >
        <div className="text-center py-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Are you sure?</h3>
          <p className="text-gray-600 mb-6">
            Do you want to delete "<span className="font-semibold">{deleteModal.listingName}</span>"? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ open: false, listingId: null, listingName: '' })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDelete(deleteModal.listingId)}
            >
              Delete Listing
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default ManageListings;