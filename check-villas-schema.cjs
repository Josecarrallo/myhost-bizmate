const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jjpscimtxrudtepzwhag.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0'
);

async function checkVillasSchema() {
  console.log('\n🔍 Checking villas table schema...\n');

  // Get one villa to see all columns
  const { data: villas } = await supabase
    .from('villas')
    .select('*')
    .limit(1);

  if (villas && villas.length > 0) {
    console.log('Available columns in villas table:');
    console.log('===================================');
    const columns = Object.keys(villas[0]);
    columns.forEach(col => {
      console.log(`  - ${col}: ${typeof villas[0][col]} = ${JSON.stringify(villas[0][col])}`);
    });

    console.log('\n');
    console.log('Has tenant_id column?', columns.includes('tenant_id') ? '✅ YES' : '❌ NO');
    console.log('Has owner_id column?', columns.includes('owner_id') ? '✅ YES' : '❌ NO');
    console.log('Has user_id column?', columns.includes('user_id') ? '✅ YES' : '❌ NO');
  } else {
    console.log('No villas found');
  }

  console.log('\n');
}

checkVillasSchema();
