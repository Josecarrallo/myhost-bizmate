# MY HOST BizMate - Documentación OSIRIS V2
## Actualizado: 22 Enero 2026

---

## ✅ COMPLETADO HOY - OSIRIS V2

### Resumen
Se creó el workflow **WF-IA-01 - OSIRIS AI Assistant V2** con arquitectura de AI Agent + Tools dinámicos, reemplazando la arquitectura rígida de V1.

### Workflow
- **ID:** v8icxH6TOdCKO823
- **Nombre:** WF-IA-01 - OSIRIS AI Assistant V2 - MYHOST Bizmate XIII
- **Estado:** Activo ✅
- **Endpoint:** `POST /webhook/ai/chat-v2`

### Arquitectura V2
```
Webhook POST → Normalize Input → AI Agent (GPT-4o) → Format Response → Respond to Webhook
                                       ↓
                               8 Tools conectados:
                               - get_dashboard_kpis (RPC)
                               - get_pending_payments (REST)
                               - get_bookings (REST)
                               - get_leads (REST)
                               - get_checkins_today (RPC)
                               - get_property_stats (REST)
                               - get_guests (REST)
                               - get_alerts (RPC)
```

### Ventajas sobre V1
| V1 (Anterior) | V2 (Nuevo) |
|---------------|------------|
| Fetch ALL data siempre | Fetch dinámico según pregunta |
| 17 KPIs fijos | Tools ilimitados |
| Solo bookings, properties, alerts | Acceso a payments, leads, guests, etc. |
| No escalable | Agregar tools es trivial |

### Endpoint de Integración

**URL:**
```
POST https://n8n-production-bb2d.up.railway.app/webhook/ai/chat-v2
```

**Request Body:**
```json
{
  "tenant_id": "c24393db-d318-4d75-8bbf-0fa240b9c1db",
  "message": "pregunta del usuario"
}
```

**Response:**
```json
{
  "reply": "texto de respuesta",
  "agent": "osiris",
  "intent": "insight",
  "kpis": null,
  "table": null,
  "actions": [],
  "meta": {
    "module": "dashboard",
    "sources": ["ai_agent_tools"],
    "version": "v2"
  }
}
```

### Función Supabase Actualizada
Se modificó `get_dashboard_stats` para aceptar parámetro `p_tenant_id` (UUID).
- Usa `owner_id` de properties para filtrar por tenant
- Compatible con arquitectura multi-tenant

### Pruebas Validadas
| Prueba | Resultado |
|--------|-----------|
| KPIs generales | ✅ $506,900 revenue, 59.09% ocupación |
| Pagos pendientes | ✅ "No hay pagos pendientes" |
| Reserva específica (Jose Carraro diciembre) | ✅ Encontró: 1-10 dic, $4,500, River Villa |
| Reservas canceladas | ✅ Encontró: Perez, 26-28 dic, $900 |
| Conteo por canal (voice_ai) | ✅ 33 reservas |

---

## 📋 TEMAS PENDIENTES

### 1. Resend/Brevo + Namecheap DNS
- Configurar dominio personalizado para emails
- DNS records en Namecheap
- Verificación de dominio en Resend/Brevo

### 2. Voces 11Labs desde VAPI
- Integrar voces de ElevenLabs en VAPI
- Configurar voice_id en asistente KORA
- Probar calidad de voz

### 3. Templates ChakraHQ
- Crear templates de mensajes WhatsApp
- Configurar variables dinámicas
- Aprobar templates en Meta

### 4. Integración Dashboard
- Cambiar endpoint de `/ai/chat` a `/ai/chat-v2` en frontend
- Actualizar componente chat OSIRIS

### 5. RLS (Row Level Security)
- Implementar políticas RLS para multi-tenant
- Crítico antes de producción comercial

---

## 🚀 PROMPT DE ARRANQUE - 23 ENERO 2026

```
Continuamos con MY HOST BizMate. Ayer completamos OSIRIS V2 con arquitectura AI Agent + Tools.

ESTADO ACTUAL:
- OSIRIS V2: ✅ Funcionando en /webhook/ai/chat-v2
- KORA: ✅ Funcionando (voice booking)
- WF-SP-01 Lead Handler: ✅ Activo
- WF-KORA-POST-CALL v2: ✅ Activo

PENDIENTES PARA HOY (elige uno):
1. Resend/Brevo + Namecheap DNS - Configurar emails con dominio propio
2. 11Labs + VAPI - Integrar voces de ElevenLabs
3. ChakraHQ Templates - Crear templates WhatsApp
4. Dashboard - Integrar OSIRIS V2 en frontend
5. RLS - Implementar Row Level Security

DATOS CLAVE:
- Tenant ID: c24393db-d318-4d75-8bbf-0fa240b9c1db
- Property ID: 18711359-1378-4d12-9ea6-fb31c0b1bac2
- OSIRIS V2 Workflow ID: v8icxH6TOdCKO823
- n8n: https://n8n-production-bb2d.up.railway.app
- Supabase: https://jjpscimtxrudtepzwhag.supabase.co

¿Por cuál empezamos?
```

---

## 📊 WORKFLOWS ACTIVOS

| ID | Nombre | Endpoint | Estado |
|----|--------|----------|--------|
| v8icxH6TOdCKO823 | OSIRIS AI Assistant V2 | /webhook/ai/chat-v2 | ✅ Activo |
| iAMo7NdzYkJxJUkP | OSIRIS AI Assistant V1 | /webhook/ai/chat | ✅ Activo (legacy) |
| gsMMQrc9T2uZ7LVA | KORA POST-CALL v2 | /webhook/kora-post-call-v2 | ✅ Activo |
| CBiOKCQ7eGnTJXQd | Lead Handler | /webhook/inbound-lead-v3 | ✅ Activo |

---

## 🔧 COMANDOS ÚTILES

**Probar OSIRIS V2 (PowerShell):**
```powershell
$body = @{ tenant_id = "c24393db-d318-4d75-8bbf-0fa240b9c1db"; message = "¿Cómo va mi negocio?" } | ConvertTo-Json
$response = Invoke-RestMethod -Uri "https://n8n-production-bb2d.up.railway.app/webhook/ai/chat-v2" -Method Post -ContentType "application/json" -Body $body
$response.reply
```

**Verificar función Supabase:**
```sql
SELECT * FROM get_dashboard_stats('c24393db-d318-4d75-8bbf-0fa240b9c1db'::uuid);
```

---

## 📝 NOTAS TÉCNICAS

### Errores Resueltos Hoy
1. **"Could not get parameter"** en OpenAI node → Seleccionar modelo del dropdown, no escribir manual
2. **"Could not find function get_dashboard_stats(p_tenant_id)"** → Función no aceptaba parámetro, se actualizó
3. **"column p.tenant_id does not exist"** → La tabla properties usa `owner_id`, no `tenant_id`

### Lecciones Aprendidas
- Los httpRequestTool en n8n no deben tener `=` al inicio del URL si es texto fijo
- Las funciones RPC de Supabase requieren coincidencia exacta de parámetros
- El AI Agent de n8n necesita `promptType` y `text` configurados correctamente
