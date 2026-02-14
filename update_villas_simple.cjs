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
  console.log('=== UPDATING GITA\'S VILLAS WITH LOCATION AND TYPE ===\n');
  console.log('Note: The columns location, property_type, and address must exist in the villas table.\n');

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
        console.error(`\n  💡 The columns don't exist yet!`);
        console.error(`  💡 You need to run this SQL in Supabase SQL Editor:\n`);
        console.error(`  ALTER TABLE villas`);
        console.error(`  ADD COLUMN IF NOT EXISTS location TEXT,`);
        console.error(`  ADD COLUMN IF NOT EXISTS property_type TEXT,`);
        console.error(`  ADD COLUMN IF NOT EXISTS address TEXT;\n`);
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
  console.log('\n=== VERIFICATION ===\n');
  const { data: villas, error: verifyError } = await supabase
    .from('villas')
    .select('name, location, property_type, address, bedrooms')
    .eq('property_id', GITA_PROPERTY_ID);

  if (verifyError) {
    console.error('❌ Error verifying:', verifyError.message);
  } else {
    console.log('✅ All Gita\'s villas:');
    villas.forEach(v => {
      console.log(`\n  📍 ${v.name} (${v.bedrooms}BR)`);
      console.log(`     Location: ${v.location || 'NOT SET'}`);
      console.log(`     Type: ${v.property_type || 'NOT SET'}`);
      console.log(`     Address: ${v.address || 'NOT SET'}`);
    });
  }

  console.log('\n\n✅ DONE! Villas updated successfully.');
  console.log('Next: Update Autopilot.jsx to load from villas table\n');
})();
