const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jjpscimtxrudtepzwhag.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0'
);

async function checkVillasTenant() {
  const EXPECTED_TENANT_ID = 'c24393db-d318-4d75-8bbf-0fa240b9c1db';

  console.log('\n🔍 Checking Villas tenant_id values\n');
  console.log(`Expected tenant_id: ${EXPECTED_TENANT_ID}\n`);

  // Get ALL villas without any filter
  const { data: allVillas } = await supabase
    .from('villas')
    .select('*');

  console.log(`Total villas in database (no filter): ${allVillas?.length || 0}\n`);

  if (allVillas && allVillas.length > 0) {
    console.log('Villa details:');
    console.log('===============================================');
    allVillas.forEach(v => {
      const match = v.tenant_id === EXPECTED_TENANT_ID ? '✅' : '❌';
      console.log(`${match} ${v.name}`);
      console.log(`   tenant_id: ${v.tenant_id || 'NULL'}`);
      console.log(`   property_id: ${v.property_id || 'NULL'}`);
      console.log('');
    });

    const matchingVillas = allVillas.filter(v => v.tenant_id === EXPECTED_TENANT_ID);
    const wrongTenant = allVillas.filter(v => v.tenant_id && v.tenant_id !== EXPECTED_TENANT_ID);
    const nullTenant = allVillas.filter(v => !v.tenant_id);

    console.log('\n📊 SUMMARY:');
    console.log(`  ✅ Correct tenant_id: ${matchingVillas.length}`);
    console.log(`  ❌ Wrong tenant_id: ${wrongTenant.length}`);
    console.log(`  ⚠️  NULL tenant_id: ${nullTenant.length}`);

    if (wrongTenant.length > 0 || nullTenant.length > 0) {
      console.log('\n\n💡 SOLUTION:');
      console.log('Run this SQL in Supabase to fix:');
      console.log('```sql');
      console.log(`UPDATE villas`);
      console.log(`SET tenant_id = '${EXPECTED_TENANT_ID}'`);
      console.log(`WHERE tenant_id IS NULL OR tenant_id != '${EXPECTED_TENANT_ID}';`);
      console.log('```');
    }
  }

  console.log('\n');
}

checkVillasTenant();
