import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerService } from '../../services/api';

export const Review = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reviewData.comment.trim()) {
      setError('Please provide a comment for your review.');
      return;
    }
    
    try {
      setLoading(true);
      console.log(reviewData);
      await customerService.submitReview(bookingId, reviewData);
      navigate(-1);
    } catch (err) {
      setError('Failed to submit review. Please try again.');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Leave a Review</h1>
      
      {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">{error}</div>}
      
      <form onSubmit={handleSubmit} className="bg-white p-6 border rounded shadow">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Rating</label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                className="text-2xl focus:outline-none"
              >
                {star <= reviewData.rating ? "★" : "☆"}
              </button>
            ))}
            <span className="ml-2 text-gray-600">{reviewData.rating} out of 5</span>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" htmlFor="comment">
            Your Review
          </label>
          <textarea
            id="comment"
            name="comment"
            rows="4"
            value={reviewData.comment}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Share details of your experience..."
            required
          ></textarea>
        </div>
        
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded disabled:bg-blue-300"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};