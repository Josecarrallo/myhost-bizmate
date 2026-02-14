# BACKUP COMPLETO SUPABASE - 10 FEBRERO 2026

## 📊 CONTENIDO DEL BACKUP

### Datos Exportados
- **users**: 3 registros (Zentara, Jose, Gita)
- **properties**: 3 registros (Zentara Living, Izumi Hotel, Nismara 2BR Pool Villa)
- **bookings**: 68 registros (2025 + 2026)
- **leads**: 12 registros
- **payments**: 0 registros

### Estado Verificado
✅ **2025 Bookings**: 26 bookings, 79 nights, Rp 82,128,179, occupancy 63.71%
✅ **2026 Bookings**: 20 bookings, 80 nights, Rp 74,657,624, occupancy 28.67%
✅ **Property Name**: "NISMARA 2 BEDROOM POOL VILLA"

## 🔧 FUNCIONES RPC ACTIVAS

### Overview & Analytics
- `get_overview_stats(p_tenant_id, p_start_date, p_end_date)`
  - Returns: total_revenue, revenue_paid, revenue_pending, total_nights, total_bookings, occupancy_rate, timeline_data, properties_data, sources_data, payment_status_data
  - **KEY FIX**: Occupancy rate now calculates as total_nights / (months_with_bookings × 31)

- `get_dashboard_stats(p_tenant_id)`
- `get_villa_stats(p_tenant_id, p_villa_name, p_start_date, p_end_date)`

### Bookings & Payments
- `get_bookings(p_tenant_id, p_status, p_date_from, p_date_to)`
- `get_payments(p_tenant_id, p_status)`
- `get_today_checkins(p_tenant_id)`
- `get_today_checkouts(p_tenant_id)`

### AI Agents
- `get_lumina_stats(p_tenant_id)` - Sales & Leads
- `get_banyu_stats(p_tenant_id)` - WhatsApp Concierge
- `get_kora_stats(p_tenant_id)` - Voice Concierge
- `get_osiris_stats(p_tenant_id)` - Operations & Control

### Multi-tenant
- `get_whatsapp_config(p_tenant_id)`
- `get_all_wa_configs()`
- `get_tenant_by_phone_number_id(p_phone_number_id)`

### Reports
- `get_summary_report(p_period, p_tenant_id)`
- `get_active_alerts(p_tenant_id)`
- `get_leads(p_tenant_id)`

## 📁 ARCHIVOS EN ESTE BACKUP

1. **supabase_data_backup_10feb2026.json** - Datos completos de todas las tablas
2. **fix_occupancy_rate_correct.sql** - SQL para crear/actualizar función get_overview_stats
3. **export_all_data.cjs** - Script para exportar datos
4. **README_BACKUP.md** - Este archivo

## 🔄 CÓMO RESTAURAR

### Opción 1: Restaurar Datos
```bash
node restore_from_backup.cjs
```

### Opción 2: Restaurar Función de Occupancy Rate
```sql
-- Ejecutar en Supabase SQL Editor
-- Ver archivo: fix_occupancy_rate_correct.sql
```

## 🎯 TENANTS CONFIGURADOS

| Tenant | Tenant ID | Property ID | Status |
|--------|-----------|-------------|--------|
| Zentara Living | 77982108-408a-433c-9b56-7fb89088bc8e | 24a31f17-b78b-4de7-a2d3-7d3198345745 | inactive |
| Jose/Izumi | c24393db-d318-4d75-8bbf-0fa240b9c1db | 18711359-1378-4d12-9ea6-fb31c0b1bac2 | active |
| **Gita/Nismara** | **1f32d384-4018-46a9-a6f9-058217e6924a** | **3551cd18-af6b-48c2-85ba-4c5dc0074892** | **active** |

## 🔑 CREDENCIALES

- Supabase URL: `https://jjpscimtxrudtepzwhag.supabase.co`
- Service Role Key: (ver archivo de credenciales)
- Anon Key: (ver archivo de credenciales)

## 📝 CAMBIOS RECIENTES (10 FEB 2026)

1. ✅ Corregidos bookings 2025 (26 bookings, 79 nights)
2. ✅ Corregidos bookings 2026 (20 bookings, 80 nights)
3. ✅ Corregido cálculo de occupancy rate (meses con bookings × 31)
4. ✅ Actualizado nombre property a "NISMARA 2 BEDROOM POOL VILLA"
5. ✅ Actualizado booking sources 2025 (Airbnb → Bali Buntu)

## ⚠️ IMPORTANTE

- Este backup incluye **SOLO datos**, no incluye:
  - Estructura de tablas (schema)
  - Row Level Security (RLS) policies
  - Triggers
  - Storage buckets

- Para backup completo de schema usar Supabase Dashboard → Database → Backup

---
**Backup creado**: 10 Febrero 2026
**Por**: Claude Code
**Commit**: c036ac4
