import { supabase } from '../lib/supabase';

// Monthly Occupancy Report - Per property and per channel
export async function generateMonthlyOccupancyReport(ownerId, ownerName, propertyName, currency, startDate, endDate, villaId = null) {
  console.log(`Generating Monthly Occupancy Report for ${ownerName}...`);

  // Build query
  let query = supabase
    .from('bookings')
    .select('*')
    .eq('tenant_id', ownerId)
    .gte('check_in', startDate)
    .lte('check_in', endDate)
    .order('check_in', { ascending: true });

  // Filter by villa if specified
  if (villaId && villaId !== 'all') {
    query = query.eq('villa_id', villaId);
  }

  const { data: bookings, error } = await query;

  if (error || !bookings || bookings.length === 0) {
    console.error('No bookings found:', error);
    return null;
  }

  // Calculate monthly occupancy
  const monthlyData = {};

  bookings.forEach(booking => {
    const checkIn = new Date(booking.check_in);
    const checkOut = new Date(booking.check_out);
    const monthKey = `${checkIn.getFullYear()}-${String(checkIn.getMonth() + 1).padStart(2, '0')}`;

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: monthKey,
        bookings: 0,
        nights: 0,
        revenue: 0,
        channels: {}
      };
    }

    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const channel = (booking.source || 'direct').toLowerCase();

    monthlyData[monthKey].bookings += 1;
    monthlyData[monthKey].nights += nights;
    monthlyData[monthKey].revenue += booking.total_price || 0;

    if (!monthlyData[monthKey].channels[channel]) {
      monthlyData[monthKey].channels[channel] = { bookings: 0, nights: 0 };
    }
    monthlyData[monthKey].channels[channel].bookings += 1;
    monthlyData[monthKey].channels[channel].nights += nights;
  });

  // Calculate occupancy rates (assuming 30 days per month)
  Object.keys(monthlyData).forEach(month => {
    const totalPossibleNights = 30; // days in month
    monthlyData[month].occupancyRate = (monthlyData[month].nights / totalPossibleNights) * 100;
  });

  return {
    monthlyData: Object.values(monthlyData),
    totalBookings: bookings.length,
    dateRange: { startDate, endDate }
  };
}

// Revenue by Channel Report
export async function generateRevenueByChannelReport(ownerId, ownerName, propertyName, currency, startDate, endDate, villaId = null) {
  console.log(`Generating Revenue by Channel Report for ${ownerName}...`);

  let query = supabase
    .from('bookings')
    .select('*')
    .eq('tenant_id', ownerId)
    .gte('check_in', startDate)
    .lte('check_in', endDate);

  if (villaId && villaId !== 'all') {
    query = query.eq('villa_id', villaId);
  }

  const { data: bookings, error } = await query;

  if (error || !bookings) {
    return null;
  }

  const channelData = {};
  let totalRevenue = 0;

  bookings.forEach(booking => {
    let channel = (booking.source || 'direct').toLowerCase().trim();

    // Normalize channel names
    if (channel.includes('airbnb')) channel = 'airbnb';
    if (channel.includes('booking')) channel = 'booking.com';

    const revenue = booking.total_price || 0;
    totalRevenue += revenue;

    if (!channelData[channel]) {
      channelData[channel] = { bookings: 0, revenue: 0, nights: 0 };
    }

    channelData[channel].bookings += 1;
    channelData[channel].revenue += revenue;

    if (booking.check_in && booking.check_out) {
      const nights = Math.ceil((new Date(booking.check_out) - new Date(booking.check_in)) / (1000 * 60 * 60 * 24));
      channelData[channel].nights += nights;
    }
  });

  // Calculate percentages
  const channels = Object.entries(channelData).map(([name, data]) => ({
    name,
    ...data,
    percentage: totalRevenue > 0 ? (data.revenue / totalRevenue * 100) : 0
  })).sort((a, b) => b.revenue - a.revenue);

  return {
    channels,
    totalRevenue,
    totalBookings: bookings.length,
    dateRange: { startDate, endDate }
  };
}

// ADR and RevPAR Report
export async function generateADRRevPARReport(ownerId, ownerName, propertyName, currency, startDate, endDate, villaId = null) {
  console.log(`Generating ADR & RevPAR Report for ${ownerName}...`);

  let query = supabase
    .from('bookings')
    .select('*')
    .eq('tenant_id', ownerId)
    .gte('check_in', startDate)
    .lte('check_in', endDate);

  if (villaId && villaId !== 'all') {
    query = query.eq('villa_id', villaId);
  }

  const { data: bookings, error } = await query;

  if (error || !bookings) {
    return null;
  }

  let totalRevenue = 0;
  let totalNights = 0;

  bookings.forEach(booking => {
    totalRevenue += booking.total_price || 0;
    if (booking.check_in && booking.check_out) {
      const nights = Math.ceil((new Date(booking.check_out) - new Date(booking.check_in)) / (1000 * 60 * 60 * 24));
      totalNights += nights;
    }
  });

  // Calculate date range in days
  const daysInPeriod = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));

  // ADR = Total Revenue / Total Nights Sold
  const adr = totalNights > 0 ? totalRevenue / totalNights : 0;

  // RevPAR = Total Revenue / Available Room Nights
  const revpar = daysInPeriod > 0 ? totalRevenue / daysInPeriod : 0;

  // Occupancy Rate
  const occupancyRate = daysInPeriod > 0 ? (totalNights / daysInPeriod) * 100 : 0;

  return {
    adr,
    revpar,
    occupancyRate,
    totalRevenue,
    totalNights,
    totalBookings: bookings.length,
    daysInPeriod,
    dateRange: { startDate, endDate }
  };
}

