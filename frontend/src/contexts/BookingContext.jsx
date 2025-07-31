import React, { createContext, useContext, useState, useCallback } from 'react';

const BookingContext = createContext(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [tickets, setTickets] = useState([]);

  const addSelectedSeat = useCallback((seat) => {
    setSelectedSeats((prev) => {
      if (prev.length >= 5) return prev;
      if (prev.find((s) => s.id === seat.id)) return prev;
      return [...prev, seat];
    });
  }, []);

  const removeSelectedSeat = useCallback((seatId) => {
    setSelectedSeats((prev) => prev.filter((seat) => seat.id !== seatId));
  }, []);

  const clearSelectedSeats = useCallback(() => {
    setSelectedSeats([]);
  }, []);

  const addTicket = useCallback((ticket) => {
    setTickets((prev) => [...prev, ticket]);
  }, []);

  const updateTicketStatus = useCallback((ticketId, status) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status } : ticket
      )
    );
  }, []);

  const getTicketById = useCallback((ticketId) => {
    return tickets.find((ticket) => ticket.id === ticketId);
  }, [tickets]);

  return (
    <BookingContext.Provider
      value={{
        selectedRoute,
        selectedBus,
        selectedSeats,
        tickets,
        setSelectedRoute,
        setSelectedBus,
        addSelectedSeat,
        removeSelectedSeat,
        clearSelectedSeats,
        addTicket,
        updateTicketStatus,
        getTicketById,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
