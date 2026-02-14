// Script para obtener el schema REAL de Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jjpscimtxrudtepzwhag.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 OBTENIENDO SCHEMA REAL DE SUPABASE\n');

async function getActualSchema() {
  try {
    // Query para obtener columnas de cada tabla
    const query = `
      SELECT
        table_name,
        column_name,
        data_type,
        is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name IN ('properties', 'bookings', 'payments', 'messages', 'users')
      ORDER BY table_name, ordinal_position;
    `;

    const { data, error } = await supabase.rpc('exec_sql', { query });

    if (error) {
      console.log('❌ No se puede usar rpc. Intentando método alternativo...\n');

      // Método alternativo: Hacer select y ver las columnas del resultado
      const tables = ['properties', 'bookings', 'payments', 'messages', 'users'];

      for (const table of tables) {
        console.log(`\n📋 Tabla: ${table}`);
        console.log('='.repeat(60));

        const { data: rows, error: selectError } = await supabase
          .from(table)
          .select('*')
          .limit(1);

        if (selectError) {
          console.log(`   ❌ Error: ${selectError.message}`);
        } else if (rows && rows.length > 0) {
          const columns = Object.keys(rows[0]);
          console.log(`   Columnas (${columns.length}):`);
          columns.forEach((col, i) => {
            console.log(`   ${i + 1}. ${col}`);
          });
        } else {
          console.log('   ℹ️  Tabla vacía - probando con insert dummy...');

          // Para tablas vacías, necesitamos otra estrategia
          console.log('   📌 Columnas esperadas (según error):');
          if (table === 'properties') {
            console.log('   - Tiene: owner_id (NO user_id)');
          }
        }
      }
    } else {
      console.log('Schema obtenido:', data);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

getActualSchema();
