# PROMPT PARA NUEVA SESIÓN - MY HOST BizMate

---

## COPIAR TODO DESDE AQUÍ:

---

# MY HOST BizMate - Sesión AUTOPILOT (Continuación)

## CONTEXTO RÁPIDO

SaaS automatización boutique hotels. Cliente: Izumi Hotel (7 villas, Ubud, Bali).

**IDs Críticos:**
```
TENANT_ID:    c24393db-d318-4d75-8bbf-0fa240b9c1db
PROPERTY_ID:  18711359-1378-4d12-9ea6-fb31c0b1bac2
OWNER_PHONE:  +62 813 5351 5520
BANYU_PHONE:  +62 813 2576 4867
```

**Infraestructura:**
- n8n: https://n8n-production-bb2d.up.railway.app
- Supabase: https://jjpscimtxrudtepzwhag.supabase.co

## COMPONENTES AI

| Componente | Estado |
|------------|--------|
| KORA (Voice) | ✅ 100% |
| BANYU (WhatsApp) | ✅ 100% |
| LUMINA (Lead Intel) | 75% |
| OSIRIS (Dashboard) | 90% |
| AUTOPILOT | 🔄 EN PROGRESO |

## AUTOPILOT - ESTADO ACTUAL

**Implementando:** FASE 1 - AUTOPILOT DAILY

**Workflows AUTOPILOT:**

| Workflow | ID | Estado |
|----------|-----|--------|
| WF-D3 Daily Summary (CRON) | Y40PfgjndwMepfaD | ✅ ACTIVO |
| WF-D3-API Summary (Webhook) | c13WiqN6pmzxSSMH | ⚠️ INACTIVO |
| WF-D2 Payment Protection | zTvQZdDa8so8nysM | ⚠️ INACTIVO |
| WF-AUTOPILOT Actions | P0EYlLzcCh4UeTzJ | ❌ VACÍO - Crear manual |

**Tablas Supabase AUTOPILOT:** ✅ Todas creadas
- daily_summary
- autopilot_actions  
- autopilot_alerts
- autopilot_activity_log
- whatsapp_conversations
- whatsapp_numbers

## PENDIENTE

1. **Activar workflows** en n8n (c13WiqN6pmzxSSMH, zTvQZdDa8so8nysM)
2. **Crear manualmente** WF-AUTOPILOT Actions (el creado via API está vacío)
3. **Probar** cada workflow end-to-end
4. **Conectar frontend** (Claude Code) con datos reales

## WEBHOOKS AUTOPILOT

```
POST /webhook/autopilot/daily-summary
POST /webhook/autopilot/action
POST /webhook/autopilot/payment/start
```

## DOCUMENTOS REFERENCIA

Subir estos 6 archivos si no están en el proyecto:
- AUTOPILOT_MODULE_-_INTRODUCTION.txt
- AUTOPILOT_MODULE_-_I_CLAUDE_AI_AND_CLAUDE_CODE.txt
- AUTOPILOT_MODULE_-_II_CLAUDE_CODE.txt
- AUTOPILOT_MODULE_-_III_CLAUDE_AI.txt
- AUTOPILOT_MODULE_-_IV_CLAUDE_AI.txt
- AUTOPILOT_MODULE_-_Villa_Owner_Point_of_View.pdf

## TAREA

Continuar implementación AUTOPILOT FASE 1:
- Probar workflows existentes
- Completar workflows faltantes
- Conectar frontend con backend

---

## FIN DEL PROMPT
