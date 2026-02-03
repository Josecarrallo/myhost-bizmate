#!/usr/bin/env node

/**
 * MIGRATION EXECUTOR
 * Ejecuta MIGRATION_001_MULTIVILLA_REPORTS.sql en Supabase
 * Usa la REST API directamente para ejecutar el SQL
 */

const fs = require('fs');
const path = require('path');

// Configuración
const SUPABASE_URL = 'https://jjpscimtxrudtepzwhag.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjk0MzIzMiwiZXhwIjoyMDc4NTE5MjMyfQ.RBD16xjgQB__nj5DtLrK2w55uQ4WFJiaa0mfZT2BeJg';

async function executeMigration() {
  console.log('🚀 MYHOST BizMate - Migration Executor');
  console.log('======================================\n');

  // 1. Leer archivo SQL
  const migrationPath = path.join(__dirname, 'MYHOST Bizmate_Documentos_Estrategicos 2025_2026', 'MIGRATION_001_MULTIVILLA_REPORTS.sql');

  console.log(`📄 Leyendo: ${path.basename(migrationPath)}`);

  if (!fs.existsSync(migrationPath)) {
    console.error('❌ Archivo no encontrado');
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationPath, 'utf8');
  console.log(`✅ SQL cargado (${sql.length} caracteres)\n`);

  // 2. Dividir en comandos individuales
  // El SQL tiene múltiples statements separados por ';'
  // Necesitamos ejecutarlos uno por uno usando la API de PostgreSQL directamente

  console.log('🔧 Ejecutando migración vía Supabase Management API...\n');

  try {
    // Usar la Database REST API de Supabase para ejecutar SQL
    // https://supabase.com/docs/reference/javascript/sql
    const { createClient } = require('@supabase/supabase-js');

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
      auth: {
        persistSession: false
      }
    });

    console.log('📡 Conectado a Supabase');
    console.log('🔄 Ejecutando SQL...\n');

    // Intentar ejecutar el SQL completo
    // Como el SQL tiene múltiples statements con BEGIN/COMMIT,
    // vamos a ejecutarlo como un solo bloque

    const { data, error } = await supabase.rpc('exec', { query: sql });

    if (error) {
      // Si exec no existe, intentar con una función personalizada
      console.log('⚠️  RPC "exec" no disponible, ejecutando via HTTP directo...\n');

      // Ejecutar via HTTP POST directo al endpoint de PostgreSQL
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/query`, {
        method: 'POST',
        headers: {
          'apikey': SERVICE_KEY,
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ query: sql })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Migración ejecutada!\n');
      console.log('📊 Resultado:', JSON.stringify(result, null, 2));

    } else {
      console.log('✅ Migración ejecutada exitosamente!');
      if (data) {
        console.log('📊 Resultado:', JSON.stringify(data, null, 2));
      }
    }

    console.log('\n🎉 ¡COMPLETADO! Ahora puedes usar Business Reports en OSIRIS');
    console.log('\n📋 Verifica en Supabase:');
    console.log('   - Tabla "generated_reports" creada ✓');
    console.log('   - Columnas añadidas a "properties" ✓');
    console.log('   - 4 funciones RPC creadas ✓');

  } catch (error) {
    console.error('\n❌ ERROR EJECUTANDO MIGRACIÓN:', error.message);
    console.log('\n💡 ALTERNATIVA: Ejecutar manualmente en Supabase SQL Editor');
    console.log('');
    console.log('1. Abrir: https://supabase.com/dashboard/project/jjpscimtxrudtepzwhag/sql/new');
    console.log('2. Copiar contenido de: MIGRATION_001_MULTIVILLA_REPORTS.sql');
    console.log('3. Pegar en SQL Editor');
    console.log('4. Click "Run"');
    console.log('5. Buscar mensaje: "MIGRATION 001 COMPLETED SUCCESSFULLY!"');
    process.exit(1);
  }
}

// Ejecutar
executeMigration().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
