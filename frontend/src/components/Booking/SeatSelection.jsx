import React, { useState, useEffect } from 'react';
import { useBooking } from '../../contexts/BookingContext';

const generateSeats = (seatPrice) => {
  const seats = [];
  const rows = 10;
  const seatsPerRow = 5;

  for (let row = 1; row <= rows; row++) {
    for (let seatInRow = 1; seatInRow <= seatsPerRow; seatInRow++) {
      const seatLetter = String.fromCharCode(64 + seatInRow); // A, B, C, D
      const seatNumber = `${row}${seatLetter}`;
      const isOccupied = Math.random() < 0.3; // 30% chance of being occupied

      seats.push({
        id: `${row}-${seatInRow}`,
        seatNumber,
        isOccupied,
        price: seatPrice,
      });
    }
  }

  return seats;
};

export const SeatSelection = ({ onNext, onBack }) => {
  const [seats, setSeats] = useState([]);
  const { selectedBus, selectedSeats, addSelectedSeat, removeSelectedSeat, selectedRoute } = useBooking();

  useEffect(() => {
    if (selectedBus) {
      const seatPrice = getNumericPrice(selectedBus.price);
      console.log("price -----------------------------",seatPrice);
      setSeats(generateSeats(seatPrice));
    }
  }, [selectedBus]);

  const handleSeatClick = (seat) => {
    if (seat.isOccupied) return;

    const isSelected = selectedSeats.find((s) => s.id === seat.id);
    if (isSelected) {
      removeSelectedSeat(seat.id);
    } else if (selectedSeats.length < 5) {
      addSelectedSeat(seat);
    }
  };

  const getNumericPrice = (priceStr) => {
  if (typeof priceStr === 'string') {
    const numeric = parseFloat(priceStr.replace(/[^\d.]/g, ''));
    return isNaN(numeric) ? 0 : numeric;
  }
  return typeof priceStr === 'number' ? priceStr : 0;
};

  const getSeatClass = (seat) => {
    const isSelected = selectedSeats.find((s) => s.id === seat.id);

    if (seat.isOccupied) {
      return 'bg-red-500 text-white cursor-not-allowed';
    } else if (isSelected) {
      return 'bg-blue-500 text-white cursor-pointer hover:bg-blue-600';
    } else {
      return 'bg-gray-200 text-gray-700 cursor-pointer hover:bg-gray-300';
    }
  };

  if (!selectedBus) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">Please select a bus first</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Total Seats - {selectedBus.capacity}
        </h2>
        <div className="text-sm text-gray-600">
          Selected: {selectedSeats.length}/5 seats
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Occupied</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-center mb-4">
          <div className="w-20 h-8 bg-gray-800 text-white rounded flex items-center justify-center mx-auto text-sm">
            Driver
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
          {seats.map((seat, index) => {
            const shouldAddAisle = index % 4 === 1;

            return (
              <React.Fragment key={seat.id}>
                <button
                  onClick={() => handleSeatClick(seat)}
                  className={`w-12 h-12 rounded text-xs font-medium transition-colors ${getSeatClass(seat)}`}
                  disabled={seat.isOccupied}
                  title={`Seat ${seat.seatNumber} - ${seat.isOccupied ? 'Occupied' : 'Available'}`}
                >
                  {seat.seatNumber}
                </button>
                {shouldAddAisle && <div className="w-6"></div>}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-900 mb-2">Selected Seats:</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedSeats.map((seat) => (
              <span key={seat.id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {seat.seatNumber}
              </span>
            ))}
          </div>
          <div className="text-lg font-semibold text-blue-900">
            Total: ${(selectedSeats.length * (selectedSeats[0]?.price || 0)).toFixed(2)}
          </div>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
        >
          Back to Buses
        </button>
        <button
          onClick={onNext}
          disabled={selectedSeats.length === 0}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};
