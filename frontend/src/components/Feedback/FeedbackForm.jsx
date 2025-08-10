import React, { useState } from 'react';
import axios from 'axios';

export const FeedbackForm = () => {
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      userId: 1,
      ticketId: 4,
      comments: message,
      rating: parseInt(rating),
    };

    try {
      await axios.post('https://localhost:7143/api/Feedback', payload);
      setSubmitted(true);
      setMessage('');
      setRating('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">We Value Your Feedback</h2>

      {submitted ? (
        <p className="text-green-600 font-medium text-center">Thank you for your feedback!</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-gray-700 font-medium mb-1" htmlFor="message">
            Your Feedback
          </label>
          <textarea
            id="message"
            rows="5"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            placeholder="Write your feedback here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <label className="block text-gray-700 font-medium mb-1" htmlFor="rating">
            Rating
          </label>
          <select
            id="rating"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a rating
            </option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-300"
          >
            Submit Feedback
          </button>
        </form>
      )}
    </div>
  );
};
