import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Overview from './Overview';
import WhatsAppCoexistence from './WhatsAppCoexistence';
import EmailCommunication from './EmailCommunication';
import GuestJourney from './GuestJourney';
import WhatsAppExamples from './WhatsAppExamples';
import EmailExamples from './EmailExamples';
import HowItWorks from './HowItWorks';

/**
 * GuestCommunications - Main container for Guest Communications module
 * Handles internal routing between different screens
 */
const GuestCommunications = ({ onBack }) => {
  const [currentScreen, setCurrentScreen] = useState('overview');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'overview':
        return <Overview onNavigate={setCurrentScreen} />;

      case 'whatsapp-setup':
        return <WhatsAppCoexistence onBack={() => setCurrentScreen('overview')} />;

      case 'email-setup':
        return <EmailCommunication onBack={() => setCurrentScreen('overview')} />;

      case 'journey':
        return <GuestJourney onBack={() => setCurrentScreen('overview')} />;

      case 'whatsapp-examples':
        return <WhatsAppExamples onBack={() => setCurrentScreen('overview')} />;

      case 'email-examples':
        return <EmailExamples onBack={() => setCurrentScreen('overview')} />;

      case 'how-it-works':
        return <HowItWorks onBack={() => setCurrentScreen('overview')} />;

      default:
        return <Overview onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="flex-1 h-screen bg-[#1a1f2e] overflow-auto">
      {/* Header - only show on non-overview screens */}
      {currentScreen !== 'overview' && (
        <div className="bg-gradient-to-r from-[#d85a2a] to-[#f5a524] p-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentScreen('overview')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Guest Communications</h1>
              <p className="text-white/90 text-sm">Back to overview</p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {renderScreen()}
      </div>

      {/* Main back button - only on overview */}
      {currentScreen === 'overview' && (
        <button
          onClick={onBack}
          className="fixed top-6 left-6 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors z-10"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  );
};

export default GuestCommunications;
