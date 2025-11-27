import React from 'react';
import { ChevronLeft, Globe } from 'lucide-react';

const CulturalIntelligence = ({ onBack }) => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors shadow-lg border-2 border-gray-100"
      >
        <ChevronLeft className="w-6 h-6 text-gray-900" />
      </button>

      <div className="bg-white rounded-3xl p-12 shadow-xl border-2 border-gray-100">
        <div className="text-center">
          <div className="inline-flex p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl mb-6">
            <Globe className="w-20 h-20 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-4">Cultural Intelligence</h1>
          <p className="text-2xl text-gray-500 font-medium">Coming soon</p>
        </div>
      </div>
    </div>
  </div>
);

export default CulturalIntelligence;
