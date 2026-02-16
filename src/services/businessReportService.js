import { supabase } from '../lib/supabase';

const OWNER_IDS = {
  gita: '1f32d384-4018-46a9-a6f9-058217e6924a',
  jose: 'c24393db-d318-4d75-8bbf-0fa240b9c1db'
};

// Call OSIRIS AI for business analysis
async function callOSIRIS(tenantId, prompt) {
  try {
    const response = await fetch('https://n8n-production-bb2d.up.railway.app/webhook/ai/chat-v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tenant_id: tenantId,
        user_id: tenantId,
        message: prompt
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.reply || data.message || '';
  } catch (error) {
    console.error('OSIRIS call failed:', error);
    return null;
  }
}

// Generate business report for an owner
export async function generateBusinessReport(ownerId, ownerName, propertyName, currency, startDate = '2026-01-01', endDate = '2026-12-31') {
  console.log(`Generating report for ${ownerName} from ${startDate} to ${endDate}...`);

  // Get bookings
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('*')
    .eq('tenant_id', ownerId)
    .gte('check_in', startDate)
    .lte('check_in', endDate)
    .order('check_in', { ascending: false });

  if (bookingsError || !bookings || bookings.length === 0) {
    console.error('No bookings found:', bookingsError);
    return null;
  }

  console.log(`✓ Found ${bookings.length} bookings`);

  // Get villas - Load by villa_id from bookings
  const uniqueVillaIds = [...new Set(bookings.map(b => b.villa_id).filter(id => id))];
  let allVillas = [];

  if (uniqueVillaIds.length > 0) {
    const { data: villas, error: villasError } = await supabase
      .from('villas')
      .select('*')
      .in('id', uniqueVillaIds);

    if (villas && !villasError) {
      allVillas = villas;
    }
  }

  console.log(`✓ Found ${allVillas.length} villas for ${uniqueVillaIds.length} villa IDs`);

  // Calculate channel distribution
  const channelBreakdown = {};
  let totalChannelRevenue = 0;

  bookings.forEach(booking => {
    let channel = (booking.source || 'direct').toLowerCase().trim().replace(/\s+/g, '');

    // Consolidate Airbnb variants
    if (channel === 'airbnb' || channel === 'air-bnb' || channel.includes('airbnb')) {
      channel = 'airbnb';
    }
    // Consolidate Booking.com variants
    if (channel === 'booking.com' || channel === 'booking' || channel.includes('booking')) {
      channel = 'booking.com';
    }

    const revenue = booking.total_price || 0;

    if (!channelBreakdown[channel]) {
      channelBreakdown[channel] = { bookings: 0, revenue: 0 };
    }

    channelBreakdown[channel].bookings += 1;
    channelBreakdown[channel].revenue += revenue;
    totalChannelRevenue += revenue;
  });

  // Sort channels by revenue
  const sortedChannels = Object.entries(channelBreakdown)
    .map(([channel, data]) => ({
      channel,
      bookings: data.bookings,
      revenue: data.revenue,
      percentage: totalChannelRevenue > 0 ? (data.revenue / totalChannelRevenue * 100) : 0
    }))
    .sort((a, b) => b.revenue - a.revenue);

  // Calculate metrics
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
  const totalBookings = bookings.length;
  const totalNights = bookings.reduce((sum, b) => {
    if (b.check_in && b.check_out) {
      const checkIn = new Date(b.check_in);
      const checkOut = new Date(b.check_out);
      const diffTime = Math.abs(checkOut - checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return sum + diffDays;
    }
    return sum;
  }, 0);

  // Calculate occupancy rate (months with bookings × 31)
  const monthsWithBookings = new Set(
    bookings.map(b => {
      const date = new Date(b.check_in);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    })
  ).size;

  const totalPossibleNights = monthsWithBookings * 31;
  const occupancyRate = totalPossibleNights > 0 && totalNights > 0
    ? (totalNights / totalPossibleNights) * 100
    : 0;

  const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;
  const avgStayLength = totalBookings > 0 ? totalNights / totalBookings : 0;

  // Calculate OTA dependency
  const otaRevenue = sortedChannels
    .filter(ch => ch.channel !== 'direct' && ch.channel !== 'gita')
    .reduce((sum, ch) => sum + ch.revenue, 0);
  const otaDependency = totalRevenue > 0 ? (otaRevenue / totalRevenue * 100) : 0;

  // Calculate OTA commission (estimate 15% of OTA revenue)
  const otaCommission = otaRevenue * 0.15;

  // Calculate payment collection status
  const completedAmount = bookings
    .filter(b => b.payment_status === 'completed')
    .reduce((sum, b) => sum + (b.total_price || 0), 0);

  const pendingAmount = bookings
    .filter(b => b.payment_status === 'pending' || !b.payment_status)
    .reduce((sum, b) => sum + (b.total_price || 0), 0);

  // Calculate per-villa metrics
  const villaGroups = {};
  bookings.forEach(booking => {
    let villaName = 'Unknown Villa';
    if (booking.villa_id) {
      const villa = allVillas.find(v => v.id === booking.villa_id);
      villaName = villa ? villa.name : booking.villa_id;
    }

    if (!villaGroups[villaName]) {
      villaGroups[villaName] = [];
    }
    villaGroups[villaName].push(booking);
  });

  const propertyMetrics = Object.entries(villaGroups).map(([name, villaBookings]) => {
    const propRevenue = villaBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
    const propNights = villaBookings.reduce((sum, b) => {
      if (b.check_in && b.check_out) {
        const checkIn = new Date(b.check_in);
        const checkOut = new Date(b.check_out);
        const diffTime = Math.abs(checkOut - checkIn);
        return sum + Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
      return sum;
    }, 0);
    const propAvgValue = villaBookings.length > 0 ? propRevenue / villaBookings.length : 0;

    const villaMonthsWithBookings = new Set(
      villaBookings.map(b => {
        const date = new Date(b.check_in);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      })
    ).size;

    const villaTotalPossibleNights = villaMonthsWithBookings * 31;
    const propOccupancy = villaTotalPossibleNights > 0 && propNights > 0
      ? (propNights / villaTotalPossibleNights) * 100
      : 0;

    return {
      name,
      bookings: villaBookings.length,
      revenue: propRevenue,
      avgValue: propAvgValue,
      nights: propNights,
      occupancyRate: propOccupancy
    };
  });

  const metrics = {
    totalRevenue,
    totalBookings,
    totalNights,
    occupancyRate,
    avgBookingValue,
    avgStayLength,
    otaDependency,
    otaCommission,
    completedAmount,
    pendingAmount
  };

  // Call OSIRIS for AI analysis
  console.log('📊 Calling OSIRIS for AI analysis...');

  const osirisPrompt = `
You are OSIRIS, an expert business analyst for luxury vacation rental properties.

Analyze the following business performance data for ${propertyName} (${startDate} to ${endDate}):

**KEY METRICS:**
- Total Bookings: ${metrics.totalBookings}
- Total Nights Sold: ${metrics.totalNights}
- Occupancy Rate: ${metrics.occupancyRate.toFixed(1)}%
- Total Revenue: ${currency} ${Math.round(metrics.totalRevenue).toLocaleString()}
- Average Booking Value: ${currency} ${Math.round(metrics.avgBookingValue).toLocaleString()}
- OTA Dependency: ${metrics.otaDependency.toFixed(1)}%

**CHANNEL DISTRIBUTION:**
${sortedChannels.map(ch => `- ${ch.channel}: ${ch.bookings} bookings (${ch.percentage.toFixed(1)}%)`).join('\n')}

**VILLA PERFORMANCE:**
${propertyMetrics.map(v => `- ${v.name}: ${v.bookings} bookings, ${v.occupancyRate.toFixed(1)}% occupancy, ${currency} ${Math.round(v.revenue).toLocaleString()} revenue`).join('\n')}

Provide a business analysis in the following EXACT format with 3 sections. Be specific and practical:

### AREAS OF ATTENTION
[List 2-3 critical issues that need immediate attention, with specific numbers and actionable recommendations]

### PERFORMANCE INSIGHTS
[Provide 2-3 key insights about what's working well or notable patterns, with specific data points]

### STRATEGIC OBJECTIVES
[List exactly 3 strategic objectives in this format:]
OBJECTIVE 1: [Action verb] | [Goal name] | [Specific target with current number]
OBJECTIVE 2: [Action verb] | [Goal name] | [Specific target with current number]
OBJECTIVE 3: [Action verb] | [Goal name] | [Specific target with current number]

Be concise, data-driven, and actionable. Use the exact format above.`;

  const osirisAnalysis = await callOSIRIS(ownerId, osirisPrompt);

  if (osirisAnalysis) {
    console.log('✓ OSIRIS analysis received');
  } else {
    console.log('⚠️  OSIRIS call failed, using fallback');
  }

  return {
    metrics,
    bookings,
    channels: sortedChannels,
    villas: allVillas,
    propertyMetrics,
    osirisAnalysis
  };
}
