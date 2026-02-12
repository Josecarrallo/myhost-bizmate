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
    .limit(5);

  if (error) {
    console.log('Error:', error);
    return;
  }

  console.log('Total bookings:', data.length);
  console.log('\nCampos disponibles:', Object.keys(data[0] || {}).sort().join(', '));
  console.log('\n=== GUEST COUNTRY VALUES ===\n');

  data.forEach((b, i) => {
    console.log(`Booking ${i+1}: ${b.guest_name}`);
    console.log(`  guest_country: "${b.guest_country}"`);
    console.log(`  guest_nationality: "${b.guest_nationality}"`);
    console.log('');
  });

  // Count countries
  const countries = new Set();
  data.forEach(b => {
    if (b.guest_country && b.guest_country.trim() !== '') {
      countries.add(b.guest_country);
    }
  });

  console.log('Unique countries found:', countries.size);
  console.log('Countries:', Array.from(countries).join(', '));
})();
