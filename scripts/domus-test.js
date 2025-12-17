/**
 * DOMUS API Test Script
 *
 * Este script prueba la conexión con DOMUS API y crea una propiedad de test
 */

import https from 'https';

// Credenciales DOMUS (TEST mode)
const DOMUS_API_USER = 'kVfLOhx6UDOJF+k0piBqggYrC5DUmhbmBRuUYktTOhA=';
const DOMUS_API_PASSWORD = 'Pk5RHEEPn9sdZ27d+DKQWWgaYa35xbh0/B7d43gLGv4=';
const DOMUS_BASE_URL = 'api.zodomus.com';

// Crear Basic Auth header
const auth = Buffer.from(`${DOMUS_API_USER}:${DOMUS_API_PASSWORD}`).toString('base64');

/**
 * Helper para hacer requests a DOMUS API
 */
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
 * Test 1: Verificar conexión con API (GET account info)
 */
async function testConnection() {
  console.log('\n🔍 TEST 1: Verificando conexión con DOMUS API...\n');

  try {
    const response = await domusRequest('GET', '/account');

    console.log('Status:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200) {
      console.log('\n✅ Conexión exitosa con DOMUS API');
      return true;
    } else {
      console.log('\n⚠️ Respuesta inesperada:', response.statusCode);
      return false;
    }
  } catch (error) {
    console.error('\n❌ Error de conexión:', error.message);
    return false;
  }
}

/**
 * Test 2: Intentar crear propiedad de test
 */
async function createTestProperty() {
  console.log('\n🏨 TEST 2: Creando propiedad de test en DOMUS...\n');

  // Payload completo para crear propiedad con hotelContent
  // hotelContent es específico de Booking.com API
  const propertyData = {
    channelId: 1, // 1 = Booking.com
    propertyName: 'Izumi Hotel - Test',
    address: 'Jl. Test, Bali',
    city: 'Ubud',
    country: 'Indonesia',
    postalCode: '80571',
    propertyType: 'Hotel',
    currency: 'USD',
    hotelContent: {
      propertyName: 'Izumi Hotel - Test',
      address: 'Jl. Test, Bali',
      city: 'Ubud',
      zip: '80571',
      countrycode: 'ID', // Indonesia
      checkin_from: '14:00',
      checkin_to: '23:00',
      checkout_from: '06:00',
      checkout_to: '12:00',
      latitude: -8.50926,
      longitude: 115.26278,
      star_rating: 4,
      description: 'Beautiful boutique hotel in Ubud, Bali'
    },
    contactInfo: [
      {
        type: 'PhysicalLocation',
        email: 'info@izumihotel.com',
        phone: '+62-361-123456'
      },
      {
        type: 'general',
        email: 'josecarrallodelafuente@gmail.com',
        phone: '+62-361-123456',
        url: 'https://izumihotel.com'
      },
      {
        type: 'invoices',
        email: 'billing@izumihotel.com',
        phone: '+62-361-123456'
      }
    ],
    hotelInfo: {
      propertyType: 20, // 20 = Hotel (obtenido de /booking-property-types)
      guestRoomQuantity: 10,
      number_of_floors: 2,
      year_built: 2020,
      year_renovated: 2023
    }
  };

  try {
    console.log('Enviando datos:', JSON.stringify(propertyData, null, 2));

    const response = await domusRequest('POST', '/property', propertyData);

    console.log('\nStatus:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200 || response.statusCode === 201) {
      console.log('\n✅ Propiedad creada exitosamente');
      console.log('\n📝 Property ID:', response.body?.propertyId || 'Ver response arriba');
      return response.body;
    } else if (response.statusCode === 400) {
      console.log('\n⚠️ Error 400 - Revisa los campos requeridos en la documentación de DOMUS');
      console.log('Campos enviados:', Object.keys(propertyData));
      return null;
    } else {
      console.log('\n⚠️ Respuesta inesperada:', response.statusCode);
      return null;
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    return null;
  }
}

/**
 * Test 3: Obtener tipos de propiedad de Booking
 */
async function getBookingPropertyTypes() {
  console.log('\n📋 TEST 3: Obteniendo tipos de propiedad de Booking...\n');

  try {
    const response = await domusRequest('GET', '/booking-property-types');

    console.log('Status:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200) {
      console.log('\n✅ Property Types obtenidos');
      return response.body;
    } else {
      console.log('\n⚠️ Respuesta inesperada:', response.statusCode);
      return null;
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    return null;
  }
}

/**
 * Ejecutar todos los tests
 */
async function runTests() {
  console.log('═══════════════════════════════════════════════════');
  console.log('  DOMUS API TEST SCRIPT');
  console.log('  MY HOST BizMate Integration');
  console.log('═══════════════════════════════════════════════════');

  // Test 1: Conexión
  const connected = await testConnection();

  if (!connected) {
    console.log('\n❌ No se pudo conectar a DOMUS API');
    console.log('Verifica las credenciales y que estés en modo TEST');
    return;
  }

  // Test 2: Obtener tipos de propiedad de Booking
  const propertyTypes = await getBookingPropertyTypes();

  // Test 3: Crear propiedad
  const property = await createTestProperty();

  if (property) {
    console.log('\n═══════════════════════════════════════════════════');
    console.log('  ✅ TESTS COMPLETADOS');
    console.log('═══════════════════════════════════════════════════');
    console.log('\n📝 Siguiente paso:');
    console.log('   1. Guarda el Property ID que apareció arriba');
    console.log('   2. Usa ese ID para crear rooms');
    console.log('   3. Configura rates & availability');
  } else {
    console.log('\n═══════════════════════════════════════════════════');
    console.log('  ⚠️ TESTS COMPLETADOS CON ADVERTENCIAS');
    console.log('═══════════════════════════════════════════════════');
    console.log('\n📝 Siguiente paso:');
    console.log('   1. Revisa la documentación de DOMUS en tu panel');
    console.log('   2. Verifica los campos exactos para POST /property');
    console.log('   3. Actualiza el script con los campos correctos');
  }
}

// Ejecutar tests
runTests().catch(console.error);
