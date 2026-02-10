const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  'https://jjpscimtxrudtepzwhag.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjk0MzIzMiwiZXhwIjoyMDc4NTE5MjMyfQ.RBD16xjgQB__nj5DtLrK2w55uQ4WFJiaa0mfZT2BeJg'
);

async function exportAllData() {
  console.log('\n📦 EXPORTANDO TODOS LOS DATOS DE SUPABASE...\n');

  const tables = ['users', 'properties', 'bookings', 'clients', 'payments', 'leads', 'whatsapp_config'];
  const allData = {};

  for (const table of tables) {
    console.log(`Exportando tabla: ${table}...`);
    const { data, error } = await supabase.from(table).select('*');

    if (error) {
      console.error(`  ❌ Error en ${table}:`, error.message);
      allData[table] = { error: error.message, count: 0 };
    } else {
      console.log(`  ✅ ${data.length} registros`);
      allData[table] = { count: data.length, data: data };
    }
  }

  // Save to JSON
  const filePath = path.join(__dirname, 'supabase_data_backup_10feb2026.json');
  fs.writeFileSync(filePath, JSON.stringify(allData, null, 2));

  console.log('\n═'.repeat(80));
  console.log('✅ BACKUP COMPLETADO');
  console.log('Archivo:', filePath);
  console.log('═'.repeat(80));

  // Summary
  console.log('\nRESUMEN:');
  for (const [table, info] of Object.entries(allData)) {
    console.log(`  ${table}: ${info.count} registros`);
  }
  console.log('\n');
}

exportAllData().catch(console.error);
