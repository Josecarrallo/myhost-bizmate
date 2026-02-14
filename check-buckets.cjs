const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jjpscimtxrudtepzwhag.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBuckets() {
  console.log('\n🔍 Checking Supabase Storage buckets...\n');

  const { data, error } = await supabase.storage.listBuckets();

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log('✅ Available buckets:');
  data.forEach(bucket => {
    console.log(`   - ${bucket.name} (${bucket.public ? 'PUBLIC' : 'PRIVATE'})`);
  });

  const nismaraExists = data.find(b => b.name === 'Nismara Uma Villas');
  if (nismaraExists) {
    console.log('\n✅ "Nismara Uma Villas" bucket EXISTS\n');
  } else {
    console.log('\n❌ "Nismara Uma Villas" bucket NOT FOUND');
    console.log('📝 Creating bucket...\n');

    const { data: newBucket, error: createError } = await supabase.storage.createBucket('Nismara Uma Villas', {
      public: true,
      fileSizeLimit: 52428800 // 50MB
    });

    if (createError) {
      console.error('❌ Failed to create bucket:', createError.message);
    } else {
      console.log('✅ Bucket created successfully!\n');
    }
  }
}

checkBuckets();
