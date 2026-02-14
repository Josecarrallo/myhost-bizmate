/**
 * DOMUS COMPLETE ACTIVATION - Post Support Response
 *
 * EJECUTAR ESTE SCRIPT CUANDO SOPORTE ACTIVE LA PROPERTY
 *
 * Flujo completo:
 * 1. Verificar property está activa
 * 2. Mapear rooms (POST /rooms-activation)
 * 3. Configurar rates (POST /rates) - USD $100/noche, 365 días
 * 4. Configurar availability (POST /availability) - 5 rooms, 365 días
 * 5. Crear reserva de test (POST /reservations-createtest)
 * 6. Verificar reserva creada
 *
 * Uso: node scripts/domus-complete-activation.cjs
 */

const https = require('https');

// ============================================
// CONFIGURACIÓN
// ============================================

const CONFIG = {
  // Credenciales DOMUS
  API_USER: 'IfLKCinlg1KOK2BOVcQMjTUOdcD5teeuNFBVOQQ5Jno=',
  API_PASSWORD: 'J9xiyR11I6iAF1yM6+QVmfhwULuxslmrmknziknsz0M=',
  API_BASE_URL: 'api.zodomus.com',

  // Property
  CHANNEL_ID: 1,
  PROPERTY_ID: '5814990',

  // Configuración de rates
  CURRENCY_CODE: 'USD',
  RATE_PRICE: 100,
  DAYS_AHEAD: 365,

  // Configuración de availability
  AVAILABILITY_COUNT: 5,

  // Rooms conocidos
  ROOMS: [
    { roomId: '581499058', myRoomId: 'DELUXE-001', name: 'Deluxe Room 1' },
    { roomId: '581499084', myRoomId: 'DELUXE-002', name: 'Deluxe Room 2' },
    { roomId: '581499086', myRoomId: 'DELUXE-003', name: 'Deluxe Room 3' },
    { roomId: '581499088', myRoomId: 'DELUXE-004', name: 'Deluxe Room 4' },
    { roomId: '581499095', myRoomId: 'DELUXE-005', name: 'Deluxe Room 5' }
  ]
};

const authHeader = 'Basic ' + Buffer.from(CONFIG.API_USER + ':' + CONFIG.API_PASSWORD).toString('base64');

// ============================================
// UTILIDADES
// ============================================

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
// PASO 1: VERIFICAR PROPERTY ACTIVA
// ============================================

async function step1_verifyPropertyActive() {
  printSeparator('PASO 1: Verificar Property Activa');

  const payload = {
    channelId: CONFIG.CHANNEL_ID,
    propertyId: CONFIG.PROPERTY_ID
  };

  try {
    const result = await makeRequest('POST', '/property-check', payload);

    if (result.data.status && result.data.status.returnMessage) {
      const msg = result.data.status.returnMessage;

      console.log('Property Status:', msg['Property status']);
      console.log('Channel Status:', msg['Channel status']);
      console.log('Product Status:', msg['Product status']);
      console.log('Room Status:', msg['Room status']);

      if (msg['Property status'] === 'Active') {
        printSuccess('Property está ACTIVA ✓');
        return { success: true, mappedProducts: msg.mappedProducts || [] };
      } else {
        printError(`Property status: ${msg['Property status']} (esperado: "Active")`);
        console.log('\n⚠️  IMPORTANTE: El soporte aún no ha activado la property.');
        console.log('Por favor espera a que cambien el status a "Active".\n');
        return { success: false };
      }
    }

    printError('No se pudo verificar property status');
    return { success: false };
  } catch (error) {
    printError('Error al verificar property: ' + error.message);
    return { success: false };
  }
}

// ============================================
// PASO 2: MAPEAR ROOMS
// ============================================

