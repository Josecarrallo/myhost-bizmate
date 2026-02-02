/**
 * Business Report HTML Template Generator
 * Generates a 3-page HTML report with charts and data visualization
 */

import { formatCurrency, formatAbbreviated, formatPercentage, formatNumber, idrToUsd } from './currency-formatter.js';

/**
 * Generate complete HTML report
 * @param {Object} data - All report data from queries
 * @returns {string} Complete HTML document
 */
export function generateReport(data) {
  const { property, owner, villas, kpis, villaBreakdown, channels, commissions, paymentStatus, revenueTrend, upcomingBookings, ytd, period } = data;

  const currency = property.currency || 'USD';
  const propertyName = property.name || 'Property';
  const ownerName = owner.owner_name || 'Owner';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${propertyName} - Business Performance Analysis</title>
    ${getStyles()}
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    ${generatePage1(property, owner, kpis, channels, commissions, paymentStatus, period, currency)}
    ${generatePage2(property, villaBreakdown, period, currency)}
    ${generatePage3(property, kpis, commissions, period, currency, villaBreakdown)}
</body>
</html>`;
}

/**
 * Get CSS styles (based on reference HTML)
 */
function getStyles() {
  return `<style>
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

        script {
            display: none;
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
                max-height: 891mm !important;
                overflow: hidden !important;
            }
            .page {
                margin: 0;
                padding: 40px;
                box-shadow: none;
                page-break-inside: avoid;
                height: 297mm !important;
                max-height: 297mm !important;
                overflow: hidden !important;
                position: relative;
            }
            .page:nth-child(1) {
                page-break-before: avoid !important;
                page-break-after: always !important;
            }
            .page:nth-child(2) {
                page-break-before: always !important;
                page-break-after: always !important;
            }
            .page:nth-child(3) {
                page-break-before: always !important;
                page-break-after: avoid !important;
            }
            .page:nth-child(n+4) {
                display: none !important;
            }
            @page {
                margin: 0;
                size: A4 portrait;
            }
            @page :first {
                margin: 0;
            }
            @page :last {
                margin: 0;
            }
            script, noscript {
                display: none !important;
                height: 0 !important;
                width: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                visibility: hidden !important;
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

        .charts-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 25px;
        }

        .chart-container {
            background: #f7fafc;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }

        .chart-title {
            font-size: 13px;
            color: #2d3748;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .chart-container canvas {
            max-height: 120px;
        }

        .section {
            margin-bottom: 15px;
        }

        .page:last-child .section {
            margin-bottom: 10px;
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

        .summary-box {
            background: #fff7ed;
            border: 2px solid #fed7aa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
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
            color: #2d3748;
        }

        .observations-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 20px;
        }

        .observation-card {
            background: white;
            padding: 12px;
            border-radius: 6px;
            border: 2px solid #fed7aa;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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

        .phases-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 10px;
        }

        .phase-box {
            background: #f7fafc;
            border: 2px solid #cbd5e0;
            padding: 6px;
            border-radius: 6px;
        }

        .phase-number {
            display: inline-block;
            width: 24px;
            height: 24px;
            background: #f97316;
            color: white;
            border-radius: 50%;
            text-align: center;
            line-height: 24px;
            font-weight: 700;
            font-size: 12px;
            margin-bottom: 4px;
        }

        .phase-title {
            font-size: 10px;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 4px;
        }

        .phase-description {
            font-size: 8px;
            color: #4a5568;
            line-height: 1.3;
            margin-bottom: 4px;
        }

        .phase-deliverables {
            font-size: 7px;
            color: #718096;
            line-height: 1.3;
        }
    </style>`;
}

/**
 * Generate Page 1: Executive Summary
 */
function generatePage1(property, owner, kpis, channels, commissions, paymentStatus, period, currency) {
  const periodText = `${period.start} to ${period.end}`;

  // Calculate USD equivalent for IDR
  const revenueUSD = currency === 'IDR'
    ? idrToUsd(kpis.total_revenue)
    : kpis.total_revenue;

  return `<!-- PAGE 1: EXECUTIVE SUMMARY -->
    <div class="page">
        <div class="header">
            <h1>${property.name.toUpperCase()}</h1>
            <div class="subtitle">Business Performance Analysis | ${periodText}</div>
        </div>

        <!-- KEY METRICS -->
        <div class="metrics-grid">
            <div class="metric-box">
                <div class="metric-label">Total Bookings</div>
                <div class="metric-value">${kpis.total_bookings}</div>
            </div>
            <div class="metric-box">
                <div class="metric-label">Total Revenue</div>
                <div class="metric-value">${formatAbbreviated(kpis.total_revenue, currency)}</div>
                ${currency === 'IDR' ? `<div class="metric-subtitle">~${formatCurrency(revenueUSD, 'USD', false)}</div>` : ''}
            </div>
            <div class="metric-box">
                <div class="metric-label">Avg Booking Value</div>
                <div class="metric-value">${formatAbbreviated(kpis.avg_booking_value, currency)}</div>
            </div>
            <div class="metric-box">
                <div class="metric-label">Occupancy Rate</div>
                <div class="metric-value">${formatPercentage(kpis.occupancy_rate)}</div>
                <div class="metric-subtitle">${kpis.avg_length_of_stay.toFixed(1)} avg nights</div>
            </div>
        </div>

        <!-- OBSERVATIONS -->
        <div class="section">
            <div class="section-title">Key Observations</div>
            <div class="observations-grid">
                ${generateObservations(kpis, channels, commissions, paymentStatus, currency)}
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
                    ${generateChannelRows(channels, currency)}
                </tbody>
            </table>
        </div>

        <!-- AREAS OF ATTENTION -->
        <div class="section">
            <div class="section-title">Areas of Attention</div>
            ${generateAreasOfAttention(commissions, kpis, paymentStatus, currency)}
        </div>

        <div class="footer">
            ${property.name} | Generated: ${new Date().toLocaleDateString()}
        </div>
    </div>`;
}

/**
 * Generate observations cards
 */
function generateObservations(kpis, channels, commissions, paymentStatus, currency) {
  const observations = [];

  // Observation 1: Occupancy
  const occClass = kpis.occupancy_rate > 70 ? '' : (kpis.occupancy_rate > 40 ? 'warning' : 'critical');
  observations.push(`
    <div class="observation-card ${occClass}">
        <div class="observation-title">Occupancy Performance</div>
        <div class="observation-text">${formatPercentage(kpis.occupancy_rate)} occupancy with ${kpis.total_room_nights} room nights. ${
          kpis.occupancy_rate > 70 ? 'Strong performance.' :
          kpis.occupancy_rate > 40 ? 'Moderate. Growth opportunity exists.' :
          'Below industry average. Action needed.'
        }</div>
    </div>
  `);

  // Observation 2: Channel distribution
  const otaDependency = (commissions.ota_revenue / (commissions.ota_revenue + commissions.direct_revenue)) * 100;
  const channelClass = otaDependency > 70 ? 'critical' : (otaDependency > 50 ? 'warning' : '');
  observations.push(`
    <div class="observation-card ${channelClass}">
        <div class="observation-title">Channel Distribution</div>
        <div class="observation-text">${formatPercentage(otaDependency)} OTA dependency. ${
          otaDependency > 70 ? 'High commission exposure.' :
          otaDependency > 50 ? 'Consider increasing direct bookings.' :
          'Healthy channel mix.'
        }</div>
    </div>
  `);

  // Observation 3: Revenue
  observations.push(`
    <div class="observation-card">
        <div class="observation-title">Revenue Performance</div>
        <div class="observation-text">${formatCurrency(kpis.total_revenue, currency)} in ${kpis.total_bookings} bookings. Average ${formatCurrency(kpis.avg_booking_value, currency)} per booking.</div>
    </div>
  `);

  // Observation 4: Commission cost
  const commissionImpact = (commissions.ota_commission_cost / kpis.total_revenue) * 100;
  observations.push(`
    <div class="observation-card ${commissionImpact > 10 ? 'warning' : ''}">
        <div class="observation-title">OTA Commission Cost</div>
        <div class="observation-text">${formatCurrency(commissions.ota_commission_cost, currency)} paid in commissions (${formatPercentage(commissionImpact)} of total revenue).</div>
    </div>
  `);

  // Observation 5: Payment status
  const pendingAmount = paymentStatus.pending?.amount || 0;
  const paidAmount = paymentStatus.paid?.amount || 0;
  const pendingPercent = kpis.total_revenue > 0 ? (pendingAmount / kpis.total_revenue) * 100 : 0;
  observations.push(`
    <div class="observation-card ${pendingPercent > 50 ? 'warning' : ''}">
        <div class="observation-title">Payment Collection</div>
        <div class="observation-text">${formatCurrency(paidAmount, currency)} collected, ${formatCurrency(pendingAmount, currency)} pending (${formatPercentage(pendingPercent)}).</div>
    </div>
  `);

  // Observation 6: Length of stay
  observations.push(`
    <div class="observation-card">
        <div class="observation-title">Guest Behavior</div>
        <div class="observation-text">Average length of stay: ${kpis.avg_length_of_stay.toFixed(1)} nights. ${
          kpis.avg_length_of_stay > 5 ? 'Long stays indicate guest satisfaction.' :
          kpis.avg_length_of_stay > 3 ? 'Typical for vacation rentals.' :
          'Consider packages to increase stay duration.'
        }</div>
    </div>
  `);

  return observations.join('\n');
}

/**
 * Generate channel rows for table
 */
function generateChannelRows(channels, currency) {
  return Object.entries(channels)
    .map(([channel, data]) => `
      <tr>
        <td style="text-transform: capitalize;">${channel.replace('_', ' ')}</td>
        <td>${data.bookings}</td>
        <td>${formatCurrency(data.revenue, currency)}</td>
        <td>${formatPercentage(data.percentage)}</td>
      </tr>
    `).join('');
}

/**
 * Generate areas of attention boxes
 */
function generateAreasOfAttention(commissions, kpis, paymentStatus, currency) {
  return `
    <div class="summary-box">
        <h3>Distribution Channel Dependency</h3>
        <p>Current OTA commission expense: <span class="highlight-number">${formatCurrency(commissions.ota_commission_cost, currency)}</span> annually. Direct booking capability would reduce acquisition costs significantly.</p>
    </div>
    <div class="summary-box">
        <h3>Payment Collection</h3>
        <p>Pending payments: <span class="highlight-number">${formatCurrency(paymentStatus.pending?.amount || 0, currency)}</span> from ${paymentStatus.pending?.count || 0} bookings. Implement automated payment reminders to improve cash flow.</p>
    </div>
    <div class="summary-box">
        <h3>Occupancy Optimization</h3>
        <p>Current occupancy: <span class="highlight-number">${formatPercentage(kpis.occupancy_rate)}</span>. ${
          kpis.occupancy_rate < 40 ? 'Consider dynamic pricing and increased marketing to fill vacant dates.' :
          kpis.occupancy_rate < 70 ? 'Moderate performance with room for growth through targeted campaigns.' :
          'Strong performance. Focus on maintaining quality and guest satisfaction.'
        }</p>
    </div>
  `;
}

/**
 * Generate Page 2: Villa Performance Breakdown
 */
function generatePage2(property, villaBreakdown, period, currency) {
  if (!villaBreakdown || villaBreakdown.length === 0) {
    return ''; // Skip page if no villa breakdown (single villa properties)
  }

  const periodText = `${period.start} to ${period.end}`;

  // Find top and bottom performers
  const sortedByRevenue = [...villaBreakdown].sort((a, b) => b.revenue - a.revenue);
  const topPerformer = sortedByRevenue[0];
  const bottomPerformer = sortedByRevenue[sortedByRevenue.length - 1];

  return `<!-- PAGE 2: VILLA PERFORMANCE BREAKDOWN -->
    <div class="page">
        <div class="header">
            <h1>VILLA PERFORMANCE BREAKDOWN</h1>
            <div class="subtitle">${property.name} | ${periodText}</div>
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
                    ${villaBreakdown.map(villa => `
                        <tr${villa.villa_name === topPerformer.villa_name ? ' style="background: #f0fff4; font-weight: 600;"' : ''}>
                            <td>${villa.villa_name}</td>
                            <td>${villa.bookings}</td>
                            <td>${formatCurrency(villa.revenue, currency)}</td>
                            <td>${formatCurrency(villa.avg_booking_value, currency)}</td>
                            <td>${villa.room_nights}</td>
                            <td>
                                ${formatPercentage(villa.occupancy_rate)}
                                ${villa.occupancy_rate > 50 ? '<span class="badge badge-success">High</span>' :
                                  villa.occupancy_rate > 30 ? '<span class="badge badge-warning">Med</span>' :
                                  '<span class="badge badge-danger">Low</span>'}
                            </td>
                        </tr>
                    `).join('')}
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

            <div class="summary-box" style="background: #f0fff4; border-color: #9ae6b4;">
                <h3>⭐ Top Performer: ${topPerformer.villa_name}</h3>
                <p>
                    Leading with <span class="highlight-number">${topPerformer.bookings} bookings</span> and
                    <span class="highlight-number">${formatCurrency(topPerformer.revenue, currency)}</span> in revenue.
                    Achieving <span class="highlight-number">${formatPercentage(topPerformer.occupancy_rate)}</span> occupancy rate.
                    ${topPerformer.occupancy_rate > 50 ? 'Excellent performance demonstrates strong market demand.' : ''}
                </p>
            </div>

            ${bottomPerformer.occupancy_rate < 30 ? `
            <div class="summary-box" style="background: #fffaf0; border-color: #fbb6ce;">
                <h3>⚠️ Needs Attention: ${bottomPerformer.villa_name}</h3>
                <p>
                    Only <span class="highlight-number">${bottomPerformer.bookings} bookings</span> with
                    <span class="highlight-number">${formatPercentage(bottomPerformer.occupancy_rate)}</span> occupancy.
                    Consider: pricing adjustments, enhanced photos, targeted promotions, or room improvements.
                </p>
            </div>
            ` : ''}

            <div class="summary-box">
                <h3>Portfolio Optimization</h3>
                <p>
                    ${villaBreakdown.length} villas with varying performance levels.
                    Average occupancy across portfolio: <span class="highlight-number">${formatPercentage(
                      villaBreakdown.reduce((sum, v) => sum + v.occupancy_rate, 0) / villaBreakdown.length
                    )}</span>.
                    ${villaBreakdown.filter(v => v.occupancy_rate < 30).length > 0 ?
                      `${villaBreakdown.filter(v => v.occupancy_rate < 30).length} villa(s) underperforming (< 30% occupancy) require strategic attention.` :
                      'Balanced performance across all villas indicates healthy portfolio management.'}
                </p>
            </div>
        </div>

        <div class="footer">
            ${property.name} - Villa Performance Analysis | Page 2
        </div>
    </div>`;
}

/**
 * Generate Page 3: Recommended Actions
 */
function generatePage3(property, kpis, commissions, period, currency, villaBreakdown) {
  const otaDependency = (commissions.ota_revenue / (commissions.ota_revenue + commissions.direct_revenue)) * 100;

  return `<!-- PAGE 3: RECOMMENDED ACTIONS -->
    <div class="page">
        <div class="header">
            <h1>RECOMMENDED APPROACH</h1>
            <div class="subtitle">Strategic Action Plan for ${property.name}</div>
        </div>

        <!-- STRATEGIC OBJECTIVES -->
        <div class="section" style="margin-bottom: 8px;">
            <div class="section-title" style="font-size: 14px; margin-bottom: 8px;">Strategic Objectives</div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 6px;">
                <div style="background: #f7fafc; padding: 6px; border-radius: 5px; border: 1px solid #e2e8f0; text-align: center;">
                    <div style="font-size: 8px; color: #718096; margin-bottom: 2px; font-weight: 600;">INCREASE</div>
                    <div style="font-size: 12px; font-weight: 700; color: #2d3748;">Direct Bookings</div>
                    <div style="font-size: 7px; color: #718096; margin-top: 2px; line-height: 1.2;">Reduce OTA dependency from ${formatPercentage(otaDependency)}</div>
                </div>
                <div style="background: #f7fafc; padding: 6px; border-radius: 5px; border: 1px solid #e2e8f0; text-align: center;">
                    <div style="font-size: 8px; color: #718096; margin-bottom: 2px; font-weight: 600;">OPTIMIZE</div>
                    <div style="font-size: 12px; font-weight: 700; color: #2d3748;">Operations</div>
                    <div style="font-size: 7px; color: #718096; margin-top: 2px; line-height: 1.2;">Automate workflows & improve efficiency</div>
                </div>
                <div style="background: #f7fafc; padding: 6px; border-radius: 5px; border: 1px solid #e2e8f0; text-align: center;">
                    <div style="font-size: 8px; color: #718096; margin-bottom: 2px; font-weight: 600;">IMPROVE</div>
                    <div style="font-size: 12px; font-weight: 700; color: #2d3748;">Occupancy</div>
                    <div style="font-size: 7px; color: #718096; margin-top: 2px; line-height: 1.2;">Target: ${formatPercentage(Math.min(kpis.occupancy_rate * 1.5, 75))} in 12 months</div>
                </div>
            </div>
        </div>

        <!-- IMPLEMENTATION ROADMAP -->
        <div class="section" style="margin-bottom: 8px;">
            <div class="section-title" style="font-size: 14px; margin-bottom: 8px;">Implementation Roadmap</div>
            <div class="phases-grid" style="gap: 8px;">
                <div class="phase-box">
                    <div class="phase-number">1</div>
                    <div class="phase-title">AUTOPILOT Dashboard</div>
                    <div class="phase-description">Centralized management platform for property operations, booking tracking, guest database, and payment monitoring.</div>
                    <div class="phase-deliverables">
                        <strong>Deliverables:</strong><br>
                        • Property management module<br>
                        • Booking tracking system<br>
                        • Guest CRM database<br>
                        • Payment & maintenance tracking
                    </div>
                </div>

                <div class="phase-box">
                    <div class="phase-number">2</div>
                    <div class="phase-title">Landing Page & Direct Booking</div>
                    <div class="phase-description">Direct booking website with real-time calendar sync, online payment integration, and automated confirmations.</div>
                    <div class="phase-deliverables">
                        <strong>Deliverables:</strong><br>
                        • Public booking website<br>
                        • Calendar synchronization<br>
                        • Payment gateway integration<br>
                        • Automated confirmations
                    </div>
                </div>

                <div class="phase-box">
                    <div class="phase-number">3</div>
                    <div class="phase-title">Guest Communication - WhatsApp (BANYU) / Email</div>
                    <div class="phase-description">Automated WhatsApp and email communication system for booking confirmations, pre-arrival instructions, and post-stay follow-ups.</div>
                    <div class="phase-deliverables">
                        <strong>Deliverables:</strong><br>
                        • WhatsApp Business API (BANYU)<br>
                        • Email automation workflows<br>
                        • Guest communication templates<br>
                        • Review request automation
                    </div>
                </div>

                <div class="phase-box">
                    <div class="phase-number">4</div>
                    <div class="phase-title">Voice Assistant (KORA) and AI Agents/Functionality MYHOST Bizmate</div>
                    <div class="phase-description">24/7 AI-powered voice assistant and complete AI agent ecosystem for booking inquiries, customer support, and property management automation.</div>
                    <div class="phase-deliverables">
                        <strong>Deliverables:</strong><br>
                        • Voice AI integration (KORA)<br>
                        • Multi-language support<br>
                        • AI-powered booking automation<br>
                        • Complete MYHOST Bizmate AI functionality
                    </div>
                </div>
            </div>
        </div>

        <!-- EXPECTED OUTCOMES -->
        <div class="section" style="margin-bottom: 6px;">
            <div class="section-title" style="font-size: 13px; margin-bottom: 6px;">Expected Outcomes (12 Months)</div>
            <table class="data-table" style="font-size: 9px; margin-bottom: 8px;">
                <thead>
                    <tr>
                        <th>Metric</th>
                        <th>Current</th>
                        <th>Target</th>
                        <th>Impact</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Direct Bookings</strong></td>
                        <td>${formatPercentage(100 - otaDependency)}</td>
                        <td>30-40%</td>
                        <td>Reduced OTA commissions</td>
                    </tr>
                    <tr>
                        <td><strong>Occupancy Rate</strong></td>
                        <td>${formatPercentage(kpis.occupancy_rate)}</td>
                        <td>${formatPercentage(Math.min(kpis.occupancy_rate * 1.5, 75))}</td>
                        <td>Increased revenue</td>
                    </tr>
                    <tr>
                        <td><strong>Response Time</strong></td>
                        <td>2-12 hours</td>
                        <td>&lt;2 minutes (automated)</td>
                        <td>Improved conversion rate</td>
                    </tr>
                    <tr>
                        <td><strong>Operational Time</strong></td>
                        <td>2-3 hours/day</td>
                        <td>30-45 minutes/day</td>
                        <td>Time efficiency</td>
                    </tr>
                    <tr>
                        <td><strong>Commission Savings</strong></td>
                        <td>${formatCurrency(commissions.ota_commission_cost, currency)}/year</td>
                        <td>${formatCurrency(commissions.ota_commission_cost * 0.4, currency)}/year</td>
                        <td>60% reduction in OTA costs</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- NEXT STEPS -->
        <div class="section" style="margin-bottom: 0px;">
            <div class="section-title" style="margin-bottom: 6px; color: #f97316; font-size: 13px;">Recommended Next Steps</div>
            <div style="background: linear-gradient(135deg, #f97316 0%, #fb923c 100%); padding: 8px; border-radius: 6px; box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3);">
                <ol style="margin-left: 16px; font-size: 9px; color: white; line-height: 1.4; font-weight: 400;">
                    <li><strong style="color: white; font-weight: 600;">AUTOPILOT Dashboard:</strong> Begin centralized management platform setup and data migration</li>
                    <li><strong style="color: white; font-weight: 600;">Landing Page:</strong> Launch direct booking website with real-time calendar synchronization</li>
                    <li><strong style="color: white; font-weight: 600;">Guest Communication - WhatsApp (BANYU) / Email:</strong> Configure automated WhatsApp and email communication templates</li>
                    <li><strong style="color: white; font-weight: 600;">Voice Assistant (KORA) and AI Agents:</strong> Activate KORA assistant and complete MYHOST Bizmate AI functionality</li>
                    <li><strong style="color: white; font-weight: 600;">Performance Monitoring:</strong> Track metrics and adjust strategy based on data</li>
                </ol>
            </div>
        </div>

        <script>
        Chart.defaults.font.size = 10;
        Chart.defaults.font.family = "'Inter', sans-serif";

        // Villa Occupancy Chart (Page 2)
        ${villaBreakdown && villaBreakdown.length > 0 ? `
        const villaOccupancyCtx = document.getElementById('villaOccupancyChart');
        if (villaOccupancyCtx) {
            new Chart(villaOccupancyCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ${JSON.stringify(villaBreakdown.map(v => v.villa_name))},
                    datasets: [{
                        label: 'Occupancy %',
                        data: ${JSON.stringify(villaBreakdown.map(v => v.occupancy_rate))},
                        backgroundColor: ${JSON.stringify(villaBreakdown.map(v =>
                          v.occupancy_rate > 50 ? '#10b981' :
                          v.occupancy_rate > 30 ? '#f59e0b' :
                          '#ef4444'
                        ))},
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                callback: value => value + '%',
                                font: { size: 9 }
                            }
                        },
                        x: {
                            ticks: { font: { size: 9 } }
                        }
                    }
                }
            });
        }
        ` : ''}
        </script>
    </div>`;
}

/**
 * Generate Chart.js scripts
 */
function getChartScripts(kpis, villaBreakdown, revenueTrend, currency) {
  return `
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        Chart.defaults.font.size = 10;
        Chart.defaults.font.family = "'Inter', sans-serif";

        // Villa Occupancy Chart (Page 2)
        ${villaBreakdown && villaBreakdown.length > 0 ? `
        const villaOccupancyCtx = document.getElementById('villaOccupancyChart');
        if (villaOccupancyCtx) {
            new Chart(villaOccupancyCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ${JSON.stringify(villaBreakdown.map(v => v.villa_name))},
                    datasets: [{
                        label: 'Occupancy %',
                        data: ${JSON.stringify(villaBreakdown.map(v => v.occupancy_rate))},
                        backgroundColor: ${JSON.stringify(villaBreakdown.map(v =>
                          v.occupancy_rate > 50 ? '#10b981' :
                          v.occupancy_rate > 30 ? '#f59e0b' :
                          '#ef4444'
                        ))},
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                callback: value => value + '%',
                                font: { size: 9 }
                            }
                        },
                        x: {
                            ticks: { font: { size: 9 } }
                        }
                    }
                }
            });
        }
        ` : ''}
    </script>
  `;
}
