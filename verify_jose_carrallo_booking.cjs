const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jjpscimtxrudtepzwhag.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjk0MzIzMiwiZXhwIjoyMDc4NTE5MjMyfQ.RBD16xjgQB__nj5DtLrK2w55uQ4WFJiaa0mfZT2BeJg'
);

const GITA_TENANT_ID = '1f32d384-4018-46a9-a6f9-058217e6924a';
const GITA_PROPERTY_ID = '3551cd18-af6b-48c2-85ba-4c5dc0074892';

async function verifyJoseCarralloBooking() {
  console.log('\n🔍 BUSCANDO BOOKING DE JOSE CARRALLO...\n');

  // Buscar bookings recientes de Jose Carrallo
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('tenant_id', GITA_TENANT_ID)
    .ilike('guest_name', '%jose%carrallo%')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log('═'.repeat(80));
  console.log(`BOOKINGS ENCONTRADOS: ${bookings.length}`);
  console.log('═'.repeat(80));

  if (bookings.length === 0) {
    console.log('\n❌ No se encontró ningún booking de Jose Carrallo');
    console.log('⚠️  Revisa:');
    console.log('   - ¿El nombre del guest es exactamente "JOSE CARRALLO"?');
    console.log('   - ¿El tenant_id se guardó correctamente?');
    console.log('   - ¿Hubo algún error al crear el booking?');
  } else {
    bookings.forEach((booking, idx) => {
      console.log(`\n${idx + 1}. BOOKING CREADO:`);
      console.log('═'.repeat(80));
      console.log('ID:', booking.id);
      console.log('Guest Name:', booking.guest_name);
      console.log('Guest Email:', booking.guest_email);
      console.log('Guest Phone:', booking.guest_phone);
      console.log('Check-in:', booking.check_in);
      console.log('Check-out:', booking.check_out);
      console.log('Nights:', booking.nights);
      console.log('Guests:', booking.guests);
      console.log('Total Amount:', booking.total_amount, booking.currency || 'IDR');
      console.log('Villa ID:', booking.villa_id);
      console.log('Property ID:', booking.property_id);
      console.log('Tenant ID:', booking.tenant_id);
      console.log('Status:', booking.status);
      console.log('Payment Status:', booking.payment_status);
      console.log('Source:', booking.source);
      console.log('Created At:', booking.created_at);

      // Verificar si los datos están completos
      const missing = [];
      if (!booking.guest_name) missing.push('guest_name');
      if (!booking.check_in) missing.push('check_in');
      if (!booking.check_out) missing.push('check_out');
      if (!booking.total_amount) missing.push('total_amount');
      if (!booking.villa_id) missing.push('villa_id');
      if (!booking.property_id) missing.push('property_id');
      if (!booking.tenant_id) missing.push('tenant_id');

      console.log('\n✅ VALIDACIÓN:');
      if (missing.length === 0) {
        console.log('   ✅ Todos los campos obligatorios están completos');
      } else {
        console.log('   ⚠️  Campos faltantes:', missing.join(', '));
      }

      // Validar IDs correctos
      if (booking.tenant_id === GITA_TENANT_ID) {
        console.log('   ✅ Tenant ID correcto (Gita)');
      } else {
        console.log('   ❌ Tenant ID incorrecto:', booking.tenant_id);
      }

      if (booking.property_id === GITA_PROPERTY_ID) {
        console.log('   ✅ Property ID correcto (Nismara)');
      } else {
        console.log('   ❌ Property ID incorrecto:', booking.property_id);
      }
    });
  }

  console.log('\n═'.repeat(80));
  console.log('');
}

verifyJoseCarralloBooking().catch(console.error);
