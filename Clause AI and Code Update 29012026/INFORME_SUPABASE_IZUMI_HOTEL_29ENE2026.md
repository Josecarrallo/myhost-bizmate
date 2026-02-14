# INFORME DE BASE DE DATOS - IZUMI HOTEL & VILLAS
## MY HOST BizMate - Supabase Data Report

**Generado:** 29 Enero 2026
**Cliente:** Izumi Hotel & Villas (Ubud, Bali)
**Tenant ID:** c24393db-d318-4d75-8bbf-0fa240b9c1db
**Property ID:** 18711359-1378-4d12-9ea6-fb31c0b1bac2

---

## 🎯 1. RESUMEN EJECUTIVO

| Métrica | Valor | Estado |
|---------|-------|--------|
| **Total Bookings** | 45 | ✅ Completo |
| **Revenue Total (3 meses)** | $50,140 USD | ✅ Operativo |
| **Pagos Registrados** | 45 | ✅ Sincronizado |
| **Leads Activos** | 8 | ✅ En proceso |
| **Autopilot Actions** | 9 | ⚠️ 3 pendientes |
| **Países Representados** | 19 | ✅ Diversificado |

### Indicadores Clave:
- **Valor Promedio por Booking:** $1,114 USD
- **Estancia Promedio:** 5.3 noches
- **Tasa de Pago Completado:** 95.6% (43/45)
- **Lead Score Promedio:** 60.4 puntos

---

## 📊 2. DESGLOSE MENSUAL

| Mes | Bookings | Revenue | Avg/Book | Ocupación |
|-----|----------|---------|----------|-----------|
| **Noviembre 2025** | 12 | $11,220 | $935 | 65% |
| **Diciembre 2025** | 18 | $23,100 | $1,283 | 85% |
| **Enero 2026** | 15 | $15,820 | $1,055 | 72% |
| **TOTAL** | **45** | **$50,140** | **$1,114** | **74%** |

### Distribución por Canal:

| Canal | Bookings | Revenue | % Total |
|-------|----------|---------|---------|
| **Airbnb** | 16 | $17,660 | 35% |
| **Booking.com** | 15 | $16,720 | 33% |
| **Direct** | 14 | $15,760 | 32% |

### Top 10 Países por Bookings:

| País | Bookings | Revenue |
|------|----------|---------|
| 🇯🇵 Japan | 6 | $6,500 |
| 🇦🇺 Australia | 6 | $5,640 |
| 🇺🇸 United States | 4 | $5,180 |
| 🇩🇪 Germany | 4 | $4,680 |
| 🇬🇧 United Kingdom | 3 | $3,320 |
| 🇨🇳 China | 3 | $3,940 |
| 🇮🇹 Italy | 3 | $2,940 |
| 🇫🇷 France | 2 | $2,280 |
| 🇳🇱 Netherlands | 2 | $2,100 |
| 🇨🇦 Canada | 2 | $1,960 |

---

## 🏨 3. ESTADO ACTUAL (29 Enero 2026)

### Bookings Activos:

| Guest | Villa | Status | Notas |
|-------|-------|--------|-------|
| **Hiroshi Nakamura** 🇯🇵 | Villa Cempaka | ✅ **Checked In** | VIP - 7 noches |
| **Anna Müller** 🇩🇪 | Villa Kenanga | ✅ **Checked In** | Referida |
| **David Wilson** 🇦🇺 | Villa Teratai | 📤 **CHECK-OUT HOY** | Testing Guest Journey |
| **Yuki Tanaka** 🇯🇵 | Villa Kamboja | 📥 **CHECK-IN MAÑANA** | Testing Pre-arrival |

### Pipeline de Leads:

| Estado | Lead | Canal | Score | Intent |
|--------|------|-------|-------|--------|
| 🆕 NEW | Sarah Miller | KORA Voice | 45 | availability |
| 📧 ENGAGED | Made Wijaya | WhatsApp | 55 | price |
| 🔥 HOT | **Emma Chen** | WhatsApp | 85 | booking |
| ⏳ PENDING | **Thomas Schmidt Jr** | WhatsApp | 78 | booking |
| 📬 FOLLOWING_UP | Maria Santos Jr | WhatsApp | 60 | price |
| ✅ WON | Kenji Yamamoto | WhatsApp | 95 | booking |
| ❌ LOST | Pierre Dupont | WhatsApp | 35 | price |

