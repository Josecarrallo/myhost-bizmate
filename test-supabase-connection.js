// Script de prueba para verificar conexión y estado de Supabase
// NO MODIFICA NADA - Solo lectura

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jjpscimtxrudtepzwhag.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 INVESTIGACIÓN SUPABASE - SOLO LECTURA\n');
console.log('='.repeat(60));

async function investigateDatabase() {
  try {
    // 1. Verificar conexión
    console.log('\n📡 1. VERIFICANDO CONEXIÓN...');
    const { data: healthCheck, error: healthError } = await supabase
      .from('properties')
      .select('count')
      .limit(0);

    if (healthError) {
      console.log('❌ Error de conexión:', healthError.message);
      return;
    }
    console.log('✅ Conexión exitosa');

    // 2. Contar registros en cada tabla
    console.log('\n📊 2. CONTEO DE REGISTROS...');

    const tables = ['properties', 'bookings', 'payments', 'messages', 'users'];
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`   ⚠️  ${table}: No accesible (${error.message})`);
      } else {
        console.log(`   ✅ ${table}: ${count} registros`);
      }
    }

    // 3. Ver estructura de properties (primeros 3 registros)
    console.log('\n🏠 3. MUESTRA DE PROPERTIES...');
    const { data: props, error: propsError } = await supabase
      .from('properties')
      .select('*')
      .limit(3);

    if (propsError) {
      console.log('❌ Error:', propsError.message);
    } else if (props && props.length > 0) {
      console.log(`   Encontrados: ${props.length} properties`);
      console.log('   Columnas:', Object.keys(props[0]).join(', '));
      console.log('\n   Ejemplo:');
      console.log('   -', props[0].name);
      console.log('   -', props[0].location);
      console.log('   - Precio:', props[0].base_price, props[0].currency);
    } else {
      console.log('   ℹ️  Tabla vacía');
    }

    // 4. Ver estructura de bookings
    console.log('\n📅 4. MUESTRA DE BOOKINGS...');
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .limit(3);

    if (bookingsError) {
      console.log('❌ Error:', bookingsError.message);
    } else if (bookings && bookings.length > 0) {
      console.log(`   Encontrados: ${bookings.length} bookings`);
      console.log('   Columnas:', Object.keys(bookings[0]).join(', '));
      console.log('\n   Ejemplo:');
      console.log('   - Guest:', bookings[0].guest_name);
      console.log('   - Check-in:', bookings[0].check_in);
      console.log('   - Status:', bookings[0].status);
    } else {
      console.log('   ℹ️  Tabla vacía');
    }

    // 5. Verificar funciones SQL
    console.log('\n⚙️  5. VERIFICANDO FUNCIONES SQL...');

    // Intentar llamar get_dashboard_stats()
    const { data: stats, error: statsError } = await supabase
      .rpc('get_dashboard_stats');

    if (statsError) {
      console.log('   ❌ get_dashboard_stats(): NO instalada');
      console.log('   Razón:', statsError.message);
    } else {
      console.log('   ✅ get_dashboard_stats(): INSTALADA');
      console.log('   Resultado:', stats);
    }

    // 6. Ver usuarios (tabla users)
    console.log('\n👤 6. USUARIOS REGISTRADOS...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, full_name, email, created_at')
      .limit(5);

    if (usersError) {
      console.log('   ⚠️  No se puede acceder a users:', usersError.message);
    } else if (users && users.length > 0) {
      console.log(`   Encontrados: ${users.length} usuarios`);
      users.forEach(u => {
        console.log(`   - ${u.email} (${u.full_name || 'Sin nombre'})`);
      });
    } else {
      console.log('   ℹ️  Tabla vacía');
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ INVESTIGACIÓN COMPLETADA\n');

  } catch (error) {
    console.error('\n❌ ERROR GENERAL:', error);
  }
}

// Ejecutar investigación
investigateDatabase();
