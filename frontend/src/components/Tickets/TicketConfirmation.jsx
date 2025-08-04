import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import { CheckCircle, Download, ArrowRight } from 'lucide-react';
import { useBooking } from '../../contexts/BookingContext';
import { useAuth } from '../../contexts/AuthContext';

export const TicketConfirmation = ({ onStartOver }) => {
  const { selectedRoute, selectedBus, selectedSeats, addTicket, clearSelectedSeats } = useBooking();
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [isGeneratingQR, setIsGeneratingQR] = useState(true);

  useEffect(() => {
    if (selectedRoute && selectedBus && selectedSeats.length > 0 && user) {
      setTimeout(() => {
        const newTickets = selectedSeats.map((seat, index) => {
          const qrData = `ticket-${Date.now()}-${index}`; // Unique QR data string

          const ticket = {
            id: qrData,
            userId: user.id,
            routeId: selectedRoute.id,
            busId: selectedBus.id,
            seatNumbers: [seat.seatNumber],
            qrCodes: [qrData],  // Actual QR code data string here
            status: 'active',
            bookingDate: new Date().toISOString(),
            travelDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
            totalAmount: seat.price,
            paymentStatus: 'completed'
          };

          addTicket(ticket);
          return ticket;
        });

        setTickets(newTickets);
        setIsGeneratingQR(false);
      }, 2000);
    }
  }, [selectedRoute, selectedBus, selectedSeats, user, addTicket]);

  const handleStartOver = () => {
    clearSelectedSeats();
    onStartOver();
  };

  const handleDownloadTickets = () => {
    alert('Tickets downloaded to your device!');
  };

  const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600">
          Your tickets have been successfully booked and QR codes generated.
        </p>
      </div>

      {/* Booking Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Route:</span>
            <p className="font-medium">{selectedRoute?.origin} → {selectedRoute?.destination}</p>
          </div>
          <div>
            <span className="text-gray-600">Bus:</span>
            <p className="font-medium">{selectedBus?.busNumber} ({selectedBus?.busType})</p>
          </div>
          <div>
            <span className="text-gray-600">Departure:</span>
            <p className="font-medium">{selectedBus?.departureTime}</p>
          </div>
          <div>
            <span className="text-gray-600">Total Amount:</span>
            <p className="font-medium text-blue-600">${totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Tickets */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Tickets</h3>

        {isGeneratingQR ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Generating QR codes for your tickets...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket, index) => (
              <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <span className="font-medium text-gray-900">
                      Ticket #{index + 1}
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      {ticket.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Seat: {ticket.seatNumbers[0]}</p>
                    <p>Booking ID: {ticket.id}</p>
                  </div>
                </div>
                <div>
                  {/* QR code display */}
                  <QRCode value={ticket.qrCodes[0]} size={96} fgColor="#2563eb" bgColor="#f3f4f6" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          onClick={handleDownloadTickets}
          disabled={isGeneratingQR}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Tickets
        </button>
        <button
          onClick={handleStartOver}
          className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center"
        >
          <ArrowRight className="h-4 w-4 mr-2" />
          Book Another Trip
        </button>
      </div>

      {/* Important Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Important Information:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Please arrive at the departure point 15 minutes early</li>
          <li>• Present your QR code to the driver for boarding</li>
          <li>• Keep your tickets safe - they contain important travel information</li>
          <li>• You can postpone, transfer, or cancel tickets from your account</li>
        </ul>
      </div>
    </div>
  );
};
