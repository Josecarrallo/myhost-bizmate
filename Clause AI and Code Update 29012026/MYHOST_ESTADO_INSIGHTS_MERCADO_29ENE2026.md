# MY HOST BizMate - Estado del Proyecto + Insights de Mercado
## Fecha: 29 Enero 2026

---

# 1. VALIDACIÓN DE MERCADO (ENCUESTA VILLA OWNERS UBUD)

## 1.1 Resultados Clave

| Métrica | Resultado |
|---------|-----------|
| Owners interesados en AI PMS | **4 de 5 (80%)** |
| Precio mensual aceptable | **IDR 300K-900K (~$19-57 USD)** |
| Barrera principal | Complejidad y precio alto |
| Factor decisión | Facilidad de uso + ahorro tiempo |

## 1.2 Pain Points Validados (ORDENADOS POR IMPORTANCIA)

| # | Pain Point | Módulo MY HOST | Estado |
|---|------------|----------------|--------|
| 1 | **Guest follow-ups manuales** | WF-02 Follow-Up Engine | ⚠️ INCOMPLETO |
| 2 | **Respuestas repetitivas en chat** | BANYU (WhatsApp AI) | ✅ Funciona |
| 3 | **Payment reminders manuales** | WF-D2 Payment Protection | ✅ Funciona |
| 4 | **Double bookings** | AUTOPILOT Actions | ✅ Funciona |
| 5 | **Información check-in inconsistente** | WF-05 Guest Journey | ✅ Funciona |
| 6 | **Guest data no retenida post-checkout** | Supabase + Post-stay | ✅ Funciona |

## 1.3 Quote Clave del Owner

> *"If the system can replace admin work and is not complicated, I'm willing to pay monthly."*

> *"AI PMS is perceived not as a technology investment, but as a replacement for manual work and a solution to operational fatigue."*

## 1.4 Implicaciones para el Producto

| Insight | Acción |
|---------|--------|
| Simplicidad > Features | UI minimalista, sin opciones complejas |
| Ahorro tiempo es el valor | Medir y mostrar "horas ahorradas" |
| Precio proporcional | Tier básico ~$25-35/mes |
| No parece "corporativo" | Tono cercano, no enterprise |

---

# 2. ESTRATEGIA DE IDIOMAS (KORA Voice AI)

## 2.1 Prioridades Validadas

| Prioridad | Idioma | Razón | Estado KORA |
|-----------|--------|-------|-------------|
| **CORE** | English | Internacional, OTAs, fallback | ⏳ Verificar |
| **CORE** | Indonesian | Mercado doméstico | ⏳ Verificar |
| **ALTA** | Chinese (Mandarin) | High-value, grupos, estancias largas | Fase 2 |
| Expansión | Japanese | Repeat guests, alto servicio | Futuro |
| Expansión | Korean | Mercado emergente | Futuro |

---

# 3. CREDENCIALES CRÍTICAS

```
Tenant ID: c24393db-d318-4d75-8bbf-0fa240b9c1db
Property ID: 18711359-1378-4d12-9ea6-fb31c0b1bac2 (Izumi Hotel)
Owner Phone: +34 619794604
BANYU WhatsApp: +62 813 2576 4867
n8n: https://n8n-production-bb2d.up.railway.app
Supabase: https://jjpscimtxrudtepzwhag.supabase.co
```

---

# 4. PRIORIDADES REORDENADAS (Basadas en Pain Points)

## 🔴 CRÍTICO (Pain Point #1 de owners)

### 1. WF-02 Follow-Up Engine - ARREGLAR URGENTE
| Campo | Valor |
|-------|-------|
| ID | 38dOdJ81bIg8d6qS |
| Estado | ❌ INACTIVO, INCOMPLETO |
| Problema | "Build Owner Message" NO conectado a envío WhatsApp |
| Tiempo | 2-3 horas |

**Por qué es crítico:** El pain point #1 de los villa owners es "guest follow-ups manuales". Este módulo lo resuelve directamente.

**Timeline del Follow-Up:**
| Step | Intent | Tiempo |
|------|--------|--------|
| 1 | SOFT_CHECK | +24h |
| 2 | VALUE_REMINDER | +48h |
| 3 | LAST_DIRECT | +72h |
| 4 | REENGAGEMENT | +7 días |
| 5 | INCENTIVE | +14 días |
| 6 | CLOSURE | Final (→LOST) |

---

## 🟡 ALTA (Demostrar valor al owner)

### 2. AUTOPILOT Fase 2+3 (Weekly/Monthly Reports)
| Campo | Valor |
|-------|-------|
| Estado | ⏳ Pendiente |
| Trabajo | Crear 2 CRONs (weekly, monthly) |
| Tiempo | 30-45 minutos |

**Por qué es importante:** Los owners necesitan ver el valor. Reportes semanales/mensuales muestran "horas ahorradas" y "bookings gestionados".

### 3. KORA Testing (Voice AI)
| Campo | Valor |
|-------|-------|
| Estado | ⏳ Pendiente probar |
| Idiomas core | English + Indonesian |
| Tiempo | 1-2 horas |

**Por qué es importante:** Resuelve "respuestas repetitivas" por teléfono.

---

## 🟢 MEDIO (Mejora experiencia)

### 4. OSIRIS Dashboard
| Campo | Valor |
|-------|-------|
| Estado | ⏳ Pendiente Claude Code |
| Tiempo | 4-6 horas |

**Por qué:** Visualización de métricas para el owner.

### 5. Guest Journey Mejoras
| Campo | Valor |
|-------|-------|
| ID | cQLiQnqR2AHkYOjd |
| Estado | ✅ Funcional |
| Mejoras | Upselling, personalización |
| Tiempo | 2-4 horas |

