# MY HOST BizMate - Estado del Proyecto
**Fecha:** 5 de Enero 2026
**Cliente Piloto:** Izumi Hotel (7 villas de lujo en Ubud, Bali - apertura verano 2026)

---

## RESUMEN EJECUTIVO

Hoy se completó la migración de WF-SP-01 a arquitectura multi-tenant y se definieron las reglas completas del sistema de follow-up automático. El sistema de ventas está listo para capturar leads de todos los canales y convertirlos en reservas.

---

## ARQUITECTURA DEL SISTEMA DE VENTAS

```
Cliente contacta (Web/WhatsApp/IG/FB)
            ↓
    WF-SP-01 (Captura y clasifica)
            ↓
    Tabla leads (status: NEW)
            ↓
    WF-SP-02 AI responde en tiempo real
            ↓
    Si no cierra...
            ↓
┌─────────────────────────────────────┐
│   WF-SP-03 FOLLOW-UP ENGINE         │
│                                     │
│   24h  → Mensaje suave              │
│   48h  → Recordatorio valor         │
│   72h  → Última llamada             │
│   1 sem → Re-engagement suave       │
│   2 sem → Re-engagement + incentivo │
│   1 mes → Último intento → LOST     │
│                                     │
│   → WON (reserva) o LOST            │
└─────────────────────────────────────┘
```

---

## INFRAESTRUCTURA ACTIVA

### Workflows n8n
| ID | Nombre | Endpoint | Estado |
|----|--------|----------|--------|
| CBiOKCQ7eGnTJXQd | WF-SP-01 Inbound Lead Handler Multi-Tenant | /webhook/inbound-lead-v3 | ✅ Activo |
| ln2myAS3406D6F8W | WF-SP-02 WhatsApp AI Concierge | /webhook/894ed1af-89a5-44c9-a340-6e571eacbd53 | ✅ Activo |
| - | WF-SP-03 Follow-Up Engine | - | ❌ Pendiente |

### Base de Datos Supabase
- **URL:** jjpscimtxrudtepzwhag.supabase.co
- **Tablas activas:** leads, lead_events, properties, bookings, transfers
- **Campo slug:** añadido a `properties` con índice
- **Función RPC:** `find_property_by_slug(p_slug TEXT)`

### Integraciones Activas
| Servicio | Estado | Uso |
|----------|--------|-----|
| ChakraHQ WhatsApp | ✅ | Envío/recepción mensajes |
| SendGrid | ✅ | Emails (API key renovada hoy) |
| OpenAI | ✅ | Clasificación de intención |
| Meta WhatsApp Business | ✅ | API directa |

---

## COMPLETADO HOY (5 Enero 2026)

### 1. SendGrid API Key Renovada
- Nueva key configurada en WF-SP-01
- Emails funcionando correctamente

### 2. WF-SP-01 Multi-Tenant Completo
**Arquitectura:**
```
Webhook → Normalizar → Buscar Property → Set Property → Buscar Lead → Merge → Clasificar → Set Intent → Switch Lead
                                                                                                          ↓
                                                                                              ┌───────────┴───────────┐
                                                                                              ↓                       ↓
                                                                                            New                   Existing
                                                                                              ↓                       ↓
                                                                                           INSERT                  UPDATE
                                                                                              ↓                       ↓
                                                                                         Log Created            Log Received
                                                                                              └──────→ Switch Canal ←──────┘
                                                                                                            ↓
                                                                                                  ┌─────────┴─────────┐
                                                                                                  ↓                   ↓
                                                                                              WhatsApp              Other
                                                                                                  ↓                   ↓
                                                                                                  ↓              Check Email
                                                                                                  ↓                   ↓
                                                                                                  └─────→ Respond ←───┘
```

**Capacidades:**
- ✅ Busca tenant/property por slug (multi-cliente)
- ✅ Clasifica intención con AI (info/price/availability/booking)
- ✅ Registra leads con scoring automático
- ✅ Envía WhatsApp o Email según canal
- ✅ Property name dinámico en mensajes

### 3. Especificación API Documentada
- Schema JSON para formulario web
- 3 tipos de request: info, availability, contact

### 4. Reglas de Follow-Up Definidas
- Secuencia completa: 24h → 48h → 72h → 1sem → 2sem → 1mes
- Estados del lead documentados
- Criterios de notificación al owner

---

## SISTEMA DE FOLLOW-UP (WF-SP-03)

### Estados del Lead
```
NEW → ENGAGED → HOT → FOLLOWING_UP → WON / LOST
```

### Secuencia de Follow-Up

