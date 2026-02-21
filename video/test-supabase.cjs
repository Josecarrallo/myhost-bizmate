const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jjpscimtxrudtepzwhag.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  console.log('🔍 Testing Supabase connection...\n');

  // 1. Verificar videos existentes
  console.log('📹 Fetching existing videos...');
  const { data: videos, error: fetchError } = await supabase
    .from('generated_videos')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (fetchError) {
    console.error('❌ Fetch error:', fetchError);
  } else {
    console.log(`✅ Found ${videos.length} videos:`);
    videos.forEach(v => {
      console.log(`  - ${v.title} (${v.created_at})`);
    });
  }

  // 2. Intentar insertar registro de prueba
  console.log('\n💾 Attempting test insert...');
  const { data: insertData, error: insertError } = await supabase
    .from('generated_videos')
    .insert([{
      user_id: '00000000-0000-0000-0000-000000000000', // Valid UUID format
      title: 'TEST VIDEO',
      subtitle: 'Test Subtitle',
      video_url: '/videos/test.mp4',
      thumbnail_url: null,
      filename: 'test.mp4',
      file_size_mb: 1.5,
      duration_seconds: 10,
      resolution: '1920x1080',
      camera_prompt: 'test prompt',
      music_file: 'test.mp3',
      status: 'completed'
    }])
    .select();

  if (insertError) {
    console.error('❌ Insert error:', insertError);
  } else {
    console.log('✅ Insert successful:', insertData);
  }
}

testSupabase();
