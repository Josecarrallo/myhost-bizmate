const https = require('https');

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0';
const GITA_OWNER_ID = '1f32d384-4018-46a9-a6f9-058217e6924a';

async function fetchFromSupabase(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'jjpscimtxrudtepzwhag.supabase.co',
      path: path,
      method: 'GET',
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
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function main() {
  console.log('=== PROPERTIES DE GITA PRADNYANA ===\n');

  // Get properties for Gita
  const properties = await fetchFromSupabase(
    `/rest/v1/properties?owner_id=eq.${GITA_OWNER_ID}&select=*`
  );

  console.log(`Total properties: ${properties.length}\n`);

  for (const prop of properties) {
    console.log(`Property: ${prop.name}`);
    console.log(`  ID: ${prop.id}`);
    console.log(`  Owner ID: ${prop.owner_id}`);
    console.log('');

    // Get bookings for this property
    const bookings = await fetchFromSupabase(
      `/rest/v1/bookings?property_id=eq.${prop.id}&select=*&order=check_in.asc`
    );

    console.log(`  Total bookings: ${bookings.length}`);

    if (bookings.length > 0) {
      const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
      console.log(`  Total revenue: IDR ${totalRevenue.toLocaleString()}`);

      // Group by year
      const byYear = {};
      bookings.forEach(b => {
        const year = new Date(b.check_in).getFullYear();
        if (!byYear[year]) byYear[year] = 0;
        byYear[year]++;
      });

      console.log('  Bookings por año:');
      Object.keys(byYear).sort().forEach(year => {
        console.log(`    ${year}: ${byYear[year]} bookings`);
      });
    }
    console.log('');
  }
}

main().catch(console.error);
