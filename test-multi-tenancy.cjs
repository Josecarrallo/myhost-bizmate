/**
 * MULTI-TENANCY ISOLATION TEST SUITE
 *
 * Ejecutar ANTES de commit cuando se modifique:
 * - src/services/data.js
 * - Cualquier código de filtrado por tenant/property
 * - Queries a bookings, villas, properties
 *
 * ÉXITO = Todos los tests pasan ✅
 * FALLO = NO HACER COMMIT - multi-tenancy está roto ❌
 */

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jjpscimtxrudtepzwhag.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjk0MzIzMiwiZXhwIjoyMDc4NTE5MjMyfQ.RBD16xjgQB__nj5DtLrK2w55uQ4WFJiaa0mfZT2BeJg',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// CONFIGURACIÓN CONOCIDA DEL SISTEMA
const CONFIG = {
  GITA: {
    tenant_id: '1f32d384-4018-46a9-a6f9-058217e6924a',
    property_id: '3551cd18-af6b-48c2-85ba-4c5dc0074892',
    email: 'gitaum88@gmail.com',
    expected_villas: 3,
    currency: 'IDR',
    villa_names: ['Nismara 1BR Villa', 'Graha Uma 1 Bedroom Pool Villa', 'NISMARA 2 BEDROOM POOL VILLA']
  },
  JOSE: {
    tenant_id: 'c24393db-d318-4d75-8bbf-0fa240b9c1db',
    property_id: '18711359-1378-4d12-9ea6-fb31c0b1bac2',
    email: 'josecarrallodelafuente@gmail.com',
    expected_villas: 5,
    currency: 'USD',
    villa_names: ['5BR Grand Villa', '5BR Villa', 'Blossom Villa', 'Sky Villa', 'Tropical Room']
  }
};

let testsPassed = 0;
let testsFailed = 0;

function logTest(testName, passed, details = '') {
  if (passed) {
    console.log(`  ✅ ${testName}`);
    if (details) console.log(`     ${details}`);
    testsPassed++;
  } else {
    console.log(`  ❌ ${testName}`);
    if (details) console.log(`     ${details}`);
    testsFailed++;
  }
}

async function testVillaIsolation() {
  console.log('\n📋 TEST 1: VILLA ISOLATION');
  console.log('=' .repeat(80));

  // Test Gita's villas
  const { data: gitaBookings } = await supabase
    .from('bookings')
    .select('property_id')
    .eq('tenant_id', CONFIG.GITA.tenant_id)
    .limit(1);

  const gitaPropertyIds = gitaBookings?.length > 0
    ? [...new Set(gitaBookings.map(b => b.property_id))]
    : [];

  const { data: gitaVillas } = await supabase
    .from('villas')
    .select('*')
    .in('property_id', gitaPropertyIds)
    .eq('status', 'active');

  logTest(
    'Gita ve exactamente 3 villas',
    gitaVillas?.length === CONFIG.GITA.expected_villas,
    `Encontradas: ${gitaVillas?.length || 0}`
  );

  logTest(
    'Todas las villas de Gita son IDR',
    gitaVillas?.every(v => v.currency === CONFIG.GITA.currency),
    gitaVillas?.filter(v => v.currency !== 'IDR').map(v => `${v.name} = ${v.currency}`).join(', ') || 'OK'
  );

  // Test Jose's villas
  const { data: joseBookings } = await supabase
    .from('bookings')
    .select('property_id')
    .eq('tenant_id', CONFIG.JOSE.tenant_id)
    .limit(1);

  const josePropertyIds = joseBookings?.length > 0
    ? [...new Set(joseBookings.map(b => b.property_id))]
    : [];

  const { data: joseVillas } = await supabase
    .from('villas')
    .select('*')
    .in('property_id', josePropertyIds)
    .eq('status', 'active');

  logTest(
    'Jose ve exactamente 5 villas',
    joseVillas?.length === CONFIG.JOSE.expected_villas,
    `Encontradas: ${joseVillas?.length || 0}`
  );

  logTest(
    'Todas las villas de Jose son USD',
    joseVillas?.every(v => v.currency === CONFIG.JOSE.currency),
    joseVillas?.filter(v => v.currency !== 'USD').map(v => `${v.name} = ${v.currency}`).join(', ') || 'OK'
  );

  // Cross-contamination test
  const gitaVillaIds = gitaVillas?.map(v => v.id) || [];
  const joseVillaIds = joseVillas?.map(v => v.id) || [];
  const overlap = gitaVillaIds.filter(id => joseVillaIds.includes(id));

  logTest(
    'NO hay villas compartidas entre Gita y Jose',
    overlap.length === 0,
    overlap.length > 0 ? `CRÍTICO: ${overlap.length} villas compartidas!` : 'Sin contaminación'
  );
}

