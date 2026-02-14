const https = require('https');

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0';

// IDs de Nismara Uma Villa
const NISMARA_PROPERTY_ID = '3551cd18-af6b-48c2-85ba-4c5dc0074892';
const NISMARA_VILLA_ID = 'b9000009-0009-4009-8009-000000000009';
const GITA_OWNER_ID = '1f32d384-4018-46a9-a6f9-058217e6924a';

async function postToSupabase(path, body) {
  return new Promise((resolve, reject) => {
    const bodyJSON = JSON.stringify(body);

    const options = {
      hostname: 'jjpscimtxrudtepzwhag.supabase.co',
      path: path,
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyJSON),
        'Prefer': 'return=representation'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(bodyJSON);
    req.end();
  });
}

async function main() {
  console.log('=== AÑADIENDO BOOKING DE PRUEBA ===\n');

  const nights = Math.ceil((new Date('2026-02-28') - new Date('2026-02-15')) / (1000 * 60 * 60 * 24));

  const testBooking = {
    property_id: NISMARA_PROPERTY_ID,
    villa_id: NISMARA_VILLA_ID,
    tenant_id: GITA_OWNER_ID,
    guest_name: 'TEST BOOKING - DELETE ME',
    guest_email: 'test@example.com',
    guest_phone: '+1234567890',
    check_in: '2026-02-15',
    check_out: '2026-02-28',
    guests: 2,
    nights: nights,
    status: 'confirmed',
    total_price: 10000000,
    currency: 'IDR',
    payment_status: 'paid',
    channel: 'direct',
    source: 'test',
    room_id: 'Nismara Uma Villa'
  };

  console.log('Booking a añadir:');
  console.log(`  Guest: ${testBooking.guest_name}`);
  console.log(`  Dates: ${testBooking.check_in} to ${testBooking.check_out} (${nights} nights)`);
  console.log(`  Price: IDR ${testBooking.total_price.toLocaleString()}`);
  console.log('');

  try {
    const result = await postToSupabase('/rest/v1/bookings', testBooking);

    if (result && result.length > 0) {
      console.log('✅ Booking creado exitosamente!');
      console.log(`   ID: ${result[0].id}`);
      console.log('');
      console.log('Para borrar este booking después, ejecuta:');
      console.log(`   node delete-test-booking.cjs ${result[0].id}`);
    } else {
      console.log('⚠️  Respuesta inesperada:', result);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
