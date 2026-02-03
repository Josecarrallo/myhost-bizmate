# PROMPT PARA NUEVA SESIÓN - MY HOST BizMate

---

## COPIAR TODO DESDE AQUÍ:

---

# MY HOST BizMate - Sesión AUTOPILOT (Continuación)

## CONTEXTO

SaaS automatización boutique hotels. Cliente: Izumi Hotel (7 villas, Ubud, Bali).

## IDs CRÍTICOS

```
TENANT_ID: c24393db-d318-4d75-8bbf-0fa240b9c1db
PROPERTY_ID: 18711359-1378-4d12-9ea6-fb31c0b1bac2
OWNER_PHONE: +62 813 5351 5520 (número real donde llegan los clientes)
BANYU_PHONE: +62 813 2576 4867 (conectado a ChakraHQ)
OWNER_NOTIFICATION_PHONE: +34619794604
```

## INFRAESTRUCTURA

```
n8n: https://n8n-production-bb2d.up.railway.app
Supabase: https://jjpscimtxrudtepzwhag.supabase.co
apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0
```

## COMPONENTES AI

| Componente | Función | Estado |
|------------|---------|--------|
| KORA | Voice AI (VAPI) | ✅ |
| BANYU | WhatsApp AI Concierge | ✅ |
| LUMINA | Lead Intelligence | 75% |
| OSIRIS | Dashboard AI | 90% |

## WORKFLOWS ACTIVOS

| ID | Nombre |
|----|--------|
| NJR1Omi4BqKA9f1P | BANYU WhatsApp Concierge |
| gsMMQrc9T2uZ7LVA | WF-02 KORA-POST-CALL |
| EtrQnkgWqqbvRjEB | WF-SP-02 LUMINA |
| p3ukMWIbKN4bf5Gz | WF-04-BOOKING-NOTIFICATIONS |
| HndGXnQAEyaYDKFZ | WF-04 Follow-Up Engine |
| cQLiQnqR2AHkYOjd | WF-05 Guest Journey |
| v8icxH6TOdCKO823 | OSIRIS AI Assistant |
| Y40PfgjndwMepfaD | WF-D3 Daily Owner Summary v4 ✅ |

## ESTADO ACTUAL - AUTOPILOT PHASE 1 DAILY

| Workflow | Estado |
|----------|--------|
| WF-D3 Daily Owner Summary | ✅ COMPLETADO |
| WF-D1 Always-On Inquiries | ❌ NO NECESARIO (BANYU lo cubre) |
| WF-D2 Payment Protection | ⏳ PENDIENTE |
| WF-D4 Review Watch | ⏳ Opcional |

## TABLAS SUPABASE CREADAS (AUTOPILOT)

- daily_summary
- autopilot_actions
- autopilot_activity_log

## FUNCIONES RPC CREADAS

- generate_daily_summary()
- get_daily_summary()
- log_autopilot_activity()
- get_owner_phone()

## PROBLEMA CRÍTICO IDENTIFICADO

El owner recibe 10-15 WhatsApp/día en su número personal (+62 813 5351 5520).
BANYU está en otro número (+62 813 2576 4867).
Los clientes escriben al número personal, no al de BANYU.

## SOLUCIÓN IDENTIFICADA

Añadir el número del owner (+62 813 5351 5520) a ChakraHQ usando Coexistence.
Así BANYU podrá responder automáticamente en el número del owner.

## DECISIÓN PENDIENTE

1. El owner debe añadir su número a ChakraHQ (proceso en dashboard ChakraHQ)
2. Verificar que BANYU responde en ese número
3. Luego continuar con WF-D2 Payment Protection

## TAREA ACTUAL

[INDICAR AQUÍ LA TAREA A REALIZAR]

Opciones:
- A) Ayudar con proceso ChakraHQ Coexistence para añadir número owner
- B) Implementar WF-D2 Payment Protection
- C) Otro: [especificar]

## DOCUMENTO REFERENCIA

Adjuntar: MYHOST_BIZMATE_ESTADO_2026-01-25_AUTOPILOT_SESSION.md

---

## FIN DEL PROMPT

---
