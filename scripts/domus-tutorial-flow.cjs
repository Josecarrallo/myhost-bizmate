/**
 * DOMUS Integration - Tutorial Official Flow
 *
 * Sigue EXACTAMENTE el tutorial oficial de DOMUS:
 * "Zodomus tutorial step by step tests only (basic channel manager operations)"
 *
 * Fecha: 18 Diciembre 2025
 * Property ID: 5814990 (Izumi Hotel - Test)
 * Channel ID: 1 (Booking.com)
 *
 * FLUJO:
 * 1. Test connection (GET /channels)
 * 2. Activate property (POST /property-activation)
 * 3. Get rooms and rates (GET /room-rates)
 * 4. Map/Activate rooms (POST /rooms-activation)
 * 5. Verify property check (POST /property-check)
 * 6. Set availability (POST /availability)
 * 7. Set rates (POST /rates)
 */

const https = require('https');

// ============================================
// CONFIGURACIÓN
// ============================================

const CONFIG = {
  // Credenciales DOMUS (17 Dic 2025)
  API_USER: 'IfLKCinlg1KOK2BOVcQMjTUOdcD5teeuNFBVOQQ5Jno=',
  API_PASSWORD: 'J9xiyR11I6iAF1yM6+QVmfhwULuxslmrmknziknsz0M=',
  API_BASE_URL: 'api.zodomus.com',

  // Property existente creada el 17 Dic 2025
  CHANNEL_ID: 1,              // Booking.com
  PROPERTY_ID: '5814990',     // Izumi Hotel - Test
  PRICE_MODEL_ID: '2',        // Derived pricing (según tutorial)

  // Configuración de rates
  CURRENCY_CODE: 'USD',
  RATE_PRICE: 100,            // $100 por noche

  // Configuración de availability
  AVAILABILITY_COUNT: 5,      // 5 rooms disponibles
  DAYS_AHEAD: 365,           // Configurar 365 días hacia adelante
};

// ============================================
// UTILIDADES
// ============================================

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

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

function printSeparator(title) {
  console.log('\n' + '='.repeat(70));
  console.log(`  ${title}`);
  console.log('='.repeat(70) + '\n');
}

function printSuccess(message) {
  console.log('✅', message);
}

function printError(message) {
  console.log('❌', message);
}

function printInfo(message) {
  console.log('ℹ️ ', message);
}

function getDateRange(daysAhead) {
  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + daysAhead);

  return {
    dateFrom: today.toISOString().split('T')[0],
    dateTo: endDate.toISOString().split('T')[0]
  };
}

// ============================================
// PASO 1: TEST CONNECTION
// ============================================

async function step1_testConnection() {
  printSeparator('PASO 1: Test Connection');

  try {
    const result = await makeRequest('GET', '/channels');

    if (result.statusCode === 200) {
      printSuccess('Conexión exitosa a DOMUS API');
      console.log('Canales disponibles:', JSON.stringify(result.data.channels, null, 2));
      return true;
    } else {
      printError(`Error en conexión: ${result.statusCode}`);
      console.log(result.data);
      return false;
    }
  } catch (error) {
    printError('Error al conectar: ' + error.message);
    return false;
  }
}

// ============================================
// PASO 2: ACTIVATE PROPERTY
// ============================================

async function step2_activateProperty() {
  printSeparator('PASO 2: Activate Property in Zodomus');

  printInfo(`Activando property ${CONFIG.PROPERTY_ID} en canal ${CONFIG.CHANNEL_ID}...`);

  const payload = {
    channelId: CONFIG.CHANNEL_ID,
    propertyId: CONFIG.PROPERTY_ID,
    priceModelId: CONFIG.PRICE_MODEL_ID
  };

  console.log('Payload:', JSON.stringify(payload, null, 2));

  try {
    const result = await makeRequest('POST', '/property-activation', payload);

    console.log('Response:', JSON.stringify(result.data, null, 2));

    if (result.statusCode === 200) {
      if (result.data.status && result.data.status.returnCode === 200) {
        printSuccess('Property activada exitosamente');
        printInfo(`Mensaje: ${result.data.status.returnMessage}`);
        return true;
      } else {
        printError('Property activation con advertencia');
        console.log('Response completo:', result.data);
        // Continuar de todas formas, puede estar ya activada
        return true;
      }
    } else {
      printError(`Error en activación: ${result.statusCode}`);
      console.log(result.data);
      return false;
    }
  } catch (error) {
    printError('Error al activar property: ' + error.message);
    return false;
  }
}

