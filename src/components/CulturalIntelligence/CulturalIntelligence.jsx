import React from 'react';
import { ChevronLeft, Globe } from 'lucide-react';

const CulturalIntelligence = ({ onBack }) => (
  <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-6 pb-24 relative overflow-hidden">
    {/* Animated background elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute w-72 h-72 bg-orange-200/30 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
    </div>

    <div className="max-w-4xl mx-auto relative z-10">
      <button
        onClick={onBack}
        className="mb-6 p-3 bg-white/95 backdrop-blur-sm rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50"
      >
        <ChevronLeft className="w-6 h-6 text-orange-600" />
      </button>

      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border-2 border-white/50">
        <div className="text-center">
          <div className="inline-flex p-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl mb-6 shadow-xl">
            <Globe className="w-20 h-20 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-5xl font-black text-orange-600 mb-4">Cultural Intelligence</h1>
          <p className="text-2xl text-gray-500 font-medium">Coming soon</p>
        </div>
      </div>
    </div>
  </div>
);

export default CulturalIntelligence;
