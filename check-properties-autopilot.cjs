const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jjpscimtxrudtepzwhag.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0'
);

async function checkPropertiesAutopilot() {
  const TENANT_ID = 'c24393db-d318-4d75-8bbf-0fa240b9c1db';

  console.log('\n🔍 Checking Properties (0) Bug in Autopilot\n');

  // Step 1: Check bookings and their property_ids
  const { data: bookings } = await supabase
    .from('bookings')
    .select('id, guest_name, property_id')
    .eq('tenant_id', TENANT_ID);

  console.log('=== STEP 1: BOOKINGS ===');
  console.log(`Total bookings: ${bookings?.length || 0}`);
  console.log('\nFirst 5 bookings with property_id:');
  (bookings || []).slice(0, 5).forEach(b => {
    console.log(`  - ${b.guest_name}: property_id = '${b.property_id}'`);
  });

  // Step 2: Get unique property IDs from bookings
  const propertyIds = [...new Set((bookings || []).map(b => b.property_id).filter(Boolean))];
  console.log(`\nUnique property_ids from bookings: ${JSON.stringify(propertyIds)}`);
  console.log(`Count: ${propertyIds.length}`);

  // Step 3: Check villas table with those property_ids
  if (propertyIds.length > 0) {
    const { data: villas, error: villasError } = await supabase
      .from('villas')
      .select('*')
      .in('property_id', propertyIds);

    console.log('\n=== STEP 2: VILLAS (filtered by booking property_ids) ===');
    console.log(`Total villas found: ${villas?.length || 0}`);
    if (villasError) {
      console.error('Error:', villasError);
    } else {
      (villas || []).forEach(v => {
        console.log(`  - ${v.name} (property_id: ${v.property_id})`);
      });
    }
  } else {
    console.log('\n⚠️  NO property_ids found in bookings! This is why Properties shows 0.');
  }

  // Step 4: Check ALL villas in database (regardless of bookings)
  const { data: allVillas } = await supabase
    .from('villas')
    .select('*')
    .eq('tenant_id', TENANT_ID);

  console.log('\n=== STEP 3: ALL VILLAS IN DATABASE (tenant_id match) ===');
  console.log(`Total villas for tenant: ${allVillas?.length || 0}`);
  (allVillas || []).forEach(v => {
    console.log(`  - ${v.name} (property_id: ${v.property_id || 'NULL'})`);
  });

  // DIAGNOSIS
  console.log('\n\n🔬 DIAGNOSIS:');
  console.log('===============');

  if (allVillas?.length > 0 && propertyIds.length === 0) {
    console.log('❌ PROBLEM FOUND: Villas exist, but bookings have NULL/invalid property_id values');
    console.log('   SOLUTION: Update bookings to have valid property_id references to villas');
  } else if (allVillas?.length === 0) {
    console.log('❌ PROBLEM: No villas in database for this tenant');
  } else if (propertyIds.length > 0 && villas?.length === 0) {
    console.log('❌ PROBLEM: property_id mismatch between bookings and villas tables');
  } else {
    console.log('✅ Everything looks correct. Properties should show:', villas?.length || 0);
  }

  console.log('\n');
}

checkPropertiesAutopilot();
