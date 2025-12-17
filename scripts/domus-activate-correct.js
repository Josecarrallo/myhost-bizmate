/**
 * DOMUS Property Activation - ENDPOINTS CORRECTOS
 *
 * Usando la documentación oficial encontrada en:
 * n8n_worlkflow_claude/A list of Zodomus API's.txt
 */

import https from 'https';

const DOMUS_API_USER = 'IfLKCinlg1KOK2BOVcQMjTUOdcD5teeuNFBVOQQ5Jno=';
const DOMUS_API_PASSWORD = 'J9xiyR11I6iAF1yM6+QVmfhwULuxslmrmknziknsz0M=';
const DOMUS_BASE_URL = 'api.zodomus.com';
const PROPERTY_ID = '5814990';
const ROOM_ID = '581499086';

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

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const response = {
            statusCode: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null
          };
          resolve(response);
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body,
            parseError: e.message
          });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * Test 1: POST /property-check
 * Check a property with Zodomus
 */
async function checkProperty() {
  console.log('\n🔍 TEST 1: POST /property-check...\n');

  const data = {
    channelId: 1, // Booking.com
    propertyId: PROPERTY_ID
  };

  try {
    console.log('Enviando:', JSON.stringify(data, null, 2));
    const response = await domusRequest('POST', '/property-check', data);

    console.log('\nStatus:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200) {
      console.log('\n✅ Property check exitoso');
      return response.body;
    } else {
      console.log('\n⚠️ Property check falló');
      return null;
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    return null;
  }
}

/**
 * Test 2: POST /property-activation
 * Activate a channel property with Zodomus
 */
async function activateProperty() {
  console.log('\n🔓 TEST 2: POST /property-activation...\n');

  const data = {
    channelId: 1, // Booking.com
    propertyId: PROPERTY_ID,
    priceModelId: 1 // 1 = Maximum / Single occupancy
  };

  try {
    console.log('Enviando:', JSON.stringify(data, null, 2));
    const response = await domusRequest('POST', '/property-activation', data);

    console.log('\nStatus:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200 || response.statusCode === 201) {
      console.log('\n✅ Property activada exitosamente!');
      return response.body;
    } else {
      console.log('\n⚠️ Property activation falló');
      return null;
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    return null;
  }
}

/**
 * Test 3: POST /property-status
 * Set property status (only in Booking)
 */
async function setPropertyStatus() {
  console.log('\n🔓 TEST 3: POST /property-status...\n');

  const data = {
    channelId: 1,
    propertyId: PROPERTY_ID,
    status: 'active' // o 'Active' o 1, probaremos
  };

  try {
    console.log('Enviando:', JSON.stringify(data, null, 2));
    const response = await domusRequest('POST', '/property-status', data);

    console.log('\nStatus:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200 || response.statusCode === 201) {
      console.log('\n✅ Property status actualizado!');
      return response.body;
    } else {
      console.log('\n⚠️ Property status falló');
      return null;
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    return null;
  }
}

/**
 * Test 4: POST /rooms-activation
 * Activate the property rooms and rates and map them with Zodomus
 */
async function activateRooms() {
  console.log('\n🛏️ TEST 4: POST /rooms-activation...\n');

  // Mapear todos los rooms encontrados en property-check
  const data = {
    channelId: 1,
    propertyId: PROPERTY_ID,
    rooms: [
      { roomId: '581499084', myRoomId: 'DELUXE-001' },
      { roomId: '581499086', myRoomId: 'DELUXE-002' },
      { roomId: '581499088', myRoomId: 'DELUXE-003' },
      { roomId: '581499095', myRoomId: 'DELUXE-004' }
    ]
  };

  try {
    console.log('Enviando:', JSON.stringify(data, null, 2));
    const response = await domusRequest('POST', '/rooms-activation', data);

    console.log('\nStatus:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200 || response.statusCode === 201) {
      console.log('\n✅ Rooms activados exitosamente!');
      return response.body;
    } else {
      console.log('\n⚠️ Rooms activation falló');
      return null;
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    return null;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('═══════════════════════════════════════════════════');
  console.log('  DOMUS PROPERTY ACTIVATION');
  console.log('  Usando endpoints correctos de documentación oficial');
  console.log('═══════════════════════════════════════════════════');

  // Test 1: Check property
  console.log('\n📋 Paso 1: Verificar property...');
  const checkResult = await checkProperty();

  // Test 2: Activate property
  console.log('\n📋 Paso 2: Activar property...');
  const activateResult = await activateProperty();

  if (activateResult) {
    console.log('\n🎉 ¡PROPERTY ACTIVADA!');

    // Test 3: Activate rooms
    console.log('\n📋 Paso 3: Activar rooms...');
    const roomsResult = await activateRooms();

    if (roomsResult) {
      console.log('\n═══════════════════════════════════════════════════');
      console.log('  ✅ ACTIVACIÓN COMPLETA');
      console.log('═══════════════════════════════════════════════════');
      console.log('\n🎉 Property y Rooms activados!');
      console.log('\n📝 Siguiente paso:');
      console.log('   node scripts/domus-test.js');
      console.log('   (para configurar rates y availability)');
      return;
    }
  }

  // Si property activation falló, intentar con property-status
  console.log('\n📋 Paso 3 alternativo: Set property status...');
  const statusResult = await setPropertyStatus();

  if (statusResult) {
    console.log('\n✅ Property status actualizado!');
    console.log('\n📋 Paso 4: Activar rooms...');
    const roomsResult = await activateRooms();

    if (roomsResult) {
      console.log('\n═══════════════════════════════════════════════════');
      console.log('  ✅ ACTIVACIÓN COMPLETA (via status)');
      console.log('═══════════════════════════════════════════════════');
      return;
    }
  }

  console.log('\n═══════════════════════════════════════════════════');
  console.log('  ⚠️ NO SE PUDO ACTIVAR');
  console.log('═══════════════════════════════════════════════════');
  console.log('\n💡 Revisar responses arriba para más detalles');
  console.log('📧 Email a soporte enviado - esperando respuesta');
}

// Run tests
runTests().catch(console.error);
