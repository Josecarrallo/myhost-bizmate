const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jjpscimtxrudtepzwhag.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0'
);

(async () => {
  console.log('=== CORRIGIENDO DISCREPANCIAS 2025 ===\n');

  // Fix 1: Alison Bell - check_in
  console.log('1. Corrigiendo Alison Bell...');
  const { data: alison, error: alisonError } = await supabase
    .from('bookings')
    .update({
      check_in: '2025-08-31',
      check_out: '2025-09-03'
    })
    .eq('tenant_id', '1f32d384-4018-46a9-a6f9-058217e6924a')
    .eq('guest_name', 'Alison Bell')
    .eq('check_in', '2025-09-01')
    .select();

  if (alisonError) {
    console.log(`   ❌ Error: ${alisonError.message}`);
  } else if (alison && alison.length > 0) {
    console.log(`   ✅ Alison Bell: check_in 2025-09-01 → 2025-08-31, check_out → 2025-09-03`);
  } else {
    console.log(`   ⚠️  No encontrado`);
  }

  // Fix 2: Mishal Alshahrani - check_out
  console.log('\n2. Corrigiendo Mishal Alshahrani...');
  const { data: mishal, error: mishalError } = await supabase
    .from('bookings')
    .update({ check_out: '2025-10-07' })
    .eq('tenant_id', '1f32d384-4018-46a9-a6f9-058217e6924a')
    .eq('guest_name', 'Mishal Alshahrani')
    .eq('check_in', '2025-10-03')
    .select();

  if (mishalError) {
    console.log(`   ❌ Error: ${mishalError.message}`);
  } else if (mishal && mishal.length > 0) {
    console.log(`   ✅ Mishal Alshahrani: check_out 2025-10-06 → 2025-10-07`);
  } else {
    console.log(`   ⚠️  No encontrado`);
  }

  console.log('\n=== VERIFICACIÓN FINAL ===\n');

  // Verify Alison Bell
  const { data: alisonCheck } = await supabase
    .from('bookings')
    .select('guest_name, check_in, check_out')
    .eq('tenant_id', '1f32d384-4018-46a9-a6f9-058217e6924a')
    .eq('guest_name', 'Alison Bell')
    .single();

  console.log(`Alison Bell: check_in=${alisonCheck?.check_in}, check_out=${alisonCheck?.check_out}`);

  // Verify Mishal Alshahrani
  const { data: mishalCheck } = await supabase
    .from('bookings')
    .select('guest_name, check_in, check_out')
    .eq('tenant_id', '1f32d384-4018-46a9-a6f9-058217e6924a')
    .eq('guest_name', 'Mishal Alshahrani')
    .single();

  console.log(`Mishal Alshahrani: check_in=${mishalCheck?.check_in}, check_out=${mishalCheck?.check_out}`);

  console.log('\n✅ Correcciones completadas');
})();