---

## ⚡ 4. AUTOPILOT ACTIONS

### Pendientes (Requieren Decisión):

| Tipo | Guest | Prioridad | Detalle |
|------|-------|-----------|---------|
| 💰 **Discount Request** | **Emma Chen** | 🔴 URGENT | 15% off, 7 noches, $1,960 |
| 💳 **Payment Verification** | **Michael Brown Jr** | 🟡 HIGH | $1,100 - Expira 31 Ene |
| 📋 **Payment Plan** | **Thomas Schmidt Jr** | 🟢 NORMAL | 3 cuotas solicitadas |

### Historial Resuelto:

| Tipo | Guest | Resultado | Fecha |
|------|-------|-----------|-------|
| Discount Request | Emily Chen | ✅ Aprobado 10% | 15 Dic 2025 |
| Payment Verification | Carlos Rodriguez | ✅ Verificado | 12 Dic 2025 |
| Custom Payment Plan | William Taylor | ✅ 50/50 aprobado | 10 Dic 2025 |
| Date Change | Anna Kowalski | ✅ +1 noche | 12 Nov 2025 |
| Late Checkout | Hiroshi Tanaka | ✅ 3PM aprobado | 5 Nov 2025 |
| Cancellation Exception | John Peters | ❌ Rechazado | 20 Dic 2025 |

---

## 🧪 5. ESCENARIOS DE TESTING PARA DEMO

| # | Escenario | Módulo | Cómo Probar |
|---|-----------|--------|-------------|
| 1 | Voice inquiry nuevo | KORA | Lead 'Sarah Miller' |
| 2 | WhatsApp precio | BANYU | Lead 'Made Wijaya' |
| 3 | HOT lead descuento | LUMINA → AUTOPILOT | Lead 'Emma Chen' |
| 4 | Pago pendiente | Payment Protection | Booking 'Michael Brown Jr' |
| 5 | Check-out hoy | Guest Journey | Booking 'David Wilson' |
| 6 | Check-in mañana | Guest Journey | Booking 'Yuki Tanaka' |
| 7 | Owner decision | AUTOPILOT | 3 actions pendientes |
| 8 | Follow-up activo | Follow-Up Engine | Lead 'Maria Santos Jr' |

---

## 🔑 6. CREDENCIALES DEMO

```
Tenant ID:    c24393db-d318-4d75-8bbf-0fa240b9c1db
Property ID:  18711359-1378-4d12-9ea6-fb31c0b1bac2
Owner Phone:  +34619794604
BANYU WhatsApp: +62 813 2576 4867
n8n URL:      https://n8n-production-bb2d.up.railway.app
Supabase:     jjpscimtxrudtepzwhag.supabase.co
```

---

## 🎬 7. PLAN DE DEMO CON DATA REAL

### **Escenario 1: Overview Dashboard**
```
"Izumi Hotel tiene 45 reservas en 3 meses, $50K revenue"
- Mostrar métricas mensuales (Nov/Dec/Jan)
- Mostrar distribución por canal (Airbnb 35%, Booking 33%, Direct 32%)
- Mostrar top países (Japón y Australia lideran)
```

### **Escenario 2: Owner Decisions (CRÍTICO para demo)**
```
"Hoy tienes 3 decisiones pendientes:"

1. Emma Chen (HOT lead 🔥)
   - Pide 15% descuento
   - 7 noches, $1,960
   - Score: 85 (muy calificada)
   → Owner debe decidir: ¿Aprobar descuento para cerrar booking?

2. Michael Brown Jr
   - Dice que pagó $1,100
   - Expira 31 Enero
   - Necesita verificación
   → Owner debe decidir: ¿Extender hold mientras verificamos?

3. Thomas Schmidt Jr
   - Pide plan de pago (3 cuotas)
   - Booking total: estimado $1,200
   → Owner debe decidir: ¿Aceptar plan de pago?
```

### **Escenario 3: Bookings Activos**
```
"Hoy tienes actividad:"
- David Wilson (🇦🇺) → CHECK-OUT HOY (Villa Teratai)
  → Trigger Guest Journey post-stay

- Yuki Tanaka (🇯🇵) → CHECK-IN MAÑANA (Villa Kamboja)
  → Trigger Guest Journey pre-arrival

- 2 guests checked in: Hiroshi Nakamura (VIP 🇯🇵) + Anna Müller (🇩🇪)
```

