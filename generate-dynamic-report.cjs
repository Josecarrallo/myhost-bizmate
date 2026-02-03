const https = require('https');
const fs = require('fs');

const SUPABASE_URL = 'https://jjpscimtxrudtepzwhag.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0';

const OWNER_IDS = {
  gita: '1f32d384-4018-46a9-a6f9-058217e6924a',
  jose: 'c24393db-d318-4d75-8bbf-0fa240b9c1db'
};

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

async function fetchOwnerData(ownerId) {
  console.log(`\nFetching data for owner: ${ownerId}`);

  // Get properties
  const properties = await fetchFromSupabase(`/rest/v1/properties?owner_id=eq.${ownerId}&select=*`);
  console.log(`✓ Found ${properties.length} properties`);

  if (properties.length === 0) {
    return null;
  }

  const propertyIds = properties.map(p => p.id);

  // Get bookings for all properties
  let allBookings = [];
  let allPayments = [];
  let allLeads = [];

  for (const propId of propertyIds) {
    const bookings = await fetchFromSupabase(`/rest/v1/bookings?property_id=eq.${propId}&select=*`);
    const payments = await fetchFromSupabase(`/rest/v1/payments?property_id=eq.${propId}&select=*`);
    const leads = await fetchFromSupabase(`/rest/v1/leads?property_id=eq.${propId}&select=*`);

    allBookings = allBookings.concat(bookings);
    allPayments = allPayments.concat(payments);
    allLeads = allLeads.concat(leads);
  }

  console.log(`✓ Found ${allBookings.length} bookings`);
  console.log(`✓ Found ${allPayments.length} payments`);
  console.log(`✓ Found ${allLeads.length} leads`);

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

  const daysInPeriod = 365;
  const totalPossibleNights = propertyIds.length * daysInPeriod;
  const occupancyRate = totalPossibleNights > 0 && totalNights > 0
    ? (totalNights / totalPossibleNights) * 100
    : 0;

  const avgNightlyRate = totalNights > 0 && totalRevenue > 0
    ? totalRevenue / totalNights
    : 0;

  return {
    properties,
    bookings: allBookings,
    payments: allPayments,
    leads: allLeads,
    metrics: {
      totalRevenue,
      totalBookings,
      occupancyRate: Math.round(occupancyRate * 10) / 10,
      avgNightlyRate: Math.round(avgNightlyRate * 100) / 100,
      totalNights
    }
  };
}

function formatCurrency(amount, currency = 'USD') {
  if (currency === 'IDR') {
    return `IDR ${(amount / 1000000).toFixed(1)}M`;
  }
  return `$${amount.toLocaleString('en-US')}`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function generateHTMLReport(ownerName, propertyName, currency, data) {
  const { metrics, bookings, payments, properties } = data;

  // Sort bookings by date (most recent first)
  const sortedBookings = bookings.sort((a, b) => new Date(b.check_in) - new Date(a.check_in));

  // Get recent bookings (last 10)
  const recentBookings = sortedBookings.slice(0, 10);

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

        .status-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 9px;
            font-weight: 600;
        }

        .status-confirmed {
            background: #c6f6d5;
            color: #22543d;
        }

        .status-pending {
            background: #fef3c7;
            color: #78350f;
        }

        .status-completed {
            background: #c6f6d5;
            color: #22543d;
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

        .footer {
            text-align: center;
            color: #718096;
            font-size: 10px;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 2px solid #e2e8f0;
        }
    </style>
</head>
<body>
    <!-- PAGE 1: Overview -->
    <div class="page">
        <div class="header">
            <h1>${propertyName}</h1>
            <div class="subtitle">Owner: ${ownerName} | Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>

        <!-- Key Metrics -->
        <div class="metrics-grid">
            <div class="metric-box">
                <div class="metric-label">Total Bookings</div>
                <div class="metric-value">${metrics.totalBookings}</div>
            </div>
            <div class="metric-box">
                <div class="metric-label">Total Revenue</div>
                <div class="metric-value">${formatCurrency(metrics.totalRevenue, currency)}</div>
            </div>
            <div class="metric-box">
                <div class="metric-label">Occupancy Rate</div>
                <div class="metric-value">${metrics.occupancyRate}%</div>
                <div class="metric-subtitle">${metrics.totalNights} nights</div>
            </div>
            <div class="metric-box">
                <div class="metric-label">Avg Nightly Rate</div>
                <div class="metric-value">${formatCurrency(metrics.avgNightlyRate, currency)}</div>
            </div>
        </div>

        <!-- Properties Section -->
        <div class="section">
            <div class="section-title">Properties (${properties.length})</div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Property Name</th>
                        <th>Location</th>
                        <th>Type</th>
                        <th>Max Guests</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${properties.map(prop => `
                    <tr>
                        <td><strong>${prop.name}</strong></td>
                        <td>${prop.location || 'N/A'}</td>
                        <td>${prop.property_type || 'Villa'}</td>
                        <td>${prop.max_guests || 'N/A'}</td>
                        <td><span class="status-badge status-confirmed">Active</span></td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <!-- Recent Bookings Section -->
        <div class="section">
            <div class="section-title">Recent Bookings (Last ${Math.min(recentBookings.length, 10)})</div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Guest Name</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th>Guests</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${recentBookings.map(booking => `
                    <tr>
                        <td><strong>${booking.guest_name || 'N/A'}</strong></td>
                        <td>${formatDate(booking.check_in)}</td>
                        <td>${formatDate(booking.check_out)}</td>
                        <td>${booking.num_guests || 0}</td>
                        <td>${formatCurrency(booking.total_price || 0, currency)}</td>
                        <td><span class="status-badge status-${booking.status}">${booking.status}</span></td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <!-- Payment Summary -->
        <div class="section">
            <div class="section-title">Payment Summary</div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Count</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Completed</strong></td>
                        <td>${payments.filter(p => p.status === 'completed').length}</td>
                        <td>${formatCurrency(payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0), currency)}</td>
                    </tr>
                    <tr>
                        <td><strong>Pending</strong></td>
                        <td>${payments.filter(p => p.status === 'pending').length}</td>
                        <td>${formatCurrency(payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0), currency)}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="footer">
            <p>Generated by MYHOST BizMate - Business Intelligence Platform</p>
            <p>Report generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
    </div>
</body>
</html>`;
}

async function main() {
  try {
    console.log('=== GENERATING DYNAMIC BUSINESS REPORTS ===\n');

    // Generate for Gita (Nismara)
    console.log('Processing Gita Pradnyana (Nismara Uma Villa)...');
    const gitaData = await fetchOwnerData(OWNER_IDS.gita);
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
    const joseData = await fetchOwnerData(OWNER_IDS.jose);
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
    console.log('\nFiles generated:');
    console.log('- public/business-reports/nismara-dynamic.html');
    console.log('- public/business-reports/izumi-dynamic.html');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
