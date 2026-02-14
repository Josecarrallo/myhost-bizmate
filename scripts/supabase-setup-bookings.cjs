/**
 * SUPABASE SETUP - Bookings Table for DOMUS Integration
 *
 * Verifica y prepara la estructura de la tabla bookings en Supabase
 * para recibir reservas de DOMUS Channel Manager
 *
 * Uso: node scripts/supabase-setup-bookings.cjs
 */

const https = require('https');

// ============================================
// CONFIGURACIÓN SUPABASE
// ============================================

const SUPABASE_CONFIG = {
  URL: 'https://jjpscimtxrudtepzwhag.supabase.co',
  // NOTA: Esta es la anon key (pública), segura para cliente
  ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0',
};

// ============================================
// ESTRUCTURA ESPERADA DE LA TABLA BOOKINGS
// ============================================

const EXPECTED_COLUMNS = [
  { name: 'id', type: 'uuid', nullable: false, default: 'gen_random_uuid()' },
  { name: 'reservation_id', type: 'text', nullable: false, description: 'DOMUS reservation ID' },
  { name: 'property_id', type: 'text', nullable: false },
  { name: 'room_id', type: 'text', nullable: true },
  { name: 'guest_name', type: 'text', nullable: false },
  { name: 'guest_email', type: 'text', nullable: true },
  { name: 'guest_phone', type: 'text', nullable: true },
  { name: 'check_in', type: 'date', nullable: false },
  { name: 'check_out', type: 'date', nullable: false },
  { name: 'adults', type: 'integer', nullable: false, default: 1 },
  { name: 'children', type: 'integer', nullable: false, default: 0 },
  { name: 'total_price', type: 'numeric', nullable: true },
  { name: 'currency_code', type: 'text', nullable: true, default: 'USD' },
  { name: 'status', type: 'text', nullable: false, default: 'confirmed' },
  { name: 'source', type: 'text', nullable: false, default: 'domus' },
  { name: 'channel_id', type: 'integer', nullable: true, description: 'DOMUS channel ID (1=Booking.com)' },
  { name: 'raw_data', type: 'jsonb', nullable: true, description: 'DOMUS raw JSON data' },
  { name: 'created_at', type: 'timestamptz', nullable: false, default: 'now()' },
  { name: 'updated_at', type: 'timestamptz', nullable: false, default: 'now()' },
];

// ============================================
// UTILIDADES
// ============================================

function makeSupabaseRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, SUPABASE_CONFIG.URL);

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'apikey': SUPABASE_CONFIG.ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_CONFIG.ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = body ? JSON.parse(body) : {};
          resolve({ statusCode: res.statusCode, data: response, headers: res.headers });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data: body, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

function printSeparator(title) {
  console.log('\n' + '='.repeat(70));
  console.log(`  ${title}`);
  console.log('='.repeat(70) + '\n');
}

function printSuccess(message) {
  console.log('✅', message);
}

function printError(message) {
  console.log('❌', message);
}

function printInfo(message) {
  console.log('ℹ️ ', message);
}

function printWarning(message) {
  console.log('⚠️ ', message);
}

// ============================================
// PASO 1: VERIFICAR CONEXIÓN SUPABASE
// ============================================

async function step1_verifyConnection() {
  printSeparator('PASO 1: Verificar Conexión Supabase');

  printInfo('Conectando a Supabase...');
  printInfo(`URL: ${SUPABASE_CONFIG.URL}`);

  try {
    // Intentar hacer una query simple
    const result = await makeSupabaseRequest('GET', '/rest/v1/');

    if (result.statusCode === 200 || result.statusCode === 404) {
      printSuccess('Conexión a Supabase exitosa');
      return true;
    } else {
      printError(`Error de conexión: ${result.statusCode}`);
      console.log('Response:', result.data);
      return false;
    }
  } catch (error) {
    printError('Error al conectar a Supabase: ' + error.message);
    return false;
  }
}

// ============================================
// PASO 2: VERIFICAR TABLA BOOKINGS EXISTE
// ============================================

