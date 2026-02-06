# PROMPT NUEVA SESIÓN — MY HOST BizMate
## Copiar y pegar completo al abrir nueva conversación

---

Soy Jose, founder de ZENTARA LIVING. Desarrollo MY HOST BizMate, plataforma SaaS de automatización para boutique hotels en Bali.

Adjunto el archivo INFORME_ARQUITECTURA_MULTITENANT_07FEB2026.md con el estado completo del sistema.

## INFRAESTRUCTURA

- **n8n:** https://n8n-production-bb2d.up.railway.app (Railway)
- **Supabase:** https://jjpscimtxrudtepzwhag.supabase.co
- **WhatsApp:** ChakraHQ API integrada en n8n
- **Voice AI:** VAPI con n8n MCP tools

## TENANTS

| Tenant | tenant_id | property_id |
|---|---|---|
| Jose (Izumi) | `c24393db-d318-4d75-8bbf-0fa240b9c1db` | `18711359-1378-4d12-9ea6-fb31c0b1bac2` |
| Gita (Nismara) | `99538cf2-d05f-4b74-981e-9e7eabdb772e` | pendiente |

## ESTADO WORKFLOWS

### ✅ Multi-tenant OK (no tocar)
- BANYU WhatsApp AI (`NJR1Omi4BqKA9f1P`)
- LUMINA Lead Intelligence (`EtrQnkgWqqbvRjEB`) — corregido 07 Feb
- OSIRIS BI Assistant (`t9L3dhicNkkFxofD`)
- Follow-Up Engine (`HndGXnQAEyaYDKFZ`)
- Payment Protection (`wDPzSbFM3L3ZqRKO`)
- AUTOPILOT Daily Summary CRON (`1V9GYFmjXISwXTIn`)
- AUTOPILOT Daily Summary API (`2wVP7lYVQ9NZfkxz`)
- AUTOPILOT Actions Approve/Reject (`2fYVpMcJd5xCeTLo`)

### ⚠️ Pendientes de fix multi-tenant
1. **Guest Journey** (`cQLiQnqR2AHkYOjd`) — ACTIVO, 6 nodos hardcoded Izumi, refactorización completa necesaria
2. **KORA MCP Tools** (`ugqaUHvol02mLUn5`) — necesita clone para nuevo client
3. **KORA Post-Call** (`1H1Wohs5js7kWdG9`) — necesita activación y test
4. **Lead Handler** (`CBiOKCQ7eGnTJXQd`) — email hardcoded
5. **Booking Notifications** (`fHKGcfMtfu6CSNIH`) — hardcoded Izumi
6. **Content workflows** (`8S0LKqyc1r1oqLyH`, `7lqwefjJaJDKui7F`) — sin conectar

## PATRÓN MULTI-TENANT CORRECTO

Los workflows que YA funcionan usan este patrón:
1. Webhook/trigger recibe `tenant_id`
2. RPC `get_whatsapp_config(tenant_id)` retorna `chakra_plugin_id`, `phone_number_id`, `chakra_api_token`
3. URL ChakraHQ se construye dinámicamente: `https://api.chakrahq.com/v1/ext/plugin/whatsapp/{{ chakra_plugin_id }}/api/v19.0/{{ phone_number_id }}/messages`
4. Auth: `Bearer {{ chakra_api_token }}`

## REGLAS

- No inventar datos — verificar con API/DB antes de proponer cambios
- Mostrar estado ACTUAL primero, luego cambios exactos
- No asumir que algo funciona — verificar
- Admitir errores inmediatamente
- Una tarea a la vez
- Código completo, no fragmentos
- Esperar OK antes de aplicar cambios

## TAREA DE HOY

Arreglar estos 3 workflows para multi-tenant:

1. **Guest Journey** (`cQLiQnqR2AHkYOjd`) — ACTIVO, 6 nodos hardcoded Izumi. Requiere refactorización completa: quitar filtro property_id fijo, resolver ChakraHQ dinámico, templates dinámicos con datos de property, email sender dinámico.
2. **KORA MCP Tools** (`ugqaUHvol02mLUn5`) — Clonar configuración para soportar nuevo client Nismara.
3. **Booking Notifications** (`fHKGcfMtfu6CSNIH`) — Hardcoded Izumi, convertir a multi-tenant.

Empezar por Guest Journey que es el más complejo y está ACTIVO en producción.
