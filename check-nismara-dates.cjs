const https = require('https');

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0';
const NISMARA_ID = '3551cd18-af6b-48c2-85ba-4c5dc0074892';

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
  console.log('=== NISMARA - FECHAS Y REVENUE ===\n');

  // Get ALL bookings
  const allBookings = await fetchFromSupabase(
    `/rest/v1/bookings?property_id=eq.${NISMARA_ID}&select=*&order=check_in.asc`
  );

  console.log(`Total bookings: ${allBookings.length}\n`);

  // Find date range
  if (allBookings.length > 0) {
    const firstDate = allBookings[0].check_in;
    const lastDate = allBookings[allBookings.length - 1].check_in;
    console.log(`Rango de fechas: ${firstDate} a ${lastDate}\n`);
  }

  // Test different date filters
  console.log('=== PRUEBA CON DIFERENTES FILTROS DE FECHA ===\n');

  // Filter 1: 2024-01-01 to 2026-01-31 (actual en el script)
  const filter1 = allBookings.filter(b => {
    const checkIn = new Date(b.check_in);
    return checkIn >= new Date('2024-01-01') && checkIn <= new Date('2026-01-31');
  });
  const revenue1 = filter1.reduce((sum, b) => sum + (b.total_price || 0), 0);
  console.log(`Filtro 2024-01-01 a 2026-01-31: ${filter1.length} bookings, IDR ${revenue1.toLocaleString()}`);

  // Filter 2: 2024-01-01 to 2026-12-31 (incluye todo 2026)
  const filter2 = allBookings.filter(b => {
    const checkIn = new Date(b.check_in);
    return checkIn >= new Date('2024-01-01') && checkIn <= new Date('2026-12-31');
  });
  const revenue2 = filter2.reduce((sum, b) => sum + (b.total_price || 0), 0);
  console.log(`Filtro 2024-01-01 a 2026-12-31: ${filter2.length} bookings, IDR ${revenue2.toLocaleString()}`);

  // Filter 3: 2025-01-01 to 2026-12-31 (solo 2025-2026)
  const filter3 = allBookings.filter(b => {
    const checkIn = new Date(b.check_in);
    return checkIn >= new Date('2025-01-01') && checkIn <= new Date('2026-12-31');
  });
  const revenue3 = filter3.reduce((sum, b) => sum + (b.total_price || 0), 0);
  console.log(`Filtro 2025-01-01 a 2026-12-31: ${filter3.length} bookings, IDR ${revenue3.toLocaleString()}`);

  // 2026 only
  const filter2026 = allBookings.filter(b => {
    const checkIn = new Date(b.check_in);
    return checkIn >= new Date('2026-01-01') && checkIn <= new Date('2026-12-31');
  });
  const revenue2026 = filter2026.reduce((sum, b) => sum + (b.total_price || 0), 0);
  console.log(`Filtro 2026 only: ${filter2026.length} bookings, IDR ${revenue2026.toLocaleString()}`);

  console.log('\n=== COMPARACIÓN CON EXCEL ===');
  console.log(`Excel 2026: 15 bookings, IDR 57,781,806`);
  console.log(`Supabase 2026: ${filter2026.length} bookings, IDR ${revenue2026.toLocaleString()}`);
  console.log(`Match: ${filter2026.length === 15 ? '✓' : '✗'} bookings, ${revenue2026 === 57781806 ? '✓' : '✗'} revenue`);
}

main().catch(console.error);
