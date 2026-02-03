# 📊 TEMAS PENDIENTES - MY HOST BIZMATE
## Priorización y Estado - 27 Enero 2026

---

## 🔴 CRÍTICO - ESTA SEMANA (27 Ene - 2 Feb)

### 1. Auto-Trigger WF-D2 Payment Protection
**Estado:** ⏳ NO IMPLEMENTADO
**Asignado a:** Claude AI
**Prioridad:** 🔴 CRÍTICA
**Estimación:** 2-3 horas

**Descripción:**
WF-D2 Payment Protection solo se activa manualmente. Debe activarse automáticamente cuando se crea una reserva con `payment_status='pending'`.

**Solución recomendada:**
Crear workflow CRON en n8n que cada 15 minutos:
1. Query Supabase buscando bookings pendientes sin proceso activo
2. Para cada uno, llamar webhook `/autopilot/payment/start`

**Criterios de éxito:**
- [ ] CRON creado y activo en n8n
- [ ] Query SQL correcta (payment_status='pending', payment_expiry_at IS NULL, etc.)
- [ ] Webhook llamado correctamente con todos los parámetros
- [ ] Test: Crear booking manual → CRON lo detecta en <15 min → WF-D2 inicia

**Dependencias:** Ninguna
**Bloqueadores:** Ninguno

---

### 2. Verificar WF-AUTOPILOT Actions
**Estado:** ⚠️ EXISTE PERO NO PROBADO
**Asignado a:** Claude AI
**Prioridad:** 🔴 CRÍTICA
**Estimación:** 1-2 horas

**Descripción:**
Workflow WF-AUTOPILOT Actions (ID: `E6vXYR5Xm3SYVEnC`) existe pero nunca se ha probado end-to-end.

**Tareas:**
1. Revisar estructura del workflow actual
2. Crear acción de prueba en `autopilot_actions` (INSERT SQL)
3. Probar Approve con webhook
4. Verificar que actualiza status en Supabase
5. Verificar que ejecuta acción correspondiente
6. Probar Reject
7. Documentar comportamiento

**Criterios de éxito:**
- [ ] Approve actualiza `status='approved'`, `approved_by`, `approved_at`
- [ ] Reject actualiza `status='rejected'`, `rejected_by`, `rejected_at`
- [ ] Si action_type='payment_verification' + Approve → Extiende hold 24h
- [ ] Si action_type='payment_verification' + Reject → No hace nada (deja expirar)
- [ ] Log creado en `audit_logs`

**Dependencias:** Ninguna
**Bloqueadores:** Ninguno

---

### 3. Casos Especiales en WF-D2 (Payment Verification)
**Estado:** ⏳ NO IMPLEMENTADO
**Asignado a:** Claude AI
**Prioridad:** 🔴 CRÍTICA
**Estimación:** 3-4 horas

**Descripción:**
WF-D2 debe detectar situaciones especiales que requieren decisión del owner y crear `autopilot_actions` correspondientes.

**Caso prioritario: Payment Verification**
- **Cuándo:** Faltan ≤2h para expiración + guest envió mensaje en las últimas 2h mencionando pago
- **Acción:** Crear registro en `autopilot_actions` tipo `payment_verification`
- **Owner decide:** Approve (extender hold 24h) o Reject (dejar expirar)

**Implementación:**
Añadir nodo en WF-D2 después de "Wait 20h":
1. Calcular `hours_remaining` hasta expiración
2. Query `whatsapp_messages` para detectar mensajes recientes del guest
3. Si `hours_remaining ≤ 2` Y `recent_messages > 0` Y mensaje contiene indicadores de pago:
   - INSERT en `autopilot_actions`
   - INSERT en `autopilot_alerts`
   - Continuar con flujo normal (no detener)

**Criterios de éxito:**
- [ ] Nodo añadido en WF-D2 sin romper flujo existente
- [ ] Query de detección de mensajes funciona correctamente
- [ ] autopilot_action se crea con todos los campos necesarios
- [ ] Owner ve acción en Dashboard OSIRIS
- [ ] Approve/Reject ejecuta acción correctamente
- [ ] Test end-to-end exitoso

