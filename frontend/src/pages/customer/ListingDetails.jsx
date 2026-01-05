import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerService } from '../../services/api';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
export const ListingDetails = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchListingDetails();
  }, [listingId]);

  const fetchListingDetails = async () => {
    try {
      setLoading(true);
      const data = await customerService.getListingDetails(listingId);
      setListing(data.data);
      console.log(data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load listing details. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookUnit = (unitId) => {
    navigate(`customer/booking/${listingId}/${unitId}`);
  };

  if (loading && !listing) {
    return <LoadingSpinner fullScreen />;
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState
            icon="🔍"
            title="Listing Not Found"
            description="The property you're looking for doesn't exist or has been removed."
            actionLabel="Browse All Listings"
            onAction={() => navigate('/customer/listings')}
          />
        </div>
        <Footer />
      </div>
    );
  }
    return (
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {error && (
              <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <div className="mb-6">
              <Button variant="ghost" onClick={() => navigate(-1)}>
                ← Browse Properties
              </Button>
            </div>
      
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Image Gallery */}
                <div className="mb-8">
                  {listing.image ? (
                    <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                      <img
                        src={listing.image}
                        alt={listing.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center text-6xl shadow-lg">
                      {listing.type === 'Hotel' ? '🏨' : '🍽️'}
                    </div>
                  )}
                </div>

                {/* Property Details */}
                <Card className="mb-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{listing.name}</h1>
                      <p className="text-lg text-gray-600 flex items-center gap-2">
                        <span>📍</span> {listing.address}
                      </p>
                    </div>
                    <Badge variant={listing.type === 'Hotel' ? 'primary' : 'accent'} className="text-lg px-4 py-2">
                      {listing.type === 'Hotel' ? '🏨 Hotel' : '🍽️ Restaurant'}
                    </Badge>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">📝 Description</h2>
                    <p className="text-gray-700 leading-relaxed">{listing.description}</p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">✨ Amenities & Facilities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {listing.facilities &&
                        listing.facilities.split(",").map((facility, index) => (
                          <div key={index} className="flex items-center bg-green-50 rounded-lg p-3">
                            <span className="text-green-500 mr-2 text-xl">✓</span>
                            <span className="text-gray-800 font-medium">{facility.trim()}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </Card>

                {/* Available Units */}
                <Card>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">🏠 Available Units ({listing.unitDetails?.length || 0})</h2>
      
                  {!listing.unitDetails || listing.unitDetails.length === 0 ? (
                    <EmptyState
                      icon="🔒"
                      title="No Units Available"
                      description="There are currently no units available for this property. Please check back later."
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {listing.unitDetails.map((unit) => (
                        <Card key={unit._id} padding="sm" className="border-2 hover:border-purple-300">
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xl font-bold text-gray-900">{unit.name}</h3>
                              <Badge variant={unit.availability ? 'success' : 'danger'}>
                                {unit.availability ? '✓ Available' : '✗ Unavailable'}
                              </Badge>
                            </div>
                            <Badge variant="secondary">{unit.type}</Badge>
                          </div>
      
                          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 mb-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-gray-700 font-medium">👥 Capacity</span>
                              <span className="text-gray-900 font-bold">{unit.capacity || 2} guests</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700 font-medium">💰 Price</span>
                              <div className="text-right">
                                <span className="text-2xl font-bold text-purple-600">${unit.price}</span>
                                <span className="text-sm text-gray-500 ml-1">/{unit.type === "Table" ? "hour" : "night"}</span>
                              </div>
                            </div>
                          </div>
      
                          <Link to={`/customer/booking/${listingId}/${unit._id}`} className="block">
                            <Button variant="primary" size="lg" className="w-full" disabled={!unit.availability}>
                              {unit.availability ? '📅 Book This Unit' : 'Not Available'}
                            </Button>
                          </Link>
                        </Card>
                      ))}
                    </div>
                  )}
                </Card>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">💰 Pricing</h3>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
                    <p className="text-gray-600 text-sm mb-1">Starting from</p>
                    <p className="text-4xl font-bold text-purple-600 mb-1">${listing.pricing}</p>
                    <p className="text-gray-600 text-sm">per night</p>
                  </div>

                  {listing.unitDetails && listing.unitDetails.length > 0 && (
                    <Button 
                      variant="accent" 
                      size="lg" 
                      className="w-full mb-4"
                      onClick={() => {
                        const firstAvailableUnit = listing.unitDetails.find(u => u.availability);
                        if (firstAvailableUnit) {
                          navigate(`/customer/booking/${listingId}/${firstAvailableUnit._id}`);
                        }
                      }}
                    >
                      🎯 Quick Book
                    </Button>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-3">📋 Property Info</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Property Type:</span>
                        <span className="font-semibold text-gray-900">{listing.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Units:</span>
                        <span className="font-semibold text-gray-900">{listing.unitDetails?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Available:</span>
                        <span className="font-semibold text-green-600">
                          {listing.unitDetails?.filter(u => u.availability).length || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      );
    }      
      
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { customerService } from '../../services/api';

// export const ListingDetails = () => {
//   const { listingId } = useParams();
//   const navigate = useNavigate();
  
//   const [listing, setListing] = useState(null);
//   const [selectedUnit, setSelectedUnit] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [bookingDetails, setBookingDetails] = useState({
//     startDate: '',
//     endDate: '',
//     guests: 1
//   });

//   useEffect(() => {
//     fetchListingDetails();
//   }, [listingId]);

//   const fetchListingDetails = async () => {
//     try {
//       setLoading(true);
//       const data = await customerService.getListingDetails(listingId);
//       console.log(data.data);
//       setListing(data.data);
//       if (data.units && data.units.length > 0) {
//         setSelectedUnit(data.units[0].id);
//       }
//       setError(null);
//     } catch (err) {
//       setError('Failed to load listing details. Please try again later.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setBookingDetails(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleUnitChange = (e) => {
//     setSelectedUnit(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       setLoading(true);
//       await customerService.createBooking(listingId, selectedUnit, bookingDetails);
//       navigate('/bookings/success');
//     } catch (err) {
//       setError('Failed to create booking. Please try again.');
//       console.error(err);
//       setLoading(false);
//     }
//   };

//   if (loading && !listing) {
//     return <div className="container mx-auto p-4 text-center">Loading listing details...</div>;
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto p-4">
//         <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>
//       </div>
//     );
//   }

//   if (!listing) {
//     return <div className="container mx-auto p-4 text-center">Listing not found</div>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <div className="mb-6">
//         <button 
//           onClick={() => navigate(-1)}
//           className="text-blue-600"
//         >
//           ← Back to Listings
//         </button>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2">
//           {listing.images && listing.images.length > 0 ? (
//             <img 
//               src={listing.images[0]} 
//               alt={listing.title} 
//               className="w-full h-96 object-cover rounded"
//             />
//           ) : (
//             <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded">
//               <span>No image available</span>
//             </div>
//           )}

//           <h1 className="text-3xl font-bold mt-6 mb-3">{listing.title}</h1>
//           <p className="text-lg text-gray-600 mb-4">{listing.location}</p>
          
//           <div className="flex items-center mb-6">
//             <span className="text-yellow-500 mr-1">★</span>
//             <span>{listing.rating}</span>
//             <span className="mx-2">•</span>
//             <span>{listing.reviews} reviews</span>
//           </div>
          
//           <div className="mb-6 pb-6 border-b">
//             <h2 className="text-xl font-semibold mb-3">Description</h2>
//             <p className="text-gray-700">{listing.description}</p>
//           </div>
          
//           <div className="mb-6 pb-6 border-b">
//             <h2 className="text-xl font-semibold mb-3">Amenities</h2>
//             <div className="grid grid-cols-2 gap-2">
//               {listing.amenities && listing.amenities.map((amenity, index) => (
//                 <div key={index} className="flex items-center">
//                   <span>✓</span>
//                   <span className="ml-2">{amenity}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div>
//           <div className="bg-white p-6 border rounded shadow sticky top-4">
//             <h2 className="text-xl font-semibold mb-4">Book this listing</h2>
//             <p className="text-2xl font-bold mb-4">${listing.price}<span className="text-base font-normal text-gray-600">/night</span></p>
            
//             <form onSubmit={handleSubmit}>
//               {listing.units && listing.units.length > 0 && (
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium mb-1">Select Unit</label>
//                   <select
//                     value={selectedUnit}
//                     onChange={handleUnitChange}
//                     className="w-full p-2 border rounded"
//                     required
//                   >
//                     {listing.units.map(unit => (
//                       <option key={unit.id} value={unit.id}>
//                         {unit.name} - ${unit.price}/night
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               )}
              
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Check In</label>
//                 <input
//                   type="date"
//                   name="startDate"
//                   value={bookingDetails.startDate}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                   required
//                 />
//               </div>
              
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Check Out</label>
//                 <input
//                   type="date"
//                   name="endDate"
//                   value={bookingDetails.endDate}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded"
//                   required
//                 />
//               </div>
              
//               <div className="mb-6">
//                 <label className="block text-sm font-medium mb-1">Guests</label>
//                 <input
//                   type="number"
//                   name="guests"
//                   value={bookingDetails.guests}
//                   onChange={handleInputChange}
//                   min="1"
//                   max={listing.maxGuests || 10}
//                   className="w-full p-2 border rounded"
//                   required
//                 />
//               </div>
              
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 disabled:bg-blue-300"
//               >
//                 {loading ? 'Processing...' : 'Book Now'}
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };