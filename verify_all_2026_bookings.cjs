const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jjpscimtxrudtepzwhag.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0'
);

(async () => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('tenant_id', '1f32d384-4018-46a9-a6f9-058217e6924a')
    .gte('check_in', '2026-01-01')
    .lte('check_in', '2026-12-31')
    .order('check_in', { ascending: true });

  if (error) {
    console.log('Error:', error);
    return;
  }

  console.log('=== TODOS LOS BOOKINGS 2026 ===\n');
  console.log('Total:', data.length, '\n');

  data.forEach((b, i) => {
    console.log(`${i+1}. ${b.guest_name}`);
    console.log(`   Check-in: ${b.check_in}`);
    console.log(`   Source: ${b.source}`);
    console.log(`   guest_country: "${b.guest_country}"`);
    console.log(`   Nights: ${b.nights || 'N/A'}`);
    console.log(`   Price: ${b.total_price} ${b.currency}`);
    console.log('');
  });

  // Check countries
  const countriesNull = data.filter(b => !b.guest_country || b.guest_country.toLowerCase() === 'null' || b.guest_country.trim() === '');
  console.log('\n=== RESUMEN ===');
  console.log('Bookings con guest_country NULL/vacío:', countriesNull.length);
  console.log('Bookings con guest_country válido:', data.length - countriesNull.length);
})();
