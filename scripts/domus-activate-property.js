/**
 * DOMUS Property Activation Script
 *
 * Intenta activar la property 5814990 mediante diferentes endpoints y métodos
 */

import https from 'https';

const DOMUS_API_USER = 'kVfLOhx6UDOJF+k0piBqggYrC5DUmhbmBRuUYktTOhA=';
const DOMUS_API_PASSWORD = 'Pk5RHEEPn9sdZ27d+DKQWWgaYa35xbh0/B7d43gLGv4=';
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
 * Get property details
 */
async function getPropertyDetails() {
  console.log('\n🔍 Obteniendo detalles de property...\n');

  try {
    const response = await domusRequest('GET', `/property/${PROPERTY_ID}`);

    console.log('Status:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200) {
      const status = response.body?.property?.status || response.body?.status;
      console.log('\n📊 Property Status:', status);
      return response.body;
    } else {
      console.log('\n⚠️ No se pudo obtener property details');
      return null;
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    return null;
  }
}

/**
 * Attempt 1: PUT /property with status active
 */
async function tryUpdatePropertyStatus() {
  console.log('\n🔄 INTENTO 1: PUT /property con status active...\n');

  const data = {
    channelId: 1,
    status: 'active'
  };

  try {
    console.log('Enviando:', JSON.stringify(data, null, 2));
    const response = await domusRequest('PUT', `/property/${PROPERTY_ID}`, data);

    console.log('\nStatus:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200 || response.statusCode === 201) {
      console.log('\n✅ Property actualizada exitosamente');
      return true;
    } else {
      console.log('\n⚠️ Método no funcionó');
      return false;
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    return false;
  }
}

/**
 * Attempt 2: PATCH /property with status
 */
async function tryPatchPropertyStatus() {
  console.log('\n🔄 INTENTO 2: PATCH /property con status...\n');

  const data = {
    status: 'active'
  };

  try {
    console.log('Enviando:', JSON.stringify(data, null, 2));
    const response = await domusRequest('PATCH', `/property/${PROPERTY_ID}`, data);

    console.log('\nStatus:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200 || response.statusCode === 201) {
      console.log('\n✅ Property actualizada exitosamente');
      return true;
    } else {
      console.log('\n⚠️ Método no funcionó');
      return false;
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    return false;
  }
}

/**
 * Attempt 3: POST /property/activate
 */
async function tryPostActivate() {
  console.log('\n🔄 INTENTO 3: POST /property/activate...\n');

  const data = {
    channelId: 1,
    propertyId: PROPERTY_ID
  };

  try {
    console.log('Enviando:', JSON.stringify(data, null, 2));
    const response = await domusRequest('POST', '/property/activate', data);

    console.log('\nStatus:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200 || response.statusCode === 201) {
      console.log('\n✅ Property activada exitosamente');
      return true;
    } else {
      console.log('\n⚠️ Método no funcionó');
      return false;
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    return false;
  }
}

/**
 * Attempt 4: POST /property/:id/status
 */
async function tryPostPropertyStatus() {
  console.log('\n🔄 INTENTO 4: POST /property/:id/status...\n');

  const data = {
    status: 'active'
  };

  try {
    console.log('Enviando:', JSON.stringify(data, null, 2));
    const response = await domusRequest('POST', `/property/${PROPERTY_ID}/status`, data);

    console.log('\nStatus:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200 || response.statusCode === 201) {
      console.log('\n✅ Property activada exitosamente');
      return true;
    } else {
      console.log('\n⚠️ Método no funcionó');
      return false;
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    return false;
  }
}

/**
 * Run all activation attempts
 */
async function runActivationAttempts() {
  console.log('═══════════════════════════════════════════════════');
  console.log('  DOMUS PROPERTY ACTIVATION SCRIPT');
  console.log('  Property ID: 5814990');
  console.log('═══════════════════════════════════════════════════');

  // Get current status
  await getPropertyDetails();

  // Try different activation methods
  let activated = false;

  activated = await tryUpdatePropertyStatus();
  if (activated) {
    console.log('\n✅ Activación exitosa con PUT /property');
    return;
  }

  activated = await tryPatchPropertyStatus();
  if (activated) {
    console.log('\n✅ Activación exitosa con PATCH /property');
    return;
  }

  activated = await tryPostActivate();
  if (activated) {
    console.log('\n✅ Activación exitosa con POST /property/activate');
    return;
  }

  activated = await tryPostPropertyStatus();
  if (activated) {
    console.log('\n✅ Activación exitosa con POST /property/:id/status');
    return;
  }

  // If all failed
  console.log('\n═══════════════════════════════════════════════════');
  console.log('  ⚠️ NO SE PUDO ACTIVAR VIA API');
  console.log('═══════════════════════════════════════════════════');
  console.log('\n💡 SOLUCIONES ALTERNATIVAS:');
  console.log('   1. Contactar soporte de DOMUS para activar manualmente');
  console.log('   2. Verificar si tu cuenta tiene permisos de activación');
  console.log('   3. Verificar si existe proceso de aprobación en panel web');
  console.log('   4. Intentar configurar rates/availability directamente');
  console.log('      (a veces esto activa la property automáticamente)');
  console.log('\n📧 Soporte DOMUS: support@zodomus.com');

  // Get final status
  console.log('\n📊 Estado final:');
  await getPropertyDetails();
}

// Run script
runActivationAttempts().catch(console.error);
