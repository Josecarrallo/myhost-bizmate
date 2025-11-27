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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors border-2 border-gray-200">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h2 className="text-3xl font-black text-gray-900">Payments</h2>
          <button className="px-6 py-3 bg-green-500 text-white rounded-2xl font-bold hover:bg-green-600 transition-colors">
            <Plus className="w-5 h-5 inline mr-2" /> New Payment
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard icon={DollarSign} label="Total Revenue" value="$124.5K" trend="+18%" gradient="from-green-500 to-emerald-600" />
          <StatCard icon={CreditCard} label="Pending Payments" value="$8.2K" gradient="from-yellow-500 to-orange-500" />
          <StatCard icon={TrendingUp} label="This Month" value="$45.2K" trend="+12%" gradient="from-blue-500 to-cyan-600" />
        </div>

        <div className="flex items-center gap-4 mb-6">
          <button className="px-6 py-3 bg-white border-2 border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Filter className="w-5 h-5" /> Filter
          </button>
          <button className="px-6 py-3 bg-white border-2 border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download className="w-5 h-5" /> Export
          </button>
        </div>

        {/* FASE 3: PAYMENT OPTIONS SECTION */}
        <div className="mb-8">
          <div className="mb-6">
            <h3 className="text-2xl font-black text-gray-900 mb-2">Payment Options</h3>
            <p className="text-gray-600">Available payment methods for your guests</p>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Smartphone className="w-5 h-5 text-blue-500" />Local Payment Methods</h4>
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
                      <div><h4 className="font-bold text-gray-900 text-lg">{method.name}</h4><div className="flex items-center gap-2 mt-1"><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-sm font-semibold text-green-600">{method.status}</span></div></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-purple-500" />International Payment Methods</h4>
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
                      <div><h4 className="font-bold text-gray-900 text-lg">{method.name}</h4><div className="flex items-center gap-2 mt-1">{method.comingSoon ? <><Clock className="w-4 h-4 text-orange-500" /><span className="text-sm font-semibold text-orange-600">{method.status}</span></> : <><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-sm font-semibold text-green-600">{method.status}</span></>}</div></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border-2 border-gray-200">
            <h4 className="text-xl font-black text-gray-900 mb-6">Payment Summary</h4>
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

        <h3 className="text-2xl font-black text-gray-900 mb-6">Recent Payments</h3>
        <div className="space-y-4">
          <PaymentCard guest="Sarah Johnson" property="Villa Sunset" amount="1,250" status="Paid" date="Oct 20, 2025" method="Credit Card" />
          <PaymentCard guest="Michael Chen" property="Beach House" amount="1,800" status="Pending" date="Oct 22, 2025" method="Bank Transfer" />
          <PaymentCard guest="Emma Wilson" property="City Loft" amount="950" status="Paid" date="Oct 18, 2025" method="Credit Card" />
          <PaymentCard guest="David Park" property="Mountain Cabin" amount="720" status="Paid" date="Oct 15, 2025" method="PayPal" />
        </div>
      </div>
    </div>
  );
};

export default Payments;
