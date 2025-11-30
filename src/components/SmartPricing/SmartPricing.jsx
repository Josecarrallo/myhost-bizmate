import React from 'react';
import {
  ChevronLeft,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { PricingCard } from '../common';

const Pricing = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-4 pb-24 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-orange-200/30 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
            <ChevronLeft className="w-6 h-6 text-orange-600" />
          </button>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl mb-1">MY HOST</h2>
            <p className="text-2xl md:text-3xl font-bold text-orange-100 drop-shadow-xl">BizMate</p>
          </div>
          <button className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
            <Sparkles className="w-6 h-6 text-orange-600" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8 rounded-3xl mb-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
              <TrendingUp className="w-8 h-8" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-white/80 text-sm mb-1">AI-Optimized Revenue</p>
              <p className="text-5xl font-black">+32%</p>
            </div>
          </div>
          <p className="text-white/90 leading-relaxed">Your properties are earning an average of 32% more compared to static pricing. Our AI analyzes 50+ factors in real-time to optimize your rates.</p>
        </div>

        <div className="space-y-4">
          <PricingCard property="Villa Sunset" basePrice="350" currentPrice="425" occupancy={92} trend="up" nextUpdate="2 hours" />
          <PricingCard property="Beach House" basePrice="450" currentPrice="520" occupancy={88} trend="up" nextUpdate="4 hours" />
          <PricingCard property="Mountain Cabin" basePrice="280" currentPrice="245" occupancy={65} trend="down" nextUpdate="1 hour" />
          <PricingCard property="City Loft" basePrice="320" currentPrice="380" occupancy={95} trend="up" nextUpdate="3 hours" />
        </div>
      </div>
    </div>
  );
};

export default Pricing;
