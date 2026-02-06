# INFORME ARQUITECTURA MULTI-TENANT — MY HOST BizMate
## Fecha: 07 Febrero 2026 | Autor: ZENTARA LIVING

---

## 1. VISIÓN GENERAL

MY HOST BizMate — plataforma SaaS de automatización para boutique hotels y villas en Bali.
Arquitectura multi-tenant: múltiples owners operan aislados sobre la misma infraestructura.

- **Pilot Client:** Izumi Hotel (7 villas + 1 room, Ubud, Bali)
- **Segundo Client:** Nismara Uma Villa (Gita Pradnyana) — DB setup completo, auth pendiente

---

## 2. INFRAESTRUCTURA

| Componente | Plataforma | URL/Ref |
|---|---|---|
| Workflows | n8n en Railway | https://n8n-production-bb2d.up.railway.app |
| Database | Supabase Cloud | https://jjpscimtxrudtepzwhag.supabase.co |
| WhatsApp | ChakraHQ | API integrada vía n8n |
| Voice AI | VAPI | Integrado con n8n |
| AI Models | OpenAI GPT-4o / GPT-4o-mini | Vía n8n AI Agent nodes |

---

## 3. TENANTS REGISTRADOS

| Tenant | UUID | Property UUID | Bookings | Leads |
|---|---|---|---|---|
| Jose (Izumi) | `c24393db-d318-4d75-8bbf-0fa240b9c1db` | `18711359-1378-4d12-9ea6-fb31c0b1bac2` | 20 | 12 |
| Gita (Nismara) | `99538cf2-d05f-4b74-981e-9e7eabdb772e` | pendiente setup completo | 0 | 0 |

---

## 4. WORKFLOWS — ESTADO ACTUAL

### 4.1 Workflows ACTIVOS en producción (2)

| Workflow | ID | Multi-tenant? | Estado |
|---|---|---|---|
| **LUMINA** Lead Intelligence | `EtrQnkgWqqbvRjEB` | ✅ SÍ | Corregido 06-07 Feb |
| **Guest Journey** | `cQLiQnqR2AHkYOjd` | ❌ NO | Hardcoded Izumi |

### 4.2 Workflows INACTIVOS pero funcionales (core system)

| Workflow | ID | Multi-tenant? | Estado |
|---|---|---|---|
| **BANYU** WhatsApp AI | `NJR1Omi4BqKA9f1P` | ✅ SÍ | Completo |
| **KORA** MCP Tools | `ugqaUHvol02mLUn5` | ⚠️ Necesita clone | Solo Izumi config |
| **KORA** Post-Call | `1H1Wohs5js7kWdG9` | ⚠️ Pendiente | Necesita activación |
| **OSIRIS** BI Assistant | `t9L3dhicNkkFxofD` | ✅ SÍ | Completo |
| **Follow-Up Engine** | `HndGXnQAEyaYDKFZ` | ✅ SÍ | Completo |
| **Payment Protection** | `wDPzSbFM3L3ZqRKO` | ✅ SÍ | Completo |
| **AUTOPILOT** Daily Summary CRON | `1V9GYFmjXISwXTIn` | ✅ SÍ | v2 completo |
| **AUTOPILOT** Daily Summary API | `2wVP7lYVQ9NZfkxz` | ✅ SÍ | v2 completo |
| **AUTOPILOT** Actions Approve/Reject | `2fYVpMcJd5xCeTLo` | ✅ SÍ | Completo |
| **Lead Handler** | `CBiOKCQ7eGnTJXQd` | ⚠️ Parcial | Email hardcoded |
| **Booking Notifications** | `fHKGcfMtfu6CSNIH` | ⚠️ Parcial | Hardcoded Izumi |
| Content: Media→Video→WA | `8S0LKqyc1r1oqLyH` | ❌ | Sin conectar |
| Content: Social Publishing | `7lqwefjJaJDKui7F` | ❌ | Sin conectar |

### 4.3 Resumen Multi-Tenant

- **✅ Multi-tenant OK:** 8 workflows (BANYU, LUMINA, OSIRIS, Follow-Up, PayProt, 3x AUTOPILOT)
- **⚠️ Parcial/Pendiente:** 4 workflows (KORA x2, Lead Handler, Booking Notif)
- **❌ Hardcoded Izumi:** 1 activo (Guest Journey) + 2 content sin conectar

---

## 5. CAMBIOS REALIZADOS HOY (07 Feb 2026)

### 5.1 LUMINA — Multi-Tenant Owner WhatsApp Notifications

**Problema:** Nodo "4. Send Owner WhatsApp1" tenía URL y token de ChakraHQ hardcoded a Izumi. Cualquier OWNER_DECISION_REQUIRED de otro tenant enviaba vía WhatsApp de Izumi.

**Solución aplicada (3 cambios):**

1. **RPC `create_autopilot_action_with_config`** — Modificado para JOIN con `whatsapp_numbers` y retornar `chakra_plugin_id`, `phone_number_id`, `chakra_api_token` dinámicamente.

