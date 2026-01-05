import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [units, setUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, unitId: null, unitName: '' });

  useEffect(() => {
    fetchListingDetails();
  }, [id]);

  const fetchListingDetails = async () => {
    setIsLoading(true);
    try {
      const listingResponse = await api.vendor.getListingDetails(id);
      setListing(listingResponse.data);
      if (listingResponse.data.unitDetails) {
        setUnits(listingResponse.data.unitDetails);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load listing details. Please try again later.');
      console.error('Listing details error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUnit = async (unitId) => {
    try {
      await api.vendor.deleteUnit(unitId);
      setUnits(units.filter(unit => unit._id !== unitId));
      setDeleteModal({ open: false, unitId: null, unitName: '' });
    } catch (err) {
      alert('Failed to delete unit. Please try again.');
      console.error('Delete unit error:', err);
    }
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link to="/vendor/dashboard" className="text-blue-600 hover:text-blue-800">Dashboard</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/vendor/listings" className="text-blue-600 hover:text-blue-800">Listings</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{listing?.name}</span>
        </nav>

        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {!listing ? (
          <EmptyState 
            icon="🏨"
            title="Listing Not Found"
            description="The listing you're looking for doesn't exist."
            actionLabel="Back to Listings"
            onAction={() => navigate('/vendor/listings')}
          />
        ) : (
          <>
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {listing.name}
                  </h1>
                  <div className="flex items-center gap-3">
                    <Badge variant={listing.type === 'Hotel' ? 'primary' : 'accent'}>
                      {listing.type === 'Hotel' ? '🏨 Hotel' : '🍽️ Restaurant'}
                    </Badge>
                    <span className="text-gray-600">{listing.address}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/vendor/listings')}
                  >
                    ← Back
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/vendor/listings/${id}/edit`)}
                  >
                    ✏️ Edit
                  </Button>
                </div>
              </div>
            </div>

            {/* Listing Details Card */}
            <Card className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Details</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Image Section */}
                <div>
                  {listing.image ? (
                    <img 
                      src={listing.image} 
                      alt={listing.name} 
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-6xl">
                        {listing.type === 'Hotel' ? '🏨' : '🍽️'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Base Price</h3>
                    <p className="text-2xl font-bold text-green-600">${listing.pricing} <span className="text-sm text-gray-500">per night</span></p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Facilities</h3>
                    <div className="flex flex-wrap gap-2">
                      {listing.facilities?.split(',').map((facility, index) => (
                        <Badge key={index} variant="secondary">
                          {facility.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{listing.description}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Units/Rooms Section */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Units & Rooms ({units.length})
                </h2>
                <Button
                  variant="accent"
                  onClick={() => navigate(`/vendor/listings/${id}/units/add`)}
                >
                  + Add Unit
                </Button>
              </div>
              
              {units.length === 0 ? (
                <EmptyState 
                  icon="🏠"
                  title="No Units Added Yet"
                  description="Add units/rooms to make this listing bookable by customers."
                  actionLabel="Add First Unit"
                  onAction={() => navigate(`/vendor/listings/${id}/units/add`)}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {units.map(unit => (
                    <Card key={unit._id} padding="sm" className="border-2 hover:border-blue-300">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{unit.type || unit.name}</h3>
                          <Badge variant={unit.availability ? 'success' : 'danger'} className="mt-1">
                            {unit.availability ? '✓ Available' : '✗ Unavailable'}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">👥 Capacity:</span>
                          <span className="font-medium">{unit.capacity} people</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">💰 Price:</span>
                          <span className="font-bold text-green-600">${unit.price}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1"
                          onClick={() => navigate(`/vendor/units/${unit._id}/edit`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="flex-1"
                          onClick={() => setDeleteModal({ open: true, unitId: unit._id, unitName: unit.type || unit.name })}
                        >
                          Delete
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, unitId: null, unitName: '' })}
        title="Delete Unit"
      >
        <div className="text-center py-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Are you sure you want to delete this unit?
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Unit: <span className="font-semibold">{deleteModal.unitName}</span>
            <br />
            This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ open: false, unitId: null, unitName: '' })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDeleteUnit(deleteModal.unitId)}
            >
              Delete Unit
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default ListingDetail;
