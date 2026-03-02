import React, { useEffect } from 'react';
import MasterCalendar from './MasterCalendar/MasterCalendar';
import { useAuth } from '../contexts/AuthContext';

// Página de prueba TEMPORAL para ver el Master Calendar
// NO afecta el código de producción
const TestMasterCalendar = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log('🔍 TestMasterCalendar mounted');
    console.log('👤 User:', user);
    console.log('⏳ Loading:', loading);
  }, [user, loading]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex-1 h-screen bg-[#2a2f3a] flex items-center justify-center">
        <div className="text-white text-xl">Checking authentication...</div>
      </div>
    );
  }

  // Show login message if not authenticated
  if (!user) {
    return (
      <div className="flex-1 h-screen bg-[#2a2f3a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Please log in first</div>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] text-white rounded-lg hover:shadow-lg transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // User is authenticated, show calendar
  console.log('✅ Rendering MasterCalendar');
  return <MasterCalendar onBack={() => window.location.href = '/'} />;
};

export default TestMasterCalendar;
