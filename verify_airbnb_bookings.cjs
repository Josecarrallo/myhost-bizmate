const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jjpscimtxrudtepzwhag.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0';

const supabase = createClient(supabaseUrl, supabaseKey);

const GITA_ID = '1f32d384-4018-46a9-a6f9-058217e6924a';

(async () => {
  console.log('=== VERIFICANDO BOOKINGS DE AIRBNB PARA GITA EN 2026 ===\n');

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('tenant_id', GITA_ID)
    .gte('check_in', '2026-01-01')
    .lte('check_in', '2026-12-31')
    .order('check_in', { ascending: true });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Total bookings 2026:', bookings.length, '\n');

  // Filtrar por Airbnb (cualquier variante)
  const airbnbBookings = bookings.filter(b => {
    const source = (b.source || '').toLowerCase().trim().replace(/\s+/g, '');
    return source.includes('airbnb') || source.includes('air-bnb') || source === 'airbnb';
  });

  console.log('AIRBNB BOOKINGS:', airbnbBookings.length);
  console.log('---');

  let totalRevenue = 0;
  airbnbBookings.forEach((b, idx) => {
    console.log(`${idx + 1}. Guest: ${b.guest_name}`);
    console.log(`   Check-in: ${b.check_in}`);
    console.log(`   Source: '${b.source}'`);
    console.log(`   Total Price: ${b.total_price} ${b.currency}`);
    console.log(`   Status: ${b.status}`);
    console.log('');
    totalRevenue += (b.total_price || 0);
  });

  console.log('---');
  console.log('TOTAL REVENUE AIRBNB:', totalRevenue.toLocaleString(), 'IDR');
  console.log('Expected: 52,849,545 IDR');
  console.log('Match:', totalRevenue === 52849545 ? '✅ YES' : '❌ NO');
  console.log('\n=== TODOS LOS BOOKINGS (source column) ===\n');

  bookings.forEach(b => {
    console.log(`Source: '${b.source}' | Guest: ${b.guest_name} | Revenue: ${b.total_price}`);
  });
})();