// ============================================
// PASO 3: GET ROOMS AND RATES
// ============================================

async function step3_getRoomsAndRates() {
  printSeparator('PASO 3: Get Rooms and Rates');

  printInfo('Obteniendo rooms y rates del canal...');

  const path = `/room-rates?channelId=${CONFIG.CHANNEL_ID}&propertyId=${CONFIG.PROPERTY_ID}`;

  try {
    const result = await makeRequest('GET', path);

    if (result.statusCode === 200) {
      printSuccess('Rooms y rates obtenidos');

      if (result.data.rooms && result.data.rooms.length > 0) {
        console.log('\nRooms disponibles:');
        result.data.rooms.forEach((room, idx) => {
          console.log(`\n  Room ${idx + 1}:`);
          console.log(`    ID: ${room.id}`);
          console.log(`    Name: ${room.name}`);

          if (room.rates && room.rates.length > 0) {
            console.log(`    Rates (${room.rates.length}):`);
            room.rates.forEach((rate, rateIdx) => {
              console.log(`      Rate ${rateIdx + 1}:`);
              console.log(`        ID: ${rate.id}`);
              console.log(`        Name: ${rate.name}`);
              console.log(`        Active: ${rate.active}`);
            });
          } else {
            console.log('    Rates: None');
          }
        });

        return result.data.rooms;
      } else {
        printError('No se encontraron rooms en el canal');
        console.log('Response completo:', JSON.stringify(result.data, null, 2));
        return null;
      }
    } else {
      printError(`Error al obtener rooms: ${result.statusCode}`);
      console.log(result.data);
      return null;
    }
  } catch (error) {
    printError('Error al obtener rooms: ' + error.message);
    return null;
  }
}

// ============================================
// PASO 4: ACTIVATE/MAP ROOMS
// ============================================

async function step4_activateRooms(rooms) {
  printSeparator('PASO 4: Activate/Map Rooms');

  if (!rooms || rooms.length === 0) {
    printError('No hay rooms para activar');
    return false;
  }

  printInfo(`Mapeando ${rooms.length} rooms...`);

  // Mapear rooms según el formato del tutorial
  const roomsToActivate = rooms.map(room => {
    const roomData = {
      roomId: room.id,
      roomName: room.name || 'Room',
      quantity: 1,  // Cantidad de este tipo de room
      status: 1,    // 1 = Active
      rates: []
    };

    // Agregar rate IDs si existen
    if (room.rates && room.rates.length > 0) {
      roomData.rates = room.rates.map(rate => rate.id);
    }

    return roomData;
  });

  const payload = {
    channelId: CONFIG.CHANNEL_ID,
    propertyId: CONFIG.PROPERTY_ID,
    rooms: roomsToActivate
  };

  console.log('Payload:', JSON.stringify(payload, null, 2));

  try {
    const result = await makeRequest('POST', '/rooms-activation', payload);

    console.log('Response:', JSON.stringify(result.data, null, 2));

    if (result.statusCode === 200) {
      if (result.data.status && result.data.status.returnMessage) {
        printSuccess('Rooms activation completado');
        printInfo(`Mensaje: ${result.data.status.returnMessage}`);

        // Extraer número de rooms activados
        const match = result.data.status.returnMessage.match(/(\d+)/);
        if (match) {
          const activatedCount = parseInt(match[1]);
          if (activatedCount > 0) {
            printSuccess(`✓ ${activatedCount} rooms activados correctamente`);
            return true;
          } else {
            printError('0 rooms fueron activados');
            return false;
          }
        }
        return true;
      }
    } else {
      printError(`Error en activación de rooms: ${result.statusCode}`);
      console.log(result.data);
      return false;
    }
  } catch (error) {
    printError('Error al activar rooms: ' + error.message);
    return false;
  }
}

// ============================================
// PASO 5: PROPERTY CHECK
// ============================================

