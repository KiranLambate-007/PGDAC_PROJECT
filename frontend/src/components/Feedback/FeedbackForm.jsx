import React, { useState } from 'react';

export const FeedbackForm = () => {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: Replace with actual API call
    console.log('Feedback submitted:', message);

    setSubmitted(true);
    setMessage('');
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
