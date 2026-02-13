import React, { useState, useEffect } from 'react';
import {
  Zap,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  DollarSign,
  MessageSquare,
  Bell,
  ThumbsUp,
  ThumbsDown,
  Eye,
  ArrowLeft,
  Settings,
  Wifi,
  Home,
  CreditCard,
  Mail,
  Globe,
  Wrench,
  BarChart3,
  ClipboardCheck,
  ExternalLink,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Download,
  ClipboardList,
  FileText,
  Printer
} from 'lucide-react';
import ManualDataEntry from '../ManualDataEntry/ManualDataEntry';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { generateReportHTML } from '../../services/generateReportHTML';

const Autopilot = ({ onBack }) => {
  const { userData } = useAuth();

  // Navigation between 9 sections
  const [activeSection, setActiveSection] = useState('menu'); // Start with menu visible
  const [activeView, setActiveView] = useState('daily'); // for Overview section
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [lastSummaryGenerated, setLastSummaryGenerated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState('this_week'); // for filtering
  const [selectedReportType, setSelectedReportType] = useState('all'); // for All Data section
  const [selectedProperty, setSelectedProperty] = useState('gita'); // for Business Reports (owner selection)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false); // for Business Reports generation
  const [reportHTML, setReportHTML] = useState('<html><body style="margin:0;padding:40px;font-family:sans-serif;text-align:center;color:#666;"><h2 style="color:#f97316;">Business Report</h2><p>Select owner and period, then click <strong>Generate Report</strong>.</p></body></html>'); // Business Reports HTML content
  const [selectedPeriod, setSelectedPeriod] = useState('this_month'); // Period selector for reports
  const [selectedAllInfoPeriod, setSelectedAllInfoPeriod] = useState('all_time'); // Period selector for All Information

  // Load saved report from localStorage when entering Business Reports
  useEffect(() => {
    if (activeSection === 'businessReports') {
      const savedReport = localStorage.getItem(`business-report-${selectedProperty}-${selectedPeriod}`);

      if (savedReport) {
        console.log(`📄 Loading saved report for ${selectedProperty} - ${selectedPeriod}`);
        setReportHTML(savedReport);
      } else {
        console.log(`📝 No saved report for ${selectedProperty} - ${selectedPeriod}`);
        setReportHTML('<html><body style="margin:0;padding:40px;font-family:sans-serif;text-align:center;color:#666;"><h2 style="color:#f97316;">Business Report</h2><p>Select owner and period, then click <strong>Generate Report</strong>.</p></body></html>');
      }
    }
  }, [activeSection, selectedProperty, selectedPeriod]);

  // Real data from Supabase (with fallback from INFORME_SUPABASE_IZUMI_HOTEL)
  const [todayMetrics, setTodayMetrics] = useState({
    newInquiries: 8,
    pendingPayments: 2,
    confirmedBookings: 3,
    checkInsToday: 1,
    expiredHolds: 0
  });

  // Real counts from Supabase
  const [realCounts, setRealCounts] = useState({
    totalClients: 0,
    totalLeads: 0,
    totalBookings: 0,
    totalPayments: 0,
    countries: 0,
    repeatGuests: 0,
    totalRevenue: 0,
    averageBookingValue: 0,
    totalNights: 0,
    avgOccupancy: 0,
    monthsWithBookings: 0,
    availableNights: 0,
    loading: true
  });

  // All bookings for detailed view
  const [allBookings, setAllBookings] = useState([]);
  const [bookingSearchQuery, setBookingSearchQuery] = useState('');

  // Channel statistics from Supabase
  const [channelStats, setChannelStats] = useState({
    airbnb: { count: 0, revenue: 0 },
    bookingCom: { count: 0, revenue: 0 },
    direct: { count: 0, revenue: 0 },
    other: { count: 0, revenue: 0 }
  });

  // Period selector for Availability & Channels section
  const [selectedChannelPeriod, setSelectedChannelPeriod] = useState('2026');

  // User properties
  const [userProperties, setUserProperties] = useState([]);

  // Leads data
  const [leads, setLeads] = useState([]);
  const [leadsCounts, setLeadsCounts] = useState({
    hot: 0,
    pending: 0,
    engaged: 0,
    won: 0,
    total_value: 0
  });

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'urgent',
      message: 'Payment overdue: Michael Brown Jr ($1,100) - Expires 31 January',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'warning',
      message: 'Hot lead waiting: Emma Chen (Score 85) - Discount request pending',
      time: '4 hours ago'
    }
  ]);

  const [actionsNeedingApproval, setActionsNeedingApproval] = useState([
    {
      id: 'action-001',
      type: 'discount_request',
      title: 'Discount Request - 15% Off',
      guest: 'Emma Chen',
      guestPhone: '+86 138 0013 8888',
      amount: 1960,
      booking: 'BK-2026-001',
      action: 'Guest requests 15% discount for 7-night booking (Feb 10-17). Lead score: 85 (HOT). Booking via WhatsApp direct.',
      status: 'pending',
      priority: 'urgent',
      createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
      details: {
        guest_name: 'Emma Chen',
        guest_phone: '+86 138 0013 8888',
        amount: 1960,
        discount_requested: '15%',
        nights: 7
      }
    },
    {
      id: 'action-002',
      type: 'payment_verification',
      title: 'Payment Verification Required',
      guest: 'Michael Brown Jr',
      guestPhone: '+61 412 345 678',
      amount: 1100,
      booking: 'BK-2025-042',
      action: 'Guest claims payment sent via bank transfer. Payment screenshot received. Hold expires 31 January. Needs owner verification.',
      status: 'pending',
      priority: 'high',
      createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      details: {
        guest_name: 'Michael Brown Jr',
        guest_phone: '+61 412 345 678',
        amount: 1100,
        hold_expires: '2026-01-31'
      }
    },
    {
      id: 'action-003',
      type: 'custom_plan_request',
      title: 'Custom Payment Plan Request',
      guest: 'Thomas Schmidt Jr',
      guestPhone: '+49 151 1234 5678',
      amount: 1200,
      booking: 'BK-2026-003',
      action: 'Guest requests 3-installment payment plan: 40% now, 40% at check-in, 20% after. Booking for March 15-20.',
      status: 'pending',
      priority: 'normal',
      createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
      details: {
        guest_name: 'Thomas Schmidt Jr',
        guest_phone: '+49 151 1234 5678',
        amount: 1200,
        plan_requested: '3 installments (40/40/20)'
      }
    }
  ]);

  const [showDBVisualization, setShowDBVisualization] = useState(false);
  const [dbQueryLog, setDbQueryLog] = useState([]);
  const [monthlyMetrics, setMonthlyMetrics] = useState({
    november: { bookings: 12, revenue: 11220 },
    december: { bookings: 18, revenue: 23100 },
    january: { bookings: 15, revenue: 15820 }
  });

  // Weekly metrics (fallback data from INFORME_SUPABASE_IZUMI_HOTEL)
  const [weeklyMetrics, setWeeklyMetrics] = useState({
    bookingsThisWeek: 4,
    revenueThisWeek: 4570,
    paymentsCollected: 3,
    paymentsAmount: 3420,
    openActions: 5,
    newLeads: 3,
    trend: '+12%' // vs last week
  });

  // Current month data
  const [currentMonthMetrics, setCurrentMonthMetrics] = useState({
    bookings: 15,
    revenue: 15820,
    occupancy: 72,
    cancellations: 1,
    avgNightlyRate: 226,
    directBookings: 5,
    otaBookings: 10
  });

  const SUPABASE_URL = 'https://jjpscimtxrudtepzwhag.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0';

  // DYNAMIC TENANT ID - Use logged in user's ID
  const TENANT_ID = userData?.id || 'c24393db-d318-4d75-8bbf-0fa240b9c1db'; // Fallback to Jose for backwards compatibility
  const PROPERTY_ID = '18711359-1378-4d12-9ea6-fb31c0b1bac2'; // TODO: Make this dynamic too

  // AUTOPILOT MENU - 10 Sections
  const menuSections = [
    {
      id: 'all-data',
      name: 'All Information',
      icon: BarChart3,
      description: 'Properties, Clients, Leads, Bookings, Payments',
      badge: null
    },
    {
      id: 'data-entry',
      name: 'Manual Data Entry',
      icon: ClipboardList,
      description: 'Add Leads, Bookings, Payments, Tasks',
      badge: null
    },
    {
      id: 'business-reports',
      name: 'Business Reports',
      icon: FileText,
      description: 'Monthly performance reports',
      badge: null
    },
    {
      id: 'website',
      name: 'My Villa Website',
      icon: Globe,
      description: 'Public landing page',
      badge: 'Live'
    },
    {
      id: 'availability',
      name: 'Availability & Channels',
      icon: Wifi,
      description: 'Channel status, calendar view',
      badge: '4 sources'
    },
    {
      id: 'decisions',
      name: 'Owner Decisions',
      icon: ClipboardCheck,
      description: 'Needs approval',
      badge: '3'
    },
    {
      id: 'communication',
      name: 'Guest Communication',
      icon: Mail,
      description: 'Unified inbox',
      badge: '8 new'
    },
    {
      id: 'tasks',
      name: 'Maintenance & Tasks',
      icon: Wrench,
      description: 'Operations',
      badge: '5 open'
    }
  ];

  // Load real counts from Supabase
  const loadRealCounts = async (period = 'all_time') => {
    if (!TENANT_ID) return;

    try {
      // Get date range for filtering
      let dateFilter = null;
      if (period !== 'all_time') {
        dateFilter = getDateRange(period);
      }

      // Load villas (properties) - First we need to get unique property_ids from bookings
      // We'll load properties after we have the bookings data
      let properties = [];

      // Load leads
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .eq('tenant_id', TENANT_ID);

      if (leadsError) {
        console.error('Error loading leads:', leadsError);
      } else {
        setLeads(leadsData || []);

        // Calculate leads counts by state (not status)
        const counts = {
          hot: 0,
          pending: 0,
          engaged: 0,
          won: 0,
          total_value: 0
        };

        (leadsData || []).forEach(lead => {
          const state = (lead.state || '').toLowerCase();
          if (state === 'hot') counts.hot++;
          else if (state === 'pending') counts.pending++;
          else if (state === 'engaged') counts.engaged++;
          else if (state === 'won' || state === 'converted') counts.won++;

          // No estimated_value field exists, use 0 for now
          counts.total_value += 0;
        });

        setLeadsCounts(counts);
      }

      // Load full booking details for the table (with optional date filter)
      let bookingsQuery = supabase
        .from('bookings')
        .select('*')
        .eq('tenant_id', TENANT_ID);

      // Apply date filter if period is not 'all_time'
      if (dateFilter) {
        bookingsQuery = bookingsQuery
          .gte('check_in', dateFilter.startDate)
          .lte('check_in', dateFilter.endDate);
      }

      const { data: bookings, error } = await bookingsQuery.order('check_in', { ascending: false });

      if (error) {
        console.error('Error loading bookings:', error);
        setRealCounts(prev => ({ ...prev, loading: false }));
        return;
      }

      setAllBookings(bookings || []);

      // Load villas (properties) based on unique property_ids from bookings
      const propertyIds = [...new Set((bookings || []).map(b => b.property_id).filter(Boolean))];

      if (propertyIds.length > 0) {
        const { data: villas, error: villasError } = await supabase
          .from('villas')
          .select('*')
          .in('property_id', propertyIds);

        if (villasError) {
          console.error('Error loading villas:', villasError);
        } else {
          // Map villas to properties format with available fields
          properties = (villas || []).map(villa => ({
            id: villa.id,
            name: villa.name,
            location: villa.location || 'Ubud, Bali', // Fallback to default
            property_type: villa.property_type || `${villa.bedrooms || 'N/A'} Bedroom Villa`, // Use bedrooms if no type
            address: villa.address || 'Bali, Indonesia',
            bedrooms: villa.bedrooms,
            bathrooms: villa.bathrooms,
            description: villa.description
          }));
          setUserProperties(properties);
        }
      }

      // Calculate unique countries (excluding null/empty)
      const uniqueCountries = new Set();
      (bookings || []).forEach(booking => {
        const country = booking.guest_country;
        // Ignore null, 'null' string, empty string, and undefined
        if (country && country.trim() !== '' && country.toLowerCase() !== 'null') {
          uniqueCountries.add(country);
        }
      });

      // Calculate repeat guests (guests with more than 1 booking)
      const guestBookingCount = {};
      (bookings || []).forEach(booking => {
        const guestEmail = booking.guest_email;
        if (guestEmail) {
          guestBookingCount[guestEmail] = (guestBookingCount[guestEmail] || 0) + 1;
        }
      });
      const repeatGuests = Object.values(guestBookingCount).filter(count => count > 1).length;

      // Calculate revenue metrics
      const totalRevenue = (bookings || []).reduce((sum, b) => sum + (b.total_price || 0), 0);
      const averageBookingValue = bookings?.length > 0 ? totalRevenue / bookings.length : 0;

      // Calculate total nights and occupancy
      const totalNights = (bookings || []).reduce((sum, b) => {
        if (b.check_in && b.check_out) {
          const nights = Math.ceil((new Date(b.check_out) - new Date(b.check_in)) / (1000 * 60 * 60 * 24));
          return sum + (nights > 0 ? nights : 0);
        }
        return sum;
      }, 0);

      // Calculate occupancy rate based on months with bookings
      // Formula: (total nights booked / (months with bookings * 31 days)) * 100
      const monthsWithBookings = new Set();
      (bookings || []).forEach(booking => {
        if (booking.check_in) {
          const date = new Date(booking.check_in);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          monthsWithBookings.add(monthKey);
        }
      });
      const totalMonths = monthsWithBookings.size || 1; // At least 1 to avoid division by 0
      const totalAvailableNights = totalMonths * 31; // 31 days average per month
      const avgOccupancy = totalAvailableNights > 0 ? (totalNights / totalAvailableNights) * 100 : 0;

      setRealCounts({
        totalClients: bookings?.length || 0,
        totalLeads: (leadsData || []).length,
        totalBookings: bookings?.length || 0,
        totalPayments: 0, // TODO: Add payments count
        countries: uniqueCountries.size,
        repeatGuests: repeatGuests,
        totalRevenue: totalRevenue,
        averageBookingValue: averageBookingValue,
        totalNights: totalNights,
        avgOccupancy: avgOccupancy,
        monthsWithBookings: totalMonths,
        availableNights: totalAvailableNights,
        loading: false
      });
    } catch (error) {
      console.error('Error loading real counts:', error);
      setRealCounts(prev => ({ ...prev, loading: false }));
    }
  };

  // Load channel statistics with better classification
  const loadChannelStats = async (period = '2026') => {
    if (!TENANT_ID) return;

    try {
      // Get date range for filtering
      let dateFilter = null;
      if (period !== 'all_time') {
        dateFilter = getDateRange(period);
      }

      // Load bookings with optional date filter
      let bookingsQuery = supabase
        .from('bookings')
        .select('*')
        .eq('tenant_id', TENANT_ID);

      if (dateFilter) {
        bookingsQuery = bookingsQuery
          .gte('check_in', dateFilter.startDate)
          .lte('check_in', dateFilter.endDate);
      }

      const { data: bookings, error: bookingsError } = await bookingsQuery;

      if (bookingsError) {
        console.error('Error loading bookings for channels:', bookingsError);
        return;
      }

      // Calculate channel statistics with better source classification
      const channelData = {
        airbnb: { count: 0, revenue: 0 },
        bookingCom: { count: 0, revenue: 0 },
        direct: { count: 0, revenue: 0 },
        other: { count: 0, revenue: 0 }
      };

      (bookings || []).forEach(booking => {
        const source = (booking.source || '').toLowerCase().trim();
        const price = booking.total_price || 0;

        // Better channel classification - recognize variations
        if (source === 'airbnb' || source === 'air bnb') {
          channelData.airbnb.count++;
          channelData.airbnb.revenue += price;
        } else if (source === 'booking.com') {
          channelData.bookingCom.count++;
          channelData.bookingCom.revenue += price;
        } else if (source === 'gita') {
          channelData.direct.count++;
          channelData.direct.revenue += price;
        } else {
          // Count all other sources (Bali Buntu, Ibu Santi, Domus, Instagram, etc.)
          channelData.other.count++;
          channelData.other.revenue += price;
        }
      });

      setChannelStats(channelData);
    } catch (error) {
      console.error('Error loading channel stats:', error);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadRealCounts(selectedAllInfoPeriod);
    loadChannelStats(selectedChannelPeriod);
    fetchTodayMetrics();
    fetchAlerts();
    fetchActions();
    fetchMonthlyMetrics();
  }, [TENANT_ID]);

  // Reload data when All Information period changes
  useEffect(() => {
    if (activeSection === 'all-data') {
      console.log('Reloading data for period:', selectedAllInfoPeriod);
      loadRealCounts(selectedAllInfoPeriod);
    }
  }, [selectedAllInfoPeriod, activeSection]);

  // Reload channel stats when Availability period changes OR when entering availability section
  useEffect(() => {
    console.log('Reloading channel stats for period:', selectedChannelPeriod);
    loadChannelStats(selectedChannelPeriod);
  }, [selectedChannelPeriod]);

  // Helper functions
  const formatCurrency = (amount) => {
    // Detect if amount is in Rupias (IDR) or USD
    // Generally: if >= 100,000 it's likely Rupias, otherwise USD
    if (amount >= 100000) {
      // Format as Rupias
      return `Rp ${Math.round(amount).toLocaleString('id-ID')}`;
    } else {
      // Format as USD
      return `$${Math.round(amount).toLocaleString('en-US')}`;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const minutes = Math.floor((new Date() - new Date(timestamp)) / 60000);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  const getPeriodLabel = (period) => {
    const labels = {
      'all_time': 'All Time',
      'this_month': 'This Month',
      'last_month': 'Last Month',
      'this_quarter': 'This Quarter',
      'last_quarter': 'Last Quarter',
      'this_year': 'This Year (2026)',
      'last_year': 'Last Year (2025)'
    };
    return labels[period] || 'All Time';
  };

  // Calculate date range based on selected period
  const getDateRange = (period) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    switch (period) {
      case 'this_month': {
        const start = new Date(currentYear, currentMonth, 1);
        const end = new Date(currentYear, currentMonth + 1, 0);
        return {
          startDate: start.toISOString().split('T')[0],
          endDate: end.toISOString().split('T')[0]
        };
      }
      case 'last_month': {
        const start = new Date(currentYear, currentMonth - 1, 1);
        const end = new Date(currentYear, currentMonth, 0);
        return {
          startDate: start.toISOString().split('T')[0],
          endDate: end.toISOString().split('T')[0]
        };
      }
      case 'this_quarter': {
        const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
        const start = new Date(currentYear, quarterStartMonth, 1);
        const end = new Date(currentYear, quarterStartMonth + 3, 0);
        return {
          startDate: start.toISOString().split('T')[0],
          endDate: end.toISOString().split('T')[0]
        };
      }
      case 'last_quarter': {
        const quarterStartMonth = Math.floor(currentMonth / 3) * 3 - 3;
        const start = new Date(currentYear, quarterStartMonth, 1);
        const end = new Date(currentYear, quarterStartMonth + 3, 0);
        return {
          startDate: start.toISOString().split('T')[0],
          endDate: end.toISOString().split('T')[0]
        };
      }
      case 'this_year': {
        return {
          startDate: `${currentYear}-01-01`,
          endDate: `${currentYear}-12-31`
        };
      }
      case 'last_year': {
        return {
          startDate: `${currentYear - 1}-01-01`,
          endDate: `${currentYear - 1}-12-31`
        };
      }
      case '2026': {
        return {
          startDate: '2026-01-01',
          endDate: '2026-12-31'
        };
      }
      case '2025': {
        return {
          startDate: '2025-01-01',
          endDate: '2025-12-31'
        };
      }
      case 'q1_2026': {
        return {
          startDate: '2026-01-01',
          endDate: '2026-03-31'
        };
      }
      case 'q2_2026': {
        return {
          startDate: '2026-04-01',
          endDate: '2026-06-30'
        };
      }
      case 'q3_2026': {
        return {
          startDate: '2026-07-01',
          endDate: '2026-09-30'
        };
      }
      case 'q4_2026': {
        return {
          startDate: '2026-10-01',
          endDate: '2026-12-31'
        };
      }
      default:
        return {
          startDate: `${currentYear}-01-01`,
          endDate: `${currentYear}-12-31`
        };
    }
  };

  const logDbQuery = (query, result) => {
    const logEntry = {
      timestamp: new Date().toLocaleTimeString(),
      query,
      result: JSON.stringify(result, null, 2).substring(0, 200) + '...'
    };
    setDbQueryLog(prev => [logEntry, ...prev].slice(0, 10));
  };

  const handlePrintReport = (reportType) => {
    const printWindow = window.open('', '', 'width=800,height=600');
    const today = new Date().toLocaleDateString();

    let content = '';

    if (reportType === 'daily') {
      content = `
        <html>
          <head>
            <title>Daily Report - ${today}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #FF8C42; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              th { background-color: #FF8C42; color: white; }
            </style>
          </head>
          <body>
            <h1>MY HOST BizMate - Daily Report</h1>
            <p><strong>Date:</strong> ${today}</p>
            <p><strong>Property:</strong> Izumi Hotel & Villas</p>
            <h2>Today's Metrics</h2>
            <table>
              <tr><th>Metric</th><th>Value</th></tr>
              <tr><td>New Inquiries</td><td>${todayMetrics.newInquiries}</td></tr>
              <tr><td>Pending Payments</td><td>${todayMetrics.pendingPayments}</td></tr>
              <tr><td>Confirmed Bookings</td><td>${todayMetrics.confirmedBookings}</td></tr>
              <tr><td>Check-ins Today</td><td>${todayMetrics.checkInsToday}</td></tr>
              <tr><td>Expired Holds</td><td>${todayMetrics.expiredHolds}</td></tr>
            </table>
            <h2>3-Month Performance</h2>
            <table>
              <tr><th>Month</th><th>Bookings</th><th>Revenue</th></tr>
              <tr><td>November 2025</td><td>${monthlyMetrics.november.bookings}</td><td>$${monthlyMetrics.november.revenue.toLocaleString()}</td></tr>
              <tr><td>December 2025</td><td>${monthlyMetrics.december.bookings}</td><td>$${monthlyMetrics.december.revenue.toLocaleString()}</td></tr>
              <tr><td>January 2026</td><td>${monthlyMetrics.january.bookings}</td><td>$${monthlyMetrics.january.revenue.toLocaleString()}</td></tr>
            </table>
          </body>
        </html>
      `;
    } else if (reportType === 'weekly') {
      content = `
        <html>
          <head>
            <title>Weekly Report - ${today}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #FF8C42; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              th { background-color: #FF8C42; color: white; }
            </style>
          </head>
          <body>
            <h1>MY HOST BizMate - Weekly Report</h1>
            <p><strong>Date:</strong> ${today}</p>
            <p><strong>Property:</strong> Izumi Hotel & Villas</p>
            <h2>This Week's Performance</h2>
            <table>
              <tr><th>Metric</th><th>Value</th></tr>
              <tr><td>Bookings This Week</td><td>${weeklyMetrics.bookingsThisWeek}</td></tr>
              <tr><td>Revenue This Week</td><td>$${weeklyMetrics.revenueThisWeek.toLocaleString()}</td></tr>
              <tr><td>Payments Collected</td><td>${weeklyMetrics.paymentsCollected} ($${weeklyMetrics.paymentsAmount.toLocaleString()})</td></tr>
              <tr><td>Open Actions</td><td>${weeklyMetrics.openActions}</td></tr>
              <tr><td>New Leads</td><td>${weeklyMetrics.newLeads}</td></tr>
              <tr><td>Trend vs Last Week</td><td>${weeklyMetrics.trend}</td></tr>
            </table>
          </body>
        </html>
      `;
    } else if (reportType === 'monthly') {
      content = `
        <html>
          <head>
            <title>Monthly Report - ${today}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #FF8C42; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              th { background-color: #FF8C42; color: white; }
            </style>
          </head>
          <body>
            <h1>MY HOST BizMate - Monthly Report</h1>
            <p><strong>Date:</strong> ${today}</p>
            <p><strong>Property:</strong> Izumi Hotel & Villas</p>
            <h2>This Month's Performance (January 2026)</h2>
            <table>
              <tr><th>Metric</th><th>Value</th></tr>
              <tr><td>Total Bookings</td><td>${currentMonthMetrics.bookings}</td></tr>
              <tr><td>Total Revenue</td><td>$${currentMonthMetrics.revenue.toLocaleString()}</td></tr>
              <tr><td>Occupancy Rate</td><td>${currentMonthMetrics.occupancy}%</td></tr>
              <tr><td>Avg Nightly Rate</td><td>$${currentMonthMetrics.avgNightlyRate}</td></tr>
              <tr><td>Direct Bookings</td><td>${currentMonthMetrics.directBookings}</td></tr>
              <tr><td>OTA Bookings</td><td>${currentMonthMetrics.otaBookings}</td></tr>
              <tr><td>Cancellations</td><td>${currentMonthMetrics.cancellations}</td></tr>
            </table>
          </body>
        </html>
      `;
    }

    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  // Fetch functions
  const fetchMonthlyMetrics = async () => {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/bookings?tenant_id=eq.${TENANT_ID}&property_id=eq.${PROPERTY_ID}&select=check_in,total_amount,status`,
        {
          headers: { 'apikey': SUPABASE_KEY }
        }
      );

      if (response.ok) {
        const bookings = await response.json();
        const monthlyData = {
          november: { bookings: 0, revenue: 0 },
          december: { bookings: 0, revenue: 0 },
          january: { bookings: 0, revenue: 0 }
        };

        bookings.forEach(booking => {
          const month = new Date(booking.check_in).getMonth();
          const year = new Date(booking.check_in).getFullYear();

          if (year === 2025 && month === 10) {
            monthlyData.november.bookings++;
            monthlyData.november.revenue += parseFloat(booking.total_amount || 0);
          } else if (year === 2025 && month === 11) {
            monthlyData.december.bookings++;
            monthlyData.december.revenue += parseFloat(booking.total_amount || 0);
          } else if (year === 2026 && month === 0) {
            monthlyData.january.bookings++;
            monthlyData.january.revenue += parseFloat(booking.total_amount || 0);
          }
        });

        setMonthlyMetrics(monthlyData);
        logDbQuery('SELECT FROM bookings (monthly metrics)', monthlyData);
      }
    } catch (error) {
      console.error('Error fetching monthly metrics:', error);
    }
  };

  const fetchTodayMetrics = async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_daily_summary`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ p_tenant_id: TENANT_ID })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📊 get_daily_summary response:', data);

        // Map the fields correctly from Supabase function response
        // Function returns: bookings_today, check_ins_today, check_outs_today, revenue_today, alerts_active, payments_pending
        setTodayMetrics({
          newInquiries: 0, // TODO: Add leads_today to function
          pendingPayments: data.payments_pending || 0,
          confirmedBookings: data.bookings_today || 0,
          checkInsToday: data.check_ins_today || 0,
          expiredHolds: 0 // TODO: Add to function if needed
        });

        console.log('✅ Metrics updated:', {
          bookings: data.bookings_today,
          checkIns: data.check_ins_today,
          payments: data.payments_pending
        });
      }
    } catch (error) {
      console.error('❌ Error fetching metrics:', error);
      // On error, keep fallback values
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/autopilot_alerts?tenant_id=eq.${TENANT_ID}&status=eq.active&order=created_at.desc&limit=10`,
        {
          headers: { 'apikey': SUPABASE_KEY }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAlerts(data.map(alert => ({
          id: alert.id,
          type: alert.alert_type,
          message: alert.message,
          time: formatTimeAgo(alert.created_at)
        })));
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const fetchActions = async () => {
    try {
      logDbQuery('SELECT * FROM autopilot_actions WHERE status=pending', { querying: true });

      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/autopilot_actions?tenant_id=eq.${TENANT_ID}&status=eq.pending&select=*&order=priority.desc,created_at.desc`,
        {
          headers: { 'apikey': SUPABASE_KEY }
        }
      );

      if (response.ok) {
        const data = await response.json();

        const mappedActions = data.map(action => ({
          id: action.id,
          type: action.action_type,
          title: action.title || action.action_type.replace(/_/g, ' '),
          guest: action.details?.guest_name || 'Unknown Guest',
          guestPhone: action.details?.guest_phone || '',
          amount: action.details?.amount || 0,
          booking: action.details?.booking_reference || 'N/A',
          action: action.description,
          status: action.status,
          priority: action.priority,
          createdAt: action.created_at,
          details: action.details
        }));

        setActionsNeedingApproval(mappedActions);
        logDbQuery(`Found ${data.length} pending actions`, mappedActions);
      }
    } catch (error) {
      console.error('Error fetching actions:', error);
      logDbQuery('ERROR fetching actions', { error: error.message });
    }
  };

  const handleApprove = async (actionId) => {
    try {
      const webhookBody = {
        action: 'approve',
        action_id: actionId,
        user_id: 'jose@zentaraliving.com'
      };

      logDbQuery('POST /webhook/autopilot/action (APPROVE)', webhookBody);

      const response = await fetch('https://n8n-production-bb2d.up.railway.app/webhook/autopilot/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookBody)
      });

      if (response.ok) {
        const result = await response.json();
        logDbQuery('Webhook response (APPROVE)', result);
        alert('✅ Action approved successfully! WhatsApp message sent to guest.');

        setTimeout(() => {
          fetchActions();
          logDbQuery('Refreshing actions list after approve', { actionId });
        }, 1000);
      } else {
        alert('❌ Error approving action. Please try again.');
        logDbQuery('Webhook ERROR', { status: response.status });
      }
    } catch (error) {
      console.error('Error approving action:', error);
      alert('❌ Error connecting to server. Please try again.');
      logDbQuery('Exception in approve', { error: error.message });
    }
  };

  const handleReject = async (actionId) => {
    try {
      const webhookBody = {
        action: 'reject',
        action_id: actionId,
        user_id: 'jose@zentaraliving.com'
      };

      logDbQuery('POST /webhook/autopilot/action (REJECT)', webhookBody);

      const response = await fetch('https://n8n-production-bb2d.up.railway.app/webhook/autopilot/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookBody)
      });

      if (response.ok) {
        const result = await response.json();
        logDbQuery('Webhook response (REJECT)', result);
        alert('✅ Action rejected successfully! Guest notified.');

        setTimeout(() => {
          fetchActions();
          logDbQuery('Refreshing actions list after reject', { actionId });
        }, 1000);
      } else {
        alert('❌ Error rejecting action. Please try again.');
        logDbQuery('Webhook ERROR', { status: response.status });
      }
    } catch (error) {
      console.error('Error rejecting action:', error);
      alert('❌ Error connecting to server. Please try again.');
      logDbQuery('Exception in reject', { error: error.message });
    }
  };

  const handleGenerateDailySummary = async () => {
    // Open new window with complete data listing
    const printWindow = window.open('', '', 'width=1200,height=800');
    const today = new Date().toLocaleDateString();

    // Build properties HTML
    let propertiesHTML = '';
    if (userProperties.length > 0) {
      userProperties.forEach(property => {
        propertiesHTML += `
            <div class="summary-box">
              <strong>${property.name}</strong><br>
              Location: ${property.location || 'Not specified'}<br>
              Type: ${property.property_type || 'Not specified'}<br>
              Status: Active
            </div>`;
      });
    } else {
      propertiesHTML = '<div class="summary-box">No properties found</div>';
    }

    // Build clients table HTML - SHOW ALL BOOKINGS
    let clientsTableHTML = '';
    allBookings.forEach(booking => {
      const price = booking.total_price || 0;
      const formattedPrice = price >= 1000000
        ? `Rp ${Math.round(price).toLocaleString('id-ID')}`
        : `$${Math.round(price).toLocaleString('en-US')}`;
      const checkIn = booking.check_in ? new Date(booking.check_in).toLocaleDateString() : 'N/A';
      clientsTableHTML += `<tr><td>${booking.guest_name || 'N/A'}</td><td>${booking.guest_country || 'N/A'}</td><td>${checkIn}</td><td>${formattedPrice}</td></tr>`;
    });

    // Build leads table HTML
    let leadsHTML = '';
    if (leads.length > 0) {
      let leadsTableHTML = '';
      leads.slice(0, 10).forEach(lead => {
        const statusEmoji = {
          'hot': '🔥',
          'pending': '⏳',
          'engaged': '📧',
          'won': '✅',
          'lost': '❌'
        };
        const status = (lead.status || '').toLowerCase();
        const emoji = statusEmoji[status] || '📋';
        const value = lead.estimated_value || 0;
        leadsTableHTML += `<tr><td>${lead.name || 'N/A'}</td><td>${emoji} ${(lead.status || 'N/A').toUpperCase()}</td><td>${lead.source || 'N/A'}</td><td>$${value.toLocaleString('en-US')}</td></tr>`;
      });
      if (leads.length > 10) {
        leadsTableHTML += `<tr><td colspan="4" style="text-align: center; color: #999;">... ${leads.length - 10} more leads</td></tr>`;
      }
      leadsHTML = `
            <table>
              <tr>
                <th>Lead</th>
                <th>Status</th>
                <th>Source</th>
                <th>Estimated Value</th>
              </tr>
              ${leadsTableHTML}
            </table>
            <div class="summary-box">
              HOT: ${leadsCounts.hot} | PENDING: ${leadsCounts.pending} | ENGAGED: ${leadsCounts.engaged} | WON: ${leadsCounts.won}<br>
              Total Pipeline Value: $${leadsCounts.total_value.toLocaleString('en-US')}
            </div>`;
    } else {
      leadsHTML = '<div class="summary-box" style="text-align: center; color: #666;">No leads data available for this period</div>';
    }

    // Build bookings table HTML - SHOW ALL BOOKINGS
    let bookingsTableHTML = '';
    allBookings.forEach(booking => {
      const checkIn = booking.check_in ? new Date(booking.check_in).toLocaleDateString() : 'N/A';
      const checkOut = booking.check_out ? new Date(booking.check_out).toLocaleDateString() : 'N/A';
      const nights = booking.check_in && booking.check_out
        ? Math.ceil((new Date(booking.check_out) - new Date(booking.check_in)) / (1000 * 60 * 60 * 24))
        : 0;
      const price = booking.total_price || 0;
      const formattedPrice = price >= 1000000
        ? `Rp ${Math.round(price).toLocaleString('id-ID')}`
        : `$${Math.round(price).toLocaleString('en-US')}`;
      bookingsTableHTML += `<tr><td>${booking.guest_name || 'N/A'}</td><td>${checkIn}</td><td>${checkOut}</td><td>${nights}</td><td>${formattedPrice}</td></tr>`;
    });
    const totalRevenueFormatted = realCounts.totalRevenue >= 1000000
      ? `Rp ${Math.round(realCounts.totalRevenue).toLocaleString('id-ID')}`
      : `$${Math.round(realCounts.totalRevenue).toLocaleString('en-US')}`;
    bookingsTableHTML += `<tr style="font-weight: bold;">
                <td>TOTAL</td>
                <td colspan="2">${realCounts.totalBookings} bookings</td>
                <td>${realCounts.totalNights} nights</td>
                <td>${totalRevenueFormatted}</td>
              </tr>`;

    // Build countries table HTML
    const countryStats = {};
    allBookings.forEach(booking => {
      const country = booking.guest_country || 'Unknown';
      if (!countryStats[country]) {
        countryStats[country] = { count: 0, revenue: 0 };
      }
      countryStats[country].count++;
      countryStats[country].revenue += booking.total_price || 0;
    });
    let countriesTableHTML = '';
    Object.entries(countryStats)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 10)
      .forEach(([country, stats]) => {
        const formattedRevenue = stats.revenue >= 1000000
          ? `Rp ${Math.round(stats.revenue).toLocaleString('id-ID')}`
          : `$${Math.round(stats.revenue).toLocaleString('en-US')}`;
        countriesTableHTML += `<tr><td>${country}</td><td>${stats.count}</td><td>${formattedRevenue}</td></tr>`;
      });

    // Build payments stats
    const paymentStats = {
      paid: { count: 0, amount: 0 },
      pending: { count: 0, amount: 0 },
      overdue: { count: 0, amount: 0 }
    };
    allBookings.forEach(booking => {
      const status = (booking.payment_status || 'pending').toLowerCase();
      if (status === 'paid' || status === 'completed') {
        paymentStats.paid.count++;
        paymentStats.paid.amount += booking.total_price || 0;
      } else if (status === 'pending') {
        paymentStats.pending.count++;
        paymentStats.pending.amount += booking.total_price || 0;
      } else {
        paymentStats.overdue.count++;
        paymentStats.overdue.amount += booking.total_price || 0;
      }
    });
    const totalAmount = paymentStats.paid.amount + paymentStats.pending.amount + paymentStats.overdue.amount;
    const formatAmount = (amount) => amount >= 1000000
      ? `Rp ${Math.round(amount).toLocaleString('id-ID')}`
      : `$${Math.round(amount).toLocaleString('en-US')}`;
    const paidPercent = totalAmount > 0 ? ((paymentStats.paid.amount / totalAmount) * 100).toFixed(1) : 0;
    const pendingPercent = totalAmount > 0 ? ((paymentStats.pending.amount / totalAmount) * 100).toFixed(1) : 0;
    const overduePercent = totalAmount > 0 ? ((paymentStats.overdue.amount / totalAmount) * 100).toFixed(1) : 0;
    const paid = allBookings.filter(b => {
      const status = (b.payment_status || '').toLowerCase();
      return status === 'paid' || status === 'completed';
    }).length;
    const total = allBookings.length;
    const paymentCompletionRate = total > 0 ? ((paid / total) * 100).toFixed(1) : 0;

    const avgBookingValueFormatted = realCounts.averageBookingValue >= 1000000
      ? `Rp ${Math.round(realCounts.averageBookingValue).toLocaleString('id-ID')}`
      : `$${Math.round(realCounts.averageBookingValue).toLocaleString('en-US')}`;

    const content = `
      <html>
        <head>
          <title>Complete Data Summary - ${today}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; background: #f5f5f5; }
            .container { max-width: 1100px; margin: 0 auto; background: white; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #d85a2a; text-align: center; margin-bottom: 10px; }
            h2 { color: #333; border-bottom: 2px solid #d85a2a; padding-bottom: 10px; margin-top: 30px; }
            h3 { color: #666; margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th { background: #d85a2a; color: white; padding: 12px; text-align: left; }
            td { padding: 10px; border-bottom: 1px solid #ddd; }
            tr:hover { background: #f9f9f9; }
            .summary-box { background: #f0f0f0; padding: 15px; margin: 10px 0; border-left: 4px solid #d85a2a; }
            .btn-print { background: #d85a2a; color: white; border: none; padding: 12px 24px; cursor: pointer; margin: 20px 0; font-size: 16px; border-radius: 5px; }
            .btn-print:hover { background: #c04a1a; }
            @media print { .btn-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>MY HOST BizMate - Complete Data Summary</h1>
            <p style="text-align: center; color: #666;">Period: ${getPeriodLabel(selectedAllInfoPeriod)} | Generated: ${today}</p>
            <button class="btn-print" onclick="window.print()">🖨️ Print Report</button>

            <h2>📊 Property Information (${userProperties.length} ${userProperties.length === 1 ? 'Property' : 'Properties'})</h2>
            ${propertiesHTML}

            <h2>👥 Clients Database (${realCounts.totalClients} Total)</h2>
            <table>
              <tr>
                <th>Name</th>
                <th>Country</th>
                <th>Check In</th>
                <th>Total Value</th>
              </tr>
              ${clientsTableHTML}
            </table>
            <div class="summary-box">
              Total Bookings: ${realCounts.totalBookings} | Countries: ${realCounts.countries} | Repeat Guests: ${realCounts.repeatGuests}
            </div>

            <h2>🏨 Bookings Summary (${getPeriodLabel(selectedAllInfoPeriod)})</h2>
            <h3>All Bookings</h3>
            <table>
              <tr>
                <th>Guest</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Nights</th>
                <th>Revenue</th>
              </tr>
              ${bookingsTableHTML}
            </table>

            <h3>Top Countries</h3>
            <table>
              <tr>
                <th>Country</th>
                <th>Bookings</th>
                <th>Revenue</th>
              </tr>
              ${countriesTableHTML}
            </table>

            <h2>💳 Payments Summary</h2>
            <table>
              <tr>
                <th>Status</th>
                <th>Count</th>
                <th>Amount</th>
                <th>%</th>
              </tr>
              <tr style="background: #d4edda;"><td>Paid</td><td>${paymentStats.paid.count}</td><td>${formatAmount(paymentStats.paid.amount)}</td><td>${paidPercent}%</td></tr>
              <tr style="background: #fff3cd;"><td>Pending</td><td>${paymentStats.pending.count}</td><td>${formatAmount(paymentStats.pending.amount)}</td><td>${pendingPercent}%</td></tr>
              <tr style="background: #f8d7da;"><td>Overdue</td><td>${paymentStats.overdue.count}</td><td>${formatAmount(paymentStats.overdue.amount)}</td><td>${overduePercent}%</td></tr>
            </table>
            <div class="summary-box">
              Payment Completion Rate: ${paymentCompletionRate}%
            </div>

            <h2>📋 Key Metrics Summary</h2>
            <div class="summary-box">
              <strong>${getPeriodLabel(selectedAllInfoPeriod)} Performance:</strong><br>
              Total Revenue: ${totalRevenueFormatted}<br>
              Total Bookings: ${realCounts.totalBookings}<br>
              Total Nights: ${realCounts.totalNights}<br>
              Average Booking Value: ${avgBookingValueFormatted}<br>
              <strong>Occupancy Calculation:</strong><br>
              &nbsp;&nbsp;• Months with bookings: ${realCounts.monthsWithBookings}<br>
              &nbsp;&nbsp;• Available nights: ${realCounts.availableNights} (${realCounts.monthsWithBookings} months × 31 days)<br>
              &nbsp;&nbsp;• Booked nights: ${realCounts.totalNights}<br>
              &nbsp;&nbsp;• Occupancy Rate: ${Math.round(realCounts.avgOccupancy * 10) / 10}%<br>
              Payment Completion: ${paymentCompletionRate}%<br>
              Properties: ${userProperties.length}<br>
              Countries Represented: ${realCounts.countries}<br>
              Repeat Guests: ${realCounts.repeatGuests}
            </div>

            <button class="btn-print" onclick="window.print()">🖨️ Print Report</button>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
  };

  // Render functions for each section
  const handleGenerateCustomReport = () => {
      const printWindow = window.open('', '', 'width=900,height=700');
      const today = new Date().toLocaleDateString();

      let content = `
        <html>
          <head>
            <title>${selectedReportType === 'all' ? 'Complete' : selectedReportType.toUpperCase()} Report - ${today}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 30px; }
              h1 { color: #FF8C42; border-bottom: 3px solid #FF8C42; padding-bottom: 10px; }
              h2 { color: #333; margin-top: 30px; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              th { background-color: #FF8C42; color: white; font-weight: bold; }
              tr:nth-child(even) { background-color: #f9f9f9; }
              .section { margin-bottom: 40px; }
              .summary-box { background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <h1>MY HOST BizMate - ${selectedReportType === 'all' ? 'Complete Business' : selectedReportType.toUpperCase()} Report</h1>
            <div class="summary-box">
              <p><strong>Report Date:</strong> ${today}</p>
              <p><strong>Property:</strong> Izumi Hotel & Villas</p>
              <p><strong>Report Type:</strong> ${selectedReportType === 'all' ? 'All Data' : selectedReportType}</p>
            </div>
      `;

      if (selectedReportType === 'all' || selectedReportType === 'properties') {
        content += `
          <div class="section">
            <h2>Properties</h2>
            <table>
              <tr><th>Property</th><th>Type</th><th>Units</th><th>Location</th></tr>
              <tr><td>Izumi Hotel & Villas</td><td>Villa Resort</td><td>5 units</td><td>Ubud, Bali</td></tr>
            </table>
          </div>
        `;
      }

      if (selectedReportType === 'all' || selectedReportType === 'bookings') {
        content += `
          <div class="section">
            <h2>Bookings (Last 3 Months)</h2>
            <table>
              <tr><th>Guest</th><th>Check-in</th><th>Nights</th><th>Amount</th><th>Status</th></tr>
              <tr><td>Hiroshi Nakamura</td><td>Jan 25, 2026</td><td>7</td><td>$1,540</td><td>Confirmed</td></tr>
              <tr><td>Anna Müller</td><td>Jan 28, 2026</td><td>7</td><td>$1,470</td><td>Confirmed</td></tr>
              <tr><td>Emma Chen</td><td>Feb 10, 2026</td><td>7</td><td>$1,960</td><td>Pending</td></tr>
            </table>
            <p><strong>Total Bookings:</strong> {realCounts.totalBookings} | <strong>Total Revenue:</strong> $50,140</p>
          </div>
        `;
      }

      if (selectedReportType === 'all' || selectedReportType === 'payments') {
        content += `
          <div class="section">
            <h2>Payments Status</h2>
            <table>
              <tr><th>Status</th><th>Count</th><th>Amount</th></tr>
              <tr><td>Paid</td><td>43</td><td>$47,940</td></tr>
              <tr><td>Pending</td><td>2</td><td>$2,200</td></tr>
              <tr><td>Overdue</td><td>0</td><td>$0</td></tr>
            </table>
          </div>
        `;
      }

      if (selectedReportType === 'all' || selectedReportType === 'leads') {
        content += `
          <div class="section">
            <h2>Leads Pipeline</h2>
            <table>
              <tr><th>Lead</th><th>Status</th><th>Score</th><th>Intent</th></tr>
              <tr><td>Emma Chen</td><td>HOT</td><td>85</td><td>Booking</td></tr>
              <tr><td>Thomas Schmidt Jr</td><td>PENDING</td><td>78</td><td>Booking</td></tr>
              <tr><td>Maria Santos Jr</td><td>FOLLOWING_UP</td><td>60</td><td>Price</td></tr>
            </table>
            <p><strong>Total Leads:</strong> 8 | <strong>Hot Leads:</strong> 1 | <strong>Won:</strong> 1</p>
          </div>
        `;
      }

      if (selectedReportType === 'all' || selectedReportType === 'clients') {
        content += `
          <div class="section">
            <h2>Client Database</h2>
            <table>
              <tr><th>Name</th><th>Country</th><th>Bookings</th><th>Lifetime Value</th></tr>
              <tr><td>Hiroshi Nakamura</td><td>Japan</td><td>2</td><td>$3,080</td></tr>
              <tr><td>Anna Müller</td><td>Germany</td><td>1</td><td>$1,470</td></tr>
              <tr><td>Emma Chen</td><td>China</td><td>0</td><td>$0 (pending)</td></tr>
            </table>
            <p><strong>Total Clients:</strong> 19 countries represented</p>
          </div>
        `;
      }

      content += `
          </body>
        </html>
      `;

      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
  };

  const renderDataEntrySection = () => {
    return <ManualDataEntry onBack={() => setActiveSection('menu')} />;
  };

  const renderAllDataSection = () => {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-2xl border-2 border-[#d85a2a]/20">
          {/* Top Row: Back Button + Title */}
          <div className="flex items-center mb-4 gap-3">
            <button
              onClick={() => setActiveSection('menu')}
              className="p-2 bg-[#1f2937]/95 backdrop-blur-sm rounded-xl hover:bg-orange-500 transition-all border border-[#d85a2a]/20"
            >
              <ArrowLeft className="w-5 h-5 text-[#FF8C42]" />
            </button>
            <h3 className="text-xl md:text-2xl font-black text-[#FF8C42] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />
              All Information
            </h3>
          </div>

          {/* Description Text - Full Width */}
          <p className="text-gray-300 text-sm mb-4 px-1">
            <span className="hidden md:inline">View all your business data in one place: Properties, Clients, Leads, Bookings, and Payments.</span>
            <span className="md:hidden">View all your business data: Properties, Clients, Leads, Bookings & Payments.</span>
          </p>

          {/* Period Selector */}
          <div className="mb-4">
            <label className="text-gray-300 text-xs font-semibold uppercase mb-2 block">Filter by Period:</label>
            <select
              value={selectedAllInfoPeriod}
              onChange={(e) => {
                console.log('Period selected:', e.target.value);
                setSelectedAllInfoPeriod(e.target.value);
              }}
              onBlur={(e) => {
                console.log('Period blur:', e.target.value);
                setSelectedAllInfoPeriod(e.target.value);
              }}
              className="w-full md:w-auto bg-[#374151] text-white px-4 py-2 rounded-lg border-2 border-purple-500/30 focus:border-purple-500 focus:outline-none hover:border-purple-500/50 transition-all cursor-pointer"
            >
              <option value="all_time">All Time</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="this_quarter">This Quarter</option>
              <option value="last_quarter">Last Quarter</option>
              <option value="this_year">This Year (2026)</option>
              <option value="last_year">Last Year (2025)</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-3">
            <button
              onClick={() => loadRealCounts(selectedAllInfoPeriod)}
              disabled={isGeneratingSummary}
              className="flex-1 md:flex-initial px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl"
            >
              <Zap className="w-5 h-5" />
              <span className="hidden md:inline">Refresh Data</span>
              <span className="md:hidden">Refresh</span>
            </button>
            <button
              onClick={handleGenerateDailySummary}
              className="flex-1 md:flex-initial px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl"
            >
              <Printer className="w-5 h-5" />
              <span className="hidden md:inline">Print Summary</span>
              <span className="md:hidden">Print</span>
            </button>
          </div>
        </div>

        {/* Properties Overview */}
        <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20">
          <h3 className="text-xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
            <Home className="w-5 h-5" />
            Properties ({userProperties.length})
          </h3>
          {userProperties.length > 0 ? (
            <div className="space-y-3">
              {userProperties.map((property) => (
                <div key={property.id} className="bg-[#2a2f3a] rounded-xl p-5 border-2 border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-bold text-lg">{property.name}</h4>
                      <p className="text-gray-400 text-sm">
                        {property.location || 'Location not set'} • {property.property_type || 'Type not set'}
                      </p>
                    </div>
                    <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">Active</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#2a2f3a] rounded-xl p-5 border-2 border-gray-700 text-center">
              <p className="text-gray-400 text-sm">No properties found</p>
            </div>
          )}
        </div>

        {/* Clients Overview */}
        <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20">
          <h3 className="text-xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Clients Database
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-4 border-2 border-blue-500/30">
              <p className="text-blue-300 text-sm mb-1">Total Clients</p>
              <p className="text-2xl font-black text-white">{realCounts.totalClients}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-4 border-2 border-green-500/30">
              <p className="text-green-300 text-sm mb-1">Countries</p>
              <p className="text-2xl font-black text-white">{realCounts.countries}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-4 border-2 border-purple-500/30">
              <p className="text-purple-300 text-sm mb-1">Repeat Guests</p>
              <p className="text-2xl font-black text-white">{realCounts.repeatGuests}</p>
            </div>
          </div>
        </div>

        {/* Bookings Summary */}
        <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20">
          <h3 className="text-xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Bookings Summary ({getPeriodLabel(selectedAllInfoPeriod)})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-5 border-2 border-blue-500/30">
              <p className="text-blue-300 text-sm mb-2">Total Bookings</p>
              <p className="text-2xl font-black text-white mb-1">{realCounts.totalBookings}</p>
              <p className="text-blue-200 text-xs">{realCounts.totalNights} nights booked</p>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-5 border-2 border-green-500/30">
              <p className="text-green-300 text-sm mb-2">Total Revenue</p>
              <p className="text-xl font-black text-white mb-1">
                {realCounts.totalRevenue >= 1000000
                  ? `Rp ${Math.round(realCounts.totalRevenue).toLocaleString('id-ID')}`
                  : `$${Math.round(realCounts.totalRevenue).toLocaleString('en-US')}`}
              </p>
              <p className="text-green-200 text-xs">
                Avg {realCounts.averageBookingValue >= 1000000
                  ? `Rp ${Math.round(realCounts.averageBookingValue).toLocaleString('id-ID')}`
                  : `$${Math.round(realCounts.averageBookingValue).toLocaleString('en-US')}`}/booking
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-5 border-2 border-purple-500/30">
              <p className="text-purple-300 text-sm mb-2">Avg Occupancy</p>
              <p className="text-2xl font-black text-white mb-1">{Math.round(realCounts.avgOccupancy)}%</p>
              <p className="text-purple-200 text-xs">Across {userProperties.length} {userProperties.length === 1 ? 'property' : 'properties'}</p>
            </div>
          </div>

          {/* Detailed Bookings Table */}
          <div className="mt-6 border-t-2 border-[#d85a2a]/20 pt-6">
            <h4 className="text-lg font-bold text-white mb-4">All Bookings ({allBookings.length})</h4>

            {allBookings.length === 0 ? (
              <div className="text-center text-gray-500 p-8 bg-[#2a2f3a] rounded-xl border-2 border-gray-700">
                No bookings found
              </div>
            ) : (
              <>
                {/* MOBILE VERSION: Cards (< 768px) */}
                <div className="block md:hidden space-y-3">
                  {allBookings.map((booking) => (
                    <div key={booking.id} className="bg-[#2a2f3a] rounded-xl p-4 border-l-4 border-orange-500 shadow-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-white font-bold text-lg">{booking.guest_name || 'N/A'}</h3>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                          booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {booking.status || 'unknown'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-gray-500 text-xs">Check In</p>
                          <p className="text-white text-sm font-medium">
                            {booking.check_in ? new Date(booking.check_in).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            }) : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Check Out</p>
                          <p className="text-white text-sm font-medium">
                            {booking.check_out ? new Date(booking.check_out).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            }) : 'N/A'}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-500 text-xs">Total</p>
                          <p className="text-green-400 text-lg font-bold">
                            ${booking.total_price?.toLocaleString() || '0'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* DESKTOP VERSION: Table (>= 768px) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left text-gray-400 font-semibold p-3">Guest Name</th>
                        <th className="text-left text-gray-400 font-semibold p-3">Check In</th>
                        <th className="text-left text-gray-400 font-semibold p-3">Check Out</th>
                        <th className="text-right text-gray-400 font-semibold p-3">Total</th>
                        <th className="text-center text-gray-400 font-semibold p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allBookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-gray-800 hover:bg-[#2a2f3a] transition-colors">
                          <td className="text-white p-3 font-medium">{booking.guest_name || 'N/A'}</td>
                          <td className="text-gray-300 p-3">
                            {booking.check_in ? new Date(booking.check_in).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            }) : 'N/A'}
                          </td>
                          <td className="text-gray-300 p-3">
                            {booking.check_out ? new Date(booking.check_out).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            }) : 'N/A'}
                          </td>
                          <td className="text-right text-green-400 p-3 font-bold">
                            ${booking.total_price?.toLocaleString() || '0'}
                          </td>
                          <td className="text-center p-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                              booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {booking.status || 'unknown'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Payments Summary */}
        <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20">
          <h3 className="text-xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payments Summary ({getPeriodLabel(selectedAllInfoPeriod)})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-5 border-2 border-green-500/30">
              <p className="text-green-300 text-sm mb-2">Paid</p>
              <p className="text-2xl font-black text-white mb-1">
                {allBookings.filter(b => b.payment_status === 'paid' || b.payment_status === 'completed').length}
              </p>
              <p className="text-green-200 text-sm">
                {realCounts.totalRevenue >= 1000000
                  ? `Rp ${Math.round(allBookings.filter(b => b.payment_status === 'paid' || b.payment_status === 'completed').reduce((sum, b) => sum + (b.total_price || 0), 0)).toLocaleString('id-ID')}`
                  : `$${Math.round(allBookings.filter(b => b.payment_status === 'paid' || b.payment_status === 'completed').reduce((sum, b) => sum + (b.total_price || 0), 0)).toLocaleString('en-US')}`}
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl p-5 border-2 border-yellow-500/30">
              <p className="text-yellow-300 text-sm mb-2">Pending</p>
              <p className="text-2xl font-black text-white mb-1">
                {allBookings.filter(b => b.payment_status === 'pending' || !b.payment_status).length}
              </p>
              <p className="text-yellow-200 text-sm">
                {realCounts.totalRevenue >= 1000000
                  ? `Rp ${Math.round(allBookings.filter(b => b.payment_status === 'pending' || !b.payment_status).reduce((sum, b) => sum + (b.total_price || 0), 0)).toLocaleString('id-ID')}`
                  : `$${Math.round(allBookings.filter(b => b.payment_status === 'pending' || !b.payment_status).reduce((sum, b) => sum + (b.total_price || 0), 0)).toLocaleString('en-US')}`}
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-500/10 to-gray-600/10 rounded-xl p-5 border-2 border-gray-500/30">
              <p className="text-gray-300 text-sm mb-2">Overdue</p>
              <p className="text-2xl font-black text-white mb-1">
                {allBookings.filter(b => b.payment_status === 'overdue').length}
              </p>
              <p className="text-gray-200 text-sm">
                {realCounts.totalRevenue >= 1000000
                  ? `Rp ${Math.round(allBookings.filter(b => b.payment_status === 'overdue').reduce((sum, b) => sum + (b.total_price || 0), 0)).toLocaleString('id-ID')}`
                  : `$${Math.round(allBookings.filter(b => b.payment_status === 'overdue').reduce((sum, b) => sum + (b.total_price || 0), 0)).toLocaleString('en-US')}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSetupSection = () => (
    <div className="space-y-6">
      <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20">
        <h3 className="text-2xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
          <Plus className="w-6 h-6" />
          Manual Data Entry
        </h3>
        <p className="text-gray-300 text-sm mb-6">
          Add information manually to your system. Perfect for migrating existing data or adding offline bookings.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-[#2a2f3a] hover:bg-[#374151] rounded-xl p-6 border-2 border-gray-700 transition-all group">
            <Home className="w-8 h-8 text-blue-400 mb-3 mx-auto group-hover:scale-110 transition-transform" />
            <p className="text-white font-bold mb-1">Add Booking</p>
            <p className="text-gray-400 text-xs">Create reservation manually</p>
          </button>

          <button className="bg-[#2a2f3a] hover:bg-[#374151] rounded-xl p-6 border-2 border-gray-700 transition-all group">
            <CreditCard className="w-8 h-8 text-green-400 mb-3 mx-auto group-hover:scale-110 transition-transform" />
            <p className="text-white font-bold mb-1">Add Payment</p>
            <p className="text-gray-400 text-xs">Record payment received</p>
          </button>

          <button className="bg-[#2a2f3a] hover:bg-[#374151] rounded-xl p-6 border-2 border-gray-700 transition-all group">
            <Users className="w-8 h-8 text-purple-400 mb-3 mx-auto group-hover:scale-110 transition-transform" />
            <p className="text-white font-bold mb-1">Add Lead</p>
            <p className="text-gray-400 text-xs">Create new inquiry</p>
          </button>

          <button className="bg-[#2a2f3a] hover:bg-[#374151] rounded-xl p-6 border-2 border-gray-700 transition-all group">
            <Users className="w-8 h-8 text-orange-400 mb-3 mx-auto group-hover:scale-110 transition-transform" />
            <p className="text-white font-bold mb-1">Add Client</p>
            <p className="text-gray-400 text-xs">Create guest profile</p>
          </button>

          <button className="bg-[#2a2f3a] hover:bg-[#374151] rounded-xl p-6 border-2 border-gray-700 transition-all group">
            <Wrench className="w-8 h-8 text-yellow-400 mb-3 mx-auto group-hover:scale-110 transition-transform" />
            <p className="text-white font-bold mb-1">Add Task</p>
            <p className="text-gray-400 text-xs">Create maintenance task</p>
          </button>

          <button className="bg-[#2a2f3a] hover:bg-[#374151] rounded-xl p-6 border-2 border-gray-700 transition-all group">
            <DollarSign className="w-8 h-8 text-pink-400 mb-3 mx-auto group-hover:scale-110 transition-transform" />
            <p className="text-white font-bold mb-1">Add Expense</p>
            <p className="text-gray-400 text-xs">Record business expense</p>
          </button>
        </div>
      </div>
    </div>
  );

  const renderAvailabilitySection = () => {
    // Calculate total connected channels
    const connectedChannels = [
      channelStats.airbnb.count > 0,
      channelStats.bookingCom.count > 0,
      channelStats.direct.count > 0,
      channelStats.other.count > 0
    ].filter(Boolean).length;

    return (
      <div className="space-y-6">
        <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20">
          <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-3">
            <button
              onClick={() => setActiveSection('menu')}
              className="self-start md:self-auto p-2 bg-[#1f2937]/95 backdrop-blur-sm rounded-xl hover:bg-orange-500 transition-all border border-[#d85a2a]/20"
            >
              <ArrowLeft className="w-5 h-5 text-[#FF8C42]" />
            </button>
            <div className="text-center flex-1">
              <h3 className="text-2xl font-black text-[#FF8C42] flex items-center justify-center gap-2">
                <Wifi className="w-6 h-6" />
                Availability & Channels
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                {connectedChannels} channels connected
              </p>
            </div>
            <div className="w-12 hidden md:block"></div>
          </div>

          {/* Period Selector */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-3 text-center md:text-left">
              📅 Select Period
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
              <button
                onClick={() => setSelectedChannelPeriod('2026')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedChannelPeriod === '2026'
                    ? 'bg-orange-500 text-white'
                    : 'bg-[#2a2f3a] text-gray-300 hover:bg-[#374151]'
                }`}
              >
                2026
              </button>
              <button
                onClick={() => setSelectedChannelPeriod('2025')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedChannelPeriod === '2025'
                    ? 'bg-orange-500 text-white'
                    : 'bg-[#2a2f3a] text-gray-300 hover:bg-[#374151]'
                }`}
              >
                2025
              </button>
              <button
                onClick={() => setSelectedChannelPeriod('q1_2026')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedChannelPeriod === 'q1_2026'
                    ? 'bg-orange-500 text-white'
                    : 'bg-[#2a2f3a] text-gray-300 hover:bg-[#374151]'
                }`}
              >
                Q1 2026
              </button>
              <button
                onClick={() => setSelectedChannelPeriod('q2_2026')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedChannelPeriod === 'q2_2026'
                    ? 'bg-orange-500 text-white'
                    : 'bg-[#2a2f3a] text-gray-300 hover:bg-[#374151]'
                }`}
              >
                Q2 2026
              </button>
              <button
                onClick={() => setSelectedChannelPeriod('q3_2026')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedChannelPeriod === 'q3_2026'
                    ? 'bg-orange-500 text-white'
                    : 'bg-[#2a2f3a] text-gray-300 hover:bg-[#374151]'
                }`}
              >
                Q3 2026
              </button>
              <button
                onClick={() => setSelectedChannelPeriod('q4_2026')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedChannelPeriod === 'q4_2026'
                    ? 'bg-orange-500 text-white'
                    : 'bg-[#2a2f3a] text-gray-300 hover:bg-[#374151]'
                }`}
              >
                Q4 2026
              </button>
              <button
                onClick={() => setSelectedChannelPeriod('all_time')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedChannelPeriod === 'all_time'
                    ? 'bg-orange-500 text-white'
                    : 'bg-[#2a2f3a] text-gray-300 hover:bg-[#374151]'
                }`}
              >
                All Time
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-2 text-center md:text-left">
              Viewing: {getPeriodLabel(selectedChannelPeriod)}
            </p>
          </div>

          {/* Period Summary */}
          <div className="mb-6 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl p-4 md:p-6 border-2 border-orange-500/50">
            <h4 className="text-white font-bold text-base md:text-lg mb-3 md:mb-4 flex items-center gap-2">
              📊 Period Summary - {getPeriodLabel(selectedChannelPeriod)}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div>
                <p className="text-gray-400 text-xs mb-1">Total Bookings</p>
                <p className="text-white text-sm md:text-xl font-bold">
                  {channelStats.airbnb.count + channelStats.bookingCom.count + channelStats.direct.count + channelStats.other.count}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Total Revenue</p>
                <p className="text-white text-sm md:text-xl font-bold break-all">
                  {formatCurrency(
                    channelStats.airbnb.revenue +
                    channelStats.bookingCom.revenue +
                    channelStats.direct.revenue +
                    channelStats.other.revenue
                  )}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Active Channels</p>
                <p className="text-white text-sm md:text-xl font-bold">{connectedChannels}/4</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Avg per Booking</p>
                <p className="text-white text-sm md:text-xl font-bold break-all">
                  {(() => {
                    const totalBookings = channelStats.airbnb.count + channelStats.bookingCom.count + channelStats.direct.count + channelStats.other.count;
                    const totalRevenue = channelStats.airbnb.revenue + channelStats.bookingCom.revenue + channelStats.direct.revenue + channelStats.other.revenue;
                    return totalBookings > 0 ? formatCurrency(totalRevenue / totalBookings) : '$0';
                  })()}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/10 rounded-xl p-5 border-2 border-pink-500/30">
            <div className="flex items-center justify-between mb-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg" alt="Airbnb" className="h-6" />
              <span className={`px-3 py-1 ${channelStats.airbnb.count > 0 ? 'bg-green-500' : 'bg-gray-500'} text-white text-xs font-bold rounded-full`}>
                {channelStats.airbnb.count > 0 ? '●' : '○'}
              </span>
            </div>
            <p className="text-gray-300 text-sm">
              {channelStats.airbnb.count} bookings • {formatCurrency(channelStats.airbnb.revenue)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-5 border-2 border-blue-500/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-blue-400 font-bold text-lg">Booking.com</span>
              <span className={`px-3 py-1 ${channelStats.bookingCom.count > 0 ? 'bg-green-500' : 'bg-gray-500'} text-white text-xs font-bold rounded-full`}>
                {channelStats.bookingCom.count > 0 ? '●' : '○'}
              </span>
            </div>
            <p className="text-gray-300 text-sm">
              {channelStats.bookingCom.count} bookings • {formatCurrency(channelStats.bookingCom.revenue)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl p-5 border-2 border-orange-500/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-orange-400 font-bold text-lg">Direct (Gita)</span>
              <span className={`px-3 py-1 ${channelStats.direct.count > 0 ? 'bg-green-500' : 'bg-gray-500'} text-white text-xs font-bold rounded-full`}>
                {channelStats.direct.count > 0 ? '●' : '○'}
              </span>
            </div>
            <p className="text-gray-300 text-sm">
              {channelStats.direct.count} bookings • {formatCurrency(channelStats.direct.revenue)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-5 border-2 border-purple-500/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-purple-400 font-bold text-lg">Other Sources</span>
              <span className={`px-3 py-1 ${channelStats.other.count > 0 ? 'bg-green-500' : 'bg-gray-500'} text-white text-xs font-bold rounded-full`}>
                {channelStats.other.count > 0 ? '●' : '○'}
              </span>
            </div>
            <p className="text-gray-300 text-sm">
              {channelStats.other.count} bookings • {formatCurrency(channelStats.other.revenue)}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Bali Buntu, Ibu Santi, Domus, etc.
            </p>
          </div>
        </div>

        <div className="bg-[#2a2f3a] rounded-xl p-6 border-2 border-gray-700">
          <h4 className="text-white font-bold text-lg mb-4">Calendar View</h4>
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Calendar integration coming soon</p>
            <p className="text-gray-500 text-sm mt-2">Manage availability across all channels</p>
          </div>
        </div>
      </div>
    </div>
  );
};

  const renderBookingsSection = () => (
    <div className="space-y-6">
      <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setActiveSection('menu')}
            className="p-2 bg-[#1f2937]/95 backdrop-blur-sm rounded-xl hover:bg-orange-500 transition-all border border-[#d85a2a]/20"
          >
            <ArrowLeft className="w-5 h-5 text-[#FF8C42]" />
          </button>
          <h3 className="text-2xl font-black text-[#FF8C42] flex items-center gap-2">
            <Home className="w-6 h-6" />
            Bookings ({realCounts.totalBookings} total)
          </h3>
          <div className="flex gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by guest name, date (e.g. 'Jan 2026'), or amount..."
                value={bookingSearchQuery}
                onChange={(e) => setBookingSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#2a2f3a] border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {(() => {
            // Filter bookings based on search query
            const filteredBookings = allBookings.filter((booking) => {
              if (!bookingSearchQuery) return true;

              const query = bookingSearchQuery.toLowerCase();
              const guestName = (booking.guest_name || '').toLowerCase();
              const checkIn = booking.check_in ? new Date(booking.check_in).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toLowerCase() : '';
              const checkOut = booking.check_out ? new Date(booking.check_out).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toLowerCase() : '';
              const amount = (booking.total_price || '').toString();

              return guestName.includes(query) ||
                     checkIn.includes(query) ||
                     checkOut.includes(query) ||
                     amount.includes(query);
            });

            if (filteredBookings.length === 0) {
              return (
                <div className="text-center text-gray-500 py-8">
                  {bookingSearchQuery ? `No bookings found for "${bookingSearchQuery}"` : 'No bookings found'}
                </div>
              );
            }

            return filteredBookings.map((booking) => {
              const checkIn = booking.check_in ? new Date(booking.check_in) : null;
              const checkOut = booking.check_out ? new Date(booking.check_out) : null;
              const nights = checkIn && checkOut
                ? Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
                : 0;
              const dateRange = checkIn && checkOut
                ? `${checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                : 'N/A';

              return (
                <div key={booking.id} className="bg-[#2a2f3a] rounded-lg p-4 border-2 border-gray-700 hover:border-orange-500/50 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-lg">{booking.guest_name || 'N/A'}</h4>
                      <p className="text-gray-400 text-sm">{dateRange} • {nights} nights</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold text-lg">${booking.total_price?.toLocaleString() || '0'}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                        booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {booking.status || 'unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );

  const renderPaymentsSection = () => (
    <div className="space-y-6">
      <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setActiveSection('menu')}
            className="p-2 bg-[#1f2937]/95 backdrop-blur-sm rounded-xl hover:bg-orange-500 transition-all border border-[#d85a2a]/20"
          >
            <ArrowLeft className="w-5 h-5 text-[#FF8C42]" />
          </button>
          <h3 className="text-2xl font-black text-[#FF8C42] flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            Payments
          </h3>
          <div className="w-12"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-5 border-2 border-green-500/30">
            <p className="text-green-300 text-sm font-medium mb-2">Paid</p>
            <p className="text-3xl font-black text-white">43</p>
            <p className="text-green-200 text-sm mt-1">$47,940</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl p-5 border-2 border-yellow-500/30">
            <p className="text-yellow-300 text-sm font-medium mb-2">Pending</p>
            <p className="text-3xl font-black text-white">2</p>
            <p className="text-yellow-200 text-sm mt-1">$2,200</p>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-xl p-5 border-2 border-red-500/30">
            <p className="text-red-300 text-sm font-medium mb-2">Overdue</p>
            <p className="text-3xl font-black text-white">0</p>
            <p className="text-red-200 text-sm mt-1">$0</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-white font-bold text-lg">Pending Payments</h4>
          {[
            { guest: 'Michael Brown Jr', amount: 1100, method: 'Bank Transfer', booking: 'BK-2025-042' },
            { guest: 'Emma Chen', amount: 1960, method: 'Pending', booking: 'BK-2026-001' }
          ].map((payment, i) => (
            <div key={i} className="bg-[#2a2f3a] rounded-lg p-4 border-2 border-yellow-500/50">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-white font-bold">{payment.guest}</h5>
                  <p className="text-gray-400 text-sm">{payment.booking} • {payment.method}</p>
                </div>
                <div className="text-right">
                  <p className="text-yellow-400 font-bold text-lg">${payment.amount}</p>
                  <button className="mt-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded font-bold">
                    Mark Paid
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCommunicationSection = () => (
    <div className="space-y-6">
      <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setActiveSection('menu')}
            className="p-2 bg-[#1f2937]/95 backdrop-blur-sm rounded-xl hover:bg-orange-500 transition-all border border-[#d85a2a]/20"
          >
            <ArrowLeft className="w-5 h-5 text-[#FF8C42]" />
          </button>
          <h3 className="text-2xl font-black text-[#FF8C42] flex items-center gap-2">
            <Mail className="w-6 h-6" />
            Guest Communication
          </h3>
          <div className="w-12"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-5 border-2 border-green-500/30">
            <MessageSquare className="w-8 h-8 text-green-400 mb-2" />
            <p className="text-green-300 font-bold text-lg">WhatsApp</p>
            <p className="text-gray-300 text-sm">8 unread conversations</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-5 border-2 border-blue-500/30">
            <Mail className="w-8 h-8 text-blue-400 mb-2" />
            <p className="text-blue-300 font-bold text-lg">Email</p>
            <p className="text-gray-300 text-sm">3 unread emails</p>
          </div>
        </div>

        <div className="text-center py-12 bg-[#2a2f3a] rounded-xl border-2 border-gray-700">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Unified Inbox</p>
          <p className="text-gray-500 text-sm mt-2">View all guest conversations in one place</p>
          <button className="mt-4 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition-all">
            Open Inbox
          </button>
        </div>
      </div>
    </div>
  );

  const renderWebsiteSection = () => (
    <div className="space-y-6">
      <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setActiveSection('menu')}
            className="p-2 bg-[#1f2937]/95 backdrop-blur-sm rounded-xl hover:bg-orange-500 transition-all border border-[#d85a2a]/20"
          >
            <ArrowLeft className="w-5 h-5 text-[#FF8C42]" />
          </button>
          <h3 className="text-2xl font-black text-[#FF8C42] flex items-center gap-2">
            <Globe className="w-6 h-6" />
            My Villa Website
          </h3>
          <div className="w-12"></div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-6 border-2 border-green-500/30 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-green-300 font-bold text-lg mb-1">Your Website is Live</p>
              <p className="text-gray-300 text-sm">Nismara Uma Villa - Ubud, Bali</p>
            </div>
            <span className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-full">Live</span>
          </div>

          <div className="bg-[#2a2f3a] rounded-lg p-4 mb-4">
            <p className="text-gray-400 text-sm mb-3 text-center md:text-left">🌐 Public URL:</p>
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <code className="flex-1 bg-black/40 px-4 py-3 rounded text-orange-400 font-mono text-sm text-center md:text-left break-all">
                https://nismarauma.lovable.app/
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('https://nismarauma.lovable.app/');
                  alert('✅ URL copied to clipboard!');
                }}
                className="w-full md:w-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-all"
              >
                📋 Copy URL
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <a
              href="https://nismarauma.lovable.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition-all"
            >
              <ExternalLink className="w-5 h-5" />
              Open Website
            </a>

            <button
              onClick={() => {
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent('Check out my villa: https://nismarauma.lovable.app/')}`;
                window.open(whatsappUrl, '_blank');
              }}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-all"
            >
              <MessageSquare className="w-5 h-5" />
              Share WhatsApp
            </button>

            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-[#2a2f3a] hover:bg-[#374151] text-white rounded-lg font-bold transition-all border-2 border-gray-700">
              <Settings className="w-5 h-5" />
              Edit Site
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTasksSection = () => (
    <div className="space-y-6">
      <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setActiveSection('menu')}
            className="p-2 bg-[#1f2937]/95 backdrop-blur-sm rounded-xl hover:bg-orange-500 transition-all border border-[#d85a2a]/20"
          >
            <ArrowLeft className="w-5 h-5 text-[#FF8C42]" />
          </button>
          <h3 className="text-2xl font-black text-[#FF8C42] flex items-center gap-2">
            <Wrench className="w-6 h-6" />
            Maintenance & Tasks
          </h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl p-5 border-2 border-yellow-500/30">
            <p className="text-yellow-300 text-sm font-medium mb-2">Open</p>
            <p className="text-3xl font-black text-white">0</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-5 border-2 border-blue-500/30">
            <p className="text-blue-300 text-sm font-medium mb-2">In Progress</p>
            <p className="text-3xl font-black text-white">0</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-5 border-2 border-green-500/30">
            <p className="text-green-300 text-sm font-medium mb-2">Done Today</p>
            <p className="text-3xl font-black text-white">0</p>
          </div>
        </div>

        <div className="bg-[#2a2f3a] rounded-xl p-6 border-2 border-gray-700 text-center py-12">
          <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">No tasks available</p>
          <p className="text-gray-500 text-sm">Tasks module not yet configured in database</p>
        </div>

        <div className="space-y-3" style={{display: 'none'}}>
          {[].map((task, i) => (
            <div key={i} className="bg-[#2a2f3a] rounded-lg p-4 border-2 border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-white font-bold">{task.task}</h4>
                  <p className="text-gray-400 text-sm">{task.type} • {task.assignee} • Due: {task.due}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  task.status === 'open' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBusinessReportsSection = () => {
    const owners = [
      {
        id: 'gita',
        name: 'Gita Pradnyana',
        email: 'nismaraumavilla@gmail.com',
        property: 'Nismara Uma Villa',
        villas: 1,
        fileStatic: 'nismara-final.html',
        fileDynamic: 'nismara-dynamic.html',
        currency: 'IDR'
      },
      {
        id: 'jose',
        name: 'Jose Carrallo',
        email: 'josecarrallodelafuente@gmail.com',
        property: 'Izumi Hotel & Villas',
        villas: 8,
        fileStatic: 'izumi-final.html',
        fileDynamic: 'izumi-dynamic.html',
        currency: 'USD'
      }
    ];

    const currentOwner = owners.find(o => o.id === selectedProperty);
    const currentFile = currentOwner.fileDynamic; // Always use dynamic report

    const handlePrint = () => {
      const iframe = document.getElementById('business-report-frame');
      if (iframe) {
        iframe.contentWindow.print();
      }
    };

    const handleGenerate = async () => {
      setIsGeneratingReport(true);
      console.log('🔄 Generating report with latest version...');

      try {
        // Import services
        const { generateBusinessReport } = await import('../../services/businessReportService');
        // generateReportHTML is now imported statically at the top

        // Get owner data
        const ownerData = owners.find(o => o.id === selectedProperty);
        const ownerId = selectedProperty === 'gita'
          ? '1f32d384-4018-46a9-a6f9-058217e6924a'
          : 'c24393db-d318-4d75-8bbf-0fa240b9c1db';

        // Calculate date range for selected period
        const { startDate, endDate } = getDateRange(selectedPeriod);
        console.log(`📊 Generating report for ${ownerData.name} (${startDate} to ${endDate})...`);

        // Generate report data (calls Supabase + OSIRIS)
        const reportData = await generateBusinessReport(
          ownerId,
          ownerData.name,
          ownerData.property,
          ownerData.currency,
          startDate,
          endDate
        );

        if (reportData) {
          console.log('✅ Data generated, creating HTML...');

          // Generate complete HTML
          const reportHTML = generateReportHTML(
            ownerData.name,
            ownerData.property,
            ownerData.currency,
            reportData,
            reportData.osirisAnalysis
          );

          // Display in iframe and save to localStorage
          setReportHTML(reportHTML);
          localStorage.setItem(`business-report-${selectedProperty}-${selectedPeriod}`, reportHTML);
          console.log(`✅ Report generated and saved for ${selectedProperty} - ${selectedPeriod}`);
        } else {
          alert('❌ Error generating report. No data found.');
        }
      } catch (error) {
        console.error('Error generating report:', error);
        alert('❌ Error: ' + error.message);
      } finally {
        setIsGeneratingReport(false);
      }
    };

    return (
      <div className="space-y-6">
        {/* Header with Owner Selector and Action Buttons */}
        <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20">
          {/* Header Row with Back Button and Title */}
          <div className="flex items-center mb-6 gap-4">
            <button
              onClick={() => setActiveSection('menu')}
              className="p-2 bg-[#1f2937]/95 backdrop-blur-sm rounded-xl hover:bg-orange-500 transition-all border border-[#d85a2a]/20"
            >
              <ArrowLeft className="w-5 h-5 text-[#FF8C42]" />
            </button>
            <h3 className="text-xl md:text-2xl font-black text-[#FF8C42] flex items-center gap-2 flex-1">
              <FileText className="w-5 h-5 md:w-6 md:h-6" />
              <span className="hidden md:inline">Business Reports - {currentOwner.property}</span>
              <span className="md:hidden">Reports</span>
            </h3>

            {/* Action Buttons - Top Right Corner, Stacked Vertically */}
            <div className="flex flex-col gap-2 ml-auto">
              <button
                onClick={handleGenerate}
                disabled={isGeneratingReport}
                className={`flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg font-semibold transition-all shadow-lg text-sm ${
                  isGeneratingReport
                    ? 'bg-purple-400 cursor-not-allowed'
                    : 'bg-purple-500 hover:bg-purple-600'
                }`}
              >
                {isGeneratingReport ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Generate</span>
                  </>
                )}
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all shadow-lg text-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Selectors Row - Owner and Period - Full Width on Mobile */}
          <div className="flex flex-col gap-4">
            {/* Select Owner */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-300 text-xs font-semibold uppercase">Owner:</label>
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="bg-[#374151] text-white px-4 py-2 rounded-lg border-2 border-orange-500/30 focus:border-orange-500 focus:outline-none hover:border-orange-500/50 transition-all cursor-pointer w-full"
              >
                {owners.map(owner => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name} - {owner.property}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Period */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-300 text-xs font-semibold uppercase">Period:</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-[#374151] text-white px-4 py-2 rounded-lg border-2 border-purple-500/30 focus:border-purple-500 focus:outline-none hover:border-purple-500/50 transition-all cursor-pointer w-full"
              >
                <option value="this_month">This Month</option>
                <option value="last_month">Last Month</option>
                <option value="this_quarter">This Quarter</option>
                <option value="last_quarter">Last Quarter</option>
                <option value="this_year">This Year (2026)</option>
                <option value="last_year">Last Year (2025)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Report Display */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200" style={{ height: '1400px', overflowY: 'auto', overflowX: 'hidden' }}>
          <iframe
            srcDoc={reportHTML}
            id="business-report-frame"
            style={{
              width: '100%',
              height: '3500px',
              border: 'none',
              display: 'block'
            }}
            title="Business Report"
          />
        </div>
      </div>
    );
  };

  const renderOverviewSection = () => (
    <div className="space-y-6">
      {/* View Selector */}
      <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-3 shadow-lg border-2 border-[#d85a2a]/20">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setActiveSection('menu')}
            className="p-2 bg-[#1f2937]/95 backdrop-blur-sm rounded-xl hover:bg-orange-500 transition-all border border-[#d85a2a]/20"
          >
            <ArrowLeft className="w-5 h-5 text-[#FF8C42]" />
          </button>
          <h3 className="text-xl font-black text-[#FF8C42]">Overview</h3>
          <div className="w-12"></div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setActiveView('daily')}
            className={`
              flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all
              ${activeView === 'daily'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-[#FF8C42] border-2 border-gray-200 hover:border-orange-300'
              }
            `}
          >
            <Calendar className="w-5 h-5" />
            Daily
          </button>
          <button
            onClick={() => setActiveView('weekly')}
            className={`
              flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all
              ${activeView === 'weekly'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-[#FF8C42] border-2 border-gray-200 hover:border-orange-300'
              }
            `}
          >
            <TrendingUp className="w-5 h-5" />
            Weekly
          </button>
          <button
            onClick={() => setActiveView('monthly')}
            className={`
              flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all
              ${activeView === 'monthly'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-[#FF8C42] border-2 border-gray-200 hover:border-orange-300'
              }
            `}
          >
            <Calendar className="w-5 h-5" />
            Monthly
          </button>
        </div>
      </div>

      {/* DAILY VIEW */}
      {activeView === 'daily' && (
        <>
          {/* Date Selector & Print */}
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-4 shadow-2xl border-2 border-[#d85a2a]/20 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <select
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="bg-[#2a2f3a] text-white px-4 py-2 rounded-lg border-2 border-gray-700 focus:border-orange-500 outline-none"
                >
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="last_7_days">Last 7 Days</option>
                  <option value="last_14_days">Last 14 Days</option>
                  <option value="last_30_days">Last 30 Days</option>
                  <option value="custom">Custom Range</option>
                </select>
                <span className="text-gray-400 text-sm">
                  {selectedDateRange === 'today' && 'January 30, 2026'}
                  {selectedDateRange === 'yesterday' && 'January 29, 2026'}
                  {selectedDateRange === 'last_7_days' && 'Jan 24 - Jan 30, 2026'}
                  {selectedDateRange === 'last_14_days' && 'Jan 17 - Jan 30, 2026'}
                  {selectedDateRange === 'last_30_days' && 'Jan 1 - Jan 30, 2026'}
                  {selectedDateRange === 'custom' && 'Select custom range'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerateDailySummary}
                  disabled={isGeneratingSummary}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  {isGeneratingSummary ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Generate Summary
                    </>
                  )}
                </button>
                <button
                  onClick={() => handlePrintReport('daily')}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Print Report
                </button>
              </div>
            </div>
          </div>

          {/* Daily Performance Metrics */}
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20">
            <h3 className="text-2xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Daily Performance
            </h3>
            {lastSummaryGenerated && (
              <p className="text-orange-100 text-sm mb-3">Last updated: {lastSummaryGenerated}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <MessageSquare className="w-6 h-6 text-orange-600" />
                  <span className="text-lg font-bold text-gray-900">{todayMetrics.newInquiries}</span>
                </div>
                <p className="text-gray-700 text-sm">New Inquiries</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-6 h-6 text-yellow-600" />
                  <span className="text-lg font-bold text-gray-900">{todayMetrics.pendingPayments}</span>
                </div>
                <p className="text-gray-700 text-sm">Pending Payments</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-lg font-bold text-gray-900">{todayMetrics.confirmedBookings}</span>
                </div>
                <p className="text-gray-700 text-sm">Confirmed Today</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-6 h-6 text-purple-600" />
                  <span className="text-lg font-bold text-gray-900">{todayMetrics.checkInsToday}</span>
                </div>
                <p className="text-gray-700 text-sm">Check-ins Today</p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <span className="text-lg font-bold text-gray-900">{todayMetrics.expiredHolds}</span>
                </div>
                <p className="text-gray-700 text-sm">Expired Holds</p>
              </div>
            </div>

            {/* Additional Daily Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-5 border-2 border-green-500/30">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-lg font-black text-white mb-1">$5,280</p>
                <p className="text-green-300 text-sm">Revenue Today</p>
                <p className="text-green-400 text-xs mt-1">+18% vs yesterday</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-5 border-2 border-blue-500/30">
                <div className="flex items-center justify-between mb-2">
                  <Home className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-lg font-black text-white mb-1">3</p>
                <p className="text-blue-300 text-sm">Bookings Confirmed</p>
                <p className="text-blue-400 text-xs mt-1">Avg $1,760/booking</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-5 border-2 border-purple-500/30">
                <div className="flex items-center justify-between mb-2">
                  <CreditCard className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-lg font-black text-white mb-1">2</p>
                <p className="text-purple-300 text-sm">Payments Received</p>
                <p className="text-purple-200 text-xs mt-1">$3,100 collected</p>
              </div>
            </div>

            {/* Channel Distribution Today */}
            <div className="mt-6 bg-[#2a2f3a] rounded-xl p-5 border-2 border-gray-700">
              <h4 className="text-white font-bold text-lg mb-3">Today's Bookings by Channel</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300 text-sm">Direct</span>
                    <span className="text-white font-bold">1 booking • $1,960</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '33%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300 text-sm">Airbnb</span>
                    <span className="text-white font-bold">1 booking • $1,540</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-pink-500 h-2 rounded-full" style={{ width: '33%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300 text-sm">Booking.com</span>
                    <span className="text-white font-bold">1 booking • $1,780</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '34%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3-MONTH PERFORMANCE */}
          {monthlyMetrics && (
            <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20">
              <h3 className="text-2xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-[#FF8C42]" />
                3-Month Performance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-5 border-2 border-blue-500/30">
                  <p className="text-blue-300 text-sm font-medium mb-2">November 2025</p>
                  <p className="text-3xl font-black text-white mb-1">
                    ${monthlyMetrics.november.revenue.toLocaleString()}
                  </p>
                  <p className="text-blue-200 text-sm">
                    {monthlyMetrics.november.bookings} bookings
                  </p>
                  <p className="text-blue-400 text-xs mt-2">65% occupancy</p>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-5 border-2 border-green-500/30">
                  <p className="text-green-300 text-sm font-medium mb-2">December 2025</p>
                  <p className="text-3xl font-black text-white mb-1">
                    ${monthlyMetrics.december.revenue.toLocaleString()}
                  </p>
                  <p className="text-green-200 text-sm">
                    {monthlyMetrics.december.bookings} bookings
                  </p>
                  <p className="text-green-400 text-xs mt-2">85% occupancy 🔥</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl p-5 border-2 border-orange-500/30">
                  <p className="text-orange-300 text-sm font-medium mb-2">January 2026</p>
                  <p className="text-3xl font-black text-white mb-1">
                    ${monthlyMetrics.january.revenue.toLocaleString()}
                  </p>
                  <p className="text-orange-200 text-sm">
                    {monthlyMetrics.january.bookings} bookings
                  </p>
                  <p className="text-orange-400 text-xs mt-2">72% occupancy</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t-2 border-gray-700">
                <p className="text-gray-400 text-sm">
                  <span className="text-green-400 font-bold">
                    Total: $
                    {(
                      monthlyMetrics.november.revenue +
                      monthlyMetrics.december.revenue +
                      monthlyMetrics.january.revenue
                    ).toLocaleString()}
                  </span>{' '}
                  • {monthlyMetrics.november.bookings + monthlyMetrics.december.bookings + monthlyMetrics.january.bookings} bookings • 74% avg occupancy
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* WEEKLY VIEW */}
      {activeView === 'weekly' && (
        <>
          {/* Week Selector & Print */}
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-4 shadow-2xl border-2 border-[#d85a2a]/20 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <select
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="bg-[#2a2f3a] text-white px-4 py-2 rounded-lg border-2 border-gray-700 focus:border-orange-500 outline-none"
                >
                  <option value="this_week">This Week</option>
                  <option value="last_week">Last Week</option>
                  <option value="last_7_days">Last 7 Days</option>
                  <option value="last_14_days">Last 14 Days</option>
                  <option value="custom">Custom Range</option>
                </select>
                <span className="text-gray-400 text-sm">
                  {selectedDateRange === 'this_week' && 'Jan 27 - Feb 2, 2026'}
                  {selectedDateRange === 'last_week' && 'Jan 20 - Jan 26, 2026'}
                  {selectedDateRange === 'last_7_days' && 'Last 7 days'}
                  {selectedDateRange === 'last_14_days' && 'Last 14 days'}
                  {selectedDateRange === 'custom' && 'Select custom range'}
                </span>
              </div>
              <button
                onClick={() => handlePrintReport('weekly')}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition-all"
              >
                <Download className="w-4 h-4" />
                Print Report
              </button>
            </div>
          </div>

          {/* Weekly Metrics */}
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20 mb-6">
            <h3 className="text-2xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Weekly Performance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-5 border-2 border-blue-500/30">
                <div className="flex items-center justify-between mb-2">
                  <Home className="w-8 h-8 text-blue-400" />
                  <span className="text-xs text-green-400 font-bold">{weeklyMetrics.trend}</span>
                </div>
                <p className="text-xl font-black text-white mb-1">{weeklyMetrics.bookingsThisWeek}</p>
                <p className="text-blue-300 text-sm">Bookings This Week</p>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-5 border-2 border-green-500/30">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-8 h-8 text-green-400" />
                  <span className="text-xs text-green-400 font-bold">{weeklyMetrics.trend}</span>
                </div>
                <p className="text-xl font-black text-white mb-1">${weeklyMetrics.revenueThisWeek.toLocaleString()}</p>
                <p className="text-green-300 text-sm">Revenue This Week</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-5 border-2 border-purple-500/30">
                <div className="flex items-center justify-between mb-2">
                  <CreditCard className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-xl font-black text-white mb-1">{weeklyMetrics.paymentsCollected}</p>
                <p className="text-purple-300 text-sm">Payments Collected</p>
                <p className="text-purple-200 text-xs mt-1">${weeklyMetrics.paymentsAmount.toLocaleString()}</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl p-5 border-2 border-orange-500/30">
                <div className="flex items-center justify-between mb-2">
                  <ClipboardCheck className="w-8 h-8 text-orange-400" />
                </div>
                <p className="text-xl font-black text-white mb-1">{weeklyMetrics.openActions}</p>
                <p className="text-orange-300 text-sm">Open Actions</p>
              </div>

              <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/10 rounded-xl p-5 border-2 border-pink-500/30">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-pink-400" />
                </div>
                <p className="text-xl font-black text-white mb-1">{weeklyMetrics.newLeads}</p>
                <p className="text-pink-300 text-sm">New Leads</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl p-5 border-2 border-yellow-500/30">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 text-yellow-400" />
                </div>
                <p className="text-xl font-black text-white mb-1">{weeklyMetrics.trend}</p>
                <p className="text-yellow-300 text-sm">vs Last Week</p>
              </div>
            </div>
          </div>

          {/* Weekly Bookings List */}
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20">
            <h3 className="text-xl font-black text-[#FF8C42] mb-4">This Week's Bookings</h3>
            <div className="space-y-3">
              {[
                { guest: 'Hiroshi Nakamura', checkIn: 'Jan 25', checkOut: 'Feb 1', nights: 7, amount: 1540, status: 'confirmed' },
                { guest: 'Anna Müller', checkIn: 'Jan 28', checkOut: 'Feb 4', nights: 7, amount: 1470, status: 'confirmed' },
                { guest: 'David Wilson', checkIn: 'Jan 29', checkOut: 'Feb 1', nights: 3, amount: 660, status: 'confirmed' },
                { guest: 'Yuki Tanaka', checkIn: 'Jan 31', checkOut: 'Feb 7', nights: 7, amount: 1540, status: 'confirmed' }
              ].map((booking, i) => (
                <div key={i} className="bg-[#2a2f3a] rounded-lg p-4 border-2 border-gray-700 hover:border-orange-500/50 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-lg">{booking.guest}</h4>
                      <p className="text-gray-400 text-sm">{booking.checkIn} → {booking.checkOut} • {booking.nights} nights</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold text-lg">${booking.amount}</p>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold">
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* MONTHLY VIEW */}
      {activeView === 'monthly' && (
        <>
          {/* Month Selector & Print */}
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-4 shadow-2xl border-2 border-[#d85a2a]/20 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <select className="bg-[#2a2f3a] text-white px-4 py-2 rounded-lg border-2 border-gray-700 focus:border-orange-500 outline-none">
                  <option value="january_2026">January 2026</option>
                  <option value="december_2025">December 2025</option>
                  <option value="november_2025">November 2025</option>
                  <option value="october_2025">October 2025</option>
                </select>
              </div>
              <button
                onClick={() => handlePrintReport('monthly')}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition-all"
              >
                <Download className="w-4 h-4" />
                Print Report
              </button>
            </div>
          </div>

          {/* Monthly Overview */}
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20 mb-6">
            <h3 className="text-2xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              January 2026 Performance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-5 border-2 border-green-500/30">
                <DollarSign className="w-8 h-8 text-green-400 mb-2" />
                <p className="text-xl font-black text-white mb-1">${currentMonthMetrics.revenue.toLocaleString('en-US')}</p>
                <p className="text-green-300 text-sm">Total Revenue</p>
                <p className="text-green-400 text-xs mt-1">+6% vs December</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-5 border-2 border-blue-500/30">
                <Home className="w-8 h-8 text-blue-400 mb-2" />
                <p className="text-xl font-black text-white mb-1">{currentMonthMetrics.bookings}</p>
                <p className="text-blue-300 text-sm">Total Bookings</p>
                <p className="text-blue-400 text-xs mt-1">Avg ${currentMonthMetrics.avgNightlyRate}/night</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-5 border-2 border-purple-500/30">
                <TrendingUp className="w-8 h-8 text-purple-400 mb-2" />
                <p className="text-xl font-black text-white mb-1">{currentMonthMetrics.occupancy}%</p>
                <p className="text-purple-300 text-sm">Occupancy Rate</p>
                <p className="text-purple-400 text-xs mt-1">22 days booked</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl p-5 border-2 border-orange-500/30">
                <Users className="w-8 h-8 text-orange-400 mb-2" />
                <p className="text-xl font-black text-white mb-1">{currentMonthMetrics.cancellations}</p>
                <p className="text-orange-300 text-sm">Cancellations</p>
                <p className="text-orange-400 text-xs mt-1">93.8% retention</p>
              </div>
            </div>

            {/* Channel Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#2a2f3a] rounded-xl p-5 border-2 border-gray-700">
                <h4 className="text-white font-bold text-lg mb-3">Channel Distribution</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-300 text-sm">Direct Bookings</span>
                      <span className="text-white font-bold">{currentMonthMetrics.directBookings}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${(currentMonthMetrics.directBookings / currentMonthMetrics.bookings) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-300 text-sm">OTA Bookings</span>
                      <span className="text-white font-bold">{currentMonthMetrics.otaBookings}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(currentMonthMetrics.otaBookings / currentMonthMetrics.bookings) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#2a2f3a] rounded-xl p-5 border-2 border-gray-700">
                <h4 className="text-white font-bold text-lg mb-3">Key Insights</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300 text-sm">33% of bookings from direct channel - saves commission fees</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300 text-sm">Peak season continues with strong 72% occupancy</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300 text-sm">Only 1 cancellation this month - excellent retention</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Month Comparison */}
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20">
            <h3 className="text-xl font-black text-[#FF8C42] mb-4">3-Month Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#2a2f3a] rounded-xl p-5 border-2 border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gray-400 text-sm">November 2025</p>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-bold">65%</span>
                </div>
                <p className="text-2xl font-black text-white mb-1">${monthlyMetrics.november.revenue.toLocaleString()}</p>
                <p className="text-gray-400 text-sm">{monthlyMetrics.november.bookings} bookings</p>
              </div>

              <div className="bg-[#2a2f3a] rounded-xl p-5 border-2 border-green-500/50">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gray-400 text-sm">December 2025</p>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold">85% 🔥</span>
                </div>
                <p className="text-2xl font-black text-white mb-1">${monthlyMetrics.december.revenue.toLocaleString()}</p>
                <p className="text-gray-400 text-sm">{monthlyMetrics.december.bookings} bookings</p>
              </div>

              <div className="bg-[#2a2f3a] rounded-xl p-5 border-2 border-orange-500/50">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gray-400 text-sm">January 2026</p>
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs font-bold">72%</span>
                </div>
                <p className="text-2xl font-black text-white mb-1">${monthlyMetrics.january.revenue.toLocaleString()}</p>
                <p className="text-gray-400 text-sm">{monthlyMetrics.january.bookings} bookings</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderDecisionsSection = () => (
    <div className="space-y-6">
      {/* OWNER DECISIONS */}
      <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setActiveSection('menu')}
            className="p-2 bg-[#1f2937]/95 backdrop-blur-sm rounded-xl hover:bg-orange-500 transition-all border border-[#d85a2a]/20"
          >
            <ArrowLeft className="w-5 h-5 text-[#FF8C42]" />
          </button>
          <h3 className="text-2xl font-black text-[#FF8C42] flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-[#FF8C42]" />
            Owner Decisions ({actionsNeedingApproval.length})
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDBVisualization(!showDBVisualization)}
              className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg font-medium transition-all flex items-center gap-2 border border-orange-500/30"
            >
            <Eye className="w-4 h-4" />
            {showDBVisualization ? 'Hide' : 'Show'} DB
          </button>
          </div>
        </div>
        <div className="space-y-4">
          {actionsNeedingApproval.length === 0 ? (
            <div className="text-center py-8 bg-[#2a2f3a] rounded-lg border-2 border-gray-700">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-300 text-lg">No pending actions</p>
              <p className="text-gray-500 text-sm mt-1">All caught up! 🎉</p>
            </div>
          ) : (
            actionsNeedingApproval.map((action) => {
              const priorityColors = {
                urgent: 'bg-red-100 text-red-700 border-red-300',
                high: 'bg-yellow-100 text-yellow-700 border-yellow-300',
                normal: 'bg-blue-100 text-blue-700 border-blue-300'
              };

              const typeColors = {
                discount_request: 'bg-purple-100 text-purple-700',
                payment_verification: 'bg-yellow-100 text-yellow-700',
                custom_plan_request: 'bg-blue-100 text-blue-700',
                payment_expired: 'bg-red-100 text-red-700',
                special_request: 'bg-orange-100 text-orange-700'
              };

              return (
                <div
                  key={action.id}
                  className={`bg-[#2a2f3a] rounded-lg p-5 border-2 ${
                    action.priority === 'urgent'
                      ? 'border-red-500/50'
                      : action.priority === 'high'
                      ? 'border-yellow-500/50'
                      : 'border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            priorityColors[action.priority] || priorityColors.normal
                          } border-2`}
                        >
                          🔥 {action.priority}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            typeColors[action.type] || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {action.type.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <h4 className="text-white font-bold text-xl mb-2">{action.title}</h4>
                      <div className="flex items-center gap-3 mb-3">
                        <p className="text-orange-400 font-medium text-lg">👤 {action.guest}</p>
                        {action.guestPhone && (
                          <p className="text-gray-500 text-sm">📱 {action.guestPhone}</p>
                        )}
                      </div>
                      {action.amount > 0 && (
                        <p className="text-green-400 font-bold text-lg mb-2">
                          💰 ${action.amount.toLocaleString()}
                        </p>
                      )}
                      <p className="text-gray-300 mb-2 leading-relaxed">{action.action}</p>
                      <p className="text-gray-500 text-xs">
                        ⏰ {new Date(action.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4 border-t-2 border-gray-700">
                    <button
                      onClick={() => handleApprove(action.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <ThumbsUp className="w-5 h-5" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(action.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <ThumbsDown className="w-5 h-5" />
                      Reject
                    </button>
                    <button className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* DATABASE VISUALIZATION */}
      {showDBVisualization && (
        <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-orange-500/30">
          <h3 className="text-2xl font-black text-orange-400 mb-4 flex items-center gap-2">
            <Eye className="w-6 h-6 text-orange-400" />
            Database Activity (Real-Time)
          </h3>
          <div className="bg-black/40 rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
            {dbQueryLog.length === 0 ? (
              <p className="text-gray-500">No database activity yet...</p>
            ) : (
              dbQueryLog.map((log, index) => (
                <div key={index} className="mb-4 pb-4 border-b border-gray-700 last:border-0">
                  <p className="text-green-400 font-bold mb-1">
                    [{log.timestamp}] {log.query}
                  </p>
                  <pre className="text-gray-400 text-xs whitespace-pre-wrap">
                    {log.result}
                  </pre>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setDbQueryLog([])}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-medium transition-all border border-red-500/30"
            >
              Clear Log
            </button>
            <button
              onClick={() => {
                fetchActions();
                fetchTodayMetrics();
              }}
              className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg font-medium transition-all border border-green-500/30"
            >
              Refresh Data
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Main render
  return (
    <div className="flex h-screen bg-[#2a2f3a] relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Sidebar Navigation */}
      <div className={`w-80 bg-[#1f2937]/95 backdrop-blur-sm border-r-2 border-[#d85a2a]/20 overflow-y-auto relative z-10 ${activeSection === 'menu' ? '' : 'hidden'}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-white">AUTOPILOT</h2>
            <button
              onClick={onBack}
              className="p-2 bg-[#1f2937]/95 backdrop-blur-sm rounded-xl hover:bg-orange-500 transition-all border border-[#d85a2a]/20"
            >
              <ArrowLeft className="w-5 h-5 text-[#FF8C42]" />
            </button>
          </div>

          {/* Menu Sections */}
          <nav className="space-y-2">
            {menuSections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    ${isActive
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-[#2a2f3a] text-gray-300 hover:bg-[#374151] hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <p className="font-bold text-sm">{section.name}</p>
                    <p className={`text-xs ${isActive ? 'text-orange-100' : 'text-gray-500'}`}>
                      {section.description}
                    </p>
                  </div>
                  {section.badge && (
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {section.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-5 h-5" />}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-2 relative z-10">
        <div className="max-w-[96%] mx-auto">
          {activeSection === 'data-entry' && renderDataEntrySection()}
          {activeSection === 'business-reports' && renderBusinessReportsSection()}
          {activeSection === 'all-data' && renderAllDataSection()}
          {activeSection === 'availability' && renderAvailabilitySection()}
          {activeSection === 'communication' && renderCommunicationSection()}
          {activeSection === 'website' && renderWebsiteSection()}
          {activeSection === 'tasks' && renderTasksSection()}
          {activeSection === 'decisions' && renderDecisionsSection()}
        </div>
      </div>
    </div>
  );
};

export default Autopilot;
