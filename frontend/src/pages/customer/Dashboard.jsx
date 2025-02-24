import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import  {customerService}  from '../../services/api.js';

const CustomerDashboard = () => {
  const{getListings}=customerService
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    try {
      const response = await getListings(filters);
      console.log(response.data);
      setListings(response.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Location"
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
        <input
          type="number"
          placeholder="Min Price"
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
        />
        <input
          type="number"
          placeholder="Max Price"
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
        />
      </div>
      <div>
        {listings.map(listing => (
          <div key={listing._id} onClick={() => navigate(`customer/listing/${listing._id}`)}>
            <h3>{listing.name}</h3>
            <p>Price : {listing.pricing}</p>
            <p>location : {listing.address}</p>
            <img src={  listing.image} alt="" />
            <p>descriptin : {listing.description}</p>
            <p>facilities : {listing.facilities}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerDashboard;