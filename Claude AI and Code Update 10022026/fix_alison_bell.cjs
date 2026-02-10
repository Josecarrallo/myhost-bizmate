const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jjpscimtxrudtepzwhag.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0'
);

const GITA_TENANT_ID = '1f32d384-4018-46a9-a6f9-058217e6924a';

async function fix() {
  console.log('\n🔧 ARREGLANDO ALISON BELL...\n');
  console.log('Sept 1 → Sept 3 = 2 noches (ACTUAL)');
  console.log('Sept 1 → Sept 4 = 3 noches (CORRECTO)\n');

  const { error } = await supabase
    .from('bookings')
    .update({
      check_out: '2025-09-04',
      nights: 3
    })
    .eq('tenant_id', GITA_TENANT_ID)
    .eq('guest_name', 'Alison Bell')
    .eq('check_in', '2025-09-01');

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log('✅ Actualizado: Alison Bell → Sept 1-4 (3 noches)\n');

  // Verificar
  const { data } = await supabase.rpc('get_overview_stats', {
    p_tenant_id: GITA_TENANT_ID,
    p_start_date: '2025-01-01',
    p_end_date: '2025-12-31'
  });

  const stats = data[0];
  console.log('═'.repeat(80));
  console.log('VERIFICACIÓN:');
  console.log('═'.repeat(80));
  console.log('Total Bookings:', stats.total_bookings, '(debe ser 26)');
  console.log('Total Nights:', stats.total_nights, '(debe ser 79)');
  console.log('Total Revenue: Rp', stats.total_revenue?.toLocaleString('id-ID'), '(debe ser Rp 82,128,179)');
  console.log('═'.repeat(80));
  console.log('\n');

  if (stats.total_nights === 79) {
    console.log('✅ CORRECTO: 79 noches\n');
  } else {
    console.log(`❌ ERROR: Noches = ${stats.total_nights} (debería ser 79)\n`);
  }
}

fix().catch(console.error);
