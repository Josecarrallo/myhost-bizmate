const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jjpscimtxrudtepzwhag.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjk0MzIzMiwiZXhwIjoyMDc4NTE5MjMyfQ.RBD16xjgQB__nj5DtLrK2w55uQ4WFJiaa0mfZT2BeJg'
);

async function checkBookingsColumns() {
  console.log('\n🔍 VERIFICANDO COLUMNAS DE LA TABLA BOOKINGS...\n');

  // Obtener un booking de ejemplo para ver sus columnas
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .limit(1);

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  if (bookings.length > 0) {
    console.log('✅ COLUMNAS DISPONIBLES EN BOOKINGS:\n');
    const columns = Object.keys(bookings[0]);
    columns.forEach(col => {
      console.log(`   - ${col}`);
    });

    // Verificar específicamente total_amount y total_price
    console.log('\n🔍 VERIFICACIÓN ESPECÍFICA:');
    console.log('   total_amount existe?', columns.includes('total_amount') ? '✅ SÍ' : '❌ NO');
    console.log('   total_price existe?', columns.includes('total_price') ? '✅ SÍ' : '❌ NO');
  } else {
    console.log('❌ No hay bookings en la tabla');
  }

  console.log('\n' + '═'.repeat(80) + '\n');
}

checkBookingsColumns().catch(console.error);
