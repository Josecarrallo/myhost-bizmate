const https = require('https');

const options = {
  hostname: 'jjpscimtxrudtepzwhag.supabase.co',
  path: '/rest/v1/bookings?guest_name=ilike.*Luis*&select=*&order=created_at.desc&limit=10',
  method: 'GET',
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const bookings = JSON.parse(data);
    console.log('Total bookings encontrados:', bookings.length);
    bookings.forEach(b => {
      console.log(`\n- ID: ${b.id}`);
      console.log(`  Guest: ${b.guest_name}`);
      console.log(`  Check-in: ${b.check_in}`);
      console.log(`  Nights: ${b.nights}`);
      console.log(`  Total: ${b.currency} ${b.total_price}`);
      console.log(`  Created: ${b.created_at}`);
    });
  });
});

req.on('error', (e) => console.error(e));
req.end();