async function testBookingIsolation() {
  console.log('\n📅 TEST 2: BOOKING ISOLATION');
  console.log('=' .repeat(80));

  // Test Gita's bookings
  const { data: gitaBookings } = await supabase
    .from('bookings')
    .select('id, guest_name, property_id')
    .eq('tenant_id', CONFIG.GITA.tenant_id);

  logTest(
    'Gita tiene bookings en el sistema',
    gitaBookings && gitaBookings.length > 0,
    `Total: ${gitaBookings?.length || 0}`
  );

  const gitaBookingsCorrectProperty = gitaBookings?.every(
    b => b.property_id === CONFIG.GITA.property_id
  );

  logTest(
    'Todos los bookings de Gita tienen su property_id correcto',
    gitaBookingsCorrectProperty,
    gitaBookingsCorrectProperty ? 'OK' : '⚠️ Hay bookings con property_id incorrecto'
  );

  // Test Jose's bookings
  const { data: joseBookings } = await supabase
    .from('bookings')
    .select('id, guest_name, property_id')
    .eq('tenant_id', CONFIG.JOSE.tenant_id);

  logTest(
    'Jose tiene bookings en el sistema',
    joseBookings && joseBookings.length > 0,
    `Total: ${joseBookings?.length || 0}`
  );

  const joseBookingsCorrectProperty = joseBookings?.every(
    b => b.property_id === CONFIG.JOSE.property_id
  );

  logTest(
    'Todos los bookings de Jose tienen su property_id correcto',
    joseBookingsCorrectProperty,
    joseBookingsCorrectProperty ? 'OK' : '⚠️ Hay bookings con property_id incorrecto'
  );

  // Cross-contamination test
  const gitaBookingIds = gitaBookings?.map(b => b.id) || [];
  const joseBookingIds = joseBookings?.map(b => b.id) || [];
  const overlapBookings = gitaBookingIds.filter(id => joseBookingIds.includes(id));

  logTest(
    'NO hay bookings compartidos entre Gita y Jose',
    overlapBookings.length === 0,
    overlapBookings.length > 0 ? `CRÍTICO: ${overlapBookings.length} bookings compartidos!` : 'Sin contaminación'
  );
}

async function testPropertyOwnership() {
  console.log('\n🏠 TEST 3: PROPERTY OWNERSHIP');
  console.log('=' .repeat(80));

  // Test Gita's property
  const { data: gitaProperty } = await supabase
    .from('properties')
    .select('*')
    .eq('id', CONFIG.GITA.property_id)
    .single();

  logTest(
    'Property de Gita existe y tiene owner_id correcto',
    gitaProperty?.owner_id === CONFIG.GITA.tenant_id,
    `Owner: ${gitaProperty?.owner_id === CONFIG.GITA.tenant_id ? 'Gita' : '⚠️ INCORRECTO'}`
  );

  // Test Jose's property
  const { data: joseProperty } = await supabase
    .from('properties')
    .select('*')
    .eq('id', CONFIG.JOSE.property_id)
    .single();

  logTest(
    'Property de Jose existe y tiene owner_id correcto',
    joseProperty?.owner_id === CONFIG.JOSE.tenant_id,
    `Owner: ${joseProperty?.owner_id === CONFIG.JOSE.tenant_id ? 'Jose' : '⚠️ INCORRECTO'}`
  );
}

