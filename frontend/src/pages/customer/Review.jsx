import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerService } from '../../services/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Card from '../../components/Card';
import Button from '../../components/Button';

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Leave a Review ⭐
          </h1>
          <p className="text-gray-600">Share your experience to help other travelers</p>
        </div>
      
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}
      
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-4">How was your experience?</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                    className="text-5xl focus:outline-none hover:scale-110 transition-transform"
                  >
                    {star <= reviewData.rating ? (
                      <span className="text-yellow-400">★</span>
                    ) : (
                      <span className="text-gray-300">☆</span>
                    )}
                  </button>
                ))}
                <span className="ml-4 text-xl font-semibold text-gray-700">
                  {reviewData.rating} out of 5
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="comment">
                Your Review *
              </label>
              <textarea
                id="comment"
                name="comment"
                rows="6"
                value={reviewData.comment}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                placeholder="Share details of your experience... What did you enjoy? What could be improved?"
                required
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">
                Minimum 10 characters
              </p>
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="flex-1"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  '✓ Submit Review'
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <Footer />
    </div>
  );
};