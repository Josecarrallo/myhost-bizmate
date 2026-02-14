const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jjpscimtxrudtepzwhag.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0'
);

const TENANT_ID = '1f32d384-4018-46a9-a6f9-058217e6924a';

(async () => {
  // Get all bookings
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('*')
    .eq('tenant_id', TENANT_ID)
    .limit(3);

  console.log('=== BOOKING FIELDS ===\n');
  if (bookingsError) {
    console.log('Error:', bookingsError);
    return;
  }

  if (bookings && bookings.length > 0) {
    console.log('Available fields:', Object.keys(bookings[0]).sort().join(', '));
    console.log('\n=== SAMPLE BOOKING ===\n');
    console.log(JSON.stringify(bookings[0], null, 2));
  }

  // Get all villas for Gita
  const { data: villas, error: villasError } = await supabase
    .from('villas')
    .select('id, name, property_id');

  console.log('\n\n=== ALL VILLAS (id and name) ===\n');
  if (villasError) {
    console.log('Error:', villasError);
  } else {
    villas.forEach(v => {
      console.log(`${v.id} - ${v.name}`);
    });
  }

  // Check if bookings villa_id matches villas id
  if (bookings && bookings.length > 0 && villas && villas.length > 0) {
    console.log('\n\n=== MATCHING BOOKINGS TO VILLAS ===\n');
    bookings.forEach(b => {
      const matchingVilla = villas.find(v => v.id === b.villa_id);
      console.log(`Booking: ${b.guest_name}`);
      console.log(`  villa_id: ${b.villa_id}`);
      console.log(`  villa_name: ${b.villa_name}`);
      console.log(`  Matching villa: ${matchingVilla ? matchingVilla.name : 'NOT FOUND'}`);
      console.log('');
    });
  }
})();
