# PROMPT DE CONTINUACIÓN - FASE 1.5 AUTOPILOT
## Arquitectura Final Aprobada por Equipo Técnico

Copia y pega esto al inicio de una nueva conversación:

---

```
CONTEXTO: Implementando FASE 1.5 de AUTOPILOT para MY HOST BizMate (SaaS automatización hoteles Bali).

═══════════════════════════════════════════════════════════════
ARQUITECTURA FINAL APROBADA (DOCUMENTO OFICIAL)
═══════════════════════════════════════════════════════════════

PRINCIPIO CLAVE - SINGLE RESPONSIBILITY:
- LUMINA = analiza y marca (NUNCA ejecuta)
- DECISION ROUTER = elige el camino (NUNCA crea)
- AUTOPILOT = crea registros y ejecuta (NUNCA analiza)
- OWNER = manda

FLUJO:
```
Mensaje cliente → LUMINA (analiza) → Decision Router → Ruta correspondiente
                                            │
                                            ├── BOOKED → Guest Journey
                                            ├── FOLLOWUP → Follow-Up Engine
                                            ├── REENGAGE → Follow-Up Engine
                                            ├── CLOSE → Mark LOST
                                            └── AUTOPILOT (NUEVO) → Crear action → Notificar → BLOQUEAR
```

═══════════════════════════════════════════════════════════════
LO QUE HAY QUE HACER (3 PASOS)
═══════════════════════════════════════════════════════════════

PASO 1: Modificar prompt de LUMINA (NO sustituir, SOLO añadir)
Añadir al final del prompt existente:

"Additionally, determine whether the message requires a human decision from the property owner.

SITUATIONS THAT REQUIRE OWNER DECISION:
- Payment plan request (50% now, installments, deposit only)
- Cancellation with special circumstances (emergency, medical, visa, family)
- Discount or price negotiation request
- Payment confirmation that needs manual verification
- Date conflicts with existing bookings

If a human decision is required, include the keyword:
OWNER_DECISION_REQUIRED
inside the 'reason' field of the JSON response.

Do NOT create actions. Do NOT notify anyone. Only flag."

Ejemplo output:
{
  "lead_status": "interested",
  "next_action": "followup",
  "urgency": "high",
  "reason": "OWNER_DECISION_REQUIRED: guest requests 50/50 payment plan"
}

PASO 2: Modificar Decision Router
Añadir nueva ruta AUTOPILOT con condición:
IF reason CONTAINS "OWNER_DECISION_REQUIRED" → Route to AUTOPILOT
Esta ruta debe evaluarse PRIMERO (antes de las otras)

PASO 3: Crear rama AUTOPILOT (nodos nuevos)
1. Extract Action Details (Code) - determina action_type del reason
2. Create Autopilot Action (HTTP POST Supabase)
3. Notify Owner WhatsApp (HTTP POST ChakraHQ)
4. Update Lead Status → "PENDING_OWNER"
5. Respond

═══════════════════════════════════════════════════════════════
FASE 1 YA COMPLETADA ✅
═══════════════════════════════════════════════════════════════
- WF-AUTOPILOT Actions v3 (ID: Efk3dYHDA6hyyYjV) FUNCIONA
- Webhook: POST /webhook/autopilot/action
- Procesa approve/reject para: custom_plan_request, payment_verification, cancellation_exception
- 6 tests pasados
- Estado: Inactivo (activar después de implementar FASE 1.5)

═══════════════════════════════════════════════════════════════
IDs CRÍTICOS
═══════════════════════════════════════════════════════════════
- Tenant: c24393db-d318-4d75-8bbf-0fa240b9c1db
- Property: 18711359-1378-4d12-9ea6-fb31c0b1bac2
- Owner phone: 34619794604
- LUMINA workflow: EtrQnkgWqqbvRjEB (MODIFICAR ESTE)
- AUTOPILOT Actions: Efk3dYHDA6hyyYjV (funciona, activar después)
- n8n: https://n8n-production-bb2d.up.railway.app
- Supabase: https://jjpscimtxrudtepzwhag.supabase.co

═══════════════════════════════════════════════════════════════
ARCHIVOS DE REFERENCIA
═══════════════════════════════════════════════════════════════
- /mnt/user-data/uploads/AUTOPILOT_ACTIONS_CREACION_LOGICA.md
- /mnt/user-data/uploads/MAPA_FLUJOS_ORDEN_MYHOST_Bizmate.txt
- /mnt/user-data/uploads/myhost_arquitectura_FLUJOS.html
- Documento oficial arquitectura: aprobado por equipo técnico 28 Enero 2026

═══════════════════════════════════════════════════════════════
NODOS DE LUMINA (estructura actual)
═══════════════════════════════════════════════════════════════
1. Webhook POST → 2. Normalize Lead Event → 3. Build Lumina Context
→ 4. LUMINA AI Decision (GPT-4o-mini) → 5. Parse AI Decision
→ 6. Decision Router → [BOOKED/FOLLOWUP/REENGAGE/CLOSE] → 9. Respond

Modificar:
- Nodo 4: Añadir texto al prompt
- Nodo 6: Añadir ruta AUTOPILOT
- Después de ruta AUTOPILOT: crear nodos nuevos

═══════════════════════════════════════════════════════════════
⚠️ REGLAS IMPORTANTES
═══════════════════════════════════════════════════════════════
- LUMINA NUNCA ejecuta acciones (solo analiza y marca)
- AUTOPILOT NUNCA analiza mensajes (solo crea y ejecuta)
- Explicar plan COMPLETO antes de modificar
- Esperar aprobación EXPLÍCITA
- NO crear workflows nuevos, modificar LUMINA existente
- La ruta AUTOPILOT debe evaluarse ANTES que las otras en el router

═══════════════════════════════════════════════════════════════
REGLA MENTAL FINAL
═══════════════════════════════════════════════════════════════
LUMINA = analiza y marca
ROUTER = decide el camino
AUTOPILOT = crea registro y actúa
OWNER = manda

ESTA ES LA ARQUITECTURA FINAL. NO HAY OTRA.
```

---

*Prompt actualizado: 28 Enero 2026*
*Arquitectura aprobada por equipo técnico*
