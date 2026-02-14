const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jjpscimtxrudtepzwhag.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0'
);

const GITA_PROPERTY_ID = '3551cd18-af6b-48c2-85ba-4c5dc0074892';

(async () => {
  const { data, error } = await supabase
    .from('villas')
    .select('*')
    .eq('property_id', GITA_PROPERTY_ID)
    .limit(1);

  if (error) {
    console.log('Error:', error);
    return;
  }

  console.log('=== FULL FIELDS IN VILLAS TABLE ===\n');
  if (data && data.length > 0) {
    console.log('Available fields:', Object.keys(data[0]).sort().join(', '));
    console.log('\n=== SAMPLE GITA VILLA DATA ===\n');
    console.log(JSON.stringify(data[0], null, 2));
  } else {
    console.log('No villas found');
  }
})();
