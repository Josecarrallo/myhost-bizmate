# Tarea: Formulario de Contacto Web para Izumi Hotel

## Contexto

Tenemos una landing page para Izumi Hotel en:
```
https://myhost-bizmate.vercel.app/site/izumi-hotel
```

Necesitamos añadir un formulario de contacto que capture leads y los envíe a nuestro backend.

---

## Endpoint Backend

```
POST https://n8n-production-bb2d.up.railway.app/webhook/inbound-lead-v3
Content-Type: application/json
```

---

## Tres Casos de Uso

El formulario debe soportar 3 tipos de consulta diferentes:

### 1. INFO - Información General
**Campos:** name, email, message

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

### Campos por Tipo de Request

| request_type | name | email | phone | check_in | check_out | guests | villa_ids | message |
|--------------|------|-------|-------|----------|-----------|--------|-----------|---------|
| info         | ✅   | ✅    | ❌    | ❌       | ❌        | ❌     | ❌        | ✅      |
| availability | ✅   | ✅    | ❌    | ✅       | ✅        | ✅     | ⚪ opcional| ❌      |
| contact      | ✅   | ❌    | ✅    | ❌       | ❌        | ❌     | ❌        | ❌      |

---

## Acciones Post-Submit

| request_type | Acción en el Frontend |
|--------------|----------------------|
| info         | Mostrar mensaje: "Gracias, te contactaremos pronto" |
| availability | Mostrar mensaje: "Te enviamos la información a tu email" |
| contact      | Redirigir a: `https://wa.me/6281325764867?text=Hola,%20soy%20{name},%20quiero%20información%20sobre%20Izumi%20Hotel` |

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

## Villas Disponibles (para selector villa_ids)

Si implementas un selector de villas, estos son los IDs:

| Villa | ID |
|-------|-----|
| River Villa | river-villa |
| Garden Villa | garden-villa |
| Forest Villa | forest-villa |
| Sunrise Villa | sunrise-villa |
| Sunset Villa | sunset-villa |
| Mountain Villa | mountain-villa |
| Valley Villa | valley-villa |

---

## Notas Importantes

1. **slug**: Se extrae de la URL → `/site/izumi-hotel` → `slug = "izumi-hotel"`
2. **channel**: Siempre es `"web"` para este formulario
3. **Estilo**: Mantener el estilo visual existente (glassmorphism, Tailwind, mobile-first)
4. **Integración con Villa Cards**: Cuando el usuario hace click en "View Details" de una villa, se puede abrir el formulario de disponibilidad con esa villa pre-seleccionada

---

## Test Command (PowerShell)

Para probar que el backend funciona:

```powershell
Invoke-WebRequest -Uri "https://n8n-production-bb2d.up.railway.app/webhook/inbound-lead-v3" -Method POST -ContentType "application/json" -Body '{"slug":"izumi-hotel","channel":"web","request_type":"info","name":"Test User","email":"test@test.com","message":"Test message"}' -UseBasicParsing
```

---

## Resumen

Crear un formulario React con:
1. Selector de tipo de consulta (radio buttons)
2. Campos dinámicos según selección
3. Validación de campos requeridos
4. POST al endpoint con el JSON correspondiente
5. Feedback visual al usuario según el tipo de request
