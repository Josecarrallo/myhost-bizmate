const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jjpscimtxrudtepzwhag.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0'
);

(async () => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('owner_id', '1f32d384-4018-46a9-a6f9-058217e6924a')
    .limit(1);

  if (error) {
    console.log('Error:', error);
    return;
  }

  console.log('=== FIELDS IN PROPERTIES TABLE ===\n');
  if (data && data.length > 0) {
    console.log('Available fields:', Object.keys(data[0]).sort().join(', '));
    console.log('\n=== SAMPLE DATA ===\n');
    console.log(JSON.stringify(data[0], null, 2));
  } else {
    console.log('No properties found');
  }
})();