---

## 🔵 BAJO (Features adicionales)

### 6. Content Generator
| Workflow | ID | Estado |
|----------|-----|--------|
| Media → Video | 8S0LKqyc1r1oqLyH | ❌ Sin conectar |
| Social Publishing | 7lqwefjJaJDKui7F | ❌ Sin conectar |

**Por qué es bajo:** No está en los pain points principales de los owners. Es un "nice to have", no un "must have".

### 7. Landing Page
- Estado: ⏳ Claude Code
- Tiempo: 3-4 horas

### 8. ChakraHQ Coexistence
- Estado: ⏳ Por implementar

---

# 5. ESTADO ACTUAL POR MÓDULO

## ✅ COMPLETADO Y FUNCIONANDO

| Módulo | ID | Resuelve Pain Point |
|--------|-----|---------------------|
| AUTOPILOT Actions V2 | GuHQkHb21GlowIZl | Double bookings |
| WF-D2 Payment Protection | o471FL9bpMewcJIr | Payment reminders |
| LUMINA Lead Intelligence | EtrQnkgWqqbvRjEB | Respuestas inteligentes |
| Daily Summary | 1V9GYFmjXISwXTIn / 2wVP7lYVQ9NZfkxz | Reportes |
| WF-03 Lead Handler | CBiOKCQ7eGnTJXQd | Gestión leads |
| WF-05 Guest Journey | cQLiQnqR2AHkYOjd | Check-in info, post-stay |
| BANYU WhatsApp AI | - | Respuestas repetitivas |

## ⚠️ INCOMPLETO/INACTIVO

| Módulo | ID | Pain Point que resuelve |
|--------|-----|------------------------|
| WF-02 Follow-Up Engine | 38dOdJ81bIg8d6qS | **#1 Guest follow-ups** |
| Content Generator WF1 | 8S0LKqyc1r1oqLyH | - |
| Content Generator WF2 | 7lqwefjJaJDKui7F | - |

---

# 6. TIEMPOS ESTIMADOS REORDENADOS

| Prioridad | Tarea | Tiempo | Pain Point |
|-----------|-------|--------|------------|
| 🔴 1 | **Arreglar Follow-Up Engine** | 2-3h | #1 Follow-ups |
| 🟡 2 | AUTOPILOT Fase 2+3 | 30-45min | Reportes valor |
| 🟡 3 | Testing KORA | 1-2h | Respuestas voz |
| 🟡 4 | Limpiar workflows TEMP | 15min | Mantenimiento |
| 🟢 5 | OSIRIS Dashboard | 4-6h | Visualización |
| 🟢 6 | Guest Journey mejoras | 2-4h | Upselling |
| 🔵 7 | Content Generator | 6-10h | Nice to have |
| 🔵 8 | Landing Page | 3-4h | Lead capture |

**Total crítico (🔴🟡): ~5-6 horas**
**Total completo: ~20-30 horas**

---

# 7. WORKFLOWS DE REFERENCIA

## Activos
```
AUTOPILOT Actions V2:    GuHQkHb21GlowIZl
WF-D2 Payment:           o471FL9bpMewcJIr
LUMINA:                  EtrQnkgWqqbvRjEB
Daily Summary CRON:      1V9GYFmjXISwXTIn
Daily Summary API:       2wVP7lYVQ9NZfkxz
WF-03 Lead Handler:      CBiOKCQ7eGnTJXQd
WF-05 Guest Journey:     cQLiQnqR2AHkYOjd
```

## Inactivos (pendientes)
```
WF-02 Follow-Up Engine:  38dOdJ81bIg8d6qS  ← PRIORIDAD #1
Content Media→Video:     8S0LKqyc1r1oqLyH
Content Social Publish:  7lqwefjJaJDKui7F
```

## A eliminar
```
rBqa7uXRJiHT89CN - TEMP Notify Owner
9nLsltoCjjjkdPyz - TEMP Nodos AUTOPILOT LUMINA
euiwzyMod6pMExTF - TEMP Nodos payment_verification
2AGpKbsUMg68FF1V - TEMP Nodos custom_plan cancellation
```

---

# 8. MÉTRICAS DE VALOR PARA OWNERS

Basado en la encuesta, debemos trackear y mostrar:

| Métrica | Cómo medirla |
|---------|--------------|
| Horas ahorradas/semana | (mensajes auto + follow-ups auto) × tiempo promedio |
| Follow-ups automáticos | Contador en autopilot_activity_log |
| Respuestas automáticas | Contador mensajes BANYU |
| Double bookings evitados | Alertas AUTOPILOT |
| Pagos cobrados a tiempo | WF-D2 completados |

---

# 9. PRICING SUGERIDO (Basado en encuesta)

| Tier | Precio/mes | Features |
|------|------------|----------|
| Starter | $25 USD (~IDR 400K) | WhatsApp AI + Follow-up básico |
| Pro | $45 USD (~IDR 720K) | + Voice AI + Reports |
| Premium | $75 USD (~IDR 1.2M) | + Content Generator + Multi-property |

---

# 10. REGLAS DE TRABAJO

1. No inventar - verificar siempre en n8n/Supabase
2. Mostrar estado ACTUAL primero antes de cambios
3. Cambios exactos con código completo
4. No asumir - preguntar si hay duda
5. Verificar API antes de responder
6. Sin charla innecesaria
7. Admitir errores inmediatamente
8. Una tarea a la vez
9. Código completo, nunca parcial
10. Esperar OK antes de continuar