**Dependencias:** Tarea #2 (WF-AUTOPILOT Actions debe funcionar)
**Bloqueadores:** Ninguno

---

### 4. Testing End-to-End Completo
**Estado:** ⏳ PENDIENTE
**Asignado a:** Claude AI + Jose (manual testing)
**Prioridad:** 🔴 CRÍTICA
**Estimación:** 2-3 horas

**Descripción:**
Probar flujo completo desde lead hasta confirmación/expiración de booking.

**Escenario de prueba:**
```
1. Crear booking manual en Supabase con payment_status='pending'
2. Verificar que CRON lo detecta en <15 min
3. Verificar que WF-D2 inicia automáticamente
4. Verificar que guest recibe WhatsApp inicial
5. Esperar 6h (o modificar Wait a 1min para testing) → Verificar Reminder 1
6. Esperar 14h más (o 1min) → Verificar Reminder 2
7. Simular mensaje del guest: "Ya hice la transferencia"
8. Verificar que se crea autopilot_action
9. Verificar que aparece en Dashboard OSIRIS
10. Hacer Approve desde Dashboard
11. Verificar que hold se extiende 24h
12. Verificar WhatsApp de confirmación al guest
13. Verificar resumen diario a las 18:00
```

**Criterios de éxito:**
- [ ] Todos los pasos ejecutan correctamente
- [ ] Mensajes WhatsApp recibidos en tiempo correcto
- [ ] Dashboard muestra información en tiempo real
- [ ] Approve/Reject funciona desde UI
- [ ] Base de datos actualizada correctamente
- [ ] Logs de auditoría completos

**Dependencias:** Tareas #1, #2, #3
**Bloqueadores:** Ninguno

---

## 🟡 IMPORTANTE - PRÓXIMAS 2 SEMANAS (3-16 Feb)

### 5. Conectar LUMINA Downstream Workflows
**Estado:** ⏳ NO IMPLEMENTADO
**Asignado a:** Claude AI
**Prioridad:** 🟡 ALTA
**Estimación:** 4-6 horas

**Descripción:**
LUMINA analiza leads y devuelve decisión (BOOKED/FOLLOWUP/REENGAGE/CLOSE) pero no ejecuta acciones basadas en esas decisiones.

**Implementación:**
Modificar WF-SP-02 LUMINA (ID: `EtrQnkgWqqbvRjEB`) para añadir nodo Switch:
```
LUMINA decision output
  ↓
SWITCH por decision:
  ├─ BOOKED → Trigger WF-04 Follow-Up (confirmation sequence)
  ├─ FOLLOWUP → Crear recordatorios (1h, 6h, 24h)
  ├─ REENGAGE → Crear workflow retargeting (48h, 1 semana)
  └─ CLOSE → UPDATE leads.status='closed' + log
```

**Criterios de éxito:**
- [ ] SWITCH implementado correctamente
- [ ] Cada decisión ejecuta acción correspondiente
- [ ] Workflows downstream creados (si no existen)
- [ ] Test con lead real para cada tipo de decisión
- [ ] Logs completos en `lead_events`

**Dependencias:** Ninguna
**Bloqueadores:** Ninguno

---

### 6. Weekly/Monthly Summary (OSIRIS)
**Estado:** ⏳ NO IMPLEMENTADO
**Asignado a:** Claude AI + Claude Code
**Prioridad:** 🟡 MEDIA
**Estimación:** 6-8 horas

**Descripción:**
Dashboard OSIRIS tiene tabs "Weekly" y "Monthly" pero son placeholders. Implementar funcionalidad completa.

**Tareas:**

**Claude AI (Backend):**
1. Crear función RPC `get_weekly_summary(p_tenant_id UUID)` en Supabase
2. Crear función RPC `get_monthly_summary(p_tenant_id UUID)` en Supabase
3. Modificar WF-OSIRIS para añadir estos tools (si existe workflow OSIRIS)
4. Testing con datos reales

