import React, { useState } from 'react';
import { ArrowRightLeft, User, Mail, CheckCircle, AlertTriangle } from 'lucide-react';
import { useBooking } from '../../contexts/BookingContext';
import { useAuth } from '../../contexts/AuthContext';
import { ticketService } from '../../services/ticketService';

// Optional: move this to a separate file like services/ticketService.js
const transferTicketApi = async (payload) => {
  const response = await fetch('https://localhost:5001/api/tickets/transfer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Ticket transfer failed.');
  }

  return await response.json();
};

export const TransferTicket = () => {
  const { tickets, updateTicketStatus } = useBooking();
  const { user } = useAuth();

  const [selectedTicket, setSelectedTicket] = useState('');
  const [transferToEmail, setTransferToEmail] = useState('');
  const [transferToName, setTransferToName] = useState('');
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const activeTickets = tickets.filter(
    ticket => ticket.userId === user?.id && ticket.status === 'active'
  );

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!selectedTicket || !transferToEmail || !transferToName) return;

    setIsProcessing(true);
    setError('');
    try {
      const payload = {
        ticketId: parseInt(selectedTicket),
        recipientPhoneOrEmailOrUserId: transferToEmail
      };

      // await transferTicketApi(payload);

      //using call through service
      await ticketService.transferTicket(payload);

      updateTicketStatus(selectedTicket, 'transferred');
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setSelectedTicket('');
        setTransferToEmail('');
        setTransferToName('');
        setReason('');
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedTicketDetails = tickets.find(t => t.id === selectedTicket);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Transfer Ticket</h2>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ticket Transferred Successfully!</h3>
            <p className="text-gray-600">The ticket has been transferred to the new owner.</p>
          </div>
        ) : activeTickets.length === 0 ? (
          <div className="text-center py-8">
            <ArrowRightLeft className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Tickets</h3>
            <p className="text-gray-600">You don't have any active tickets that can be transferred.</p>
          </div>
        ) : (
          <form onSubmit={handleTransfer} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Ticket to Transfer
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
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Ticket Details:</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• Travel Date: {new Date(selectedTicketDetails.travelDate).toLocaleDateString()}</p>
                  <p>• Route: Route #{selectedTicketDetails.routeId}</p>
                  <p>• Bus: {selectedTicketDetails.busId}</p>
                  <p>• Seats: {selectedTicketDetails.seatNumbers.join(', ')}</p>
                  <p>• Amount: ${selectedTicketDetails.totalAmount.toFixed(2)}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transfer to (Name)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={transferToName}
                    onChange={(e) => setTransferToName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter recipient's full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transfer to (Email)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={transferToEmail}
                    onChange={(e) => setTransferToEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter recipient's email"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Transfer (Optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please provide a reason for transferring your ticket..."
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-100 border border-red-200 p-3 rounded-md">
                ⚠️ {error}
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Transfer Policy:</p>
                  <ul className="space-y-1">
                    <li>• Tickets can be transferred up to 4 hours before departure</li>
                    <li>• The recipient must accept the transfer via email</li>
                    <li>• Transfer fees may apply for premium tickets</li>
                    <li>• Both parties will receive confirmation emails</li>
                    <li>• ID verification required for the new ticket holder</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing || !selectedTicket || !transferToEmail || !transferToName}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              {isProcessing ? 'Processing Transfer...' : 'Transfer Ticket'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};