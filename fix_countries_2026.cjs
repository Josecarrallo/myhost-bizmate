const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jjpscimtxrudtepzwhag.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0'
);

// Mapping from Excel: guest_name + check_in → guest_country
const countryMapping = [
  { name: 'Abhisek V Deshetty', checkIn: '2026-01-03', country: 'Indian' },
  { name: 'Morganne Le Saulnier', checkIn: '2026-01-06', country: 'France' },
  { name: 'Rahul Zar', checkIn: '2026-01-10', country: 'Indian' },
  { name: 'Ayu and Friends', checkIn: '2026-02-07', country: 'Indonesian' },
  { name: 'Chinese Name', checkIn: '2026-02-19', country: 'China' },
  { name: 'Nitin Kakkar', checkIn: '2026-03-17', country: 'Indian' },
  { name: 'Johana Catharina', checkIn: '2026-03-20', country: 'Germany' },
  { name: 'Tien Li Cheng', checkIn: '2026-04-03', country: 'Taiwan' },
  { name: 'Nicolas Moreau', checkIn: '2026-04-08', country: 'France' },
  { name: 'Gabriel Thomas', checkIn: '2026-04-25', country: 'Brazil' },
  { name: 'Nor Farah Ain Helmi', checkIn: '2026-05-02', country: 'Malaysian' },
  { name: 'Sara Palacious', checkIn: '2026-05-17', country: 'Spanish' },
  { name: 'Keyla Dasilva', checkIn: '2026-06-18', country: 'Brazil' },
  { name: 'Dimitrios Manousakis', checkIn: '2026-07-04', country: 'Yunani' },
  { name: 'P Yerramareddy', checkIn: '2026-07-10', country: 'Indian' },
  { name: 'Joppe Juindam', checkIn: '2026-07-19', country: 'Netherlands' },
  { name: 'Lusy Kershaw', checkIn: '2026-07-31', country: 'Australia' },
  { name: 'Charlotte Morrow', checkIn: '2026-08-02', country: 'United States' },
  { name: 'Ann Smith', checkIn: '2026-09-05', country: 'Canada' },
  { name: 'Ruby Zhou', checkIn: '2026-09-23', country: 'China' }
];

(async () => {
  console.log('=== ACTUALIZANDO COUNTRIES EN TODOS LOS BOOKINGS 2026 ===\n');

  let updatedCount = 0;
  let errorCount = 0;

  for (const mapping of countryMapping) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ guest_country: mapping.country })
        .eq('tenant_id', '1f32d384-4018-46a9-a6f9-058217e6924a')
        .eq('guest_name', mapping.name)
        .eq('check_in', mapping.checkIn)
        .select();

      if (error) {
        console.log(`❌ ERROR: ${mapping.name} (${mapping.checkIn})`);
        console.log(`   Error: ${error.message}`);
        errorCount++;
      } else if (data && data.length > 0) {
        console.log(`✅ ${mapping.name} → ${mapping.country}`);
        updatedCount++;
      } else {
        console.log(`⚠️  NO ENCONTRADO: ${mapping.name} (${mapping.checkIn})`);
        errorCount++;
      }
    } catch (err) {
      console.log(`❌ EXCEPTION: ${mapping.name}`);
      console.log(`   ${err.message}`);
      errorCount++;
    }
  }

  console.log(`\n=== RESUMEN ===`);
  console.log(`✅ Actualizados correctamente: ${updatedCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log(`📊 Total procesados: ${countryMapping.length}`);

  // Verify the updates
  console.log('\n=== VERIFICACIÓN ===');
  const { data: allBookings, error: verifyError } = await supabase
    .from('bookings')
    .select('guest_name, check_in, guest_country')
    .eq('tenant_id', '1f32d384-4018-46a9-a6f9-058217e6924a')
    .gte('check_in', '2026-01-01')
    .lte('check_in', '2026-12-31')
    .order('check_in', { ascending: true });

  if (verifyError) {
    console.log('Error en verificación:', verifyError);
  } else {
    const nullCountries = allBookings.filter(b =>
      !b.guest_country ||
      b.guest_country.toLowerCase() === 'null' ||
      b.guest_country.trim() === ''
    );

    const uniqueCountries = new Set();
    allBookings.forEach(b => {
      if (b.guest_country && b.guest_country.toLowerCase() !== 'null' && b.guest_country.trim() !== '') {
        uniqueCountries.add(b.guest_country);
      }
    });

    console.log(`\nBookings con country válido: ${allBookings.length - nullCountries.length}/${allBookings.length}`);
    console.log(`Bookings con country NULL: ${nullCountries.length}`);
    console.log(`Países únicos encontrados: ${uniqueCountries.size}`);
    console.log(`Países: ${Array.from(uniqueCountries).sort().join(', ')}`);
  }

  console.log('\n✅ Proceso completado');
})();
