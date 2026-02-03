# 🚀 INSTRUCCIONES: Ejecutar Migración en Supabase

## ⏱️ Tiempo estimado: 2 minutos

---

## 📋 PASO A PASO

### 1️⃣ Abrir SQL Editor de Supabase

Haz clic aquí → **https://supabase.com/dashboard/project/jjpscimtxrudtepzwhag/sql/new**

(Se abrirá el SQL Editor con una nueva query)

---

### 2️⃣ Copiar el archivo SQL

**Opción A - Automática (Recomendado):**

1. Abre el archivo: `MYHOST Bizmate_Documentos_Estrategicos 2025_2026\MIGRATION_001_MULTIVILLA_REPORTS.sql`
2. Seleccionar TODO (Ctrl+A)
3. Copiar (Ctrl+C)

**Opción B - Manual:**

```sql
-- Archivo: MIGRATION_001_MULTIVILLA_REPORTS.sql
-- Ubicación: MYHOST Bizmate_Documentos_Estrategicos 2025_2026/
```

---

### 3️⃣ Pegar en Supabase SQL Editor

1. En el SQL Editor que abriste en el paso 1
2. **Borrar** cualquier contenido que haya
3. **Pegar** (Ctrl+V) el contenido del archivo SQL
4. Deberías ver **487 líneas** de SQL

---

### 4️⃣ Ejecutar la migración

1. Hacer clic en el botón **"Run"** (esquina inferior derecha)
2. Esperar 5-10 segundos

---

### 5️⃣ Verificar éxito

Busca en los resultados el mensaje:

```
MIGRATION 001 COMPLETED SUCCESSFULLY!
```

**También deberías ver:**

✅ `SUCCESS: Todas las columnas se añadieron correctamente a properties`
✅ `SUCCESS: Tabla generated_reports creada correctamente`
✅ `SUCCESS: Todas las funciones RPC creadas correctamente`

---

## ⚠️ SI HAY ERRORES

### Error: "relation properties does not exist"
**Solución:** La tabla properties no existe. Primero necesitas crear las tablas base.

### Error: "column already exists"
**Solución:** La migración ya fue ejecutada anteriormente. Puedes ignorar este error.

### Error: "permission denied"
**Solución:** Asegúrate de estar logueado en Supabase con permisos de administrador.

---

## ✅ VERIFICACIÓN FINAL

Después de ejecutar la migración exitosamente:

### Opción 1: Verificar en Supabase Dashboard

1. Ir a: https://supabase.com/dashboard/project/jjpscimtxrudtepzwhag/editor
2. Buscar tabla **"generated_reports"** → Debe aparecer en la lista
3. Click en tabla **"properties"** → Ver que tiene nuevas columnas:
   - `owner_email`
   - `owner_phone_secondary`
   - `auto_reports_enabled`
   - `report_frequency`
   - `report_day_of_month`
   - `commission_rate`

### Opción 2: Verificar en MYHOST BizMate (LA MÁS FÁCIL)

1. Abrir **MYHOST BizMate** (http://localhost:5173)
2. Ir a **AI Systems** → **OSIRIS**
3. Scroll down a **"Business Reports"**
4. **Deberías ver un dropdown** con lista de propiedades
5. Si ves el dropdown con propiedades → **¡MIGRACIÓN EXITOSA!** 🎉

---

## 📞 ¿NECESITAS AYUDA?

Si encuentras algún error, copia el mensaje de error completo y pégamelo aquí.

---

**Archivo creado:** 1 Febrero 2026
**Migración:** MIGRATION_001_MULTIVILLA_REPORTS
**Versión:** 1.0
