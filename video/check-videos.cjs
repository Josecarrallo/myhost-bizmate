const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jjpscimtxrudtepzwhag.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0'
);

async function checkVideos() {
  const { data, error } = await supabase
    .from('generated_videos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error:', error);
  } else {
    console.log(`\n📊 Total videos in database: ${data?.length || 0}\n`);

    if (data && data.length > 0) {
      data.forEach((v, idx) => {
        console.log(`${idx + 1}. ${v.title || 'No title'}`);
        console.log(`   Subtitle: ${v.subtitle || 'N/A'}`);
        console.log(`   Video URL: ${v.video_url}`);
        console.log(`   User ID: ${v.user_id || 'NULL'}`);
        console.log(`   Created: ${v.created_at}`);
        console.log('');
      });
    } else {
      console.log('⚠️ Database is empty - no videos found');
    }
  }
}

checkVideos();
