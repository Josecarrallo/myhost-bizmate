// Specialized Reports HTML Generation
// Matches the styling from generateReportHTML.js

// Helper function to format currency
const formatCurrency = (amount, curr) => {
  if (curr === 'IDR') {
    return `Rp ${Math.round(amount / 1000).toLocaleString('id-ID')}K`;
  }
  return `$${Math.round(amount).toLocaleString('en-US')}`;
};

const formatCurrencyFull = (amount, curr) => {
  if (curr === 'IDR') {
    return `IDR ${Math.round(amount).toLocaleString('id-ID')}`;
  }
  return `USD ${Math.round(amount).toLocaleString('en-US')}`;
};

// Base HTML template with consistent styling
const getBaseHTML = (title, subtitle, content) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
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
            width: 100%;
            max-width: 900px;
            margin: 0 auto 20px auto;
            background: white;
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
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #f97316;
        }

        .header h1 {
            font-size: 32px;
            color: #1a202c;
            margin-bottom: 8px;
            font-weight: 700;
        }

        .header .subtitle {
            font-size: 16px;
            color: #718096;
            font-weight: 500;
        }

        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 30px;
        }

        @media (max-width: 767px) {
            .metrics-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
            }
        }

        .metric-box {
            background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
            border: none;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(249, 115, 22, 0.25);
        }

        .metric-label {
            font-size: 12px;
            color: white;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-bottom: 10px;
            font-weight: 600;
            opacity: 0.95;
        }

        .metric-value {
            font-size: 28px;
            font-weight: 700;
            color: white;
            line-height: 1;
        }

        .metric-subtitle {
            font-size: 11px;
            color: white;
            margin-top: 6px;
            opacity: 0.9;
        }

        .section {
            margin-bottom: 25px;
        }

        .section-title {
            font-size: 18px;
            color: #1a202c;
            margin-bottom: 15px;
            font-weight: 700;
            padding-bottom: 8px;
            border-bottom: 2px solid #e2e8f0;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
            margin-bottom: 20px;
        }

        .data-table th {
            background: #ffedd5;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #1a202c;
            border-bottom: 2px solid #fb923c;
        }

        .data-table td {
            padding: 10px 12px;
            border-bottom: 1px solid #e2e8f0;
            color: #4a5568;
        }

        .data-table tr:last-child td {
            border-bottom: none;
        }

        .data-table tr:nth-child(even) {
            background: #f7fafc;
        }

        .data-table tr:hover {
            background: #fff7ed;
        }

        .summary-box {
            background: #fff7ed;
            border: 2px solid #fed7aa;
            padding: 16px;
            border-radius: 10px;
            margin-bottom: 15px;
        }

        .summary-box h3 {
            font-size: 16px;
            color: #2d3748;
            margin-bottom: 8px;
            font-weight: 700;
        }

        .summary-box p {
            font-size: 13px;
            color: #4a5568;
            line-height: 1.6;
        }

        .highlight-number {
            font-weight: 700;
            color: #f97316;
        }

        .footer {
            text-align: center;
            font-size: 11px;
            color: #a0aec0;
            padding-top: 20px;
            margin-top: 30px;
            border-top: 1px solid #e2e8f0;
        }

        .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            margin-left: 8px;
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

        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 25px;
        }

        @media (max-width: 767px) {
            .info-grid {
                grid-template-columns: 1fr;
            }
        }

        .info-card {
            background: #fff7ed;
            border: 2px solid #fed7aa;
            padding: 15px;
            border-radius: 10px;
        }

        .info-card.warning {
            background: #fff7ed;
            border-color: #fb923c;
        }

        .info-card.critical {
            background: #fed7aa;
            border-color: #f97316;
        }

        .info-title {
            font-size: 14px;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 8px;
        }

        .info-text {
            font-size: 12px;
            color: #4a5568;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="header">
            <h1>${title}</h1>
            <div class="subtitle">${subtitle}</div>
        </div>
        ${content}
        <div class="footer">
            ${title} | Generated: ${new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
        </div>
    </div>
</body>
</html>`;
};

// 1. Monthly Occupancy Report
export function generateMonthlyOccupancyHTML(reportData, ownerName, propertyName, currency) {
  const { monthlyData, totalBookings, dateRange } = reportData;

  const totalNights = monthlyData.reduce((sum, m) => sum + m.nights, 0);
  const totalRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0);
  const avgOccupancy = monthlyData.reduce((sum, m) => sum + m.occupancyRate, 0) / monthlyData.length;

  const metricsHTML = `
    <div class="metrics-grid">
      <div class="metric-box">
        <div class="metric-label">Total Months</div>
        <div class="metric-value">${monthlyData.length}</div>
      </div>
      <div class="metric-box">
        <div class="metric-label">Total Bookings</div>
        <div class="metric-value">${totalBookings}</div>
      </div>
      <div class="metric-box">
        <div class="metric-label">Total Nights</div>
        <div class="metric-value">${totalNights}</div>
      </div>
      <div class="metric-box">
        <div class="metric-label">Avg Occupancy</div>
        <div class="metric-value">${avgOccupancy.toFixed(1)}%</div>
      </div>
    </div>
  `;

  const tableHTML = `
    <div class="section">
      <div class="section-title">Monthly Breakdown</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Bookings</th>
            <th>Nights</th>
            <th>Occupancy</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          ${monthlyData.map(month => `
            <tr>
              <td><strong>${month.month}</strong></td>
              <td>${month.bookings}</td>
              <td>${month.nights}</td>
              <td>
                ${month.occupancyRate.toFixed(1)}%
                ${month.occupancyRate >= 60 ? '<span class="badge badge-success">Good</span>' :
                  month.occupancyRate >= 30 ? '<span class="badge badge-warning">Medium</span>' :
                  '<span class="badge badge-danger">Low</span>'}
              </td>
              <td>${formatCurrencyFull(month.revenue, currency)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  // Channel breakdown for each month
  const channelsHTML = monthlyData.map(month => {
    const channels = Object.entries(month.channels);
    if (channels.length === 0) return '';

    return `
      <div class="summary-box">
        <h3>${month.month} - Channel Distribution</h3>
        <table class="data-table" style="margin-top: 10px; margin-bottom: 0;">
          <thead>
            <tr>
              <th>Channel</th>
              <th>Bookings</th>
              <th>Nights</th>
              <th>% of Month</th>
            </tr>
          </thead>
          <tbody>
            ${channels.map(([channel, data]) => `
              <tr>
                <td style="text-transform: capitalize;">${channel}</td>
                <td>${data.bookings}</td>
                <td>${data.nights}</td>
                <td>${((data.nights / month.nights) * 100).toFixed(1)}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }).join('');

  const content = metricsHTML + tableHTML + `
    <div class="section">
      <div class="section-title">Channel Distribution by Month</div>
      ${channelsHTML}
    </div>
  `;

  return getBaseHTML(
    'MONTHLY OCCUPANCY REPORT',
    `${propertyName} | ${dateRange.startDate} to ${dateRange.endDate}`,
    content
  );
}

// 2. Revenue by Channel Report
export function generateRevenueByChannelHTML(reportData, ownerName, propertyName, currency) {
  const { channels, totalRevenue, totalBookings, dateRange } = reportData;

  const metricsHTML = `
    <div class="metrics-grid">
      <div class="metric-box">
        <div class="metric-label">Total Revenue</div>
        <div class="metric-value">${formatCurrency(totalRevenue, currency)}</div>
        ${currency === 'IDR' ? `<div class="metric-subtitle">~$${Math.round(totalRevenue / 16000).toLocaleString()}</div>` : ''}
      </div>
      <div class="metric-box">
        <div class="metric-label">Total Bookings</div>
        <div class="metric-value">${totalBookings}</div>
      </div>
      <div class="metric-box">
        <div class="metric-label">Channels</div>
        <div class="metric-value">${channels.length}</div>
      </div>
      <div class="metric-box">
        <div class="metric-label">Avg per Booking</div>
        <div class="metric-value">${formatCurrency(totalRevenue / totalBookings, currency)}</div>
      </div>
    </div>
  `;

  const tableHTML = `
    <div class="section">
      <div class="section-title">Channel Performance</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Channel</th>
            <th>Bookings</th>
            <th>Nights</th>
            <th>Revenue</th>
            <th>% of Total</th>
          </tr>
        </thead>
        <tbody>
          ${channels.map(ch => `
            <tr>
              <td style="text-transform: capitalize; font-weight: 600;">${ch.name}</td>
              <td>${ch.bookings}</td>
              <td>${ch.nights}</td>
              <td><span class="highlight-number">${formatCurrencyFull(ch.revenue, currency)}</span></td>
              <td>
                ${ch.percentage.toFixed(1)}%
                ${ch.percentage >= 40 ? '<span class="badge badge-danger">High Dependency</span>' :
                  ch.percentage >= 25 ? '<span class="badge badge-warning">Moderate</span>' :
                  '<span class="badge badge-success">Balanced</span>'}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  const insightsHTML = `
    <div class="info-grid">
      ${channels.slice(0, 4).map((ch, idx) => `
        <div class="info-card ${ch.percentage >= 40 ? 'critical' : ch.percentage >= 25 ? 'warning' : ''}">
          <div class="info-title">${ch.name.charAt(0).toUpperCase() + ch.name.slice(1)}</div>
          <div class="info-text">
            <strong>${ch.bookings}</strong> bookings generating <strong>${formatCurrencyFull(ch.revenue, currency)}</strong>
            (${ch.percentage.toFixed(1)}% of total revenue)
          </div>
        </div>
      `).join('')}
    </div>
  `;

  const content = metricsHTML + tableHTML + `
    <div class="section">
      <div class="section-title">Channel Insights</div>
      ${insightsHTML}
    </div>
  `;

  return getBaseHTML(
    'REVENUE BY CHANNEL REPORT',
    `${propertyName} | ${dateRange.startDate} to ${dateRange.endDate}`,
    content
  );
}

// 3. ADR & RevPAR Report
export function generateADRRevPARHTML(reportData, ownerName, propertyName, currency) {
  const { adr, revpar, occupancyRate, totalRevenue, totalNights, totalBookings, daysInPeriod, dateRange } = reportData;

  const metricsHTML = `
    <div class="metrics-grid">
      <div class="metric-box">
        <div class="metric-label">ADR</div>
        <div class="metric-value">${formatCurrency(adr, currency)}</div>
        <div class="metric-subtitle">Average Daily Rate</div>
      </div>
      <div class="metric-box">
        <div class="metric-label">RevPAR</div>
        <div class="metric-value">${formatCurrency(revpar, currency)}</div>
        <div class="metric-subtitle">Revenue Per Available Room</div>
      </div>
      <div class="metric-box">
        <div class="metric-label">Occupancy Rate</div>
        <div class="metric-value">${occupancyRate.toFixed(1)}%</div>
        <div class="metric-subtitle">${totalNights} nights sold</div>
      </div>
      <div class="metric-box">
        <div class="metric-label">Total Revenue</div>
        <div class="metric-value">${formatCurrency(totalRevenue, currency)}</div>
        ${currency === 'IDR' ? `<div class="metric-subtitle">~$${Math.round(totalRevenue / 16000).toLocaleString()}</div>` : ''}
      </div>
    </div>
  `;

  const summaryHTML = `
    <div class="section">
      <div class="section-title">Performance Summary</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Value</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>ADR (Average Daily Rate)</strong></td>
            <td class="highlight-number">${formatCurrencyFull(adr, currency)}</td>
            <td>Total Revenue ÷ Nights Sold</td>
          </tr>
          <tr>
            <td><strong>RevPAR (Revenue Per Available Room)</strong></td>
            <td class="highlight-number">${formatCurrencyFull(revpar, currency)}</td>
            <td>Total Revenue ÷ Available Room Nights</td>
          </tr>
          <tr>
            <td><strong>Occupancy Rate</strong></td>
            <td class="highlight-number">${occupancyRate.toFixed(1)}%</td>
            <td>Nights Sold ÷ Available Nights</td>
          </tr>
          <tr>
            <td><strong>Total Bookings</strong></td>
            <td class="highlight-number">${totalBookings}</td>
            <td>Number of reservations</td>
          </tr>
          <tr>
            <td><strong>Total Nights Sold</strong></td>
            <td class="highlight-number">${totalNights}</td>
            <td>Room nights occupied</td>
          </tr>
          <tr>
            <td><strong>Total Available Nights</strong></td>
            <td class="highlight-number">${daysInPeriod}</td>
            <td>Days in reporting period</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  const insightsHTML = `
    <div class="info-grid">
      <div class="info-card ${adr < 500000 && currency === 'IDR' ? 'warning' : ''}">
        <div class="info-title">ADR Analysis</div>
        <div class="info-text">
          Your average daily rate is <strong>${formatCurrencyFull(adr, currency)}</strong>.
          ${adr < 500000 && currency === 'IDR' ? 'Consider increasing rates during peak seasons.' : 'Rates are competitive.'}
        </div>
      </div>
      <div class="info-card ${occupancyRate < 30 ? 'critical' : occupancyRate < 60 ? 'warning' : ''}">
        <div class="info-title">Occupancy Performance</div>
        <div class="info-text">
          Current occupancy at <strong>${occupancyRate.toFixed(1)}%</strong>.
          ${occupancyRate < 30 ? 'Below industry average - action needed.' : occupancyRate < 60 ? 'Room for improvement.' : 'Excellent performance!'}
        </div>
      </div>
      <div class="info-card">
        <div class="info-title">RevPAR Insight</div>
        <div class="info-text">
          RevPAR of <strong>${formatCurrencyFull(revpar, currency)}</strong> indicates overall revenue efficiency.
          Target: Increase both ADR and occupancy to boost RevPAR.
        </div>
      </div>
      <div class="info-card">
        <div class="info-title">Revenue Potential</div>
        <div class="info-text">
          Potential revenue if 100% occupied: <strong>${formatCurrencyFull(adr * daysInPeriod, currency)}</strong>.
          Current achievement: <strong>${occupancyRate.toFixed(1)}%</strong>
        </div>
      </div>
    </div>
  `;

  const content = metricsHTML + summaryHTML + `
    <div class="section">
      <div class="section-title">Key Insights</div>
      ${insightsHTML}
    </div>
  `;

  return getBaseHTML(
    'ADR & RevPAR ANALYSIS',
    `${propertyName} | ${dateRange.startDate} to ${dateRange.endDate}`,
    content
  );
}

// 4. Cancellation Report
export function generateCancellationHTML(reportData, ownerName, propertyName, currency) {
  const { totalCancellations, confirmedBookings, totalBookings, lostRevenue, cancellationRate, totalPotentialRevenue, cancelledBookings, dateRange } = reportData;

  const metricsHTML = `
    <div class="metrics-grid">
      <div class="metric-box">
        <div class="metric-label">Cancellations</div>
        <div class="metric-value">${totalCancellations}</div>
        <div class="metric-subtitle">out of ${totalBookings} bookings</div>
      </div>
      <div class="metric-box">
        <div class="metric-label">Cancellation Rate</div>
        <div class="metric-value">${cancellationRate.toFixed(1)}%</div>
        ${cancellationRate >= 20 ? '<div class="metric-subtitle" style="color: #fee;">High Risk</div>' : '<div class="metric-subtitle">Acceptable</div>'}
      </div>
      <div class="metric-box">
        <div class="metric-label">Lost Revenue</div>
        <div class="metric-value">${formatCurrency(lostRevenue, currency)}</div>
        ${currency === 'IDR' ? `<div class="metric-subtitle">~$${Math.round(lostRevenue / 16000).toLocaleString()}</div>` : ''}
      </div>
      <div class="metric-box">
        <div class="metric-label">Confirmed</div>
        <div class="metric-value">${confirmedBookings}</div>
        <div class="metric-subtitle">${((confirmedBookings / totalBookings) * 100).toFixed(1)}% success rate</div>
      </div>
    </div>
  `;

  const summaryHTML = `
    <div class="section">
      <div class="section-title">Cancellation Summary</div>
      <div class="info-grid">
        <div class="info-card ${cancellationRate >= 20 ? 'critical' : cancellationRate >= 10 ? 'warning' : ''}">
          <div class="info-title">Cancellation Impact</div>
          <div class="info-text">
            <strong>${totalCancellations}</strong> cancelled bookings resulted in
            <strong>${formatCurrencyFull(lostRevenue, currency)}</strong> in lost revenue
            (<strong>${((lostRevenue / totalPotentialRevenue) * 100).toFixed(1)}%</strong> of potential revenue).
          </div>
        </div>
        <div class="info-card">
          <div class="info-title">Success Rate</div>
          <div class="info-text">
            <strong>${confirmedBookings}</strong> bookings confirmed out of <strong>${totalBookings}</strong> total
            (<strong>${((confirmedBookings / totalBookings) * 100).toFixed(1)}%</strong> confirmation rate).
          </div>
        </div>
      </div>
    </div>
  `;

  const tableHTML = cancelledBookings.length > 0 ? `
    <div class="section">
      <div class="section-title">Cancelled Bookings Detail</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Guest</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Nights</th>
            <th>Lost Revenue</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          ${cancelledBookings.map(booking => {
            const nights = Math.ceil((new Date(booking.check_out) - new Date(booking.check_in)) / (1000 * 60 * 60 * 24));
            return `
              <tr>
                <td>${booking.guest_name || 'N/A'}</td>
                <td>${booking.check_in}</td>
                <td>${booking.check_out}</td>
                <td>${nights}</td>
                <td class="highlight-number">${formatCurrencyFull(booking.total_price || 0, currency)}</td>
                <td style="text-transform: capitalize;">${booking.source || 'direct'}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  ` : '<div class="summary-box"><h3>No Cancelled Bookings</h3><p>Excellent! All bookings in this period were confirmed.</p></div>';

  const content = metricsHTML + summaryHTML + tableHTML;

  return getBaseHTML(
    'CANCELLATION REPORT',
    `${propertyName} | ${dateRange.startDate} to ${dateRange.endDate}`,
    content
  );
}

// 5. Monthly Owner Statement
export function generateOwnerStatementHTML(reportData, ownerName, propertyName, currency) {
  const { monthlyStatements, totalGrossRevenue, dateRange } = reportData;

  const totalOTACommission = monthlyStatements.reduce((sum, m) => sum + m.otaCommission, 0);
  const totalManagementFee = monthlyStatements.reduce((sum, m) => sum + m.managementFee, 0);
  const totalNetPayout = monthlyStatements.reduce((sum, m) => sum + m.netPayout, 0);

  const metricsHTML = `
    <div class="metrics-grid">
      <div class="metric-box">
        <div class="metric-label">Gross Revenue</div>
        <div class="metric-value">${formatCurrency(totalGrossRevenue, currency)}</div>
        ${currency === 'IDR' ? `<div class="metric-subtitle">~$${Math.round(totalGrossRevenue / 16000).toLocaleString()}</div>` : ''}
      </div>
      <div class="metric-box">
        <div class="metric-label">OTA Commission</div>
        <div class="metric-value">${formatCurrency(totalOTACommission, currency)}</div>
        <div class="metric-subtitle">${((totalOTACommission / totalGrossRevenue) * 100).toFixed(1)}% of gross</div>
      </div>
      <div class="metric-box">
        <div class="metric-label">Management Fee</div>
        <div class="metric-value">${formatCurrency(totalManagementFee, currency)}</div>
        <div class="metric-subtitle">${((totalManagementFee / totalGrossRevenue) * 100).toFixed(1)}% of gross</div>
      </div>
      <div class="metric-box">
        <div class="metric-label">Net Payout</div>
        <div class="metric-value">${formatCurrency(totalNetPayout, currency)}</div>
        <div class="metric-subtitle">${((totalNetPayout / totalGrossRevenue) * 100).toFixed(1)}% of gross</div>
      </div>
    </div>
  `;

  const tableHTML = `
    <div class="section">
      <div class="section-title">Monthly Breakdown</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Bookings</th>
            <th>Gross Revenue</th>
            <th>OTA Commission (15%)</th>
            <th>Management Fee (20%)</th>
            <th>Net Payout</th>
          </tr>
        </thead>
        <tbody>
          ${monthlyStatements.map(month => `
            <tr>
              <td><strong>${month.month}</strong></td>
              <td>${month.bookings.length}</td>
              <td>${formatCurrencyFull(month.grossRevenue, currency)}</td>
              <td>${formatCurrencyFull(month.otaCommission, currency)}</td>
              <td>${formatCurrencyFull(month.managementFee, currency)}</td>
              <td><span class="highlight-number">${formatCurrencyFull(month.netPayout, currency)}</span></td>
            </tr>
          `).join('')}
          <tr style="background: #ffedd5; font-weight: 700;">
            <td>TOTAL</td>
            <td>${monthlyStatements.reduce((sum, m) => sum + m.bookings.length, 0)}</td>
            <td class="highlight-number">${formatCurrencyFull(totalGrossRevenue, currency)}</td>
            <td>${formatCurrencyFull(totalOTACommission, currency)}</td>
            <td>${formatCurrencyFull(totalManagementFee, currency)}</td>
            <td class="highlight-number">${formatCurrencyFull(totalNetPayout, currency)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  const insightsHTML = `
    <div class="section">
      <div class="section-title">Financial Summary</div>
      <div class="info-grid">
        <div class="info-card">
          <div class="info-title">Revenue Distribution</div>
          <div class="info-text">
            From <strong>${formatCurrencyFull(totalGrossRevenue, currency)}</strong> gross revenue:<br>
            • OTA Commission: <strong>${formatCurrencyFull(totalOTACommission, currency)}</strong> (${((totalOTACommission / totalGrossRevenue) * 100).toFixed(1)}%)<br>
            • Management Fee: <strong>${formatCurrencyFull(totalManagementFee, currency)}</strong> (${((totalManagementFee / totalGrossRevenue) * 100).toFixed(1)}%)<br>
            • Net Payout: <strong>${formatCurrencyFull(totalNetPayout, currency)}</strong> (${((totalNetPayout / totalGrossRevenue) * 100).toFixed(1)}%)
          </div>
        </div>
        <div class="info-card ${(totalOTACommission / totalGrossRevenue) > 0.1 ? 'warning' : ''}">
          <div class="info-title">OTA Dependency</div>
          <div class="info-text">
            OTA commissions represent <strong>${((totalOTACommission / totalGrossRevenue) * 100).toFixed(1)}%</strong> of gross revenue.
            ${(totalOTACommission / totalGrossRevenue) > 0.1 ? 'Consider increasing direct bookings to reduce commission costs.' : 'Good balance of booking channels.'}
          </div>
        </div>
        <div class="info-card">
          <div class="info-title">Average Monthly Payout</div>
          <div class="info-text">
            Your average monthly net payout is <strong>${formatCurrencyFull(totalNetPayout / monthlyStatements.length, currency)}</strong>
            from <strong>${formatCurrencyFull(totalGrossRevenue / monthlyStatements.length, currency)}</strong> in monthly gross revenue.
          </div>
        </div>
        <div class="info-card">
          <div class="info-title">Fee Structure</div>
          <div class="info-text">
            • OTA bookings: 15% commission + 20% management fee<br>
            • Direct bookings: 0% commission + 20% management fee<br>
            Increasing direct bookings saves 15% in OTA fees.
          </div>
        </div>
      </div>
    </div>
  `;

  const content = metricsHTML + tableHTML + insightsHTML;

  return getBaseHTML(
    'MONTHLY OWNER STATEMENT',
    `${propertyName} | ${dateRange.startDate} to ${dateRange.endDate}`,
    content
  );
}
