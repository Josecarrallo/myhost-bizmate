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

async function restoreTenantIds() {
  console.log('\n🚨 RESTAURANDO TENANT_IDS - CRÍTICO\n');
  console.log('=' .repeat(80));

  const GITA_TENANT_ID = '1f32d384-4018-46a9-a6f9-058217e6924a';
  const JOSE_TENANT_ID = 'c24393db-d318-4d75-8bbf-0fa240b9c1db';
  const GITA_PROPERTY_ID = '3551cd18-af6b-48c2-85ba-4c5dc0074892';
  const JOSE_PROPERTY_ID = '18711359-1378-4d12-9ea6-fb31c0b1bac2';

  console.log('Gita tenant_id:', GITA_TENANT_ID);
  console.log('Jose tenant_id:', JOSE_TENANT_ID);
  console.log();

  // Gita's 3 villas (IDR)
  const gitaVillaIds = [
    'b1000001-0001-4001-8001-000000000001', // Nismara 1BR Villa
    'b2000002-0002-4002-8002-000000000002', // Graha Uma 1 Bedroom Pool Villa
    'b3000003-0003-4003-8003-000000000003'  // NISMARA 2 BEDROOM POOL VILLA
  ];

  // Jose's 5 villas (USD)
  const joseVillaIds = [
    'b4000004-0004-4004-8004-000000000004', // 5BR Grand Villa
    'b5000005-0005-4005-8005-000000000005', // 5BR Villa
    'b6000006-0006-4006-8006-000000000006', // Blossom Villa
    'b7000007-0007-4007-8007-000000000007', // Sky Villa
    'b8000008-0008-4008-8008-000000000008'  // Tropical Room
  ];

  console.log('PASO 1: Asignando tenant_id y property_id a villas de Gita (3 villas IDR)\n');

  for (const villaId of gitaVillaIds) {
    const { data, error } = await supabase
      .from('villas')
      .update({
        tenant_id: GITA_TENANT_ID,
        property_id: GITA_PROPERTY_ID
      })
      .eq('id', villaId)
      .select('name, currency');

    if (error) {
      console.error(`❌ Error actualizando ${villaId}:`, error.message);
    } else {
      console.log(`✅ ${data[0]?.name || villaId} → Gita (${data[0]?.currency})`);
    }
  }

  console.log('\nPASO 2: Asignando tenant_id y property_id a villas de Jose (5 villas USD)\n');

  for (const villaId of joseVillaIds) {
    const { data, error } = await supabase
      .from('villas')
      .update({
        tenant_id: JOSE_TENANT_ID,
        property_id: JOSE_PROPERTY_ID
      })
      .eq('id', villaId)
      .select('name, currency');

    if (error) {
      console.error(`❌ Error actualizando ${villaId}:`, error.message);
    } else {
      console.log(`✅ ${data[0]?.name || villaId} → Jose (${data[0]?.currency})`);
    }
  }

  console.log('\n' + '=' .repeat(80));
  console.log('\n🔍 VERIFICACIÓN FINAL:\n');

  // Verify Gita's villas
  const { data: gitaVillas } = await supabase
    .from('villas')
    .select('*')
    .eq('tenant_id', GITA_TENANT_ID)
    .order('name');

  console.log(`Villas de Gita (tenant_id: ${GITA_TENANT_ID}):`);
  console.log(`Total: ${gitaVillas?.length || 0}\n`);
  gitaVillas?.forEach(v => {
    console.log(`  ✅ ${v.name}`);
    console.log(`     Currency: ${v.currency} | Property ID: ${v.property_id}`);
  });

  // Verify Jose's villas
  const { data: joseVillas } = await supabase
    .from('villas')
    .select('*')
    .eq('tenant_id', JOSE_TENANT_ID)
    .order('name');

  console.log(`\nVillas de Jose (tenant_id: ${JOSE_TENANT_ID}):`);
  console.log(`Total: ${joseVillas?.length || 0}\n`);
  joseVillas?.forEach(v => {
    console.log(`  ✅ ${v.name}`);
    console.log(`     Currency: ${v.currency} | Property ID: ${v.property_id}`);
  });

  // Check for villas with undefined tenant_id
  const { data: orphanVillas } = await supabase
    .from('villas')
    .select('*')
    .is('tenant_id', null);

  console.log('\n' + '=' .repeat(80));
  console.log('\n📊 RESUMEN:\n');
  console.log(`  ✅ Villas de Gita: ${gitaVillas?.length || 0} (esperado: 3)`);
  console.log(`  ✅ Villas de Jose: ${joseVillas?.length || 0} (esperado: 5)`);
  console.log(`  ⚠️ Villas huérfanas: ${orphanVillas?.length || 0} (esperado: 0)\n`);

  if (gitaVillas?.length === 3 && joseVillas?.length === 5 && orphanVillas?.length === 0) {
    console.log('✅✅✅ TENANT ISOLATION RESTAURADO CORRECTAMENTE ✅✅✅\n');
    console.log('Jose ahora verá solo sus 5 villas (USD)');
    console.log('Gita ahora verá solo sus 3 villas (IDR)\n');
  } else {
    console.log('⚠️ Aún hay problemas - revisar manualmente\n');
  }
}

restoreTenantIds().catch(console.error);
