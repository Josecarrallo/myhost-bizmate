const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jjpscimtxrudtepzwhag.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjk0MzIzMiwiZXhwIjoyMDc4NTE5MjMyfQ.RBD16xjgQB__nj5DtLrK2w55uQ4WFJiaa0mfZT2BeJg';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSchema() {
  console.log('🔍 Checking generated_videos table schema...\n');

  // Get all videos with full data
  const { data: videos, error: fetchError } = await supabase
    .from('generated_videos')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);

  if (fetchError) {
    console.error('❌ Fetch error:', fetchError);
    return;
  }

  if (videos && videos.length > 0) {
    console.log('✅ Table structure (from first record):');
    console.log(JSON.stringify(videos[0], null, 2));
    console.log('\n📊 Available columns:');
    Object.keys(videos[0]).forEach(col => {
      console.log(`  - ${col}: ${typeof videos[0][col]}`);
    });
  } else {
    console.log('⚠️ No videos found in table');
  }

  // Check if table exists and get schema info
  console.log('\n🔍 Checking table existence...');
  const { data: tableInfo, error: tableError } = await supabase
    .from('generated_videos')
    .select('id')
    .limit(1);

  if (tableError) {
    console.error('❌ Table error:', tableError);
  } else {
    console.log('✅ Table exists and is accessible');
  }

  // Get all videos count
  const { count, error: countError } = await supabase
    .from('generated_videos')
    .select('id', { count: 'exact', head: true });

  if (countError) {
    console.error('❌ Count error:', countError);
  } else {
    console.log(`✅ Total videos in database: ${count}`);
  }
}

checkSchema();