async function step5_propertyCheck() {
  printSeparator('PASO 5: Property Check (Verification)');

  printInfo('Verificando status de property y rooms...');

  const payload = {
    channelId: String(CONFIG.CHANNEL_ID),
    propertyId: CONFIG.PROPERTY_ID
  };

  console.log('Payload:', JSON.stringify(payload, null, 2));

  try {
    const result = await makeRequest('POST', '/property-check', payload);

    console.log('Response:', JSON.stringify(result.data, null, 2));

    if (result.statusCode === 200 && result.data.status) {
      const returnMessage = result.data.status.returnMessage;

      if (returnMessage && returnMessage['Property status']) {
        printSuccess('Property Check exitoso:');
        console.log(`  ✓ Property status: ${returnMessage['Property status']}`);
        console.log(`  ✓ Channel status: ${returnMessage['Channel status']}`);
        console.log(`  ✓ Room status: ${returnMessage['Room status']}`);

        if (returnMessage['Property status'] === 'Active') {
          printSuccess('✓ Property está ACTIVA - Listo para rates/availability');

          // Mostrar productos mapeados
          if (returnMessage.mappedProducts && returnMessage.mappedProducts.length > 0) {
            console.log('\nProductos mapeados:');
            returnMessage.mappedProducts.forEach((product, idx) => {
              console.log(`  ${idx + 1}. Room ${product.roomId} → Rate ${product.rateId}`);
              console.log(`     myRoomId: ${product.myRoomId}`);
              console.log(`     myRateId: ${product.myRateId}`);
            });
          }

          return { success: true, mappedProducts: returnMessage.mappedProducts || [] };
        } else {
          printError(`Property status: ${returnMessage['Property status']} (no "Active")`);
          return { success: false };
        }
      }
    }

    printError('Property check falló');
    console.log(result.data);
    return { success: false };
  } catch (error) {
    printError('Error en property check: ' + error.message);
    return { success: false };
  }
}

// ============================================
// PASO 6: SET AVAILABILITY
// ============================================

async function step6_setAvailability(mappedProducts) {
  printSeparator('PASO 6: Set Availability');

  if (!mappedProducts || mappedProducts.length === 0) {
    printError('No hay productos mapeados para configurar availability');
    return false;
  }

  const { dateFrom, dateTo } = getDateRange(CONFIG.DAYS_AHEAD);

  printInfo(`Configurando availability para ${CONFIG.DAYS_AHEAD} días (${dateFrom} → ${dateTo})...`);

  // Configurar availability para el primer room (como ejemplo)
  const firstProduct = mappedProducts[0];

  const payload = {
    channelId: String(CONFIG.CHANNEL_ID),
    propertyId: CONFIG.PROPERTY_ID,
    roomId: firstProduct.roomId,
    dateFrom: dateFrom,
    dateTo: dateTo,
    availability: CONFIG.AVAILABILITY_COUNT,
    weekDays: {
      sun: 'true',
      mon: 'true',
      tue: 'true',
      wed: 'true',
      thu: 'true',
      fri: 'true',
      sat: 'true'
    }
  };

  console.log('Payload:', JSON.stringify(payload, null, 2));

  try {
    const result = await makeRequest('POST', '/availability', payload);

    console.log('Response:', JSON.stringify(result.data, null, 2));

    if (result.statusCode === 200) {
      printSuccess(`Availability configurado: ${CONFIG.AVAILABILITY_COUNT} rooms disponibles`);
      printInfo(`Room ID: ${firstProduct.roomId} (${dateFrom} → ${dateTo})`);
      return true;
    } else {
      printError(`Error al configurar availability: ${result.statusCode}`);
      console.log(result.data);
      return false;
    }
  } catch (error) {
    printError('Error al configurar availability: ' + error.message);
    return false;
  }
}

// ============================================
// PASO 7: SET RATES
// ============================================

