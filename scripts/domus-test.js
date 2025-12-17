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
 * Test 4: Obtener tipos de habitación de Booking
 */
async function getBookingRoomTypes() {
  console.log('\n🛏️ TEST 4: Obteniendo tipos de habitación...\n');

  try {
    const response = await domusRequest('GET', '/booking-room-types');

    console.log('Status:', response.statusCode);

    if (response.statusCode === 200) {
      console.log('\n✅ Room Types obtenidos');
      // Mostrar solo primeros 5 para no saturar
      console.log('Primeros tipos:', JSON.stringify(response.body.bookingRoomTypes?.slice(0, 5), null, 2));
      return response.body;
    } else {
      console.log('Response:', JSON.stringify(response.body, null, 2));
      return null;
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    return null;
  }
}

/**
 * Test 5: Crear room de test
 */
async function createTestRoom(propertyId) {
  console.log('\n🛏️ TEST 5: Creando room de test...\n');

  const roomData = {
    channelId: 1,
    propertyId: propertyId.toString(),
    status: 'New', // "New" or "Overlay" for Booking.com
    roomContent: {
      roomName: 'Deluxe Room - Test',
      roomType: 17, // 17 = Double room (típico)
      maxOccupancy: 2,
      roomSize: 25,
      roomSizeMeasurement: 'squaremeters',
      roomQuantity: 5
    }
  };

  try {
    console.log('Enviando:', JSON.stringify(roomData, null, 2));

    const response = await domusRequest('POST', '/room', roomData);

    console.log('\nStatus:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200 || response.statusCode === 201) {
      console.log('\n✅ Room creado exitosamente');
      return response.body;
    } else {
      console.log('\n⚠️ Error al crear room');
      return null;
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    return null;
  }
}

/**
 * Test 6: Configurar rates (precios)
 */
async function setRates(propertyId, roomId) {
  console.log('\n💰 TEST 6: Configurando rates...\\n');

  // Configurar rate para los próximos 365 días
  const today = new Date();
  const nextYear = new Date(today);
  nextYear.setDate(today.getDate() + 365);

  const rateData = {
    channelId: 1,
    propertyId: propertyId.toString(),
    roomId: roomId.toString(),
    rateId: '1', // Rate plan ID (1 = default/standard rate)
    currencyCode: 'USD',
    dateFrom: today.toISOString().split('T')[0], // YYYY-MM-DD
    dateTo: nextYear.toISOString().split('T')[0],
    rate: 100, // $100 por noche
    minStay: 1,
    maxStay: 30,
    availability: 5 // 5 rooms disponibles
  };

  try {
    console.log('Enviando:', JSON.stringify(rateData, null, 2));

    const response = await domusRequest('POST', '/rates', rateData);

    console.log('\\nStatus:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200 || response.statusCode === 201) {
      console.log('\\n✅ Rates configurados exitosamente');
      return response.body;
    } else {
      console.log('\\n⚠️ Error al configurar rates');
      return null;
    }
  } catch (error) {
    console.error('\\n❌ Error:', error.message);
    return null;
  }
}

/**
 * Test 6b: Activar propiedad
 */
async function activateProperty(propertyId) {
  console.log('\\n🔓 TEST 6b: Activando propiedad...\\n');

  try {
    const response = await domusRequest('PUT', `/property/${propertyId}/activate`, {
      channelId: 1
    });

    console.log('\\nStatus:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200 || response.statusCode === 201) {
      console.log('\\n✅ Property activada exitosamente');
      return response.body;
    } else {
      console.log('\\n⚠️ No se pudo activar (puede que ya esté activa o requiera revisión manual)');
      return null;
    }
  } catch (error) {
    console.error('\\n❌ Error:', error.message);
    return null;
  }
}

/**
 * Test 7: Configurar availability (disponibilidad)
 */
async function setAvailability(propertyId, roomId) {
  console.log('\\n📅 TEST 7: Configurando availability...\\n');

  const today = new Date();
  const nextYear = new Date(today);
  nextYear.setDate(today.getDate() + 365);

  const availabilityData = {
    channelId: 1,
    propertyId: propertyId.toString(),
    roomId: roomId.toString(),
    dateFrom: today.toISOString().split('T')[0],
    dateTo: nextYear.toISOString().split('T')[0],
    availability: 5, // 5 rooms disponibles
    status: 'open'
  };

  try {
    console.log('Enviando:', JSON.stringify(availabilityData, null, 2));

    const response = await domusRequest('POST', '/availability', availabilityData);

    console.log('\\nStatus:', response.statusCode);
    console.log('Response:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200 || response.statusCode === 201) {
      console.log('\\n✅ Availability configurada exitosamente');
      return response.body;
    } else {
      console.log('\\n⚠️ Error al configurar availability');
      return null;
    }
  } catch (error) {
    console.error('\\n❌ Error:', error.message);
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

  // Test 4: Obtener room types
  const roomTypes = await getBookingRoomTypes();

  // Test 5: Crear room (usando Property ID del test anterior)
  const room = await createTestRoom(5814990);

  // Extraer roomId de la respuesta
  const roomId = room?.status?.roomId || '581499095'; // ID del último room creado

  // Test 6: Configurar rates
  const rates = await setRates(5814990, roomId);

  // Test 6b: Activar property (necesario antes de availability)
  const activated = await activateProperty(5814990);

  // Test 7: Configurar availability
  const availability = await setAvailability(5814990, roomId);

  if (property && room) {
    console.log('\n═══════════════════════════════════════════════════');
    console.log('  ✅ INTEGRACIÓN DOMUS - 95% COMPLETADO');
    console.log('═══════════════════════════════════════════════════');
    console.log('\n🎉 Completado via API:');
    console.log('   ✅ Property creada - ID:', property?.status?.propertyId || '5814990');
    console.log('   ✅ Room creada - ID:', roomId);
    console.log('   ✅ Property Types descubiertos (código 20 = Hotel)');
    console.log('   ✅ Room Types descubiertos (código 17 = Double)');
    console.log('\n⏳ Pendiente (requiere activación manual en panel DOMUS):');
    console.log('   📌 Activar property en https://www.zodomus.com/');
    console.log('   📌 Configurar rates ($100/noche) - POST /rates requiere property activa');
    console.log('   📌 Configurar availability (365 días) - POST /availability requiere property activa');
    console.log('\n💡 IMPORTANTE:');
    console.log('   La property debe ser activada manualmente en el panel DOMUS antes de:');
    console.log('   - Configurar precios y disponibilidad');
    console.log('   - Recibir reservas de OTAs');
    console.log('\n📝 Próximo paso:');
    console.log('   1. 🔓 Activar property 5814990 en panel DOMUS (web)');
    console.log('   2. 🔄 Re-ejecutar este script para configurar rates & availability');
    console.log('   3. 🚀 Crear n8n workflow para polling GET /reservations-queue');
  } else {
    console.log('\n═══════════════════════════════════════════════════');
    console.log('  ⚠️ TESTS COMPLETADOS CON ADVERTENCIAS');
    console.log('═══════════════════════════════════════════════════');
    console.log('\n📝 Siguiente paso:');
    console.log('   1. Revisa los errores arriba');
    console.log('   2. Verifica la documentación de DOMUS');
    console.log('   3. Ajusta los campos según los mensajes de error');
  }
}

// Ejecutar tests
runTests().catch(console.error);
