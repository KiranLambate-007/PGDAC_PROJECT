import React from 'react';
import { loadRazorpay } from './RazorpayUtils';

const UpiPaymentForm = ({ onPaymentSuccess }) => {
  const handleUpiPayment = async () => {
    const res = await loadRazorpay();
    if (!res) return;

    const options = {
      key: "rzp_test_uyfP9qWStu9InV", // Replace with test key
      amount: 50000, // ₹500 in paise
      currency: "INR",
      name: "PMPML",
      description: "Bus Ticket Booking",
      handler: function (response) {
        alert("Payment Successful: " + response.razorpay_payment_id);
        onPaymentSuccess();
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9000000000",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div>
      <input type="text" placeholder="Enter your UPI ID" required />
      <button onClick={handleUpiPayment}>Pay with Razorpay</button>
    </div>
  );
};

export default UpiPaymentForm;
