const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jjpscimtxrudtepzwhag.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0'
);

(async () => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('tenant_id', '1f32d384-4018-46a9-a6f9-058217e6924a')
    .gte('check_in', '2025-08-01')
    .lte('check_in', '2025-12-31')
    .order('check_in', { ascending: true });

  if (error) {
    console.log('Error:', error);
    return;
  }

  console.log('=== TODOS LOS BOOKINGS 2025 ===\n');
  console.log('Total:', data.length, '\n');

  data.forEach((b, i) => {
    console.log(`${i+1}. ${b.guest_name}`);
    console.log(`   Check-in: ${b.check_in}`);
    console.log(`   Check-out: ${b.check_out || 'N/A'}`);
    console.log(`   Source: ${b.source}`);
    console.log(`   Price: ${b.total_price} ${b.currency}`);
    console.log(`   Payment Status: ${b.payment_status || 'N/A'}`);
    console.log(`   Nights: ${b.nights || 'N/A'}`);
    console.log('');
  });

  // Expected from Excel
  const expectedBookings = [
    { name: 'Alison Bell', checkIn: '2025-08-31', checkOut: '2025-09-03', price: 2950533, source: 'Bali Buntu' },
    { name: 'M. Hadi Ghanchi', checkIn: '2025-09-04', checkOut: '2025-09-05', price: 1042088, source: 'Bali Buntu' },
    { name: 'Anirban Mukherjee', checkIn: '2025-09-05', checkOut: '2025-09-08', price: 3651086, source: 'Bali Buntu' },
    { name: 'Hector Stezano', checkIn: '2025-09-08', checkOut: '2025-09-11', price: 3592940, source: 'Bali Buntu' },
    { name: 'Rebecca', checkIn: '2025-09-12', checkOut: '2025-09-16', price: 4349003, source: 'Bali Buntu' },
    { name: 'Namith Reddy', checkIn: '2025-09-20', checkOut: '2025-09-21', price: 885346, source: 'Bali Buntu' },
    { name: 'Anh Dao', checkIn: '2025-09-21', checkOut: '2025-09-24', price: 3352266, source: 'Bali Buntu' },
    { name: 'Vitaii', checkIn: '2025-09-24', checkOut: '2025-09-26', price: 1900000, source: 'Gita' },
    { name: 'Justin Berndsen', checkIn: '2025-09-26', checkOut: '2025-10-01', price: 5586956, source: 'Bali Buntu' },
    { name: 'Mishal Alshahrani', checkIn: '2025-10-03', checkOut: '2025-10-07', price: 3212542, source: 'Bali Buntu' },
    { name: 'Khaldun Schahab', checkIn: '2025-10-07', checkOut: '2025-10-12', price: 3901500, source: 'Bali Buntu' },
    { name: 'Charles', checkIn: '2025-10-13', checkOut: '2025-10-14', price: 1003656, source: 'Bali Buntu' },
    { name: 'Valentin', checkIn: '2025-10-14', checkOut: '2025-10-16', price: 2000398, source: 'Bali Buntu' },
    { name: 'Valentin', checkIn: '2025-10-16', checkOut: '2025-10-17', price: 996395, source: 'Bali Buntu' },
    { name: 'Alexander Jeremia', checkIn: '2025-10-18', checkOut: '2025-10-20', price: 2234840, source: 'Bali Buntu' },
    { name: 'Tan Janice', checkIn: '2025-10-20', checkOut: '2025-10-23', price: 2678265, source: 'Bali Buntu' },
    { name: 'Darcy Sharpe', checkIn: '2025-10-24', checkOut: '2025-10-26', price: 2307338, source: 'Bali Buntu' },
    { name: 'Jose Rayas', checkIn: '2025-10-27', checkOut: '2025-10-29', price: 2203733, source: 'Bali Buntu' },
    { name: 'Chinese Name', checkIn: '2025-10-30', checkOut: '2025-11-02', price: 3460970, source: 'Bali Buntu' },
    { name: 'Joshua Bumale', checkIn: '2025-11-04', checkOut: '2025-11-06', price: 2219670, source: 'Bali Buntu' },
    { name: 'Gautham Ramdas', checkIn: '2025-11-15', checkOut: '2025-11-18', price: 4566015, source: 'Bali Buntu' },
    { name: 'Roberto Baccaro', checkIn: '2025-11-18', checkOut: '2025-11-20', price: 2043566, source: 'Bali Buntu' },
    { name: 'Charlotte Peer', checkIn: '2025-11-20', checkOut: '2025-11-21', price: 1021780, source: 'Bali Buntu' },
    { name: 'Veronica', checkIn: '2025-11-21', checkOut: '2025-12-04', price: 13300000, source: 'Gita' },
    { name: 'Michelle Vocisano', checkIn: '2025-12-22', checkOut: '2025-12-29', price: 7667293, source: 'Bali Buntu' },
    { name: 'Chef Gerry', checkIn: '2025-12-30', checkOut: '2026-01-01', price: 0, source: 'Ibu Santi' }
  ];

  console.log('\n=== COMPARACIÓN CON EXCEL ===\n');
  console.log(`Esperados del Excel: ${expectedBookings.length}`);
  console.log(`Encontrados en Supabase: ${data.length}`);

  if (data.length !== expectedBookings.length) {
    console.log(`\n⚠️ DIFERENCIA: Faltan ${expectedBookings.length - data.length} bookings\n`);
  }

  // Check each expected booking
  let matched = 0;
  let missing = 0;

  expectedBookings.forEach((expected, i) => {
    const found = data.find(b =>
      b.guest_name === expected.name &&
      b.check_in === expected.checkIn
    );

    if (found) {
      // Check if all details match
      const priceMatch = found.total_price === expected.price;
      const sourceMatch = found.source?.toLowerCase().includes(expected.source.toLowerCase().split(' ')[0]) ||
                          expected.source.toLowerCase().includes(found.source?.toLowerCase());
      const checkOutMatch = found.check_out === expected.checkOut;

      if (priceMatch && sourceMatch && checkOutMatch) {
        matched++;
      } else {
        console.log(`⚠️ Parcialmente correcto: ${expected.name} (${expected.checkIn})`);
        if (!priceMatch) console.log(`   Precio: Expected ${expected.price}, Found ${found.total_price}`);
        if (!sourceMatch) console.log(`   Source: Expected ${expected.source}, Found ${found.source}`);
        if (!checkOutMatch) console.log(`   Check-out: Expected ${expected.checkOut}, Found ${found.check_out}`);
      }
    } else {
      console.log(`❌ FALTA: ${expected.name} (${expected.checkIn})`);
      missing++;
    }
  });

  console.log(`\n=== RESUMEN ===`);
  console.log(`✅ Coinciden perfectamente: ${matched}/${expectedBookings.length}`);
  console.log(`❌ Faltan: ${missing}`);
  console.log(`⚠️ Con diferencias: ${expectedBookings.length - matched - missing}`);
})();