**Claude Code (Frontend):**
1. Modificar `Autopilot.jsx` para llamar RPCs correspondientes
2. Diseñar UI para Weekly view (gráficos, trends)
3. Diseñar UI para Monthly view (gráficos, KPIs, comparación)
4. Añadir loading states
5. Añadir error handling

**Criterios de éxito:**
- [ ] RPCs creadas y funcionando
- [ ] Tabs Weekly/Monthly muestran datos reales
- [ ] UI consistente con Daily view
- [ ] Gráficos responsive
- [ ] Datos actualizados en tiempo real

**Dependencias:** Ninguna
**Bloqueadores:** Ninguno

---

### 7. Casos Especiales Adicionales (Custom Payment Plan, Cancellation Exception)
**Estado:** ⏳ NO IMPLEMENTADO
**Asignado a:** Claude AI
**Prioridad:** 🟡 MEDIA
**Estimación:** 4-6 horas

**Descripción:**
Implementar detección y creación de `autopilot_actions` para otros casos especiales.

**Caso B: Custom Payment Plan**
- **Cuándo:** Guest solicita plan de pago personalizado (ej: 50% ahora, 50% antes del check-in)
- **Dónde detectar:** BANYU o LUMINA workflows
- **Acción:** Crear `autopilot_action` tipo `custom_payment_plan`

**Caso C: Cancellation Exception**
- **Cuándo:** Guest cancela fuera de política de cancelación y pide reembolso
- **Dónde detectar:** Workflow de cancelaciones
- **Acción:** Crear `autopilot_action` tipo `cancellation_exception`

**Criterios de éxito:**
- [ ] BANYU detecta solicitudes especiales correctamente
- [ ] autopilot_actions creadas con todos los campos
- [ ] Owner puede aprobar/rechazar desde Dashboard
- [ ] Acciones ejecutadas correctamente según decisión

**Dependencias:** Tarea #3 (Payment Verification implementado)
**Bloqueadores:** Ninguno

---

## 🟢 BACKLOG - FUTURO (17 Feb+)

### 8. Onboarding Segundo Hotel
**Estado:** ⏳ BLOQUEADO (Meta WhatsApp limit)
**Asignado a:** TBD
**Prioridad:** 🟢 BAJA (bloqueado externamente)
**Estimación:** 1-2 semanas

**Descripción:**
Onboarding de segundo hotel cuando Meta permita más números WhatsApp.

**Bloqueador actual:**
- Límite Meta: 2 números WhatsApp por Business Manager
- Números actuales: 2/2 (límite alcanzado)
- Meta NO aumenta manualmente
- Debe crecer orgánicamente

**Opciones:**
1. Esperar crecimiento orgánico (semanas/meses)
2. Crear nuevo Business Manager → +2 números inmediatamente

**Tareas cuando se desbloquee:**
- [ ] Configurar nuevo número WhatsApp en ChakraHQ
- [ ] Crear tenant en Supabase
- [ ] Configurar workflows para nuevo tenant
- [ ] Testing completo
- [ ] Handoff al nuevo hotel

**Dependencias:** Aprobación Meta
**Bloqueadores:** ✋ Límite Meta WhatsApp

---

### 9. Analytics Avanzado
**Estado:** 💡 IDEA
**Asignado a:** TBD
**Prioridad:** 🟢 BAJA
**Estimación:** 2-3 semanas

**Descripción:**
Implementar analytics avanzado en OSIRIS Dashboard.

**Features propuestos:**
- Conversion funnel (lead → inquiry → booking → check-in)
- A/B testing de mensajes (BANYU responses)
- Predicted revenue (ML model)
- Guest satisfaction scores
- Performance comparisons (property vs property, month vs month)
- Automated insights ("Bookings down 15% this week vs last week")

**Criterios de éxito:**
- TBD (pendiente diseño)

**Dependencias:** Sistema estable en producción
**Bloqueadores:** Ninguno

---

