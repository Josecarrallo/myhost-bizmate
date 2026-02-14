const https = require('https');

const SUPABASE_URL = 'jjpscimtxrudtepzwhag.supabase.co';
const ACCESS_TOKEN = 'sbp_40144b21e90c0680e9e9e7940d9485a30e2b7913';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjk0MzIzMiwiZXhwIjoyMDc4NTE5MjMyfQ.RBD16xjgQB__nj5DtLrK2w55uQ4WFJiaa0mfZT2BeJg';

const sql = `CREATE POLICY "Allow all access to villas" ON villas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);`;

// Usar Management API de Supabase
const options = {
  hostname: 'api.supabase.com',
  path: '/v1/projects/jjpscimtxrudtepzwhag/database/query',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  }
};

const postData = JSON.stringify({ query: sql });

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('\n✅ RESPUESTA DE SUPABASE:\n');
    console.log('Status:', res.statusCode);
    console.log('Data:', data);

    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log('\n✅ POLICY CREADA EXITOSAMENTE\n');
    } else {
      console.log('\n❌ ERROR AL CREAR POLICY\n');
    }
  });
});

req.on('error', (e) => {
  console.error('\n❌ Error:', e.message);
});

req.write(postData);
req.end();
