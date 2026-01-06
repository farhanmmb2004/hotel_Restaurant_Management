import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerService } from '../../services/api.js';
import Card from '../../components/Card';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';

const Favorites = () => {
  const navigate = useNavigate();
  const { getFavorites, removeFromFavorites } = customerService;
  
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingFavorite, setRemovingFavorite] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await getFavorites();
      setFavorites(response.data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  // Transform API data to match component structure
  const transformedFavorites = favorites.map(fav => ({
    _id: fav._id,
    unitId: fav._id,
    listingId: fav.listingId,
    name: fav.listingDetails?.[0]?.name || 'N/A',
    unitName: fav.name,
    unitType: fav.type,
    description: fav.listingDetails?.[0]?.description || '',
    propertyType: fav.listingDetails?.[0]?.type?.toLowerCase() || 'hotel',
    location: fav.listingDetails?.[0]?.address || 'N/A',
    rating: 4.5, // You can add this to backend later
    reviewCount: 0, // You can add this to backend later
    pricePerNight: fav.price,
    capacity: fav.capacity,
    image: fav.listingDetails?.[0]?.image || '',
    amenities: fav.listingDetails?.[0]?.facilities?.split(',').map(f => f.trim()) || [],
    availability: fav.availability
  }));

  const removeFavorite = async (unitId) => {
    try {
      setRemovingFavorite(unitId);
      await removeFromFavorites(unitId);
      // Remove from local state
      setFavorites(prev => prev.filter(fav => fav._id !== unitId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Failed to remove from favorites. Please try again.');
    } finally {
      setRemovingFavorite(null);
    }
  };

  const viewDetails = (listingId) => {
    navigate(`/customer/listings/${listingId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                My Favorites ❤️
              </h1>
              <p className="text-gray-600 text-lg">
                Your saved properties and restaurants ({transformedFavorites.length})
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/customer/dashboard')}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Favorites Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                    <div className="h-8 bg-gray-200 rounded w-28"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : transformedFavorites.length === 0 ? (
          <EmptyState
            icon="❤️"
            title="No favorites yet"
            message="Start exploring and add your favorite properties to see them here"
            actionLabel="Browse Listings"
            onAction={() => navigate('/customer/listings')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transformedFavorites.map((listing) => (
              <Card key={listing._id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Image */}
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg relative overflow-hidden">
                  {listing.image ? (
                    <img 
                      src={listing.image} 
                      alt={listing.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      {listing.propertyType === 'hotel' ? '🏨' : '🍽️'}
                    </div>
                  )}
                  
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(listing._id);
                    }}
                    disabled={removingFavorite === listing._id}
                    className={`absolute top-3 right-3 p-2 bg-white rounded-full shadow-md transition-colors ${
                      removingFavorite === listing._id 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-red-50'
                    }`}
                  >
                    <svg className="w-6 h-6 text-red-500 fill-current" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-xl text-gray-900">{listing.name}</h3>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full capitalize">
                      {listing.propertyType}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {listing.description}
                  </p>

                  {/* Location */}
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{listing.location}</span>
                  </div>

                  {/* Rating & Reviews */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="flex items-center text-yellow-500">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 text-sm font-semibold text-gray-900">{listing.rating}</span>
                      </div>
                      <span className="ml-2 text-sm text-gray-500">({listing.reviewCount} reviews)</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {listing.amenities.slice(0, 3).map((amenity, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                    {listing.amenities.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        +{listing.amenities.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">${listing.pricePerNight}</span>
                      <span className="text-sm text-gray-500 ml-1">/night</span>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => viewDetails(listing.listingId)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Card */}
        {!loading && transformedFavorites.length > 0 && (
          <Card className="mt-8 bg-gradient-to-r from-pink-50 to-red-50 border-2 border-pink-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  You have {transformedFavorites.length} favorite{transformedFavorites.length !== 1 ? 's' : ''}
                </h3>
                <p className="text-gray-600 mb-4">
                  {transformedFavorites.filter(f => f.propertyType === 'hotel').length} Hotels • {' '}
                  {transformedFavorites.filter(f => f.propertyType === 'restaurant').length} Restaurants
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/customer/listings')}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add More Favorites
                </Button>
              </div>
              <div className="hidden md:block text-6xl">💝</div>
            </div>
          </Card>
        )}
    </div>
  );
};

export default Favorites;
