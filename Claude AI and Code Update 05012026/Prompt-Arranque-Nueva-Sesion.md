# Prompt de Arranque - Nueva Sesión MY HOST BizMate

## Contexto del Proyecto

Soy Jose, fundador de MY HOST BizMate, una plataforma SaaS de automatización para hoteles boutique y villas en el Sudeste Asiático. Mi cliente piloto es Izumi Hotel (7 villas de lujo en Ubud, Bali, apertura verano 2026).

Estoy desarrollando un sistema completo de gestión de huéspedes con IA que incluye:
- Captura de leads multi-canal (Web, WhatsApp, Instagram, Facebook)
- Asistente de voz con VAPI
- Concierge AI por WhatsApp
- Automatización del guest journey completo

## Estado Actual (5 Enero 2026)

### ✅ Funcionando
- **WF-SP-01** (ID: CBiOKCQ7eGnTJXQd): Inbound Lead Handler Multi-Tenant
  - Endpoint: `/webhook/inbound-lead-v3`
  - Busca property por slug
  - Clasifica intención con AI
  - Registra leads en Supabase
  - Envía WhatsApp o Email según canal

- **WhatsApp AI Concierge** (ID: ln2myAS3406D6F8W): Activo pero NO registra leads

- **Supabase**: Base de datos con leads, properties (con campo slug), bookings

- **Landing Page**: myhost-bizmate.vercel.app/site/izumi-hotel

### ❌ Pendiente
1. **Formulario web React** - Especificación lista, Claude Code debe implementarlo
2. **Modificar WhatsApp AI Concierge** - Debe llamar a WF-SP-01 para registrar leads
3. **Instagram + Facebook integration** - Conectar Meta Graph API

## Credenciales

- **n8n**: https://n8n-production-bb2d.up.railway.app
- **Supabase**: jjpscimtxrudtepzwhag.supabase.co
- **Izumi Hotel slug**: izumi-hotel
- **WF-SP-01 endpoint**: /webhook/inbound-lead-v3

## Próximas Tareas

1. Entregar especificación a Claude Code para formulario web
2. Modificar WhatsApp AI Concierge para registrar leads en WF-SP-01
3. Configurar Instagram/Facebook con Meta Graph API

## Arquitectura Multi-Tenant

El sistema ahora funciona con slugs:
- Web URL: `/site/izumi-hotel` → extrae slug
- Formulario envía: `{ "slug": "izumi-hotel", ... }`
- WF-SP-01 busca tenant_id y property_id automáticamente
- Esto permite añadir nuevos clientes sin modificar workflows

## Request Schema para WF-SP-01

```json
{
  "slug": "izumi-hotel",
  "channel": "web | whatsapp | instagram | facebook",
  "request_type": "info | availability | contact",
  "name": "...",
  "email": "...",
  "phone": "...",
  "message": "...",
  "check_in": "YYYY-MM-DD",
  "check_out": "YYYY-MM-DD",
  "guests": 2,
  "villa_ids": ["river-villa"]
}
```

## Notas Importantes

- Nomenclatura de nodos n8n: SIMPLE, sin números decimales ni versiones (ej: "Normalizar", "Buscar Lead", "Switch Canal")
- Siempre crear workflows nuevos completos, no parchear nodo a nodo
- Verificar referencias a nodos ($('NombreNodo')) coincidan exactamente con nombres reales