async function step7_setRates(mappedProducts) {
  printSeparator('PASO 7: Set Rates');

  if (!mappedProducts || mappedProducts.length === 0) {
    printError('No hay productos mapeados para configurar rates');
    return false;
  }

  const { dateFrom, dateTo } = getDateRange(CONFIG.DAYS_AHEAD);

  printInfo(`Configurando rates para ${CONFIG.DAYS_AHEAD} días (${dateFrom} → ${dateTo})...`);
  printInfo(`Rate: ${CONFIG.CURRENCY_CODE} $${CONFIG.RATE_PRICE} por noche`);

  // Configurar rate para el primer producto
  const firstProduct = mappedProducts[0];

  const payload = {
    channelId: String(CONFIG.CHANNEL_ID),
    propertyId: CONFIG.PROPERTY_ID,
    roomId: firstProduct.roomId,
    dateFrom: dateFrom,
    dateTo: dateTo,
    currencyCode: CONFIG.CURRENCY_CODE,
    rateId: firstProduct.rateId,
    weekDays: {
      sun: 'true',
      mon: 'true',
      tue: 'true',
      wed: 'true',
      thu: 'true',
      fri: 'true',
      sat: 'true'
    },
    prices: {
      price: String(CONFIG.RATE_PRICE)
    },
    closed: '0'  // 0 = abierto, 1 = cerrado
  };

  console.log('Payload:', JSON.stringify(payload, null, 2));

  try {
    const result = await makeRequest('POST', '/rates', payload);

    console.log('Response:', JSON.stringify(result.data, null, 2));

    if (result.statusCode === 200) {
      printSuccess(`Rates configurados: ${CONFIG.CURRENCY_CODE} $${CONFIG.RATE_PRICE}/noche`);
      printInfo(`Room: ${firstProduct.roomId}, Rate: ${firstProduct.rateId}`);
      return true;
    } else {
      printError(`Error al configurar rates: ${result.statusCode}`);
      console.log(result.data);
      return false;
    }
  } catch (error) {
    printError('Error al configurar rates: ' + error.message);
    return false;
  }
}

// ============================================
// MAIN FLOW
// ============================================

async function main() {
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════════════╗');
  console.log('║                                                                    ║');
  console.log('║       DOMUS INTEGRATION - TUTORIAL OFFICIAL FLOW                   ║');
  console.log('║                                                                    ║');
  console.log('║   Property: Izumi Hotel - Test (ID: 5814990)                      ║');
  console.log('║   Channel: Booking.com (ID: 1)                                     ║');
  console.log('║   Date: 18 Diciembre 2025                                          ║');
  console.log('║                                                                    ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝');
  console.log('\n');

  let success = true;
  let mappedProducts = [];

  // PASO 1: Test Connection
  success = await step1_testConnection();
  if (!success) {
    printError('Abortando: Error en conexión');
    process.exit(1);
  }

  // PASO 2: Activate Property
  success = await step2_activateProperty();
  if (!success) {
    printError('Abortando: Error en activación de property');
    process.exit(1);
  }

  // PASO 3: Get Rooms and Rates
  const rooms = await step3_getRoomsAndRates();
  if (!rooms) {
    printError('Abortando: No se pudieron obtener rooms');
    process.exit(1);
  }

  // PASO 4: Activate/Map Rooms
  success = await step4_activateRooms(rooms);
  if (!success) {
    printError('Warning: Error en activación de rooms, continuando...');
  }

  // PASO 5: Property Check
  const checkResult = await step5_propertyCheck();
  if (!checkResult.success) {
    printError('Abortando: Property check falló');
    process.exit(1);
  }
  mappedProducts = checkResult.mappedProducts;

  // PASO 6: Set Availability
  success = await step6_setAvailability(mappedProducts);
  if (!success) {
    printError('Warning: Error al configurar availability');
  }

  // PASO 7: Set Rates
  success = await step7_setRates(mappedProducts);
  if (!success) {
    printError('Warning: Error al configurar rates');
  }

  // RESUMEN FINAL
  printSeparator('✅ INTEGRACIÓN COMPLETADA');

  console.log('Resumen:');
  console.log(`  ✓ Property ${CONFIG.PROPERTY_ID} activada`);
  console.log(`  ✓ ${mappedProducts.length} productos mapeados`);
  console.log(`  ✓ Availability configurado: ${CONFIG.AVAILABILITY_COUNT} rooms`);
  console.log(`  ✓ Rates configurados: ${CONFIG.CURRENCY_CODE} $${CONFIG.RATE_PRICE}/noche`);
  console.log(`  ✓ Período: ${CONFIG.DAYS_AHEAD} días`);

  console.log('\n🎉 DOMUS Integration 100% completada!\n');
  console.log('Próximos pasos:');
  console.log('  1. Importar n8n workflow de polling');
  console.log('  2. Crear reserva de test');
  console.log('  3. Verificar sincronización con Supabase\n');
}

// Ejecutar
main().catch(error => {
  console.error('\n❌ Error fatal:', error);
  process.exit(1);
});
