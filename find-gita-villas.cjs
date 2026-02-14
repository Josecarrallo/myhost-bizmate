const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jjpscimtxrudtepzwhag.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0'
);

async function findGitaVillas() {
  console.log('\n🔍 Finding Gita\'s 3 villas...\n');

  // Get all villas
  const { data: allVillas } = await supabase
    .from('villas')
    .select('*');

  console.log(`Total villas in database: ${allVillas?.length || 0}\n`);

  // Filter for Nismara and Graha Uma (Gita's villas)
  const gitaVillas = (allVillas || []).filter(v =>
    v.name.includes('Nismara') ||
    v.name.includes('Graha Uma')
  );

  console.log(`Gita's villas (containing 'Nismara' or 'Graha Uma'): ${gitaVillas.length}\n`);

  gitaVillas.forEach(v => {
    console.log(`✅ ${v.name}`);
    console.log(`   ID: ${v.id}`);
    console.log(`   property_id: ${v.property_id}`);
    console.log(`   bedrooms: ${v.bedrooms}`);
    console.log('');
  });

  console.log('\n');
}

findGitaVillas();
