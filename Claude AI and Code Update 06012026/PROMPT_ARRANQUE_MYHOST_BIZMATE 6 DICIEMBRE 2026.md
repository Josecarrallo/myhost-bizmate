# 🚀 PROMPT DE ARRANQUE - MY HOST BIZMATE
## Fecha: 6 Enero 2026 | Última actualización del proyecto

---

## 📋 CONTEXTO DEL PROYECTO

**MY HOST BizMate** es una plataforma SaaS de automatización para hoteles boutique y villas en el sudeste asiático (Bali/Indonesia). El cliente piloto es **Izumi Hotel**, un hotel boutique 5 estrellas con 7 villas de lujo en Ubud, Bali, que abre en verano 2026.

### Stack Tecnológico:
- **n8n** (Railway): Workflows de automatización
- **Supabase**: Base de datos PostgreSQL
- **Chakra HQ**: WhatsApp Business API (BSP)
- **VAPI**: Asistente de voz
- **OpenAI GPT-4.1-mini**: Generación de mensajes AI

### URLs y Credenciales:
- n8n: https://n8n-production-bb2d.up.railway.app
- Supabase: https://jjpscimtxrudtepzwhag.supabase.co
- Property ID Izumi: `18711359-1378-4d12-9ea6-fb31c0b1bac2`
- Test Phone (Owner): `+34619794604`
- WhatsApp Izumi: `+62 813 2576 4867`

---

## 🏗️ ARQUITECTURA DEL SISTEMA

```
CANALES DE ENTRADA          AI ASSISTANTS              WORKFLOWS              SALIDAS
─────────────────          ──────────────             ─────────              ───────

┌──────────┐              ┌─────────────────┐
│ WhatsApp │─────────────▶│ WhatsApp AI     │
│    ✅    │              │ Concierge ✅    │──┐
└──────────┘              └─────────────────┘  │
                                               │
┌──────────┐              ┌─────────────────┐  │      ┌─────────────┐
│  Voice   │─────────────▶│ VAPI Assistant  │──┤      │             │
│    ✅    │              │      ✅         │  │      │  SUPABASE   │
└──────────┘              └─────────────────┘  │      │             │
                                               ├─────▶│   leads     │
┌──────────┐                                   │      │ lead_events │
│   Web    │───────────────────────────────────┤      │             │
│    ⏳    │              WF-01 Multicanal     │      └──────┬──────┘
└──────────┘                   ⏳              │             │
                                               │             │ CRON
┌──────────┐                                   │             │ (cada hora)
│Instagram │───────────────────────────────────┤             ▼
│    ⏳    │                                   │      ┌─────────────┐      ┌────────────┐
└──────────┘                                   │      │   WF-02     │─────▶│ WhatsApp   │
                                               │      │ Follow-Up   │      │ al Cliente │
┌──────────┐                                   │      │ Engine v8   │      └────────────┘
│ Facebook │───────────────────────────────────┘      │     ✅      │
│    ⏳    │                                          └──────┬──────┘      ┌────────────┐
└──────────┘                                                 └────────────▶│ WhatsApp   │
                                                                           │ al Owner   │
┌──────────┐                                                               └────────────┘
│  TikTok  │───────────────────────────────────────────⏳
│    ⏳    │
└──────────┘
```

### Principio Clave de Conexión:
**WF-01 y WF-02 NUNCA se llaman directamente.** Se conectan a través de TIMESTAMPS en Supabase:
- WF-01 escribe: `next_followup_at = now() + 24h`
- WF-02 lee: `WHERE next_followup_at <= now() AND state NOT IN ('WON','LOST')`

---

## ✅ COMPONENTES OPERATIVOS

### 1. WhatsApp AI Concierge
- Responde consultas 24/7
- Disponibilidad y precios
- Clasifica intención del lead
- Crea/actualiza leads en Supabase

### 2. VAPI Voice Assistant
- Atiende llamadas 24/7
- Genera transcripts
- Tel: +62 813 2576 4867

