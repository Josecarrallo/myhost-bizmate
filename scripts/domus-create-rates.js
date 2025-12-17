/**
 * DOMUS Rate Creation
 *
 * Antes de activar rooms, necesitamos crear rate plans
 */

import https from 'https';

const DOMUS_API_USER = 'IfLKCinlg1KOK2BOVcQMjTUOdcD5teeuNFBVOQQ5Jno=';
const DOMUS_API_PASSWORD = 'J9xiyR11I6iAF1yM6+QVmfhwULuxslmrmknziknsz0M=';
const DOMUS_BASE_URL = 'api.zodomus.com';
const PROPERTY_ID = '5814990';

const auth = Buffer.from(`${DOMUS_API_USER}:${DOMUS_API_PASSWORD}`).toString('base64');

function domusRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: DOMUS_BASE_URL,
      port: 443,
      path: path,
      method: method,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (data) {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            body: body ? JSON.parse(body) : null
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            body: body,
            parseError: e.message
          });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

/**
 * Get existing room-rates
 */
async function getRoomRates() {
  console.log('\n📋 GET /room-rates...\n');

  const response = await domusRequest('GET', `/room-rates?channelId=1&propertyId=${PROPERTY_ID}`);

  console.log('Status:', response.statusCode);
  console.log('Response:', JSON.stringify(response.body, null, 2));

  if (response.statusCode === 200) {
    console.log('\n✅ Room rates obtenidos');
    return response.body;
  } else {
    console.log('\n⚠️ No se pudieron obtener room rates');
    return null;
  }
}

/**
 * Create rate plan for a room
 */
async function createRatePlan(roomId, rateName) {
  console.log(`\n💰 Creando rate plan para room ${roomId}...\n`);

  const rateData = {
    channelId: 1,
    propertyId: PROPERTY_ID,
    roomId: roomId,
    rateName: rateName,
    rateDescription: `Standard rate for ${rateName}`,
    rateType: 'Standard'
  };

  console.log('Enviando:', JSON.stringify(rateData, null, 2));

  const response = await domusRequest('POST', '/rate', rateData);

  console.log('\nStatus:', response.statusCode);
  console.log('Response:', JSON.stringify(response.body, null, 2));

  if (response.statusCode === 200 || response.statusCode === 201) {
    console.log('\n✅ Rate plan creado');
    return response.body;
  } else {
    console.log('\n⚠️ Error al crear rate plan');
    return null;
  }
}

/**
 * Try rooms activation with rates
 */
async function activateRoomsWithRates() {
  console.log('\n🔓 POST /rooms-activation (con rates)...\n');

  const data = {
    channelId: 1,
    propertyId: PROPERTY_ID,
    rooms: [
      {
        roomId: '581499084',
        myRoomId: 'DELUXE-001',
        rates: [{ rateId: '1', myRateId: 'STANDARD-RATE-001' }]
      },
      {
        roomId: '581499086',
        myRoomId: 'DELUXE-002',
        rates: [{ rateId: '1', myRateId: 'STANDARD-RATE-002' }]
      },
      {
        roomId: '581499088',
        myRoomId: 'DELUXE-003',
        rates: [{ rateId: '1', myRateId: 'STANDARD-RATE-003' }]
      },
      {
        roomId: '581499095',
        myRoomId: 'DELUXE-004',
        rates: [{ rateId: '1', myRateId: 'STANDARD-RATE-004' }]
      }
    ]
  };

  console.log('Enviando:', JSON.stringify(data, null, 2));

  const response = await domusRequest('POST', '/rooms-activation', data);

  console.log('\nStatus:', response.statusCode);
  console.log('Response:', JSON.stringify(response.body, null, 2));

  if (response.statusCode === 200) {
    const numActivated = response.body?.status?.returnMessage || '0';
    console.log(`\n📊 Rooms activados: ${numActivated}`);
    return response.body;
  } else {
    console.log('\n⚠️ Activation falló');
    return null;
  }
}

/**
 * Main workflow
 */
async function run() {
  console.log('═══════════════════════════════════════════════════');
  console.log('  DOMUS RATE CREATION & ROOM ACTIVATION');
  console.log('═══════════════════════════════════════════════════');

  // 1. Get existing rates
  console.log('\n📋 Paso 1: Verificar room-rates existentes...');
  const existingRates = await getRoomRates();

  // 2. Create rate plans (si es necesario)
  console.log('\n📋 Paso 2: Crear rate plans...');
  const rooms = ['581499084', '581499086', '581499088', '581499095'];

  for (let i = 0; i < rooms.length; i++) {
    await createRatePlan(rooms[i], `Deluxe Room ${i + 1}`);
  }

  // 3. Try activation with rates
  console.log('\n📋 Paso 3: Activar rooms con rates...');
  const activationResult = await activateRoomsWithRates();

  console.log('\n═══════════════════════════════════════════════════');
  console.log('  RESUMEN');
  console.log('═══════════════════════════════════════════════════');

  if (activationResult) {
    console.log('\n✅ Proceso completado');
    console.log('\n📝 Siguiente paso:');
    console.log('   - Verificar en panel DOMUS');
    console.log('   - Revisar respuesta de soporte');
  } else {
    console.log('\n⚠️ Rooms no activados');
    console.log('\n💡 Posible causa:');
    console.log('   - Property debe estar Active (no Evaluation OTA)');
    console.log('   - Esperar respuesta de soporte DOMUS');
  }
}

run().catch(console.error);
