import React, { useState, useEffect } from 'react';
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
import { supabaseService } from '../../services/supabase';

const Payments = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterMethod, setFilterMethod] = useState('All');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    completed: 0,
    pending: 0,
    transactionCount: 0,
    avgAmount: 0
  });

  // Load payments from Supabase on mount
  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const payments = await supabaseService.getPayments();

      // Transform Supabase data to match component format
      const transformedPayments = payments.map(payment => ({
        id: payment.transaction_id || payment.id.substring(0, 8).toUpperCase(),
        guest: payment.guest_name,
        email: payment.guest_email,
        amount: parseFloat(payment.amount),
        status: payment.status.charAt(0).toUpperCase() + payment.status.slice(1),
        method: payment.payment_method,
        date: new Date(payment.transaction_date).toISOString().split('T')[0],
        time: new Date(payment.transaction_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        type: payment.payment_type || 'Full Payment',
        property: 'Property', // TODO: Join with properties table
        checkIn: '-',
        checkOut: '-',
        bookingRef: payment.booking_id ? `BK-${payment.booking_id.substring(0, 8)}` : '-',
        nights: 0
      }));

      setAllTransactions(transformedPayments);

      // Calculate stats
      const completedPayments = transformedPayments.filter(p => p.status === 'Completed');
      const pendingPayments = transformedPayments.filter(p => p.status === 'Pending');
      const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
      const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
      const avgAmount = transformedPayments.length > 0
        ? transformedPayments.reduce((sum, p) => sum + p.amount, 0) / transformedPayments.length
        : 0;

      setStats({
        totalRevenue: totalRevenue.toFixed(0),
        completed: totalRevenue.toFixed(0),
        pending: pendingAmount.toFixed(0),
        transactionCount: transformedPayments.length,
        avgAmount: avgAmount.toFixed(0)
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading payments:', error);
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2a2f3a] p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl font-bold">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2a2f3a] p-4 pb-24 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-[#d85a2a]/5 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-3 bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl hover:bg-[#1f2937] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-[#d85a2a]/20">
            <ChevronLeft className="w-6 h-6 text-[#FF8C42]" />
          </button>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl">Payments</h2>
          </div>
          <button className="px-6 py-3 bg-[#1f2937]/95 backdrop-blur-sm text-[#FF8C42] rounded-2xl font-bold hover:bg-[#1f2937] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-[#d85a2a]/20">
            <Plus className="w-5 h-5 inline mr-2" /> New Payment
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <StatCard icon={DollarSign} label="Total Revenue" value={`$${(stats.totalRevenue / 1000).toFixed(1)}K`} gradient="from-orange-500 to-orange-600" />
          <StatCard icon={CheckCircle} label="Completed" value={`$${(stats.completed / 1000).toFixed(1)}K`} gradient="from-orange-500 to-orange-600" />
          <StatCard icon={Clock} label="Pending" value={`$${(stats.pending / 1000).toFixed(1)}K`} gradient="from-orange-500 to-orange-600" />
          <StatCard icon={CreditCard} label="Transactions" value={stats.transactionCount} gradient="from-orange-500 to-orange-600" />
          <StatCard icon={TrendingUp} label="Avg Amount" value={`$${Number(stats.avgAmount).toLocaleString()}`} gradient="from-orange-500 to-orange-600" />
        </div>

        {/* Search and Filters */}
        <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-4 shadow-xl border-2 border-[#d85a2a]/20 mb-6">
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
        <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-[#d85a2a]/20 overflow-hidden">
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
                      <span className="font-bold text-[#FF8C42]">{txn.id}</span>
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
                      <span className="text-xl font-black text-[#FF8C42]">${txn.amount.toLocaleString()}</span>
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
                        className="text-[#FF8C42] hover:text-orange-700 font-bold text-sm hover:underline"
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
          <div className="bg-[#1f2937] rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6 flex items-center justify-between sticky top-0 z-10">
              <div>
                <h3 className="text-3xl font-black text-white mb-1">Transaction Details</h3>
                <p className="text-orange-100 font-semibold">{selectedPayment.id}</p>
              </div>
              <button onClick={() => setSelectedPayment(null)} className="p-2 hover:bg-[#d85a2a]/10 rounded-xl transition-colors">
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
                <h4 className="text-xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
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
                <h4 className="text-xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
                  <Home className="w-6 h-6" /> Booking Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-1">Property</p>
                    <p className="font-bold text-gray-900">{selectedPayment.property}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-1">Booking Reference</p>
                    <p className="font-bold text-[#FF8C42]">{selectedPayment.bookingRef}</p>
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
                <h4 className="text-xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
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
                    <p className="font-bold text-[#FF8C42]">{selectedPayment.id}</p>
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
