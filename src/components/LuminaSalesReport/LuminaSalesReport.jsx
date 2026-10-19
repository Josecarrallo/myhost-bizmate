import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  TrendingUp,
  DollarSign,
  Home,
  Users,
  AlertCircle,
  Loader2,
  BarChart3,
  Plane,
  UserPlus,
  XCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { supabaseService } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';

const LuminaSalesReport = ({ onBack }) => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [bookings, setBookings] = useState([]); // Bookings for the period

  // Period selection
  const [periodType, setPeriodType] = useState('month'); // today, week, month, custom
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  // Property selection
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null); // null = all

  // Villa list for filtering
  const [villas, setVillas] = useState([]);
  const [selectedVilla, setSelectedVilla] = useState(null); // null = all

  // Load user's properties and villas
  useEffect(() => {
    const loadPropertiesAndVillas = async () => {
      if (!userData?.id) return;

      try {
        // Load properties
        const { data: propsData, error: propsError } = await supabase
          .from('properties')
          .select('id, name')
          .eq('owner_id', userData.id);

        if (!propsError && propsData) {
          setProperties(propsData);

          // Load villas for these properties
          if (propsData.length > 0) {
            const propIds = propsData.map(p => p.id);
            const { data: villasData, error: villasError } = await supabase
              .from('villas')
              .select('id, name, property_id')
              .in('property_id', propIds);

            if (!villasError && villasData) {
              setVillas(villasData);
            }
          }
        }
      } catch (err) {
        console.error('Error loading properties/villas:', err);
      }
    };

    loadPropertiesAndVillas();
  }, [userData?.id]);

  // Filter villas by selected property
  const filteredVillas = selectedProperty
    ? villas.filter(v => v.property_id === selectedProperty)
    : villas;

  // Calculate date range based on period type
  const getDateRange = () => {
    const today = new Date();
    let from, to;

    switch (periodType) {
      case 'today':
        from = today.toISOString().split('T')[0];
        to = from;
        break;
      case 'week':
        // Monday to Sunday
        const dayOfWeek = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        from = monday.toISOString().split('T')[0];
        to = sunday.toISOString().split('T')[0];
        break;
      case 'month':
        from = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        to = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
        break;
      case 'custom':
        from = customFrom;
        to = customTo;
        break;
      default:
        from = today.toISOString().split('T')[0];
        to = from;
    }

    return { from, to };
  };

  // Fetch report data
  const fetchReport = async () => {
    if (!userData?.id) return;

    const { from, to } = getDateRange();
    if (!from || !to) {
      setError('Please select valid dates');
      return;
    }

    // Validate date format and reasonable year range (2020-2030)
    const fromYear = parseInt(from.split('-')[0]);
    const toYear = parseInt(to.split('-')[0]);
    if (fromYear < 2020 || fromYear > 2030 || toYear < 2020 || toYear > 2030) {
      setError('Please select dates between 2020 and 2030');
      return;
    }

    // Validate from <= to
    if (from > to) {
      setError('From date must be before or equal to To date');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const rpcParams = {
        p_tenant_id: userData.id,
        p_from: from,
        p_to: to,
        p_property_id: selectedProperty,
        ...(selectedVilla && { p_villa_id: selectedVilla })
      };

      console.log('[LuminaSalesReport] Fetching with params:', rpcParams);

      // Fetch RPC report
      const rpcResult = await supabase.rpc('lumina_sales_report', rpcParams);

      if (rpcResult.error) {
        console.error('RPC error:', rpcResult.error);
        setError('Report not available, try again');
        setReportData(null);
        setBookings([]);
      } else {
        setReportData(rpcResult.data);

        // Build filters for bookings query (same pattern as ManualDataEntry)
        const bookingFilters = {
          tenant_id: userData.id,
          check_in_gte: from,
          check_in_lte: to
        };

        // Add villa filter if selected
        if (selectedVilla) {
          bookingFilters.villa_id = selectedVilla;
        }

        // Fetch bookings using supabaseService (same as ManualDataEntry)
        try {
          const bookingsData = await supabaseService.getBookings(bookingFilters);
          setBookings(bookingsData || []);
        } catch (bookErr) {
          console.error('Error fetching bookings:', bookErr);
          setBookings([]);
        }
      }
    } catch (err) {
      console.error('Error fetching report:', err);
      setError('Report not available, try again');
      setReportData(null);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when filters change
  useEffect(() => {
    if (userData?.id && (periodType !== 'custom' || (customFrom && customTo))) {
      fetchReport();
    }
  }, [userData?.id, periodType, selectedProperty, selectedVilla, customFrom, customTo]);

  // Format currency
  const formatCurrency = (amount, currency = 'IDR') => {
    if (amount === null || amount === undefined) return '-';
    return `${currency} ${Math.round(amount).toLocaleString('id-ID')}`;
  };

  // Format percentage
  const formatPct = (pct) => {
    if (pct === null || pct === undefined) return '-';
    return `${Math.round(pct)}%`;
  };

  return (
    <div className="flex-1 h-screen bg-gradient-to-br from-[#1a1f2e] via-[#1f2937] to-[#111827] p-4 md:p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Sales Report</h1>
            <p className="text-gray-400 text-sm">Lumina Analytics</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#2a2f3a] rounded-xl p-4 mb-6 border border-gray-700">
        {/* Row 1: Period buttons + Property + Villa */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {/* Period selector */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div className="flex gap-1">
              {['today', 'week', 'month', 'custom'].map((type) => (
                <button
                  key={type}
                  onClick={() => setPeriodType(type)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    periodType === type
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {type === 'today' ? 'Today' :
                   type === 'week' ? 'This Week' :
                   type === 'month' ? 'This Month' : 'Custom'}
                </button>
              ))}
            </div>
          </div>

          {/* Property selector */}
          {properties.length > 0 && (
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-gray-400" />
              <select
                value={selectedProperty || ''}
                onChange={(e) => {
                  setSelectedProperty(e.target.value || null);
                  setSelectedVilla(null); // Reset villa when property changes
                }}
                className="px-4 py-2.5 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-white text-sm focus:outline-none focus:border-orange-300"
              >
                <option value="">All Properties</option>
                {properties.map((prop) => (
                  <option key={prop.id} value={prop.id}>{prop.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Villa selector */}
          {filteredVillas.length > 0 && (
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-purple-400" />
              <select
                value={selectedVilla || ''}
                onChange={(e) => setSelectedVilla(e.target.value || null)}
                className="px-4 py-2.5 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-white text-sm focus:outline-none focus:border-orange-300"
              >
                <option value="">All Villas</option>
                {filteredVillas.map((villa) => (
                  <option key={villa.id} value={villa.id}>{villa.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Row 2: Date Range (From/To) - always visible */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Date From Filter */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">From</span>
            <input
              type="date"
              value={periodType === 'custom' ? customFrom : getDateRange().from}
              onChange={(e) => {
                setPeriodType('custom');
                setCustomFrom(e.target.value);
              }}
              className="px-4 py-2.5 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-white text-sm focus:outline-none focus:border-orange-300"
            />
          </div>

          {/* Date To Filter */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">To</span>
            <input
              type="date"
              value={periodType === 'custom' ? customTo : getDateRange().to}
              onChange={(e) => {
                setPeriodType('custom');
                setCustomTo(e.target.value);
              }}
              className="px-4 py-2.5 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-white text-sm focus:outline-none focus:border-orange-300"
            />
          </div>

          {/* Clear filters */}
          <button
            onClick={() => {
              setPeriodType('month');
              setCustomFrom('');
              setCustomTo('');
              setSelectedProperty(null);
              setSelectedVilla(null);
            }}
            className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm transition-all"
          >
            Clear Filters
          </button>
        </div>

        {/* Period info */}
        {reportData?.period && (
          <div className="mt-3 text-sm text-gray-400">
            {reportData.period.from} to {reportData.period.to} ({reportData.period.nights} nights)
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <span className="ml-3 text-gray-400">Loading report...</span>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-900/30 rounded-xl p-6 border border-red-700 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-red-300 font-medium">{error}</p>
        </div>
      )}

      {/* Report content */}
      {reportData && !loading && !error && reportData.properties?.map((property, propIdx) => (
        <div key={propIdx} className="mb-8">
          {/* Property header */}
          {reportData.properties.length > 1 && (
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-orange-400" />
              {property.property}
            </h2>
          )}

          {/* 4 KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Occupancy */}
            <div className="bg-[#2a2f3a] rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400 text-sm">Occupancy</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {formatPct(property.totals?.occupancy_pct)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {property.totals?.sold_nights || 0} / {property.totals?.available_nights || 0} nights
              </div>
            </div>

            {/* Revenue */}
            <div className="bg-[#2a2f3a] rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className="text-gray-400 text-sm">Revenue</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(property.totals?.revenue, property.currency)}
              </div>
            </div>

            {/* ADR */}
            <div className="bg-[#2a2f3a] rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span className="text-gray-400 text-sm">ADR</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(property.totals?.adr, property.currency)}
              </div>
              <div className="text-xs text-gray-500 mt-1">avg per night</div>
            </div>

            {/* New Bookings */}
            <div className="bg-[#2a2f3a] rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <UserPlus className="w-5 h-5 text-orange-400" />
                <span className="text-gray-400 text-sm">New Bookings</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {property.new_bookings?.count || 0}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatCurrency(property.new_bookings?.value, property.currency)}
              </div>
            </div>
          </div>

          {/* Villas with Bookings - Each villa shows its bookings with code and dates */}
          {property.villas && property.villas.length > 0 && (
            <div className="space-y-4 mb-6">
              {property.villas.map((villa, villaIdx) => {
                  // Find villa ID from our villas state (RPC returns name, we need ID)
                  const villaObj = villas.find(v => v.name === villa.villa);
                  const villaId = villaObj?.id;

                  // Find bookings for this villa by villa_id
                  const villaBookings = bookings.filter(b => b.villa_id === villaId);

                  return (
                    <div key={villaIdx} className="bg-[#2a2f3a] rounded-xl border border-gray-700 overflow-hidden">
                      {/* Villa Header */}
                      <div className="px-4 py-3 bg-gray-800/50 border-b border-gray-700 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <Home className="w-5 h-5 text-purple-400" />
                          <h3 className="text-white font-bold">{villa.villa}</h3>
                          {villa.available_nights === 0 && (
                            <span className="px-2 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-400">Blocked</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-400">
                            {villa.sold_nights} / {villa.available_nights} nights
                          </span>
                          <span className="text-white font-medium">
                            {villa.available_nights > 0 ? formatPct(villa.occupancy_pct) : '-'}
                          </span>
                          <span className="text-green-400 font-medium">
                            {formatCurrency(villa.revenue, property.currency)}
                          </span>
                        </div>
                      </div>

                      {/* Bookings for this villa */}
                      {villaBookings.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="text-left text-gray-500 text-xs border-b border-gray-700/50">
                                <th className="px-4 py-2">Code</th>
                                <th className="px-4 py-2">Guest</th>
                                <th className="px-4 py-2">Check-in</th>
                                <th className="px-4 py-2">Check-out</th>
                                <th className="px-4 py-2">Channel</th>
                                <th className="px-4 py-2 text-right">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {villaBookings.map((booking, bookIdx) => (
                                <tr key={bookIdx} className="border-b border-gray-700/30 hover:bg-gray-800/30">
                                  <td className="px-4 py-2 text-orange-400 font-mono text-sm">{booking.confirmation_code}</td>
                                  <td className="px-4 py-2 text-white">{booking.guest_name}</td>
                                  <td className="px-4 py-2 text-gray-300">{booking.check_in}</td>
                                  <td className="px-4 py-2 text-gray-300">{booking.check_out}</td>
                                  <td className="px-4 py-2">
                                    <span className={`px-2 py-0.5 rounded text-xs ${
                                      booking.channel === 'airbnb' ? 'bg-pink-500/20 text-pink-400' :
                                      booking.channel === 'booking' ? 'bg-blue-500/20 text-blue-400' :
                                      'bg-green-500/20 text-green-400'
                                    }`}>
                                      {booking.channel}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2 text-right text-green-400">
                                    {formatCurrency(booking.total_amount, property.currency)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-sm">
                          No bookings in this period
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}

          {/* New Bookings by Channel & Leads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Bookings by Channel */}
            {property.new_bookings?.by_channel && (
              <div className="bg-[#2a2f3a] rounded-xl p-4 border border-gray-700">
                <h3 className="text-white font-bold mb-3">Bookings by Channel</h3>
                <div className="space-y-2">
                  {Object.entries(property.new_bookings.by_channel).map(([channel, count]) => (
                    <div key={channel} className="flex items-center justify-between">
                      <span className={`text-sm ${
                        channel === 'airbnb' ? 'text-pink-400' :
                        channel === 'booking' ? 'text-blue-400' :
                        'text-green-400'
                      }`}>
                        {channel.charAt(0).toUpperCase() + channel.slice(1)}
                      </span>
                      <span className="text-white font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Leads & Cancellations */}
            <div className="bg-[#2a2f3a] rounded-xl p-4 border border-gray-700">
              <h3 className="text-white font-bold mb-3">Activity</h3>
              <div className="space-y-2">
                {property.leads && property.leads_scope !== 'not_available_per_villa' && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Leads</span>
                    <span className="text-white">
                      {property.leads.new || 0} new · {property.leads.won || 0} converted
                    </span>
                  </div>
                )}
                {property.leads_scope === 'not_available_per_villa' && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Leads</span>
                    <span className="text-gray-500 text-sm">Only available per property</span>
                  </div>
                )}
                {property.cancellations && property.cancellations.count > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-red-400">Cancellations</span>
                    <span className="text-white">
                      {property.cancellations.count} ({formatCurrency(property.cancellations.value, property.currency)})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Arrivals Next 7 Days */}
          {property.arrivals_next_7_days && property.arrivals_next_7_days.length > 0 && (
            <div className="bg-[#2a2f3a] rounded-xl border border-gray-700 overflow-hidden mb-6">
              <div className="px-4 py-3 bg-gray-800/50 border-b border-gray-700 flex items-center gap-2">
                <Plane className="w-4 h-4 text-orange-400" />
                <h3 className="text-white font-bold">Arrivals Next 7 Days</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
                      <th className="px-4 py-2">Check-in</th>
                      <th className="px-4 py-2">Guest</th>
                      <th className="px-4 py-2">Villa</th>
                      <th className="px-4 py-2">Channel</th>
                      <th className="px-4 py-2">Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {property.arrivals_next_7_days.map((arrival, arrIdx) => (
                      <tr key={arrIdx} className="border-b border-gray-700/50">
                        <td className="px-4 py-2 text-orange-400 font-medium">{arrival.check_in}</td>
                        <td className="px-4 py-2 text-white">{arrival.guest}</td>
                        <td className="px-4 py-2 text-gray-300">{arrival.villa}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            arrival.channel === 'airbnb' ? 'bg-pink-500/20 text-pink-400' :
                            arrival.channel === 'booking' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {arrival.channel}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-gray-400 font-mono text-sm">{arrival.code}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Warnings */}
          <div className="flex flex-wrap gap-3">
            {property.totals?.pending_payment_nights > 0 && (
              <div className="bg-yellow-900/30 rounded-lg px-3 py-2 border border-yellow-700 text-yellow-300 text-sm">
                {property.totals.pending_payment_nights} nights pending payment
              </div>
            )}
            {property.totals?.nights_without_price > 0 && (
              <div className="bg-orange-900/30 rounded-lg px-3 py-2 border border-orange-700 text-orange-300 text-sm">
                {property.totals.nights_without_price} nights without price
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Note */}
      {reportData?.note && (
        <div className="text-gray-500 text-sm italic mt-4">
          {reportData.note}
        </div>
      )}
    </div>
  );
};

export default LuminaSalesReport;
