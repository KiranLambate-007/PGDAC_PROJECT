import React, { useState } from 'react';
import { CreditCard, Smartphone, Building } from 'lucide-react';
import { useBooking } from '../../contexts/BookingContext';
import { loadRazorpay } from './RazorpayUtils';

export const PaymentForm = ({ onPaymentSuccess, onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const { selectedSeats, selectedRoute } = useBooking();

  const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulated card payment delay
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 2000);
  };

  const handleUpiPayment = async () => {
    const res = await loadRazorpay();
    if (!res) return;

    const options = {
      key: "rzp_test_uyfP9qWStu9InV", // Replace with your Razorpay test key
      amount: totalAmount * 100, // amount in paise
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
        contact: "94050106",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const PaymentMethodCard = ({ method, icon: Icon, title, description, onSelect }) => {
    const handleClick = () => {
      setPaymentMethod(method);
      if (method === 'mobile' && onSelect) {
        onSelect(); // Trigger Razorpay UPI
      }
    };

    return (
      <div
        className={`border rounded-lg p-4 cursor-pointer transition-all ${
          paymentMethod === method
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={handleClick}
      >
        <div className="flex items-center space-x-3">
          <Icon className="h-6 w-6 text-gray-600" />
          <div>
            <div className="font-medium text-gray-900">{title}</div>
            <div className="text-sm text-gray-500">{description}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>

      {/* Booking Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Booking Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Route:</span>
            <span>{selectedRoute?.origin} → {selectedRoute?.destination}</span>
          </div>
          <div className="flex justify-between">
            <span>Seats:</span>
            <span>{selectedSeats.map(s => s.seatNumber).join(', ')}</span>
          </div>
          <div className="flex justify-between">
            <span>Number of tickets:</span>
            <span>{selectedSeats.length}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg border-t pt-2">
            <span>Total Amount:</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Method Options */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Select Payment Method</h3>
        <div className="space-y-3">
          <PaymentMethodCard
            method="card"
            icon={CreditCard}
            title="Credit/Debit Card"
            description="Pay securely with your card"
          />
          <PaymentMethodCard
            method="mobile"
            icon={Smartphone}
            title="UPI Payment"
            description="Pay via UPI using Razorpay"
            onSelect={handleUpiPayment}
          />
          {/* Future Option */}
          {/* <PaymentMethodCard
            method="bank"
            icon={Building}
            title="Bank Transfer"
            description="Direct bank transfer"
          /> */}
        </div>
      </div>

      {/* Card Payment Form */}
      {paymentMethod === 'card' && (
        <form onSubmit={handlePayment}>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
            >
              Back to Seats
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
               {isProcessing ? 'Processing...' : `Pay ₹${totalAmount.toFixed(2)}`}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};