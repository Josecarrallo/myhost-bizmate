#!/usr/bin/env node

/**
 * MIGRATION RUNNER
 * Ejecuta MIGRATION_001_MULTIVILLA_REPORTS.sql en Supabase
 */

const fs = require('fs');
const path = require('path');

// Configuración Supabase
const SUPABASE_URL = 'https://jjpscimtxrudtepzwhag.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0';

// Leer SERVICE_ROLE_KEY de variable de entorno o argumento de línea de comandos
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.argv[2];

async function runMigration() {
  console.log('🚀 MYHOST BizMate - Migration Runner');
  console.log('=====================================\n');

  // 1. Leer archivo de migración
  const migrationPath = path.join(__dirname, 'MYHOST Bizmate_Documentos_Estrategicos 2025_2026', 'MIGRATION_001_MULTIVILLA_REPORTS.sql');

  console.log(`📄 Leyendo migración: ${migrationPath}`);

  if (!fs.existsSync(migrationPath)) {
    console.error('❌ Error: Archivo de migración no encontrado');
    console.error(`   Ruta esperada: ${migrationPath}`);
    process.exit(1);
  }

  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
  console.log(`✅ Migración leída (${migrationSQL.length} caracteres)\n`);

  // 2. Verificar SERVICE_ROLE_KEY
  if (!SUPABASE_SERVICE_KEY) {
    console.log('⚠️  SERVICE_ROLE_KEY no encontrada');
    console.log('');
    console.log('Para ejecutar la migración automáticamente, necesitas:');
    console.log('');
    console.log('1. Ir a: https://supabase.com/dashboard/project/jjpscimtxrudtepzwhag/settings/api');
    console.log('2. Copiar "service_role" secret (⚠️ SOLO PARA DESARROLLO)');
    console.log('3. Ejecutar:');
    console.log('');
    console.log('   set SUPABASE_SERVICE_ROLE_KEY=<tu_service_key>');
    console.log('   node run-migration.cjs');
    console.log('');
    console.log('─────────────────────────────────────────────');
    console.log('');
    console.log('📋 ALTERNATIVA: Ejecuta manualmente en Supabase SQL Editor');
    console.log('');
    console.log('1. Abre: https://supabase.com/dashboard/project/jjpscimtxrudtepzwhag/sql/new');
    console.log('2. Copia TODO el contenido del archivo:');
    console.log(`   ${migrationPath}`);
    console.log('3. Pégalo en el SQL Editor');
    console.log('4. Haz clic en "Run"');
    console.log('5. Verifica el mensaje: "MIGRATION 001 COMPLETED SUCCESSFULLY!"');
    console.log('');
    process.exit(0);
  }

  // 3. Ejecutar migración usando la REST API de Supabase
  console.log('🔧 Ejecutando migración en Supabase...\n');

  try {
    // Intentar ejecutar el SQL completo
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: migrationSQL })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Error ejecutando migración:', error);
      console.log('');
      console.log('💡 Intenta ejecutar manualmente en Supabase SQL Editor:');
      console.log('   https://supabase.com/dashboard/project/jjpscimtxrudtepzwhag/sql/new');
      process.exit(1);
    }

    const result = await response.json();
    console.log('✅ Migración ejecutada exitosamente!');
    console.log('');
    console.log('📊 Resultado:');
    console.log(JSON.stringify(result, null, 2));
    console.log('');
    console.log('🎉 ¡Listo! Ahora puedes usar Business Reports en OSIRIS');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('');
    console.log('💡 Ejecuta manualmente en Supabase SQL Editor:');
    console.log('   https://supabase.com/dashboard/project/jjpscimtxrudtepzwhag/sql/new');
    process.exit(1);
  }
}

// Ejecutar
runMigration().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
