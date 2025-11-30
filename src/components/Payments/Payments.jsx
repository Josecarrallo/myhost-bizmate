import React from 'react';
import {
  ChevronLeft,
  Plus,
  DollarSign,
  CreditCard,
  TrendingUp,
  Filter,
  Download,
  Smartphone,
  Globe,
  CheckCircle,
  Clock
} from 'lucide-react';
import { StatCard, PaymentCard } from '../common';

const Payments = ({ onBack }) => {
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
          <button className="px-6 py-3 bg-white/95 backdrop-blur-sm text-orange-600 rounded-2xl font-bold hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
            <Plus className="w-5 h-5 inline mr-2" /> New Payment
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard icon={DollarSign} label="Total Revenue" value="$124.5K" trend="+18%" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={CreditCard} label="Pending Payments" value="$8.2K" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={TrendingUp} label="This Month" value="$45.2K" trend="+12%" gradient="from-orange-500 to-orange-600" />
        </div>

        <div className="flex items-center gap-4 mb-6">
          <button className="px-6 py-3 bg-white/95 backdrop-blur-sm border-2 border-white/50 rounded-2xl font-bold hover:bg-white transition-all duration-300 shadow-lg flex items-center gap-2 text-orange-600">
            <Filter className="w-5 h-5" /> Filter
          </button>
          <button className="px-6 py-3 bg-white/95 backdrop-blur-sm border-2 border-white/50 rounded-2xl font-bold hover:bg-white transition-all duration-300 shadow-lg flex items-center gap-2 text-orange-600">
            <Download className="w-5 h-5" /> Export
          </button>
        </div>

        {/* FASE 3: PAYMENT OPTIONS SECTION */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-white/50 mb-8">
          <div className="mb-6">
            <h3 className="text-2xl font-black text-orange-600 mb-2">Payment Options</h3>
            <p className="text-gray-600">Available payment methods for your guests</p>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-bold text-orange-600 mb-4 flex items-center gap-2"><Smartphone className="w-5 h-5 text-orange-600" />Local Payment Methods</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'QRIS', icon: '📱', status: 'Available', color: 'from-blue-500 to-cyan-500' },
                { name: 'GoPay', icon: '💚', status: 'Available', color: 'from-green-500 to-emerald-500' },
                { name: 'OVO', icon: '💜', status: 'Available', color: 'from-purple-500 to-pink-500' }
              ].map((method, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 border-2 border-green-200 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center text-2xl`}>{method.icon}</div>
                      <div><h4 className="font-bold text-orange-600 text-lg">{method.name}</h4><div className="flex items-center gap-2 mt-1"><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-sm font-semibold text-green-600">{method.status}</span></div></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-bold text-orange-600 mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-orange-600" />International Payment Methods</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Credit/Debit Card', icon: '💳', status: 'Available', color: 'from-orange-500 to-red-500' },
                { name: 'Stripe', icon: '🟣', status: 'Available', color: 'from-indigo-500 to-purple-500' },
                { name: 'Wise', icon: '💚', status: 'Coming Soon', color: 'from-teal-500 to-green-500', comingSoon: true },
                { name: 'PayPal', icon: '💙', status: 'Available', color: 'from-blue-600 to-indigo-600' }
              ].map((method, idx) => (
                <div key={idx} className={`bg-white rounded-2xl p-6 border-2 ${method.comingSoon ? 'border-gray-200' : 'border-green-200'} hover:shadow-lg transition-all`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center text-2xl`}>{method.icon}</div>
                      <div><h4 className="font-bold text-orange-600 text-lg">{method.name}</h4><div className="flex items-center gap-2 mt-1">{method.comingSoon ? <><Clock className="w-4 h-4 text-orange-500" /><span className="text-sm font-semibold text-orange-600">{method.status}</span></> : <><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-sm font-semibold text-green-600">{method.status}</span></>}</div></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-3xl p-6 border-2 border-gray-200">
            <h4 className="text-xl font-black text-orange-600 mb-6">Payment Summary</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm text-green-700 font-semibold mb-1">Total Paid</p><p className="text-3xl font-black text-green-600">$89.7K</p></div>
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm text-orange-700 font-semibold mb-1">Pending</p><p className="text-3xl font-black text-orange-600">$12.3K</p></div>
                  <Clock className="w-10 h-10 text-orange-500" />
                </div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm text-purple-700 font-semibold mb-1">Top Method</p><p className="text-2xl font-black text-purple-600">Credit Card</p></div>
                  <TrendingUp className="w-10 h-10 text-purple-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-white/50">
          <h3 className="text-2xl font-black text-orange-600 mb-6">Recent Payments</h3>
          <div className="space-y-4">
            <PaymentCard guest="Sarah Johnson" property="Villa Sunset" amount="1,250" status="Paid" date="Oct 20, 2025" method="Credit Card" />
            <PaymentCard guest="Michael Chen" property="Beach House" amount="1,800" status="Pending" date="Oct 22, 2025" method="Bank Transfer" />
            <PaymentCard guest="Emma Wilson" property="City Loft" amount="950" status="Paid" date="Oct 18, 2025" method="Credit Card" />
            <PaymentCard guest="David Park" property="Mountain Cabin" amount="720" status="Paid" date="Oct 15, 2025" method="PayPal" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
