# MY HOST BizMate - Actualización Completa del Proyecto
## Fecha: 26 de Enero 2026

---

## 1. VISIÓN GENERAL

**MY HOST BizMate** es una plataforma SaaS de automatización integral para boutique hotels en Bali. El objetivo es eliminar la intervención manual en operaciones rutinarias mientras se mantiene un servicio personalizado de alta calidad.

### Propietario
- **Fundador:** Jose (ZENTARA LIVING)
- **Piloto:** Izumi Hotel (7 villas en Ubud, Bali)

### Stack Tecnológico
| Componente | Tecnología | URL/Endpoint |
|------------|------------|--------------|
| Workflows | n8n | https://n8n-production-bb2d.up.railway.app |
| Base de Datos | Supabase | https://jjpscimtxrudtepzwhag.supabase.co |
| Voice AI | VAPI | Integrado con KORA |
| WhatsApp API | ChakraHQ | Meta Business API |
| Frontend | React (OSIRIS) | localhost:5173 (desarrollo) |

### Identificadores Clave (Izumi Hotel)
```
TENANT_ID:   c24393db-d318-4d75-8bbf-0fa240b9c1db
PROPERTY_ID: 18711359-1378-4d12-9ea6-fb31c0b1bac2
```

---

## 2. ARQUITECTURA DE AGENTES AI

| Agente | Función | Estado |
|--------|---------|--------|
| **KORA** | Voice AI - Llamadas telefónicas | ✅ Operativo |
| **BANYU** | WhatsApp AI - Mensajería | ✅ Operativo |
| **LUMINA** | Lead Intelligence & Routing | ✅ Operativo (decisión) / ⏳ Downstream pending |
| **OSIRIS** | Business Intelligence Dashboard | ✅ Frontend operativo |
| **AUTOPILOT** | Automatización proactiva | 🔧 En desarrollo |

---

## 3. WORKFLOWS ACTIVOS EN PRODUCCIÓN

### Workflows Principales (ACTIVE = TRUE)

| ID | Nombre | Trigger | Función |
|----|--------|---------|---------|
| `Y40PfgjndwMepfaD` | WF-D3 Daily Owner Summary v4 | CRON 18:00 WITA | Resumen diario al owner |
| `2wVP7lYVQ9NZfkxz` | AUTOPILOT - Daily Summary API | Webhook | API para Dashboard |
| `o471FL9bpMewcJIr` | WF-D2 Payment Protection | Webhook | Seguimiento de pagos |
| `NJR1Omi4BqKA9f1P` | BANYU WhatsApp AI | Webhook | Respuestas WhatsApp |
| `gsMMQrc9T2uZ7LVA` | KORA Voice AI | VAPI | Llamadas de voz |
| `cQLiQnqR2AHkYOjd` | WF-05 Guest Journey | Múltiple | Journey del huésped |
| `EtrQnkgWqqbvRjEB` | WF-SP-02 LUMINA | Webhook | Análisis de leads |
| `1V9GYFmjXISwXTIn` | AUTOPILOT - Daily Summary CRON | CRON | Trigger diario |

### Endpoints Activos

```
POST /webhook/banyu/incoming          → BANYU (WhatsApp)
POST /webhook/kora/post-call          → KORA Post-Call
POST /webhook/lumina/analyze          → LUMINA Analysis
POST /webhook/autopilot/payment/start → WF-D2 Payment Protection
POST /webhook/autopilot/daily-summary → Daily Summary API
POST /webhook/autopilot/action        → Approve/Reject Actions
```

---

## 4. ESTRUCTURA DE BASE DE DATOS

### Tablas Principales

| Tabla | Registros | Función |
|-------|-----------|---------|
| `bookings` | 164 | Reservas |
| `leads` | 23 | Leads/Contactos |
| `guests` | 16 | Huéspedes |
| `properties` | 14 | Propiedades |
| `payments` | 18 | Pagos |
| `whatsapp_messages` | 38 | Mensajes WA |
| `lead_events` | 103 | Eventos de leads |
| `audit_logs` | 154 | Auditoría |

### Tablas AUTOPILOT

| Tabla | Función |
|-------|---------|
| `daily_summary` | Resúmenes diarios |
| `autopilot_actions` | Acciones pendientes de aprobación |
| `autopilot_activity_log` | Log de actividades |
| `autopilot_alerts` | Alertas del sistema |

### Campos Importantes en `bookings`

```sql
status: inquiry | confirmed | checked_in | checked_out | cancelled | provisional | pending_payment | expired
payment_status: pending | partial | paid | refunded | expired
payment_expiry_at: TIMESTAMP (para WF-D2)
```

---

## 5. MÓDULO AUTOPILOT - ESTADO ACTUAL

### Componentes Implementados

| Componente | Estado | Notas |
|------------|--------|-------|
| WF-D3 Daily Summary | ✅ COMPLETO | CRON 18:00 + WhatsApp al owner |
| WF-D2 Payment Protection | ✅ FUNCIONAL | 3 reminders + expire automático |
| Dashboard UI | ✅ OPERATIVO | Actions Needing Approval visible |
| Approve/Reject Workflow | ⚠️ VERIFICAR | Existe pero no probado |

### Pendiente de Implementar

1. **Trigger automático de WF-D2** al crear reserva
2. **Lógica de casos especiales** (payment_verification, custom_payment_plan, cancellation_exception)
3. **Conexión LUMINA → Downstream workflows**

---

## 6. LIMITACIONES CONOCIDAS

### Meta WhatsApp Business API
- **Límite actual:** 2 números WhatsApp por Business Manager
- **Impacto:** Retrasa expansión multi-tenant
- **Solución:** Esperar crecimiento orgánico de límites Meta

### ChakraHQ Coexistence
- Permite que owner use WhatsApp Business App simultáneamente con BANYU
- Configurado y funcional para Izumi Hotel

---

## 7. PRÓXIMOS PASOS PRIORITARIOS

### Inmediato (Esta semana)
1. ✅ ~~WF-D2 Payment Protection funcional~~
2. ⏳ Implementar trigger automático de WF-D2
3. ⏳ Verificar/completar WF-AUTOPILOT-ACTIONS
4. ⏳ Conectar LUMINA con downstream workflows

### Corto Plazo (Próximas 2 semanas)
1. Probar flujo completo end-to-end con reserva real
2. Implementar casos especiales en AUTOPILOT
3. Expandir OSIRIS con métricas semanales/mensuales

### Medio Plazo
1. Onboarding segundo hotel cuando Meta permita más números
2. Documentación completa para handoff

---

## 8. CONTACTOS Y RECURSOS

### APIs Externas
- **ChakraHQ Plugin ID:** `2e45a0bd-8600-41b4-ac92-599d59d6221c`
- **WhatsApp Phone Number ID:** `944855278702577`

### Documentación Clave
- `AUTOPILOT_MODULE_-_IV_CLAUDE_AI.txt` - Especificaciones AUTOPILOT
- `MYHOST_TECH_STACK.md` - Stack técnico completo

---

*Documento generado: 26 de Enero 2026*
*Próxima revisión: 27 de Enero 2026*
