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

async function debugTenantVillas() {
  console.log('\n🔍 VERIFICANDO TENANT ISOLATION EN VILLAS:\n');

  const GITA_TENANT_ID = '1f32d384-4018-46a9-a6f9-058217e6924a';
  const JOSE_TENANT_ID = 'c24393db-d318-4d75-8bbf-0fa240b9c1db';

  // Get ALL villas
  const { data: allVillas, error } = await supabase
    .from('villas')
    .select('*')
    .order('name');

  if (error) {
    console.log('❌ Error:', error);
    return;
  }

  console.log(`Total villas en la base de datos: ${allVillas?.length || 0}\n`);

  // Group by tenant
  const gitaVillas = allVillas.filter(v => v.tenant_id === GITA_TENANT_ID);
  const joseVillas = allVillas.filter(v => v.tenant_id === JOSE_TENANT_ID);
  const otherVillas = allVillas.filter(v => v.tenant_id !== GITA_TENANT_ID && v.tenant_id !== JOSE_TENANT_ID);

  console.log('=' .repeat(80));
  console.log('\n🏠 VILLAS DE GITA (tenant_id: 1f32d384-4018-46a9-a6f9-058217e6924a):\n');
  console.log(`Total: ${gitaVillas.length}\n`);
  gitaVillas.forEach(v => {
    console.log(`  ✅ ${v.name}`);
    console.log(`     ID: ${v.id}`);
    console.log(`     Property ID: ${v.property_id || 'N/A'}`);
    console.log(`     Status: ${v.status}`);
    console.log(`     Created: ${v.created_at}\n`);
  });

  console.log('=' .repeat(80));
  console.log('\n🏨 VILLAS DE JOSE/IZUMI (tenant_id: c24393db-d318-4d75-8bbf-0fa240b9c1db):\n');
  console.log(`Total: ${joseVillas.length}\n`);
  if (joseVillas.length === 0) {
    console.log('  ⚠️ NO HAY VILLAS ASIGNADAS A JOSE\n');
  } else {
    joseVillas.forEach(v => {
      console.log(`  ✅ ${v.name}`);
      console.log(`     ID: ${v.id}`);
      console.log(`     Property ID: ${v.property_id || 'N/A'}`);
      console.log(`     Status: ${v.status}`);
      console.log(`     Created: ${v.created_at}\n`);
    });
  }

  if (otherVillas.length > 0) {
    console.log('=' .repeat(80));
    console.log('\n⚠️ VILLAS CON OTROS TENANT_ID:\n');
    console.log(`Total: ${otherVillas.length}\n`);
    otherVillas.forEach(v => {
      console.log(`  ⚠️ ${v.name}`);
      console.log(`     Tenant ID: ${v.tenant_id}`);
      console.log(`     Villa ID: ${v.id}\n`);
    });
  }

  // Check properties table too
  console.log('=' .repeat(80));
  console.log('\n📋 VERIFICANDO TABLA PROPERTIES:\n');

  const { data: allProperties, error: propsError } = await supabase
    .from('properties')
    .select('*')
    .order('name');

  if (propsError) {
    console.log('❌ Error en properties:', propsError);
  } else {
    console.log(`Total properties: ${allProperties?.length || 0}\n`);

    const gitaProps = allProperties.filter(p => p.owner_id === GITA_TENANT_ID);
    const joseProps = allProperties.filter(p => p.owner_id === JOSE_TENANT_ID);

    console.log(`Gita properties: ${gitaProps.length}`);
    gitaProps.forEach(p => {
      console.log(`  ✅ ${p.name} (ID: ${p.id})`);
    });

    console.log(`\nJose properties: ${joseProps.length}`);
    if (joseProps.length === 0) {
      console.log('  ⚠️ NO HAY PROPERTIES ASIGNADAS A JOSE');
    } else {
      joseProps.forEach(p => {
        console.log(`  ✅ ${p.name} (ID: ${p.id})`);
      });
    }
  }

  // Summary
  console.log('\n' + '=' .repeat(80));
  console.log('\n📊 RESUMEN:\n');
  console.log(`  Villas de Gita: ${gitaVillas.length}`);
  console.log(`  Villas de Jose: ${joseVillas.length}`);
  console.log(`  Villas de otros: ${otherVillas.length}`);
  console.log(`  Total: ${allVillas.length}\n`);

  if (joseVillas.length === 0) {
    console.log('❌ PROBLEMA DETECTADO:');
    console.log('   Jose no tiene villas asignadas en la base de datos.');
    console.log('   Si Jose ve villas de Gita, es porque NO hay villas con su tenant_id.\n');
  }

  // Check unique tenant_ids
  const uniqueTenantIds = [...new Set(allVillas.map(v => v.tenant_id))];
  console.log(`🔑 Tenant IDs únicos en villas: ${uniqueTenantIds.length}`);
  uniqueTenantIds.forEach(id => {
    const count = allVillas.filter(v => v.tenant_id === id).length;
    const isGita = id === GITA_TENANT_ID;
    const isJose = id === JOSE_TENANT_ID;
    const label = isGita ? '(GITA)' : isJose ? '(JOSE)' : '(OTRO)';
    console.log(`   ${id} ${label}: ${count} villas`);
  });

  console.log('\n');
}

debugTenantVillas().catch(console.error);
