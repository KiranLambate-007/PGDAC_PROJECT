import React, { useState } from 'react';
import { RouteSearch } from '../Search/RouteSearch';
import { BusSelection } from './BusSelection';
import { SeatSelection } from './SeatSelection';
import { PaymentForm } from '../Payment/PaymentForm';
import { TicketConfirmation } from '../Tickets/TicketConfirmation';
import { useBooking } from '../../contexts/BookingContext';

export const BookingFlow = () => {
  const [currentStep, setCurrentStep] = useState('search');
  const { selectedRoute, selectedBus, selectedSeats } = useBooking();

  const handleRouteSelect = () => {
    if (selectedRoute) {
      setCurrentStep('buses');
    }
  };

  const handleBusSelect = () => {
    if (selectedBus) {
      setCurrentStep('seats');
    }
  };

  const handleSeatsSelect = () => {
    if (selectedSeats.length > 0) {
      setCurrentStep('payment');
    }
  };

  const handlePaymentSuccess = () => {
    setCurrentStep('confirmation');
  };

  const handleBackToSearch = () => {
    setCurrentStep('search');
  };

  const handleBackToBuses = () => {
    setCurrentStep('buses');
  };

  const handleBackToSeats = () => {
    setCurrentStep('seats');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'search':
        return <RouteSearch onRouteSelect={handleRouteSelect} />;
      case 'buses':
        return <BusSelection onNext={handleBusSelect} onBack={handleBackToSearch} />;
      case 'seats':
        return <SeatSelection onNext={handleSeatsSelect} onBack={handleBackToBuses} />;
      case 'payment':
        return <PaymentForm onPaymentSuccess={handlePaymentSuccess} onBack={handleBackToSeats} />;
      case 'confirmation':
        return <TicketConfirmation onStartOver={handleBackToSearch} />;
      default:
        return <RouteSearch onRouteSelect={handleRouteSelect} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          {[
            { step: 'search', label: 'Route', active: currentStep === 'search' },
            { step: 'buses', label: 'Bus', active: currentStep === 'buses' },
            { step: 'seats', label: 'Seats', active: currentStep === 'seats' },
            { step: 'payment', label: 'Payment', active: currentStep === 'payment' },
            { step: 'confirmation', label: 'Confirm', active: currentStep === 'confirmation' }
          ].map((item, index) => (
            <React.Fragment key={item.step}>
              <div className={`flex items-center ${item.active ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  item.active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <span className="ml-2 text-sm font-medium hidden sm:block">{item.label}</span>
              </div>
              {index < 4 && (
                <div className={`flex-1 h-1 mx-2 ${
                  ['buses', 'seats', 'payment', 'confirmation'].includes(currentStep) && index < ['search', 'buses', 'seats', 'payment', 'confirmation'].indexOf(currentStep)
                    ? 'bg-blue-600' 
                    : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {renderStep()}
    </div>
  );
};
