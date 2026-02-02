const https = require('https');
const fs = require('fs');

const SUPABASE_URL = 'https://jjpscimtxrudtepzwhag.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0';

const OWNER_IDS = {
  gita: '1f32d384-4018-46a9-a6f9-058217e6924a',
  jose: 'c24393db-d318-4d75-8bbf-0fa240b9c1db'
};

// Date range for the report (includes all historical data)
// Nismara: 41 bookings (2025-08-31 to 2026-09-05)
// Izumi: 165 bookings (various dates)
const START_DATE = '2024-01-01';
const END_DATE = '2026-12-31';

async function fetchFromSupabase(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'jjpscimtxrudtepzwhag.supabase.co',
      path: path,
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function fetchOwnerData(ownerId, ownerName) {
  console.log(`\nFetching data for owner: ${ownerName}`);

  // Get properties
  const properties = await fetchFromSupabase(`/rest/v1/properties?owner_id=eq.${ownerId}&select=*`);
  console.log(`✓ Found ${properties.length} properties`);

  if (properties.length === 0) {
    return null;
  }

  const propertyIds = properties.map(p => p.id);

  // Get bookings with date filter
  let allBookings = [];
  let allPayments = [];

  for (const propId of propertyIds) {
    const bookings = await fetchFromSupabase(
      `/rest/v1/bookings?property_id=eq.${propId}&check_in=gte.${START_DATE}&check_in=lte.${END_DATE}&select=*&order=check_in.desc`
    );
    const payments = await fetchFromSupabase(`/rest/v1/payments?property_id=eq.${propId}&select=*`);

    allBookings = allBookings.concat(bookings);
    allPayments = allPayments.concat(payments);
  }

  console.log(`✓ Found ${allBookings.length} bookings (${START_DATE} to ${END_DATE})`);
  console.log(`✓ Found ${allPayments.length} payments`);

  // Calculate channel distribution
  const channelBreakdown = {};
  let totalChannelRevenue = 0;

  allBookings.forEach(booking => {
    const channel = (booking.source || 'direct').toLowerCase();
    const revenue = booking.total_price || 0;

    if (!channelBreakdown[channel]) {
      channelBreakdown[channel] = {
        bookings: 0,
        revenue: 0
      };
    }

    channelBreakdown[channel].bookings += 1;
    channelBreakdown[channel].revenue += revenue;
    totalChannelRevenue += revenue;
  });

  // Sort channels by revenue (descending)
  const sortedChannels = Object.entries(channelBreakdown)
    .map(([channel, data]) => ({
      channel,
      bookings: data.bookings,
      revenue: data.revenue,
      percentage: totalChannelRevenue > 0 ? (data.revenue / totalChannelRevenue * 100) : 0
    }))
    .sort((a, b) => b.revenue - a.revenue);

  // Calculate metrics
  const totalRevenue = allBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
  const totalBookings = allBookings.length;

  const totalNights = allBookings.reduce((sum, b) => {
    if (b.check_in && b.check_out) {
      const checkIn = new Date(b.check_in);
      const checkOut = new Date(b.check_out);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      return sum + (nights > 0 ? nights : 0);
    }
    return sum;
  }, 0);

  const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;
  const avgStayLength = totalBookings > 0 ? totalNights / totalBookings : 0;

  // Calculate occupancy rate
  // Days in period: from START_DATE to END_DATE
  const startDate = new Date(START_DATE);
  const endDate = new Date(END_DATE);
  const daysInPeriod = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  // Count unique villas (room_id) from bookings
  const uniqueVillas = new Set(allBookings.map(b => b.room_id || 'default').filter(v => v !== null));
  const numVillas = uniqueVillas.size > 0 ? uniqueVillas.size : propertyIds.length;

  const totalPossibleNights = numVillas * daysInPeriod;
  const occupancyRate = totalPossibleNights > 0 && totalNights > 0
    ? (totalNights / totalPossibleNights) * 100
    : 0;

  // Payment calculations
  const completedPayments = allPayments.filter(p => p.status === 'completed');
  const pendingPayments = allPayments.filter(p => p.status === 'pending');
  const completedAmount = completedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const pendingAmount = pendingPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

  // Calculate OTA commission (assuming 15% average)
  const otaRevenue = sortedChannels
    .filter(c => c.channel !== 'direct')
    .reduce((sum, c) => sum + c.revenue, 0);
  const otaCommission = otaRevenue * 0.15;

  // OTA dependency percentage
  const otaDependency = totalRevenue > 0 ? (otaRevenue / totalRevenue * 100) : 0;

  // Calculate metrics PER VILLA (using room_id from bookings)
  // Group bookings by room_id/villa
  const villaGroups = {};
  allBookings.forEach(booking => {
    const villaName = booking.room_id || properties[0].name || 'Unknown Villa';
    if (!villaGroups[villaName]) {
      villaGroups[villaName] = [];
    }
    villaGroups[villaName].push(booking);
  });

  // Calculate metrics per villa
  const propertyMetrics = Object.entries(villaGroups).map(([villaName, villaBookings]) => {
    const propRevenue = villaBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
    const propNights = villaBookings.reduce((sum, b) => {
      if (b.check_in && b.check_out) {
        const checkIn = new Date(b.check_in);
        const checkOut = new Date(b.check_out);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        return sum + (nights > 0 ? nights : 0);
      }
      return sum;
    }, 0);
    const propAvgValue = villaBookings.length > 0 ? propRevenue / villaBookings.length : 0;
    const propOccupancy = daysInPeriod > 0 && propNights > 0
      ? (propNights / daysInPeriod) * 100
      : 0;

    return {
      name: villaName,
      bookings: villaBookings.length,
      revenue: propRevenue,
      avgValue: propAvgValue,
      nights: propNights,
      occupancyRate: Math.round(propOccupancy * 10) / 10
    };
  }).sort((a, b) => b.revenue - a.revenue); // Sort by revenue descending

  return {
    properties,
    bookings: allBookings,
    payments: allPayments,
    channels: sortedChannels,
    propertyMetrics, // NEW: Individual property metrics
    metrics: {
      totalRevenue,
      totalBookings,
      occupancyRate: Math.round(occupancyRate * 10) / 10,
      avgBookingValue: Math.round(avgBookingValue),
      avgStayLength: Math.round(avgStayLength * 10) / 10,
      totalNights,
      completedPayments: completedPayments.length,
      completedAmount,
      pendingPayments: pendingPayments.length,
      pendingAmount,
      otaCommission,
      otaDependency: Math.round(otaDependency * 10) / 10
    }
  };
}

function formatCurrency(amount, currency = 'USD') {
  if (currency === 'IDR') {
    const millions = amount / 1000000;
    return `IDR ${millions.toFixed(1)}M`;
  }
  return `$${(amount / 1000).toFixed(1)}K`;
}

function formatCurrencyFull(amount, currency = 'USD') {
  if (currency === 'IDR') {
    return `IDR ${amount.toLocaleString('en-US')}`;
  }
  return `$${amount.toLocaleString('en-US')}`;
}

function generateHTMLReport(ownerName, propertyName, currency, data) {
  const { metrics, bookings, channels, properties, propertyMetrics } = data;

  // Get occupancy badge
  let occupancyBadge = 'badge-success';
  let occupancyLabel = 'Good';
  if (metrics.occupancyRate < 30) {
    occupancyBadge = 'badge-danger';
    occupancyLabel = 'Low';
  } else if (metrics.occupancyRate < 60) {
    occupancyBadge = 'badge-warning';
    occupancyLabel = 'Medium';
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${propertyName} - Business Performance Analysis</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: #f5f5f5;
            padding: 0;
            margin: 0;
            color: #2d3748;
        }

        .page {
            width: 210mm;
            height: 297mm;
            background: white;
            margin: 0 0 20px 0;
            padding: 40px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            position: relative;
        }

        @media print {
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            body {
                background: white;
                padding: 0;
                margin: 0;
            }
            .page {
                margin: 0;
                padding: 40px;
                box-shadow: none;
                page-break-inside: avoid;
            }
            @page {
                margin: 0;
                size: A4 portrait;
            }
        }

        .header {
            text-align: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 3px solid #f97316;
        }

        .header h1 {
            font-size: 28px;
            color: #1a202c;
            margin-bottom: 8px;
            font-weight: 700;
        }

        .header .subtitle {
            font-size: 14px;
            color: #718096;
            font-weight: 500;
        }

        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 25px;
        }

        .metric-box {
            background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
            border: none;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(249, 115, 22, 0.2);
        }

        .metric-label {
            font-size: 11px;
            color: white;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
            font-weight: 600;
            opacity: 0.95;
        }

        .metric-value {
            font-size: 26px;
            font-weight: 700;
            color: white;
            line-height: 1;
        }

        .metric-subtitle {
            font-size: 10px;
            color: white;
            margin-top: 4px;
            opacity: 0.9;
        }

        .section {
            margin-bottom: 15px;
        }

        .section-title {
            font-size: 15px;
            color: #1a202c;
            margin-bottom: 12px;
            font-weight: 700;
            padding-bottom: 6px;
            border-bottom: 2px solid #e2e8f0;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
            margin-bottom: 12px;
        }

        .data-table th {
            background: #ffedd5;
            padding: 6px;
            text-align: left;
            font-weight: 600;
            color: #1a202c;
            border-bottom: 2px solid #fb923c;
        }

        .data-table td {
            padding: 5px 6px;
            border-bottom: 1px solid #e2e8f0;
            color: #4a5568;
        }

        .data-table tr:last-child td {
            border-bottom: none;
        }

        .data-table tr:nth-child(even) {
            background: #f7fafc;
        }

        .observations-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            margin-bottom: 12px;
        }

        .observation-card {
            background: #fff7ed;
            border: 2px solid #fed7aa;
            padding: 10px;
            border-radius: 6px;
        }

        .observation-card.warning {
            background: #fff7ed;
            border-color: #fb923c;
        }

        .observation-card.critical {
            background: #fed7aa;
            border-color: #f97316;
        }

        .observation-title {
            font-size: 12px;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 8px;
        }

        .observation-text {
            font-size: 10.5px;
            color: #4a5568;
            line-height: 1.5;
        }

        .summary-box {
            background: #fff7ed;
            border: 2px solid #fed7aa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 12px;
        }

        .summary-box h3 {
            font-size: 13px;
            color: #2d3748;
            margin-bottom: 8px;
            font-weight: 700;
        }

        .summary-box p {
            font-size: 11px;
            color: #4a5568;
            line-height: 1.6;
        }

        .highlight-number {
            font-weight: 700;
            color: #f97316;
        }

        .footer {
            position: absolute;
            bottom: 20px;
            left: 40px;
            right: 40px;
            text-align: center;
            font-size: 9px;
            color: #a0aec0;
            padding-top: 10px;
            border-top: 1px solid #e2e8f0;
        }

        .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 600;
        }

        .badge-success {
            background: #fed7aa;
            color: #7c2d12;
        }

        .badge-warning {
            background: #fb923c;
            color: white;
        }

        .badge-danger {
            background: #f97316;
            color: white;
        }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <!-- PAGE 1: EXECUTIVE SUMMARY -->
    <div class="page">
        <div class="header">
            <h1>${propertyName.toUpperCase()}</h1>
            <div class="subtitle">Business Performance Analysis | ${START_DATE} to ${END_DATE}</div>
        </div>

        <!-- KEY METRICS -->
        <div class="metrics-grid">
            <div class="metric-box">
                <div class="metric-label">Total Bookings</div>
                <div class="metric-value">${metrics.totalBookings}</div>
            </div>
            <div class="metric-box">
                <div class="metric-label">Total Revenue</div>
                <div class="metric-value">${formatCurrency(metrics.totalRevenue, currency)}</div>
                ${currency === 'IDR' ? `<div class="metric-subtitle">~$${Math.round(metrics.totalRevenue / 16000).toLocaleString()}</div>` : ''}
            </div>
            <div class="metric-box">
                <div class="metric-label">Avg Booking Value</div>
                <div class="metric-value">${formatCurrency(metrics.avgBookingValue, currency)}</div>
            </div>
            <div class="metric-box">
                <div class="metric-label">Occupancy Rate</div>
                <div class="metric-value">${metrics.occupancyRate}%</div>
                <div class="metric-subtitle">${metrics.avgStayLength} avg nights</div>
            </div>
        </div>

        <!-- OBSERVATIONS -->
        <div class="section">
            <div class="section-title">Key Observations</div>
            <div class="observations-grid">
                <div class="observation-card ${metrics.occupancyRate < 30 ? 'critical' : ''}">
                    <div class="observation-title">Occupancy Performance</div>
                    <div class="observation-text">${metrics.occupancyRate}% occupancy with ${metrics.totalNights} room nights. ${metrics.occupancyRate < 30 ? 'Below industry average. Action needed.' : 'Performing well.'}</div>
                </div>

                <div class="observation-card ${metrics.otaDependency > 70 ? 'critical' : 'warning'}">
                    <div class="observation-title">Channel Distribution</div>
                    <div class="observation-text">${metrics.otaDependency.toFixed(1)}% OTA dependency. ${metrics.otaDependency > 70 ? 'High commission exposure.' : 'Moderate commission exposure.'}</div>
                </div>

                <div class="observation-card">
                    <div class="observation-title">Revenue Performance</div>
                    <div class="observation-text">${formatCurrencyFull(metrics.totalRevenue, currency)} in ${metrics.totalBookings} bookings. Average ${formatCurrencyFull(metrics.avgBookingValue, currency)} per booking.</div>
                </div>

                <div class="observation-card warning">
                    <div class="observation-title">OTA Commission Cost</div>
                    <div class="observation-text">${formatCurrencyFull(metrics.otaCommission, currency)} paid in commissions (${(metrics.otaCommission / metrics.totalRevenue * 100).toFixed(1)}% of total revenue).</div>
                </div>

                <div class="observation-card ${metrics.pendingAmount > metrics.completedAmount ? 'warning' : ''}">
                    <div class="observation-title">Payment Collection</div>
                    <div class="observation-text">${formatCurrencyFull(metrics.completedAmount, currency)} collected, ${formatCurrencyFull(metrics.pendingAmount, currency)} pending (${metrics.pendingAmount > 0 ? (metrics.pendingAmount / (metrics.completedAmount + metrics.pendingAmount) * 100).toFixed(1) : 0}%).</div>
                </div>

                <div class="observation-card">
                    <div class="observation-title">Guest Behavior</div>
                    <div class="observation-text">Average length of stay: ${metrics.avgStayLength} nights. ${metrics.avgStayLength < 3 ? 'Consider packages to increase stay duration.' : 'Good stay duration.'}</div>
                </div>
            </div>
        </div>

        <!-- CHANNEL BREAKDOWN -->
        <div class="section">
            <div class="section-title">Distribution Channel Performance</div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Channel</th>
                        <th>Bookings</th>
                        <th>Revenue</th>
                        <th>% of Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${channels.map(ch => `
                    <tr>
                        <td style="text-transform: capitalize;">${ch.channel}</td>
                        <td>${ch.bookings}</td>
                        <td>${formatCurrencyFull(ch.revenue, currency)}</td>
                        <td>${ch.percentage.toFixed(1)}%</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <!-- AREAS OF ATTENTION -->
        <div class="section">
            <div class="section-title">Areas of Attention</div>

            ${metrics.otaDependency > 70 ? `
            <div class="summary-box">
                <h3>Distribution Channel Dependency</h3>
                <p>Current OTA commission expense: <span class="highlight-number">${formatCurrencyFull(metrics.otaCommission, currency)}</span> annually. Direct booking capability would reduce acquisition costs significantly.</p>
            </div>
            ` : ''}

            ${metrics.pendingAmount > 0 ? `
            <div class="summary-box">
                <h3>Payment Collection</h3>
                <p>Pending payments: <span class="highlight-number">${formatCurrencyFull(metrics.pendingAmount, currency)}</span> from ${metrics.pendingPayments} bookings. Implement automated payment reminders to improve cash flow.</p>
            </div>
            ` : ''}

            ${metrics.occupancyRate < 30 ? `
            <div class="summary-box">
                <h3>Occupancy Optimization</h3>
                <p>Current occupancy: <span class="highlight-number">${metrics.occupancyRate}%</span>. Consider dynamic pricing and increased marketing to fill vacant dates.</p>
            </div>
            ` : ''}
        </div>

        <div class="footer">
            ${propertyName} | Generated: ${new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
        </div>
    </div>

    <!-- PAGE 2: VILLA PERFORMANCE BREAKDOWN -->
    <div class="page">
        <div class="header">
            <h1>VILLA PERFORMANCE BREAKDOWN</h1>
            <div class="subtitle">${propertyName} | ${START_DATE} to ${END_DATE}</div>
        </div>

        <!-- VILLA COMPARISON TABLE -->
        <div class="section">
            <div class="section-title">Villa Performance Comparison</div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Villa</th>
                        <th>Bookings</th>
                        <th>Revenue</th>
                        <th>Avg Value</th>
                        <th>Room Nights</th>
                        <th>Occupancy</th>
                    </tr>
                </thead>
                <tbody>
                    ${propertyMetrics.map((prop, index) => {
                      let badge = 'badge-danger';
                      let label = 'Low';
                      if (prop.occupancyRate >= 60) {
                        badge = 'badge-success';
                        label = 'Good';
                      } else if (prop.occupancyRate >= 30) {
                        badge = 'badge-warning';
                        label = 'Medium';
                      }
                      const bgStyle = index === 0 ? 'style="background: #f0fff4; font-weight: 600;"' : '';
                      return `
                    <tr ${bgStyle}>
                        <td>${prop.name}</td>
                        <td>${prop.bookings}</td>
                        <td>${formatCurrencyFull(prop.revenue, currency)}</td>
                        <td>${formatCurrencyFull(prop.avgValue, currency)}</td>
                        <td>${prop.nights}</td>
                        <td>
                            ${prop.occupancyRate}%
                            <span class="badge ${badge}">${label}</span>
                        </td>
                    </tr>
                      `;
                    }).join('')}
                </tbody>
            </table>
        </div>

        <!-- VILLA OCCUPANCY CHART -->
        <div class="section">
            <div class="section-title">Occupancy Rate by Villa</div>
            <div style="background: #f7fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <canvas id="villaOccupancyChart" style="max-height: 180px;"></canvas>
            </div>
        </div>

        <!-- INSIGHTS -->
        <div class="section">
            <div class="section-title">Performance Insights</div>

            ${(() => {
              const topPerformer = propertyMetrics.reduce((max, p) => p.revenue > max.revenue ? p : max, propertyMetrics[0]);
              const lowPerformers = propertyMetrics.filter(p => p.occupancyRate < 30);

              return `
            <div class="summary-box" style="background: #f0fff4; border-color: #9ae6b4;">
                <h3>⭐ Top Performer: ${topPerformer.name}</h3>
                <p>
                    Leading with <span class="highlight-number">${topPerformer.bookings} bookings</span> and
                    <span class="highlight-number">${formatCurrencyFull(topPerformer.revenue, currency)}</span> in revenue.
                    Achieving <span class="highlight-number">${topPerformer.occupancyRate}%</span> occupancy rate.
                </p>
            </div>

            ${lowPerformers.length > 0 ? `
            <div class="summary-box" style="background: #fffaf0; border-color: #fbb6ce;">
                <h3>⚠️ Needs Attention: ${lowPerformers.map(p => p.name).join(', ')}</h3>
                <p>
                    ${lowPerformers.length} villa(s) with low occupancy (< 30%).
                    Consider: pricing adjustments, enhanced photos, targeted promotions, or room improvements.
                </p>
            </div>
            ` : ''}

            <div class="summary-box">
                <h3>Portfolio Optimization</h3>
                <p>
                    ${properties.length} villas with varying performance levels.
                    Average occupancy across portfolio: <span class="highlight-number">${metrics.occupancyRate}%</span>.
                    ${lowPerformers.length} villa(s) underperforming (< 30% occupancy) require strategic attention.
                </p>
            </div>
              `;
            })()}
        </div>

        <div class="footer">
            ${propertyName} - Villa Performance Analysis | Page 2
        </div>
    </div>

    <!-- PAGE 3: RECOMMENDED ACTIONS -->
    <div class="page">
        <div class="header">
            <h1>RECOMMENDED APPROACH</h1>
            <div class="subtitle">Strategic Action Plan for ${propertyName}</div>
        </div>

        <!-- STRATEGIC OBJECTIVES -->
        <div class="section" style="margin-bottom: 8px;">
            <div class="section-title" style="font-size: 14px; margin-bottom: 8px;">Strategic Objectives</div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 6px;">
                <div style="background: #f7fafc; padding: 6px; border-radius: 5px; border: 1px solid #e2e8f0; text-align: center;">
                    <div style="font-size: 8px; color: #718096; margin-bottom: 2px; font-weight: 600;">INCREASE</div>
                    <div style="font-size: 12px; font-weight: 700; color: #2d3748;">Direct Bookings</div>
                    <div style="font-size: 7px; color: #718096; margin-top: 2px; line-height: 1.2;">Reduce OTA dependency from ${metrics.otaDependency.toFixed(1)}%</div>
                </div>
                <div style="background: #f7fafc; padding: 6px; border-radius: 5px; border: 1px solid #e2e8f0; text-align: center;">
                    <div style="font-size: 8px; color: #718096; margin-bottom: 2px; font-weight: 600;">IMPROVE</div>
                    <div style="font-size: 12px; font-weight: 700; color: #2d3748;">Occupancy Rate</div>
                    <div style="font-size: 7px; color: #718096; margin-top: 2px; line-height: 1.2;">Target 50%+ from current ${metrics.occupancyRate}%</div>
                </div>
                <div style="background: #f7fafc; padding: 6px; border-radius: 5px; border: 1px solid #e2e8f0; text-align: center;">
                    <div style="font-size: 8px; color: #718096; margin-bottom: 2px; font-weight: 600;">OPTIMIZE</div>
                    <div style="font-size: 12px; font-weight: 700; color: #2d3748;">Revenue per Booking</div>
                    <div style="font-size: 7px; color: #718096; margin-top: 2px; line-height: 1.2;">Maximize value from ${formatCurrency(metrics.avgBookingValue, currency)}</div>
                </div>
            </div>
        </div>

        <!-- IMPLEMENTATION RECOMMENDATIONS -->
        <div class="section" style="margin-bottom: 8px;">
            <div class="section-title" style="font-size: 13px; margin-bottom: 8px;">Implementation Plan</div>
            <div style="font-size: 9px; line-height: 1.6; color: #4a5568;">
                <div style="margin-bottom: 8px; padding: 8px; background: #f7fafc; border-left: 3px solid #f97316; border-radius: 3px;">
                    <div style="font-weight: 700; color: #2d3748; margin-bottom: 4px;">Phase 1: Foundation (Months 1-2)</div>
                    <div>Implement direct booking engine, upgrade property photography, establish automated messaging, and set up dynamic pricing system.</div>
                </div>
                <div style="margin-bottom: 8px; padding: 8px; background: #f7fafc; border-left: 3px solid #fb923c; border-radius: 3px;">
                    <div style="font-weight: 700; color: #2d3748; margin-bottom: 4px;">Phase 2: Growth (Months 3-4)</div>
                    <div>Launch digital marketing campaigns, optimize OTA listings, introduce guest loyalty program, and enhance pre-arrival experience.</div>
                </div>
                <div style="margin-bottom: 8px; padding: 8px; background: #f7fafc; border-left: 3px solid #fed7aa; border-radius: 3px;">
                    <div style="font-weight: 700; color: #2d3748; margin-bottom: 4px;">Phase 3: Optimization (Months 5-6)</div>
                    <div>Analyze performance data, refine pricing strategy, expand direct booking channels, and implement advanced guest personalization.</div>
                </div>
            </div>
        </div>

        <!-- KEY METRICS TO TRACK -->
        <div class="section" style="margin-bottom: 8px;">
            <div class="section-title" style="font-size: 13px; margin-bottom: 8px;">Success Metrics</div>
            <table class="data-table" style="font-size: 9px;">
                <thead>
                    <tr>
                        <th>Metric</th>
                        <th>Current</th>
                        <th>Target (6 months)</th>
                        <th>Target (12 months)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Occupancy Rate</td>
                        <td>${metrics.occupancyRate}%</td>
                        <td>40%</td>
                        <td>60%</td>
                    </tr>
                    <tr>
                        <td>Direct Booking %</td>
                        <td>${(100 - metrics.otaDependency).toFixed(1)}%</td>
                        <td>30%</td>
                        <td>45%</td>
                    </tr>
                    <tr>
                        <td>Avg Booking Value</td>
                        <td>${formatCurrency(metrics.avgBookingValue, currency)}</td>
                        <td>${formatCurrency(metrics.avgBookingValue * 1.15, currency)}</td>
                        <td>${formatCurrency(metrics.avgBookingValue * 1.3, currency)}</td>
                    </tr>
                    <tr>
                        <td>Monthly Revenue</td>
                        <td>${formatCurrency(metrics.totalRevenue / 24, currency)}</td>
                        <td>${formatCurrency(metrics.totalRevenue / 24 * 1.5, currency)}</td>
                        <td>${formatCurrency(metrics.totalRevenue / 24 * 2, currency)}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="footer">
            ${propertyName} - Strategic Action Plan | Page 3
        </div>
    </div>

    <script>
        // Chart.js visualization for occupancy
        const ctx = document.getElementById('villaOccupancyChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ${JSON.stringify(propertyMetrics.map(p => p.name))},
                    datasets: [{
                        label: 'Occupancy Rate (%)',
                        data: ${JSON.stringify(propertyMetrics.map(p => p.occupancyRate))},
                        backgroundColor: ${JSON.stringify(propertyMetrics.map(() => '#f97316'))},
                        borderColor: ${JSON.stringify(propertyMetrics.map(() => '#ea580c'))},
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }
    </script>
</body>
</html>`;
}

async function main() {
  try {
    console.log('=== GENERATING BUSINESS REPORTS (v2 - Exact Format Match) ===\n');

    // Generate for Gita (Nismara)
    console.log('Processing Gita Pradnyana (Nismara Uma Villa)...');
    const gitaData = await fetchOwnerData(OWNER_IDS.gita, 'Gita Pradnyana');
    if (gitaData) {
      const gitaHTML = generateHTMLReport(
        'Gita Pradnyana',
        'Nismara Uma Villa',
        'IDR',
        gitaData
      );
      fs.writeFileSync('public/business-reports/nismara-dynamic.html', gitaHTML);
      console.log('✓ Generated: nismara-dynamic.html\n');
    }

    // Generate for Jose (Izumi)
    console.log('Processing Jose Carrallo (Izumi Hotel & Villas)...');
    const joseData = await fetchOwnerData(OWNER_IDS.jose, 'Jose Carrallo');
    if (joseData) {
      const joseHTML = generateHTMLReport(
        'Jose Carrallo',
        'Izumi Hotel & Villas',
        'USD',
        joseData
      );
      fs.writeFileSync('public/business-reports/izumi-dynamic.html', joseHTML);
      console.log('✓ Generated: izumi-dynamic.html\n');
    }

    console.log('=== DONE ===');
    console.log('\nFiles generated with EXACT format match:');
    console.log('- public/business-reports/nismara-dynamic.html');
    console.log('- public/business-reports/izumi-dynamic.html');
    console.log('\nReport structure:');
    console.log('  Page 1: Executive Summary with Key Observations');
    console.log('  Page 2: Villa Performance Breakdown');
    console.log('  Page 3: Recommended Strategic Actions');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