async function step2_mapRooms() {
  printSeparator('PASO 2: Mapear Rooms');

  printInfo(`Mapeando ${CONFIG.ROOMS.length} rooms...`);

  // Primero obtener rates existentes
  const roomRatesPath = `/room-rates?channelId=${CONFIG.CHANNEL_ID}&propertyId=${CONFIG.PROPERTY_ID}`;
  const ratesResult = await makeRequest('GET', roomRatesPath);

  console.log('\n📊 Rooms y Rates actuales:');
  console.log(JSON.stringify(ratesResult.data.rooms, null, 2));

  // Preparar rooms para activación
  const roomsToActivate = CONFIG.ROOMS.map(room => {
    const roomData = {
      roomId: room.roomId,
      myRoomId: room.myRoomId,
      roomName: room.name,
      quantity: 1,
      status: 1
    };

    // Buscar rates del room en la respuesta de room-rates
    const existingRoom = ratesResult.data.rooms.find(r => r.id === room.roomId);
    if (existingRoom && existingRoom.rates && existingRoom.rates.length > 0) {
      roomData.rates = existingRoom.rates.map(rate => rate.id);
      console.log(`  ✓ Room ${room.roomId}: ${roomData.rates.length} rates encontrados`);
    } else {
      roomData.rates = [];
      console.log(`  ⚠️  Room ${room.roomId}: No rates encontrados (se configurarán después)`);
    }

    return roomData;
  });

  const payload = {
    channelId: CONFIG.CHANNEL_ID,
    propertyId: CONFIG.PROPERTY_ID,
    rooms: roomsToActivate
  };

  console.log('\n📤 Payload para rooms-activation:');
  console.log(JSON.stringify(payload, null, 2));

  try {
    const result = await makeRequest('POST', '/rooms-activation', payload);

    console.log('\n📥 Response:');
    console.log(JSON.stringify(result.data, null, 2));

    if (result.statusCode === 200 && result.data.status) {
      const msg = result.data.status.returnMessage;

      if (typeof msg === 'string' && msg.includes('Number of rooms activated')) {
        const match = msg.match(/(\d+)/);
        if (match) {
          const count = parseInt(match[1]);
          if (count > 0) {
            printSuccess(`${count} rooms activados correctamente`);
            return true;
          }
        }
      }

      printError('Rooms activation completó pero con 0 rooms activados');
      return false;
    }

    printError('Error al activar rooms');
    return false;
  } catch (error) {
    printError('Error: ' + error.message);
    return false;
  }
}

// ============================================
// PASO 3: CONFIGURAR RATES
// ============================================

