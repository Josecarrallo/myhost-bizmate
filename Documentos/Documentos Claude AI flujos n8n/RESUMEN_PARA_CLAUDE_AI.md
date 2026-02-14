# 📋 RESUMEN PARA CLAUDE AI - MY HOST BizMate

**Fecha:** 09 DIC 2025
**Estado:** Integración de agentes WhatsApp

---

## 🎯 OBJETIVO ACTUAL

Configurar y activar 2 agentes de IA en n8n:
1. **WhatsApp AI Agent** - Atención al cliente 24/7 vía WhatsApp
2. **Booking Confirmation Agent** - Envío automático de confirmaciones

---

## ✅ ESTADO ACTUAL DEL PROYECTO

### **Módulos integrados con Supabase (3 de 21):**
1. ✅ **Properties** - 3 villas (Villa Sunset, Beach House, Luxury Suite)
2. ✅ **Dashboard** - Estadísticas reales (3 properties, 3 bookings, 3 active)
3. ✅ **Bookings** - 3 reservas reales

### **Datos en Supabase:**
- **Properties:** 3 villas activas
  - Villa Sunset - Seminyak - $280/noche
  - Beach House - Canggu - $180/noche
  - Luxury Suite - Ubud - $150/noche

- **Bookings:** 3 reservas confirmadas
  - Sarah Johnson - Villa Sunset
  - Michael Chen - Beach House
  - Emma Wilson - Luxury Suite

- **Función SQL activa:** `get_dashboard_stats()` - retorna stats

---

## 🛠️ INFRAESTRUCTURA DISPONIBLE

### **n8n:**
- URL: https://n8n-production-bb2d.up.railway.app
- Workflows existentes (ver carpeta n8n_Supabase/)
- Credenciales configuradas: SendGrid, Supabase

### **Supabase:**
- Project ID: jjpscimtxrudtepzwhag
- URL: https://jjpscimtxrudtepzwhag.supabase.co
- Tablas: properties, bookings, payments, messages, users
- Auth funcionando con auto-cleanup de sesiones corruptas

### **WhatsApp Business API:**
- Ya conectado a n8n (ver workflows)
- Coexistence habilitado (permite IA + humanos en mismo número)
- Credentials ID: EB6eAVg9ZBZGYsyX (WhatsApp OAuth)

### **SendGrid:**
- API Key configurado
- From email: josecarrallodelafuente@gmail.com
- From name: MY HOST BizMate

---

## 📁 ARQUITECTURA DEL CÓDIGO

### **Frontend (React):**
```
src/
├── components/
│   ├── Properties/Properties.jsx ✅ INTEGRADO
│   ├── Dashboard/Dashboard.jsx ✅ INTEGRADO
│   ├── Bookings/Bookings.jsx ✅ INTEGRADO
│   └── [15 módulos más con mock data]
├── services/
│   └── data.js - Funciones: getProperties(), getDashboardStats(), getBookings()
└── contexts/
    └── AuthContext.jsx - Auth con auto-cleanup de sesiones
```

### **Patrón de integración usado:**
```javascript
// 1. Import
import { dataService } from '../../services/data';

// 2. State
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

// 3. useEffect
useEffect(() => {
  loadData();
}, []);

// 4. Load function
const loadData = async () => {
  try {
    const realData = await dataService.getBookings();
    setData(realData);
  } catch (error) {
    setData(mockData); // Fallback
  } finally {
    setLoading(false);
  }
};
```

---

## 🎯 WORKFLOWS n8n A CONFIGURAR

### **1. WhatsApp AI Agent**

**Archivo:** AI Customer Support Assistant · WhatsAp.txt

**Nodos:**
- WhatsApp Trigger (recibe mensajes)
- AI Agent (OpenAI GPT-4o-mini)
- Tools: list_links, get_page
- Postgres Users Memory (historial conversacional)
- 24-hour window check
- Send AI Agent's Answer

**Personalizar:**
- Company Name: MY HOST BizMate
- Root URL: https://my-host-bizmate.vercel.app
- System message: Ajustar para hablar sobre villas de Bali

**Credenciales necesarias:**
- WhatsApp OAuth ✅ (ya existe)
- OpenAI API ❓ (necesita configurarse)
- Postgres (Supabase) ✅ (ya existe)

---

### **2. Booking Confirmation Agent**

**Archivo:** MY HOST - Booking Confirmation Flow (Email+WhatsApp Meta) FINAL.json

**Trigger:** Nuevo booking creado en Supabase

**Flujo:**
1. Supabase trigger detecta nuevo booking
2. Webhook a n8n
3. Fetch booking details
4. Send email con SendGrid
5. Send WhatsApp confirmation

**Personalizar:**
- Templates de email y WhatsApp
- Añadir detalles de cada villa
- Instrucciones de check-in

**Credenciales necesarias:**
- SendGrid ✅ (ya configurado)
- WhatsApp ✅ (ya configurado)
- Supabase ✅ (ya configurado)

---

## 🚀 PRÓXIMOS PASOS

### **Con Claude AI:**
1. Revisar workflows existentes
2. Configurar WhatsApp AI Agent con info de villas
3. Configurar Booking Confirmation templates
4. Testing de ambos flujos
5. Activar en producción

### **Con Claude Code (después):**
1. Crear SQL triggers necesarios
2. Integrar status de agentes en Dashboard React
3. Documentar workflows
4. Commits finales

---

## 📝 INFORMACIÓN IMPORTANTE

**Branch actual:** backup-antes-de-automatizacion
**Branch protegido:** main

**Commits recientes:**
- d2a3088 - docs: Add complete session documentation for 09 DIC 2025
- 33e85f7 - fix: Improve Auth timeout handling to prevent app freeze
- 2cdc773 - feat: Integrate Bookings module with real Supabase data

**URLs:**
- Local dev: http://localhost:5178/
- Production: https://my-host-bizmate.vercel.app
- n8n: https://n8n-production-bb2d.up.railway.app
- Supabase: https://jjpscimtxrudtepzwhag.supabase.co

---

## ⚠️ NOTAS CRÍTICAS

1. **Meta Coexistence está habilitado** - Permite IA + humanos en mismo número WhatsApp
2. **Auth timeout resuelto** - Auto-limpieza de sesiones corruptas implementada
3. **Todos los módulos tienen fallback** - Si Supabase falla, usa mock data
4. **Supabase functions:** Solo `get_dashboard_stats()` existe actualmente

---

**Este documento resume TODO lo que Claude AI necesita saber para configurar los agentes WhatsApp correctamente.**
