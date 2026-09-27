import React, { useState } from 'react';
import SidebarV2 from '../LayoutV2/SidebarV2';
import AIHomeV2 from './AIHomeV2';
import BookingsV2 from './BookingsV2';
import ManagementIntelligenceV2 from './ManagementIntelligenceV2';
import GuestCommunicationsV2 from './GuestCommunicationsV2';
import OperationsV2 from './OperationsV2';
import AITeamV2 from './AITeamV2';

// Demo wrapper to test the V2 design
const DemoV2 = ({ onBack }) => {
  const [currentView, setCurrentView] = useState('ai-home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock user data
  const mockUserData = {
    full_name: 'Sergio',
    email: 'sergio@izumihotel.com'
  };

  const renderContent = () => {
    switch (currentView) {
      case 'ai-home':
      case 'overview':
        return <AIHomeV2 userName="Sergio" onNavigate={setCurrentView} />;

      case 'bookings':
        return <BookingsV2 onNavigate={setCurrentView} />;

      case 'ai-team':
        return <AITeamV2 onNavigate={setCurrentView} />;

      case 'operations':
        return <OperationsV2 onNavigate={setCurrentView} />;

      case 'guests':
      case 'communications':
        return <GuestCommunicationsV2 onNavigate={setCurrentView} />;

      default:
        return (
          <div className="flex-1 bg-[#F7F5F0] p-8">
            <div className="bg-white rounded-2xl border border-[#E7E3DA] p-8">
              <h2 className="text-[#172033] text-2xl font-semibold mb-4">
                {currentView.charAt(0).toUpperCase() + currentView.slice(1).replace(/-/g, ' ')}
              </h2>
              <p className="text-[#667085]">
                This screen is coming in Phase 2.
              </p>
              <button
                onClick={() => setCurrentView('ai-home')}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-[#B98A3D] to-[#D7B46A] text-white rounded-xl font-medium"
              >
                Back to Home
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* V2 Sidebar */}
      <SidebarV2
        currentView={currentView}
        onNavigate={setCurrentView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userData={mockUserData}
        collapsed={false}
        onToggleCollapse={() => {}}
      />

      {/* Main Content */}
      {renderContent()}

      {/* Back to old design button - floating */}
      {onBack && (
        <button
          onClick={onBack}
          className="fixed bottom-4 right-4 px-4 py-2 bg-[#172033] text-white rounded-xl text-sm font-medium hover:bg-[#2a3347] transition-colors z-50"
        >
          ← Back to Current Design
        </button>
      )}
    </div>
  );
};

export default DemoV2;
