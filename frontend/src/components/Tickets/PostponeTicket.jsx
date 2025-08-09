import React, { useState } from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useBooking } from '../../contexts/BookingContext';
import { useAuth } from '../../contexts/AuthContext';

export const PostponeTicket = () => {
  const { tickets, updateTicketStatus } = useBooking();
  const { user } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState('');
  const [newDate, setNewDate] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const activeTickets = tickets.filter(
    ticket => ticket.userId === user?.id && ticket.status === 'active'
  );

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    validateEmail(e.target.value);
  };

  const handlePostpone = async (e) => {
    e.preventDefault();
    if (!selectedTicket || !newDate || emailError || !email) return;

    setIsProcessing(true);

    setTimeout(() => {
      // Call your updateTicketStatus or API to handle postponing & emailing here
      updateTicketStatus(selectedTicket, 'postponed');

      setIsProcessing(false);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setSelectedTicket('');
        setNewDate('');
        setReason('');
        setEmail('');
      }, 3000);
    }, 2000);
  };

  const selectedTicketDetails = tickets.find(t => t.id === selectedTicket);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Postpone Ride</h2>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ride Postponed Successfully!</h3>
            <p className="text-gray-600">Your ticket has been postponed to the new date.</p>
          </div>
        ) : activeTickets.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Tickets</h3>
            <p className="text-gray-600">You don't have any active tickets that can be postponed.</p>
          </div>
        ) : (
          <form onSubmit={handlePostpone} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Ticket to Postpone
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
                <h4 className="font-medium text-blue-900 mb-2">Current Ticket Details:</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• Travel Date: {new Date(selectedTicketDetails.travelDate).toLocaleDateString()}</p>
                  <p>• Route: Route #{selectedTicketDetails.routeId}</p>
                  <p>• Bus: {selectedTicketDetails.busId}</p>
                  <p>• Seats: {selectedTicketDetails.seatNumbers.join(', ')}</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Travel Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postpone To (Email)
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter recipient's email"
                required
              />
              {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Postponement (Optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please provide a reason for postponing your trip..."
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Postponement Policy:</p>
                  <ul className="space-y-1">
                    <li>• You can postpone your ride up to 2 hours before departure</li>
                    <li>• Tickets can only be postponed once</li>
                    <li>• No additional charges for postponing within 24 hours</li>
                    <li>• Subject availability for the new date</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing || !selectedTicket || !newDate || !!emailError || !email}
              className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <Clock className="h-4 w-4 mr-2" />
              {isProcessing ? 'Processing...' : 'Postpone Ride'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