// Cancellation Report
export async function generateCancellationReport(ownerId, ownerName, propertyName, currency, startDate, endDate, villaId = null) {
  console.log(`Generating Cancellation Report for ${ownerName}...`);

  let query = supabase
    .from('bookings')
    .select('*')
    .eq('tenant_id', ownerId)
    .gte('check_in', startDate)
    .lte('check_in', endDate);

  if (villaId && villaId !== 'all') {
    query = query.eq('villa_id', villaId);
  }

  const { data: bookings, error } = await query;

  if (error || !bookings) {
    return null;
  }

  const cancelledBookings = bookings.filter(b =>
    b.status && (b.status.toLowerCase() === 'cancelled' || b.status.toLowerCase() === 'canceled')
  );

  const confirmedBookings = bookings.filter(b =>
    !b.status || b.status.toLowerCase() === 'confirmed'
  );

  const lostRevenue = cancelledBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
  const totalPotentialRevenue = bookings.reduce((sum, b) => sum + (b.total_price || 0), 0);

  const cancellationRate = bookings.length > 0 ? (cancelledBookings.length / bookings.length * 100) : 0;

  return {
    totalCancellations: cancelledBookings.length,
    confirmedBookings: confirmedBookings.length,
    totalBookings: bookings.length,
    lostRevenue,
    cancellationRate,
    totalPotentialRevenue,
    cancelledBookings,
    dateRange: { startDate, endDate }
  };
}

// Monthly Owner Statement
export async function generateOwnerStatementReport(ownerId, ownerName, propertyName, currency, startDate, endDate, villaId = null) {
  console.log(`Generating Owner Statement Report for ${ownerName}...`);

  let query = supabase
    .from('bookings')
    .select('*')
    .eq('tenant_id', ownerId)
    .gte('check_in', startDate)
    .lte('check_in', endDate)
    .order('check_in', { ascending: true });

  if (villaId && villaId !== 'all') {
    query = query.eq('villa_id', villaId);
  }

  const { data: bookings, error } = await query;

  if (error || !bookings) {
    return null;
  }

  // Group by month
  const monthlyStatements = {};

  bookings.forEach(booking => {
    const checkIn = new Date(booking.check_in);
    const monthKey = `${checkIn.getFullYear()}-${String(checkIn.getMonth() + 1).padStart(2, '0')}`;

    if (!monthlyStatements[monthKey]) {
      monthlyStatements[monthKey] = {
        month: monthKey,
        grossRevenue: 0,
        otaCommission: 0,
        managementFee: 0,
        netPayout: 0,
        bookings: []
      };
    }

    const revenue = booking.total_price || 0;
    const isOTA = booking.source && !['direct', 'gita'].includes(booking.source.toLowerCase());
    const otaCommission = isOTA ? revenue * 0.15 : 0; // 15% OTA commission
    const managementFee = revenue * 0.20; // 20% management fee
    const netPayout = revenue - otaCommission - managementFee;

    monthlyStatements[monthKey].grossRevenue += revenue;
    monthlyStatements[monthKey].otaCommission += otaCommission;
    monthlyStatements[monthKey].managementFee += managementFee;
    monthlyStatements[monthKey].netPayout += netPayout;
    monthlyStatements[monthKey].bookings.push(booking);
  });

  return {
    monthlyStatements: Object.values(monthlyStatements),
    totalGrossRevenue: bookings.reduce((sum, b) => sum + (b.total_price || 0), 0),
    dateRange: { startDate, endDate }
  };
}

