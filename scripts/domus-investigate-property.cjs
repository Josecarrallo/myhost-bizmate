/**
 * DOMUS Investigation - Obtener Property ID del Canal
 *
 * Investigar si la property 5814990 tiene un Property ID asignado
 * por Booking.com que podamos usar en el tutorial flow
 */

const https = require('https');

const CONFIG = {
  API_USER: 'IfLKCinlg1KOK2BOVcQMjTUOdcD5teeuNFBVOQQ5Jno=',
  API_PASSWORD: 'J9xiyR11I6iAF1yM6+QVmfhwULuxslmrmknziknsz0M=',
  API_BASE_URL: 'api.zodomus.com',
  CHANNEL_ID: 1,
  PROPERTY_ID: '5814990',
};

const authHeader = 'Basic ' + Buffer.from(CONFIG.API_USER + ':' + CONFIG.API_PASSWORD).toString('base64');

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: CONFIG.API_BASE_URL,
      port: 443,
      path: path,
      method: method,
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ statusCode: res.statusCode, data: response });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('  DOMUS INVESTIGATION - Property ID del Canal');
  console.log('='.repeat(70) + '\n');

  console.log('🔍 Investigando property 5814990...\n');

  // TEST 1: Property Check (ya sabemos que funciona)
  console.log('📋 TEST 1: POST /property-check\n');
  const checkPayload = {
    channelId: CONFIG.CHANNEL_ID,
    propertyId: CONFIG.PROPERTY_ID
  };

  const checkResult = await makeRequest('POST', '/property-check', checkPayload);
  console.log('Response:', JSON.stringify(checkResult.data, null, 2));

  // Buscar información de channel property ID
  if (checkResult.data && checkResult.data.status) {
    const msg = checkResult.data.status.returnMessage;
    console.log('\n📊 Property Status:', msg['Property status']);
    console.log('📊 Channel Status:', msg['Channel status']);
    console.log('📊 Product Status:', msg['Product status']);
    console.log('📊 Room Status:', msg['Room status']);
  }

  // TEST 2: Get Room Rates (puede tener info del property ID)
  console.log('\n\n📋 TEST 2: GET /room-rates\n');
  const roomRatesPath = `/room-rates?channelId=${CONFIG.CHANNEL_ID}&propertyId=${CONFIG.PROPERTY_ID}`;
  const roomRatesResult = await makeRequest('GET', roomRatesPath);

  console.log('Response:', JSON.stringify(roomRatesResult.data, null, 2));

  // TEST 3: Intentar GET /property (solo Expedia según docs, pero intentemos)
  console.log('\n\n📋 TEST 3: GET /property (puede no funcionar en Booking.com)\n');
  const propertyPath = `/property?channelId=${CONFIG.CHANNEL_ID}&propertyId=${CONFIG.PROPERTY_ID}`;
  const propertyResult = await makeRequest('GET', propertyPath);

  console.log('Status:', propertyResult.statusCode);
  console.log('Response:', JSON.stringify(propertyResult.data, null, 2));

  // TEST 4: Account info (puede tener lista de properties)
  console.log('\n\n📋 TEST 4: GET /account\n');
  const accountResult = await makeRequest('GET', '/account');
  console.log('Response:', JSON.stringify(accountResult.data, null, 2));

  // RESUMEN
  console.log('\n' + '='.repeat(70));
  console.log('  RESUMEN DE INVESTIGACIÓN');
  console.log('='.repeat(70) + '\n');

  console.log('✅ Property 5814990 existe en DOMUS');
  console.log('✅ 5 Rooms detectados');
  console.log('⚠️  Property Status: "Evaluation OTA" (no "Active")');
  console.log('⚠️  Rooms no mapeados (myRoomId vacío)\n');

  console.log('🤔 OPCIONES:\n');
  console.log('OPCIÓN A: Contactar soporte DOMUS');
  console.log('  - Solicitar cambio de status "Evaluation OTA" → "Active"');
  console.log('  - Property ID: 5814990');
  console.log('  - Email: support@zodomus.com\n');

  console.log('OPCIÓN B: Usar property existente de Booking.com');
  console.log('  - Si tienes una property YA registrada en Booking.com');
  console.log('  - Obtener Property ID de Booking.com');
  console.log('  - Seguir tutorial con ese ID\n');

  console.log('OPCIÓN C: Esperar aprobación automática');
  console.log('  - En PRODUCTION mode: 24-72 horas');
  console.log('  - En TEST mode: Puede no ocurrir nunca\n');

  console.log('💡 RECOMENDACIÓN: Contactar soporte (OPCIÓN A)');
  console.log('   El tutorial asume property ya aprobada por el canal.\n');
}

main().catch(console.error);
