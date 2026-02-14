const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jjpscimtxrudtepzwhag.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBuckets() {
  console.log('Checking Supabase Storage buckets...\n');

  try {
    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error('❌ Error listing buckets:', error);
      return;
    }

    console.log('✅ Available buckets:');
    if (data && data.length > 0) {
      data.forEach(bucket => {
        console.log(`  - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
      });
    } else {
      console.log('  No buckets found');
    }

    // Check specifically for villa-images
    const villaImagesBucket = data.find(b => b.name === 'villa-images');
    if (villaImagesBucket) {
      console.log('\n✅ villa-images bucket EXISTS');
      console.log(`   Public: ${villaImagesBucket.public}`);
    } else {
      console.log('\n❌ villa-images bucket NOT FOUND');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkBuckets();
