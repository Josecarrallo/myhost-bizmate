const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jjpscimtxrudtepzwhag.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0'
);

const TENANT_ID = '1f32d384-4018-46a9-a6f9-058217e6924a';

(async () => {
  console.log('=== CHECKING VILLAS FOR GITA ===\n');
  console.log('TENANT_ID:', TENANT_ID);

  // Try filtering by property_id
  const { data: villasByPropertyId, error: error1 } = await supabase
    .from('villas')
    .select('*')
    .eq('property_id', TENANT_ID);

  console.log('\n--- Villas filtered by property_id = TENANT_ID ---');
  if (error1) {
    console.log('Error:', error1);
  } else {
    console.log('Count:', villasByPropertyId.length);
    if (villasByPropertyId.length > 0) {
      console.log('Fields:', Object.keys(villasByPropertyId[0]).sort().join(', '));
      villasByPropertyId.forEach((v, i) => {
        console.log(`\n${i+1}. ${v.name}`);
        console.log(`   property_id: ${v.property_id}`);
        console.log(`   address: ${v.address || 'N/A'}`);
        console.log(`   city: ${v.city || 'N/A'}`);
        console.log(`   bedrooms: ${v.bedrooms || 'N/A'}`);
        console.log(`   villa_type: ${v.villa_type || 'N/A'}`);
      });
    }
  }

  // Also get all villas to see what other property_ids exist
  const { data: allVillas, error: error2 } = await supabase
    .from('villas')
    .select('*');

  console.log('\n\n--- ALL VILLAS (showing property_id distribution) ---');
  if (error2) {
    console.log('Error:', error2);
  } else {
    console.log('Total villas:', allVillas.length);
    const propertyIdGroups = {};
    allVillas.forEach(v => {
      if (!propertyIdGroups[v.property_id]) {
        propertyIdGroups[v.property_id] = [];
      }
      propertyIdGroups[v.property_id].push(v.name);
    });

    console.log('\nGrouped by property_id:');
    Object.entries(propertyIdGroups).forEach(([propId, villas]) => {
      console.log(`\n${propId}:`);
      villas.forEach(name => console.log(`  - ${name}`));
    });
  }
})();
