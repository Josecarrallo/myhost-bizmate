const https = require('https');

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0';

async function deleteFromSupabase(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'jjpscimtxrudtepzwhag.supabase.co',
      path: path,
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 204 || res.statusCode === 200) {
          resolve({ success: true });
        } else {
          reject(new Error(`Status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function main() {
  const bookingId = process.argv[2] || 'bf95df68-7b52-4b4a-bd97-faad6810e3bb';

  console.log('=== BORRANDO BOOKING DE PRUEBA ===\n');
  console.log(`Booking ID: ${bookingId}`);
  console.log('');

  try {
    await deleteFromSupabase(`/rest/v1/bookings?id=eq.${bookingId}`);
    console.log('✅ Booking borrado exitosamente!');
    console.log('');
    console.log('Ahora regenera los informes con:');
    console.log('   node generate-business-report-v2.cjs');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