// Owner Decisions Report - Weekly/Monthly decision summary
export async function generateOwnerDecisionsReport(tenantId, ownerName, propertyName, currency, startDate, endDate, villaName = null) {
  console.log(`Generating Owner Decisions Report for ${ownerName}...`);

  // Build query
  let query = supabase
    .from('owner_decisions')
    .select('*')
    .eq('tenant_id', tenantId)
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('created_at', { ascending: true });

  // Filter by villa if specified
  if (villaName && villaName !== 'all') {
    query = query.eq('villa_name', villaName);
  }

  const { data: decisions, error } = await query;

  if (error) {
    console.error('Error fetching owner decisions:', error);
    return null;
  }

  if (!decisions || decisions.length === 0) {
    console.log('No decisions found for the specified period');
    return {
      kpis: {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        modified: 0,
        urgentUnresolved: 0,
        avgResponseTimeHours: 0
      },
      byVilla: [],
      byType: [],
      detailedList: [],
      alerts: [],
      dateRange: { startDate, endDate },
      villaFilter: villaName || 'All Villas'
    };
  }

  // 1. CALCULATE KPIs
  const kpis = {
    total: decisions.length,
    pending: decisions.filter(d => d.status === 'pending').length,
    approved: decisions.filter(d => d.status === 'approved').length,
    rejected: decisions.filter(d => d.status === 'rejected').length,
    modified: decisions.filter(d => d.status === 'modified').length,
    urgentUnresolved: decisions.filter(d => d.priority === 'urgent' && d.status === 'pending').length,
    avgResponseTimeHours: 0
  };

  // Calculate average response time (only for resolved decisions)
  const resolvedDecisions = decisions.filter(d => d.resolved_at && d.created_at);
  if (resolvedDecisions.length > 0) {
    const totalResponseTime = resolvedDecisions.reduce((sum, d) => {
      const created = new Date(d.created_at);
      const resolved = new Date(d.resolved_at);
      const diffHours = (resolved - created) / (1000 * 60 * 60);
      return sum + diffHours;
    }, 0);
    kpis.avgResponseTimeHours = Math.round((totalResponseTime / resolvedDecisions.length) * 10) / 10;
  }

  // 2. BREAKDOWN BY VILLA
  const byVillaMap = {};
  decisions.forEach(d => {
    const villa = d.villa_name || 'Unknown';
    if (!byVillaMap[villa]) {
      byVillaMap[villa] = {
        villaName: villa,
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        modified: 0
      };
    }
    byVillaMap[villa].total++;
    if (d.status === 'pending') byVillaMap[villa].pending++;
    if (d.status === 'approved') byVillaMap[villa].approved++;
    if (d.status === 'rejected') byVillaMap[villa].rejected++;
    if (d.status === 'modified') byVillaMap[villa].modified++;
  });
  const byVilla = Object.values(byVillaMap).sort((a, b) => b.total - a.total);

  // 3. BREAKDOWN BY TYPE
  const byTypeMap = {};
  decisions.forEach(d => {
    const type = d.decision_type || 'unknown';
    if (!byTypeMap[type]) {
      byTypeMap[type] = {
        type: type,
        count: 0,
        percentage: 0
      };
    }
    byTypeMap[type].count++;
  });
  const byType = Object.values(byTypeMap).map(item => ({
    ...item,
    percentage: Math.round((item.count / decisions.length) * 100)
  })).sort((a, b) => b.count - a.count);

  // 4. DETAILED LIST (all decisions with key info)
  const detailedList = decisions.map(d => ({
    id: d.id,
    created_at: d.created_at,
    villa_name: d.villa_name || 'N/A',
    guest_name: d.guest_name || 'N/A',
    decision_type: d.decision_type,
    priority: d.priority,
    status: d.status,
    scheduled_date: d.scheduled_date,
    resolved_at: d.resolved_at,
    responseTimeHours: d.resolved_at && d.created_at
      ? Math.round(((new Date(d.resolved_at) - new Date(d.created_at)) / (1000 * 60 * 60)) * 10) / 10
      : null,
    title: d.title,
    summary: d.summary
  }));

  // 5. ALERTS
  const alerts = [];

  // Alert: Urgent decisions pending > 24h
  const urgentPending24h = decisions.filter(d => {
    if (d.priority !== 'urgent' || d.status !== 'pending') return false;
    const hoursSinceCreated = (new Date() - new Date(d.created_at)) / (1000 * 60 * 60);
    return hoursSinceCreated > 24;
  });

  if (urgentPending24h.length > 0) {
    alerts.push({
      type: 'urgent_unresolved',
      message: `${urgentPending24h.length} urgent decision(s) pending for more than 24 hours`,
      count: urgentPending24h.length,
      decisions: urgentPending24h.map(d => ({ id: d.id, title: d.title, villa_name: d.villa_name }))
    });
  }

  // Alert: Guests with multiple complaints
  const guestComplaintsMap = {};
  decisions.filter(d => d.decision_type === 'complaint').forEach(d => {
    const guest = d.guest_name || 'Unknown';
    if (!guestComplaintsMap[guest]) {
      guestComplaintsMap[guest] = [];
    }
    guestComplaintsMap[guest].push(d);
  });

  Object.keys(guestComplaintsMap).forEach(guest => {
    if (guestComplaintsMap[guest].length > 1) {
      alerts.push({
        type: 'multiple_complaints',
        message: `Guest "${guest}" has ${guestComplaintsMap[guest].length} complaints`,
        count: guestComplaintsMap[guest].length,
        guestName: guest,
        decisions: guestComplaintsMap[guest].map(d => ({ id: d.id, title: d.title, villa_name: d.villa_name }))
      });
    }
  });

  return {
    kpis,
    byVilla,
    byType,
    detailedList,
    alerts,
    dateRange: { startDate, endDate },
    villaFilter: villaName || 'All Villas'
  };
}
