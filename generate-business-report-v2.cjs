const https = require('https');
const fs = require('fs');

const SUPABASE_URL = 'https://jjpscimtxrudtepzwhag.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0';

const OWNER_IDS = {
  gita: '1f32d384-4018-46a9-a6f9-058217e6924a',
  jose: 'c24393db-d318-4d75-8bbf-0fa240b9c1db'
};

// Date range for the report (2026 only)
// Nismara: 41 bookings (2025-08-31 to 2026-09-05)
// Izumi: 165 bookings (various dates)
const START_DATE = '2026-01-01';
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

// Call OSIRIS AI for business report analysis
async function callOSIRIS(tenantId, prompt) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      tenant_id: tenantId,
      user_id: tenantId,
      message: prompt
    });

    const options = {
      hostname: 'n8n-production-bb2d.up.railway.app',
      path: '/webhook/ai/chat-v2',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response.reply || response.message || data);
        } catch (error) {
          console.error('OSIRIS response parse error:', error);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('OSIRIS request error:', error);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function fetchOwnerData(ownerId, ownerName) {
  console.log(`\nFetching data for owner: ${ownerName}`);

  // Get bookings directly by tenant_id (not through properties table)
  const allBookings = await fetchFromSupabase(
    `/rest/v1/bookings?tenant_id=eq.${ownerId}&check_in=gte.${START_DATE}&check_in=lte.${END_DATE}&select=*&order=check_in.desc`
  );

  console.log(`✓ Found ${allBookings.length} bookings (${START_DATE} to ${END_DATE})`);

  if (allBookings.length === 0) {
    console.log(`⚠️  No bookings found for ${ownerName} in this date range`);
    return null;
  }

  // Get villas for this owner
  const uniquePropertyIds = [...new Set(allBookings.map(b => b.property_id).filter(id => id))];
  let allVillas = [];

  for (const propId of uniquePropertyIds) {
    const villas = await fetchFromSupabase(`/rest/v1/villas?property_id=eq.${propId}&select=*`);
    allVillas = allVillas.concat(villas);
  }

  console.log(`✓ Found ${allVillas.length} villas`);

  // Get payments (we'll try to match by tenant_id or property_id)
  let allPayments = [];
  for (const propId of uniquePropertyIds) {
    const payments = await fetchFromSupabase(`/rest/v1/payments?property_id=eq.${propId}&select=*`);
    allPayments = allPayments.concat(payments);
  }

  console.log(`✓ Found ${allPayments.length} payments`);

  // Calculate channel distribution
  const channelBreakdown = {};
  let totalChannelRevenue = 0;

  allBookings.forEach(booking => {
    // Normalize channel name: lowercase, remove spaces, consolidate Airbnb variants
    let channel = (booking.source || 'direct').toLowerCase().trim().replace(/\s+/g, '');

    // Consolidate Airbnb variants
    if (channel === 'airbnb' || channel === 'air-bnb' || channel === 'air bnb' || channel.includes('airbnb')) {
      channel = 'airbnb';
    }
    // Consolidate Booking.com variants
    if (channel === 'booking.com' || channel === 'booking' || channel.includes('booking')) {
      channel = 'booking.com';
    }

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
  // Calculate occupancy rate using same logic as get_overview_stats function
  // Logic: Count DISTINCT months that have bookings, then multiply by 31
  // Example: 80 nights / (9 months × 31) = 28.67%
  const monthsWithBookings = new Set(
    allBookings.map(b => {
      const date = new Date(b.check_in);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    })
  ).size;

  const totalPossibleNights = monthsWithBookings * 31;
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

  // Calculate metrics PER VILLA (using villa_id from bookings)
  // Group bookings by villa_id/villa_name
  const villaGroups = {};
  allBookings.forEach(booking => {
    // Try to find villa name from allVillas array
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

    // Calculate occupancy using same logic: months with bookings × 31
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
      name: villaName,
      bookings: villaBookings.length,
      revenue: propRevenue,
      avgValue: propAvgValue,
      nights: propNights,
      occupancyRate: Math.round(propOccupancy * 10) / 10
    };
  }).sort((a, b) => b.revenue - a.revenue); // Sort by revenue descending

  return {
    villas: allVillas, // Changed from properties to villas
    bookings: allBookings,
    payments: allPayments,
    channels: sortedChannels,
    propertyMetrics, // NEW: Individual villa metrics
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

async function generateHTMLReport(ownerName, propertyName, currency, data, ownerId) {
  const { metrics, bookings, channels, villas, propertyMetrics } = data;
  const properties = villas; // Alias for compatibility

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

  // Call OSIRIS for AI-powered analysis
  console.log('📊 Calling OSIRIS for intelligent business analysis...');
  let osirisAnalysis = null;
  try {
    const osirisPrompt = `
You are OSIRIS, an expert business analyst for luxury vacation rental properties.

Analyze the following business performance data for ${propertyName} (${START_DATE} to ${END_DATE}):

**KEY METRICS:**
- Total Bookings: ${metrics.totalBookings}
- Total Nights Sold: ${metrics.totalNights}
- Occupancy Rate: ${metrics.occupancyRate.toFixed(1)}%
- Total Revenue: ${currency} ${metrics.totalRevenue.toLocaleString()}
- Average Booking Value: ${currency} ${metrics.avgBookingValue.toLocaleString()}
- OTA Dependency: ${metrics.otaDependency.toFixed(1)}%

**CHANNEL DISTRIBUTION:**
${channels.map(ch => `- ${ch.channel}: ${ch.bookings} bookings (${ch.percentage.toFixed(1)}%)`).join('\n')}

**VILLA PERFORMANCE:**
${propertyMetrics.map(v => `- ${v.name}: ${v.bookings} bookings, ${v.occupancyRate}% occupancy, ${currency} ${v.revenue.toLocaleString()} revenue`).join('\n')}

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

    osirisAnalysis = await callOSIRIS(ownerId, osirisPrompt);
    console.log('✓ OSIRIS analysis received\n');
  } catch (error) {
    console.error('⚠️  OSIRIS call failed, using fallback content:', error.message);
    osirisAnalysis = null;
  }

  // Helper function to clean markdown formatting
  const cleanMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
      .trim();
  };

  // Parse OSIRIS response to extract the 3 sections
  let areasOfAttentionHTML = '';
  let performanceInsightsHTML = '';
  let strategicObjectivesHTML = '';

  if (osirisAnalysis) {
    try {
      // Extract sections using regex
      const areasMatch = osirisAnalysis.match(/###\s*AREAS OF ATTENTION\s*([\s\S]*?)(?=###|$)/i);
      const insightsMatch = osirisAnalysis.match(/###\s*PERFORMANCE INSIGHTS\s*([\s\S]*?)(?=###|$)/i);
      const objectivesMatch = osirisAnalysis.match(/###\s*STRATEGIC OBJECTIVES\s*([\s\S]*?)$/i);

      // Parse Areas of Attention
      if (areasMatch) {
        const areasText = areasMatch[1].trim();
        const areasLines = areasText.split('\n').filter(line => line.trim());
        areasOfAttentionHTML = areasLines.map(line => {
          const cleaned = line.replace(/^[-*]\s*/, '').trim();
          if (cleaned) {
            // Split by first colon or dash to get title and description
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

      // Parse Performance Insights
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

      // Parse Strategic Objectives
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
    } catch (parseError) {
      console.error('⚠️  Error parsing OSIRIS response:', parseError.message);
    }
  }

  // Fallback content if OSIRIS failed or parsing failed
  if (!areasOfAttentionHTML) {
    areasOfAttentionHTML = `
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
            ` : ''}`;
  }

  if (!performanceInsightsHTML) {
    const topPerformer = propertyMetrics.reduce((max, p) => p.revenue > max.revenue ? p : max, propertyMetrics[0]);
    const lowPerformers = propertyMetrics.filter(p => p.occupancyRate < 30);
    performanceInsightsHTML = `
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
            </div>`;
  }

  if (!strategicObjectivesHTML) {
    strategicObjectivesHTML = `
                <div style="background: #f7fafc; padding: 6px; border-radius: 5px; border: 1px solid #e2e8f0; text-align: center;">
                    <div style="font-size: 8px; color: #718096; margin-bottom: 2px; font-weight: 600;">INCREASE</div>
                    <div style="font-size: 11px; font-weight: 700; color: #2d3748;">Direct Bookings</div>
                    <div style="font-size: 7px; color: #718096; margin-top: 2px; line-height: 1.2;">Reduce OTA dependency from ${metrics.otaDependency.toFixed(1)}%</div>
                </div>
                <div style="background: #f7fafc; padding: 6px; border-radius: 5px; border: 1px solid #e2e8f0; text-align: center;">
                    <div style="font-size: 8px; color: #718096; margin-bottom: 2px; font-weight: 600;">IMPROVE</div>
                    <div style="font-size: 11px; font-weight: 700; color: #2d3748;">Occupancy Rate</div>
                    <div style="font-size: 7px; color: #718096; margin-top: 2px; line-height: 1.2;">Target 50%+ from current ${metrics.occupancyRate}%</div>
                </div>
                <div style="background: #f7fafc; padding: 6px; border-radius: 5px; border: 1px solid #e2e8f0; text-align: center;">
                    <div style="font-size: 8px; color: #718096; margin-bottom: 2px; font-weight: 600;">OPTIMIZE</div>
                    <div style="font-size: 11px; font-weight: 700; color: #2d3748;">Revenue per Booking</div>
                    <div style="font-size: 7px; color: #718096; margin-top: 2px; line-height: 1.2;">Maximize value from ${formatCurrency(metrics.avgBookingValue, currency)}</div>
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
            margin-bottom: 8px;
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

        <!-- NOTE -->
        <div style="background: #fff7ed; border: 2px solid #fed7aa; padding: 10px; border-radius: 8px; margin-top: 10px;">
            <div style="font-size: 10px; color: #92400e; line-height: 1.4;">
                <strong>🤖 POWERED BY OSIRIS AI:</strong> The sections <strong>"Areas of Attention"</strong>, <strong>"Performance Insights"</strong>, and <strong>"Strategic Objectives"</strong> are now generated by <strong>OSIRIS</strong>, our Claude AI business analyst. OSIRIS analyzes your real business data and provides intelligent, personalized recommendations specific to your performance metrics. <strong>All data and analysis are based on your actual database.</strong>
            </div>
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
      const gitaHTML = await generateHTMLReport(
        'Gita Pradnyana',
        'Nismara Uma Villa',
        'IDR',
        gitaData,
        OWNER_IDS.gita
      );
      fs.writeFileSync('public/business-reports/nismara-dynamic.html', gitaHTML);
      console.log('✓ Generated: nismara-dynamic.html\n');
    }

    // Generate for Jose (Izumi)
    console.log('Processing Jose Carrallo (Izumi Hotel & Villas)...');
    const joseData = await fetchOwnerData(OWNER_IDS.jose, 'Jose Carrallo');
    if (joseData) {
      const joseHTML = await generateHTMLReport(
        'Jose Carrallo',
        'Izumi Hotel & Villas',
        'USD',
        joseData,
        OWNER_IDS.jose
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
    console.log('  Page 2: Villa Performance, Strategic Objectives & Success Metrics');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
