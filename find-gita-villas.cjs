const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jjpscimtxrudtepzwhag.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function findVillas() {
  const { data, error } = await supabase
    .from('villas')
    .select('*')
    .eq('property_id', '3551cd18-af6b-48c2-85ba-4c5dc0074892');

  if (error) {
    console.log('Error:', error);
  } else {
    console.log('Encontradas', data?.length || 0, 'villas');
    data?.forEach((v, i) => {
      console.log((i + 1) + '. ' + v.name);
      console.log('   ID: ' + v.id);
    });
  }
}

findVillas();
