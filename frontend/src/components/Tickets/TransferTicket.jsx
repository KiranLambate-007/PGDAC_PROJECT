import React, { useState, useMemo } from 'react';
import { ArrowRightLeft, User, Mail, CheckCircle, AlertTriangle } from 'lucide-react';
import { useBooking } from '../../contexts/BookingContext';
import { useAuth } from '../../contexts/AuthContext';
import { ticketService } from '../../services/ticketService';

export const TransferTicket = () => {
  const { tickets, setTickets, clearSelectedTickets } = useBooking();
  const { user } = useAuth();

  const [selectedTicket, setSelectedTicket] = useState('');
  const [transferToEmail, setTransferToEmail] = useState('');
  const [transferToName, setTransferToName] = useState('');
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');


  // Step 1: Filter active tickets owned by the user
  // const userActiveTickets = tickets.filter(
  //   ticket => ticket.userId === user?.id && ticket.status.toLowerCase() === 'active'
  // );

  React.useEffect(() => {
    clearSelectedTickets();
    async function fetchTickets() {
      const res = await ticketService.getAllTickets(localStorage.getItem('UserId'));
      setTickets(res);
    }
    fetchTickets();
  }, []); // <-- empty array ensures it runs once on mount only

  // Step 2: Remove duplicate tickets by ID
  // const activeTickets = Array.from(
  //   new Map(userActiveTickets.map(ticket => [ticket.id, ticket])).values()
  // );

  const activeTickets = useMemo(() => {
    return tickets.filter(ticket => ticket.status === "active");
  }, [tickets]);

  // Step 3: Find selected ticket from de-duplicated list
  // const selectedTicketDetails = activeTickets.find(t => t.id.toString() === selectedTicket);

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!selectedTicket || !transferToEmail || !transferToName) return;

    setIsProcessing(true);
    setError('');

    // try {
    //   const payload = {
    //     ticketId: parseInt(selectedTicket, 10),
    //     recipientPhoneOrEmailOrUserId: transferToEmail,
    //   };

    //   await ticketService.transferTicket(payload);

    //   updateTicketStatus(selectedTicket, 'transferred');
    //   setSuccess(true);

    //   setTimeout(() => {
    //     setSuccess(false);
    //     setSelectedTicket('');
    //     setTransferToEmail('');
    //     setTransferToName('');
    //     setReason('');
    //   }, 3000);
    // } catch (err) {
    //   console.error(err);
    //   setError(err.message || 'An unexpected error occurred.');
    // } finally {
    //   setIsProcessing(false);
    // }

    //update in transfer tickets

    try {
      const str = selectedTicket;
      const ticketId = str.split('#')[1].split(' ')[0];
      //update status in ticket table active to cancled
      const updateTicket = await ticketService.patchToEndpoint(`/update/transferUserId/${ticketId}`, {
        Status: "active",
        toUserId: transferToEmail,
      });

      // Add record in transfer ticket table
      const addCanceledticketRes = await ticketService.postToEndpoint('/transfer', {
        ticketId: ticketId,
        fromUserId: localStorage.getItem('UserId'),
        toUserId: transferToEmail,
        transferDate: new Date().toISOString(),
        status: "transferred"
      });

      setTimeout(() => {
        setIsProcessing(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'transfer failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedTicketDetails = tickets.find((t) => t.id === selectedTicket);
  const estimatedRefund = selectedTicketDetails
    ? calculateRefund(selectedTicketDetails)
    : 0;

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
            {/* Select Ticket */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Ticket to Transfer</label>
              {/* <select
                value={selectedTicket}
                onChange={(e) => setSelectedTicket(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose a ticket</option>
                {activeTickets.map((ticket) => (
                  <option key={ticket.id} value={ticket.id}>
                    Ticket #{ticket.id} - Seats: {ticket.seatNumbers?.join(', ')} - ${ticket.totalAmount?.toFixed(2)}
                  </option>
                ))}
              </select> */}
              <select
                value={selectedTicket}
                onChange={(e) => setSelectedTicket(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="ticket.id">Choose a ticket</option>
                {activeTickets.map((ticket) => (
                  <option key={ticket.id} value={ticket.id}>
                    Ticket #{ticket.ticketId} – Seats:{' '}
                    {ticket.seatNumber} – $
                    {ticket.totalAmount}
                  </option>
                ))}
              </select>
            </div>

            {/* Ticket Details */}
            {selectedTicketDetails && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Ticket Details:</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• Travel Date: {new Date(selectedTicketDetails.travelDate).toLocaleDateString()}</p>
                  <p>• Route: Route #{selectedTicketDetails.routeId}</p>
                  <p>• Bus: {selectedTicketDetails.busId}</p>
                  <p>• Seats: {selectedTicketDetails.seatNumbers?.join(', ')}</p>
                  <p>• Amount: ${selectedTicketDetails.totalAmount?.toFixed(2)}</p>
                </div>
              </div>
            )}

            {/* Recipient Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transfer to (Name)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={transferToName}
                  onChange={(e) => setTransferToName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter recipient's full name"
                  required
                />
              </div>
            </div>

            {/* Recipient Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transfer to (Email)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={transferToEmail}
                  onChange={(e) => setTransferToEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter recipient's email"
                  required
                />
              </div>
            </div>

            {/* Optional Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Transfer (Optional)</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Optional reason for transfer..."
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-sm text-red-600 bg-red-100 border border-red-200 p-3 rounded-md">
                ⚠️ {error}
              </div>
            )}

            {/* Transfer Policy */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Transfer Policy:</p>
                  <ul className="space-y-1">
                    <li>• Transfers allowed up to 4 hours before departure</li>
                    <li>• Recipient must accept the transfer via email</li>
                    <li>• Fees may apply for premium tickets</li>
                    <li>• Both parties receive confirmation emails</li>
                    <li>• ID verification may be required</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing || !selectedTicket || !transferToEmail || !transferToName}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center"
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
