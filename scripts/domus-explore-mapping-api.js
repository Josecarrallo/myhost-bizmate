/**
 * DOMUS Mapping API Explorer
 *
 * Explora los Mapping APIs que según la documentación permiten:
 * "Activate/cancel properties and rooms"
 */

import https from 'https';

const DOMUS_API_USER = 'kVfLOhx6UDOJF+k0piBqggYrC5DUmhbmBRuUYktTOhA=';
const DOMUS_API_PASSWORD = 'Pk5RHEEPn9sdZ27d+DKQWWgaYa35xbh0/B7d43gLGv4=';
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
 * Test 1: GET /mapping (listar mappings)
 */
async function getMappings() {
  console.log('\n🔍 TEST 1: GET /mapping...\n');

  try {
    const response = await domusRequest('GET', '/mapping');

    console.log('Status:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200) {
      console.log('\n✅ Mappings obtenidos');
      return response.body;
    } else {
      console.log('\n⚠️ No se pudieron obtener mappings');
      return null;
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    return null;
  }
}

/**
 * Test 2: GET /mapping/property/:id
 */
async function getPropertyMapping() {
  console.log('\n🔍 TEST 2: GET /mapping/property/:id...\n');

  try {
    const response = await domusRequest('GET', `/mapping/property/${PROPERTY_ID}`);

    console.log('Status:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200) {
      console.log('\n✅ Property mapping obtenido');
      return response.body;
    } else {
      console.log('\n⚠️ No se pudo obtener property mapping');
      return null;
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    return null;
  }
}

/**
 * Test 3: POST /mapping/property (activate property)
 */
async function activatePropertyMapping() {
  console.log('\n🔓 TEST 3: POST /mapping/property (activate)...\n');

  const data = {
    channelId: 1, // Booking.com
    propertyId: PROPERTY_ID,
    action: 'activate'
  };

  try {
    console.log('Enviando:', JSON.stringify(data, null, 2));
    const response = await domusRequest('POST', '/mapping/property', data);

    console.log('\nStatus:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200 || response.statusCode === 201) {
      console.log('\n✅ Property mapping activado');
      return response.body;
    } else {
      console.log('\n⚠️ No se pudo activar property mapping');
      return null;
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    return null;
  }
}

/**
 * Test 4: PUT /mapping/property/:id/activate
 */
async function putActivatePropertyMapping() {
  console.log('\n🔓 TEST 4: PUT /mapping/property/:id/activate...\n');

  const data = {
    channelId: 1
  };

  try {
    console.log('Enviando:', JSON.stringify(data, null, 2));
    const response = await domusRequest('PUT', `/mapping/property/${PROPERTY_ID}/activate`, data);

    console.log('\nStatus:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200 || response.statusCode === 201) {
      console.log('\n✅ Property activada via mapping');
      return response.body;
    } else {
      console.log('\n⚠️ No se pudo activar');
      return null;
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    return null;
  }
}

/**
 * Test 5: POST /mapping/activate
 */
async function postMappingActivate() {
  console.log('\n🔓 TEST 5: POST /mapping/activate...\n');

  const data = {
    channelId: 1,
    propertyId: PROPERTY_ID,
    type: 'property'
  };

  try {
    console.log('Enviando:', JSON.stringify(data, null, 2));
    const response = await domusRequest('POST', '/mapping/activate', data);

    console.log('\nStatus:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200 || response.statusCode === 201) {
      console.log('\n✅ Mapping activado');
      return response.body;
    } else {
      console.log('\n⚠️ No se pudo activar mapping');
      return null;
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    return null;
  }
}

/**
 * Test 6: PATCH /mapping/property/:id
 */
async function patchPropertyMapping() {
  console.log('\n🔓 TEST 6: PATCH /mapping/property/:id...\n');

  const data = {
    status: 'active',
    channelId: 1
  };

  try {
    console.log('Enviando:', JSON.stringify(data, null, 2));
    const response = await domusRequest('PATCH', `/mapping/property/${PROPERTY_ID}`, data);

    console.log('\nStatus:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200 || response.statusCode === 201) {
      console.log('\n✅ Property mapping actualizado');
      return response.body;
    } else {
      console.log('\n⚠️ No se pudo actualizar');
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
  console.log('  DOMUS MAPPING API EXPLORER');
  console.log('  Property ID: 5814990');
  console.log('═══════════════════════════════════════════════════');
  console.log('\n📚 Según documentación:');
  console.log('   "Mapping APIs: Activate/cancel properties and rooms"');
  console.log('\n🔍 Explorando endpoints de Mapping...\n');

  // Test 1: Get all mappings
  await getMappings();

  // Test 2: Get property mapping
  await getPropertyMapping();

  // Test 3: POST /mapping/property
  const activated1 = await activatePropertyMapping();
  if (activated1) {
    console.log('\n✅ ÉXITO con POST /mapping/property');
    return;
  }

  // Test 4: PUT /mapping/property/:id/activate
  const activated2 = await putActivatePropertyMapping();
  if (activated2) {
    console.log('\n✅ ÉXITO con PUT /mapping/property/:id/activate');
    return;
  }

  // Test 5: POST /mapping/activate
  const activated3 = await postMappingActivate();
  if (activated3) {
    console.log('\n✅ ÉXITO con POST /mapping/activate');
    return;
  }

  // Test 6: PATCH /mapping/property/:id
  const activated4 = await patchPropertyMapping();
  if (activated4) {
    console.log('\n✅ ÉXITO con PATCH /mapping/property/:id');
    return;
  }

  console.log('\n═══════════════════════════════════════════════════');
  console.log('  📊 RESUMEN');
  console.log('═══════════════════════════════════════════════════');
  console.log('\n💡 Ningún endpoint de Mapping funcionó para activación.');
  console.log('\n📧 Email enviado a soporte - esperando respuesta.');
  console.log('\n🔄 Mientras tanto, podemos:');
  console.log('   1. Continuar con desarrollo del workflow de polling');
  console.log('   2. Usar datos simulados para testing');
  console.log('   3. Preparar src/services/domus.js');
}

// Run tests
runTests().catch(console.error);
