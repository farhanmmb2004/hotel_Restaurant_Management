import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerService } from '../../services/api';
import { Link } from 'react-router-dom';
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
    return <div className="container mx-auto p-4 text-center">Loading listing details...</div>;
  }

  if (!listing) {
    return <div className="container mx-auto p-4 text-center">Listing not found</div>;
  }
    return (
        <div className="container mx-auto p-4">
          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>
          )}
      
          {!listing ? (
            <div className="container mx-auto p-4 text-center">
              Listing not found
            </div>
          ) : (
            <>
              <div className="mb-6">
                <button onClick={() => navigate(-1)} className="text-blue-600">
                  ← Back to Listings
                </button>
              </div>
      
              <div className="grid grid-cols-1 gap-8">
                <div>
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-96 object-cover rounded"
                  />
                </div>
      
                <h1 className="text-3xl font-bold mt-6 mb-3">{listing.name}</h1>
                <p className="text-lg text-gray-600 mb-4">{listing.address}</p>
      
                <div className="flex items-center mb-6">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span>{listing.rating}</span>
                  <span className="mx-2">•</span>
                  <span>{3} reviews</span>
                </div>
      
                <div className="mb-6 pb-6 border-b">
                  <h2 className="text-xl font-semibold mb-3">Description</h2>
                  <p className="text-gray-700">{listing.description}</p>
                </div>
      
                <div className="mb-6 pb-6 border-b">
                  <h2 className="text-xl font-semibold mb-3">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {listing.facilities &&
                      listing.facilities.split(",").map((facility, index) => (
                        <div key={index} className="flex items-center">
                          <span>✓</span>
                          <span className="ml-2">{facility.trim()}</span>
                        </div>
                      ))}
                  </div>
                </div>
      
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Available Units</h2>
      
                  {!listing.unitDetails || listing.unitDetails.length === 0 ? (
                    <div className="text-center py-8 bg-gray-100 rounded">
                      No units are currently available for this listing.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {listing.unitDetails &&
                        listing.unitDetails.map((unit) => (
                          <div
                            key={unit._id}
                            className="border rounded shadow overflow-hidden"
                          >
                            <div className="p-4">
                              <h3 className="text-xl font-bold mb-2">{unit.name}</h3>
      
                              <div className="mb-3">
                                <p className="text-gray-700">{unit.availability
                                }</p>
                              </div>
      
                              <div className="flex justify-between items-center mb-3">
                                <div className="text-sm">
                                  <p>
                                    <span className="font-medium">Capacity:</span>{" "}
                                    {unit.capacity || 2}
                                  </p>
                                  <p>
                                    <span className="font-medium">Type:</span>{" "}
                                    {unit.type}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-2xl font-bold">${unit.price}</p>
                                  <p className="text-sm text-gray-600">{unit.type==="Table"?"hour":"night"}</p>
                                </div>
                              </div>
      
                              <div className="mt-4">
                              <Link 
  to={`/customer/booking/${listingId}/${unit._id}`} 
  className="w-full"
>
  <button
    className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700"
  >
    Book This Unit
  </button>
</Link>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
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