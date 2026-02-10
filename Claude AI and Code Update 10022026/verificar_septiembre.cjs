const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jjpscimtxrudtepzwhag.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0'
);

const GITA_TENANT_ID = '1f32d384-4018-46a9-a6f9-058217e6924a';

async function verificarSeptiembre() {
  console.log('\n🔍 VERIFICANDO SEPTIEMBRE 2025...\n');

  const { data: bookings } = await supabase
    .from('bookings')
    .select('guest_name, check_in, check_out, nights')
    .eq('tenant_id', GITA_TENANT_ID)
    .gte('check_in', '2025-09-01')
    .lt('check_in', '2025-10-01')
    .order('check_in');

  console.log('═'.repeat(80));
  console.log('BOOKINGS SEPTIEMBRE 2025:');
  console.log('═'.repeat(80));

  let totalNights = 0;
  bookings.forEach((b, idx) => {
    const num = String(idx + 1).padStart(2);
    const name = b.guest_name.padEnd(25);
    console.log(`${num}. ${name} | ${b.check_in} → ${b.check_out} | ${b.nights} noches`);
    totalNights += b.nights;
  });

  console.log('═'.repeat(80));
  console.log(`TOTAL NOCHES SEPTIEMBRE: ${totalNights}`);
  console.log(`TOTAL BOOKINGS: ${bookings.length}`);
  console.log('═'.repeat(80));
  console.log('\n');

  if (totalNights !== 25) {
    console.log(`❌ ERROR: Debería ser 25 noches, pero es ${totalNights}`);
  } else {
    console.log('✅ CORRECTO: 25 noches');
  }
  console.log('\n');
}

verificarSeptiembre().catch(console.error);
