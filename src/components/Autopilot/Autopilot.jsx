import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
  Zap,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  CheckCircle2,
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
  ChevronDown,
  Plus,
  Search,
  Filter,
  Download,
  ClipboardList,
  FileText,
  Printer,
  Workflow,
  UserCheck,
  MapPin,
  Repeat,
  CheckSquare,
  ListChecks,
  Inbox,
  Sparkles,
  Phone,
  List,
  Trash2,
  X,
  Save
} from 'lucide-react';
import ManualDataEntry from '../ManualDataEntry/ManualDataEntry';
import MasterCalendar from '../MasterCalendar/MasterCalendar';
import ServiceRequests from '../ServiceRequests/ServiceRequests';
import SpecializedReports from './SpecializedReports';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { generateReportHTML } from '../../services/generateReportHTML';
import { generateEnhancedReportHTML } from '../../services/enhancedReportHTML';
import { supabaseService as dataService } from '../../services/supabase';
import { tasksService } from '../../services/tasksService';

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
  const [businessReportMode, setBusinessReportMode] = useState(null); // null = selection screen, 'global' = existing report, 'enhanced' = enhanced report, 'specialized' = specialized reports

  // Maintenance & Tasks tabs state
  const [tasksActiveTab, setTasksActiveTab] = useState('tasks'); // 'tasks' or 'issues'
  const [showAutoTaskInfo, setShowAutoTaskInfo] = useState(false); // Show/hide Automatic Task Creation section

  // Tasks data from Supabase (REAL DATA)
  const [tasks, setTasks] = useState([]);
  const [taskStats, setTaskStats] = useState({ open: 0, inProgress: 0, overdue: 0, completedToday: 0 });
  const [loadingTasks, setLoadingTasks] = useState(false);

  // Advanced filters
  const [taskVillaFilter, setTaskVillaFilter] = useState('all'); // Villa filter
  const [taskDateFilter, setTaskDateFilter] = useState('all'); // today, week, month, custom, all
  const [taskCustomStartDate, setTaskCustomStartDate] = useState('');
  const [taskCustomEndDate, setTaskCustomEndDate] = useState('');
  const [taskTypeFilter, setTaskTypeFilter] = useState('all'); // cleaning, repair, maintenance, etc.
  const [taskStatusFilter, setTaskStatusFilter] = useState('all'); // all, open, assigned, in_progress, completed
  const [taskPriorityFilter, setTaskPriorityFilter] = useState('all'); // all, low, medium, high, urgent
  const [taskCategoryFilter, setTaskCategoryFilter] = useState('all'); // housekeeping, engineering, outdoor, etc.

  // Task modals
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null); // null = create new, object = edit existing

  // Guest Issues data from Supabase (REAL DATA)
  const [guestIssues, setGuestIssues] = useState([]);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null); // null = create new, object = edit existing

  // Guest Issues filters
  const [issueVillaFilter, setIssueVillaFilter] = useState('all');
  const [issueStatusFilter, setIssueStatusFilter] = useState('all'); // all, open, in_progress, resolved
  const [issuePriorityFilter, setIssuePriorityFilter] = useState('all'); // all, low, medium, high, urgent

  // Villas data (for filters and dropdowns)
  const [villas, setVillas] = useState([]);

  // Notifications and confirmations
  const [notification, setNotification] = useState(null); // { type: 'success'|'error', message: string }
  const [confirmDialog, setConfirmDialog] = useState(null); // { message: string, onConfirm: function }

  // Enhanced Report specific states
  const [enhancedSelectedVilla, setEnhancedSelectedVilla] = useState('all');
  const [enhancedStartDate, setEnhancedStartDate] = useState('2025-01-01');
  const [enhancedEndDate, setEnhancedEndDate] = useState('2026-12-31');
  const [isGeneratingEnhancedReport, setIsGeneratingEnhancedReport] = useState(false);
  const [enhancedReportHTML, setEnhancedReportHTML] = useState('<html><body style="margin:0;padding:40px;font-family:sans-serif;text-align:center;color:#666;"><h2 style="color:#FF8C42;">Enhanced Global Report</h2><p>Select property and dates, then click <strong>Generate Report</strong>.</p></body></html>');

  // Load villas when entering Tasks section
  useEffect(() => {
    if (activeSection === 'tasks' && userData?.id) {
      const loadVillas = async () => {
        try {
          const allVillas = await dataService.getVillas();
          // Filter only user's villas
          const userVillas = allVillas.filter(villa =>
            villa.name.toUpperCase().includes('NISMARA') || villa.name.toUpperCase().includes('GRAHA UMA')
          );
          setVillas(userVillas);
        } catch (error) {
          console.error('Error loading villas:', error);
        }
      };
      loadVillas();
    }
  }, [activeSection, userData]);

  // Load tasks data when entering Tasks section or filters change
  useEffect(() => {
    console.log('🔄 Tasks useEffect - section:', activeSection, 'tab:', tasksActiveTab, 'tenant_id:', userData?.id);
    if (activeSection === 'tasks' && userData?.id) {
      if (tasksActiveTab === 'tasks') {
        console.log('✅ Conditions met - calling loadTasksData');
        loadTasksData();
      } else if (tasksActiveTab === 'issues') {
        console.log('✅ Conditions met - calling loadGuestIssuesData');
        loadGuestIssuesData();
      }
    }
  }, [
    activeSection,
    taskVillaFilter,
    taskDateFilter,
    taskCustomStartDate,
    taskCustomEndDate,
    taskTypeFilter,
    taskStatusFilter,
    taskPriorityFilter,
    taskCategoryFilter,
    issueVillaFilter,
    issueStatusFilter,
    issuePriorityFilter,
    userData,
    tasksActiveTab
  ]);

  // Load tasks from Supabase with all filters
  const loadTasksData = async () => {
    console.log('🔄 loadTasksData called, userData:', userData);

    if (!userData?.id) {
      console.error('❌ No user id found in userData');
      return;
    }

    setLoadingTasks(true);
    try {
      // Build filters object
      const filters = {};

      // Villa filter
      if (taskVillaFilter !== 'all') {
        filters.villa_id = taskVillaFilter;
      }

      // Task type filter
      if (taskTypeFilter !== 'all') {
        filters.task_type = taskTypeFilter;
      }

      // Status filter
      if (taskStatusFilter !== 'all') {
        filters.status = taskStatusFilter;
      }

      // Priority filter
      if (taskPriorityFilter !== 'all') {
        filters.priority = taskPriorityFilter;
      }

      // Category filter
      if (taskCategoryFilter !== 'all') {
        filters.category = taskCategoryFilter;
      }

      console.log('📡 Calling tasksService.getTasks with filters:', filters);
      let tasksData = await tasksService.getTasks(userData.id, filters);

      // Apply date filter (client-side for now)
      if (taskDateFilter !== 'all' && tasksData.length > 0) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        tasksData = tasksData.filter(task => {
          if (!task.due_date) return taskDateFilter === 'all';

          const dueDate = new Date(task.due_date);

          switch (taskDateFilter) {
            case 'today':
              const taskDay = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
              return taskDay.getTime() === today.getTime();

            case 'week':
              const weekFromNow = new Date(today);
              weekFromNow.setDate(weekFromNow.getDate() + 7);
              return dueDate >= today && dueDate <= weekFromNow;

            case 'month':
              const monthFromNow = new Date(today);
              monthFromNow.setMonth(monthFromNow.getMonth() + 1);
              return dueDate >= today && dueDate <= monthFromNow;

            case 'custom':
              if (taskCustomStartDate && taskCustomEndDate) {
                const start = new Date(taskCustomStartDate);
                const end = new Date(taskCustomEndDate);
                end.setHours(23, 59, 59, 999); // Include full end date
                return dueDate >= start && dueDate <= end;
              }
              return true;

            default:
              return true;
          }
        });
      }

      console.log('✅ Tasks loaded and filtered:', tasksData.length);
      setTasks(tasksData);

      // Load stats (always unfiltered for dashboard overview)
      const stats = await tasksService.getTaskStats(userData.id);
      setTaskStats(stats);

      console.log('✅ Tasks count:', tasksData.length);
      console.log('✅ Stats:', stats);
    } catch (error) {
      console.error('❌ Error loading tasks:', error);
    } finally {
      setLoadingTasks(false);
    }
  };

  // Load guest issues from Supabase with filters
  const loadGuestIssuesData = async () => {
    console.log('🔄 loadGuestIssuesData called, userData:', userData);
    console.log('🔍 Filtering by tenant_id:', userData?.id);

    if (!userData?.id) {
      console.error('❌ No user id found in userData');
      return;
    }

    setLoadingIssues(true);
    try {
      // Build query WITHOUT joins (foreign keys don't exist yet)
      let query = supabase
        .from('maintenance_issues')
        .select('*')
        .eq('tenant_id', userData.id)
        .order('created_at', { ascending: false });

      // Apply filters
      if (issueVillaFilter !== 'all') {
        query = query.eq('villa_id', issueVillaFilter);
      }

      if (issueStatusFilter !== 'all') {
        query = query.eq('status', issueStatusFilter);
      }

      if (issuePriorityFilter !== 'all') {
        query = query.eq('priority', issuePriorityFilter);
      }

      console.log('🔍 Query filters:', {
        tenant_id: userData.id,
        villa_filter: issueVillaFilter,
        status_filter: issueStatusFilter,
        priority_filter: issuePriorityFilter
      });

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error loading guest issues:', error);
        setGuestIssues([]);
      } else {
        console.log('✅ Guest issues loaded:', data.length);

        // Manually add villa and booking names
        const issuesWithDetails = await Promise.all(data.map(async (issue) => {
          let villaName = null;
          let guestName = null;

          // Get villa name
          if (issue.villa_id) {
            const villa = villas.find(v => v.id === issue.villa_id);
            villaName = villa?.name || null;
          }

          // Get booking guest name
          if (issue.booking_id) {
            const { data: booking } = await supabase
              .from('bookings')
              .select('guest_name')
              .eq('id', issue.booking_id)
              .single();
            guestName = booking?.guest_name || null;
          }

          return {
            ...issue,
            villa: villaName ? { name: villaName } : null,
            booking: guestName ? { guest_name: guestName } : null
          };
        }));

        console.log('📋 Issues with details:', issuesWithDetails);
        setGuestIssues(issuesWithDetails || []);
      }
    } catch (error) {
      console.error('❌ Error loading guest issues:', error);
      setGuestIssues([]);
    } finally {
      setLoadingIssues(false);
    }
  };

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

  // Channel Sync filters
  const [channelSyncStartDate, setChannelSyncStartDate] = useState('2026-01-01');
  const [channelSyncEndDate, setChannelSyncEndDate] = useState('2026-12-31');
  const [selectedChannel, setSelectedChannel] = useState('all');

  // Detailed bookings for Channel Sync report
  const [channelBookings, setChannelBookings] = useState([]);

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

  // Data Export states
  const [exportStatus, setExportStatus] = useState('idle'); // 'idle' | 'loading' | 'done' | 'error'
  const [exportMessage, setExportMessage] = useState('');
  const [baliSheetYear, setBaliSheetYear] = useState(String(new Date().getFullYear()));
  const [baliSheetVilla, setBaliSheetVilla] = useState('all');

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

  // AUTOPILOT MENU - 11 Sections
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
      id: 'master-calendar',
      name: 'Master Calendar',
      icon: Calendar,
      description: 'Unified calendar view - Bookings, Tasks & Operations',
      badge: 'New'
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
      name: 'Channel Sync',
      icon: Wifi,
      description: 'Multi-channel booking synchronization',
      badge: '4 channels'
    },
    {
      id: 'tasks',
      name: 'Maintenance & Tasks',
      icon: Wrench,
      description: 'Operations',
      badge: '5 open'
    },
    {
      id: 'service-requests',
      name: 'Service Requests',
      icon: ClipboardList,
      description: 'Guest services',
      badge: null
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
      name: 'Customer Communication',
      icon: Mail,
      description: 'Unified inbox',
      badge: '8 new'
    },
    {
      id: 'automated-flows',
      name: 'Automated Flows',
      icon: Workflow,
      description: 'View all system automation workflows',
      badge: null
    },
    {
      id: 'data-export',
      name: 'My Data Export',
      icon: Download,
      description: 'Download your business data as HTML, Excel or CSV',
      badge: null
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

      // Load villas (properties) - Filter only Gita's 3 villas
      try {
        const villas = await dataService.getVillas();
        console.log('🔍 [AUTOPILOT] Loaded villas:', villas);

        if (villas && villas.length > 0) {
          // Filter only Gita's villas (Nismara and Graha Uma)
          const gitaVillas = villas.filter(villa =>
            villa.name.toUpperCase().includes('NISMARA') || villa.name.toUpperCase().includes('GRAHA UMA')
          );
          console.log('🔍 [AUTOPILOT] Filtered Gita villas:', gitaVillas.length, 'of', villas.length);

          // Map villas to properties format
          properties = gitaVillas.map(villa => ({
            id: villa.id,
            name: villa.name,
            location: villa.location || 'Ubud, Bali',
            property_type: villa.property_type || `${villa.bedrooms || 'N/A'} Bedroom Villa`,
            address: villa.address || 'Bali, Indonesia',
            bedrooms: villa.bedrooms,
            bathrooms: villa.bathrooms,
            description: villa.description
          }));
          console.log('✅ [AUTOPILOT] Properties mapped:', properties.length);
          setUserProperties(properties);
        }
      } catch (error) {
        console.error('❌ [AUTOPILOT] Error loading villas:', error);
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

  // Load channel statistics with date range and channel filter
  const loadChannelStats = async (startDate, endDate, channel = 'all') => {
    if (!TENANT_ID) return;

    try {
      // Load bookings with date filter
      let bookingsQuery = supabase
        .from('bookings')
        .select('*')
        .eq('tenant_id', TENANT_ID)
        .gte('check_in', startDate)
        .lte('check_in', endDate);

      const { data: bookings, error: bookingsError } = await bookingsQuery;

      if (bookingsError) {
        console.error('Error loading bookings for channels:', bookingsError);
        return;
      }

      // Filter out ONLY autopilot system bookings (ical_sync are REAL OTA bookings)
      let filteredBookings = (bookings || []).filter(booking => {
        const source = (booking.source || '').toLowerCase().trim();
        return source !== 'autopilot';
      });

      // Apply channel filter if not "all"
      if (channel !== 'all') {
        filteredBookings = filteredBookings.filter(booking => {
          const source = (booking.source || '').toLowerCase().trim();
          const bookingChannel = (booking.channel || '').toLowerCase().trim();

          if (channel === 'airbnb') {
            // Include direct airbnb bookings OR ical_sync bookings from airbnb
            return source === 'airbnb' || source === 'air bnb' ||
                   (source === 'ical_sync' && bookingChannel === 'airbnb');
          } else if (channel === 'booking.com') {
            // Include direct booking.com bookings OR ical_sync bookings from booking.com
            return source === 'booking.com' ||
                   (source === 'ical_sync' && bookingChannel === 'booking');
          } else if (channel === 'direct') {
            return source === 'gita';
          } else if (channel === 'other') {
            // Everything that's not airbnb, booking.com, or direct
            const isAirbnb = source === 'airbnb' || source === 'air bnb' ||
                            (source === 'ical_sync' && bookingChannel === 'airbnb');
            const isBooking = source === 'booking.com' ||
                             (source === 'ical_sync' && bookingChannel === 'booking');
            const isDirect = source === 'gita';
            return !isAirbnb && !isBooking && !isDirect;
          }
          return true;
        });
      }

      // Calculate channel statistics with better source classification
      const channelData = {
        airbnb: { count: 0, revenue: 0 },
        bookingCom: { count: 0, revenue: 0 },
        direct: { count: 0, revenue: 0 },
        other: { count: 0, revenue: 0 }
      };

      filteredBookings.forEach(booking => {
        const source = (booking.source || '').toLowerCase().trim();
        const bookingChannel = (booking.channel || '').toLowerCase().trim();
        const price = booking.total_price || 0;

        // Channel classification - recognize direct bookings AND ical_sync bookings
        if (source === 'ical_sync') {
          // Channel Sync bookings - classify by booking.channel field
          if (bookingChannel === 'airbnb') {
            channelData.airbnb.count++;
            channelData.airbnb.revenue += price;
          } else if (bookingChannel === 'booking') {
            channelData.bookingCom.count++;
            channelData.bookingCom.revenue += price;
          } else {
            channelData.other.count++;
            channelData.other.revenue += price;
          }
        } else if (source === 'airbnb' || source === 'air bnb') {
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

      // Save stats and filtered bookings
      setChannelStats(channelData);
      setChannelBookings(filteredBookings);
    } catch (error) {
      console.error('Error loading channel stats:', error);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadRealCounts(selectedAllInfoPeriod);
    loadChannelStats(channelSyncStartDate, channelSyncEndDate, selectedChannel);
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
      // Fetch bookings filtered ONLY by tenant_id (no hardcoded property_id)
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/bookings?tenant_id=eq.${TENANT_ID}&select=check_in,total_amount,status`,
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

  const renderAutomatedFlowsSection = () => {
    const automatedFlows = [
      {
        id: 'lead-intake',
        title: 'Lead & Booking Intake',
        description: 'Receives and normalizes leads from all channels.',
        icon: Inbox,
        status: 'active',
        iconColor: 'text-blue-400'
      },
      {
        id: 'smart-decisions',
        title: 'Smart Lead Decisions (Lumina AI)',
        description: 'AI analyzes lead status and decides next action.',
        icon: Zap,
        status: 'active',
        iconColor: 'text-purple-400'
      },
      {
        id: 'guest-journey',
        title: 'Guest Journey Automation',
        description: 'Pre-arrival, stay and post-stay automated communication.',
        icon: MapPin,
        status: 'active',
        iconColor: 'text-green-400'
      },
      {
        id: 'follow-up',
        title: 'Follow-Up Engine',
        description: 'Automatic sequences for non-booked leads.',
        icon: Repeat,
        status: 'active',
        iconColor: 'text-orange-400'
      },
      {
        id: 'owner-approvals',
        title: 'Owner Approvals',
        description: 'Owner approval system for pricing or booking exceptions.',
        icon: UserCheck,
        status: 'active',
        iconColor: 'text-yellow-400'
      },
      {
        id: 'operations-tasks',
        title: 'Operations & Tasks',
        description: 'Automatic task creation and alerts for operations.',
        icon: ListChecks,
        status: 'in-development',
        iconColor: 'text-pink-400'
      },
      {
        id: 'channel-sync',
        title: 'Channel Sync (OTA Integration)',
        description: 'Sync with Booking, Airbnb, Agoda and other channels.',
        icon: Wifi,
        status: 'in-development',
        iconColor: 'text-cyan-400'
      }
    ];

    return (
      <div className="space-y-6">
        <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-3">
            <button
              onClick={() => setActiveSection('menu')}
              className="self-start md:self-auto p-2 bg-[#1f2937]/95 backdrop-blur-sm rounded-xl hover:bg-orange-500 transition-all border border-[#d85a2a]/20"
            >
              <ArrowLeft className="w-5 h-5 text-[#FF8C42]" />
            </button>
            <div className="text-center flex-1">
              <h3 className="text-2xl font-black text-[#FF8C42] flex items-center justify-center gap-2">
                <Workflow className="w-6 h-6" />
                Automated Flows
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                System automation workflows managing your operations
              </p>
            </div>
            <div className="w-12 hidden md:block"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {automatedFlows.map((flow) => (
              <div
                key={flow.id}
                className={`bg-[#2a2f3a] rounded-2xl p-6 border-2 transition-all group relative overflow-hidden ${
                  flow.status === 'in-development'
                    ? 'border-yellow-500/50 hover:border-yellow-400 animate-pulse shadow-lg shadow-yellow-500/20'
                    : 'border-gray-700 hover:border-[#FF8C42]/40'
                }`}
              >
                {/* Glow effect for in-development */}
                {flow.status === 'in-development' && (
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-orange-500/10 pointer-events-none"></div>
                )}

                {/* Automated Badge */}
                <div className="absolute top-3 right-3 z-10">
                  {flow.status === 'active' ? (
                    <span className="px-2 py-1 bg-[#FF8C42] text-white text-xs font-bold rounded-full">
                      Active
                    </span>
                  ) : flow.status === 'in-development' ? (
                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full animate-pulse shadow-lg">
                      🚀 In Development
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs font-bold rounded-full">
                      Coming Soon
                    </span>
                  )}
                </div>

                {/* Icon */}
                <div className="mb-4 mt-2 relative z-10">
                  <flow.icon className={`w-12 h-12 ${flow.iconColor} ${
                    flow.status === 'in-development'
                      ? 'animate-bounce group-hover:scale-125'
                      : 'group-hover:scale-110'
                  } transition-transform`} />
                </div>

                {/* Title */}
                <h4 className={`font-bold text-lg mb-2 leading-tight relative z-10 ${
                  flow.status === 'in-development' ? 'text-yellow-300' : 'text-white'
                }`}>
                  {flow.title}
                </h4>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed relative z-10">
                  {flow.description}
                </p>

                {/* Status indicator */}
                {flow.status === 'active' && (
                  <div className="mt-4 flex items-center gap-2 relative z-10">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs font-medium">Automated</span>
                  </div>
                )}

                {flow.status === 'in-development' && (
                  <div className="mt-4 flex items-center gap-2 relative z-10">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse absolute"></div>
                    <span className="text-yellow-400 text-xs font-bold ml-2">Coming Very Soon!</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Info footer */}
          <div className="mt-6 bg-[#2a2f3a]/50 rounded-xl p-4 border border-gray-700">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#FF8C42] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-300 text-sm font-medium mb-1">
                  Automated Workflows
                </p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  These flows run automatically in the background, managing your property operations 24/7.
                  Active flows are currently processing your bookings and guests. Coming soon flows are being developed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
                Channel Sync
              </h3>
              <p className="text-gray-300 text-sm mt-1 font-medium">
                Multi-channel booking synchronization and revenue consolidation
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {connectedChannels} channels connected
              </p>
            </div>
            <div className="w-12 hidden md:block"></div>
          </div>

          {/* Period and Channel Selector */}
          <div className="mb-6 bg-[#2a2f3a] rounded-xl p-4 border-2 border-gray-700">
            <h4 className="text-white font-bold text-base mb-4">📅 Select Period and Channel</h4>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Start Date */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Start Date</label>
                <input
                  type="date"
                  value={channelSyncStartDate}
                  onChange={(e) => setChannelSyncStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1f2937] text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">End Date</label>
                <input
                  type="date"
                  value={channelSyncEndDate}
                  onChange={(e) => setChannelSyncEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1f2937] text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                />
              </div>

              {/* Channel Filter */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Channel</label>
                <select
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1f2937] text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Channels</option>
                  <option value="airbnb">Airbnb</option>
                  <option value="booking.com">Booking.com</option>
                  <option value="direct">Direct (Gita)</option>
                  <option value="other">Other Sources</option>
                </select>
              </div>

              {/* Apply Button */}
              <div className="flex items-end">
                <button
                  onClick={() => loadChannelStats(channelSyncStartDate, channelSyncEndDate, selectedChannel)}
                  className="w-full px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Apply Filter
                </button>
              </div>
            </div>
          </div>

          {/* Period Summary */}
          <div className="mb-6 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl p-4 md:p-6 border-2 border-orange-500/50">
            <h4 className="text-white font-bold text-base md:text-lg mb-2 flex items-center gap-2">
              📊 Period Summary - {channelSyncStartDate} to {channelSyncEndDate}
              {selectedChannel !== 'all' && (
                <span className="text-sm text-orange-300">
                  ({selectedChannel === 'airbnb' ? 'Airbnb' :
                    selectedChannel === 'booking.com' ? 'Booking.com' :
                    selectedChannel === 'direct' ? 'Direct' : 'Other'})
                </span>
              )}
            </h4>
            <p className="text-gray-300 text-xs mb-3 md:mb-4">
              Revenue and bookings are automatically consolidated across all connected sources.
            </p>
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

          {/* Connected Channels */}
          <div className="mb-4">
            <h4 className="text-white font-bold text-lg">Connected Channels</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/10 rounded-xl p-5 border-2 border-pink-500/30">
            <div className="mb-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg" alt="Airbnb" className="h-6" />
            </div>
            <p className="text-gray-300 text-sm mb-1">
              {channelStats.airbnb.count} bookings
            </p>
            <p className="text-white text-lg font-bold">
              {formatCurrency(channelStats.airbnb.revenue)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-5 border-2 border-blue-500/30">
            <div className="mb-3">
              <span className="text-blue-400 font-bold text-lg">Booking.com</span>
            </div>
            <p className="text-gray-300 text-sm mb-1">
              {channelStats.bookingCom.count} bookings
            </p>
            <p className="text-white text-lg font-bold">
              {formatCurrency(channelStats.bookingCom.revenue)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl p-5 border-2 border-orange-500/30">
            <div className="mb-3">
              <span className="text-orange-400 font-bold text-lg">Direct (Gita)</span>
            </div>
            <p className="text-gray-300 text-sm mb-1">
              {channelStats.direct.count} bookings
            </p>
            <p className="text-white text-lg font-bold">
              {formatCurrency(channelStats.direct.revenue)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-5 border-2 border-purple-500/30">
            <div className="mb-3">
              <span className="text-purple-400 font-bold text-lg">Other Sources</span>
            </div>
            <p className="text-gray-300 text-sm mb-1">
              {channelStats.other.count} bookings
            </p>
            <p className="text-white text-lg font-bold">
              {formatCurrency(channelStats.other.revenue)}
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Bali Buntu, Ibu Santi, Domus, etc.
            </p>
          </div>
        </div>

        {/* Detailed Bookings Report by Channel */}
        {channelBookings.length > 0 && (
          <div className="mt-6">
            <h4 className="text-white font-bold text-lg mb-4">
              📊 Detailed Report - {channelSyncStartDate} to {channelSyncEndDate}
              {selectedChannel !== 'all' && (
                <span className="text-sm text-orange-400 ml-2">
                  ({selectedChannel === 'airbnb' ? 'Airbnb' :
                    selectedChannel === 'booking.com' ? 'Booking.com' :
                    selectedChannel === 'direct' ? 'Direct' : 'Other'})
                </span>
              )}
            </h4>

            <div className="bg-[#2a2f3a] rounded-xl overflow-hidden border-2 border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead className="bg-orange-500">
                    <tr>
                      <th className="w-[20%] px-4 py-3 text-left text-white font-bold">Guest</th>
                      <th className="w-[15%] px-4 py-3 text-left text-white font-bold">Channel</th>
                      <th className="w-[13%] px-4 py-3 text-left text-white font-bold">Check-in</th>
                      <th className="w-[13%] px-4 py-3 text-left text-white font-bold">Check-out</th>
                      <th className="w-[10%] px-4 py-3 text-center text-white font-bold">Nights</th>
                      <th className="w-[14%] px-4 py-3 text-right text-white font-bold">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      // Group bookings by channel
                      const groupedByChannel = channelBookings.reduce((groups, booking) => {
                        const source = (booking.source || 'other').toLowerCase().trim();
                        const bookingChannel = (booking.channel || '').toLowerCase().trim();
                        let channel;

                        // Classify by channel - handle ical_sync bookings
                        if (source === 'ical_sync') {
                          // Channel Sync bookings - use booking.channel field
                          if (bookingChannel === 'airbnb') channel = 'airbnb';
                          else if (bookingChannel === 'booking') channel = 'booking.com';
                          else channel = 'other';
                        } else if (source === 'airbnb' || source === 'air bnb') {
                          channel = 'airbnb';
                        } else if (source === 'booking.com') {
                          channel = 'booking.com';
                        } else if (source === 'gita') {
                          channel = 'direct';
                        } else {
                          channel = 'other';
                        }

                        if (!groups[channel]) groups[channel] = [];
                        groups[channel].push(booking);
                        return groups;
                      }, {});

                      // Order channels: airbnb, booking.com, direct, other
                      const channelOrder = ['airbnb', 'booking.com', 'direct', 'other'];
                      const channelIcons = {
                        'airbnb': '🏠',
                        'booking.com': '💼',
                        'direct': '🏡',
                        'other': '📱'
                      };
                      const channelNames = {
                        'airbnb': 'AIRBNB',
                        'booking.com': 'BOOKING.COM',
                        'direct': 'DIRECT (GITA)',
                        'other': 'OTHER SOURCES'
                      };

                      let rows = [];
                      let rowIndex = 0;

                      channelOrder.forEach(channel => {
                        const bookings = groupedByChannel[channel] || [];
                        if (bookings.length === 0) return;

                        // Channel header row
                        rows.push(
                          <tr key={`header-${channel}`} className="bg-gray-800">
                            <td colSpan="6" className="px-4 py-2 text-left">
                              <span className="text-orange-400 font-bold text-sm">
                                {channelIcons[channel]} {channelNames[channel]}
                              </span>
                            </td>
                          </tr>
                        );

                        // Booking rows
                        bookings.forEach(booking => {
                          const checkIn = booking.check_in ? new Date(booking.check_in) : null;
                          const checkOut = booking.check_out ? new Date(booking.check_out) : null;
                          const nights = checkIn && checkOut
                            ? Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
                            : 0;

                          rows.push(
                            <tr
                              key={`booking-${booking.id}`}
                              className={`border-b border-gray-700 ${rowIndex % 2 === 0 ? 'bg-[#2a2f3a]' : 'bg-[#1f2937]'} hover:bg-[#374151] transition-colors`}
                            >
                              <td className="px-4 py-3 text-gray-300 text-sm">
                                {(() => {
                                  const source = (booking.source || '').toLowerCase();
                                  const bookingChannel = (booking.channel || '').toLowerCase();

                                  // Si es Channel Sync, mostrar claramente el nombre del channel
                                  if (source === 'ical_sync') {
                                    if (bookingChannel === 'airbnb') return 'Airbnb direct';
                                    if (bookingChannel === 'booking') return 'Booking.com direct';
                                    if (bookingChannel === 'agoda') return 'Agoda direct';
                                    if (bookingChannel === 'traveloka') return 'Traveloka direct';
                                    return (bookingChannel ? bookingChannel.charAt(0).toUpperCase() + bookingChannel.slice(1) + ' direct' : 'Channel direct');
                                  }
                                  // Si no, mostrar nombre del huésped
                                  return booking.guest_name || 'N/A';
                                })()}
                              </td>
                              <td className="px-4 py-3 text-gray-400 text-xs">
                                {(() => {
                                  const source = (booking.source || '').toLowerCase();
                                  const bookingChannel = (booking.channel || '').toLowerCase();

                                  // Show friendly channel name
                                  if (source === 'ical_sync') {
                                    if (bookingChannel === 'airbnb') return 'Airbnb';
                                    if (bookingChannel === 'booking') return 'Booking.com';
                                    if (bookingChannel === 'agoda') return 'Agoda';
                                    if (bookingChannel === 'traveloka') return 'Traveloka';
                                    return bookingChannel || 'Channel Sync';
                                  }
                                  return booking.source || 'N/A';
                                })()}
                              </td>
                              <td className="px-4 py-3 text-gray-300 text-sm whitespace-nowrap">
                                {checkIn ? checkIn.toLocaleDateString('en-GB') : 'N/A'}
                              </td>
                              <td className="px-4 py-3 text-gray-300 text-sm whitespace-nowrap">
                                {checkOut ? checkOut.toLocaleDateString('en-GB') : 'N/A'}
                              </td>
                              <td className="px-4 py-3 text-white text-sm text-center">
                                {nights}
                              </td>
                              <td className="px-4 py-3 text-white text-sm text-right whitespace-nowrap">
                                {(() => {
                                  const source = (booking.source || '').toLowerCase();
                                  const price = booking.total_price || 0;

                                  // Si es iCal sync y precio es 0, no mostrar $0
                                  if (source === 'ical_sync' && price === 0) {
                                    return <span className="text-gray-500 italic text-xs">N/A</span>;
                                  }

                                  return formatCurrency(price);
                                })()}
                              </td>
                            </tr>
                          );
                          rowIndex++;
                        });

                        // Subtotal row
                        const subtotalRevenue = bookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
                        rows.push(
                          <tr key={`subtotal-${channel}`} className="bg-gray-900 border-t-2 border-orange-500/50">
                            <td colSpan="6" className="px-4 py-2 text-center text-orange-400 font-bold text-sm">
                              SUBTOTAL {channelNames[channel]}: {bookings.length} bookings • {formatCurrency(subtotalRevenue)}
                            </td>
                          </tr>
                        );
                      });

                      // Grand total row
                      const totalBookings = channelBookings.length;
                      const totalRevenue = channelBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
                      rows.push(
                        <tr key="grand-total" className="bg-orange-500">
                          <td colSpan="6" className="px-4 py-3 text-center text-white font-black text-base">
                            TOTAL GENERAL: {totalBookings} bookings • {formatCurrency(totalRevenue)}
                          </td>
                        </tr>
                      );

                      return rows;
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
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
          <div className="text-center flex-1">
            <h3 className="text-2xl font-black text-[#FF8C42] flex items-center justify-center gap-2">
              <Mail className="w-6 h-6" />
              Customer Communication
            </h3>
            <p className="text-gray-400 text-sm mt-1">Unified AI-powered communication center</p>
          </div>
          <div className="w-12"></div>
        </div>

        {/* AI Communication Agents */}
        <div className="bg-[#2a2f3a] rounded-xl p-6 border-2 border-gray-700 mb-6">
          <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-400" />
            AI Communication Agents
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CORA - Voice AI */}
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-5 border-2 border-purple-500/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-purple-300 font-bold text-lg">CORA</p>
                  <p className="text-gray-400 text-xs">Voice AI Agent (VAPI)</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Handles incoming calls in multiple languages, answers questions, and takes bookings 24/7
              </p>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold">
                  ● Active
                </span>
                <span className="text-gray-400 text-xs">12 calls today</span>
              </div>
            </div>

            {/* BANYU - WhatsApp AI */}
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-5 border-2 border-green-500/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-green-300 font-bold text-lg">BANYU</p>
                  <p className="text-gray-400 text-xs">WhatsApp AI Agent</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Responds to WhatsApp messages instantly, provides property info, and assists with bookings
              </p>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold">
                  ● Active
                </span>
                <span className="text-gray-400 text-xs">28 chats today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Unified Inbox */}
        <div className="bg-[#2a2f3a] rounded-xl p-6 border-2 border-gray-700 mb-6">
          <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Inbox className="w-5 h-5 text-orange-400" />
            Unified Inbox
          </h4>
          <p className="text-gray-400 text-sm mb-4">
            All customer communications consolidated in one place
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg p-4 border border-green-500/30">
              <MessageSquare className="w-6 h-6 text-green-400 mb-2" />
              <p className="text-green-300 font-bold">WhatsApp</p>
              <p className="text-gray-300 text-sm">8 unread</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg p-4 border border-blue-500/30">
              <Mail className="w-6 h-6 text-blue-400 mb-2" />
              <p className="text-blue-300 font-bold">Email</p>
              <p className="text-gray-300 text-sm">3 unread</p>
            </div>

            <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/10 rounded-lg p-4 border border-pink-500/30">
              <Home className="w-6 h-6 text-pink-400 mb-2" />
              <p className="text-pink-300 font-bold">Airbnb</p>
              <p className="text-gray-300 text-sm">2 unread</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg p-4 border border-purple-500/30">
              <Phone className="w-6 h-6 text-purple-400 mb-2" />
              <p className="text-purple-300 font-bold">Voice Calls</p>
              <p className="text-gray-300 text-sm">5 missed</p>
            </div>
          </div>

          <div className="text-center mt-4">
            <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition-all">
              Open Unified Inbox
            </button>
          </div>
        </div>

        {/* Automated Messaging */}
        <div className="bg-[#2a2f3a] rounded-xl p-6 border-2 border-gray-700 mb-6">
          <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-400" />
            Automated Messaging
          </h4>
          <div className="space-y-2">
            {[
              { trigger: 'Booking confirmation', channels: ['Email', 'WhatsApp'], status: 'Active' },
              { trigger: 'Pre-arrival (24h before)', channels: ['WhatsApp', 'SMS'], status: 'Active' },
              { trigger: 'Check-in instructions', channels: ['WhatsApp', 'Email'], status: 'Active' },
              { trigger: 'Mid-stay check-in', channels: ['WhatsApp'], status: 'Active' },
              { trigger: 'Check-out reminder', channels: ['WhatsApp', 'Email'], status: 'Active' },
              { trigger: 'Post-stay review request', channels: ['Email', 'WhatsApp'], status: 'Active' }
            ].map((msg, i) => (
              <div key={i} className="bg-[#1f2937] rounded-lg p-3 border border-gray-700 flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{msg.trigger}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Channels: {msg.channels.join(', ')}
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold">
                  {msg.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Message */}
        <div className="bg-gradient-to-r from-orange-500/10 to-pink-500/10 border-2 border-orange-500/30 rounded-xl p-4">
          <p className="text-gray-300 text-sm text-center">
            <strong className="text-orange-400">CORA</strong> and <strong className="text-green-400">BANYU</strong> work together with automated workflows to provide 24/7 customer support across all channels.
            All conversations are logged in the unified inbox for your review.
          </p>
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

  // Notification Toast Component
  const NotificationToast = ({ notification, onClose }) => {
    useEffect(() => {
      if (notification) {
        const timer = setTimeout(onClose, 3000); // Auto-close after 3 seconds
        return () => clearTimeout(timer);
      }
    }, [notification, onClose]);

    if (!notification) return null;

    const bgColor = notification.type === 'success' ? 'bg-green-500' : 'bg-red-500';
    const Icon = notification.type === 'success' ? CheckCircle2 : AlertCircle;

    return (
      <div className="fixed top-4 right-4 z-[9999] animate-slide-in">
        <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px]`}>
          <Icon className="w-6 h-6 flex-shrink-0" />
          <p className="flex-1 font-medium">{notification.message}</p>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  // Confirmation Dialog Component
  const ConfirmDialog = ({ dialog, onClose }) => {
    if (!dialog) return null;

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-[#1f2937] rounded-2xl w-full max-w-md border-2 border-orange-500/30 shadow-2xl">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-500/20 rounded-full">
                <AlertCircle className="w-6 h-6 text-orange-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Confirmar Acción</h3>
                <p className="text-gray-300">{dialog.message}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 p-6 pt-0">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                dialog.onConfirm();
                onClose();
              }}
              className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Task Modal Component (Create/Edit)
  const TaskModal = ({ task, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      title: task?.title || '',
      description: task?.description || '',
      task_type: task?.task_type || 'cleaning',
      category: task?.category || 'housekeeping',
      priority: task?.priority || 'medium',
      status: task?.status || 'open',
      assignee: task?.assignee || '',
      due_date: task?.due_date ? task.due_date.split('T')[0] + 'T' + task.due_date.split('T')[1].substring(0,5) : '',
      villaId: task?.villa_id || null,
      notes: task?.notes || ''
    });

    const [villas, setVillas] = useState([]);

    useEffect(() => {
      // Load villas for dropdown - Filter only user's villas
      const loadVillas = async () => {
        try {
          const allVillas = await dataService.getVillas();
          // Filter only Gita's villas (Nismara and Graha Uma)
          const userVillas = allVillas.filter(villa =>
            villa.name.toUpperCase().includes('NISMARA') || villa.name.toUpperCase().includes('GRAHA UMA')
          );
          setVillas(userVillas);
        } catch (error) {
          console.error('Error loading villas:', error);
        }
      };
      loadVillas();
    }, []);

    const handleSubmit = (e) => {
      e.preventDefault();
      // Convert snake_case to camelCase for the service
      const taskDataForService = {
        title: formData.title,
        description: formData.description,
        taskType: formData.task_type,  // Convert to camelCase
        category: formData.category,
        priority: formData.priority,
        status: formData.status,
        assignee: formData.assignee,
        dueDate: formData.due_date,    // Convert to camelCase
        villaId: formData.villaId,
        notes: formData.notes
      };
      onSave(taskDataForService);
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 md:p-4">
        <div className="bg-[#1f2937] rounded-2xl w-[98%] sm:w-[90%] md:w-full max-w-2xl max-h-[92vh] md:max-h-[90vh] overflow-y-auto border-2 border-orange-500/30" style={{ marginLeft: '40px' }}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-700">
            <h3 className="text-xl md:text-2xl font-bold text-[#FF8C42]">
              {task ? 'Edit Task' : 'Create New Task'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-white font-bold mb-2">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-[#2a2f3a] text-white rounded-lg border-2 border-gray-700 focus:border-orange-500 outline-none"
                placeholder="e.g., Deep cleaning Villa 1"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-white font-bold mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-[#2a2f3a] text-white rounded-lg border-2 border-gray-700 focus:border-orange-500 outline-none"
                placeholder="Task details..."
              />
            </div>

            {/* Row 1: Task Type, Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-bold mb-2">Task Type *</label>
                <select
                  required
                  value={formData.task_type}
                  onChange={(e) => setFormData({ ...formData, task_type: e.target.value })}
                  className="w-full px-4 py-2 bg-[#2a2f3a] text-white rounded-lg border-2 border-gray-700 focus:border-orange-500 outline-none"
                >
                  <option value="cleaning">Cleaning</option>
                  <option value="deep_cleaning">Deep Cleaning</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="repair">Repair</option>
                  <option value="inspection">Inspection</option>
                  <option value="restocking">Restocking</option>
                  <option value="guest_request">Guest Request</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-bold mb-2">Category *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-[#2a2f3a] text-white rounded-lg border-2 border-gray-700 focus:border-orange-500 outline-none"
                >
                  <option value="housekeeping">Housekeeping</option>
                  <option value="engineering">Engineering</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="guest_request">Guest Request</option>
                  <option value="operations">Operations</option>
                </select>
              </div>
            </div>

            {/* Row 2: Priority, Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-bold mb-2">Priority *</label>
                <select
                  required
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-2 bg-[#2a2f3a] text-white rounded-lg border-2 border-gray-700 focus:border-orange-500 outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-bold mb-2">Status *</label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 bg-[#2a2f3a] text-white rounded-lg border-2 border-gray-700 focus:border-orange-500 outline-none"
                >
                  <option value="open">Open</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Row 3: Villa, Assignee */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-bold mb-2">Villa</label>
                <select
                  value={formData.villaId || ''}
                  onChange={(e) => setFormData({ ...formData, villaId: e.target.value || null })}
                  className="w-full px-4 py-2 bg-[#2a2f3a] text-white rounded-lg border-2 border-gray-700 focus:border-orange-500 outline-none"
                >
                  <option value="">No villa (general task)</option>
                  {villas.map(villa => (
                    <option key={villa.id} value={villa.id}>{villa.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white font-bold mb-2">Assignee</label>
                <input
                  type="text"
                  value={formData.assignee}
                  onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                  className="w-full px-4 py-2 bg-[#2a2f3a] text-white rounded-lg border-2 border-gray-700 focus:border-orange-500 outline-none"
                  placeholder="Staff name"
                />
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-white font-bold mb-2">Due Date</label>
              <input
                type="datetime-local"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full px-4 py-2 bg-[#2a2f3a] text-white rounded-lg border-2 border-gray-700 focus:border-orange-500 outline-none"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-white font-bold mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 bg-[#2a2f3a] text-white rounded-lg border-2 border-gray-700 focus:border-orange-500 outline-none"
                placeholder="Additional notes..."
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {task ? 'Update Task' : 'Create Task'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const IssueModal = ({ issue, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      villa_id: issue?.villa_id || '',
      booking_id: issue?.booking_id || null,
      issue_type: issue?.issue_type || 'other',
      title: issue?.title || '',
      description: issue?.description || '',
      priority: issue?.priority || 'medium',
      status: issue?.status || 'open',
      assigned_to: issue?.assigned_to || ''
    });

    const [villas, setVillas] = useState([]);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
      // Load villas for dropdown
      const loadVillas = async () => {
        try {
          const allVillas = await dataService.getVillas();
          // Filter only user's villas
          const userVillas = allVillas.filter(villa =>
            villa.name.toUpperCase().includes('NISMARA') || villa.name.toUpperCase().includes('GRAHA UMA')
          );
          setVillas(userVillas);
        } catch (error) {
          console.error('Error loading villas:', error);
        }
      };
      loadVillas();
    }, []);

    useEffect(() => {
      // Load bookings when villa is selected
      if (formData.villa_id) {
        const loadBookings = async () => {
          try {
            const { data, error } = await supabase
              .from('bookings')
              .select('id, guest_name, check_in, check_out')
              .eq('villa_id', formData.villa_id)
              .in('status', ['confirmed', 'checked_in'])
              .gte('check_out', new Date().toISOString().split('T')[0])
              .order('check_in');

            if (!error && data) {
              setBookings(data);
            }
          } catch (error) {
            console.error('Error loading bookings:', error);
          }
        };
        loadBookings();
      } else {
        setBookings([]);
        setFormData({ ...formData, booking_id: null });
      }
    }, [formData.villa_id]);

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        // Get property_id from selected villa
        const selectedVilla = villas.find(v => v.id === formData.villa_id);
        const property_id = selectedVilla?.property_id || null;

        const issueData = {
          villa_id: formData.villa_id || null,
          booking_id: formData.booking_id || null,
          issue_type: formData.issue_type,
          title: formData.title,
          description: formData.description || null,
          priority: formData.priority,
          status: formData.status,
          assigned_to: formData.assigned_to || null,
          property_id: property_id,
          tenant_id: userData.id,
          resolved_at: formData.status === 'resolved' ? new Date().toISOString() : null
        };

        if (issue?.id) {
          // Update existing issue
          const { error } = await supabase
            .from('maintenance_issues')
            .update(issueData)
            .eq('id', issue.id);

          if (error) throw error;
        } else {
          // Create new issue
          const { error } = await supabase
            .from('maintenance_issues')
            .insert([issueData]);

          if (error) throw error;
        }

        onSave();
      } catch (error) {
        console.error('Error saving guest issue:', error);
        alert('Error saving issue: ' + error.message);
      }
    };

    const issueTypes = [
      { value: 'plumbing', label: 'Plumbing' },
      { value: 'electrical', label: 'Electrical' },
      { value: 'ac', label: 'Air Conditioning' },
      { value: 'wifi', label: 'WiFi' },
      { value: 'pest', label: 'Pest Control' },
      { value: 'cleaning', label: 'Cleaning' },
      { value: 'other', label: 'Other' }
    ];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 md:p-4">
        <div className="bg-[#1f2937] rounded-2xl w-[98%] sm:w-[90%] md:w-full max-w-2xl max-h-[92vh] md:max-h-[90vh] overflow-y-auto border-2 border-orange-500/30" style={{ marginLeft: '60px' }}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-700">
            <h3 className="text-xl md:text-2xl font-bold text-[#FF8C42]">
              {issue ? 'Edit Guest Issue' : 'Report New Guest Issue'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
            {/* Villa * */}
            <div>
              <label className="block text-white font-bold mb-2">Villa *</label>
              <select
                required
                value={formData.villa_id}
                onChange={(e) => setFormData({ ...formData, villa_id: e.target.value })}
                className="w-full px-4 py-2 bg-[#2a2f3a] text-white rounded-lg border-2 border-gray-700 focus:border-orange-500 outline-none"
              >
                <option value="">Select a villa</option>
                {villas.map(villa => (
                  <option key={villa.id} value={villa.id}>{villa.name}</option>
                ))}
              </select>
            </div>

            {/* Booking (optional, depends on villa) */}
            {formData.villa_id && (
              <div>
                <label className="block text-white font-bold mb-2">Related Booking (optional)</label>
                <select
                  value={formData.booking_id || ''}
                  onChange={(e) => setFormData({ ...formData, booking_id: e.target.value || null })}
                  className="w-full px-4 py-2 bg-[#2a2f3a] text-white rounded-lg border-2 border-gray-700 focus:border-orange-500 outline-none"
                >
                  <option value="">No active booking linked</option>
                  {bookings.map(booking => (
                    <option key={booking.id} value={booking.id}>
                      {booking.guest_name} ({new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Issue Type * */}
            <div>
              <label className="block text-white font-bold mb-2">Issue Type *</label>
              <select
                required
                value={formData.issue_type}
                onChange={(e) => setFormData({ ...formData, issue_type: e.target.value })}
                className="w-full px-4 py-2 bg-[#2a2f3a] text-white rounded-lg border-2 border-gray-700 focus:border-orange-500 outline-none"
              >
                {issueTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Title * */}
            <div>
              <label className="block text-white font-bold mb-2">Title *</label>
              <input
                type="text"
                required
                maxLength={200}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-[#2a2f3a] text-white rounded-lg border-2 border-gray-700 focus:border-orange-500 outline-none"
                placeholder="e.g., AC not cooling in bedroom"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-white font-bold mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                maxLength={2000}
                rows={3}
                className="w-full px-4 py-2 bg-[#2a2f3a] text-white rounded-lg border-2 border-gray-700 focus:border-orange-500 outline-none"
                placeholder="Guest reported AC in master bedroom not reaching set temperature. Checked filter - appears clean."
              />
            </div>

            {/* Row: Priority, Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-bold mb-2">Priority *</label>
                <select
                  required
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-2 bg-[#2a2f3a] text-white rounded-lg border-2 border-gray-700 focus:border-orange-500 outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-bold mb-2">Status *</label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 bg-[#2a2f3a] text-white rounded-lg border-2 border-gray-700 focus:border-orange-500 outline-none"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            {/* Assigned To */}
            <div>
              <label className="block text-white font-bold mb-2">Assigned To</label>
              <input
                type="text"
                value={formData.assigned_to}
                onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                className="w-full px-4 py-2 bg-[#2a2f3a] text-white rounded-lg border-2 border-gray-700 focus:border-orange-500 outline-none"
                placeholder="Staff member name"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {issue ? 'Update Issue' : 'Create Issue'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

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
          <div className="text-center flex-1">
            <h3 className="text-2xl font-black text-[#FF8C42] flex items-center justify-center gap-2">
              <Wrench className="w-6 h-6" />
              Maintenance & Tasks
            </h3>
            <p className="text-gray-400 text-sm mt-1">Automated operational management</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (tasksActiveTab === 'tasks') {
                  setSelectedTask(null);
                  setShowTaskModal(true);
                } else {
                  setSelectedIssue(null);
                  setShowIssueModal(true);
                }
              }}
              className="px-2 py-1.5 md:px-4 md:py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition-all flex items-center gap-1 md:gap-2 text-xs md:text-base"
            >
              <Plus className="w-3 h-3 md:w-4 md:h-4" />
              {tasksActiveTab === 'tasks' ? 'New Task' : 'New Issue'}
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-2 mb-6 border-b-2 border-gray-700">
          <button
            onClick={() => setTasksActiveTab('tasks')}
            className={`flex items-center gap-2 px-6 py-3 font-bold transition-all ${
              tasksActiveTab === 'tasks'
                ? 'text-[#FF8C42] border-b-4 border-orange-500'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            Tasks
          </button>
          <button
            onClick={() => setTasksActiveTab('issues')}
            className={`flex items-center gap-2 px-6 py-3 font-bold transition-all ${
              tasksActiveTab === 'issues'
                ? 'text-[#FF8C42] border-b-4 border-orange-500'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <AlertCircle className="w-5 h-5" />
            Guest Issues
          </button>
        </div>

        {/* Tasks Tab Content */}
        {tasksActiveTab === 'tasks' && (
          <>

        {/* Task Overview */}
        <div className="mb-6">
          <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-orange-400" />
            Task Overview
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl p-5 border-2 border-yellow-500/30">
              <p className="text-yellow-300 text-sm font-medium mb-2">Open Tasks</p>
              <p className="text-3xl font-black text-white">{loadingTasks ? '...' : taskStats.open}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-5 border-2 border-blue-500/30">
              <p className="text-blue-300 text-sm font-medium mb-2">In Progress</p>
              <p className="text-3xl font-black text-white">{loadingTasks ? '...' : taskStats.inProgress}</p>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-5 border-2 border-green-500/30">
              <p className="text-green-300 text-sm font-medium mb-2">Completed Today</p>
              <p className="text-3xl font-black text-white">{loadingTasks ? '...' : taskStats.completedToday}</p>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-xl p-5 border-2 border-red-500/30">
              <p className="text-red-300 text-sm font-medium mb-2">Overdue</p>
              <p className="text-3xl font-black text-white">{loadingTasks ? '...' : taskStats.overdue}</p>
            </div>
          </div>
        </div>

        {/* Automatic Task Creation - Collapsible */}
        <div className="bg-[#2a2f3a] rounded-xl p-6 border-2 border-gray-700 mb-6">
          <button
            onClick={() => setShowAutoTaskInfo(!showAutoTaskInfo)}
            className="w-full flex items-center justify-between text-white font-bold text-lg hover:text-orange-400 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-400" />
              Automatic Task Creation
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${showAutoTaskInfo ? 'rotate-180' : ''}`} />
          </button>

          {showAutoTaskInfo && (
            <>
              <p className="text-gray-400 text-sm mb-4 mt-4">
                Tasks are automatically generated based on the following triggers:
              </p>
              <div className="space-y-2">
                {[
                  '✅ After booking confirmation → Cleaning & preparation tasks',
                  '✅ After checkout → Deep cleaning & inspection tasks',
                  '✅ Scheduled maintenance → Recurring tasks (pool, garden, AC)',
                  '✅ Guest requests → Custom tasks assigned to staff',
                  '✅ Inventory alerts → Restocking tasks'
                ].map((trigger, i) => (
                  <div key={i} className="bg-[#1f2937] rounded-lg p-3 border border-gray-700">
                    <p className="text-gray-300 text-sm">{trigger}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Real Tasks from Supabase */}
        <div className="space-y-3">
          {/* Title */}
          <h4 className="text-white font-bold text-lg flex items-center gap-2 mb-3">
            <List className="w-5 h-5 text-orange-400" />
            Current Tasks ({loadingTasks ? '...' : tasks.length})
          </h4>

          {/* Advanced Filters - Single Row */}
          <div className="space-y-3">
              {/* All Filters in One Row */}
              <div className="grid grid-cols-2 md:grid-cols-[0.9fr_0.85fr_0.95fr_0.8fr_0.75fr_0.75fr] gap-1.5">
                {/* Villa Filter */}
                <select
                  value={taskVillaFilter}
                  onChange={(e) => setTaskVillaFilter(e.target.value)}
                  className="px-2 py-2 bg-[#2a2f3a] text-white rounded-lg text-xs border border-gray-700 focus:border-orange-500 outline-none"
                >
                  <option value="all">Villas</option>
                  {userProperties.map(villa => (
                    <option key={villa.id} value={villa.id}>{villa.name}</option>
                  ))}
                </select>

                {/* Date Filter */}
                <select
                  value={taskDateFilter}
                  onChange={(e) => setTaskDateFilter(e.target.value)}
                  className="px-1.5 py-2 bg-[#2a2f3a] text-white rounded-lg text-xs border border-gray-700 focus:border-orange-500 outline-none"
                >
                  <option value="all">Dates</option>
                  <option value="today">Today</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                  <option value="custom">Custom</option>
                </select>

                {/* Category Filter */}
                <select
                  value={taskCategoryFilter}
                  onChange={(e) => setTaskCategoryFilter(e.target.value)}
                  className="px-1.5 py-2 bg-[#2a2f3a] text-white rounded-lg text-xs border border-gray-700 focus:border-orange-500 outline-none"
                >
                  <option value="all">Categories</option>
                  <option value="housekeeping">Housekeeping</option>
                  <option value="engineering">Engineering</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="guest_request">Guest Request</option>
                  <option value="operations">Operations</option>
                </select>

                {/* Type Filter */}
                <select
                  value={taskTypeFilter}
                  onChange={(e) => setTaskTypeFilter(e.target.value)}
                  className="px-1.5 py-2 bg-[#2a2f3a] text-white rounded-lg text-xs border border-gray-700 focus:border-orange-500 outline-none"
                >
                  <option value="all">Types</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="deep_cleaning">Deep Clean</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="repair">Repair</option>
                  <option value="inspection">Inspection</option>
                  <option value="restocking">Restocking</option>
                  <option value="guest_request">Guest Req</option>
                  <option value="other">Other</option>
                </select>

                {/* Status Filter */}
                <select
                  value={taskStatusFilter}
                  onChange={(e) => setTaskStatusFilter(e.target.value)}
                  className="px-1.5 py-2 bg-[#2a2f3a] text-white rounded-lg text-xs border border-gray-700 focus:border-orange-500 outline-none"
                >
                  <option value="all">Status</option>
                  <option value="open">Open</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {/* Priority Filter */}
                <select
                  value={taskPriorityFilter}
                  onChange={(e) => setTaskPriorityFilter(e.target.value)}
                  className="px-1.5 py-2 bg-[#2a2f3a] text-white rounded-lg text-xs border border-gray-700 focus:border-orange-500 outline-none"
                >
                  <option value="all">Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Custom Date Range (if selected) */}
              {taskDateFilter === 'custom' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">From</label>
                    <input
                      type="date"
                      value={taskCustomStartDate}
                      onChange={(e) => setTaskCustomStartDate(e.target.value)}
                      className="w-full px-3 py-2 bg-[#2a2f3a] text-white rounded-lg text-sm border border-gray-700 focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">To</label>
                    <input
                      type="date"
                      value={taskCustomEndDate}
                      onChange={(e) => setTaskCustomEndDate(e.target.value)}
                      className="w-full px-3 py-2 bg-[#2a2f3a] text-white rounded-lg text-sm border border-gray-700 focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Clear Filters Button */}
              <button
                onClick={() => {
                  setTaskVillaFilter('all');
                  setTaskDateFilter('all');
                  setTaskCustomStartDate('');
                  setTaskCustomEndDate('');
                  setTaskTypeFilter('all');
                  setTaskStatusFilter('all');
                  setTaskPriorityFilter('all');
                  setTaskCategoryFilter('all');
                }}
                className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-bold transition-all"
              >
                Clear Filters
              </button>
            </div>

          {loadingTasks ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No tasks found</p>
            </div>
          ) : (
            tasks.map((task) => {
              // Format due date
              const dueDate = task.due_date ? new Date(task.due_date) : null;
              const dueDateStr = dueDate ? dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'No due date';

              // Check if overdue
              const isOverdue = dueDate && dueDate < new Date() && !['completed', 'cancelled'].includes(task.status);

              return (
                <div key={task.id} className="bg-[#2a2f3a] rounded-lg p-4 border-2 border-gray-700 hover:border-orange-500/50 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div
                      className="flex-1 cursor-pointer touch-manipulation"
                      onClick={() => {
                        setSelectedTask(task); // Set task to edit
                        setShowTaskModal(true);
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        setSelectedTask(task);
                        setShowTaskModal(true);
                      }}
                    >
                      <h4 className="text-white font-bold hover:text-orange-400 transition-colors">{task.title}</h4>
                      <p className="text-gray-400 text-sm">
                        {task.category || task.task_type}
                        {task.assignee && ` • ${task.assignee}`}
                        {task.villa?.name && ` • ${task.villa.name}`}
                        {` • Due: ${dueDateStr}`}
                      </p>
                      {task.source && (
                        <p className="text-gray-500 text-xs mt-1">
                          Source: {task.source === 'auto_booking' ? '🤖 Auto-created' : task.source === 'manual' ? '👤 Manual' : task.source}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                        task.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                        task.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                        task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {task.priority?.toUpperCase() || 'MEDIUM'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                        isOverdue ? 'bg-red-500/20 text-red-400' :
                        task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        task.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                        task.status === 'assigned' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {isOverdue ? 'OVERDUE' :
                         task.status === 'in_progress' ? 'In Progress' :
                         task.status === 'assigned' ? 'Assigned' :
                         task.status === 'completed' ? 'Completed' :
                         'Open'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDialog({
                            message: `Delete task "${task.title}"?`,
                            onConfirm: async () => {
                              try {
                                await tasksService.deleteTask(task.id);
                                setNotification({ type: 'success', message: `Task "${task.title}" deleted successfully` });
                                await loadTasksData();
                              } catch (error) {
                                setNotification({ type: 'error', message: 'Error deleting task' });
                              }
                            }
                          });
                        }}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all touch-manipulation"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        </>
        )}

        {/* Guest Issues Tab Content */}
        {tasksActiveTab === 'issues' && (
        <>
          {/* Filters */}
          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-[#FF8C42]" />
              <h4 className="text-white font-bold">Filters</h4>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {/* Villa Filter */}
              <div>
                <label className="block text-gray-400 text-sm mb-1">Villa</label>
                <select
                  value={issueVillaFilter}
                  onChange={(e) => setIssueVillaFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-[#2a2f3a] text-white rounded-lg border border-gray-700 text-sm"
                >
                  <option value="all">All Villas</option>
                  {villas.map(villa => (
                    <option key={villa.id} value={villa.id}>{villa.name}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-gray-400 text-sm mb-1">Status</label>
                <select
                  value={issueStatusFilter}
                  onChange={(e) => setIssueStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-[#2a2f3a] text-white rounded-lg border border-gray-700 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-gray-400 text-sm mb-1">Priority</label>
                <select
                  value={issuePriorityFilter}
                  onChange={(e) => setIssuePriorityFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-[#2a2f3a] text-white rounded-lg border border-gray-700 text-sm"
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setIssueVillaFilter('all');
                setIssueStatusFilter('all');
                setIssuePriorityFilter('all');
              }}
              className="w-full mt-3 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-bold transition-all"
            >
              Clear Filters
            </button>
          </div>

          {/* Issues List */}
          <div className="space-y-3">
          {loadingIssues ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Loading guest issues...</p>
            </div>
          ) : guestIssues.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No guest issues found</p>
              <p className="text-gray-500 text-sm mt-2">Click "New Issue" to report a guest issue</p>
            </div>
          ) : (
            guestIssues.map((issue) => {
              // Priority colors
              const priorityColors = {
                low: 'bg-gray-500/20 text-gray-300',
                medium: 'bg-yellow-500/20 text-yellow-300',
                high: 'bg-orange-500/20 text-orange-300',
                urgent: 'bg-red-500/20 text-red-300'
              };

              // Status colors
              const statusColors = {
                open: 'bg-blue-500/20 text-blue-300',
                in_progress: 'bg-yellow-500/20 text-yellow-300',
                resolved: 'bg-green-500/20 text-green-300'
              };

              // Format issue type
              const issueTypeLabels = {
                plumbing: 'Plumbing',
                electrical: 'Electrical',
                ac: 'Air Conditioning',
                wifi: 'WiFi',
                pest: 'Pest Control',
                cleaning: 'Cleaning',
                other: 'Other'
              };

              // Format created date
              const createdDate = new Date(issue.created_at);
              const now = new Date();
              const diffMs = now - createdDate;
              const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
              const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

              let createdStr;
              if (diffHours < 1) {
                createdStr = 'Just now';
              } else if (diffHours < 24) {
                createdStr = `${diffHours}h ago`;
              } else if (diffDays < 7) {
                createdStr = `${diffDays}d ago`;
              } else {
                createdStr = createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }

              return (
                <div
                  key={issue.id}
                  className="bg-[#2a2f3a] rounded-xl p-4 border-2 border-gray-700 hover:border-orange-500/50 transition-all cursor-pointer"
                  onClick={() => {
                    setSelectedIssue(issue);
                    setShowIssueModal(true);
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    {/* Main Info */}
                    <div className="flex-1 cursor-pointer touch-manipulation">
                      {/* Title and Priority */}
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-white font-bold">{issue.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${priorityColors[issue.priority]}`}>
                          {issue.priority.toUpperCase()}
                        </span>
                      </div>

                      {/* Villa, Type, Guest */}
                      <div className="flex flex-wrap items-center gap-3 text-sm mb-2">
                        <div className="flex items-center gap-1 text-gray-400">
                          <Home className="w-4 h-4" />
                          <span>{issue.villa?.name || 'No villa'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <AlertCircle className="w-4 h-4" />
                          <span>{issueTypeLabels[issue.issue_type]}</span>
                        </div>
                        {issue.booking?.guest_name && (
                          <div className="flex items-center gap-1 text-gray-400">
                            <Users className="w-4 h-4" />
                            <span>{issue.booking.guest_name}</span>
                          </div>
                        )}
                      </div>

                      {/* Description preview */}
                      {issue.description && (
                        <p className="text-gray-400 text-sm line-clamp-2">{issue.description}</p>
                      )}
                    </div>

                    {/* Right Side: Status, Date, Actions */}
                    <div className="flex md:flex-col items-center md:items-end gap-2">
                      {/* Status Badge */}
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[issue.status]}`}>
                        {issue.status.replace('_', ' ').toUpperCase()}
                      </span>

                      {/* Created Date */}
                      <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <Clock className="w-3 h-3" />
                        <span>{createdStr}</span>
                      </div>

                      {/* Assigned To */}
                      {issue.assigned_to && (
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                          <UserCheck className="w-3 h-3" />
                          <span>{issue.assigned_to}</span>
                        </div>
                      )}

                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDialog({
                            show: true,
                            title: 'Delete Guest Issue',
                            message: `Are you sure you want to delete "${issue.title}"? This action cannot be undone.`,
                            onConfirm: async () => {
                              try {
                                await supabase
                                  .from('maintenance_issues')
                                  .delete()
                                  .eq('id', issue.id);

                                setNotification({ type: 'success', message: 'Guest issue deleted successfully' });
                                await loadGuestIssuesData();
                              } catch (error) {
                                console.error('Error deleting issue:', error);
                                setNotification({ type: 'error', message: 'Error deleting issue: ' + error.message });
                              }
                            }
                          });
                        }}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-all group"
                        title="Delete issue"
                      >
                        <Trash2 className="w-4 h-4 text-gray-500 group-hover:text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          </div>
        </>
        )}

      </div>
    </div>
  );

  const renderBusinessReportsSection = () => {
    // If no mode selected, show selection screen
    if (businessReportMode === null) {
      return (
        <div className="space-y-6">
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20">
            <div className="flex items-center mb-6 gap-4">
              <button
                onClick={() => setActiveSection('menu')}
                className="p-2 bg-[#1f2937]/95 backdrop-blur-sm rounded-xl hover:bg-orange-500 transition-all border border-[#d85a2a]/20"
              >
                <ArrowLeft className="w-5 h-5 text-[#FF8C42]" />
              </button>
              <h3 className="text-xl md:text-2xl font-black text-[#FF8C42] flex items-center gap-2 flex-1">
                <FileText className="w-5 h-5 md:w-6 md:h-6" />
                <span>Business Reports</span>
              </h3>
            </div>

            <div className="text-center mb-8">
              <p className="text-gray-300 text-lg">Choose the type of report you want to generate:</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Global Report Option */}
              <button
                onClick={() => setBusinessReportMode('global')}
                className="bg-gradient-to-br from-white to-gray-100 hover:from-gray-50 hover:to-gray-200 text-gray-900 p-6 rounded-2xl shadow-2xl transition-all transform hover:scale-105 border-2 border-[#FF8C42]/50"
              >
                <FileText className="w-12 h-12 mx-auto mb-3 text-[#FF8C42]" />
                <h4 className="text-xl font-bold mb-2 text-[#FF8C42]">Global Report</h4>
                <p className="text-gray-700 text-sm">
                  Current version with OSIRIS AI insights and performance metrics
                </p>
              </button>

              {/* Enhanced Global Report Option - NEW */}
              <button
                onClick={() => setBusinessReportMode('enhanced')}
                className="bg-gradient-to-br from-[#f5a524] to-[#FF8C42] hover:from-[#ffc107] hover:to-[#f5a524] text-white p-6 rounded-2xl shadow-2xl transition-all transform hover:scale-105 border-2 border-[#FF8C42]/50"
              >
                <TrendingUp className="w-12 h-12 mx-auto mb-3" />
                <h4 className="text-xl font-bold mb-2">Enhanced Global Report</h4>
                <p className="text-white/90 text-sm">
                  Complete version with ADR, RevPAR, monthly trends, and financial statements
                </p>
              </button>

              {/* Specialized Reports Option */}
              <button
                onClick={() => setBusinessReportMode('specialized')}
                className="bg-gradient-to-br from-[#FF8C42] to-[#d85a2a] hover:from-[#f5a524] hover:to-[#FF8C42] text-white p-6 rounded-2xl shadow-2xl transition-all transform hover:scale-105 border-2 border-[#FF8C42]/30"
              >
                <BarChart3 className="w-12 h-12 mx-auto mb-3" />
                <h4 className="text-xl font-bold mb-2">Specialized Reports</h4>
                <p className="text-white/90 text-sm">
                  Individual reports: occupancy, channels, ADR/RevPAR, cancellations, statements
                </p>
              </button>
            </div>
          </div>
        </div>
      );
    }

    // If 'specialized' mode selected, show new component
    if (businessReportMode === 'specialized') {
      return (
        <div className="space-y-6">
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20">
            <div className="flex items-center mb-6 gap-4">
              <button
                onClick={() => setBusinessReportMode(null)}
                className="p-2 bg-[#1f2937]/95 backdrop-blur-sm rounded-xl hover:bg-orange-500 transition-all border border-[#d85a2a]/20"
              >
                <ArrowLeft className="w-5 h-5 text-[#FF8C42]" />
              </button>
              <h3 className="text-xl md:text-2xl font-black text-[#FF8C42] flex items-center gap-2 flex-1">
                <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />
                <span>Specialized Reports</span>
              </h3>
            </div>
          </div>
          <SpecializedReports />
        </div>
      );
    }

    // If 'enhanced' mode selected, show Enhanced Global Report
    if (businessReportMode === 'enhanced') {
      // Get logged-in user data
      const ownerId = userData?.id || '1f32d384-4018-46a9-a6f9-058217e6924a'; // Gita's ID as default
      const ownerName = 'Gita Pradnyana';
      const businessName = 'Nismara Uma Villa';
      const currency = 'IDR';

      // Villa selector options (exact Supabase names)
      const villas = [
        { value: 'all', label: 'All Properties' },
        { value: 'graha-uma', label: 'Graha Uma 1 Bedroom Pool Villa' },
        { value: 'nismara-1br', label: 'Nismara 1BR Villa' },
        { value: 'nismara-2br', label: 'NISMARA 2 BEDROOM POOL VILLA' }
      ];

      // Villa ID mapping (exact Supabase names)
      const villaIdMap = {
        'all': null,
        'graha-uma': 'b2000002-0002-4002-8002-000000000002',      // Graha Uma 1 Bedroom Pool Villa (16 bookings)
        'nismara-1br': 'b1000001-0001-4001-8001-000000000001',   // Nismara 1BR Villa (0 bookings)
        'nismara-2br': 'b3000003-0003-4003-8003-000000000003'    // NISMARA 2 BEDROOM POOL VILLA (52 bookings)
      };

      // Get current property name for display
      const currentProperty = villas.find(v => v.value === enhancedSelectedVilla)?.label || 'All Properties';

      const handleEnhancedPrint = () => {
        const iframe = document.getElementById('enhanced-report-frame');
        if (iframe) {
          iframe.contentWindow.print();
        }
      };

      const handleEnhancedGenerate = async () => {
        setIsGeneratingEnhancedReport(true);
        console.log('🔄 Generating Enhanced Report with latest version...');

        try {
          // Import enhanced services
          const { generateBusinessReport } = await import('../../services/enhancedReportService');

          // Get villa ID based on selection
          const villaId = villaIdMap[enhancedSelectedVilla];

          // Determine property name for display
          const propertyName = enhancedSelectedVilla === 'all'
            ? businessName
            : villas.find(v => v.value === enhancedSelectedVilla)?.label;

          // Use custom date range
          console.log(`📊 Generating Enhanced Report for ${propertyName} (${enhancedStartDate} to ${enhancedEndDate})...`);

          // Generate report data (calls Supabase + OSIRIS) with optional villa filter
          const reportData = await generateBusinessReport(
            ownerId,
            ownerName,
            propertyName,
            currency,
            enhancedStartDate,
            enhancedEndDate,
            villaId  // Pass villaId (null for 'all', specific ID otherwise)
          );

          if (reportData) {
            console.log('✅ Data generated, creating Enhanced HTML...');

            // Generate complete Enhanced HTML with 4 pages
            const reportHTML = generateEnhancedReportHTML(
              ownerName,
              propertyName,
              currency,
              reportData,
              reportData.osirisAnalysis,
              enhancedStartDate,
              enhancedEndDate
            );

            // Display in iframe and save to localStorage
            setEnhancedReportHTML(reportHTML);
            localStorage.setItem(`enhanced-report-${enhancedSelectedVilla}-${enhancedStartDate}-${enhancedEndDate}`, reportHTML);
            console.log(`✅ Enhanced Report generated and saved for ${enhancedSelectedVilla} (${enhancedStartDate} to ${enhancedEndDate})`);
          } else {
            alert('❌ Error generating report. No data found.');
          }
        } catch (error) {
          console.error('Error generating Enhanced Report:', error);
          alert('❌ Error: ' + error.message);
        } finally {
          setIsGeneratingEnhancedReport(false);
        }
      };

      return (
        <div className="space-y-6">
          {/* Header with Owner Selector and Action Buttons */}
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20">
            {/* Header Row with Back Button and Title */}
            <div className="flex items-center mb-6 gap-4">
              <button
                onClick={() => setBusinessReportMode(null)}
                className="p-2 bg-[#1f2937]/95 backdrop-blur-sm rounded-xl hover:bg-orange-500 transition-all border border-[#d85a2a]/20"
              >
                <ArrowLeft className="w-5 h-5 text-[#FF8C42]" />
              </button>
              <h3 className="text-xl md:text-2xl font-black text-[#FF8C42] flex items-center gap-2 flex-1">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
                <span className="hidden md:inline">Enhanced Global Report - {currentProperty}</span>
                <span className="md:hidden">Enhanced Report</span>
              </h3>

              {/* Action Buttons - Top Right Corner, Stacked Vertically */}
              <div className="flex flex-col gap-2 ml-auto">
                <button
                  onClick={handleEnhancedGenerate}
                  disabled={isGeneratingEnhancedReport}
                  className={`flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg font-semibold transition-all shadow-lg text-sm ${
                    isGeneratingEnhancedReport
                      ? 'bg-purple-400 cursor-not-allowed'
                      : 'bg-purple-500 hover:bg-purple-600'
                  }`}
                >
                  {isGeneratingEnhancedReport ? (
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
                  onClick={handleEnhancedPrint}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all shadow-lg text-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Selectors Row - Property and Date Range */}
            <div className="flex flex-col gap-4">
              {/* Select Property */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-300 text-xs font-semibold uppercase">Property:</label>
                <select
                  value={enhancedSelectedVilla}
                  onChange={(e) => setEnhancedSelectedVilla(e.target.value)}
                  className="bg-[#374151] text-white px-4 py-2 rounded-lg border-2 border-orange-500/30 focus:border-orange-500 focus:outline-none hover:border-orange-500/50 transition-all cursor-pointer w-full"
                >
                  {villas.map(villa => (
                    <option key={villa.value} value={villa.value}>
                      {villa.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-300 text-xs font-semibold uppercase">Date Range:</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={enhancedStartDate}
                    onChange={(e) => setEnhancedStartDate(e.target.value)}
                    className="px-4 py-2 bg-[#374151] text-white rounded-lg border-2 border-purple-500/30 focus:border-purple-500 focus:outline-none hover:border-purple-500/50 transition-all"
                  />
                  <input
                    type="date"
                    value={enhancedEndDate}
                    onChange={(e) => setEnhancedEndDate(e.target.value)}
                    className="px-4 py-2 bg-[#374151] text-white rounded-lg border-2 border-purple-500/30 focus:border-purple-500 focus:outline-none hover:border-purple-500/50 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Report Display - Taller for 4 pages */}
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200" style={{ height: '1400px', overflowY: 'auto', overflowX: 'hidden' }}>
            <iframe
              srcDoc={enhancedReportHTML}
              id="enhanced-report-frame"
              style={{
                width: '100%',
                height: '4500px',
                border: 'none',
                display: 'block'
              }}
              title="Enhanced Global Report"
            />
          </div>
        </div>
      );
    }

    // If 'global' mode selected, show existing Global Report code (DO NOT MODIFY)
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
            reportData.osirisAnalysis,
            startDate,
            endDate
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
              onClick={() => setBusinessReportMode(null)}
              className="p-2 bg-[#1f2937]/95 backdrop-blur-sm rounded-xl hover:bg-orange-500 transition-all border border-[#d85a2a]/20"
            >
              <ArrowLeft className="w-5 h-5 text-[#FF8C42]" />
            </button>
            <h3 className="text-xl md:text-2xl font-black text-[#FF8C42] flex items-center gap-2 flex-1">
              <FileText className="w-5 h-5 md:w-6 md:h-6" />
              <span className="hidden md:inline">Global Business Report - {currentOwner.property}</span>
              <span className="md:hidden">Global Report</span>
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

  const renderDataExportSection = () => {
    const fetchAllData = async () => {
      const tenantId = TENANT_ID;
      const [allVillas, bookings, leads, tasks] = await Promise.all([
        dataService.getVillas().catch(() => []),  // villas has no tenant_id column
        dataService.getBookings({ tenant_id: tenantId }).catch(() => []),
        dataService.getLeads({ tenant_id: tenantId }).catch(() => []),
        dataService.getTasks({ tenant_id: tenantId }).catch(() => [])
      ]);

      // Identify user's villas via currency:
      // Bookings link to villa_ids → find those villas' currency → filter ALL villas by that currency
      // This includes villas with 0 bookings (e.g. Graha Uma with no bookings yet)
      const bookedVillaIds = new Set(bookings.map(b => b.villa_id).filter(Boolean));
      const bookedVillas = allVillas.filter(v => bookedVillaIds.has(v.id));
      const userVillaCurrency = bookedVillas[0]?.currency || null;
      const properties = userVillaCurrency
        ? allVillas.filter(v => v.currency === userVillaCurrency)
        : bookedVillas; // fallback to just booked villas if no currency detected

      // Payment data comes from bookings (total_price, payment_status)
      const payments = bookings.filter(b => b.total_price || b.payment_status);

      return { properties, bookings, payments, leads, tasks };
    };

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB') : '';

    // Currency formatter — built after fetchAllData so we know the user's villa currency
    const makeCurrencyFormatter = (propertiesList) => {
      const villasCurrency = propertiesList[0]?.currency || 'IDR';
      const isUSD = villasCurrency === 'USD';
      return (n) => {
        if (!n) return isUSD ? '$ 0.00' : 'Rp 0';
        const formatted = Number(n).toLocaleString(isUSD ? 'en-US' : 'id-ID', isUSD ? { minimumFractionDigits: 2 } : {});
        return isUSD ? `$ ${formatted}` : `Rp ${formatted}`;
      };
    };

    // ---- HTML SUMMARY ----
    const handleDownloadHTML = async () => {
      try {
        setExportStatus('loading');
        setExportMessage('Fetching data...');
        const { properties, bookings, payments, leads, tasks } = await fetchAllData();
        const formatCurrency = makeCurrencyFormatter(properties);
        setExportMessage('Generating HTML...');

        const now = new Date().toLocaleString('en-GB');
        const totalRevenue = payments.reduce((s, p) => s + Number(p.total_price || 0), 0);

        const tableStyle = 'border-collapse:collapse;width:100%;margin-bottom:24px;font-size:13px;';
        const thStyle = 'background:#f97316;color:#fff;padding:8px 12px;text-align:left;border:1px solid #e2e8f0;';
        const tdStyle = 'padding:7px 12px;border:1px solid #e2e8f0;vertical-align:top;';
        const trEven = 'background:#fff8f5;';

        const tableHtml = (headers, rows) => `
          <table style="${tableStyle}">
            <thead><tr>${headers.map(h => `<th style="${thStyle}">${h}</th>`).join('')}</tr></thead>
            <tbody>${rows.map((r, i) => `<tr style="${i % 2 ? trEven : ''}">${r.map(c => `<td style="${tdStyle}">${c ?? ''}</td>`).join('')}</tr>`).join('')}</tbody>
          </table>`;

        const propRows = properties.map(p => [p.name || '', p.property_type || '', p.location || '', p.bedrooms || '', p.price_per_night ? formatCurrency(p.price_per_night) : '']);
        const bookRows = bookings.map(b => [b.guest_name || '', formatDate(b.check_in), formatDate(b.check_out), b.villa_name || b.property_name || '', b.total_price ? formatCurrency(b.total_price) : '', b.status || '']);
        const payRows = payments.map(p => [p.guest_name || '', formatDate(p.check_in) + ' → ' + formatDate(p.check_out), p.total_price ? formatCurrency(p.total_price) : '', p.amount_paid ? formatCurrency(p.amount_paid) : '', p.payment_status || p.status || '']);
        const leadRows = leads.map(l => [l.name || '', l.email || '', l.phone || '', l.status || '', l.source || '', formatDate(l.created_at)]);
        const taskRows = tasks.map(t => [t.title || '', t.task_type || '', t.priority || '', t.status || '', t.description || '', formatDate(t.created_at)]);

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>MY HOST BizMate – Data Export ${now}</title>
  <style>
    body{font-family:Arial,sans-serif;color:#1a202c;padding:32px;max-width:1100px;margin:0 auto;}
    h1{color:#f97316;font-size:26px;margin-bottom:4px;}
    h2{color:#c2410c;font-size:18px;margin:28px 0 10px;}
    .meta{color:#718096;font-size:12px;margin-bottom:32px;}
    .summary{display:flex;gap:20px;flex-wrap:wrap;margin-bottom:32px;}
    .card{background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:14px 20px;min-width:140px;}
    .card-label{font-size:11px;color:#9a3412;text-transform:uppercase;letter-spacing:1px;}
    .card-value{font-size:22px;font-weight:700;color:#f97316;}
    @media print{body{padding:10px;}}
  </style>
</head>
<body>
  <h1>MY HOST BizMate – Business Data Export</h1>
  <p class="meta">Generated: ${now} &nbsp;|&nbsp; Owner: ${userData?.full_name || 'Owner'}</p>
  <div class="summary">
    <div class="card"><div class="card-label">Properties</div><div class="card-value">${properties.length}</div></div>
    <div class="card"><div class="card-label">Bookings</div><div class="card-value">${bookings.length}</div></div>
    <div class="card"><div class="card-label">Payments</div><div class="card-value">${payments.length}</div></div>
    <div class="card"><div class="card-label">Clients / Leads</div><div class="card-value">${leads.length}</div></div>
    <div class="card"><div class="card-label">Tasks</div><div class="card-value">${tasks.length}</div></div>
    <div class="card"><div class="card-label">Total Revenue</div><div class="card-value">${formatCurrency(totalRevenue)}</div></div>
  </div>

  <h2>Properties (${properties.length})</h2>
  ${tableHtml(['Name','Type','Location','Bedrooms','Price / Night'], propRows)}

  <h2>Bookings (${bookings.length})</h2>
  ${tableHtml(['Guest','Check-in','Check-out','Property','Amount','Status'], bookRows)}

  <h2>Payments (${payments.length})</h2>
  ${tableHtml(['Guest','Period','Total Amount','Paid','Payment Status'], payRows)}

  <h2>Clients / Leads (${leads.length})</h2>
  ${tableHtml(['Name','Email','Phone','Status','Source','Created'], leadRows)}

  <h2>Maintenance & Tasks (${tasks.length})</h2>
  ${tableHtml(['Title','Category','Priority','Status','Description','Created'], taskRows)}
</body>
</html>`;

        const blob = new Blob([html], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `myhost-bizmate-data-${new Date().toISOString().slice(0, 10)}.html`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 200);
        setExportStatus('done');
        setExportMessage('HTML downloaded successfully');
        setTimeout(() => setExportStatus('idle'), 4000);
      } catch (err) {
        console.error('HTML export error:', err);
        setExportStatus('error');
        setExportMessage('Export failed: ' + err.message);
      }
    };

    // ---- EXCEL ----
    const handleDownloadExcel = async () => {
      try {
        setExportStatus('loading');
        setExportMessage('Fetching data...');
        const { properties, bookings, payments, leads, tasks } = await fetchAllData();
        const formatCurrency = makeCurrencyFormatter(properties); // eslint-disable-line no-unused-vars
        setExportMessage('Generating Excel...');

        const wb = XLSX.utils.book_new();

        const propSheet = XLSX.utils.json_to_sheet(properties.map(p => ({
          Name: p.name || '',
          Type: p.property_type || '',
          Location: p.location || '',
          Bedrooms: p.bedrooms || '',
          'Price/Night': p.price_per_night || 0,
          Status: p.status || ''
        })));
        XLSX.utils.book_append_sheet(wb, propSheet, 'Properties');

        const bookSheet = XLSX.utils.json_to_sheet(bookings.map(b => ({
          'Guest Name': b.guest_name || '',
          'Check-in': formatDate(b.check_in),
          'Check-out': formatDate(b.check_out),
          Property: b.villa_name || b.property_name || '',
          Nights: b.nights || '',
          Amount: b.total_price || 0,
          Channel: b.channel || '',
          Status: b.status || '',
          Created: formatDate(b.created_at)
        })));
        XLSX.utils.book_append_sheet(wb, bookSheet, 'Bookings');

        const paySheet = XLSX.utils.json_to_sheet(payments.map(p => ({
          'Guest Name': p.guest_name || '',
          'Check-in': formatDate(p.check_in),
          'Check-out': formatDate(p.check_out),
          Property: p.villa_name || p.property_name || '',
          'Total Amount': p.total_price || 0,
          'Amount Paid': p.amount_paid || 0,
          'Payment Status': p.payment_status || p.status || '',
          Channel: p.channel || ''
        })));
        XLSX.utils.book_append_sheet(wb, paySheet, 'Payments');

        const leadSheet = XLSX.utils.json_to_sheet(leads.map(l => ({
          Name: l.name || '',
          Email: l.email || '',
          Phone: l.phone || '',
          Status: l.status || '',
          Source: l.source || '',
          'Lead Score': l.lead_score || '',
          Country: l.country || '',
          Created: formatDate(l.created_at)
        })));
        XLSX.utils.book_append_sheet(wb, leadSheet, 'Clients & Leads');

        const taskSheet = XLSX.utils.json_to_sheet(tasks.map(t => ({
          Title: t.title || '',
          Category: t.task_type || '',
          Priority: t.priority || '',
          Status: t.status || '',
          Description: t.description || '',
          'Assigned To': t.assigned_to || '',
          Created: formatDate(t.created_at)
        })));
        XLSX.utils.book_append_sheet(wb, taskSheet, 'Tasks');

        XLSX.writeFile(wb, `myhost-bizmate-data-${new Date().toISOString().slice(0, 10)}.xlsx`);
        setExportStatus('done');
        setExportMessage('Excel file downloaded successfully');
        setTimeout(() => setExportStatus('idle'), 4000);
      } catch (err) {
        console.error('Excel export error:', err);
        setExportStatus('error');
        setExportMessage('Export failed: ' + err.message);
      }
    };

    // ---- CSV (zip of multiple files via single concatenated) ----
    const handleDownloadCSV = async () => {
      try {
        setExportStatus('loading');
        setExportMessage('Fetching data...');
        const { properties, bookings, payments, leads, tasks } = await fetchAllData();
        setExportMessage('Generating CSV files...');

        const toCSV = (headers, rows) => {
          const escape = (v) => {
            const s = String(v ?? '');
            return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
          };
          return [headers.join(','), ...rows.map(r => r.map(escape).join(','))].join('\r\n');
        };

        const datasets = [
          {
            name: 'properties',
            headers: ['Name', 'Type', 'Location', 'Bedrooms', 'Price/Night', 'Status'],
            rows: properties.map(p => [p.name, p.property_type, p.location, p.bedrooms, p.price_per_night, p.status])
          },
          {
            name: 'bookings',
            headers: ['Guest Name', 'Check-in', 'Check-out', 'Property', 'Nights', 'Amount', 'Channel', 'Status', 'Created'],
            rows: bookings.map(b => [b.guest_name, formatDate(b.check_in), formatDate(b.check_out), b.villa_name || b.property_name, b.nights, b.total_price, b.channel, b.status, formatDate(b.created_at)])
          },
          {
            name: 'payments',
            headers: ['Guest Name', 'Check-in', 'Check-out', 'Property', 'Total Amount', 'Amount Paid', 'Payment Status', 'Channel'],
            rows: payments.map(p => [p.guest_name, formatDate(p.check_in), formatDate(p.check_out), p.villa_name || p.property_name, p.total_price, p.amount_paid, p.payment_status || p.status, p.channel])
          },
          {
            name: 'clients_leads',
            headers: ['Name', 'Email', 'Phone', 'Status', 'Source', 'Lead Score', 'Country', 'Created'],
            rows: leads.map(l => [l.name, l.email, l.phone, l.status, l.source, l.lead_score, l.country, formatDate(l.created_at)])
          },
          {
            name: 'tasks',
            headers: ['Title', 'Category', 'Priority', 'Status', 'Description', 'Assigned To', 'Created'],
            rows: tasks.map(t => [t.title, t.task_type, t.priority, t.status, t.description, t.assigned_to, formatDate(t.created_at)])
          }
        ];

        // Download each CSV file individually
        for (const ds of datasets) {
          const csv = toCSV(ds.headers, ds.rows);
          const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' }); // BOM for Excel compatibility
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `myhost-bizmate-${ds.name}-${new Date().toISOString().slice(0, 10)}.csv`;
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 200);
          await new Promise(r => setTimeout(r, 400)); // delay between downloads
        }

        setExportStatus('done');
        setExportMessage('5 CSV files downloaded successfully');
        setTimeout(() => setExportStatus('idle'), 4000);
      } catch (err) {
        console.error('CSV export error:', err);
        setExportStatus('error');
        setExportMessage('Export failed: ' + err.message);
      }
    };

    // ---- BALI BOOKING SHEET ----
    const handleDownloadBaliSheet = async () => {
      try {
        setExportStatus('loading');
        setExportMessage('Fetching bookings...');

        const tenantId = TENANT_ID;
        let query = supabase
          .from('bookings')
          .select('guest_name, check_in, check_out, guests, nights, total_price, channel, payment_status, notes, villa_id')
          .eq('tenant_id', tenantId)
          .order('check_in', { ascending: true });

        if (baliSheetYear !== 'all') {
          query = query
            .gte('check_in', `${baliSheetYear}-01-01`)
            .lte('check_in', `${baliSheetYear}-12-31`);
        }
        if (baliSheetVilla !== 'all') {
          query = query.eq('villa_id', baliSheetVilla);
        }

        const { data: bookingsRaw, error } = await query;
        if (error) throw new Error(error.message);
        const bkgs = bookingsRaw || [];

        setExportMessage('Building Excel sheet...');

        const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const getMonth = (dateStr) => MONTHS[new Date(dateStr).getMonth()];
        const getYear = (dateStr) => {
          if (!dateStr) return '';
          return new Date(dateStr).getFullYear();
        };
        const fmtDate = (d) => {
          if (!d) return '';
          const dt = new Date(d);
          return `${dt.getDate()} ${MONTHS[dt.getMonth()].slice(0,3)}`;
        };
        const fmtNum = (n) => n ? Number(n).toLocaleString('id-ID') : '-';

        // Group by year and month
        const byYearMonth = {};
        bkgs.forEach(b => {
          const year = getYear(b.check_in);
          const mon = getMonth(b.check_in);
          const key = `${year}-${mon}`;
          if (!byYearMonth[key]) byYearMonth[key] = { year, month: mon, bookings: [] };
          byYearMonth[key].bookings.push(b);
        });

        // Sort by year then month
        const sortedKeys = Object.keys(byYearMonth).sort((a, b) => {
          const [yearA, monthA] = a.split('-');
          const [yearB, monthB] = b.split('-');
          if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);
          return MONTHS.indexOf(monthA) - MONTHS.indexOf(monthB);
        });

        // Build rows
        const rows = [];
        // Header row 1
        rows.push(['NO', 'YEAR', 'MONTH', 'GUEST NAME', 'CHECK IN', 'CHECK OUT', 'PAX', 'ROOM NIGHTS', 'PRICE (IDR)', 'BOOKING SOURCE', 'PAYMENT STATUS', 'SPECIAL REQUEST', 'TOTAL REVENUE ON HAND']);

        let counter = 1;
        let cumulativeRevenue = 0;

        sortedKeys.forEach(key => {
          const { year, month, bookings: monthBkgs } = byYearMonth[key];
          const monthRevenue = monthBkgs.reduce((s, b) => s + Number(b.total_price || 0), 0);
          cumulativeRevenue += monthRevenue;

          monthBkgs.forEach((b, i) => {
            const nights = b.nights || (b.check_in && b.check_out
              ? Math.round((new Date(b.check_out) - new Date(b.check_in)) / 86400000)
              : '-');
            const payStatus = b.payment_status === 'paid' ? 'Done'
              : b.payment_status === 'pending' ? 'On Scheduled'
              : b.payment_status === 'expired' ? 'Expired'
              : b.payment_status || '-';
            rows.push([
              counter++,
              i === 0 ? year : '',                       // Year only on first row of month
              i === 0 ? month : '',                      // Month only on first row of month
              b.guest_name || '-',
              fmtDate(b.check_in),
              fmtDate(b.check_out),
              b.guests || '-',
              nights,
              fmtNum(b.total_price),
              b.channel || '-',
              payStatus,
              b.notes || '-',
              i === 0 ? fmtNum(cumulativeRevenue) : ''  // Revenue only on first row of month
            ]);
          });
        });

        // Build workbook
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(rows);

        // Column widths
        ws['!cols'] = [
          { wch: 5 },  // NO
          { wch: 8 },  // YEAR
          { wch: 12 }, // MONTH
          { wch: 22 }, // GUEST NAME
          { wch: 13 }, // CHECK IN
          { wch: 13 }, // CHECK OUT
          { wch: 5 },  // PAX
          { wch: 12 }, // ROOM NIGHTS
          { wch: 16 }, // PRICE
          { wch: 16 }, // BOOKING SOURCE
          { wch: 16 }, // PAYMENT STATUS
          { wch: 20 }, // SPECIAL REQUEST
          { wch: 22 }, // TOTAL REVENUE ON HAND
        ];

        // Style header row (XLSX basic style via cell metadata)
        const headerRange = XLSX.utils.decode_range(ws['!ref'] || 'A1:M1');
        for (let C = headerRange.s.c; C <= headerRange.e.c; C++) {
          const addr = XLSX.utils.encode_cell({ r: 0, c: C });
          if (!ws[addr]) continue;
          ws[addr].s = {
            font: { bold: true, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: 'F97316' } },
            alignment: { horizontal: 'center', wrapText: true }
          };
        }

        const villaName = baliSheetVilla === 'all' ? 'All Villas'
          : (userProperties.find(v => v.id === baliSheetVilla)?.name || baliSheetVilla);
        const sheetName = `Bookings ${baliSheetYear === 'all' ? 'All Years' : baliSheetYear}`;
        XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31));

        const fileName = `bali-booking-sheet-${villaName.replace(/\s+/g, '-')}-${baliSheetYear}-${new Date().toISOString().slice(0,10)}.xlsx`;
        XLSX.writeFile(wb, fileName);

        setExportStatus('done');
        setExportMessage(`Bali Booking Sheet downloaded — ${bkgs.length} bookings`);
        setTimeout(() => setExportStatus('idle'), 5000);
      } catch (err) {
        console.error('Bali sheet error:', err);
        setExportStatus('error');
        setExportMessage('Export failed: ' + err.message);
      }
    };

    const exportOptions = [
      {
        id: 'html',
        icon: Printer,
        title: 'HTML Print Summary',
        description: 'A beautifully formatted HTML page with all your data. Open in browser and print to PDF, or save as a printable report.',
        buttonLabel: 'Download HTML',
        buttonColor: 'bg-orange-500 hover:bg-orange-600',
        badge: 'Recommended',
        badgeColor: 'bg-orange-500/20 text-orange-300',
        onDownload: handleDownloadHTML
      },
      {
        id: 'excel',
        icon: FileText,
        title: 'Excel Workbook (.xlsx)',
        description: 'Multi-sheet Excel file with separate tabs for Properties, Bookings, Payments, Clients & Leads, and Tasks.',
        buttonLabel: 'Download Excel',
        buttonColor: 'bg-green-600 hover:bg-green-700',
        badge: '5 sheets',
        badgeColor: 'bg-green-500/20 text-green-300',
        onDownload: handleDownloadExcel
      },
      {
        id: 'csv',
        icon: List,
        title: 'CSV Files',
        description: 'Five separate CSV files (one per data type), compatible with any spreadsheet or database tool.',
        buttonLabel: 'Download CSV Files',
        buttonColor: 'bg-blue-600 hover:bg-blue-700',
        badge: '5 files',
        badgeColor: 'bg-blue-500/20 text-blue-300',
        onDownload: handleDownloadCSV
      }
    ];

    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => setActiveSection('menu')} className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white">My Data Export</h2>
            <p className="text-gray-400 text-sm">Download a complete copy of your business data</p>
          </div>
        </div>

        {/* Status banner */}
        {exportStatus !== 'idle' && (
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
            exportStatus === 'loading' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
            exportStatus === 'done'    ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
            'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}>
            {exportStatus === 'loading' && <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />}
            {exportStatus === 'done'    && <CheckCircle className="w-4 h-4" />}
            {exportStatus === 'error'   && <AlertCircle className="w-4 h-4" />}
            {exportMessage}
          </div>
        )}

        {/* Info box */}
        <div className="bg-[#1f2937] rounded-2xl p-5 border border-orange-500/20">
          <div className="flex items-start gap-3">
            <Download className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-white font-semibold mb-1">Your data, your way</p>
              <p className="text-gray-400 text-sm">Export includes: <span className="text-orange-300">Properties · Bookings · Payments · Clients & Leads · Tasks</span>. Data is fetched live from your account at the moment you click download.</p>
            </div>
          </div>
        </div>

        {/* Export cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {exportOptions.map(opt => {
            const Icon = opt.icon;
            const isActive = exportStatus === 'loading';
            return (
              <div key={opt.id} className="bg-[#1f2937] rounded-2xl p-6 border border-gray-700/50 flex flex-col gap-4 hover:border-orange-500/40 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-white/5 rounded-xl">
                    <Icon className="w-7 h-7 text-orange-400" />
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${opt.badgeColor}`}>{opt.badge}</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">{opt.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{opt.description}</p>
                </div>
                <button
                  onClick={opt.onDownload}
                  disabled={isActive}
                  className={`mt-auto w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all ${opt.buttonColor} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isActive ? (
                    <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Processing...</>
                  ) : (
                    <><Download className="w-4 h-4" /> {opt.buttonLabel}</>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Bali Booking Sheet */}
        <div className="bg-[#1f2937] rounded-2xl p-6 border-2 border-orange-500/40">
          <div className="flex items-start gap-3 mb-5">
            <div className="p-3 bg-orange-500/20 rounded-xl flex-shrink-0">
              <FileText className="w-7 h-7 text-orange-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-white font-bold text-lg">Bali Booking Sheet</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300">Bali Format</span>
              </div>
              <p className="text-gray-400 text-sm">Excel in your standard format — grouped by month, with cumulative TOTAL REVENUE ON HAND.</p>
            </div>
          </div>

          {/* Columns preview */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {['NO','MONTH','GUEST NAME','CHECK IN','CHECK OUT','PAX','ROOM NIGHTS','PRICE','BOOKING SOURCE','PAYMENT STATUS','SPECIAL REQUEST','TOTAL REVENUE ON HAND'].map(col => (
              <span key={col} className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-gray-600/40">{col}</span>
            ))}
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap gap-3 mb-5">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 font-medium">Year</label>
              <select
                value={baliSheetYear}
                onChange={e => setBaliSheetYear(e.target.value)}
                className="bg-[#2a2f3a] text-white text-sm rounded-xl px-3 py-2 border border-gray-600 focus:border-orange-500 outline-none"
              >
                <option value="all">All years</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 font-medium">Villa</label>
              <select
                value={baliSheetVilla}
                onChange={e => setBaliSheetVilla(e.target.value)}
                className="bg-[#2a2f3a] text-white text-sm rounded-xl px-3 py-2 border border-gray-600 focus:border-orange-500 outline-none"
              >
                <option value="all">All villas</option>
                {userProperties.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleDownloadBaliSheet}
            disabled={exportStatus === 'loading'}
            className="w-full sm:w-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exportStatus === 'loading' ? (
              <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Generating...</>
            ) : (
              <><Download className="w-4 h-4" /> Download Bali Booking Sheet</>
            )}
          </button>
        </div>

        {/* What's included */}
        <div className="bg-[#1f2937] rounded-2xl p-5 border border-gray-700/50">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-orange-400" /> What's included in each export
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { label: 'Properties', fields: 'Name, type, location, bedrooms, price/night' },
              { label: 'Bookings', fields: 'Guest, dates, property, amount, channel, status' },
              { label: 'Payments', fields: 'Guest, check-in/out, total amount, amount paid, payment status' },
              { label: 'Clients & Leads', fields: 'Name, email, phone, status, source, score' },
              { label: 'Tasks', fields: 'Title, category, priority, status, description' }
            ].map(item => (
              <div key={item.label} className="bg-white/5 rounded-xl p-3">
                <p className="text-orange-300 font-semibold text-sm mb-1">{item.label}</p>
                <p className="text-gray-400 text-xs">{item.fields}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

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
          {activeSection === 'automated-flows' && renderAutomatedFlowsSection()}
          {activeSection === 'business-reports' && renderBusinessReportsSection()}
          {activeSection === 'all-data' && renderAllDataSection()}
          {activeSection === 'availability' && renderAvailabilitySection()}
          {activeSection === 'master-calendar' && <MasterCalendar onBack={() => setActiveSection('menu')} />}
          {activeSection === 'communication' && renderCommunicationSection()}
          {activeSection === 'website' && renderWebsiteSection()}
          {activeSection === 'tasks' && renderTasksSection()}
          {activeSection === 'service-requests' && <ServiceRequests onBack={() => setActiveSection('menu')} />}
          {activeSection === 'decisions' && renderDecisionsSection()}
          {activeSection === 'data-export' && renderDataExportSection()}
        </div>
      </div>

      {/* Task Modal (Create/Edit) - MOVED OUTSIDE renderTasksSection to prevent re-renders */}
      {showTaskModal && (
        <TaskModal
          task={selectedTask}
          onClose={() => {
            setShowTaskModal(false);
            setSelectedTask(null);
          }}
          onSave={async (taskData) => {
            try {
              if (!userData?.id) {
                setNotification({ type: 'error', message: 'Error: User ID no encontrado. Por favor, vuelva a iniciar sesión.' });
                return;
              }

              if (selectedTask) {
                // Edit existing task
                await tasksService.updateTask(selectedTask.id, taskData);
                setNotification({ type: 'success', message: 'Task updated successfully' });
              } else {
                // Create new task - IMPORTANTE: pasar tenant_id del usuario logueado
                await tasksService.createTask({
                  ...taskData,
                  tenantId: userData.id,
                  propertyId: null // tasks can be property-agnostic
                }, userData);
                setNotification({ type: 'success', message: 'Task created successfully' });
              }
              setShowTaskModal(false);
              setSelectedTask(null);
              await loadTasksData(); // Reload tasks
            } catch (error) {
              console.error('Full error:', error);
              setNotification({ type: 'error', message: 'Error saving: ' + error.message });
            }
          }}
        />
      )}

      {/* Guest Issue Modal (Create/Edit) */}
      {showIssueModal && (
        <IssueModal
          issue={selectedIssue}
          onClose={() => {
            setShowIssueModal(false);
            setSelectedIssue(null);
          }}
          onSave={async () => {
            try {
              setShowIssueModal(false);
              setSelectedIssue(null);
              setNotification({ type: 'success', message: selectedIssue ? 'Guest issue updated successfully' : 'Guest issue created successfully' });
              await loadGuestIssuesData(); // Reload issues
            } catch (error) {
              console.error('Error saving guest issue:', error);
              setNotification({ type: 'error', message: 'Error saving guest issue: ' + error.message });
            }
          }}
        />
      )}

      {/* Notification Toast */}
      <NotificationToast
        notification={notification}
        onClose={() => setNotification(null)}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        dialog={confirmDialog}
        onClose={() => setConfirmDialog(null)}
      />
    </div>
  );
};

export default Autopilot;
