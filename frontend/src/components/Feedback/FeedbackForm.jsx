import React, { useState } from 'react';
import axios from 'axios';

export const FeedbackForm = () => {
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const feedbackData = {
        message,
        rating: parseInt(rating),
        // userId: 1, // Optional if backend gets from auth token/session
      };

      await axios.post('https://localhost:7143/api/Feedbacks', feedbackData); // Replace with actual API URL

      setSubmitted(true);
      setMessage('');
      setRating('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">We value your feedback</h2>
      {submitted ? (
        <p className="text-green-600">Thank you for your feedback!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md mb-4 resize-none"
            rows="5"
            placeholder="Write your feedback here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <label className="block mb-2 font-medium">Rating (1 to 5)</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          >
            <option value="">Select rating</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Feedback
          </button>
        </form>
      )}
    </div>
  );
};