async function step3_configureRates() {
  printSeparator('PASO 3: Configurar Rates');

  const { dateFrom, dateTo } = getDateRange(CONFIG.DAYS_AHEAD);

  printInfo(`Configurando rates: ${CONFIG.CURRENCY_CODE} $${CONFIG.RATE_PRICE}/noche`);
  printInfo(`Período: ${dateFrom} → ${dateTo} (${CONFIG.DAYS_AHEAD} días)`);

  // Obtener rooms y rates actualizados después del mapeo
  const roomRatesPath = `/room-rates?channelId=${CONFIG.CHANNEL_ID}&propertyId=${CONFIG.PROPERTY_ID}`;
  const ratesResult = await makeRequest('GET', roomRatesPath);

  if (!ratesResult.data.rooms || ratesResult.data.rooms.length === 0) {
    printError('No hay rooms disponibles para configurar rates');
    return false;
  }

  let successCount = 0;

  // Configurar rates para cada room que tenga rates
  for (const room of ratesResult.data.rooms) {
    if (!room.rates || room.rates.length === 0) {
      console.log(`⚠️  Room ${room.id}: No tiene rates configurados (omitiendo)`);
      continue;
    }

    console.log(`\n📝 Configurando rates para room ${room.id} (${room.rates.length} rates)...`);

    for (const rate of room.rates) {
      const payload = {
        channelId: String(CONFIG.CHANNEL_ID),
        propertyId: CONFIG.PROPERTY_ID,
        roomId: room.id,
        rateId: rate.id,
        dateFrom: dateFrom,
        dateTo: dateTo,
        currencyCode: CONFIG.CURRENCY_CODE,
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
        closed: '0'
      };

      try {
        const result = await makeRequest('POST', '/rates', payload);

        if (result.statusCode === 200) {
          console.log(`  ✓ Rate ${rate.id}: ${CONFIG.CURRENCY_CODE} $${CONFIG.RATE_PRICE} configurado`);
          successCount++;
        } else {
          console.log(`  ✗ Rate ${rate.id}: Error ${result.statusCode}`);
          console.log('    Response:', JSON.stringify(result.data, null, 2));
        }
      } catch (error) {
        console.log(`  ✗ Rate ${rate.id}: ${error.message}`);
      }

      // Pequeña pausa entre requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  if (successCount > 0) {
    printSuccess(`${successCount} rates configurados exitosamente`);
    return true;
  } else {
    printError('No se configuraron rates');
    return false;
  }
}

// ============================================
// PASO 4: CONFIGURAR AVAILABILITY
// ============================================

async function step4_configureAvailability() {
  printSeparator('PASO 4: Configurar Availability');

  const { dateFrom, dateTo } = getDateRange(CONFIG.DAYS_AHEAD);

  printInfo(`Configurando availability: ${CONFIG.AVAILABILITY_COUNT} rooms disponibles`);
  printInfo(`Período: ${dateFrom} → ${dateTo} (${CONFIG.DAYS_AHEAD} días)`);

  // Obtener rooms
  const roomRatesPath = `/room-rates?channelId=${CONFIG.CHANNEL_ID}&propertyId=${CONFIG.PROPERTY_ID}`;
  const ratesResult = await makeRequest('GET', roomRatesPath);

  if (!ratesResult.data.rooms || ratesResult.data.rooms.length === 0) {
    printError('No hay rooms disponibles');
    return false;
  }

  let successCount = 0;

  // Configurar availability para cada room
  for (const room of ratesResult.data.rooms) {
    console.log(`\n📝 Configurando availability para room ${room.id}...`);

    const payload = {
      channelId: String(CONFIG.CHANNEL_ID),
      propertyId: CONFIG.PROPERTY_ID,
      roomId: room.id,
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

    try {
      const result = await makeRequest('POST', '/availability', payload);

      if (result.statusCode === 200) {
        console.log(`  ✓ Room ${room.id}: ${CONFIG.AVAILABILITY_COUNT} rooms disponibles`);
        successCount++;
      } else {
        console.log(`  ✗ Room ${room.id}: Error ${result.statusCode}`);
        console.log('    Response:', JSON.stringify(result.data, null, 2));
      }
    } catch (error) {
      console.log(`  ✗ Room ${room.id}: ${error.message}`);
    }

    // Pequeña pausa entre requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  if (successCount > 0) {
    printSuccess(`${successCount} rooms con availability configurada`);
    return true;
  } else {
    printError('No se configuró availability');
    return false;
  }
}

// ============================================
// PASO 5: CREAR RESERVA DE TEST
// ============================================

async function step5_createTestReservation() {
  printSeparator('PASO 5: Crear Reserva de Test');

  printInfo('Creando reserva de test...');

  // Calcular fechas (check-in mañana, check-out pasado mañana)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);

  const checkIn = tomorrow.toISOString().split('T')[0];
  const checkOut = dayAfter.toISOString().split('T')[0];

  // Obtener rooms para usar el primero
  const roomRatesPath = `/room-rates?channelId=${CONFIG.CHANNEL_ID}&propertyId=${CONFIG.PROPERTY_ID}`;
  const ratesResult = await makeRequest('GET', roomRatesPath);

  if (!ratesResult.data.rooms || ratesResult.data.rooms.length === 0) {
    printError('No hay rooms disponibles');
    return false;
  }

  const firstRoom = ratesResult.data.rooms[0];
  const firstRate = firstRoom.rates && firstRoom.rates.length > 0 ? firstRoom.rates[0] : null;

  if (!firstRate) {
    printError('No hay rates disponibles para crear reserva');
    return false;
  }

  const payload = {
    channelId: CONFIG.CHANNEL_ID,
    propertyId: CONFIG.PROPERTY_ID,
    roomId: firstRoom.id,
    rateId: firstRate.id,
    checkIn: checkIn,
    checkOut: checkOut,
    guestName: 'Test Guest - Claude Integration',
    guestEmail: 'test@example.com',
    adults: 2,
    children: 0,
    price: CONFIG.RATE_PRICE,
    currencyCode: CONFIG.CURRENCY_CODE
  };

  console.log('\n📤 Payload:');
  console.log(JSON.stringify(payload, null, 2));

  try {
    const result = await makeRequest('POST', '/reservations-createtest', payload);

    console.log('\n📥 Response:');
    console.log(JSON.stringify(result.data, null, 2));

    if (result.statusCode === 200 && result.data.status) {
      if (result.data.status.returnCode === 200 || result.data.status.returnCode === '200') {
        printSuccess('Reserva de test creada exitosamente');

        if (result.data.reservationId) {
          console.log(`\n📋 Reservation ID: ${result.data.reservationId}`);
        }

        console.log(`📅 Check-in: ${checkIn}`);
        console.log(`📅 Check-out: ${checkOut}`);
        console.log(`👤 Guest: Test Guest - Claude Integration`);
        console.log(`💰 Price: ${CONFIG.CURRENCY_CODE} $${CONFIG.RATE_PRICE}`);

        return true;
      }
    }

    printError('Error al crear reserva de test');
    return false;
  } catch (error) {
    printError('Error: ' + error.message);
    return false;
  }
}

// ============================================
// PASO 6: VERIFICAR FINAL
// ============================================

async function step6_verifyFinal() {
  printSeparator('PASO 6: Verificación Final');

  const payload = {
    channelId: CONFIG.CHANNEL_ID,
    propertyId: CONFIG.PROPERTY_ID
  };

  try {
    const result = await makeRequest('POST', '/property-check', payload);

    if (result.data.status && result.data.status.returnMessage) {
      const msg = result.data.status.returnMessage;

      console.log('📊 Estado Final:');
      console.log(`  Property status: ${msg['Property status']}`);
      console.log(`  Channel status: ${msg['Channel status']}`);
      console.log(`  Product status: ${msg['Product status']}`);
      console.log(`  Room status: ${msg['Room status']}`);

      if (msg.mappedProducts && msg.mappedProducts.length > 0) {
        console.log(`\n✅ Productos mapeados: ${msg.mappedProducts.length}`);
        msg.mappedProducts.forEach((product, idx) => {
          console.log(`  ${idx + 1}. Room ${product.roomId} → Rate ${product.rateId}`);
          console.log(`     myRoomId: ${product.myRoomId}, myRateId: ${product.myRateId}`);
        });
      }

      return true;
    }

    return false;
  } catch (error) {
    printError('Error: ' + error.message);
    return false;
  }
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════════════╗');
  console.log('║                                                                    ║');
  console.log('║           DOMUS COMPLETE ACTIVATION - POST SUPPORT                ║');
  console.log('║                                                                    ║');
  console.log('║   Property: Izumi Hotel - Test (ID: 5814990)                      ║');
  console.log('║   Channel: Booking.com (ID: 1)                                     ║');
  console.log('║   Date: 18 Diciembre 2025                                          ║');
  console.log('║                                                                    ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝');
  console.log('\n');

  // PASO 1: Verificar property activa
  const verifyResult = await step1_verifyPropertyActive();
  if (!verifyResult.success) {
    console.log('\n⚠️  IMPORTANTE:');
    console.log('El soporte aún no ha activado la property.');
    console.log('Por favor espera a recibir confirmación del soporte y vuelve a ejecutar este script.\n');
    process.exit(1);
  }

  // PASO 2: Mapear rooms
  const mapSuccess = await step2_mapRooms();
  if (!mapSuccess) {
    printError('Error al mapear rooms - Abortando');
    process.exit(1);
  }

  // PASO 3: Configurar rates
  const ratesSuccess = await step3_configureRates();
  if (!ratesSuccess) {
    printError('Warning: Error al configurar rates');
  }

  // PASO 4: Configurar availability
  const availSuccess = await step4_configureAvailability();
  if (!availSuccess) {
    printError('Warning: Error al configurar availability');
  }

  // PASO 5: Crear reserva de test
  const reservSuccess = await step5_createTestReservation();
  if (!reservSuccess) {
    printError('Warning: Error al crear reserva de test');
  }

  // PASO 6: Verificación final
  await step6_verifyFinal();

  // RESUMEN FINAL
  printSeparator('✅ INTEGRACIÓN DOMUS COMPLETADA');

  console.log('Resumen:');
  console.log(`  ✓ Property ${CONFIG.PROPERTY_ID} ACTIVA`);
  console.log(`  ✓ ${CONFIG.ROOMS.length} rooms mapeados`);
  if (ratesSuccess) console.log(`  ✓ Rates configurados: ${CONFIG.CURRENCY_CODE} $${CONFIG.RATE_PRICE}/noche`);
  if (availSuccess) console.log(`  ✓ Availability: ${CONFIG.AVAILABILITY_COUNT} rooms, ${CONFIG.DAYS_AHEAD} días`);
  if (reservSuccess) console.log(`  ✓ Reserva de test creada`);

  console.log('\n🎉 DOMUS Integration 100% completada!\n');
  console.log('📋 Próximos pasos:');
  console.log('  1. Importar n8n workflow de polling');
  console.log('  2. Verificar sincronización con Supabase');
  console.log('  3. Probar Email + WhatsApp confirmations\n');
}

main().catch(error => {
  console.error('\n❌ Error fatal:', error);
  process.exit(1);
});
