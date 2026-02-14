# RESUMEN BIZMATE — 7 Feb 2026 (CORREGIDO)

## ARQUITECTURA ACTUAL

```
BANYU (WhatsApp) ──┐                                    
                   ├──→ WF-03-LEAD-HANDLER ──→ LUMINA ──→ Decision Router ──→ Acciones
KORA (Voz VAPI) ──┘                                    
```

- Ambos canales usan **Johnson Contract v1** y convergen en el mismo pipeline
- KORA: la IA de voz corre en VAPI, n8n solo expone tools vía MCP + post-call processing

## ESTADO DE CADA COMPONENTE

| Componente | Workflow ID | Estado |
|---|---|---|
| **BANYU** (WhatsApp AI) | NJR1Omi4BqKA9f1P | ✅ Activo — AI Agent + 3 tools + Johnson → Lead Handler |
| **WF-03 Lead Handler** | OZmq7E9wzODJrzej | ✅ Activo — buscar/crear lead → log → LUMINA |
| **KORA MCP Tools** | ugqaUHvol02mLUn5 | ✅ Activo — MCP Server con check_availability + create_booking |
| **KORA Post-Call v3** | 1H1Wohs5js7kWdG9 | ⚠️ Inactivo — VAPI webhook → Johnson → Lead Handler |
| **LUMINA** (Lead Intelligence) | EtrQnkgWqqbvRjEB | ⚠️ Router roto — solo output AUTOPILOT funciona, BOOKED/FOLLOWUP/REENGAGE/CLOSE van a "Respond" |
| **OSIRIS V2** (BI Dashboard) | t9L3dhicNkkFxofD | ✅ Activo — 9 tools, prompt V3 |
| **Follow-Up Engine** | HndGXnQAEyaYDKFZ | ✅ Activo — 6 pasos + AI + Send Owner WA completo |
| **AUTOPILOT Approve/Reject** | GuHQkHb21GlowlZI | ✅ Probado |
| **Payment Protection v2** | wDPzSbFM3L3ZqRKO | ✅ Activo — multi-tenant (usa get_whatsapp_config), 3 checkpoints (6h/20h/24h) |
| **Guest Journey** | cQLiQnqR2AHkYOjd | ✅ Activo — 5 etapas, hardcoded Izumi |
| **Content workflows** | 8S0LKqyc1r1oqLyH / 7lqwefjJaJDKui7F | ⏳ Sin conectar |

## QUÉ FALTA HOY

### FIX 1 — LUMINA Decision Router (EtrQnkgWqqbvRjEB)
Los 4 outputs rotos del router (BOOKED/FOLLOWUP/REENGAGE/CLOSE) van todos a "Respond" en vez de a sus workflows.

### FIX 2 — Activar KORA Post-Call (1H1Wohs5js7kWdG9)
Pipeline construido pero inactivo.

### MULTI-TENANT pendiente
- **Follow-Up Engine** tiene ChakraHQ hardcoded (Izumi). Payment Protection v2 ya es multi-tenant (usa `get_whatsapp_config`). Hay que hacer lo mismo en Follow-Up.
- **Guest Journey** hardcoded a Izumi
- **BANYU** hardcoded a Izumi (tenant_id, property_id, ChakraHQ)
- **Segundo cliente:** Nismara Uma Villa — datos en DB, falta auth

## IDs CLAVE

```
n8n:       https://n8n-production-bb2d.up.railway.app
Supabase:  https://jjpscimtxrudtepzwhag.supabase.co
Tenant:    c24393db-d318-4d75-8bbf-0fa240b9c1db (Izumi)
Property:  18711359-1378-4d12-9ea6-fb31c0b1bac2 (Izumi)
ChakraHQ:  phone_number_id 944855278702577
```
