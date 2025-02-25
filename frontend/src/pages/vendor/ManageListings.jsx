import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

const ManageListings = () => {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
    if (!window.confirm("Are you sure you want to delete this listing?")) {
      return;
    }

    try {
      await api.vendor.deleteListing(listingId);
      setListings(listings.filter((listing) => listing._id !== listingId));
    } catch (err) {
      alert("Failed to delete listing. Please try again.");
      console.error("Delete listing error:", err);
    }
  };

  if (isLoading)
    return <div className="flex justify-center items-center min-h-screen text-lg font-semibold">Loading listings...</div>;

  if (error)
    return <div className="text-red-600 text-center mt-4 font-medium">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Manage Listings</h1>

      <div className="flex justify-end mb-4">
        <Link
          to="/vendor/listings/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + Add New Listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <p className="text-center text-gray-600">You don't have any listings yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <div key={listing._id} className="bg-white shadow-lg rounded-lg p-4 border">
              <h3 className="text-xl font-semibold text-gray-800">{listing.name}</h3>
              <p className="text-gray-600">{listing.address}</p>
              <p className="font-semibold mt-2">{listing.pricing ? `$${listing.pricing}` : "Price varies"}</p>

              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => navigate(`/vendor/listings/${listing._id}`)}
                  className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                >
                  View
                </button>
                <button
                  onClick={() => navigate(`/vendor/listings/${listing._id}/edit`)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(listing._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageListings;
