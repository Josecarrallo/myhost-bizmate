# Tarea para Claude Code: Formulario de Contacto Web

## Contexto
Tenemos una landing page para Izumi Hotel en:
`myhost-bizmate.vercel.app/site/izumi-hotel`

Necesitamos añadir un formulario de contacto que capture leads y los envíe a nuestro backend.

---

## Endpoint Backend

```
POST https://n8n-production-bb2d.up.railway.app/webhook/inbound-lead-v3
Content-Type: application/json
```

---

## Schema del Request

```json
{
  "slug": "string (required)",
  "channel": "string (required)",
  "request_type": "string (required)",
  
  "name": "string (required)",
  "email": "string (optional)",
  "phone": "string (optional)",
  
  "check_in": "string YYYY-MM-DD (optional)",
  "check_out": "string YYYY-MM-DD (optional)",
  "guests": "number (optional)",
  "villa_ids": ["string array (optional)"],
  
  "message": "string (optional)"
}
```

---

## Tres Casos de Uso

### 1. INFO - Información General
**Campos:** name, email, message
**request_type:** "info"

```json
{
  "slug": "izumi-hotel",
  "channel": "web",
  "request_type": "info",
  "name": "María López",
  "email": "maria@email.com",
  "message": "Me gustaría saber más sobre sus servicios"
}
```

### 2. AVAILABILITY - Consultar Disponibilidad
**Campos:** name, email, check_in, check_out, guests, villa_ids (opcional)
**request_type:** "availability"

```json
{
  "slug": "izumi-hotel",
  "channel": "web",
  "request_type": "availability",
  "name": "Carlos Ruiz",
  "email": "carlos@email.com",
  "check_in": "2026-03-15",
  "check_out": "2026-03-20",
  "guests": 2,
  "villa_ids": ["river-villa"]
}
```

### 3. CONTACT - Contacto Directo WhatsApp
**Campos:** name, phone
**request_type:** "contact"

```json
{
  "slug": "izumi-hotel",
  "channel": "web",
  "request_type": "contact",
  "name": "Ana García",
  "phone": "+34619794604"
}
```

---

## Diseño del Formulario

### UI Sugerida
```
┌─────────────────────────────────────────────┐
│  ¿Cómo podemos ayudarte?                    │
│                                              │
│  ○ Información general                       │
│  ○ Consultar disponibilidad                  │
│  ○ Contactar por WhatsApp                    │
└─────────────────────────────────────────────┘

[Campos dinámicos según selección]

[Botón Enviar]
```

### Validación por Tipo

| request_type | name | email | phone | dates | guests |
|--------------|------|-------|-------|-------|--------|
| info | ✅ | ✅ | ❌ | ❌ | ❌ |
| availability | ✅ | ✅ | ❌ | ✅ | ✅ |
| contact | ✅ | ❌ | ✅ | ❌ | ❌ |

### Acciones Post-Submit

| request_type | Acción Frontend |
|--------------|-----------------|
| info | Mostrar "Gracias, te contactaremos pronto" |
| availability | Mostrar "Te enviamos la información a tu email" |
| contact | Redirigir a `wa.me/6281325764867?text=Hola...` |

---

## Response del Backend

### Success (200)
```json
{
  "success": true,
  "lead_id": "uuid",
  "message": "Lead processed"
}
```

### Error (400/500)
```json
{
  "success": false,
  "error": "Error description"
}
```

---

## Notas Importantes

1. El `slug` viene de la URL: `/site/izumi-hotel` → slug = "izumi-hotel"
2. El `channel` siempre es "web" para este formulario
3. El formulario debe estar integrado en la landing page existente
4. Usar el mismo estilo visual (glassmorphism, Tailwind)
5. Mobile-first responsive

---

## Integración con Villa Cards

Cuando el usuario hace click en "View Details" de una villa, se puede abrir el formulario de disponibilidad con esa villa pre-seleccionada:

```json
{
  "villa_ids": ["river-villa"]
}
```

---

## Test Command (PowerShell)

```powershell
Invoke-WebRequest -Uri "https://n8n-production-bb2d.up.railway.app/webhook/inbound-lead-v3" -Method POST -ContentType "application/json" -Body '{"slug":"izumi-hotel","channel":"web","request_type":"info","name":"Test User","email":"test@test.com","message":"Test message"}' -UseBasicParsing
```