async function testDataConsistency() {
  console.log('\n🔍 TEST 4: DATA CONSISTENCY');
  console.log('=' .repeat(80));

  // Get all villas
  const { data: allVillas } = await supabase
    .from('villas')
    .select('*')
    .eq('status', 'active');

  logTest(
    'Total de villas activas es 8 (3 Gita + 5 Jose)',
    allVillas?.length === 8,
    `Encontradas: ${allVillas?.length || 0}`
  );

  const villasWithProperty = allVillas?.filter(v => v.property_id) || [];

  logTest(
    'TODAS las villas tienen property_id asignado',
    villasWithProperty.length === allVillas?.length,
    `Con property_id: ${villasWithProperty.length}/${allVillas?.length || 0}`
  );

  // Verify property_id distribution
  const gitaVillasCount = allVillas?.filter(v => v.property_id === CONFIG.GITA.property_id).length || 0;
  const joseVillasCount = allVillas?.filter(v => v.property_id === CONFIG.JOSE.property_id).length || 0;

  logTest(
    'Distribución correcta: 3 villas → Gita, 5 villas → Jose',
    gitaVillasCount === 3 && joseVillasCount === 5,
    `Gita: ${gitaVillasCount}, Jose: ${joseVillasCount}`
  );

  // Currency consistency
  const idrVillas = allVillas?.filter(v => v.currency === 'IDR') || [];
  const usdVillas = allVillas?.filter(v => v.currency === 'USD') || [];

  logTest(
    'Consistencia de moneda: 3 IDR (Gita), 5 USD (Jose)',
    idrVillas.length === 3 && usdVillas.length === 5,
    `IDR: ${idrVillas.length}, USD: ${usdVillas.length}`
  );
}

async function runAllTests() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════════════╗');
  console.log('║                   MULTI-TENANCY ISOLATION TEST SUITE                      ║');
  console.log('║                           MYHOST BIZMATE                                  ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════╝');

  console.log('\n⚠️  IMPORTANTE: Estos tests verifican que:');
  console.log('   1. Gita solo ve sus 3 villas (IDR)');
  console.log('   2. Jose solo ve sus 5 villas (USD)');
  console.log('   3. NO hay contaminación de datos entre tenants');
  console.log('   4. Los property_ids están correctamente asignados\n');

  await testVillaIsolation();
  await testBookingIsolation();
  await testPropertyOwnership();
  await testDataConsistency();

  // Final summary
  console.log('\n' + '═'.repeat(80));
  console.log('\n📊 RESUMEN FINAL:\n');
  console.log(`   ✅ Tests Pasados: ${testsPassed}`);
  console.log(`   ❌ Tests Fallidos: ${testsFailed}`);
  console.log(`   📈 Total Tests: ${testsPassed + testsFailed}\n`);

  if (testsFailed === 0) {
    console.log('╔═══════════════════════════════════════════════════════════════════════════╗');
    console.log('║                         ✅ TODOS LOS TESTS PASARON                        ║');
    console.log('║                                                                           ║');
    console.log('║                  SEGURO PARA COMMIT - Multi-tenancy OK                    ║');
    console.log('╚═══════════════════════════════════════════════════════════════════════════╝\n');
    process.exit(0);
  } else {
    console.log('╔═══════════════════════════════════════════════════════════════════════════╗');
    console.log('║                      ❌ HAY TESTS FALLIDOS                                ║');
    console.log('║                                                                           ║');
    console.log('║              ⚠️  NO HACER COMMIT - Multi-tenancy ROTO ⚠️                  ║');
    console.log('║                                                                           ║');
    console.log('║  Revisa los errores arriba antes de modificar código de producción       ║');
    console.log('╚═══════════════════════════════════════════════════════════════════════════╝\n');
    process.exit(1);
  }
}

// Run tests
runAllTests().catch((error) => {
  console.error('\n❌ ERROR CRÍTICO EN TESTS:', error);
  process.exit(1);
});
