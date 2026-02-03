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
  console.log('=== TODOS LOS BOOKINGS DE NISMARA UMA VILLA ===\n');

  // Get ALL Nismara bookings (sin filtro de fecha)
  const bookings = await fetchFromSupabase(
    '/rest/v1/bookings?property_id=eq.24dede0c-7eb1-4e62-96c0-ecf9f66cbc12&select=*&order=check_in.asc'
  );

  console.log(`Total bookings en Supabase: ${bookings.length}\n`);

  // Group by year
  const byYear = {};
  bookings.forEach(b => {
    const year = new Date(b.check_in).getFullYear();
    if (!byYear[year]) byYear[year] = [];
    byYear[year].push(b);
  });

  console.log('Distribución por año:');
  Object.keys(byYear).sort().forEach(year => {
    const yearBookings = byYear[year];
    const totalRevenue = yearBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
    console.log(`  ${year}: ${yearBookings.length} bookings, IDR ${totalRevenue.toLocaleString()}`);
  });

  console.log('\n=== DETALLES DE TODOS LOS BOOKINGS ===');
  console.log('NO | Año | Guest Name | Check-in | Check-out | Nights | Price | Source');
  console.log('---|-----|------------|----------|-----------|--------|-------|--------');

  let totalRevenue = 0;
  let totalNights = 0;

  bookings.forEach((b, i) => {
    const year = new Date(b.check_in).getFullYear();
    const nights = Math.ceil((new Date(b.check_out) - new Date(b.check_in)) / (1000 * 60 * 60 * 24));
    totalRevenue += b.total_price || 0;
    totalNights += nights;

    console.log(
      `${i + 1} | ${year} | ${b.guest_name} | ${b.check_in} | ${b.check_out} | ${nights} | ${b.total_price ? `IDR ${b.total_price.toLocaleString()}` : '-'} | ${b.source || 'direct'}`
    );
  });

  console.log('\n=== TOTALES ===');
  console.log(`Total bookings: ${bookings.length}`);
  console.log(`Total revenue: IDR ${totalRevenue.toLocaleString()}`);
  console.log(`Total nights: ${totalNights}`);
  console.log(`Avg nights per booking: ${(totalNights / bookings.length).toFixed(1)}`);
}

main().catch(console.error);
