# PROMPT INICIO DE SESIÓN - MY HOST BizMate
**Fecha:** 15 enero 2026
**Usuario:** Jose - Founder MY HOST BizMate

---

## 🎯 CONTEXTO DEL PROYECTO

MY HOST BizMate es una plataforma SaaS de automatización con IA para hoteles boutique y villas en el Sudeste Asiático. Cliente piloto: **Izumi Hotel** (7 villas luxury en Ubud, Bali, apertura verano 2026).

### Stack Tecnológico
- **Frontend:** React/Vite en Vercel
- **Backend:** Supabase (PostgreSQL)
- **Workflows:** n8n en Railway
- **WhatsApp:** ChakraHQ API
- **Voice AI:** VAPI
- **Email:** SendGrid

### Datos del Cliente Piloto - Izumi Hotel
```
Property ID: 18711359-1378-4d12-9ea6-fb31c0b1bac2
Tenant ID: c24393db-d318-4d75-8bbf-0fa240b9c1db
WhatsApp: +62 813 2576 4867
```

---

## ✅ WORKFLOWS QUE FUNCIONAN (Johnson Contract v1)

| Workflow | ID | Webhook | Estado |
|----------|-----|---------|--------|
| **WF-SP-01 Johnson Contract v1** | `OZmq7E9wzODJrzej` | `/webhook/inbound-johnson-v1` | ✅ Probado 14-ene |
| **BANYU v2 - Johnson Contract v1** | `NJR1Omi4BqKA9f1P` | `banyu-johnson-v1` | ✅ Probado 14-ene |

### Flujo Probado y Funcionando:
```
WhatsApp → BANYU v2 → Classify Intent → Build Johnson Contract → WF-SP-01 → Supabase
```

### Johnson Contract v1 Schema:
```json
{
  "version": "johnson.v1",
  "event_type": "lead_message",
  "tenant": { "slug", "tenant_id" },
  "lead": { "lead_id", "name", "phone", "email" },
  "channel": { "source", "thread_id" },
  "property": { "property_id", "property_name", "villa_ids" },
  "booking": { "booking_id", "check_in", "check_out", "guests", "status" },
  "message": { "text", "language" },
  "ai": { "intent", "score", "is_hot" },
  "trace": { "source_workflow", "execution_id", "timestamp", "call_id" },
  "raw": { "payload" }
}
```

---

## ⚠️ WORKFLOW CON PROBLEMAS - MCP Central

| Workflow | ID | Estado |
|----------|-----|--------|
| **MCP Central - Izumi Hotel** | `cYVfGnzuqnt3dmVN` | ❌ Problemas con JSONs |

### Problemas Identificados (14-ene):
1. **Webhook no registrado** → Solución: Toggle off/on del workflow
2. **$fromAI() descriptions inconsistentes** → Causa error "Duplicate key"
3. **JSONs modificados incorrectamente** → Nodos devuelven [undefined]

### Regla Crítica para $fromAI():
Las descripciones deben ser **IDÉNTICAS** en todos los nodos:
```
guest_phone: 'Guest phone'
guest_name: 'Guest name'
guest_email: 'Guest email'
check_in: 'Check-in date'
check_out: 'Check-out date'
total_price: 'Total price'
```

### MCP URL:
```
https://n8n-production-bb2d.up.railway.app/mcp/izumi-hotel
```

---

## 📋 PLAN DE TRABAJO

### FASE 1 - Verificar y Estabilizar (Prioridad Alta)
1. [ ] Activar BANYU v2 + WF-SP-01 Johnson
2. [ ] Probar flujo WhatsApp → Lead completo
3. [ ] Arreglar MCP Central (revisar JSONs sin modificar estructura)
4. [ ] Probar KORA con MCP Central

### FASE 2 - VAPI + Johnson Contract (Plan Original)
1. [ ] Crear Structured Output en VAPI: `JohnsonContract_v1_VoiceOutcome`
2. [ ] Crear workflow "KORA Post-Call" que:
   - Reciba evento "call ended" de VAPI
   - Espere 3-10 segundos
   - Obtenga Structured Output
   - Envíe Johnson Contract a WF-SP-01

### FASE 3 - Completar Sistema
1. [ ] Follow-Up Engine (WF-02) - Secuencias LUMINA
2. [ ] Guest Journey - Comunicaciones post-booking
3. [ ] OSIRIS - Dashboard y control

---

## 🔧 WORKFLOWS DE BACKUP/LEGACY

| Workflow | ID | Versión |
|----------|-----|---------|
| BANYU.AI (original) | `ORTMMLk6qVKFhELp` | Master Event v1.0 |
| WF-SP-01 CLEAN | varios | Master Event v1.0 |
| MCP Central copia mala | `jyvFpkPes5DdoBRE` | - |

---

## 🚨 REGLAS IMPORTANTES PARA ESTA SESIÓN

### Antes de Modificar Cualquier JSON:
1. **MOSTRAR** el JSON actual completo
2. **MOSTRAR** el JSON propuesto con cambios marcados
3. **ESPERAR** confirmación explícita del usuario
4. **NO** cambiar estructura de JSONs que funcionan
5. **SOLO** modificar valores específicos necesarios

### n8n en Railway:
- Versión actual: 1.123.5
- Evitar v2.0 por breaking changes
- Para actualizar: Settings → Source → Source Image (lápiz)
- Rollback disponible en Deployments

### Webhook Registration:
Si un workflow restaurado no responde, hacer toggle off/on para re-registrar el webhook.

---

## 📞 CONTACTO IZUMI HOTEL

```
WhatsApp: +62 813 2576 4867 (24/7)
Phone: +62 813 2576 4867 (8:00-22:00)
Web: www.my-host-bizmate.com (Voice assistant 24/7)
```

---

## 📚 TRANSCRIPTS RELEVANTES

- `/mnt/transcripts/2026-01-14-04-00-58-kora-v2-johnson-contract-migration.txt` - BANYU v2 + WF-SP-01 Johnson funcionando
- `/mnt/transcripts/2026-01-14-12-53-27-mcp-webhook-registration-whatsapp-json-errors.txt` - Problemas MCP Central
- `/mnt/transcripts/journal.txt` - Índice de todas las sesiones

---

**ESTADO ACTUAL:** Workflows Johnson Contract v1 funcionan. MCP Central necesita revisión. VAPI Structured Outputs pendiente.