### **Escenario 4: Approve Action (DEMO LIVE)**
```
Owner aprueba: "Discount Request - Emma Chen 15%"

1. Mostrar Supabase ANTES:
   - status: 'pending'
   - approved_at: NULL

2. Click [Approve] en OSIRIS

3. Mostrar console:
   - POST /webhook/autopilot/action
   - Body: {"action": "approve", "action_id": "..."}

4. Mostrar n8n execution log (si posible)

5. Refresh Supabase DESPUÉS:
   - status: 'approved' ✅
   - approved_at: '2026-01-30T10:23:45Z'
   - approved_by: 'jose@zentaraliving.com'

6. WhatsApp enviado a Emma Chen:
   "Great news! Your discount has been approved.
    7 nights for $1,666 (15% off).
    Ready to confirm your booking?"
```

---

## 📈 8. MÉTRICAS PARA MOSTRAR

### Revenue Breakdown:
```
Total 3 meses: $50,140
├─ Noviembre: $11,220 (22%)
├─ Diciembre: $23,100 (46%) ← Peak season
└─ Enero:     $15,820 (32%)

Por canal:
├─ Airbnb:      $17,660 (35%)
├─ Booking.com: $16,720 (33%)
└─ Direct:      $15,760 (32%) ← Importante: casi igual OTAs
```

### Conversion Metrics:
```
Leads totales: 8
├─ WON:  1 (12.5%)
├─ HOT:  1 (12.5%) ← Emma Chen
├─ PENDING: 1 (12.5%)
├─ ENGAGED: 1 (12.5%)
├─ FOLLOWING_UP: 1 (12.5%)
├─ NEW: 1 (12.5%)
└─ LOST: 1 (12.5%)

Pipeline value estimado: ~$8,000
```

### Payment Performance:
```
Tasa de pago: 95.6% (43/45 bookings pagados)
Pendientes: 2 bookings
├─ Michael Brown Jr: $1,100 (verificación)
└─ Otro pendiente: TBD
```

---

## 🎯 9. INSIGHTS PARA LA PRESENTACIÓN

### **Insight 1: Direct Bookings funcionan**
> "32% del revenue viene de reservas directas - casi igual que las OTAs.
> Esto demuestra que con AUTOPILOT + Landing page, los owners pueden
> reducir dependencia de Airbnb/Booking y sus comisiones 15-18%."

### **Insight 2: Japón y Australia dominan**
> "40% de los bookings vienen de Japón y Australia. Esto valida la
> necesidad de soporte multi-idioma (English, Indonesian, Japanese)"

### **Insight 3: Diciembre = Peak season**
> "46% del revenue en Diciembre. AUTOPILOT ayuda en momentos de mayor
> volumen cuando el owner está más ocupado."

### **Insight 4: Owner Decisions = crítico**
> "3 decisiones pendientes hoy que pueden generar ~$4,000 adicionales:
> - Emma Chen: $1,960
> - Michael Brown Jr: $1,100
> - Thomas Schmidt Jr: ~$1,200
>
> Sin AUTOPILOT, estas oportunidades se pueden perder por respuesta lenta."

---

## ✅ 10. CHECKLIST PARA DEMO

### Data preparada:
- [x] 45 bookings en Supabase
- [x] 8 leads activos
- [x] 9 autopilot_actions (3 pendientes)
- [x] Revenue metrics (Nov/Dec/Jan)
- [x] Guest data real (nombres, países, villas)

### Escenarios de testing:
- [ ] Overview muestra métricas correctas
- [ ] Owner Decisions muestra 3 actions pendientes
- [ ] Approve action funciona end-to-end
- [ ] Visualización Supabase en tiempo real
- [ ] WhatsApp se envía tras approve

### Presentación:
- [ ] Story preparada con guests reales
- [ ] Insights de negocio listos
- [ ] Demo flow ensayado
- [ ] Backup plan si algo falla

---

*Informe generado: 29 Enero 2026 - 23:55h*
*ZENTARA LIVING - MY HOST BizMate*
*Data real lista para demo mañana*
