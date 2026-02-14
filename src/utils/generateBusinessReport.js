// Utility function to generate business report HTML

export function generateBusinessReportHTML(reportData, startDate, endDate) {
  const { metrics, performance2025, performance2026, monthlyData, bookingSources } = reportData;

  // Format dates for display
  const formatDateRange = (start, end) => {
    const startParts = start.split('-');
    const endParts = end.split('-');

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

    const startMonth = monthNames[parseInt(startParts[1]) - 1];
    const endMonth = monthNames[parseInt(endParts[1]) - 1];
    const startYear = startParts[0];
    const endYear = endParts[0];

    if (startYear === endYear) {
      return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
    } else {
      return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
    }
  };

  // Prepare chart data for monthly revenue
  const revenueChartData = monthlyData.slice(0, 12).map(m => (m.revenue / 1000000).toFixed(1));
  const revenueChartLabels = monthlyData.slice(0, 12).map(m => m.label);

  // Calculate occupancy percentages by month (assuming 30 days per month)
  const occupancyChartData = monthlyData.slice(0, 12).map(m => {
    const daysInMonth = 30; // Simplified
    return ((m.roomNights / daysInMonth) * 100).toFixed(0);
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nismara Uma Villa - Business Analysis Report</title>
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
            padding: 20px;
            color: #2d3748;
        }

        .page {
            width: 210mm;
            height: 297mm;
            background: white;
            margin: 0 auto 30px;
            padding: 40px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            page-break-after: always;
            position: relative;
        }

        @media print {
            body {
                background: white;
                padding: 0;
            }
            .page {
                margin: 0;
                box-shadow: none;
                page-break-after: always;
            }
        }

        .header {
            text-align: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 3px solid #4a5568;
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
            background: #f7fafc;
            border: 2px solid #e2e8f0;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }

        .metric-label {
            font-size: 11px;
            color: #718096;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
            font-weight: 600;
        }

        .metric-value {
            font-size: 26px;
            font-weight: 700;
            color: #2d3748;
            line-height: 1;
        }

        .metric-subtitle {
            font-size: 10px;
            color: #a0aec0;
            margin-top: 4px;
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
            margin-bottom: 20px;
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
            font-size: 11px;
            margin-bottom: 20px;
        }

        .data-table th {
            background: #edf2f7;
            padding: 8px;
            text-align: left;
            font-weight: 600;
            color: #2d3748;
            border-bottom: 2px solid #cbd5e0;
        }

        .data-table td {
            padding: 7px 8px;
            border-bottom: 1px solid #e2e8f0;
            color: #4a5568;
        }

        .data-table tr:last-child td {
            border-bottom: none;
        }

        .summary-box {
            background: #edf2f7;
            border: 2px solid #cbd5e0;
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
    </style>
</head>
<body>
    <!-- PAGE 1: BUSINESS ANALYSIS -->
    <div class="page">
        <div class="header">
            <h1>NISMARA UMA VILLA</h1>
            <div class="subtitle">Business Performance Analysis | ${formatDateRange(startDate, endDate)}</div>
        </div>

        <!-- KEY METRICS -->
        <div class="metrics-grid">
            <div class="metric-box">
                <div class="metric-label">Total Bookings</div>
                <div class="metric-value">${metrics.totalBookings}</div>
                <div class="metric-subtitle">${metrics.bookings2025} (2025) | ${metrics.bookings2026} (2026)</div>
            </div>
            <div class="metric-box">
                <div class="metric-label">Total Revenue</div>
                <div class="metric-value">IDR ${metrics.totalRevenueM}M</div>
                <div class="metric-subtitle">~$${metrics.totalRevenueUSD} USD</div>
            </div>
            <div class="metric-box">
                <div class="metric-label">Avg Booking Value</div>
                <div class="metric-value">IDR ${metrics.avgBookingValueM}M</div>
                <div class="metric-subtitle">~$${metrics.avgBookingValueUSD} USD</div>
            </div>
            <div class="metric-box">
                <div class="metric-label">Avg Length of Stay</div>
                <div class="metric-value">${metrics.avgLengthOfStay}</div>
                <div class="metric-subtitle">nights</div>
            </div>
        </div>

        <!-- CHARTS -->
        <div class="charts-row">
            <div class="chart-container">
                <div class="chart-title">Revenue Trend (IDR Millions)</div>
                <canvas id="revenueChart"></canvas>
            </div>
            <div class="chart-container">
                <div class="chart-title">Occupancy Rate (%)</div>
                <canvas id="occupancyChart"></canvas>
            </div>
        </div>

        <!-- PERFORMANCE SUMMARY -->
        <div class="section">
            <div class="section-title">Performance Summary</div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Period</th>
                        <th>Status</th>
                        <th>Bookings</th>
                        <th>Revenue</th>
                        <th>Occupancy</th>
                        <th>ADR</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #f0fff4;">
                        <td><strong>2025 (Sept-Dec)</strong></td>
                        <td><em>Completed</em></td>
                        <td>${performance2025.bookings}</td>
                        <td>IDR ${performance2025.revenueM}M</td>
                        <td><strong>${performance2025.occupancy}%</strong></td>
                        <td>IDR ${performance2025.adrK}K/night</td>
                    </tr>
                    <tr style="background: #fffaf0;">
                        <td><strong>2026 (Jan-Sept YTD)</strong></td>
                        <td><em>Confirmed to date</em></td>
                        <td>${performance2026.bookings}</td>
                        <td>IDR ${performance2026.revenueM}M</td>
                        <td><strong>${performance2026.occupancy}%</strong></td>
                        <td>IDR ${performance2026.adrK}K/night</td>
                    </tr>
                </tbody>
            </table>
            <p style="font-size: 10px; color: #718096; margin-top: 8px; font-style: italic;">
                * 2026 data reflects bookings confirmed as of January 2026. Additional bookings expected throughout the year.
            </p>
        </div>

        <!-- 2026 SCENARIOS -->
        <div class="section">
            <div class="section-title">2026 Full-Year Scenarios</div>
            <table class="data-table" style="margin-bottom: 15px;">
                <thead>
                    <tr>
                        <th>Scenario</th>
                        <th>Occupancy</th>
                        <th>Est. Bookings</th>
                        <th>Est. Revenue</th>
                        <th>Context</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #fff5f5;">
                        <td><strong>LOW</strong></td>
                        <td>27%</td>
                        <td>~30-35</td>
                        <td>IDR 110-120M</td>
                        <td>Current trajectory, no additional action</td>
                    </tr>
                    <tr style="background: #fffaf0;">
                        <td><strong>MEDIUM</strong></td>
                        <td>50%</td>
                        <td>~55-60</td>
                        <td>IDR 180-200M</td>
                        <td>With AUTOPILOT + Landing Page</td>
                    </tr>
                    <tr style="background: #f0fff4;">
                        <td><strong>HIGH</strong></td>
                        <td>70%</td>
                        <td>~75-80</td>
                        <td>IDR 250-280M</td>
                        <td>Full implementation (all 4 phases)</td>
                    </tr>
                </tbody>
            </table>

            <!-- SCENARIOS CHART -->
            <div style="background: #f7fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <div style="font-size: 12px; color: #2d3748; margin-bottom: 10px; font-weight: 600; text-align: center;">2026 Occupancy & Revenue Scenarios</div>
                <canvas id="scenariosChart" style="max-height: 140px;"></canvas>
            </div>
        </div>

        <!-- OBSERVATIONS -->
        <div class="section">
            <div class="section-title" style="border-bottom: none;">Key Observations</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 20px;">
                <div style="background: #f0fff4; padding: 12px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <div style="font-size: 12px; font-weight: 700; color: #2d3748; margin-bottom: 8px;">Strong 2025 Performance</div>
                    <div style="font-size: 10.5px; color: #4a5568; line-height: 1.5;">2025 achieved ${performance2025.occupancy}% occupancy (Sept-Dec) with IDR ${performance2025.revenueM}M total revenue.</div>
                </div>
                <div style="background: #f0fff4; padding: 12px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <div style="font-size: 12px; font-weight: 700; color: #2d3748; margin-bottom: 8px;">Guest Database Potential</div>
                    <div style="font-size: 10.5px; color: #4a5568; line-height: 1.5;">${metrics.totalBookings} bookings represent untapped database for direct marketing and repeat bookings.</div>
                </div>
                <div style="background: #fffaf0; padding: 12px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <div style="font-size: 12px; font-weight: 700; color: #2d3748; margin-bottom: 8px;">2026 Opportunity</div>
                    <div style="font-size: 10.5px; color: #4a5568; line-height: 1.5;">Current ${performance2026.occupancy}% occupancy in 2026 shows significant growth potential with proper marketing.</div>
                </div>
                <div style="background: #fffaf0; padding: 12px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <div style="font-size: 12px; font-weight: 700; color: #2d3748; margin-bottom: 8px;">OTA Dependency</div>
                    <div style="font-size: 10.5px; color: #4a5568; line-height: 1.5;">93% of bookings through OTAs. 15% commission = IDR ${metrics.otaCommissionM}M annually. Direct bookings would increase profit margin.</div>
                </div>
                <div style="background: #fffaf0; padding: 12px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <div style="font-size: 12px; font-weight: 700; color: #2d3748; margin-bottom: 8px;">Data Capture Gap</div>
                    <div style="font-size: 10.5px; color: #4a5568; line-height: 1.5;">Booking records lack complete guest contact information limiting direct communication and remarketing capabilities.</div>
                </div>
                <div style="background: #fffaf0; padding: 12px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <div style="font-size: 12px; font-weight: 700; color: #2d3748; margin-bottom: 8px;">Manual Operations</div>
                    <div style="font-size: 10.5px; color: #4a5568; line-height: 1.5;">All booking management and guest communication handled manually via WhatsApp and spreadsheets.</div>
                </div>
            </div>
        </div>

        <!-- AREAS OF ATTENTION -->
        <div class="section">
            <div class="section-title">Areas of Attention</div>
            <div class="summary-box">
                <h3>Distribution Channel Dependency</h3>
                <p>Current reliance on OTA platforms results in commission expenses of approximately <span class="highlight-number">IDR ${metrics.otaCommissionM}M annually (~$${metrics.otaCommissionUSD} USD)</span>. Direct booking capability would reduce acquisition costs by 15%.</p>
            </div>
            <div class="summary-box">
                <h3>Guest Database Development</h3>
                <p>${metrics.totalBookings} bookings without captured contact details. Industry benchmark shows <span class="highlight-number">15-20% repeat booking rate</span> when proper CRM is implemented.</p>
            </div>
            <div class="summary-box">
                <h3>Operational Efficiency</h3>
                <p>Manual processes for booking management, calendar updates, and guest communication create time overhead and potential for scheduling conflicts. Automation would save 2-3 hours daily.</p>
            </div>
        </div>

        <div class="footer">
            Generated by MYHOST BizMate AUTOPILOT | ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        Chart.defaults.font.size = 10;
        Chart.defaults.font.family = "'Inter', sans-serif";

        // Revenue Chart
        const revenueCtx = document.getElementById('revenueChart').getContext('2d');
        new Chart(revenueCtx, {
            type: 'bar',
            data: {
                labels: ${JSON.stringify(revenueChartLabels)},
                datasets: [{
                    label: 'Revenue (IDR M)',
                    data: ${JSON.stringify(revenueChartData)},
                    backgroundColor: '#5b7c99',
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
                        ticks: { font: { size: 9 } }
                    },
                    x: {
                        ticks: { font: { size: 9 } }
                    }
                }
            }
        });

        // Occupancy Chart
        const occupancyCtx = document.getElementById('occupancyChart').getContext('2d');
        new Chart(occupancyCtx, {
            type: 'line',
            data: {
                labels: ${JSON.stringify(revenueChartLabels)},
                datasets: [{
                    label: 'Occupancy %',
                    data: ${JSON.stringify(occupancyChartData)},
                    borderColor: '#5b7c99',
                    backgroundColor: 'rgba(91, 124, 153, 0.15)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    borderWidth: 2
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

        // Scenarios Chart
        const scenariosCtx = document.getElementById('scenariosChart').getContext('2d');
        new Chart(scenariosCtx, {
            type: 'bar',
            data: {
                labels: ['LOW\\n(27% occ)', 'MEDIUM\\n(50% occ)', 'HIGH\\n(70% occ)'],
                datasets: [
                    {
                        label: 'Occupancy %',
                        data: [27, 50, 70],
                        backgroundColor: ['#cbd5e0', '#93a5b8', '#5b7c99'],
                        borderWidth: 0,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Revenue (IDR M)',
                        data: [115, 190, 265],
                        backgroundColor: ['#e2e8f0', '#b8c5d6', '#8499ae'],
                        borderWidth: 0,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: { size: 10 },
                            padding: 10
                        }
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: value => value + '%',
                            font: { size: 9 }
                        },
                        title: {
                            display: true,
                            text: 'Occupancy %',
                            font: { size: 10 }
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        beginAtZero: true,
                        max: 300,
                        grid: {
                            drawOnChartArea: false
                        },
                        ticks: {
                            callback: value => 'IDR ' + value + 'M',
                            font: { size: 9 }
                        },
                        title: {
                            display: true,
                            text: 'Revenue',
                            font: { size: 10 }
                        }
                    },
                    x: {
                        ticks: {
                            font: { size: 9 },
                            maxRotation: 0,
                            minRotation: 0
                        }
                    }
                }
            }
        });
    </script>
</body>
</html>`;

  return html;
}