### 3. WF-02 Follow-Up Engine v8
- **URL**: https://n8n-production-bb2d.up.railway.app/workflow/HndGXnQAEyaYDKFZ
- **Trigger**: CRON cada hora
- **Timeline de follow-ups**:
  | Step | Intent | Delay | Resultado |
  |------|--------|-------|-----------|
  | 1 | SOFT_CHECK | +24h | FOLLOWING_UP |
  | 2 | VALUE_REMINDER | +48h | FOLLOWING_UP |
  | 3 | LAST_DIRECT | +72h | FOLLOWING_UP |
  | 4 | REENGAGEMENT | +7d | FOLLOWING_UP |
  | 5 | INCENTIVE | +14d | FOLLOWING_UP |
  | 6 | CLOSURE | NULL | LOST |

- **Notifica al Owner cuando**:
  - `high_value = true` (stay_nights > 5 OR villas_count > 2)
  - `requested_discount = true`
  - `state = 'HOT'`
  - `step = 6` (CLOSURE → LOST)
  - Cooldown: 24h entre notificaciones (excepto CLOSURE)

- **Personalización AI** (GPT-4.1-mini):
  - Usa nombre del lead
  - Menciona duración de estancia y número de villas
  - Tono VIP si high_value
  - Soporte multiidioma (español/inglés)
  - Firma del hotel al final

### 4. Supabase Schema
**Tabla `leads`**:
- id, property_id, lead_key, channel, phone_e164, name
- state (NEW/ENGAGED/HOT/FOLLOWING_UP/WON/LOST)
- intent, stay_nights, villas_count, requested_discount, high_value, language
- followup_step, last_inbound_at, last_outbound_at, next_followup_at
- last_owner_notified_at, closed_at

**Tabla `lead_events`**:
- event_type: lead_created, lead_updated, status_changed, followup_sent, message_received, message_sent, converted, lost, owner_notified, ai_hot_lead_detected, ai_ready_to_book

---

## ⏳ PENDIENTE (Según Plan de Ejecución)

### FASE 1 - WF-01 Multicanal (PRIORITARIO)
- [ ] Webhook unificado: `/webhook/wf-sp-01-inbound`
- [ ] Channel Adapters para: web, instagram, facebook, tiktok, voice
- [ ] Normalización a Lead Object único
- [ ] Dedupe rules: phone > email > channel_user_id > anonymous hash
- [ ] Test mode (`test_mode: true`)

### FASE 2 - Testing
- [ ] Plan de pruebas WF-01 (simular 6 canales)
- [ ] Completar testing WF-02 (casos Anna Müller, Carlos Mendoza)
- [ ] Test end-to-end: Lead Web → Follow-ups → LOST/WON

### FASE 3 - WhatsApp Concierge Enrichment
- [ ] Signal extraction: wants_to_book, requested_discount, hesitation
- [ ] Load lead context antes del AI Agent
- [ ] Human escalation explícita

### FASE 4 - Integraciones Reales (ÚLTIMO)
- [ ] Meta (Instagram + Facebook) webhooks
- [ ] TikTok Lead Forms
- [ ] Solo ejecutar cuando WF-01 y WF-02 estén cerrados

---

## 📄 DOCUMENTOS DE REFERENCIA

- **Plan de Ejecución**: `PLAN_DE_EJECUCIÓN___MYHOST_BIZMATE__VALIDADO_6_DICIEMBRE_2026_.docx`
- **Transcripts anteriores**: `/mnt/transcripts/` (journal.txt tiene el catálogo)

---

## 🎯 PRÓXIMOS PASOS RECOMENDADOS

1. **Construir WF-01 Multicanal** - Webhook que normalice leads de todos los canales
2. **Plan de Pruebas** - Validar todo el flujo end-to-end
3. **WhatsApp Concierge Enrichment** - Mejorar extracción de señales comerciales
4. **Integraciones Meta/TikTok** - Solo al final, cuando core esté validado

---

## ❓ PREGUNTA PARA INICIAR SESIÓN

¿Por dónde quieres continuar?
- A) Construir WF-01 Multicanal
- B) Crear Plan de Pruebas detallado
- C) Mejorar WhatsApp Concierge
- D) Otro

---

*Última sesión: 6 Enero 2026 - Completamos WF-02 v8 con notificación al owner en CLOSURE y testing de 5 casos (John Smith, María García, Sophie Laurent, Robert Chen, Emma Wilson)*
