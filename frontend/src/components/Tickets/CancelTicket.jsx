import React, { useState } from 'react';
import { XCircle, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react';
import { useBooking } from '../../contexts/BookingContext';
import { useAuth } from '../../contexts/AuthContext';

export const CancelTicket = () => {
  const { tickets, updateTicketStatus } = useBooking();
  const { user } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState('');
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);

  const activeTickets = tickets.filter(
    ticket => ticket.userId === user?.id && ticket.status === 'active'
  );

  const calculateRefund = (ticket) => {
    const hoursUntilDeparture = 48; // Mock value

    if (hoursUntilDeparture >= 24) {
      return ticket.totalAmount * 0.9;
    } else if (hoursUntilDeparture >= 4) {
      return ticket.totalAmount * 0.5;
    } else {
      return 0;
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    if (!selectedTicket) return;

    const ticket = tickets.find(t => t.id === selectedTicket);
    if (!ticket) return;

    setIsProcessing(true);
    const refund = calculateRefund(ticket);
    setRefundAmount(refund);

    setTimeout(() => {
      updateTicketStatus(selectedTicket, 'cancelled');
      setIsProcessing(false);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setSelectedTicket('');
        setReason('');
        setRefundAmount(0);
      }, 5000);
    }, 2000);
  };

  const selectedTicketDetails = tickets.find(t => t.id === selectedTicket);
  const estimatedRefund = selectedTicketDetails ? calculateRefund(selectedTicketDetails) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Cancel & Refund</h2>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ticket Cancelled Successfully!</h3>
            <p className="text-gray-600 mb-4">Your ticket has been cancelled and refund is being processed.</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-lg font-semibold text-green-900">
                  Refund Amount: ${refundAmount.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-green-700 mt-2">
                Refund will be processed within 3-5 business days.
              </p>
            </div>
          </div>
        ) : activeTickets.length === 0 ? (
          <div className="text-center py-8">
            <XCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Tickets</h3>
            <p className="text-gray-600">You don't have any active tickets that can be cancelled.</p>
          </div>
        ) : (
          <form onSubmit={handleCancel} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Ticket to Cancel
              </label>
              <select
                value={selectedTicket}
                onChange={(e) => setSelectedTicket(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Choose a ticket</option>
                {activeTickets.map((ticket) => (
                  <option key={ticket.id} value={ticket.id}>
                    Ticket #{ticket.id.slice(-8)} - Seats: {ticket.seatNumbers.join(', ')} - ${ticket.totalAmount.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            {selectedTicketDetails && (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Ticket Details:</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>• Travel Date: {new Date(selectedTicketDetails.travelDate).toLocaleDateString()}</p>
                    <p>• Route: Route #{selectedTicketDetails.routeId}</p>
                    <p>• Bus: {selectedTicketDetails.busId}</p>
                    <p>• Seats: {selectedTicketDetails.seatNumbers.join(', ')}</p>
                    <p>• Original Amount: ${selectedTicketDetails.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium text-green-900">Estimated Refund</h4>
                  </div>
                  <div className="text-2xl font-bold text-green-900 mb-2">
                    ${estimatedRefund.toFixed(2)}
                  </div>
                  <p className="text-sm text-green-700">
                    {estimatedRefund === selectedTicketDetails.totalAmount
                      ? 'Full refund (cancelled more than 24 hours in advance)'
                      : estimatedRefund === selectedTicketDetails.totalAmount * 0.5
                      ? 'Partial refund (cancelled 4-24 hours in advance)'
                      : 'No refund available (cancelled less than 4 hours in advance)'
                    }
                  </p>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Cancellation (Optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please provide a reason for cancelling your ticket..."
              />
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="text-sm text-red-800">
                  <p className="font-medium mb-1">Cancellation Policy:</p>
                  <ul className="space-y-1">
                    <li>• 90% refund if cancelled 24+ hours before departure</li>
                    <li>• 50% refund if cancelled 4-24 hours before departure</li>
                    <li>• No refund if cancelled less than 4 hours before departure</li>
                    <li>• Refunds processed within 3-5 business days</li>
                    <li>• Cancellation fees may apply to premium tickets</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing || !selectedTicket}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <XCircle className="h-4 w-4 mr-2" />
              {isProcessing ? 'Processing Cancellation...' : 'Cancel Ticket & Request Refund'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