async function step2_checkBookingsTable() {
  printSeparator('PASO 2: Verificar Tabla Bookings');

  printInfo('Verificando si tabla "bookings" existe...');

  try {
    const result = await makeSupabaseRequest('GET', '/rest/v1/bookings?limit=0');

    if (result.statusCode === 200) {
      printSuccess('Tabla "bookings" existe');
      return { exists: true };
    } else if (result.statusCode === 404 || (result.data && result.data.message && result.data.message.includes('relation "public.bookings" does not exist'))) {
      printWarning('Tabla "bookings" NO existe');
      return { exists: false };
    } else {
      printError(`Error al verificar tabla: ${result.statusCode}`);
      console.log('Response:', result.data);
      return { exists: false, error: true };
    }
  } catch (error) {
    printError('Error: ' + error.message);
    return { exists: false, error: true };
  }
}

// ============================================
// PASO 3: OBTENER ESTRUCTURA ACTUAL
// ============================================

async function step3_getCurrentStructure() {
  printSeparator('PASO 3: Obtener Estructura Actual');

  printInfo('Obteniendo columnas de tabla "bookings"...');

  try {
    // Intentar obtener 1 registro para ver estructura
    const result = await makeSupabaseRequest('GET', '/rest/v1/bookings?limit=1');

    if (result.statusCode === 200) {
      if (result.data && result.data.length > 0) {
        const columns = Object.keys(result.data[0]);
        printSuccess(`Encontradas ${columns.length} columnas:`);
        console.log('\nColumnas actuales:');
        columns.forEach((col, idx) => {
          console.log(`  ${idx + 1}. ${col}`);
        });
        return { columns, hasData: true };
      } else {
        printInfo('Tabla existe pero está vacía');
        printWarning('No se puede verificar estructura sin datos');
        return { columns: [], hasData: false };
      }
    } else {
      printError(`Error: ${result.statusCode}`);
      return { columns: [], hasData: false };
    }
  } catch (error) {
    printError('Error: ' + error.message);
    return { columns: [], hasData: false };
  }
}

// ============================================
// PASO 4: GENERAR SQL PARA CREAR/ACTUALIZAR
// ============================================

function step4_generateSQL(tableExists, currentColumns) {
  printSeparator('PASO 4: Generar SQL');

  const sql = [];

  if (!tableExists) {
    printInfo('Generando SQL para crear tabla "bookings"...');

    // CREATE TABLE
    const createTable = `
-- Crear tabla bookings para DOMUS integration
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id TEXT NOT NULL UNIQUE,
  property_id TEXT NOT NULL,
  room_id TEXT,
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  guest_phone TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  adults INTEGER NOT NULL DEFAULT 1,
  children INTEGER NOT NULL DEFAULT 0,
  total_price NUMERIC(10,2),
  currency_code TEXT DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'confirmed',
  source TEXT NOT NULL DEFAULT 'domus',
  channel_id INTEGER,
  raw_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comentarios
COMMENT ON TABLE public.bookings IS 'Reservas sincronizadas desde DOMUS Channel Manager';
COMMENT ON COLUMN public.bookings.reservation_id IS 'DOMUS reservation ID único';
COMMENT ON COLUMN public.bookings.channel_id IS 'DOMUS channel ID (1=Booking.com, 2=Expedia, 3=Airbnb)';
COMMENT ON COLUMN public.bookings.raw_data IS 'JSON completo de DOMUS para debugging';

-- Índices para performance
CREATE INDEX idx_bookings_reservation_id ON public.bookings(reservation_id);
CREATE INDEX idx_bookings_check_in ON public.bookings(check_in);
CREATE INDEX idx_bookings_check_out ON public.bookings(check_out);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_source ON public.bookings(source);
CREATE INDEX idx_bookings_created_at ON public.bookings(created_at);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) - Opcional
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Permitir lectura pública (ajustar según necesidad)
CREATE POLICY "Enable read access for all users" ON public.bookings
FOR SELECT USING (true);

-- Policy: Permitir insert solo para usuarios autenticados
CREATE POLICY "Enable insert for authenticated users only" ON public.bookings
FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Policy: Permitir update solo para usuarios autenticados
CREATE POLICY "Enable update for authenticated users only" ON public.bookings
FOR UPDATE USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
`;

    sql.push(createTable);
  } else {
    printInfo('Tabla existe. Verificando columnas faltantes...');

    // ALTER TABLE para agregar columnas faltantes
    const missingColumns = EXPECTED_COLUMNS.filter(
      expected => !currentColumns.includes(expected.name)
    );

    if (missingColumns.length > 0) {
      printWarning(`Faltan ${missingColumns.length} columnas:`);
      missingColumns.forEach(col => {
        console.log(`  - ${col.name} (${col.type})`);
      });

      const alterStatements = missingColumns.map(col => {
        let alterSQL = `ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}`;
        if (col.default) alterSQL += ` DEFAULT ${col.default}`;
        if (!col.nullable) alterSQL += ` NOT NULL`;
        alterSQL += ';';
        return alterSQL;
      }).join('\n');

      sql.push(`-- Agregar columnas faltantes\n${alterStatements}`);
    } else {
      printSuccess('Todas las columnas necesarias existen');
    }

    // Verificar índices (siempre crear, IF NOT EXISTS los protege)
    const indexSQL = `
-- Crear índices si no existen
CREATE INDEX IF NOT EXISTS idx_bookings_reservation_id ON public.bookings(reservation_id);
CREATE INDEX IF NOT EXISTS idx_bookings_check_in ON public.bookings(check_in);
CREATE INDEX IF NOT EXISTS idx_bookings_check_out ON public.bookings(check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_source ON public.bookings(source);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at);
`;
    sql.push(indexSQL);
  }

  return sql.join('\n\n');
}

