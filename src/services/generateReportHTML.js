// Generate complete HTML for business report
export function generateReportHTML(ownerName, propertyName, currency, data, osirisAnalysis) {
  console.log('✅ generateReportHTML v2.1 - MOBILE RESPONSIVE with Rate label');
  const { metrics, channels, propertyMetrics } = data;
  const properties = propertyMetrics; // Alias

  const START_DATE = '2026-01-01';
  const END_DATE = '2026-12-31';

  // Helper function to clean markdown
  const cleanMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .trim();
  };

  // Format currency
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

  // Parse OSIRIS analysis
  let areasOfAttentionHTML = '';
  let performanceInsightsHTML = '';
  let strategicObjectivesHTML = '';

  if (osirisAnalysis) {
    try {
      const areasMatch = osirisAnalysis.match(/###\s*AREAS OF ATTENTION\s*([\s\S]*?)(?=###|$)/i);
      const insightsMatch = osirisAnalysis.match(/###\s*PERFORMANCE INSIGHTS\s*([\s\S]*?)(?=###|$)/i);
      const objectivesMatch = osirisAnalysis.match(/###\s*STRATEGIC OBJECTIVES\s*([\s\S]*?)$/i);

      if (areasMatch) {
        const areasText = areasMatch[1].trim();
        const areasLines = areasText.split('\n').filter(line => line.trim());
        areasOfAttentionHTML = areasLines.map(line => {
          const cleaned = line.replace(/^[-*]\s*/, '').trim();
          if (cleaned) {
            const parts = cleaned.split(/[:–-]/);
            const title = cleanMarkdown(parts[0].trim());
            const desc = parts.slice(1).join(':').trim() || '';
            return `
            <div class="summary-box">
                <h3>${title}</h3>
                ${desc ? `<p>${cleanMarkdown(desc)}</p>` : ''}
            </div>`;
          }
          return '';
        }).join('');
      }

      if (insightsMatch) {
        const insightsText = insightsMatch[1].trim();
        const insightsLines = insightsText.split('\n').filter(line => line.trim());
        performanceInsightsHTML = insightsLines.map((line, idx) => {
          const cleaned = line.replace(/^[-*]\s*/, '').trim();
          if (cleaned) {
            const parts = cleaned.split(/[:–-]/);
            const title = cleanMarkdown(parts[0].trim());
            const desc = parts.slice(1).join(':').trim() || '';
            const bgColor = idx === 0 ? '#f0fff4' : '#fffaf0';
            const borderColor = idx === 0 ? '#9ae6b4' : '#fbb6ce';
            return `
            <div class="summary-box" style="background: ${bgColor}; border-color: ${borderColor};">
                <h3>${idx === 0 ? '⭐ ' : ''}${title}</h3>
                ${desc ? `<p>${cleanMarkdown(desc)}</p>` : ''}
            </div>`;
          }
          return '';
        }).join('');
      }

      if (objectivesMatch) {
        const objectivesText = objectivesMatch[1].trim();
        const objectivesLines = objectivesText.split('\n').filter(line => line.trim() && line.includes('OBJECTIVE'));
        const objectives = objectivesLines.slice(0, 3).map(line => {
          const parts = line.split('|').map(p => p.trim());
          if (parts.length >= 3) {
            return {
              action: parts[0].replace(/OBJECTIVE \d+:\s*/i, '').trim(),
              goal: parts[1],
              target: parts[2]
            };
          }
          return null;
        }).filter(obj => obj !== null);

        if (objectives.length > 0) {
          strategicObjectivesHTML = objectives.map(obj => `
                <div style="background: #f7fafc; padding: 6px; border-radius: 5px; border: 1px solid #e2e8f0; text-align: center;">
                    <div style="font-size: 8px; color: #718096; margin-bottom: 2px; font-weight: 600;">${cleanMarkdown(obj.action).toUpperCase()}</div>
                    <div style="font-size: 11px; font-weight: 700; color: #2d3748;">${cleanMarkdown(obj.goal)}</div>
                    <div style="font-size: 7px; color: #718096; margin-top: 2px; line-height: 1.2;">${cleanMarkdown(obj.target)}</div>
                </div>`).join('');
        }
      }
    } catch (e) {
      console.error('Error parsing OSIRIS:', e);
    }
  }

  // Fallback if OSIRIS failed
  if (!areasOfAttentionHTML) {
    areasOfAttentionHTML = `<div class="summary-box"><h3>Low Occupancy Rate</h3><p>Current occupancy: ${metrics.occupancyRate.toFixed(1)}%</p></div>`;
  }
  if (!performanceInsightsHTML) {
    performanceInsightsHTML = `<div class="summary-box"><h3>Revenue Performance</h3><p>Total revenue: ${formatCurrencyFull(metrics.totalRevenue, currency)}</p></div>`;
  }
  if (!strategicObjectivesHTML) {
    strategicObjectivesHTML = `
      <div style="background: #f7fafc; padding: 6px; border-radius: 5px; border: 1px solid #e2e8f0; text-align: center;">
        <div style="font-size: 8px; color: #718096; margin-bottom: 2px; font-weight: 600;">INCREASE</div>
        <div style="font-size: 11px; font-weight: 700; color: #2d3748;">Direct Bookings</div>
        <div style="font-size: 7px; color: #718096; margin-top: 2px;">Reduce OTA dependency</div>
      </div>`;
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
            width: 100%;
            max-width: 900px;
            margin: 0 auto 20px auto;
            background: white;
            padding: 20px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            position: relative;
        }

        @media (min-width: 768px) {
            .page {
                padding: 40px;
            }
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
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 3px solid #f97316;
        }

        .header h1 {
            font-size: 28px;
            color: #1a202c;
            margin-bottom: 6px;
            font-weight: 700;
        }

        .header .subtitle {
            font-size: 14px;
            color: #718096;
            font-weight: 500;
        }

        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 25px;
        }

        @media (min-width: 768px) {
            .metrics-grid {
                grid-template-columns: repeat(4, 1fr);
            }
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
            margin-bottom: 12px;
        }

        .section-title {
            font-size: 15px;
            color: #1a202c;
            margin-bottom: 6px;
            font-weight: 700;
            padding-bottom: 4px;
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
            grid-template-columns: 1fr;
            gap: 8px;
            margin-bottom: 12px;
        }

        @media (min-width: 768px) {
            .observations-grid {
                grid-template-columns: repeat(2, 1fr);
            }
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
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 8px;
        }

        .summary-box h3 {
            font-size: 13px;
            color: #2d3748;
            margin-bottom: 6px;
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

        /* Mobile Responsive Styles */
        @media (max-width: 767px) {
            .page {
                padding: 20px !important;
            }

            .metrics-grid {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 5px !important;
            }

            .metric-box {
                padding: 8px 4px !important;
                overflow: hidden !important;
            }

            .metric-label {
                font-size: 8px !important;
                word-break: break-word !important;
                overflow-wrap: break-word !important;
                line-height: 1.2 !important;
                letter-spacing: -0.3px !important;
                text-transform: uppercase !important;
            }

            .metric-value {
                font-size: 16px !important;
                margin-top: 4px !important;
            }

            .metric-subtitle {
                font-size: 6px !important;
                word-break: break-word !important;
                margin-top: 2px !important;
            }

            .header {
                padding: 15px !important;
            }

            .title {
                font-size: 18px !important;
            }

            .subtitle {
                font-size: 11px !important;
            }
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
            <div style="font-size:8px;color:#999;text-align:center;margin-top:5px;">VERSION 2.1 MOBILE</div>
        </div>

        <!-- KEY METRICS -->
        <div class="metrics-grid">
            <div class="metric-box">
                <div class="metric-label">Bookings</div>
                <div class="metric-value">${metrics.totalBookings}</div>
            </div>
            <div class="metric-box">
                <div class="metric-label">Revenue</div>
                <div class="metric-value">${formatCurrency(metrics.totalRevenue, currency)}</div>
                ${currency === 'IDR' ? `<div class="metric-subtitle">~$${Math.round(metrics.totalRevenue / 16000).toLocaleString()}</div>` : ''}
            </div>
            <div class="metric-box">
                <div class="metric-label">Avg Value</div>
                <div class="metric-value">${formatCurrency(metrics.avgBookingValue, currency)}</div>
            </div>
            <div class="metric-box">
                <div class="metric-label">Rate</div>
                <div class="metric-value">${metrics.occupancyRate.toFixed(1)}%</div>
                <div class="metric-subtitle">${metrics.avgStayLength.toFixed(1)} nights</div>
            </div>
        </div>

        <!-- OBSERVATIONS -->
        <div class="section">
            <div class="section-title">Key Observations</div>
            <div class="observations-grid">
                <div class="observation-card ${metrics.occupancyRate < 30 ? 'critical' : ''}">
                    <div class="observation-title">Rate Performance</div>
                    <div class="observation-text">${metrics.occupancyRate.toFixed(1)}% rate with ${metrics.totalNights} room nights. ${metrics.occupancyRate < 30 ? 'Below industry average. Action needed.' : 'Performing well.'}</div>
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
                    <div class="observation-text">Average length of stay: ${metrics.avgStayLength.toFixed(1)} nights. ${metrics.avgStayLength < 3 ? 'Consider packages to increase stay duration.' : 'Good stay duration.'}</div>
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

        <!-- AREAS OF ATTENTION (OSIRIS AI) -->
        <div class="section">
            <div class="section-title">Areas of Attention</div>
            ${areasOfAttentionHTML}
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
                        <th>Bkgs</th>
                        <th>Revenue</th>
                        <th>Avg</th>
                        <th>Nights</th>
                        <th>Rate</th>
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
                            ${prop.occupancyRate.toFixed(1)}%
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
            <div class="section-title">Rate by Villa</div>
            <div style="background: #f7fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <canvas id="villaOccupancyChart" style="max-height: 180px;"></canvas>
            </div>
        </div>

        <!-- INSIGHTS (OSIRIS AI) -->
        <div class="section">
            <div class="section-title">Performance Insights</div>
            ${performanceInsightsHTML}
        </div>

        <!-- STRATEGIC OBJECTIVES (OSIRIS AI) -->
        <div class="section" style="margin-bottom: 6px;">
            <div class="section-title" style="font-size: 13px; margin-bottom: 6px;">Strategic Objectives</div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 6px;">
                ${strategicObjectivesHTML}
            </div>
        </div>

        <!-- KEY METRICS TO TRACK -->
        <div class="section" style="margin-bottom: 6px;">
            <div class="section-title" style="font-size: 12px; margin-bottom: 6px;">Success Metrics</div>
            <table class="data-table" style="font-size: 8px;">
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
                        <td>Rate</td>
                        <td>${metrics.occupancyRate.toFixed(1)}%</td>
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
            ${propertyName} - Villa Performance & Strategic Plan | Page 2
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
                        data: ${JSON.stringify(propertyMetrics.map(p => parseFloat(p.occupancyRate.toFixed(1))))},
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
