import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Home,
  User,
  Clock,
  Wrench,
  Sparkles,
  LayoutGrid,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import TimelineView from './TimelineView';

const MasterCalendar = ({ onBack }) => {
  const { user } = useAuth();

  // View mode
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'timeline'

  // Current month navigation
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  // Filters
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  // Applied date filters (only these trigger reload)
  const [appliedStartDate, setAppliedStartDate] = useState('');
  const [appliedEndDate, setAppliedEndDate] = useState('');

  // Data
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data when filters or month changes
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, currentDate, selectedProperty, selectedStatus, selectedChannel, appliedStartDate, appliedEndDate]);

  const loadData = async () => {
    console.log('🔄 Loading calendar data...');
    setLoading(true);
    try {
      // Get user's property_id from their bookings
      const { data: userBooking } = await supabase
        .from('bookings')
        .select('property_id')
        .eq('tenant_id', user.id)
        .limit(1);

      const userPropertyId = userBooking?.[0]?.property_id;
      console.log('📍 User property_id:', userPropertyId);

      // Get villas for this property_id
      let villasData = [];
      if (userPropertyId) {
        const { data: villas, error: villasError } = await supabase
          .from('villas')
          .select('*')
          .eq('property_id', userPropertyId)
          .eq('status', 'active')
          .order('name');

        if (villasError) {
          console.error('❌ Villas error:', villasError);
        } else {
          villasData = villas || [];
        }
      }

      console.log('✅ Villas loaded:', villasData?.length || 0);
      setProperties(villasData);

      // Get first and last day of current month
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      // Build bookings query with filters
      let bookingsQuery = supabase
        .from('bookings')
        .select('*')
        .eq('tenant_id', user.id);

      // Date range filter: Get all bookings that overlap with the view period
      // Use formatDateLocal to avoid timezone issues
      const formatDateLocal = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      };

      const startRange = appliedStartDate || formatDateLocal(firstDay);
      const endRange = appliedEndDate || formatDateLocal(lastDay);

      // Get bookings where check_in is within the date range
      bookingsQuery = bookingsQuery
        .gte('check_in', startRange)
        .lte('check_in', endRange);

      // Apply property filter (using villa_id, not property_id)
      if (selectedProperty !== 'all') {
        bookingsQuery = bookingsQuery.eq('villa_id', selectedProperty);
      }

      // Apply status filter
      if (selectedStatus !== 'all') {
        console.log('🔍 Filtering by status:', selectedStatus);
        bookingsQuery = bookingsQuery.ilike('status', selectedStatus);
      }

      // Apply channel filter (using 'source' field, not 'channel')
      if (selectedChannel !== 'all') {
        console.log('🔍 Filtering by channel:', selectedChannel);
        // Handle Airbnb with space: "Air BnB" or "airbnb"
        if (selectedChannel === 'airbnb') {
          bookingsQuery = bookingsQuery.or('source.ilike.airbnb,source.ilike.Air BnB,source.ilike.air bnb');
        } else {
          bookingsQuery = bookingsQuery.ilike('source', selectedChannel);
        }
      }

      console.log('📍 Fetching bookings with filters...', {
        property: selectedProperty,
        status: selectedStatus,
        channel: selectedChannel,
        currentMonth: `${currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
        dateRange: { from: startRange, to: endRange },
        appliedFilters: { from: appliedStartDate, to: appliedEndDate }
      });
      const { data: bookingsData, error: bookingsError } = await bookingsQuery.order('check_in', { ascending: true });

      if (bookingsError) {
        console.error('❌ Bookings error:', bookingsError);
        throw bookingsError;
      }

      console.log('✅ Bookings loaded:', bookingsData?.length || 0);
      if (bookingsData && bookingsData.length > 0) {
        console.log('First booking:', bookingsData[0]);

        // Show unique status and channel values
        const uniqueStatuses = [...new Set(bookingsData.map(b => b.status))];
        const uniqueChannels = [...new Set(bookingsData.map(b => b.channel))];
        console.log('🏷️ Unique status values in DB:', uniqueStatuses);
        console.log('📺 Unique channel values in DB:', uniqueChannels);

        // Show ALL sources for debugging
        console.log('📋 All bookings with sources:', bookingsData.map(b => ({
          guest: b.guest_name,
          source: b.source,
          channel: b.channel,
          status: b.status,
          dates: `${b.check_in} to ${b.check_out}`
        })));
      }

      // Transform iCal bookings to show "Airbnb direct" instead of "Reserved"
      const transformedBookings = (bookingsData || []).map(booking => {
        const source = (booking.source || '').toLowerCase().trim();
        const channel = (booking.channel || '').toLowerCase().trim();
        const guestName = (booking.guest_name || '').trim();

        // If it's an iCal sync booking with "Reserved" as guest name
        if (source === 'ical_sync' && guestName.toLowerCase() === 'reserved') {
          let displayName = 'Channel direct';

          if (channel === 'airbnb') displayName = 'Airbnb direct';
          else if (channel === 'booking') displayName = 'Booking.com direct';
          else if (channel) displayName = channel.charAt(0).toUpperCase() + channel.slice(1) + ' direct';

          console.log(`🔄 [Calendar Transform] ${guestName} (${source}/${channel}) → ${displayName}`);

          return {
            ...booking,
            guest_name: displayName
          };
        }

        return booking;
      });

      setBookings(transformedBookings);

      // Get housekeeping tasks (with property filter if applicable)
      let tasksQuery = supabase
        .from('housekeeping_tasks')
        .select('*')
        .gte('scheduled_date', firstDay.toISOString().split('T')[0])
        .lte('scheduled_date', lastDay.toISOString().split('T')[0]);

      if (selectedProperty !== 'all') {
        tasksQuery = tasksQuery.eq('villa_id', selectedProperty);
      }

      console.log('📍 Fetching tasks...');
      const { data: tasksData, error: tasksError } = await tasksQuery.order('scheduled_date', { ascending: true });

      if (tasksError) {
        console.error('❌ Tasks error:', tasksError);
        // No throw, tasks are optional
      }

      console.log('✅ Tasks loaded:', tasksData?.length || 0);
      setTasks(tasksData || []);

      // Get maintenance issues (with property filter if applicable)
      let issuesQuery = supabase
        .from('maintenance_issues')
        .select('*')
        .gte('created_at', firstDay.toISOString())
        .lte('created_at', lastDay.toISOString());

      if (selectedProperty !== 'all') {
        issuesQuery = issuesQuery.eq('villa_id', selectedProperty);
      }

      console.log('📍 Fetching issues...');
      const { data: issuesData, error: issuesError } = await issuesQuery.order('created_at', { ascending: true });

      if (issuesError) {
        console.error('❌ Issues error:', issuesError);
        // No throw, issues are optional
      }

      console.log('✅ Issues loaded:', issuesData?.length || 0);
      setIssues(issuesData || []);

      console.log('✅ Calendar data loaded successfully');
    } catch (error) {
      console.error('❌ Error loading calendar data:', error);
    } finally {
      console.log('✅ Setting loading to false');
      setLoading(false);
    }
  };

  // Get months to display based on applied date range
  const getMonthsToDisplay = () => {
    if (!appliedStartDate || !appliedEndDate) {
      // No date filter applied, show current month only
      return [currentDate];
    }

    // Calculate months between start and end date
    const [startYear, startMonth] = appliedStartDate.split('-').map(Number);
    const [endYear, endMonth] = appliedEndDate.split('-').map(Number);

    const startDate = new Date(startYear, startMonth - 1, 1);
    const endDate = new Date(endYear, endMonth - 1, 1);

    const months = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }

    return months;
  };

  // Generate calendar days for a specific month
  const getCalendarDaysForMonth = (monthDate) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay()); // Start from Sunday

    const days = [];
    const currentDay = new Date(startDate);

    // Generate 6 weeks (42 days)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  };

  // For backward compatibility
  const getCalendarDays = () => getCalendarDaysForMonth(currentDate);

  // Helper function to format date as YYYY-MM-DD without timezone issues
  const formatDateLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get items for a specific day
  const getItemsForDay = (date) => {
    const dateStr = formatDateLocal(date);

    const items = {
      bookings: [],
      tasks: [],
      issues: [],
      isOccupied: false, // NEW: indicates if day is in middle of a booking
      occupiedCount: 0   // NEW: number of overlapping bookings on this day
    };

    // Bookings - show on check-in and check-out days, mark intermediate days as occupied
    bookings.forEach(booking => {
      const checkInStr = booking.check_in;
      const checkOutStr = booking.check_out;

      // Show booking card only on first day (check-in) or last day (check-out)
      if (dateStr === checkInStr || dateStr === checkOutStr) {
        items.bookings.push({
          ...booking,
          isCheckIn: dateStr === checkInStr,
          isCheckOut: dateStr === checkOutStr
        });
      }

      // Check if day is in the MIDDLE of a booking (occupied but no card shown)
      // Between check-in and check-out (exclusive)
      if (dateStr > checkInStr && dateStr < checkOutStr) {
        items.isOccupied = true;
        items.occupiedCount++;
      }
    });

    // Tasks scheduled for this day
    items.tasks = tasks.filter(task => task.scheduled_date === dateStr);

    // Issues created on this day
    items.issues = issues.filter(issue => {
      const issueDate = new Date(issue.created_at).toISOString().split('T')[0];
      return issueDate === dateStr;
    });

    return items;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDayClick = (date) => {
    setSelectedDay(date);
  };

  const getChannelColor = (source) => {
    const src = (source || '').toLowerCase().trim();
    if (src === 'airbnb' || src === 'air bnb') {
      return 'bg-[#d85a2a]/20 text-[#d85a2a] border-[#d85a2a]/40';
    } else if (src === 'booking.com') {
      return 'bg-[#f5a524]/20 text-[#f5a524] border-[#f5a524]/40';
    } else if (src === 'gita') {
      return 'bg-white/20 text-white border-white/40';
    } else if (src === 'agoda') {
      return 'bg-[#d85a2a]/30 text-orange-300 border-orange-400/40';
    } else {
      return 'bg-white/10 text-white/60 border-white/20';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-[#f5a524]/20 text-[#f5a524]';
      case 'inquiry': return 'bg-white/20 text-white';
      case 'checked_in': return 'bg-[#d85a2a]/20 text-[#d85a2a]';
      case 'cancelled': return 'bg-white/10 text-white/40';
      default: return 'bg-white/10 text-white/60';
    }
  };

  const calendarDays = getCalendarDays();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <div className="flex-1 h-screen bg-[#2a2f3a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#d85a2a]/30 border-t-[#d85a2a] rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl font-bold">Loading calendar...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-screen bg-[#2a2f3a] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-[#1f2937] border-b border-[#d85a2a]/20 px-3 md:px-6 py-3 md:py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 mb-4">
          <div className="flex items-center gap-3 md:gap-4">
            <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg">
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-[#d85a2a]" />
                Master Calendar
              </h1>
              <p className="text-xs md:text-sm text-white/60">Bookings, Tasks & Operations</p>
            </div>
          </div>

          {/* View Switcher - Hidden in mobile */}
          <div className="hidden md:flex items-center gap-2 bg-[#2a2f3a] rounded-lg p-1">
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                viewMode === 'month'
                  ? 'bg-gradient-to-r from-[#d85a2a] to-[#f5a524] text-white shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutGrid size={18} />
              <span className="text-sm font-medium">Month</span>
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                viewMode === 'timeline'
                  ? 'bg-gradient-to-r from-[#d85a2a] to-[#f5a524] text-white shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart3 size={18} />
              <span className="text-sm font-medium">Timeline</span>
            </button>
          </div>
        </div>

        {/* Filters - Responsive */}
        <div className="space-y-2">
          {/* Row 1: Property, Status, Channel - 2 cols mobile, 3 cols desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="px-2 md:px-4 py-2 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] border-2 border-[#d85a2a] rounded-lg text-white text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#f5a524] hover:shadow-lg transition-all"
            >
              <option value="all" className="bg-[#1f2937] text-white">All Properties</option>
              {properties.map(p => (
                <option key={p.id} value={p.id} className="bg-[#1f2937] text-white">{p.name}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2 md:px-4 py-2 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] border-2 border-[#d85a2a] rounded-lg text-white text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#f5a524] hover:shadow-lg transition-all"
            >
              <option value="all" className="bg-[#1f2937] text-white">All Status</option>
              <option value="confirmed" className="bg-[#1f2937] text-white">Confirmed</option>
              <option value="inquiry" className="bg-[#1f2937] text-white">Inquiry</option>
              <option value="checked_in" className="bg-[#1f2937] text-white">Checked In</option>
              <option value="cancelled" className="bg-[#1f2937] text-white">Cancelled</option>
            </select>

            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="px-2 md:px-4 py-2 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] border-2 border-[#d85a2a] rounded-lg text-white text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#f5a524] hover:shadow-lg transition-all col-span-2 md:col-span-1"
            >
              <option value="all" className="bg-[#1f2937] text-white">All Channels</option>
              <option value="airbnb" className="bg-[#1f2937] text-white">Airbnb</option>
              <option value="booking.com" className="bg-[#1f2937] text-white">Booking.com</option>
              <option value="gita" className="bg-[#1f2937] text-white">Direct (Gita)</option>
              <option value="agoda" className="bg-[#1f2937] text-white">Agoda</option>
            </select>
          </div>

          {/* Row 2: Date Range Filters - responsive */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3">
            <div className="flex items-center gap-2 px-2 md:px-3 py-1.5 md:py-2 bg-white/10 border border-[#d85a2a]/30 rounded-lg flex-1 md:flex-initial">
              <span className="text-white text-xs font-medium whitespace-nowrap">From:</span>
              <input
                type="date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                className="bg-transparent text-white text-xs md:text-sm border-none focus:outline-none w-full"
              />
            </div>

            <div className="flex items-center gap-2 px-2 md:px-3 py-1.5 md:py-2 bg-white/10 border border-[#d85a2a]/30 rounded-lg flex-1 md:flex-initial">
              <span className="text-white text-xs font-medium whitespace-nowrap">To:</span>
              <input
                type="date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                className="bg-transparent text-white text-xs md:text-sm border-none focus:outline-none w-full"
              />
            </div>

            {/* Apply button - only show when both dates are filled */}
            {startDateFilter && endDateFilter && (
              <button
                onClick={() => {
                  setAppliedStartDate(startDateFilter);
                  setAppliedEndDate(endDateFilter);

                  // Change calendar to show the month of the start date
                  const [year, month, day] = startDateFilter.split('-').map(Number);
                  setCurrentDate(new Date(year, month - 1, 1));
                }}
                className="px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] hover:shadow-lg text-white text-xs md:text-sm font-semibold rounded-lg transition-all"
              >
                Apply
              </button>
            )}

            {/* Clear button - show when any date is filled */}
            {(startDateFilter || endDateFilter || appliedStartDate || appliedEndDate) && (
              <button
                onClick={() => {
                  setStartDateFilter('');
                  setEndDateFilter('');
                  setAppliedStartDate('');
                  setAppliedEndDate('');

                  // Reset calendar to current month
                  setCurrentDate(new Date());
                }}
                className="px-2 md:px-3 py-1.5 md:py-2 bg-white/10 hover:bg-white/20 text-white text-xs md:text-sm rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Timeline View */}
      {viewMode === 'timeline' ? (
        <TimelineView
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          selectedProperty={selectedProperty}
          selectedStatus={selectedStatus}
          selectedChannel={selectedChannel}
          appliedStartDate={appliedStartDate}
          appliedEndDate={appliedEndDate}
          properties={properties}
          user={user}
        />
      ) : (
        <>
          {/* Month Navigation - Only show when NO date filter is applied */}
          {!appliedStartDate && !appliedEndDate && (
            <div className="bg-[#1f2937]/30 border-b border-white/10 px-6 py-3 flex items-center justify-between">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-white/10 rounded-lg">
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <div className="text-white font-bold text-lg">{monthName}</div>
              <button onClick={handleNextMonth} className="p-2 hover:bg-white/10 rounded-lg">
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          )}

          {/* Calendar Grid - Desktop Only */}
      <div className="hidden md:block flex-1 overflow-auto p-4">
        <div className="space-y-6">
          {getMonthsToDisplay().map((monthDate, monthIdx) => {
            const calendarDays = getCalendarDaysForMonth(monthDate);
            const monthName = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

            return (
              <div key={monthIdx} className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                {/* Month header */}
                <div className="bg-[#1f2937] border-b border-white/10 px-6 py-3 text-center">
                  <h3 className="text-white font-bold text-lg">{monthName}</h3>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 bg-[#1f2937] border-b border-white/10">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="px-2 py-3 text-center text-white/80 font-medium text-sm border-r border-white/10 last:border-r-0">
                {day}
              </div>
            ))}
          </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7">
                  {calendarDays.map((date, idx) => {
                    const items = getItemsForDay(date);
                    const isCurrentMonth = date.getMonth() === monthDate.getMonth();
                    const isToday = date.toDateString() === new Date().toDateString();

                    return (
                      <div
                        key={idx}
                        onClick={() => handleDayClick(date)}
                        className={`
                          min-h-[120px] p-2 border-r border-b border-white/10 cursor-pointer
                          hover:bg-white/5 transition-colors
                          ${!isCurrentMonth ? 'bg-white/5 opacity-50' : ''}
                          ${isToday && !appliedStartDate && !appliedEndDate ? 'bg-orange-500/10 border-orange-500/30' : ''}
                          ${items.isOccupied && isCurrentMonth ? 'bg-red-900/30 border-red-500/40' : ''}
                        `}
                      >
                        {/* Day number */}
                        <div className={`text-sm font-medium mb-1 ${
                          isToday && !appliedStartDate && !appliedEndDate
                            ? 'text-orange-400'
                            : isCurrentMonth
                              ? 'text-white'
                              : 'text-white/40'
                        }`}>
                          {date.getDate()}
                          {/* Show occupied indicator */}
                          {items.isOccupied && items.occupiedCount > 0 && (
                            <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-red-500/80 text-white rounded-full">
                              {items.occupiedCount}
                            </span>
                          )}
                        </div>

                        {/* Items for this day */}
                        <div className="space-y-1">
                          {/* Bookings */}
                          {items.bookings.map((booking, bidx) => (
                            <div
                              key={`b-${bidx}`}
                              className={`text-xs px-2 py-1 rounded border ${getChannelColor(booking.source)}`}
                            >
                              <div className="font-bold truncate">{booking.guest_name}</div>
                              <div className="text-[10px] opacity-90 font-semibold uppercase">
                                {(() => {
                                  const source = (booking.source || '').toLowerCase();
                                  const channel = (booking.channel || '').toLowerCase();

                                  // Si es Channel Sync, mostrar el canal real
                                  if (source === 'ical_sync') {
                                    if (channel === 'airbnb') return 'Airbnb';
                                    if (channel === 'booking') return 'Booking.com';
                                    if (channel === 'agoda') return 'Agoda';
                                    if (channel === 'traveloka') return 'Traveloka';
                                    return channel || 'Channel Sync';
                                  }

                                  return booking.source || 'N/A';
                                })()}
                              </div>
                              <div className="text-[10px] opacity-80 mt-0.5">
                                {booking.isCheckIn && '✈️ IN: '}
                                {booking.isCheckOut && '🚪 OUT: '}
                                {new Date(booking.isCheckIn ? booking.check_in : booking.check_out).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                              </div>
                            </div>
                          ))}

                          {/* Tasks */}
                          {items.tasks.slice(0, 2).map((task, tidx) => (
                            <div
                              key={`t-${tidx}`}
                              className="text-xs px-2 py-1 rounded bg-white/10 text-white border border-white/30"
                            >
                              <div className="flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                <span className="truncate">{task.task_type}</span>
                              </div>
                            </div>
                          ))}

                          {/* Issues */}
                          {items.issues.slice(0, 1).map((issue, iidx) => (
                            <div
                              key={`i-${iidx}`}
                              className="text-xs px-2 py-1 rounded bg-[#d85a2a]/30 text-orange-200 border border-[#d85a2a]/50"
                            >
                              <div className="flex items-center gap-1">
                                <Wrench className="w-3 h-3" />
                                <span className="truncate">{issue.issue_type}</span>
                              </div>
                            </div>
                          ))}

                          {/* Show "+X more" if there are more items */}
                          {(items.bookings.length + items.tasks.length + items.issues.length) > 3 && (
                            <div className="text-xs text-white/60 pl-2">
                              +{items.bookings.length + items.tasks.length + items.issues.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile List View */}
      <div className="md:hidden flex-1 overflow-auto p-3">
        <div className="space-y-3">
          {getMonthsToDisplay().map((monthDate, monthIdx) => {
            const calendarDays = getCalendarDaysForMonth(monthDate);
            const monthName = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

            // Get all items for this month
            const monthItems = [];
            calendarDays.forEach(date => {
              const items = getItemsForDay(date);
              if (items.bookings.length > 0 || items.tasks.length > 0 || items.issues.length > 0) {
                monthItems.push({ date, items });
              }
            });

            if (monthItems.length === 0) return null;

            return (
              <div key={monthIdx} className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                {/* Month header */}
                <div className="bg-[#1f2937] border-b border-white/10 px-4 py-2">
                  <h3 className="text-white font-bold text-base">{monthName}</h3>
                </div>

                {/* List of days with items */}
                <div className="p-2 space-y-2">
                  {monthItems.map(({ date, items }, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleDayClick(date)}
                      className="bg-[#2a2f3a] rounded-lg p-3 border border-white/10 active:bg-white/10 touch-manipulation"
                    >
                      {/* Date header */}
                      <div className="text-orange-400 font-bold text-sm mb-2">
                        {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        {items.isOccupied && (
                          <span className="ml-2 text-xs px-2 py-0.5 bg-red-500/80 text-white rounded-full">
                            {items.occupiedCount} occupied
                          </span>
                        )}
                      </div>

                      {/* Bookings */}
                      {items.bookings.slice(0, 2).map((booking, bidx) => (
                        <div key={`b-${bidx}`} className="text-xs px-2 py-1.5 mb-1 rounded border border-blue-500/50 bg-blue-500/10">
                          <div className="font-bold text-white">{booking.guest_name}</div>
                          <div className="text-blue-300 text-[10px]">{booking.source || booking.channel || 'Direct'}</div>
                        </div>
                      ))}

                      {/* Tasks */}
                      {items.tasks.slice(0, 1).map((task, tidx) => (
                        <div key={`t-${tidx}`} className="text-xs px-2 py-1.5 mb-1 rounded border border-yellow-500/50 bg-yellow-500/10">
                          <div className="font-bold text-white">{task.title}</div>
                          <div className="text-yellow-300 text-[10px]">{task.task_type || task.category}</div>
                        </div>
                      ))}

                      {/* Show count if more items */}
                      {(items.bookings.length + items.tasks.length + items.issues.length) > 3 && (
                        <div className="text-xs text-white/60 pl-2 mt-1">
                          +{items.bookings.length + items.tasks.length + items.issues.length - 3} more items
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Day Detail Modal */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4 md:pl-[280px]">
          <div className="bg-[#1f2937] rounded-2xl w-full max-w-3xl max-h-[92vh] md:max-h-[90vh] overflow-hidden border border-white/20 shadow-2xl">
            {/* Modal Header */}
            <div className="bg-[#d85a2a] px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {selectedDay.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </h3>
              <button
                onClick={() => setSelectedDay(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {(() => {
                const items = getItemsForDay(selectedDay);
                const hasItems = items.bookings.length > 0 || items.tasks.length > 0 || items.issues.length > 0;

                if (!hasItems) {
                  return (
                    <div className="text-center py-12 text-white/60">
                      No bookings, tasks, or issues for this day
                    </div>
                  );
                }

                return (
                  <div className="space-y-6">
                    {/* Bookings Section */}
                    {items.bookings.length > 0 && (
                      <div>
                        <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                          <Home className="w-5 h-5 text-[#d85a2a]" />
                          Bookings ({items.bookings.length})
                        </h4>
                        <div className="space-y-3">
                          {items.bookings.map((booking, idx) => (
                            <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <div className="text-white font-medium">{booking.guest_name}</div>
                                  <div className="text-white/60 text-sm">{booking.guest_email}</div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(booking.status)}`}>
                                  {booking.status}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                  <span className="text-white/60">Check-in:</span>
                                  <span className="text-white ml-2">{booking.check_in}</span>
                                </div>
                                <div>
                                  <span className="text-white/60">Check-out:</span>
                                  <span className="text-white ml-2">{booking.check_out}</span>
                                </div>
                                <div>
                                  <span className="text-white/60">Channel:</span>
                                  <span className={`ml-2 px-2 py-0.5 rounded text-xs ${getChannelColor(booking.source)}`}>
                                    {(() => {
                                      const source = (booking.source || '').toLowerCase();
                                      const channel = (booking.channel || '').toLowerCase();

                                      // Si es Channel Sync, mostrar el canal real
                                      if (source === 'ical_sync') {
                                        if (channel === 'airbnb') return 'Airbnb';
                                        if (channel === 'booking') return 'Booking.com';
                                        if (channel === 'agoda') return 'Agoda';
                                        if (channel === 'traveloka') return 'Traveloka';
                                        return channel || 'Channel Sync';
                                      }

                                      return booking.source || 'N/A';
                                    })()}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-white/60">Guests:</span>
                                  <span className="text-white ml-2">{booking.guests}</span>
                                </div>
                                <div>
                                  <span className="text-white/60">Total:</span>
                                  {booking.source === 'ical_sync' ? (
                                    <span className="text-white/50 italic text-sm ml-2">N/A</span>
                                  ) : (
                                    <span className="text-white ml-2">${booking.total_price}</span>
                                  )}
                                </div>
                                <div>
                                  <span className="text-white/60">Nights:</span>
                                  <span className="text-white ml-2">{booking.nights}</span>
                                </div>
                              </div>
                              {booking.notes && (
                                <div className="mt-3 pt-3 border-t border-white/10">
                                  <div className="text-white/60 text-xs mb-1">Notes:</div>
                                  <div className="text-white text-sm">{booking.notes}</div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tasks Section */}
                    {items.tasks.length > 0 && (
                      <div>
                        <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-blue-400" />
                          Housekeeping Tasks ({items.tasks.length})
                        </h4>
                        <div className="space-y-2">
                          {items.tasks.map((task, idx) => (
                            <div key={idx} className="bg-white/5 rounded-lg p-3 border border-white/10">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-white font-medium">{task.task_type}</div>
                                  <div className="text-white/60 text-xs">
                                    {task.scheduled_time || 'No time set'}
                                  </div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  task.status === 'completed' ? 'bg-[#f5a524]/20 text-[#f5a524]' :
                                  task.status === 'in_progress' ? 'bg-[#d85a2a]/20 text-[#d85a2a]' :
                                  'bg-white/10 text-white/60'
                                }`}>
                                  {task.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Issues Section */}
                    {items.issues.length > 0 && (
                      <div>
                        <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                          <Wrench className="w-5 h-5 text-red-400" />
                          Maintenance Issues ({items.issues.length})
                        </h4>
                        <div className="space-y-2">
                          {items.issues.map((issue, idx) => (
                            <div key={idx} className="bg-white/5 rounded-lg p-3 border border-white/10">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <div className="text-white font-medium">{issue.title}</div>
                                  <div className="text-white/60 text-sm">{issue.description}</div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  issue.priority === 'urgent' ? 'bg-[#d85a2a] text-white' :
                                  issue.priority === 'high' ? 'bg-[#f5a524]/20 text-[#f5a524]' :
                                  'bg-white/10 text-white/60'
                                }`}>
                                  {issue.priority}
                                </span>
                              </div>
                              <div className="text-xs text-white/60">
                                Type: <span className="text-white">{issue.issue_type}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="bg-[#1f2937]/50 border-t border-white/10 px-6 py-4">
              <button
                onClick={() => setSelectedDay(null)}
                className="w-full px-4 py-2 bg-[#d85a2a] hover:bg-[#c14e1e] text-white rounded-lg transition-all"
              >
                Volver al Calendario
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default MasterCalendar;
