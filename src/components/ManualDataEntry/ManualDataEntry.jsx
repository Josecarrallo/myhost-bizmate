import React, { useState } from 'react';
import {
  ClipboardList,
  UserPlus,
  Calendar,
  DollarSign,
  CheckCircle,
  X,
  Save,
  Phone,
  Mail,
  MessageSquare,
  Users,
  Home,
  CreditCard
} from 'lucide-react';

const ManualDataEntry = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('lead'); // 'lead', 'booking', 'payment', 'task'

  // Form states
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    checkIn: '',
    checkOut: '',
    guests: '2',
    source: 'manual'
  });

  const [bookingForm, setBookingForm] = useState({
    leadId: '',
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    propertyId: '',
    checkIn: '',
    checkOut: '',
    guests: '2',
    totalAmount: '',
    status: 'hold'
  });

  const [paymentForm, setPaymentForm] = useState({
    bookingId: '',
    amount: '',
    paymentMethod: 'bank_transfer',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [taskForm, setTaskForm] = useState({
    title: '',
    category: 'housekeeping',
    priority: 'medium',
    assignedTo: '',
    dueDate: '',
    description: ''
  });

  // Handle form submissions
  const handleSubmitLead = (e) => {
    e.preventDefault();
    console.log('Submitting lead:', leadForm);
    // TODO: Call webhook /webhook/inbound-lead-v3
    alert('Lead submitted successfully! (Demo mode)');
    // Reset form
    setLeadForm({
      name: '',
      phone: '',
      email: '',
      message: '',
      checkIn: '',
      checkOut: '',
      guests: '2',
      source: 'manual'
    });
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    console.log('Submitting booking:', bookingForm);
    // TODO: Insert into Supabase bookings table
    alert('Booking created successfully! (Demo mode)');
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    console.log('Submitting payment:', paymentForm);
    // TODO: Update booking payment in Supabase
    alert('Payment updated successfully! (Demo mode)');
  };

  const handleSubmitTask = (e) => {
    e.preventDefault();
    console.log('Submitting task:', taskForm);
    // TODO: Insert into Supabase autopilot_actions table
    alert('Task created successfully! (Demo mode)');
  };

  const tabs = [
    { id: 'lead', label: 'Add Lead / Inquiry', icon: UserPlus },
    { id: 'booking', label: 'Add Booking / Hold', icon: Calendar },
    { id: 'payment', label: 'Update Payment', icon: DollarSign },
    { id: 'task', label: 'Add Task (Ops)', icon: CheckCircle }
  ];

  return (
    <div className="flex-1 h-screen bg-[#2a2f3a] p-4 pb-24 relative overflow-auto">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-[#d85a2a]/5 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl hover:bg-[#1f2937] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-[#d85a2a]/20">
            <X className="w-6 h-6 text-[#FF8C42]" />
          </button>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl">Manual Data Entry</h2>
          </div>
          <div className="w-16"></div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-3 shadow-lg border-2 border-[#d85a2a]/20 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all
                    ${activeTab === tab.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-[#FF8C42] border-2 border-gray-200 hover:border-orange-300'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden md:inline">{tab.label}</span>
                  <span className="md:hidden">{tab.label.split(' ')[1]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20">

          {/* TAB A: Add Lead / Inquiry */}
          {activeTab === 'lead' && (
            <form onSubmit={handleSubmitLead} className="space-y-4">
              <h3 className="text-2xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-[#FF8C42]" />
                Add New Lead / Inquiry
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-[#FF8C42] font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({...leadForm, name: e.target.value})}
                    className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                    placeholder="e.g. Sarah Johnson"
                  />
                </div>

              {/* Phone */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Phone (WhatsApp) *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({...leadForm, phone: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                    placeholder="+62 813 1234 5678"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({...leadForm, email: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                    placeholder="sarah@example.com"
                  />
                </div>
              </div>

              {/* Source */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Source</label>
                <select
                  value={leadForm.source}
                  onChange={(e) => setLeadForm({...leadForm, source: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="manual">Manual Entry</option>
                  <option value="web">Website</option>
                  <option value="instagram">Instagram</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="tiktok">TikTok</option>
                  <option value="referral">Referral</option>
                </select>
              </div>

              {/* Check-in Date */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Check-in Date</label>
                <input
                  type="date"
                  value={leadForm.checkIn}
                  onChange={(e) => setLeadForm({...leadForm, checkIn: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>

              {/* Check-out Date */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Check-out Date</label>
                <input
                  type="date"
                  value={leadForm.checkOut}
                  onChange={(e) => setLeadForm({...leadForm, checkOut: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>

              {/* Number of Guests */}
              <div className="md:col-span-2">
                <label className="block text-[#FF8C42] font-medium mb-2">Number of Guests</label>
                <select
                  value={leadForm.guests}
                  onChange={(e) => setLeadForm({...leadForm, guests: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="md:col-span-2">
                <label className="block text-[#FF8C42] font-medium mb-2">Message / Notes</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    value={leadForm.message}
                    onChange={(e) => setLeadForm({...leadForm, message: e.target.value})}
                    rows={3}
                    className="w-full pl-12 pr-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                    placeholder="Enter inquiry details or special requests..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setLeadForm({
                  name: '', phone: '', email: '', message: '', checkIn: '', checkOut: '', guests: '2', source: 'manual'
                })}
                className="px-6 py-3 bg-[#2a2f3a] hover:bg-[#374151] text-[#FF8C42] rounded-xl font-medium transition-all border-2 border-gray-200"
              >
                Clear
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Lead
              </button>
            </div>
          </form>
        )}

        {/* TAB B: Add Booking / Hold */}
        {activeTab === 'booking' && (
          <form onSubmit={handleSubmitBooking} className="space-y-4">
            <h3 className="text-2xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-[#FF8C42]" />
              Add Booking / Hold
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Guest Name */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Guest Name *</label>
                <input
                  type="text"
                  required
                  value={bookingForm.guestName}
                  onChange={(e) => setBookingForm({...bookingForm, guestName: e.target.value})}
                  className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                  placeholder="Guest full name"
                />
              </div>

              {/* Guest Phone */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Guest Phone *</label>
                <input
                  type="tel"
                  required
                  value={bookingForm.guestPhone}
                  onChange={(e) => setBookingForm({...bookingForm, guestPhone: e.target.value})}
                  className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                  placeholder="+62 813 1234 5678"
                />
              </div>

              {/* Guest Email */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Guest Email *</label>
                <input
                  type="email"
                  required
                  value={bookingForm.guestEmail}
                  onChange={(e) => setBookingForm({...bookingForm, guestEmail: e.target.value})}
                  className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                  placeholder="guest@example.com"
                />
              </div>

              {/* Property / Villa */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Property / Villa *</label>
                <select
                  required
                  value={bookingForm.propertyId}
                  onChange={(e) => setBookingForm({...bookingForm, propertyId: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="">Select a property</option>
                  <option value="villa1">Villa Sunset</option>
                  <option value="villa2">Villa Ocean</option>
                  <option value="villa3">Villa Bamboo</option>
                  <option value="villa4">Villa Paradise</option>
                  <option value="villa5">Villa Jungle</option>
                  <option value="villa6">Villa Tropical</option>
                </select>
              </div>

              {/* Check-in */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Check-in Date *</label>
                <input
                  type="date"
                  required
                  value={bookingForm.checkIn}
                  onChange={(e) => setBookingForm({...bookingForm, checkIn: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>

              {/* Check-out */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Check-out Date *</label>
                <input
                  type="date"
                  required
                  value={bookingForm.checkOut}
                  onChange={(e) => setBookingForm({...bookingForm, checkOut: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>

              {/* Guests */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Number of Guests *</label>
                <select
                  required
                  value={bookingForm.guests}
                  onChange={(e) => setBookingForm({...bookingForm, guests: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              {/* Total Amount */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Total Amount (USD) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={bookingForm.totalAmount}
                    onChange={(e) => setBookingForm({...bookingForm, totalAmount: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="md:col-span-2">
                <label className="block text-[#FF8C42] font-medium mb-2">Booking Status *</label>
                <select
                  required
                  value={bookingForm.status}
                  onChange={(e) => setBookingForm({...bookingForm, status: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="hold">Hold (Pending Payment)</option>
                  <option value="confirmed">Confirmed (Paid)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setBookingForm({
                  leadId: '', guestName: '', guestPhone: '', guestEmail: '', propertyId: '',
                  checkIn: '', checkOut: '', guests: '2', totalAmount: '', status: 'hold'
                })}
                className="px-6 py-3 bg-[#2a2f3a] hover:bg-[#374151] text-[#FF8C42] rounded-xl font-medium transition-all border-2 border-gray-200"
              >
                Clear
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Create Booking
              </button>
            </div>
          </form>
        )}

        {/* TAB C: Update Payment */}
        {activeTab === 'payment' && (
          <form onSubmit={handleSubmitPayment} className="space-y-4">
            <h3 className="text-2xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-[#FF8C42]" />
              Update Payment
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Booking ID */}
              <div className="md:col-span-2">
                <label className="block text-[#FF8C42] font-medium mb-2">Booking ID / Reference *</label>
                <input
                  type="text"
                  required
                  value={paymentForm.bookingId}
                  onChange={(e) => setPaymentForm({...paymentForm, bookingId: e.target.value})}
                  className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                  placeholder="e.g. BK-2026-001"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Payment Amount (USD) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Payment Method *</label>
                <select
                  required
                  value={paymentForm.paymentMethod}
                  onChange={(e) => setPaymentForm({...paymentForm, paymentMethod: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="cash">Cash</option>
                  <option value="paypal">PayPal</option>
                  <option value="wise">Wise</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Payment Date */}
              <div className="md:col-span-2">
                <label className="block text-[#FF8C42] font-medium mb-2">Payment Date *</label>
                <input
                  type="date"
                  required
                  value={paymentForm.paymentDate}
                  onChange={(e) => setPaymentForm({...paymentForm, paymentDate: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-[#FF8C42] font-medium mb-2">Notes</label>
                <textarea
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({...paymentForm, notes: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                  placeholder="Payment confirmation number, transaction reference, etc."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setPaymentForm({
                  bookingId: '', amount: '', paymentMethod: 'bank_transfer',
                  paymentDate: new Date().toISOString().split('T')[0], notes: ''
                })}
                className="px-6 py-3 bg-[#2a2f3a] hover:bg-[#374151] text-[#FF8C42] rounded-xl font-medium transition-all border-2 border-gray-200"
              >
                Clear
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Update Payment
              </button>
            </div>
          </form>
        )}

        {/* TAB D: Add Task (Ops) */}
        {activeTab === 'task' && (
          <form onSubmit={handleSubmitTask} className="space-y-4">
            <h3 className="text-2xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-[#FF8C42]" />
              Add Operational Task
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Task Title */}
              <div className="md:col-span-2">
                <label className="block text-[#FF8C42] font-medium mb-2">Task Title *</label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                  className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                  placeholder="e.g. Deep clean Villa Sunset"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Category *</label>
                <select
                  required
                  value={taskForm.category}
                  onChange={(e) => setTaskForm({...taskForm, category: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="housekeeping">Housekeeping</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inventory">Inventory</option>
                  <option value="guest_service">Guest Service</option>
                  <option value="security">Security</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Priority *</label>
                <select
                  required
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Assigned To */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Assigned To</label>
                <input
                  type="text"
                  value={taskForm.assignedTo}
                  onChange={(e) => setTaskForm({...taskForm, assignedTo: e.target.value})}
                  className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                  placeholder="Staff name or team"
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Due Date</label>
                <input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-[#FF8C42] font-medium mb-2">Description</label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                  placeholder="Detailed task description, special instructions, etc."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setTaskForm({
                  title: '', category: 'housekeeping', priority: 'medium',
                  assignedTo: '', dueDate: '', description: ''
                })}
                className="px-6 py-3 bg-[#2a2f3a] hover:bg-[#374151] text-[#FF8C42] rounded-xl font-medium transition-all border-2 border-gray-200"
              >
                Clear
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Create Task
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  </div>
  );
};

export default ManualDataEntry;
