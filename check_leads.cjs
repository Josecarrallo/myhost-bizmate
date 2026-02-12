const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jjpscimtxrudtepzwhag.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0'
);

(async () => {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('tenant_id', '1f32d384-4018-46a9-a6f9-058217e6924a');

  if (error) {
    console.log('Error:', error);
    return;
  }

  console.log('=== LEADS DATA ===\n');
  console.log('Total leads:', data.length);

  if (data && data.length > 0) {
    console.log('\nAvailable fields:', Object.keys(data[0]).sort().join(', '));

    const statusCounts = {
      hot: 0,
      pending: 0,
      engaged: 0,
      won: 0
    };

    let totalValue = 0;

    data.forEach(lead => {
      const status = (lead.status || '').toLowerCase();
      if (status === 'hot') statusCounts.hot++;
      else if (status === 'pending') statusCounts.pending++;
      else if (status === 'engaged') statusCounts.engaged++;
      else if (status === 'won') statusCounts.won++;

      totalValue += lead.estimated_value || 0;
    });

    console.log('\n=== STATUS BREAKDOWN ===');
    console.log('HOT:', statusCounts.hot);
    console.log('PENDING:', statusCounts.pending);
    console.log('ENGAGED:', statusCounts.engaged);
    console.log('WON:', statusCounts.won);
    console.log('Total Value: $' + totalValue.toLocaleString());

    console.log('\n=== SAMPLE LEADS ===\n');
    data.slice(0, 3).forEach((lead, i) => {
      console.log(`Lead ${i+1}:`);
      console.log(`  Name: ${lead.name || 'N/A'}`);
      console.log(`  Status: ${lead.status || 'N/A'}`);
      console.log(`  Value: $${(lead.estimated_value || 0).toLocaleString()}`);
      console.log('');
    });
  } else {
    console.log('No leads found');
  }
})();
