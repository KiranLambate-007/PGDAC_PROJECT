import React from 'react';
import {
  Search,
  Ticket,
  Calendar,
  ArrowRightLeft,
  XCircle,
  Settings,
  X,
  Info,
  MessageSquare
} from 'lucide-react';

export const Sidebar = ({
  activeTab,
  onTabChange,
  isOpen,
  onClose,
  role // 'user' or 'admin'
}) => {
 const menuItems = [
  { id: 'search', label: 'Search Routes', icon: Search },
  { id: 'tickets', label: 'My Tickets', icon: Ticket },
  { id: 'postpone', label: 'Postpone Ride', icon: Calendar },
  { id: 'transfer', label: 'Transfer Ticket', icon: ArrowRightLeft },
  { id: 'cancel', label: 'Cancel & Refund', icon: XCircle },
  ...(role === 'admin' ? [{ id: 'admin', label: 'Admin Panel', icon: Settings }] : []),
   { id: 'feedback', label: 'Feedback', icon: MessageSquare } ,
  { id: 'about', label: 'About Us', icon: Info }
];

  const handleItemClick = (itemId) => {
    onTabChange(itemId);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
        md:relative md:top-0 md:translate-x-0 md:shadow-none md:border-r md:border-gray-200
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 md:hidden">
          <span className="font-semibold text-gray-900">Menu</span>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleItemClick(item.id)}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                      ${activeTab === item.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};
