const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jjpscimtxrudtepzwhag.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjk0MzIzMiwiZXhwIjoyMDc4NTE5MjMyfQ.RBD16xjgQB__nj5DtLrK2w55uQ4WFJiaa0mfZT2BeJg'
);

const GITA_USER_ID = '7b0991f5-1b0f-4209-86c6-ae0c7afe5985';

(async () => {
  console.log('🏠 Buscando villas de Gita...\n');

  const { data: villas, error } = await supabase
    .from('villas')
    .select('id, name')
    .eq('owner_id', GITA_USER_ID);

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`✅ Encontradas ${villas.length} villas:\n`);
  villas.forEach(v => {
    console.log(`- ${v.name} (${v.id})`);
  });
})();
