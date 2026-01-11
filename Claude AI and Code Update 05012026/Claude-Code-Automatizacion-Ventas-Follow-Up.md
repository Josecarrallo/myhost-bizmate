# Tarea para Claude Code: Sistema de Follow-Up Automático

## Contexto

Estamos automatizando completamente el proceso de ventas de MY HOST BizMate. Ya tenemos funcionando:

- **WF-SP-01**: Captura de leads desde Web, WhatsApp, Instagram, Facebook
- **Tabla `leads`** en Supabase con estados y eventos
- **Tabla `lead_events`** para tracking de toda la actividad

Ahora necesitamos implementar el **motor de follow-up automático** que convierta leads en reservas.

---

## Arquitectura del Sistema de Ventas

```
Cliente contacta (Web/WhatsApp/IG/FB)
            ↓
    WF-SP-01 (Captura y clasifica)
            ↓
    Tabla leads (status: NEW)
            ↓
    AI responde en tiempo real
            ↓
    Si no cierra...
            ↓
┌─────────────────────────────────────┐
│   FOLLOW-UP ENGINE (WF-SP-03)       │
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

## Estados del Lead

```
NEW → ENGAGED → HOT → FOLLOWING_UP → WON / LOST
```

| Estado | Significado |
|--------|-------------|
| NEW | Acaba de contactar |
| ENGAGED | Ha interactuado, muestra interés |
| HOT | Alta probabilidad de reserva |
| FOLLOWING_UP | En secuencia de seguimiento |
| WON | Reservó |
| LOST | No reservó (guardar razón) |

---

## Reglas de Follow-Up

### Secuencia Temporal

| Tiempo sin respuesta | Acción | Tono del mensaje |
|---------------------|--------|------------------|
| **24 horas** | Mensaje suave | "Solo queríamos saber si tienes alguna pregunta sobre tu estancia..." |
| **48 horas** | Recordatorio valor | "Te recordamos que nuestra villa incluye desayuno, piscina privada..." |
| **72 horas** | Última llamada activa | "¿Sigues interesado en visitarnos? Estamos aquí para ayudarte" |
| **1 semana** | Re-engagement suave | "Han pasado unos días, ¿podemos ayudarte con tu reserva?" |
| **2 semanas** | Re-engagement + incentivo | "Tenemos disponibilidad para tus fechas. ¿Te gustaría que te reservemos?" |
| **1 mes** | Último intento | "Hace tiempo que no sabemos de ti. ¿Aún planeas visitar Bali?" → Si no responde → LOST |

### Reglas de Cambio de Estado

| Evento | Nuevo Estado |
|--------|--------------|
| Cliente responde positivo | → HOT |
| Cliente pregunta precios/disponibilidad | → ENGAGED |
| Cliente dice "quiero reservar" | → HOT + notificar owner |
| Cliente no responde después de 1 mes | → LOST |
| Cliente dice que no le interesa | → LOST (guardar razón) |
| Cliente hace reserva | → WON |

### Notificar al Owner Cuando

- Lead detectado como HOT
- Estancia > 5 noches o > 2 villas (alto valor)
- Lead HOT no responde después de 72h
- Cliente solicita descuento o negociación

---

## Eventos del Sistema

### Eventos que disparan Follow-Up

| Evento | Trigger |
|--------|---------|
| `lead_created` | Nuevo lead → iniciar secuencia |
| `no_response_24h` | Sin respuesta 24h → mensaje suave |
| `no_response_48h` | Sin respuesta 48h → recordatorio valor |
| `no_response_72h` | Sin respuesta 72h → última llamada |
| `no_response_1w` | Sin respuesta 1 semana → re-engagement |
| `no_response_2w` | Sin respuesta 2 semanas → incentivo |
| `no_response_1m` | Sin respuesta 1 mes → último intento |

### Eventos que detienen Follow-Up

| Evento | Acción |
|--------|--------|
| `lead_responded` | Pausar secuencia, evaluar respuesta |
| `lead_converted` | Marcar WON, detener todo |
| `lead_lost` | Marcar LOST, detener todo |

---

## Estructura de Datos Requerida

### Campos en tabla `leads` (ya existe)

```sql
-- Campos relevantes para follow-up
status TEXT,              -- NEW, ENGAGED, HOT, FOLLOWING_UP, WON, LOST
last_contact_at TIMESTAMPTZ,
next_followup_at TIMESTAMPTZ,
followup_count INTEGER DEFAULT 0,
lost_reason TEXT
```

### Campos adicionales sugeridos

```sql
ALTER TABLE leads ADD COLUMN IF NOT EXISTS followup_stage TEXT;
-- Valores: '24h', '48h', '72h', '1w', '2w', '1m', 'completed'

ALTER TABLE leads ADD COLUMN IF NOT EXISTS followup_count INTEGER DEFAULT 0;
```

---

## Personalización de Mensajes

Cada mensaje debe incluir:

- **Nombre del cliente**: "Hola María..."
- **Fechas consultadas**: "...para tu estancia del 15 al 20 de marzo..."
- **Tipo de villa**: "...en nuestra River Villa..."
- **Nombre del hotel**: "...en Izumi Hotel"
- **WhatsApp de contacto**: "+62 813 2576 4867"

---

## Canales de Follow-Up

| Canal original | Follow-up por |
|----------------|---------------|
| WhatsApp | WhatsApp |
| Web (con email) | Email |
| Web (con teléfono) | WhatsApp |
| Instagram | Instagram DM (si disponible) o Email |

---

## Métricas a Trackear

| Métrica | Objetivo |
|---------|----------|
| Tasa de respuesta por etapa | Optimizar mensajes |
| Tiempo promedio a conversión | Reducir ciclo de venta |
| % leads que llegan a LOST | Reducir pérdidas |
| % conversión por canal | Priorizar canales |
| Efectividad de cada mensaje | A/B testing futuro |

---

## Implementación Sugerida

### Opción A: Cron Job + Estado
- Cron cada hora revisa `next_followup_at`
- Si pasó la fecha, ejecuta acción correspondiente
- Actualiza `next_followup_at` al siguiente paso

### Opción B: Event-Driven
- Cada evento de lead dispara evaluación
- Sistema calcula siguiente acción
- Programa siguiente follow-up

---

## Prioridad

Este sistema es **CRÍTICO** para el negocio. Sin follow-up automático:
- Se pierden ventas
- Los leads se enfrían
- El owner no puede hacer seguimiento manual de todos

**El Follow-Up Engine es el que CIERRA ventas.**

---

## Datos de Conexión

- **Supabase**: jjpscimtxrudtepzwhag.supabase.co
- **n8n**: https://n8n-production-bb2d.up.railway.app
- **Tenant ID**: c24393db-d318-4d75-8bbf-0fa240b9c1db
- **Property ID**: 18711359-1378-4d12-9ea6-fb31c0b1bac2
