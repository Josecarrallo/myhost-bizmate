# MY HOST BizMate - Estado Completo del Proyecto
## Fecha: 13 Diciembre 2025

---

## 1. RESUMEN EJECUTIVO

MY HOST BizMate es un SaaS de automatización WhatsApp AI para hoteles boutique y villas en Indonesia/SE Asia. El sistema permite a propietarios pequeños (1-3 propiedades) ofrecer atención 24/7 mediante inteligencia artificial.

### Cliente Piloto: Izumi Hotel (Ubud, Bali)
- WhatsApp: +62 813 2576 4867
- Property ID: 18711359-1378-4d12-9ea6-fb31c0b1bac2

---

## 2. INFRAESTRUCTURA

| Servicio | URL/Detalle | Estado |
|----------|-------------|--------|
| **n8n** | https://n8n-production-bb2d.up.railway.app | ✅ Activo |
| **Supabase** | https://jjpscimtxrudtepzwhag.supabase.co | ✅ Activo |
| **ChakraHQ** | Plugin ID: 2e45a0bd-8600-41b4-ac92-599d59d6221c | ✅ Activo |
| **Frontend** | Vercel (pendiente deploy) | 🔄 En desarrollo |

---

## 3. AGENTES IMPLEMENTADOS

### Agente 1: WhatsApp AI Agent
| Campo | Valor |
|-------|-------|
| Workflow ID | ln2myAS3406D6F8W |
| Estado | ✅ Activo |
| Función | Atención 24/7 vía WhatsApp con GPT-4.1-mini |
| Trigger | Webhook ChakraHQ |

**Capacidades:**
- Responder consultas sobre el hotel
- Verificar disponibilidad en tiempo real
- Calcular precios
- Crear reservas en Supabase
- Memoria de conversación

### Agente 2: Booking Notification Complete
| Campo | Valor |
|-------|-------|
| Workflow ID | F8YPuLhcNe6wGcCv |
| Estado | ✅ Activo |
| Función | Notificar reservas a huésped + staff |
| Trigger | Supabase Database Webhook (INSERT en bookings) |

**Flujo:**
```
INSERT bookings → Webhook → Format Data → Get Property Info
                                                │
                                         ┌──────┴──────┐
                                         ▼             ▼
                                  WhatsApp Guest  WhatsApp Staff
                                         │             │
                                         └──────┬──────┘
                                                ▼
                                        Respond Webhook
```

---

## 4. CREDENCIALES

### ChakraHQ
```
Plugin ID: 2e45a0bd-8600-41b4-ac92-599d59d6221c
Phone ID: 944855278702577
Access Token: qiu1Z9eA3i2hhNjVM3Dm7QEK1Ey6iKQUE5IDWJlsFSAqXk5OlmQoD6DhqEwv9TOdgOVRWSYLWGxm6HfCs2LeCuwiU8Poqrw2Rgmvih0iEawZhoL6TTmMjVjvDUw2WuygAQgQ1vIeLCreDAKOGymGQCuR5bUYDHrRQQrvoMZLYwHw0LaGhFUuf4GxLpQbV3AQj8JDjhP2MzsCUYT4EVCARX6cODl1d1udr4pITGOmHQ793MUBtptq4XCvC8OGD3g
```

### Supabase
```
URL: https://jjpscimtxrudtepzwhag.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0
```

### Webhook Supabase
```
Name: new_booking_notification
Table: bookings
Event: INSERT
Method: POST
URL: https://n8n-production-bb2d.up.railway.app/webhook/new-booking-notification
```

---

## 5. BASE DE DATOS (Supabase)

### Tablas principales
- `properties` - Hoteles/villas registradas
- `bookings` - Reservas
- `room_types` - Tipos de habitación
- `room_availability` - Disponibilidad por fecha
- `guests` - Huéspedes
- `conversations` - Historial de conversaciones WhatsApp

---

## 6. PRIORIDADES PENDIENTES

### ✅ Completado
- [x] WhatsApp AI Agent funcionando
- [x] Booking Notification con mensajes paralelos
- [x] Integración ChakraHQ + Supabase + n8n

### 🔄 En progreso
- [ ] Funcionalidades multimodal (audio/imagen/PDF)
- [ ] Arquitectura multi-tenant
- [ ] Frontend en Vercel

### 📋 Pendiente
- [ ] Dashboard para propietarios
- [ ] Sistema de pagos
- [ ] Onboarding automatizado

---

## 7. COMANDO SQL DE PRUEBA

```sql
INSERT INTO bookings (property_id, guest_name, guest_email, guest_phone, check_in, check_out, guests, total_price, status, channel) 
VALUES ('18711359-1378-4d12-9ea6-fb31c0b1bac2', 'Jose Test', 'jose@test.com', '+34619794604', '2026-10-01', '2026-10-05', 2, 2000, 'confirmed', 'direct');
```

---

**Última actualización:** 13 Diciembre 2025
