import React, { useState } from 'react';
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
  Clock,
  Search,
  X,
  Calendar,
  User,
  Home,
  FileText,
  ExternalLink
} from 'lucide-react';
import { StatCard } from '../common';

const Payments = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterMethod, setFilterMethod] = useState('All');
  const [selectedPayment, setSelectedPayment] = useState(null);

  const allTransactions = [
    { id: 'TXN001', guest: 'Sarah Johnson', email: 'sarah.j@email.com', property: 'Villa Sunset Paradise', checkIn: '2025-10-25', checkOut: '2025-10-30', amount: 2125, status: 'Completed', method: 'Credit Card', date: '2025-10-20', time: '14:32', bookingRef: 'BK-2510-001', nights: 5, type: 'Full Payment' },
    { id: 'TXN002', guest: 'Michael Chen', email: 'mchen@email.com', property: 'Beach House Deluxe', checkIn: '2025-10-28', checkOut: '2025-11-02', amount: 2600, status: 'Pending', method: 'Bank Transfer', date: '2025-10-22', time: '09:15', bookingRef: 'BK-2510-002', nights: 5, type: 'Deposit' },
    { id: 'TXN003', guest: 'Emma Wilson', email: 'emma.w@email.com', property: 'City Loft Premium', checkIn: '2025-10-24', checkOut: '2025-10-27', amount: 1140, status: 'Completed', method: 'Credit Card', date: '2025-10-18', time: '16:45', bookingRef: 'BK-2510-003', nights: 3, type: 'Full Payment' },
    { id: 'TXN004', guest: 'David Park', email: 'dpark@email.com', property: 'Mountain Cabin Retreat', checkIn: '2025-10-22', checkOut: '2025-10-25', amount: 735, status: 'Completed', method: 'PayPal', date: '2025-10-15', time: '11:20', bookingRef: 'BK-2510-004', nights: 3, type: 'Full Payment' },
    { id: 'TXN005', guest: 'Lisa Anderson', email: 'lisa.a@email.com', property: 'Villa Sunset Paradise', checkIn: '2025-11-01', checkOut: '2025-11-08', amount: 2975, status: 'Completed', method: 'Stripe', date: '2025-10-18', time: '10:30', bookingRef: 'BK-2510-005', nights: 7, type: 'Full Payment' },
    { id: 'TXN006', guest: 'Robert Taylor', email: 'rtaylor@email.com', property: 'Beach House Deluxe', checkIn: '2025-11-05', checkOut: '2025-11-10', amount: 1300, status: 'Pending', method: 'Bank Transfer', date: '2025-10-24', time: '13:45', bookingRef: 'BK-2510-006', nights: 5, type: 'Deposit' },
    { id: 'TXN007', guest: 'Jennifer Martinez', email: 'jmartinez@email.com', property: 'City Loft Premium', checkIn: '2025-10-29', checkOut: '2025-11-03', amount: 1900, status: 'Completed', method: 'Credit Card', date: '2025-10-21', time: '15:10', bookingRef: 'BK-2510-007', nights: 5, type: 'Full Payment' },
    { id: 'TXN008', guest: 'James Wilson', email: 'jwilson@email.com', property: 'Mountain Cabin Retreat', checkIn: '2025-11-08', checkOut: '2025-11-12', amount: 980, status: 'Completed', method: 'PayPal', date: '2025-10-25', time: '08:55', bookingRef: 'BK-2510-008', nights: 4, type: 'Full Payment' },
    { id: 'TXN009', guest: 'Patricia Brown', email: 'pbrown@email.com', property: 'Villa Sunset Paradise', checkIn: '2025-11-12', checkOut: '2025-11-15', amount: 1275, status: 'Pending', method: 'Credit Card', date: '2025-10-26', time: '12:20', bookingRef: 'BK-2510-009', nights: 3, type: 'Deposit' },
    { id: 'TXN010', guest: 'Daniel Garcia', email: 'dgarcia@email.com', property: 'Beach House Deluxe', checkIn: '2025-11-15', checkOut: '2025-11-22', amount: 3640, status: 'Completed', method: 'Stripe', date: '2025-10-27', time: '17:30', bookingRef: 'BK-2510-010', nights: 7, type: 'Full Payment' }
  ];

  const filteredTransactions = allTransactions.filter(txn => {
    const matchesSearch = txn.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         txn.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         txn.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || txn.status === filterStatus;
    const matchesMethod = filterMethod === 'All' || txn.method === filterMethod;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Failed': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-4 pb-24 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-orange-200/30 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
            <ChevronLeft className="w-6 h-6 text-orange-600" />
          </button>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl">Payments</h2>
          </div>
          <button className="px-6 py-3 bg-white/95 backdrop-blur-sm text-orange-600 rounded-2xl font-bold hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
            <Plus className="w-5 h-5 inline mr-2" /> New Payment
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <StatCard icon={DollarSign} label="Total Revenue" value="$19.5K" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={CheckCircle} label="Completed" value="$15.2K" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={Clock} label="Pending" value="$4.3K" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={CreditCard} label="Transactions" value="10" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={TrendingUp} label="Avg Amount" value="$1,950" gradient="from-orange-500 to-orange-600" />
        </div>

        {/* Search and Filters */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-4 shadow-xl border-2 border-white/50 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by guest, property, transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-orange-500 font-semibold text-gray-700"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-2xl font-bold text-gray-700 focus:outline-none focus:border-orange-500 bg-white"
            >
              <option value="All">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-2xl font-bold text-gray-700 focus:outline-none focus:border-orange-500 bg-white"
            >
              <option value="All">All Methods</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="PayPal">PayPal</option>
              <option value="Stripe">Stripe</option>
            </select>
            <button className="px-6 py-3 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-colors shadow-lg flex items-center gap-2 justify-center">
              <Download className="w-5 h-5" /> Export
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
            <h3 className="text-2xl font-black text-white">Payment Transactions</h3>
            <p className="text-orange-100 text-sm font-semibold">All payment records and transaction history</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">Guest</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">Property</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-100">
                {filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-orange-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-orange-600">{txn.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-gray-900">{txn.guest}</p>
                        <p className="text-sm text-gray-500">{txn.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-700">{txn.property}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{txn.date}</p>
                        <p className="text-sm text-gray-500">{txn.time}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xl font-black text-orange-600">${txn.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-700">{txn.method}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(txn.status)}`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedPayment(txn)}
                        className="text-orange-600 hover:text-orange-700 font-bold text-sm hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg font-semibold">No transactions found matching your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedPayment(null)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6 flex items-center justify-between sticky top-0 z-10">
              <div>
                <h3 className="text-3xl font-black text-white mb-1">Transaction Details</h3>
                <p className="text-orange-100 font-semibold">{selectedPayment.id}</p>
              </div>
              <button onClick={() => setSelectedPayment(null)} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Payment Status */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-semibold mb-1">Total Amount</p>
                    <p className="text-5xl font-black">${selectedPayment.amount.toLocaleString()}</p>
                  </div>
                  <div className={`px-6 py-3 rounded-2xl text-lg font-black border-4 ${getStatusColor(selectedPayment.status)} bg-white`}>
                    {selectedPayment.status}
                  </div>
                </div>
              </div>

              {/* Guest Information */}
              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                <h4 className="text-xl font-black text-orange-600 mb-4 flex items-center gap-2">
                  <User className="w-6 h-6" /> Guest Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-1">Full Name</p>
                    <p className="font-bold text-gray-900">{selectedPayment.guest}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-1">Email</p>
                    <p className="font-bold text-gray-900">{selectedPayment.email}</p>
                  </div>
                </div>
              </div>

              {/* Booking Information */}
              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                <h4 className="text-xl font-black text-orange-600 mb-4 flex items-center gap-2">
                  <Home className="w-6 h-6" /> Booking Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-1">Property</p>
                    <p className="font-bold text-gray-900">{selectedPayment.property}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-1">Booking Reference</p>
                    <p className="font-bold text-orange-600">{selectedPayment.bookingRef}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-1">Check-in</p>
                    <p className="font-bold text-gray-900">{selectedPayment.checkIn}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-1">Check-out</p>
                    <p className="font-bold text-gray-900">{selectedPayment.checkOut}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-1">Number of Nights</p>
                    <p className="font-bold text-gray-900">{selectedPayment.nights} nights</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-1">Payment Type</p>
                    <p className="font-bold text-gray-900">{selectedPayment.type}</p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                <h4 className="text-xl font-black text-orange-600 mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6" /> Payment Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-1">Payment Method</p>
                    <p className="font-bold text-gray-900">{selectedPayment.method}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-1">Transaction Date</p>
                    <p className="font-bold text-gray-900">{selectedPayment.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-1">Transaction Time</p>
                    <p className="font-bold text-gray-900">{selectedPayment.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-1">Transaction ID</p>
                    <p className="font-bold text-orange-600">{selectedPayment.id}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-colors shadow-lg flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" /> Download Receipt
                </button>
                <button className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2">
                  <ExternalLink className="w-5 h-5" /> View Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
