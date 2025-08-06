import React from 'react';

const CardPaymentForm = ({ onPaymentSuccess }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // integrate Razorpay here or simulate success
    alert("Card payment processed (dummy)");
    onPaymentSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Card Number" required />
      <input type="text" placeholder="Expiry MM/YY" required />
      <input type="text" placeholder="CVV" required />
      <button type="submit">Pay</button>
    </form>
  );
};

export default CardPaymentForm;
