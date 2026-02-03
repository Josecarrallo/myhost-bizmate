const https = require('https');

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
  console.log('=== NISMARA UMA VILLA - 2026 DATA ===\n');

  // Get Nismara bookings for 2026
  const bookings = await fetchFromSupabase(
    '/rest/v1/bookings?property_id=eq.24dede0c-7eb1-4e62-96c0-ecf9f66cbc12&check_in=gte.2026-01-01&check_in=lte.2026-12-31&select=*&order=check_in.asc'
  );

  console.log(`Total bookings in 2026: ${bookings.length}`);
  console.log('\nBooking details:');
  console.log('NO | Guest Name | Check-in | Check-out | Nights | Price | Source');
  console.log('---|------------|----------|-----------|--------|-------|--------');

  let totalRevenue = 0;
  let totalNights = 0;

  bookings.forEach((b, i) => {
    const nights = Math.ceil((new Date(b.check_out) - new Date(b.check_in)) / (1000 * 60 * 60 * 24));
    totalRevenue += b.total_price || 0;
    totalNights += nights;

    console.log(
      `${i + 1} | ${b.guest_name} | ${b.check_in} | ${b.check_out} | ${nights} | ${b.total_price ? `IDR ${b.total_price.toLocaleString()}` : '-'} | ${b.source || 'direct'}`
    );
  });

  console.log('\n=== TOTALS ===');
  console.log(`Total bookings: ${bookings.length}`);
  console.log(`Total revenue: IDR ${totalRevenue.toLocaleString()}`);
  console.log(`Total nights: ${totalNights}`);
  console.log(`Avg nights per booking: ${(totalNights / bookings.length).toFixed(1)}`);

  console.log('\n=== COMPARISON WITH EXCEL ===');
  console.log(`Excel shows: 15 bookings, IDR 57,781,806`);
  console.log(`Supabase has: ${bookings.length} bookings, IDR ${totalRevenue.toLocaleString()}`);
  console.log(`Match: ${bookings.length === 15 ? '✓' : '✗'} bookings, ${totalRevenue === 57781806 ? '✓' : '✗'} revenue`);
}

main().catch(console.error);
