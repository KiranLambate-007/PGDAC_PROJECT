import React, { useState, useEffect } from 'react';
import { Clock, Users, Star } from 'lucide-react';
import { useBooking } from '../../contexts/BookingContext';
import { busService } from '../../services/busService';

const mockBuses = [
  {
    id: '1',
    routeId: '1',
    busNumber: 'BUS-001',
    departureTime: '08:00',
    arrivalTime: '08:45',
    availableSeats: 28,
    totalSeats: 40,
    busType: 'Non AC'
  },
  {
    id: '2',
    routeId: '1',
    busNumber: 'BUS-002',
    departureTime: '10:30',
    arrivalTime: '11:15',
    availableSeats: 15,
    totalSeats: 35,
    busType: 'AC'
  }
];

export const BusSelection = ({ onNext, onBack }) => {
  const [buses, setBuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedRoute, selectedBus, setSelectedBus } = useBooking();

  useEffect(() => {
    if (selectedRoute) {
      console.log("selected bus ",selectedBus);
      setTimeout(() => {
        setBuses(selectedBus.$values || []);
        setIsLoading(false);
      }, 1000);
    }
  }, [selectedRoute]);

  //  useEffect(() => {
  //   const fetchBuses = async () => {
  //     if (!selectedRoute) return;

  //     setIsLoading(true);
  //     try {
  //       // const allBuses = busService.getAllBuses();
  //       // const filtered = allBuses.filter(
  //       //   (bus) => bus.routeId === selectedRoute.routeId
  //       // );
  //       setBuses(buses);
  //     } catch (error) {
  //       console.error('Error fetching buses:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchBuses();
  // }, [selectedRoute]);

  const handleBusSelect = (bus) => {
    setSelectedBus(bus);
    onNext();
  };

  const getBusTypeColor = (type) => {
    switch (type) {
      case 'Standard':
        return 'bg-gray-100 text-gray-800';
      case 'AC':
        return 'bg-blue-100 text-blue-800';
      case 'Luxury':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!selectedRoute) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">Please select a route first</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Available Buses for {selectedRoute.origin} → {selectedRoute.destination}
      </h2>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-500">Loading available buses...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {buses.map((bus) => (
            <div
              key={bus.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedBus?.id === bus.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleBusSelect(bus)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="font-semibold text-gray-900">{bus.busNumber}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBusTypeColor(bus.busType)}`}>
                      {bus.busType}
                    </span>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    {/* <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{bus.departureTime} - {bus.arrivalTime}</span>
                    </div> */}
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{bus.availableSeats}/{bus.capacity} seats available</span>
                    </div>
                    {bus.busType !== 'AC' && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>Regular Service</span>
                      </div>
                    )}
                    {bus.busType !== 'Non AC' && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>Premium Service</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-semibold text-blue-600">
                    &#8377;{bus.price} 
                  </div>
                  <div className="text-sm text-gray-500">per seat</div>
                </div>
              </div>

              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${(bus.availableSeats / bus.totalSeats) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {bus.availableSeats > 10 ? 'Good availability' : 'Limited seats'}
                </div>
              </div>
            </div>
          ))}

          <div className="flex space-x-4 mt-6">
            <button
              onClick={onBack}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
            >
              Back to Routes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
