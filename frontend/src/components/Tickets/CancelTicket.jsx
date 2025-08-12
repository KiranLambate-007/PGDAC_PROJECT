import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { XCircle, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react';
import { useBooking } from '../../contexts/BookingContext';
import { useAuth } from '../../contexts/AuthContext';
import { ticketService } from '../../services/ticketService';

export const CancelTicket = () => {
  const { tickets, setTickets } = useBooking();
  const { user } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState('');
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);
  const [selectedTicketId, setSelectedTicketId] = useState('');

  // const activeTickets = tickets.filter(
  //   (ticket) => ticket.userId === user?.id && ticket.status === 'active'
  // );

  React.useEffect(() => {
    async function fetchTickets() {
      const res = await ticketService.getAllTickets(localStorage.getItem('UserId'));
      setTickets(res);
    }
    fetchTickets();
  }, []); // <-- empty array ensures it runs once on mount only

  // const uniqueActiveTickets = [
  //   ...new Map(activeTickets.map(ticket => [ticket.id, ticket])).values()
  // ];

  const activeTickets = useMemo(() => {
    return tickets.filter(ticket => ticket.status === "active");
  }, [tickets]);

  // Dummy logic, replace with real time calculation based on travelDate
  const calculateRefund = (ticket) => {
    const hoursUntilDeparture = 48;
    if (hoursUntilDeparture >= 24) return ticket.totalAmount * 0.9;
    if (hoursUntilDeparture >= 4) return ticket.totalAmount * 0.5;
    return 0;
  };

  const calculateRefundStatus = (ticket) => {
    const hoursUntilDeparture = 48;
    if (hoursUntilDeparture >= 24) return 'eligible';
    if (hoursUntilDeparture >= 4) return 'partial';
    return 'not eligible';
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    // const ticket = tickets.find((t) => t.id === selectedTicket);
    // if (!ticket) return;

    setIsProcessing(true);
    // const refund = calculateRefund(ticket);
    // setRefundAmount(refund);

    // try {
    //   await axios.post('https://localhost:7143/api/CancelledTickets', {
    //     ticketId: ticket.id,
    //     reason: reason,
    //     refundStatus: "NA",
    //     cancelledAt: new Date().toISOString(),
    //   });

    //   updateTicketStatus(selectedTicket, 'cancelled');
    //   setSuccess(true);
    //   setIsProcessing(false);

    //   setTimeout(() => {
    //     setSuccess(false);
    //     setSelectedTicket('');
    //     setReason('');
    //     setRefundAmount(0);
    //   }, 5000);
    // } catch (error) {
    //   console.error('Cancellation failed:', error);
    //   alert('Failed to cancel ticket. Please try again.');
    //   setIsProcessing(false);
    // }

    try {
      const str = selectedTicket;
      const ticketId = str.split('#')[1].split(' ')[0];
      //update status in ticket table active to cancled
      const updateTicket = await ticketService.patchToEndpoint(`/update/${ticketId}`, {
        Status: "cancelled"
      });

      // Add record in cancle table
      const addCanceledticketRes = await ticketService.postToEndpoint('/cancelledTickets', {

        TicketId: ticketId,
        Reason: "NA",
        RefundStatus: "NA",
        CancelledAt: new Date().toISOString()
      });

      setTimeout(() => {
        setIsProcessing(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'cancelled failed');
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Cancel & Refund</h2>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Ticket Cancelled Successfully!
            </h3>
            <p className="text-gray-600 mb-4">
              Your ticket has been cancelled and refund is being processed.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-lg font-semibold text-green-900">
                  Refund Amount: ${refundAmount.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-green-700 mt-2">
                Refund will be processed within 3–5 business days.
              </p>
            </div>
          </div>
        ) : activeTickets.length === 0 ? (
          <div className="text-center py-8">
            <XCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Tickets</h3>
            <p className="text-gray-600">
              You don't have any active tickets that can be cancelled.
            </p>
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

            {selectedTicketDetails && (
              <>
                <div className="bg-blue-50 border rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Ticket Details</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>
                      • Travel Date:{' '}
                      {new Date(selectedTicketDetails.travelDate).toLocaleDateString()}
                    </p>
                    <p>• Route: Route #{selectedTicketDetails.routeId}</p>
                    <p>• Bus: {selectedTicketDetails.busId}</p>
                    <p>• Seats: {selectedTicketDetails.seatNumbers.join(', ')}</p>
                    <p>• Original Amount: ${selectedTicketDetails.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="bg-green-50 border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium text-green-900">Estimated Refund</h4>
                  </div>
                  <div className="text-2xl font-bold text-green-900 mb-2">
                    ${estimatedRefund.toFixed(2)}
                  </div>
                  <p className="text-sm text-green-700">
                    {estimatedRefund === selectedTicketDetails.totalAmount * 0.9
                      ? 'Full refund (cancelled more than 24 hours in advance)'
                      : estimatedRefund === selectedTicketDetails.totalAmount * 0.5
                        ? 'Partial refund (cancelled 4–24 hours in advance)'
                        : 'No refund (cancelled less than 4 hours in advance)'}
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
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Reason for cancelling..."
              />
            </div>

            <div className="bg-red-50 border rounded-lg p-4 text-sm text-red-800">
              <AlertTriangle className="h-5 w-5 text-red-600 mb-2" />
              <strong>Cancellation Policy:</strong>
              <ul className="list-disc ml-5 mt-1">
                <li>90% refund if cancelled before departure</li>
                <li>50% refund if cancelled on departure</li>
                <li>No refund if cancelled after departure</li>
                <li>Refunds processed within 3–5 business days</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isProcessing || !selectedTicket}
              className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50"
            >
              <XCircle className="h-4 w-4 mr-2 inline" />
              {isProcessing
                ? 'Processing Cancellation...'
                : 'Cancel Ticket & Request Refund'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
