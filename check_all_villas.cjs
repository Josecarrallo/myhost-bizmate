const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jjpscimtxrudtepzwhag.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0'
);

(async () => {
  const { data, error } = await supabase
    .from('villas')
    .select('*');

  if (error) {
    console.log('Error:', error);
    return;
  }

  console.log('Total villas:', data.length);

  if (data.length > 0) {
    console.log('\nFields:', Object.keys(data[0]).sort().join(', '));
    console.log('\nALL VILLAS:\n');
    data.forEach((v, i) => {
      console.log(`${i+1}. ${v.name}`);
      console.log(`   Property ID: ${v.property_id}`);
      console.log('');
    });
  }
})();
