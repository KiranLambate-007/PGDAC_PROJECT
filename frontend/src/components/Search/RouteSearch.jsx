import React, { useState } from 'react';
import { Search, MapPin, Calendar, Clock } from 'lucide-react';
import { useBooking } from '../../contexts/BookingContext';

const mockRoutes = [
  {
    id: '1',
    origin: 'Downtown Central',
    destination: 'Airport Terminal',
    distance: '25 km',
    duration: '45 min',
    price: 12.50,
    busTime: '10:00' // in HH:mm
  },
  {
    id: '2',
    origin: 'University Campus',
    destination: 'Shopping Mall',
    distance: '15 km',
    duration: '30 min',
    price: 8.75,
    busTime: '10:10'
  },
  {
    id: '3',
    origin: 'Business District',
    destination: 'Residential Area',
    distance: '18 km',
    duration: '35 min',
    price: 9.25,
    busTime: '10:20'
  },
  {
    id: '4',
    origin: 'Tech Park',
    destination: 'Main Station',
    distance: '10 km',
    duration: '20 min',
    price: 6.00,
    busTime: '10:35'
  }
];

const calculateArrivalTime = (departureTime, durationStr) => {
  const [hours, minutes] = departureTime.split(':').map(Number);
  const durationMinutes = parseInt(durationStr);

  const time = new Date();
  time.setHours(hours, minutes, 0);
  time.setMinutes(time.getMinutes() + durationMinutes);

  return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const RouteSearch = ({ onRouteSelect }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [routes, setRoutes] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { setSelectedRoute } = useBooking();

  const getMinTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const now = new Date();
    const selectedDateTime = new Date(`${date}T${time}`);

    if (selectedDateTime <= now) {
      alert('Please select a future time today.');
      return;
    }

    setIsSearching(true);

    // Convert entered time to minutes
    const [inputH, inputM] = time.split(':').map(Number);
    const inputTotalMinutes = inputH * 60 + inputM;

    // Filter mock routes within 15 minutes of entered time
    const matchedRoutes = mockRoutes.filter(route => {
      const [busH, busM] = route.busTime.split(':').map(Number);
      const busTotalMinutes = busH * 60 + busM;
      return (
        busTotalMinutes >= inputTotalMinutes &&
        busTotalMinutes <= inputTotalMinutes + 30
      );
    });

    const enrichedRoutes = matchedRoutes.map(route => ({
      ...route,
      arrivalTime: calculateArrivalTime(route.busTime, route.duration)
    }));

    setTimeout(() => {
      setRoutes(enrichedRoutes);
      setIsSearching(false);
    }, 800);
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
    onRouteSelect?.();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Routes</h2>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="origin"
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter origin"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="destination"
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter destination"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
              <input
                type="date"
                id="date"
                value={date}
                className="w-full py-2 px-3 border rounded-md bg-gray-100 cursor-not-allowed"
                readOnly
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Travel Time</label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full py-2 px-3 border rounded-md"
                min={getMinTime()}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
          >
            <Search className="h-4 w-4 mr-2" />
            {isSearching ? 'Searching...' : 'Search Routes'}
          </button>
        </form>
      </div>

      {routes.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Routes</h3>
          <div className="space-y-3">
            {routes.map((route) => (
              <div
                key={route.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleRouteSelect(route)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-gray-900 font-medium">{route.origin} → {route.destination}</div>
                    <div className="text-sm text-gray-600">
                      {route.distance} | Duration: {route.duration}
                    </div>
                    <div className="text-sm text-gray-600">Bus Time: {route.busTime}</div>
                    <div className="text-sm text-gray-600">Arrival: {route.arrivalTime}</div>
                  </div>
                  <div className="text-right text-blue-600 font-semibold text-lg">${route.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white p-4 rounded shadow text-center text-gray-500">
          No buses found in 30-minute window.
        </div>
      )}
    </div>
  );
};