// ============================================
// PASO 5: GUARDAR SQL Y QUERIES DE TESTING
// ============================================

async function step5_saveSQLFiles(sql) {
  printSeparator('PASO 5: Guardar SQL Files');

  const fs = require('fs');
  const path = require('path');

  // Crear directorio si no existe
  const sqlDir = path.join(__dirname, '..', 'supabase');
  if (!fs.existsSync(sqlDir)) {
    fs.mkdirSync(sqlDir, { recursive: true });
    printInfo(`Directorio creado: ${sqlDir}`);
  }

  // Guardar SQL de setup
  const setupFile = path.join(sqlDir, 'bookings-setup.sql');
  fs.writeFileSync(setupFile, sql);
  printSuccess(`SQL guardado: ${setupFile}`);

  // Crear queries de testing
  const testingQueries = `-- QUERIES DE TESTING PARA BOOKINGS

-- 1. Ver últimas 10 reservas
SELECT
  id,
  reservation_id,
  guest_name,
  check_in,
  check_out,
  total_price,
  currency_code,
  status,
  source,
  created_at
FROM bookings
ORDER BY created_at DESC
LIMIT 10;

-- 2. Ver solo reservas de DOMUS
SELECT * FROM bookings
WHERE source = 'domus'
ORDER BY created_at DESC;

-- 3. Ver reservas futuras (check-in pendiente)
SELECT
  reservation_id,
  guest_name,
  check_in,
  check_out,
  total_price || ' ' || currency_code as price,
  status
FROM bookings
WHERE check_in > CURRENT_DATE
ORDER BY check_in ASC;

-- 4. Ver reservas activas (huéspedes actuales)
SELECT * FROM bookings
WHERE check_in <= CURRENT_DATE
  AND check_out >= CURRENT_DATE
  AND status = 'confirmed';

-- 5. Estadísticas por mes
SELECT
  DATE_TRUNC('month', check_in) as month,
  COUNT(*) as total_bookings,
  SUM(total_price) as total_revenue,
  AVG(total_price) as avg_price
FROM bookings
WHERE source = 'domus'
GROUP BY month
ORDER BY month DESC;

-- 6. Estadísticas por canal (Booking.com, Expedia, etc.)
SELECT
  channel_id,
  CASE channel_id
    WHEN 1 THEN 'Booking.com'
    WHEN 2 THEN 'Expedia'
    WHEN 3 THEN 'Airbnb'
    ELSE 'Other'
  END as channel_name,
  COUNT(*) as bookings,
  SUM(total_price) as revenue
FROM bookings
WHERE source = 'domus'
GROUP BY channel_id
ORDER BY bookings DESC;

-- 7. Buscar por reservation ID
SELECT * FROM bookings
WHERE reservation_id = 'XXXXX';  -- Reemplazar XXXXX

-- 8. Ver JSON raw de una reserva
SELECT
  reservation_id,
  guest_name,
  raw_data
FROM bookings
WHERE reservation_id = 'XXXXX';  -- Reemplazar XXXXX

-- 9. Eliminar reserva de test (CUIDADO!)
-- DELETE FROM bookings WHERE reservation_id = 'TEST-XXXXX';

-- 10. Contar reservas por status
SELECT
  status,
  COUNT(*) as count
FROM bookings
GROUP BY status
ORDER BY count DESC;
`;

  const testingFile = path.join(sqlDir, 'bookings-queries.sql');
  fs.writeFileSync(testingFile, testingQueries);
  printSuccess(`Testing queries guardadas: ${testingFile}`);

  return { setupFile, testingFile };
}

