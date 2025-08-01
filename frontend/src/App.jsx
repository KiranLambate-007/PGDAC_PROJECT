import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { RouteSearch } from './components/Search/RouteSearch';
import { BookingFlow } from './components/Booking/BookingFlow';
import { TicketList } from './components/Tickets/TicketList';
import { PostponeTicket } from './components/Tickets/PostponeTicket';
import { TransferTicket } from './components/Tickets/TransferTicket';
import { CancelTicket } from './components/Tickets/CancelTicket';
import { AdminPanel } from './components/Admin/AdminPanel';

const AppContent = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('search');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {authMode === 'login' ? (
            <LoginForm onSwitchToRegister={() => setAuthMode('register')} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setAuthMode('login')} />
          )}
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'search':
        return <BookingFlow />;
     case 'tickets':
  return <TicketList onActionTabChange={setActiveTab} />;
      case 'postpone':
        return <PostponeTicket />;
      case 'transfer':
        return <TransferTicket />;
      case 'cancel':
        return <CancelTicket />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <RouteSearch />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuToggle={handleMenuToggle} />
      <div className="flex">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          isOpen={isSidebarOpen}
          onClose={handleSidebarClose}
        />
        <main className="flex-1 p-4 md:p-6 md:ml-0">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <AppContent />
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
