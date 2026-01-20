# 📚 ÍNDICE DE DOCUMENTACIÓN - MY HOST BIZMATE

**Generado:** 16 Diciembre 2025
**Proyecto:** MY HOST BizMate - Property Management Platform

---

## 📂 ARCHIVOS PRINCIPALES (Raíz del proyecto)

### 🔄 Recuperación de Sesión
- **CONTINUAR_SESION.md** - Prompt rápido para retomar trabajo con Claude Code
- **SESSION_RECOVERY_PROMPT.md** (en backup) - Prompt completo con contexto detallado

### 📋 Planificación
- **ROADMAP_PENDIENTES.md** - Roadmap completo con todos los temas pendientes (detallado)
- **PENDIENTES_RESUMEN.md** - Resumen ejecutivo de pendientes (vista rápida)

### 📦 Backup
- **Claude Code Update/** - Carpeta con backup completo
  - `myhost-bizmate-backup_2025-12-16_1443.zip` (52 MB, 335 archivos)
  - `README.txt` - Instrucciones de restauración
  - `SESSION_RECOVERY_PROMPT.md` - Contexto completo

### 📖 Documentación del Proyecto
- **CLAUDE.md** - Guía completa del proyecto para Claude Code
  - Arquitectura
  - Stack tecnológico
  - Patrones de código
  - Comandos útiles
  - Historia de refactoring
- **README.md** - Documentación general del proyecto
- **RESUMEN_PARA_CLAUDE_AI.md** - Contexto adicional

---

## 🗂️ ESTRUCTURA DE CARPETAS

### `/src` - Código Fuente
```
src/
├── components/          # 21 módulos React
│   ├── common/         # 10 componentes reutilizables
│   ├── Dashboard/      # Dashboard + OwnerExecutiveSummary
│   ├── Properties/     # ✅ Con Supabase
│   ├── Bookings/       # ✅ Con Supabase
│   ├── Multichannel/
│   ├── AIAssistant/
│   ├── Payments/
│   ├── SmartPricing/
│   ├── Reports/
│   ├── PMSCalendar/
│   ├── BookingEngine/
│   ├── VoiceAI/
│   ├── Reviews/
│   ├── RMSIntegration/
│   ├── DigitalCheckIn/
│   ├── CulturalIntelligence/
│   ├── GuestPortal/
│   ├── Workflows/
│   ├── Layout/         # Sidebar
│   └── Auth/           # LoginPage
├── services/
│   └── supabase.js     # Servicio centralizado Supabase
├── context/
│   └── AppContext.jsx  # Context API
├── App.jsx             # Routing principal (214 líneas)
├── main.jsx
└── index.css
```

### `/Documentos` - Documentación Business
- Presentaciones (PDF, PPTX)
- Análisis de mercado
- Proyecciones financieras
- Guías de presentación
- Configuraciones WhatsApp

### `/n8n_worlkflow_claude` - Workflows n8n
- 11+ workflows en JSON
- Configuraciones de integraciones
- Documentación de flujos

### `/.claude` - Configuración Claude Code
- `/mcp/n8n/` - MCP Server para n8n (avanzado)
- Configuración de herramientas

---

## 🎯 GUÍAS RÁPIDAS POR TAREA

### Si necesitas...

#### 🔄 Retomar sesión con Claude Code
→ **CONTINUAR_SESION.md** (prompt corto)
→ **SESSION_RECOVERY_PROMPT.md** (contexto completo)

#### 📋 Ver qué falta por hacer
→ **PENDIENTES_RESUMEN.md** (vista rápida)
→ **ROADMAP_PENDIENTES.md** (detallado con código)

#### 💻 Entender el código
→ **CLAUDE.md** (patrones, arquitectura, comandos)
→ `/src` (código fuente)

#### 🔧 Integrar con Supabase
→ **ROADMAP_PENDIENTES.md** → Sección 2
→ `/src/services/supabase.js` (ejemplo Properties/Bookings)

#### 🔄 Integrar workflows n8n
→ **ROADMAP_PENDIENTES.md** → Sección 3
→ `/n8n_worlkflow_claude/` (workflows JSON)

#### 🎙️ Integrar VAPI
→ **ROADMAP_PENDIENTES.md** → Sección 4

#### 🏢 Implementar Multitenant
→ **ROADMAP_PENDIENTES.md** → Sección 5
→ Incluye schemas SQL y código

#### 📦 Restaurar backup
→ **Claude Code Update/README.txt**
→ Extraer ZIP + `npm install` + `npm run dev`

---

## 📊 ESTADO ACTUAL DEL PROYECTO

### ✅ Completado
- UI de 21 módulos actualizada y consistente
- Branding unificado
- Properties + Supabase integrado
- Bookings + Supabase integrado
- Sistema de autenticación básico
- Deploy en Vercel funcionando
- 11+ workflows n8n documentados

### 🔄 En Progreso
- Integración Supabase resto de módulos
- Testing
- Seguridad

### ⏳ Pendiente
- n8n integration (0 workflows activos)
- VAPI integration
- Arquitectura multitenant
- Monitoreo y analytics
- Performance optimization

---

## 🔗 ENLACES ÚTILES

### Proyecto
- **Live URL:** https://my-host-bizmate.vercel.app
- **GitHub:** (añadir si aplica)
- **Figma/Diseño:** (añadir si aplica)

### Servicios
- **Supabase:** https://jjpscimtxrudtepzwhag.supabase.co
- **n8n Railway:** https://n8n-production-bb2d.up.railway.app
- **Vercel:** Dashboard de Vercel

### Documentación Externa
- **React:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **n8n Docs:** https://docs.n8n.io
- **Vapi Docs:** https://docs.vapi.ai
- **Vite Docs:** https://vitejs.dev
- **Recharts:** https://recharts.org

---

## 📞 INFORMACIÓN DE CONTACTO

**Propietario:** José Carrallo
**Email:** (añadir si aplica)
**Proyecto iniciado:** 2025
**Última actualización docs:** 16 Diciembre 2025

---

## 🔄 COMANDOS RÁPIDOS

```bash
# Desarrollo
npm run dev              # Iniciar servidor (localhost:5173)
npm run build            # Build producción
npm run preview          # Preview build local

# Git
git status               # Ver cambios
git log --oneline -10    # Últimos 10 commits
git branch               # Ver branches

# Testing (cuando esté configurado)
npm test                 # Correr tests
npm run test:coverage    # Coverage report

# Otros
npm install              # Instalar dependencias
npm audit                # Verificar vulnerabilidades
```

---

## 📝 NOTAS IMPORTANTES

### Branches Git
- **main** - Producción (protegido)
- **backup-antes-de-automatizacion** - Development actual (trabajo aquí)

### Credenciales
- Nunca commitear credenciales
- Usar variables de entorno (.env)
- .env está en .gitignore

### Backup
- Backup completo en: `Claude Code Update/`
- Crear backups antes de cambios mayores
- ZIP no incluye node_modules (regenerar con npm install)

---

## 🎓 APRENDIZAJES Y MEJORES PRÁCTICAS

### Patrones establecidos:
1. **Componentes React funcionales** con hooks
2. **Props consistentes:** `onBack`, `onNavigate`
3. **Gradientes naranjas:** `from-orange-400 via-orange-500 to-orange-600`
4. **Cards:** `bg-white/95 backdrop-blur-sm` o naranja según contexto
5. **Títulos:** `text-4xl md:text-5xl font-black`
6. **Iconos:** Lucide React en lugar de otros

### Lecciones aprendidas:
- Refactoring gradual es mejor que big bang
- Mantener backup antes de cambios mayores
- Commitear frecuentemente con mensajes descriptivos
- Documentar decisiones importantes
- Testing desde el inicio (pendiente mejorar)

---

**Este índice se debe actualizar cuando se añadan nuevos documentos importantes.**

*Última actualización: 16 Diciembre 2025, 14:55*
*Generado con Claude Code*
