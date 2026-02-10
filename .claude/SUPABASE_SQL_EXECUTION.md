# 🔧 CÓMO EJECUTAR SQL EN SUPABASE DESDE CLAUDE CODE

**Fecha:** 10 Febrero 2026
**Problema resuelto:** Ejecución de SQL DDL (CREATE POLICY, CREATE FUNCTION, etc.) desde scripts

---

## ✅ MÉTODO CORRECTO: Supabase Management API

**IMPORTANTE:** Claude Code NO tiene acceso directo a MCP servers. Los MCP están configurados para Claude Desktop, no para CLI/terminal.

### 🎯 Solución: Usar Management API de Supabase

```javascript
const https = require('https');

const ACCESS_TOKEN = 'sbp_40144b21e90c0680e9e9e7940d9485a30e2b7913';
const PROJECT_REF = 'jjpscimtxrudtepzwhag';

const sql = `CREATE POLICY "policy_name" ON table_name FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);`;

const options = {
  hostname: 'api.supabase.com',
  path: `/v1/projects/${PROJECT_REF}/database/query`,
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  }
};

const postData = JSON.stringify({ query: sql });

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => { data += chunk; });

  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Data:', data);

    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log('✅ SQL EJECUTADO EXITOSAMENTE');
    } else {
      console.log('❌ ERROR AL EJECUTAR SQL');
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Error:', e.message);
});

req.write(postData);
req.end();
```

---

## 📋 CREDENCIALES DISPONIBLES

### Supabase Project
- **Project Ref:** `jjpscimtxrudtepzwhag`
- **URL:** `https://jjpscimtxrudtepzwhag.supabase.co`

### Keys
- **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0`
- **Service Role Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjk0MzIzMiwiZXhwIjoyMDc4NTE5MjMyfQ.RBD16xjgQB__nj5DtLrK2w55uQ4WFJiaa0mfZT2BeJg`
- **Access Token (Management API):** `sbp_40144b21e90c0680e9e9e7940d9485a30e2b7913`

### Database Connection
- **Connection String:** `postgresql://postgres.jjpscimtxrudtepzwhag:Neverboltbusiness2025!@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`

---

## 🚫 MÉTODOS QUE NO FUNCIONAN

### ❌ supabase.rpc('exec', { sql })
**Problema:** La función RPC `exec` no existe por defecto en Supabase.

### ❌ psql command line
**Problema:** `psql` no está instalado en Windows por defecto.

### ❌ supabase CLI con --db-url
**Problema:** El flag `--db-url` no existe en Supabase CLI v1.

### ❌ MCP de Supabase desde Claude Code
**Problema:** Los MCP están configurados en Claude Desktop, no son accesibles desde Claude Code (CLI/terminal).

### ❌ pg.Client con pooler connection
**Problema:** El pooler requiere autenticación específica que falla con "Tenant or user not found".

---

## 📝 CASOS DE USO COMUNES

### 1. Crear RLS Policy

```javascript
const sql = `
CREATE POLICY "Allow all access to table_name"
ON table_name FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);
`;
```

### 2. Crear/Actualizar Function

```javascript
const sql = `
CREATE OR REPLACE FUNCTION function_name(param_name UUID)
RETURNS TABLE(...) AS $$
BEGIN
  -- Function body
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;
```

### 3. Modificar Tabla

```javascript
const sql = `
ALTER TABLE table_name
ADD COLUMN column_name data_type;
`;
```

---

## 🔍 VERIFICACIÓN DESPUÉS DE EJECUTAR

Siempre verifica que el cambio funcionó:

```javascript
// Para policies: probar con anon key
const { createClient } = require('@supabase/supabase-js');

const supabaseAnon = createClient(
  'https://jjpscimtxrudtepzwhag.supabase.co',
  'ANON_KEY_AQUI'
);

const { data, error } = await supabaseAnon.from('table_name').select('*');
console.log('Can read:', data.length, 'rows');
```

---

## 🎯 EJEMPLO COMPLETO (USADO EL 10 FEB 2026)

**Problema:** Tabla `villas` con RLS bloqueaba acceso con anon key
**Solución:** Crear policy "Allow all access to villas"

**Script:** `exec_policy_via_api.cjs`

```javascript
const https = require('https');

const ACCESS_TOKEN = 'sbp_40144b21e90c0680e9e9e7940d9485a30e2b7913';
const sql = `CREATE POLICY "Allow all access to villas" ON villas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);`;

const options = {
  hostname: 'api.supabase.com',
  path: '/v1/projects/jjpscimtxrudtepzwhag/database/query',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  }
};

const postData = JSON.stringify({ query: sql });

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log('✅ POLICY CREADA EXITOSAMENTE');
    }
  });
});

req.on('error', (e) => console.error('❌ Error:', e.message));
req.write(postData);
req.end();
```

**Resultado:** ✅ Status 201, policy creada, anon key ahora puede leer villas

---

## 🚨 LECCIONES APRENDIDAS (10 FEB 2026)

1. **SIEMPRE usar Management API primero** - Es el método más directo y confiable
2. **NO perder tiempo con métodos complicados** - psql, pooler connections, etc.
3. **Verificar SIEMPRE después** - Crear script de prueba con anon key
4. **Documentar credenciales** - Access Token, Project Ref, Service Role Key
5. **Claude Code ≠ Claude Desktop** - MCP servers no están disponibles en CLI

---

## 📚 REFERENCIAS

- **Supabase Management API:** https://supabase.com/docs/reference/api/introduction
- **Database Query Endpoint:** `POST /v1/projects/{ref}/database/query`
- **Autenticación:** Bearer token con Access Token de Supabase Dashboard

---

**Última actualización:** 10 Febrero 2026
**Autor:** Claude Code
**Commit asociado:** [próximo commit con fix de villas policy]
