# PROMPT DE RECUPERACIÓN DE SESIÓN - 22 Enero 2026

**Usa este prompt si necesitas iniciar una nueva sesión con Claude Code**

---

## 📋 PROMPT PARA CLAUDE CODE

```
Hola Claude Code,

Estoy trabajando en MY HOST BizMate, un sistema de gestión hotelera con AI agents.

CONTEXTO PROYECTO:
- Stack: React 18.2 + Vite + Tailwind + Supabase
- Repo: C:\myhost-bizmate
- Branch actual: backup-antes-de-automatizacion
- Live URL: https://my-host-bizmate.vercel.app
- n8n: https://n8n-production-bb2d.up.railway.app
- Supabase Project: jjpscimtxrudtepzwhag
- Tenant ID (Izumi): c24393db-d318-4d75-8bbf-0fa240b9c1db

AGENTES AI DEL SISTEMA:
1. KORA (Voice AI - VAPI) - ✅ Funcionando
2. BANYU (WhatsApp AI) - ✅ Funcionando
3. OSIRIS (Owner Operations) - 🔧 En desarrollo (chat UI listo)
4. LUMINA (Sales AI) - 📋 Planificado
5. AURA (Content AI) - 📋 Planificado

ESTADO ACTUAL (22 Enero 2026):

1. OSIRIS Chat Interface - ✅ COMPLETADO
   - Ubicación: src/components/AISystems/AISystems.jsx
   - Chat funcionando con 6 agentes (OSIRIS, LUMINA, BANYU, KORA, AURA, HESTIA)
   - UI optimizada: scroll al inicio de mensajes, chat área grande (70% pantalla)
   - Agent names prominentes (font-black, uppercase, drop-shadow)
   - Quick questions movidas abajo del input bar
   - Avatar LUMINA cuando no está en llamada

2. Workflow OSIRIS en n8n - ⏳ PENDIENTE COMPLETAR
   - Documento guía: Claude AI and Code Update 22012026/OSIRIS_PROXIMOS_PASOS.md
   - Documento técnico base: Claude AI and Code Update 21012026/BRIEF_OSIRIS_MVP_21_ENERO_2026.md
   - Necesita: Multilingual prompt, 6 tools, structured JSON output, logging

3. DECISIÓN PENDIENTE - ⚠️ IMPORTANTE
   - Problema: Latencia alta con arquitectura actual (Frontend → n8n → Claude → Supabase)
   - Opción A: Mantener n8n para OSIRIS
   - Opción B: Mover OSIRIS a Claude Code (frontend directo, más rápido)
   - Opción C: Híbrida (OSIRIS en frontend, KORA/BANYU en n8n)
   - Pendiente analizar pros/contras y decidir arquitectura final

ARCHIVOS CLAVE:
- src/components/AISystems/AISystems.jsx (Chat UI OSIRIS)
- src/components/VoiceAssistant/VoiceAssistant.jsx (KORA voice)
- Claude AI and Code Update 22012026/OSIRIS_PROXIMOS_PASOS.md (Instrucciones para Claude AI)
- Claude AI and Code Update 21012026/BRIEF_OSIRIS_MVP_21_ENERO_2026.md (Spec técnica completa)
- Claude AI and Code Update 21012026/prompt-sesion-kora-21-enero-2026_1.md (Estado KORA)

ÚLTIMOS CAMBIOS HOY (22 Enero):
- Fixed scroll behavior: mensajes de OSIRIS ahora aparecen desde el inicio (block: 'start')
- Maximizado chat area: header reducido 50%, agent boxes 70% más pequeños
- Agent names mejorados: text-sm → font-black uppercase tracking-wide drop-shadow-lg
- Quick questions relocalizadas: de sección separada → debajo del input bar
- Creado documento OSIRIS_PROXIMOS_PASOS.md para Claude AI con specs completas

PRÓXIMOS PASOS:
1. Decidir arquitectura: n8n vs Claude Code para OSIRIS
2. Si n8n: Claude AI implementa workflow según OSIRIS_PROXIMOS_PASOS.md
3. Si Claude Code: Implementar OSIRIS tools + Claude API directo en frontend
4. Testing end-to-end con 3 idiomas (EN/ES/ID)
5. Logging y auditoría en Supabase

COMANDOS ÚTILES:
- npm run dev (puerto 5173)
- Dev server corriendo en background (bash bbc212)

¿En qué necesitas que te ayude?
```

---

## 📌 NOTAS ADICIONALES

Si el problema es específico, añade al prompt:

**Para problemas de UI:**
```
Problema específico: [descripción del bug]
Archivo afectado: src/components/AISystems/AISystems.jsx
Comportamiento esperado: [...]
Comportamiento actual: [...]
```

**Para problemas de workflow n8n:**
```
Problema específico: [descripción]
Workflow: WF-OSIRIS-MVP
Error observado: [...]
Referencia: Claude AI and Code Update 22012026/OSIRIS_PROXIMOS_PASOS.md
```

**Para decisiones arquitectónicas:**
```
Tema: Arquitectura OSIRIS - n8n vs Claude Code
Contexto: Latencia alta (3-5s) con n8n
Necesito: Análisis de pros/contras y recomendación
Documentos: OSIRIS_PROXIMOS_PASOS.md + BRIEF_OSIRIS_MVP_21_ENERO_2026.md
```

---

## 🔧 TROUBLESHOOTING RÁPIDO

### Si OSIRIS no responde:
1. Verificar n8n está up: https://n8n-production-bb2d.up.railway.app
2. Verificar Supabase está up
3. Check console del browser (F12) para errores
4. Verificar tenant_id correcto: c24393db-d318-4d75-8bbf-0fa240b9c1db

### Si hay problemas con git:
```bash
git status
git branch  # debe estar en: backup-antes-de-automatizacion
```

### Si dev server no arranca:
```bash
# Matar proceso
taskkill /F /IM node.exe
# Reiniciar
npm run dev
```

---

**Última actualización:** 22 Enero 2026 - 23:00 WIB