| Tiempo | Acción | Tono |
|--------|--------|------|
| **24h** | Mensaje suave | "Solo queríamos saber si tienes alguna pregunta..." |
| **48h** | Recordatorio valor | "Te recordamos que incluye desayuno, piscina privada..." |
| **72h** | Última llamada | "¿Sigues interesado? Estamos aquí para ayudarte" |
| **1 semana** | Re-engagement suave | "Han pasado unos días, ¿podemos ayudarte?" |
| **2 semanas** | Re-engagement + incentivo | "Tenemos disponibilidad para tus fechas" |
| **1 mes** | Último intento | "Hace tiempo que no sabemos de ti..." → LOST si no responde |

### Reglas de Cambio de Estado

| Evento | Nuevo Estado |
|--------|--------------|
| Responde positivo | → HOT |
| Pregunta precios/disponibilidad | → ENGAGED |
| Dice "quiero reservar" | → HOT + notificar owner |
| No responde después de 1 mes | → LOST |
| Dice que no le interesa | → LOST (guardar razón) |
| Hace reserva | → WON |

### Notificar al Owner Cuando

- Lead detectado como HOT
- Estancia > 5 noches o > 2 villas (alto valor)
- Lead HOT no responde después de 72h
- Cliente solicita descuento o negociación

---

## PENDIENTE

### Alta Prioridad (Mañana)
| Tarea | Tiempo | Responsable |
|-------|--------|-------------|
| Formulario web React | 5 min | Claude Code |
| WhatsApp AI Concierge → registrar leads | 15 min | Nosotros |
| Instagram + Facebook integration | 30-45 min | Nosotros |

### Media Prioridad (Esta Semana)
| Tarea | Tiempo | Responsable |
|-------|--------|-------------|
| WF-SP-03 Follow-Up Engine | 2-3h | Nosotros |
| Cron job para follow-ups | 1h | Nosotros |
| Templates de mensajes personalizados | 1h | Nosotros |

### Siguiente Fase
| Tarea | Descripción |
|-------|-------------|
| WF-SP-02 mejorado | AI detecta hot leads, emite eventos |
| Dashboard de ventas | Funnel visual, métricas |
| Owner alerts inteligentes | Notificaciones contextuales |

---

## PRÓXIMAS ACCIONES (Mañana)

1. **Claude Code**: Formulario web con especificación entregada
2. **Nosotros**: Modificar WhatsApp AI Concierge para registrar leads
3. **Nosotros**: Configurar Instagram/Facebook con Meta Graph API
4. **Después**: Implementar WF-SP-03 Follow-Up Engine

---

## DOCUMENTOS GENERADOS

| Documento | Propósito |
|-----------|-----------|
| MY-HOST-BizMate-Estado-Proyecto-2026-01-05.md | Este documento |
| Claude-Code-Formulario-Web-Spec.md | Especificación para formulario web |
| Claude-Code-Automatizacion-Ventas-Follow-Up.md | Reglas de follow-up para Claude Code |
| Prompt-Arranque-Nueva-Sesion.md | Contexto para próxima sesión |

---

## CREDENCIALES ACTIVAS

### n8n
- URL: https://n8n-production-bb2d.up.railway.app

### Supabase
- URL: https://jjpscimtxrudtepzwhag.supabase.co
- Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0

### SendGrid
- API Key: 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

### ChakraHQ
- Bearer Token: qiu1Z9eA3i2hhNjVM3Dm7QEK1Ey6iKQUE5IDWJlsFSAqXk5OlmQoD6DhqEwv9TOdgOVRWSYLWGxm6HfCs2LeCuwiU8Poqrw2Rgmvih0iEawZhoL6TTmMjVjvDUw2WuygAQgQ1vIeLCreDAKOGymGQCuR5bUYDHrRQQrvoMZLYwHw0LaGhFUuf4GxLpQbV3AQj8JDjhP2MzsCUYT4EVCARX6cODl1d1udr4pITGOmHQ793MUBtptq4XCvC8OGD3g

### Meta App
- App ID: 820864327516745
- App Secret: c05b48b386c4206e31efd69c419f68ce

---

## DATOS IZUMI HOTEL

- **Property ID:** 18711359-1378-4d12-9ea6-fb31c0b1bac2
- **Tenant ID:** c24393db-d318-4d75-8bbf-0fa240b9c1db
- **Slug:** izumi-hotel
- **WhatsApp:** +62 813 2576 4867
- **Web:** myhost-bizmate.vercel.app/site/izumi-hotel

---

## MÉTRICAS OBJETIVO

| Métrica | Target |
|---------|--------|
| % leads capturados vs perdidos | > 95% |
| Tiempo respuesta inicial | < 2 min |
| Tasa conversión lead → booking | > 15% |
| Follow-up coverage | 100% leads |

---

*Documento actualizado: 5 Enero 2026, 18:50 SGT*