// ============================================
// PASO 6: TESTING - INSERT DE PRUEBA
// ============================================

async function step6_testInsert() {
  printSeparator('PASO 6: Test Insert (Opcional)');

  printInfo('Insertando reserva de prueba...');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);

  const testBooking = {
    reservation_id: `TEST-${Date.now()}`,
    property_id: '5814990',
    room_id: '581499084',
    guest_name: 'Test Guest - Setup Script',
    guest_email: 'test@myhost-bizmate.com',
    guest_phone: '+1234567890',
    check_in: tomorrow.toISOString().split('T')[0],
    check_out: dayAfter.toISOString().split('T')[0],
    adults: 2,
    children: 0,
    total_price: 100.00,
    currency_code: 'USD',
    status: 'confirmed',
    source: 'test',
    channel_id: 1,
    raw_data: { test: true, script: 'supabase-setup-bookings.cjs' }
  };

  try {
    const result = await makeSupabaseRequest('POST', '/rest/v1/bookings', testBooking);

    if (result.statusCode === 201) {
      printSuccess('Reserva de prueba insertada correctamente');
      console.log('\nDatos insertados:');
      console.log(JSON.stringify(result.data, null, 2));
      return true;
    } else {
      printWarning('No se pudo insertar reserva de prueba');
      console.log('Status:', result.statusCode);
      console.log('Response:', result.data);
      return false;
    }
  } catch (error) {
    printWarning('Error al insertar: ' + error.message);
    return false;
  }
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════════════╗');
  console.log('║                                                                    ║');
  console.log('║         SUPABASE SETUP - Bookings Table for DOMUS                 ║');
  console.log('║                                                                    ║');
  console.log('║   Prepara estructura de base de datos para recibir reservas       ║');
  console.log('║                                                                    ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝');
  console.log('\n');

  // PASO 1: Verificar conexión
  const connected = await step1_verifyConnection();
  if (!connected) {
    printError('No se pudo conectar a Supabase. Verifica la configuración.');
    process.exit(1);
  }

  // PASO 2: Verificar tabla existe
  const tableCheck = await step2_checkBookingsTable();

  // PASO 3: Obtener estructura actual (si existe y tiene datos)
  let currentColumns = [];
  if (tableCheck.exists) {
    const structure = await step3_getCurrentStructure();
    currentColumns = structure.columns;
  }

  // PASO 4: Generar SQL
  const sql = step4_generateSQL(tableCheck.exists, currentColumns);

  // PASO 5: Guardar SQL files
  const files = await step5_saveSQLFiles(sql);

  // RESUMEN
  printSeparator('✅ SETUP COMPLETADO');

  console.log('Archivos creados:');
  console.log(`  📄 ${files.setupFile}`);
  console.log(`  📄 ${files.testingFile}`);

  console.log('\n📋 Próximos pasos:\n');

  if (!tableCheck.exists) {
    console.log('⚠️  LA TABLA NO EXISTE - Debes ejecutar el SQL:');
    console.log('\n1. Ir a Supabase Dashboard:');
    console.log('   https://supabase.com/dashboard/project/jjpscimtxrudtepzwhag');
    console.log('\n2. SQL Editor → New Query');
    console.log('\n3. Copiar y ejecutar el contenido de:');
    console.log(`   ${files.setupFile}`);
    console.log('\n4. Ejecutar este script de nuevo para verificar');
  } else {
    console.log('✅ Tabla "bookings" existe');

    if (currentColumns.length === 0) {
      console.log('\n⚠️  No hay datos para verificar estructura completa');
      console.log('Puedes ejecutar el SQL de todas formas para asegurar índices:');
      console.log(`   ${files.setupFile}`);
    }

    // PASO 6: Test insert (opcional)
    console.log('\n¿Quieres insertar una reserva de prueba? (Y/n)');
    console.log('(Por ahora, omitiendo test insert automático)');
    console.log('Para insertar manualmente, usa las queries de testing.\n');

    // Descomentar si quieres test insert automático:
    // await step6_testInsert();
  }

  console.log('\n📚 Queries de testing disponibles en:');
  console.log(`   ${files.testingFile}\n`);

  console.log('🎉 Setup de Supabase completado!\n');
}

main().catch(error => {
  console.error('\n❌ Error fatal:', error);
  process.exit(1);
});
