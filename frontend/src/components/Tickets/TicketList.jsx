import React, { useState, useMemo } from 'react';
import QRCode from 'react-qr-code';
import { Ticket as TicketIcon, Calendar, MapPin, Clock } from 'lucide-react';
import { useBooking } from '../../contexts/BookingContext';
import { useAuth } from '../../contexts/AuthContext';
import { ticketService } from '../../services/ticketService';


export const TicketList = ({ onActionTabChange }) => {
  const { tickets, setTickets } = useBooking();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');


  React.useEffect(() => {
    async function fetchTickets() {
      const res = await ticketService.getAllTickets(localStorage.getItem('UserId'));
      setTickets(res);
    }
    fetchTickets();
  }, [user.id]);

  // ✅ Remove duplicate tickets using a Map based on ticket.id
  // const userTickets = useMemo(() => {
  //   const map = new Map();
  //   tickets.forEach(ticket => {
  //     if (ticket.userId === user?.id && !map.has(ticket.id)) {
  //       map.set(ticket.id, ticket);
  //     }
  //   });
  //   return Array.from(map.values());
  // }, [tickets, user?.id]);

  // // ✅ Filter tickets by status
  // const filteredTickets = useMemo(() => {
  //   return filter === 'active'
  //     ? userTickets
  //     : userTickets.filter(ticket => ticket.status === filter);
  // }, [filter, userTickets]);

  // const userTickets = useMemo(() => {
  //   const map = new Map();
  //   tickets.forEach(ticket => {
  //     // if (ticket.userId === user?.id && !map.has(ticket.id)) {
  //       map.set(ticket.id, ticket);
  //     // }
  //   });
  //   // return Array.from(map.values());
  //   console.log("all tickets",map);
  //   return map;
  // }, [tickets, user?.id]);

  // ✅ Filter tickets by status
  // const filteredTickets = useMemo(() => {
  //     // userTickets.filter(ticket => ticket.status === filter);
  //     tickets.forEach(ticket => {
  //     return ticket;
  //   });
  //   return Array.from(tickets.values());
  // }, []);

  // const filteredTickets = useMemo(() => tickets, [tickets]);

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => ticket.status === "active");
  }, [tickets]);

  // const filteredTickets = React.useMemo(() => {
  //   const map = new Map();
  //   tickets.forEach(ticket => {
  //     // if (ticket.userId === user?.id && !map.has(ticket.id)) {
  //       map.set(ticket.id, ticket);
  //     // }
  //   });
  //   return Array.from(map.values());
  // }, [tickets, user?.id]);

  // const filteredTickets = React.useMemo(() => {
  //   // return filter === 'active'
  //   //   ? userTickets
  //   //   : userTickets.filter(ticket => ticket.status === filter);
  //   return userTickets;
  // }, [filter, userTickets]);

  //getALl tickets from database
  const callDifferentApisInParallel = async () => {
    try {
      // Correct function call
      const res = await ticketService.getAllTickets(localStorage.getItem('UserId'));
      // setSuccess(true);
      console.log("getAll Ticket resposne", res);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Login failed');
    } finally {
      setIsProcessing(false);
    }
  }

  //callDifferentApisInParallel();

  const getStatusColor = status => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'postponed': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'transferred': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = dateString => {
  return new Date(dateString).toLocaleString('en-US', {
    // year: 'numeric',
    // month: 'short',
    // day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // or false for 24-hour format
  });
};

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">My Tickets</h2>
          <div className="flex space-x-2">
            {['all', 'active', 'postponed', 'cancelled', 'transferred'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 rounded-full text-sm font-medium capitalize transition-colors ${filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <TicketIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-500">
              {filter === 'all'
                ? "You haven't booked any tickets yet."
                : `No ${filter} tickets found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map(ticket => (
              <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TicketIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Ticket #{ticket.ticketId}</h3>
                      <p className="text-sm text-gray-500">Booked on {formatDate(ticket.bookingTime)}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Route: {ticket.routeId}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Travel: {formatDateTime(ticket.bookingTime)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Bus: {ticket.busId}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm">
                    <div>
                      <span className="text-gray-600">Seats: </span>
                      {/* <span className="font-medium">{ticket.seatNumbers.join(', ')}</span> */}
                      <span className="font-medium">{ticket.seatNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Amount: </span>
                      {/* <span className="font-medium text-green-600">${ticket.totalAmount.toFixed(2)}</span> */}
                      <span className="font-medium text-green-600">0</span>
                    </div>
                  </div>

                  <div className="bg-white p-1 border rounded">
                    <QRCode
                      value={ticket.id ?? 'unknown'}
                      size={64}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="Q"
                    />
                  </div>
                </div>

                {ticket.status === 'active' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => onActionTabChange('postpone')}
                        className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full hover:bg-yellow-200 transition-colors"
                      >
                        Postpone
                      </button>
                      <button
                        onClick={() => onActionTabChange('transfer')}
                        className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                      >
                        Transfer
                      </button>
                      <button
                        onClick={() => onActionTabChange('cancel')}
                        className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full hover:bg-red-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
