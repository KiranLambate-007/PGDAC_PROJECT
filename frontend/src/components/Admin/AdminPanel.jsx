import React, { useState } from 'react';
import { 
  Users, 
  Bus, 
  Route, 
  BarChart3, 
  Settings, 
  Plus,
  Search,
  Filter
} from 'lucide-react';

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    { label: 'Total Users', value: '1,234', icon: Users, color: 'text-blue-600' },
    { label: 'Active Routes', value: '45', icon: Route, color: 'text-green-600' },
    { label: 'Fleet Size', value: '128', icon: Bus, color: 'text-purple-600' },
    { label: 'Daily Revenue', value: '$12,450', icon: BarChart3, color: 'text-orange-600' }
  ];

  const recentBookings = [
    { id: '1', user: 'John Doe', route: 'Downtown → Airport', amount: '$12.50', status: 'Completed' },
    { id: '2', user: 'Jane Smith', route: 'University → Mall', amount: '$8.75', status: 'Active' },
    { id: '3', user: 'Mike Johnson', route: 'Business → Residential', amount: '$9.25', status: 'Cancelled' },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.user}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.route}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      booking.status === 'Completed' 
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'Active'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderRoutes = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Route Management</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Route
        </button>
      </div>
      
      <div className="flex space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search routes..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </button>
      </div>

      <p className="text-gray-500">Route management interface would be implemented here.</p>
    </div>
  );

  const renderBuses = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Fleet Management</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Bus
        </button>
      </div>
      <p className="text-gray-500">Fleet management interface would be implemented here.</p>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">User Management</h3>
      <p className="text-gray-500">User management interface would be implemented here.</p>
    </div>
  );

  const renderReports = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Reports & Analytics</h3>
      <p className="text-gray-500">Reports and analytics interface would be implemented here.</p>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'routes':
        return renderRoutes();
      case 'buses':
        return renderBuses();
      case 'users':
        return renderUsers();
      case 'reports':
        return renderReports();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Panel</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'routes', label: 'Routes', icon: Route },
            { id: 'buses', label: 'Fleet', icon: Bus },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'reports', label: 'Reports', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {renderContent()}
    </div>
  );
};
