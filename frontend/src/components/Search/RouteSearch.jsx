import React, { useState } from 'react';
import { Search, MapPin, Calendar, Clock } from 'lucide-react';
import { useBooking } from '../../contexts/BookingContext';
import axios from 'axios';
import { routeService } from '../../services/routeService';
import { busService } from '../../services/busService';

const calculateArrivalTime = (departureTime, durationMinutes) => {
  const [hours, minutes] = departureTime.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes);
  date.setMinutes(date.getMinutes() + parseInt(durationMinutes));
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const RouteSearch = ({ onRouteSelect }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  // Use a state variable and its setter for the date
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [routes, setRoutes] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { setSelectedRoute, setSelectedBus} = useBooking();

  const getMinTime = () => {
    // This function can remain the same
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  const getMinDate = () => {
    // This new function gets the current date in 'YYYY-MM-DD' format
    return new Date().toISOString().split('T')[0];
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    const now = new Date();
    const selectedDateTime = new Date(`${date}T${time}`);
    if (selectedDateTime <= now) {
      alert('Please select a future date or a future time today.');
      return;
    }

    console.log("Searching:", { origin, destination });
    setIsSearching(true);

    try {
      const response = await axios.get('https://localhost:7143/Bus/search', {
        params: {
          source: origin,
          destination: destination,
          datetime: selectedDateTime
        },
        validateStatus: () => true
      });

      console.log("Axios response:", response);
      console.log("response.data:", response.data);

      const backendRoutes = response.data?.$values;

      if (!Array.isArray(backendRoutes) || backendRoutes.length === 0) {
        alert("No matching routes found.");
        setRoutes([]);
        return;
      }


      const enrichedRoutes = backendRoutes.map((route) => {
        const durationMinutes = route.estimatedTime?.minutes || 30;
        return {
          id: route.routeId,
          origin: route.source,
          destination: route.destination,
          distance: `${route.distanceKm} km`,
          duration: `${route.estimatedTime} HH:MM:SS`,
          price: `${route.price} ₹`,
          arrivalTime: calculateArrivalTime(time, durationMinutes),
        };
      });

      setRoutes(enrichedRoutes);
    } catch (error) {
      console.error('Error fetching routes:', error);
      alert('Failed to fetch routes. Please try again.');
      setRoutes([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRouteSelect = async (route) => {
    // e.preventDefault();
    setSelectedRoute(route);
    onRouteSelect?.();
    // Serach for route
    try {
      // const buses =  await busService.getAllBuses();
      // const routes = await routeService.getAllRoutes(); // or however you fetch routes
      const buses = await routeService.fetchBusesForRoute(route.id); // 🔍 Call backend
      // setSelectedRoute(routes[0]); // ✅ Pick one route to continue flow
      setSelectedBus(buses);
      // setSelectedRoute(buses);
      
      console.log('Fetched routes:', buses);
    } catch (error) {
      alert('Error fetching routes: ' + error.message);
    }

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
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter destination"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)} // <-- Add this handler
                  min={getMinDate()} // <-- Set the minimum date to today
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Travel Time</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  // Conditionally set the min time based on if the selected date is today
                  min={date === getMinDate() ? getMinTime() : "00:00"}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <Search className="h-4 w-4 mr-2" />
            {isSearching ? 'Searching...' : 'Search Routes'}
          </button>
        </form>
      </div>

      {routes.length > 0 && (
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
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">{route.origin}</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-medium text-gray-900">{route.destination}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{route.distance}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{route.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-blue-600">${route.price}</div>
                    <div className="text-sm text-gray-500">per ticket</div>
                    <div className="text-sm text-gray-500">Arrival: {route.arrivalTime}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
