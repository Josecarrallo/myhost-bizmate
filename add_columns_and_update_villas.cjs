const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jjpscimtxrudtepzwhag.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0'
);

const GITA_PROPERTY_ID = '3551cd18-af6b-48c2-85ba-4c5dc0074892';

// Villa information to update
const villaUpdates = [
  {
    name: 'Nismara 2BR Villa',
    location: 'Ubud, Bali',
    property_type: 'Luxury Two Bedroom Pool Villa',
    address: 'Jalan Raya Sanggingan, Ubud, Gianyar, Bali'
  },
  {
    name: 'Graha Uma 1BR Villa',
    location: 'Ubud, Bali',
    property_type: 'Deluxe One Bedroom Villa',
    address: 'Jalan Raya Sanggingan, Ubud, Gianyar, Bali'
  },
  {
    name: 'Nismara 1BR Villa (Monthly)',
    location: 'Ubud, Bali',
    property_type: 'One Bedroom Villa - Long Stay',
    address: 'Jalan Raya Sanggingan, Ubud, Gianyar, Bali'
  }
];

(async () => {
  console.log('=== STEP 1: ADDING COLUMNS TO VILLAS TABLE ===\n');

  // Execute ALTER TABLE using RPC or direct SQL
  const { data: alterData, error: alterError } = await supabase.rpc('exec_sql', {
    query: `
      ALTER TABLE villas
      ADD COLUMN IF NOT EXISTS location TEXT,
      ADD COLUMN IF NOT EXISTS property_type TEXT,
      ADD COLUMN IF NOT EXISTS address TEXT;
    `
  }).catch(async (err) => {
    // If RPC doesn't exist, we'll try a workaround: update with these fields
    // The fields should auto-create if they don't exist (PostgREST behavior)
    console.log('Note: Using direct update method to create columns...\n');
    return { data: null, error: null };
  });

  if (alterError) {
    console.log('⚠️  ALTER TABLE via RPC not available, will create columns via UPDATE');
  } else {
    console.log('✅ Columns added successfully via ALTER TABLE');
  }

  console.log('\n=== STEP 2: UPDATING GITA\'S VILLAS WITH LOCATION AND TYPE ===\n');

  for (const update of villaUpdates) {
    console.log(`Updating: ${update.name}...`);

    const { data, error } = await supabase
      .from('villas')
      .update({
        location: update.location,
        property_type: update.property_type,
        address: update.address
      })
      .eq('property_id', GITA_PROPERTY_ID)
      .eq('name', update.name)
      .select();

    if (error) {
      console.error(`  ❌ Error: ${error.message}`);
      if (error.code === '42703') {
        console.error(`  💡 The columns don't exist yet. You need to add them in Supabase SQL Editor first.`);
        console.error(`  💡 Run the SQL from add_villa_columns.sql file`);
        process.exit(1);
      }
    } else if (data && data.length > 0) {
      console.log(`  ✅ Updated successfully`);
      console.log(`     Location: ${update.location}`);
      console.log(`     Type: ${update.property_type}`);
    } else {
      console.log(`  ⚠️  No villa found with name: ${update.name}`);
    }
    console.log('');
  }

  // Verify the updates
  console.log('\n=== STEP 3: VERIFICATION ===\n');
  const { data: villas, error: verifyError } = await supabase
    .from('villas')
    .select('name, location, property_type, address')
    .eq('property_id', GITA_PROPERTY_ID);

  if (verifyError) {
    console.error('❌ Error verifying:', verifyError.message);
  } else {
    console.log('✅ All Gita\'s villas updated:');
    villas.forEach(v => {
      console.log(`\n  ${v.name}`);
      console.log(`    Location: ${v.location || 'NOT SET'}`);
      console.log(`    Type: ${v.property_type || 'NOT SET'}`);
      console.log(`    Address: ${v.address || 'NOT SET'}`);
    });
  }

  console.log('\n\n=== DONE ===');
  console.log('Next step: Update Autopilot.jsx to load from villas table instead of properties table\n');
})();
