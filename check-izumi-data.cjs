const https = require('https');

const SUPABASE_URL = 'https://jjpscimtxrudtepzwhag.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0';

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

async function main() {
  console.log('=== CHECKING IZUMI DATA IN SUPABASE ===\n');

  // Get Izumi bookings
  const bookings = await fetchFromSupabase(
    '/rest/v1/bookings?property_id=eq.18711359-1378-4d12-9ea6-fb31c0b1bac2&check_in=gte.2024-01-01&check_in=lte.2026-01-31&select=*'
  );

  console.log(`Total bookings: ${bookings.length}`);

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
  console.log(`Total revenue: $${totalRevenue.toLocaleString()}`);

  const totalNights = bookings.reduce((sum, b) => {
    const ci = new Date(b.check_in);
    const co = new Date(b.check_out);
    const nights = Math.ceil((co - ci) / (1000 * 60 * 60 * 24));
    return sum + nights;
  }, 0);
  console.log(`Total nights: ${totalNights}`);
  console.log(`Avg nights per booking: ${(totalNights / bookings.length).toFixed(1)}`);
  console.log(`Avg booking value: $${(totalRevenue / bookings.length).toFixed(0)}`);

  // Calculate occupancy rate
  // Period: 2024-01-01 to 2026-01-31
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2026-01-31');
  const daysInPeriod = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  // Group by villa
  const villaBreakdown = {};
  bookings.forEach(b => {
    const villa = b.room_id || 'Unknown';
    if (!villaBreakdown[villa]) {
      villaBreakdown[villa] = { count: 0, revenue: 0, nights: 0 };
    }
    villaBreakdown[villa].count++;
    villaBreakdown[villa].revenue += b.total_price || 0;
    const nights = Math.ceil((new Date(b.check_out) - new Date(b.check_in)) / (1000 * 60 * 60 * 24));
    villaBreakdown[villa].nights += nights;
  });

  const numVillas = Object.keys(villaBreakdown).length;
  console.log(`\nNumber of unique villas: ${numVillas}`);
  console.log(`Days in period: ${daysInPeriod}`);
  console.log(`Total possible nights (all villas): ${daysInPeriod * numVillas}`);

  // Calculate occupancy rate
  const totalPossibleNights = daysInPeriod * numVillas;
  const occupancyRate = (totalNights / totalPossibleNights) * 100;
  console.log(`\nOccupancy Rate: ${occupancyRate.toFixed(1)}%`);
  console.log(`  (${totalNights} actual nights / ${totalPossibleNights} possible nights)`);

  console.log('\n=== VILLA BREAKDOWN ===\n');
  Object.entries(villaBreakdown)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .forEach(([villa, data]) => {
      const villaOccupancy = (data.nights / daysInPeriod) * 100;
      console.log(`${villa}:`);
      console.log(`  Bookings: ${data.count}`);
      console.log(`  Revenue: $${data.revenue.toLocaleString()}`);
      console.log(`  Nights: ${data.nights}`);
      console.log(`  Occupancy: ${villaOccupancy.toFixed(1)}%`);
      console.log('');
    });
}

main().catch(console.error);
