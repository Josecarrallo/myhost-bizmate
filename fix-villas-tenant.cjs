const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jjpscimtxrudtepzwhag.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0'
);

async function fixVillasTenant() {
  const TENANT_ID = 'c24393db-d318-4d75-8bbf-0fa240b9c1db';

  console.log('\n🔧 Fixing villas tenant_id...\n');

  // Update all villas with NULL tenant_id
  const { data, error } = await supabase
    .from('villas')
    .update({ tenant_id: TENANT_ID })
    .is('tenant_id', null)
    .select();

  if (error) {
    console.error('❌ Error updating villas:', error);
    return;
  }

  console.log(`✅ Successfully updated ${data?.length || 0} villas`);
  console.log('\nUpdated villas:');
  (data || []).forEach(v => {
    console.log(`  - ${v.name}`);
  });

  // Verify the fix
  console.log('\n\n🔍 Verifying fix...\n');

  const { data: verifyData } = await supabase
    .from('villas')
    .select('*')
    .eq('tenant_id', TENANT_ID);

  console.log(`✅ Villas with correct tenant_id: ${verifyData?.length || 0}`);
  console.log('\n🎉 Properties (0) bug should now be fixed!\n');
}

fixVillasTenant();
