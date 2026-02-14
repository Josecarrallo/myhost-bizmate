# PROMPT NUEVA SESIÓN - MY HOST BizMate
## Actualizado: 29 Enero 2026 (con insights de mercado)

---

## CONTEXTO

Soy Jose, founder de ZENTARA LIVING. Desarrollo MY HOST BizMate, plataforma SaaS de automatización para boutique hotels y villas en Bali. Cliente piloto: Izumi Hotel (7 villas en Ubud).

---

## VALIDACIÓN DE MERCADO (CRÍTICO)

Encuesta a 5 villa owners en Ubud reveló:

| Dato | Resultado |
|------|-----------|
| Interés en AI PMS | 80% (4/5) |
| Precio aceptable | $19-57 USD/mes |
| Pain point #1 | **Guest follow-ups manuales** |
| Pain point #2 | Respuestas repetitivas |
| Pain point #3 | Payment reminders |
| Factor decisión | Simplicidad + ahorro tiempo |

**Quote clave:** *"If the system can replace admin work and is not complicated, I'm willing to pay monthly."*

---

## CREDENCIALES

```
Tenant ID: c24393db-d318-4d75-8bbf-0fa240b9c1db
Property ID: 18711359-1378-4d12-9ea6-fb31c0b1bac2
Owner Phone: +34 619794604
BANYU WhatsApp: +62 813 2576 4867
n8n: https://n8n-production-bb2d.up.railway.app
Supabase: https://jjpscimtxrudtepzwhag.supabase.co
```

---

## PRIORIDADES (Reordenadas por Pain Points)

### 🔴 CRÍTICO - Resolver Pain Point #1

**1. WF-02 Follow-Up Engine - ARREGLAR URGENTE**
- ID: 38dOdJ81bIg8d6qS
- Estado: ❌ INACTIVO, INCOMPLETO
- Problema: "Build Owner Message" NO conectado a envío WhatsApp
- Tiempo: 2-3 horas
- **Resuelve:** Pain point #1 de owners (follow-ups manuales)

Timeline configurado:
| Step | Intent | Tiempo |
|------|--------|--------|
| 1 | SOFT_CHECK | +24h |
| 2 | VALUE_REMINDER | +48h |
| 3 | LAST_DIRECT | +72h |
| 4 | REENGAGEMENT | +7d |
| 5 | INCENTIVE | +14d |
| 6 | CLOSURE | Final |

---

### 🟡 ALTA - Demostrar valor

**2. AUTOPILOT Fase 2+3** (30-45 min)
- Crear CRON weekly (Lunes 8am)
- Crear CRON monthly (día 1, 8am)
- RPC functions ya existen

**3. KORA Testing** (1-2h)
- Idiomas: English + Indonesian (core)
- Escenarios: info, booking, handoff

**4. Limpiar workflows TEMP** (15 min)
```
rBqa7uXRJiHT89CN, 9nLsltoCjjjkdPyz, euiwzyMod6pMExTF, 2AGpKbsUMg68FF1V
```

---

### 🟢 MEDIO

**5. OSIRIS Dashboard** - Claude Code (4-6h)
**6. Guest Journey mejoras** - Upselling (2-4h)

---

### 🔵 BAJO (Nice to have)

**7. Content Generator** - Sin conectar (6-10h)
- WF1: 8S0LKqyc1r1oqLyH
- WF2: 7lqwefjJaJDKui7F

**8. Landing Page** - Claude Code (3-4h)

---

## ESTADO ACTUAL

### ✅ Funcionando (Resuelven pain points 2-6)
```
AUTOPILOT Actions V2:    GuHQkHb21GlowIZl  ✅
WF-D2 Payment:           o471FL9bpMewcJIr  ✅
LUMINA:                  EtrQnkgWqqbvRjEB  ✅
Daily Summary CRON:      1V9GYFmjXISwXTIn  ✅
Daily Summary API:       2wVP7lYVQ9NZfkxz  ✅
WF-03 Lead Handler:      CBiOKCQ7eGnTJXQd  ✅
WF-05 Guest Journey:     cQLiQnqR2AHkYOjd  ✅
```

### ⚠️ Incompleto (Resuelve pain point #1)
```
WF-02 Follow-Up Engine:  38dOdJ81bIg8d6qS  ← PRIORIDAD MÁXIMA
```

### ❌ Sin conectar (Bajo prioridad)
```
Content Media→Video:     8S0LKqyc1r1oqLyH
Content Social Publish:  7lqwefjJaJDKui7F
```

---

## WEBHOOKS

```
AUTOPILOT Action:        /webhook/autopilot/action
Payment Protection:      /webhook/autopilot/payment/start
Daily Summary:           /webhook/autopilot/summary
```

---

## IDIOMAS KORA (Validados por encuesta)

| Prioridad | Idioma | Estado |
|-----------|--------|--------|
| CORE | English | ⏳ |
| CORE | Indonesian | ⏳ |
| ALTA | Chinese | Fase 2 |

---

## REGLAS DE TRABAJO

1. No inventar - verificar en n8n/Supabase
2. Mostrar ACTUAL primero
3. Cambios exactos, código completo
4. No asumir - preguntar
5. Sin charla innecesaria
6. Admitir errores
7. Una tarea a la vez
8. Esperar OK

---

## COMANDOS ÚTILES

```powershell
# AUTOPILOT APPROVE
Invoke-RestMethod -Uri "https://n8n-production-bb2d.up.railway.app/webhook/autopilot/action" -Method POST -ContentType "application/json" -Body '{"action": "approve", "action_id": "ID"}'

# AUTOPILOT REJECT
Invoke-RestMethod -Uri "https://n8n-production-bb2d.up.railway.app/webhook/autopilot/action" -Method POST -ContentType "application/json" -Body '{"action": "reject", "action_id": "ID", "reason": "Motivo"}'

# Daily Summary
Invoke-RestMethod -Uri "https://n8n-production-bb2d.up.railway.app/webhook/autopilot/summary" -Method POST -ContentType "application/json" -Body '{"tenant_id": "c24393db-d318-4d75-8bbf-0fa240b9c1db", "property_id": "18711359-1378-4d12-9ea6-fb31c0b1bac2", "period": "daily"}'
```

---

## TRANSCRIPTS

```
/mnt/transcripts/2026-01-29-*
```

---

## ¿QUÉ HACER AHORA?

Orden recomendado basado en pain points validados:

1. 🔴 **Arreglar Follow-Up Engine** (2-3h) - Pain point #1
2. 🟡 **AUTOPILOT Fase 2+3** (30-45min) - Reportes valor
3. 🟡 **Testing KORA** (1-2h) - Voice AI
4. 🟡 **Limpiar TEMP** (15min) - Mantenimiento
5. 🟢 **OSIRIS Dashboard** (4-6h) - Visualización
6. 🔵 **Content Generator** (6-10h) - Nice to have

**¿Por dónde empezamos?**