2. **Nodo "3. Build Owner Notification1"** — Ahora extrae y valida las 3 credenciales ChakraHQ del resultado RPC. Lanza error si faltan.

3. **Nodo "4. Send Owner WhatsApp1"** — URL y Authorization ahora usan expresiones dinámicas:
   - URL: `https://api.chakrahq.com/v1/ext/plugin/whatsapp/{{ $json.chakra_plugin_id }}/api/v19.0/{{ $json.phone_number_id }}/messages`
   - Auth: `Bearer {{ $json.chakra_api_token }}`

**Testado:** Webhook → AI detecta OWNER_DECISION_REQUIRED → RPC crea action + retorna config → WhatsApp enviado con wamid confirmado ✅

---

## 6. GUEST JOURNEY — ANÁLISIS PARA PRÓXIMA SESIÓN

Workflow `cQLiQnqR2AHkYOjd` (ACTIVO) — **6 nodos hardcoded:**

| Nodo | Qué está hardcoded |
|---|---|
| Get Journey Settings | `property_id=eq.18711359...` fijo |
| Get Pre-Arrival Bookings | `property_id=eq.18711359...` fijo |
| Send WhatsApp | ChakraHQ URL + token Izumi |
| Notify Owner | ChakraHQ URL + token + teléfono owner |
| Filter 3 Days Before (Code) | Templates con "Izumi Hotel", dirección, teléfono en texto |
| Send an email | `fromEmail`, `fromName: "IZUMI Hotel"` fijo |

**Complejidad:** ALTA — requiere refactorización completa:
- Quitar filtro property_id → traer bookings de TODOS los tenants (o iterar por tenant)
- Resolver ChakraHQ dinámicamente con `get_whatsapp_config`
- Templates dinámicos con datos de property (nombre, dirección, teléfono)
- Email sender dinámico por tenant

---

## 7. BASE DE DATOS — RPCs DISPONIBLES

### RPCs Multi-Tenant (reciben p_tenant_id)

```
calculate_adr, calculate_occupancy_rate, calculate_total_revenue
create_autopilot_action_with_config, create_autopilot_alert
get_active_alerts, get_banyu_stats, get_bookings, get_dashboard_stats
get_daily_summary, get_kora_stats, get_leads, get_lumina_stats
get_osiris_stats, get_owner_phone, get_payments, get_payments_summary
get_payments_with_totals, get_summary_report, get_tenant_config
get_today_checkins, get_today_checkouts, get_villa_stats
get_whatsapp_config, increment_ai_usage, log_autopilot_activity
```

### RPCs Utility

```
find_lead_by_contact, find_property_by_slug, generate_daily_summary
get_all_wa_configs, get_due_followup_leads_v2, get_properties_for_auto_reports
get_property_by_assistant, get_tenant_by_phone_number_id
log_followup_event, log_whatsapp_message, onboard_new_client
update_lead_after_followup, update_owner_notified
```

---

## 8. ARQUITECTURA WHATSAPP MULTI-TENANT

```
[Meta/ChakraHQ] → webhook con phone_number_id
       ↓
[n8n: BANYU] → get_tenant_by_phone_number_id(phone_number_id)
       ↓
[Supabase: whatsapp_numbers] → tenant_id + config
       ↓
[Routing dinámico] → procesar según tenant
       ↓
[ChakraHQ API] → responder desde el número correcto
```

**Tabla `whatsapp_numbers`:** Contiene chakra_plugin_id, phone_number_id, chakra_api_token por tenant.
**Patrón multi-tenant:** Workflows usan `get_whatsapp_config(tenant_id)` para resolver credenciales dinámicamente.

---

## 9. SEGURIDAD

- **RLS:** Desactivado en tablas operacionales (decisión arquitectural — n8n usa anon key, auth.uid()=NULL)
- **Aislamiento:** Implementado a nivel aplicación — todos los RPCs filtran por tenant_id
- **RPCs:** Usan SECURITY DEFINER para acceso controlado
- **Service Role Key:** Solo en workflows que lo requieren
- **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0`
- **Service Role Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjk0MzIzMiwiZXhwIjoyMDc4NTE5MjMyfQ.RBD16xjgQB__nj5DtLrK2w55uQ4WFJiaa0mfZT2BeJg`

---

## 10. PENDIENTES PRIORITARIOS

| # | Item | Tipo | Complejidad |
|---|------|------|-------------|
| 1 | Guest Journey → multi-tenant | Refactorización | ALTA (6 nodos) |
| 2 | KORA MCP Tools → clone para Nismara | Deployment | MEDIA |
| 3 | KORA Post-Call → activar y testear | Fix | BAJA |
| 4 | Lead Handler → email dinámico | Fix | BAJA |
| 5 | Booking Notifications → multi-tenant | Fix | MEDIA |
| 6 | Content workflows → revisar y conectar | Review | MEDIA |
| 7 | Nismara auth → crear credenciales | Setup | BAJA |

---

**Documento generado: 07 Febrero 2026**
