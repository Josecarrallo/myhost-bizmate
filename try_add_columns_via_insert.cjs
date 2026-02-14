const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jjpscimtxrudtepzwhag.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0'
);

const GITA_PROPERTY_ID = '3551cd18-af6b-48c2-85ba-4c5dc0074892';

(async () => {
  console.log('=== INTENTANDO ACTUALIZAR VILLAS ===\n');
  console.log('Este script intentará actualizar las villas directamente.');
  console.log('Si las columnas no existen, mostrará un error y necesitarás ejecutar el SQL manualmente.\n');

  // Get all Gita's villas first
  const { data: villas, error: getError } = await supabase
    .from('villas')
    .select('*')
    .eq('property_id', GITA_PROPERTY_ID);

  if (getError) {
    console.error('Error obteniendo villas:', getError.message);
    process.exit(1);
  }

  console.log(`Encontradas ${villas.length} villas de Gita:\n`);
  villas.forEach(v => console.log(`  - ${v.name} (${v.bedrooms}BR)`));

  // Try to update first villa to test if columns exist
  console.log('\n=== PROBANDO SI LAS COLUMNAS EXISTEN ===\n');

  const { data: testData, error: testError } = await supabase
    .from('villas')
    .update({
      location: 'Ubud, Bali',
      property_type: 'Test Villa',
      address: 'Test Address'
    })
    .eq('name', 'Nismara 2BR Villa')
    .eq('property_id', GITA_PROPERTY_ID)
    .select();

  if (testError) {
    console.error('❌ ERROR: Las columnas NO EXISTEN en la tabla villas');
    console.error(`Mensaje: ${testError.message}`);
    console.error(`\n🔧 SOLUCIÓN: Necesitas ejecutar este SQL en Supabase SQL Editor:\n`);
    console.error(`ALTER TABLE villas`);
    console.error(`ADD COLUMN IF NOT EXISTS location TEXT,`);
    console.error(`ADD COLUMN IF NOT EXISTS property_type TEXT,`);
    console.error(`ADD COLUMN IF NOT EXISTS address TEXT;`);
    console.error(`\n📍 Ve a: https://supabase.com/dashboard/project/jjpscimtxrudtepzwhag/sql/new`);
    console.error(`\nDespués ejecuta de nuevo: node update_villas_simple.cjs\n`);
    process.exit(1);
  }

  console.log('✅ Las columnas EXISTEN! Procediendo con las actualizaciones...\n');

  // Update all villas
  const updates = [
    {
      name: 'Nismara 2BR Villa',
      location: 'Ubud, Bali',
      property_type: 'Luxury Two Bedroom Pool Villa',
      address: 'Jalan Raya Sanggingan, Ubud, Gianyar, Bali'
    },
    {
      name: 'Graha Uma 1BR Villa',
      location: 'Ubud, Bali',
      property_type: 'Deluxe One Bedroom Villa',
      address: 'Jalan Raya Sanggingan, Ubud, Gianyar, Bali'
    },
    {
      name: 'Nismara 1BR Villa (Monthly)',
      location: 'Ubud, Bali',
      property_type: 'One Bedroom Villa - Long Stay',
      address: 'Jalan Raya Sanggingan, Ubud, Gianyar, Bali'
    }
  ];

  for (const update of updates) {
    console.log(`Actualizando: ${update.name}...`);

    const { data, error } = await supabase
      .from('villas')
      .update({
        location: update.location,
        property_type: update.property_type,
        address: update.address
      })
      .eq('property_id', GITA_PROPERTY_ID)
      .eq('name', update.name)
      .select();

    if (error) {
      console.error(`  ❌ Error: ${error.message}`);
    } else if (data && data.length > 0) {
      console.log(`  ✅ Actualizado`);
    } else {
      console.log(`  ⚠️  No encontrado`);
    }
  }

  // Verify
  console.log('\n=== VERIFICACIÓN FINAL ===\n');
  const { data: updated, error: verifyError } = await supabase
    .from('villas')
    .select('name, location, property_type, address, bedrooms')
    .eq('property_id', GITA_PROPERTY_ID);

  if (verifyError) {
    console.error('Error:', verifyError.message);
  } else {
    updated.forEach(v => {
      console.log(`📍 ${v.name} (${v.bedrooms}BR)`);
      console.log(`   Location: ${v.location}`);
      console.log(`   Type: ${v.property_type}`);
      console.log(`   Address: ${v.address}\n`);
    });
  }

  console.log('✅ COMPLETADO!\n');
})();