### 10. Integración PMS Externo
**Estado:** 💡 IDEA
**Asignado a:** TBD
**Prioridad:** 🟢 BAJA (opcional)
**Estimación:** 3-4 semanas

**Descripción:**
Integrar con PMS existentes (Cloudbeds, Guesty, etc.) si algún hotel lo requiere.

**Scope:**
- Sincronización bidireccional de bookings
- Sincronización de disponibilidad
- Sincronización de pagos
- Webhook listeners para eventos PMS

**Criterios de éxito:**
- TBD (depende del PMS específico)

**Dependencias:** Solicitud de cliente específico
**Bloqueadores:** Ninguno

---

### 11. Mobile App (Owner Portal)
**Estado:** 💡 IDEA
**Asignado a:** TBD
**Prioridad:** 🟢 BAJA
**Estimación:** 2-3 meses

**Descripción:**
App móvil para owners (iOS + Android) para ver dashboard y aprobar acciones on-the-go.

**Features propuestos:**
- Dashboard summary
- Approve/Reject actions
- Push notifications para alertas
- Quick view de bookings
- Revenue overview

**Criterios de éxito:**
- TBD (pendiente diseño)

**Dependencias:** Sistema web estable
**Bloqueadores:** Ninguno

---

## 📋 RESUMEN DE PRIORIDADES

| Prioridad | Tareas | Estimación Total | Asignado a |
|-----------|--------|------------------|------------|
| 🔴 CRÍTICA | 4 tareas | 8-12 horas | Claude AI + Jose |
| 🟡 ALTA/MEDIA | 4 tareas | 14-20 horas | Claude AI + Claude Code |
| 🟢 BAJA/BACKLOG | 4 tareas | 2-4 meses | TBD |

---

## 🎯 PRÓXIMOS MILESTONES

### Milestone 1: AUTOPILOT 100% Operativo (Esta semana)
**Fecha objetivo:** 2 Febrero 2026
**Tareas:** #1, #2, #3, #4
**Criterio:** Sistema funciona end-to-end sin intervención manual

### Milestone 2: LUMINA Conectado (Próximas 2 semanas)
**Fecha objetivo:** 16 Febrero 2026
**Tareas:** #5, #6, #7
**Criterio:** Todos los agentes AI funcionan integrados

### Milestone 3: Producción Estable (1 mes)
**Fecha objetivo:** 27 Febrero 2026
**Tareas:** Todas las críticas + monitoreo
**Criterio:** Sistema corriendo 24/7 sin errores

### Milestone 4: Multi-Tenant Ready (TBD)
**Fecha objetivo:** Cuando Meta permita
**Tareas:** #8
**Criterio:** Segundo hotel onboarded exitosamente

---

## 📊 MÉTRICAS DE ÉXITO

### Técnicas
- [ ] 0 errors en n8n workflows por 1 semana
- [ ] 100% uptime en workflows críticos (BANYU, KORA, WF-D2)
- [ ] Tiempo de respuesta promedio <2s para webhooks
- [ ] Todos los tests end-to-end pasando

### Negocio
- [ ] 90% de reservas confirmadas sin intervención manual
- [ ] 0 pagos expirados por falla del sistema
- [ ] Owner satisfecho con dashboard (feedback positivo)
- [ ] Guests reciben respuesta instantánea 24/7

### Operacionales
- [ ] Owner invierte <30 min/día en sistema
- [ ] 100% de acciones críticas tienen approve/reject en <24h
- [ ] Resumen diario recibido puntualmente a las 18:00
- [ ] 0 quejas de guests sobre comunicación

---

## 📞 SIGUIENTE CALL/CHECKPOINT

**Fecha:** Miércoles 28 Enero 2026
**Agenda:**
1. Review de tareas críticas completadas
2. Demo de flujo end-to-end
3. Decisión sobre próximas prioridades
4. Planning para Milestone 2

---

**Documento generado:** 27 de Enero 2026
**Última actualización:** 27 de Enero 2026
**Próxima revisión:** 2 de Febrero 2026
