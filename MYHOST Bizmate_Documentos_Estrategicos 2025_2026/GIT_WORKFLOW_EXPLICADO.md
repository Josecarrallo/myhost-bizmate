# 🌳 GIT WORKFLOW - MY HOST BIZMATE

**Fecha creación:** 12 Febrero 2026
**Propósito:** Entender claramente cómo funcionan los branches y cuándo hacer deploy a producción

---

## 📊 ESTRUCTURA DE BRANCHES

```
┌─────────────────────────────────────────────────────────┐
│                         MAIN                            │
│  🚀 Branch de PRODUCCIÓN (público en Vercel)           │
│  ⛔ PROTEGIDO - No commit directo                       │
│  ✅ Solo recibe cambios vía Pull Request                │
└─────────────────────────────────────────────────────────┘
                            ↑
                            │ Pull Request
                            │ (cuando todo esté listo)
                            │
┌─────────────────────────────────────────────────────────┐
│         BACKUP-ANTES-DE-AUTOMATIZACION                  │
│  💼 Branch de TRABAJO PRINCIPAL                         │
│  ✅ Aquí hacemos TODOS los commits y push               │
│  🔨 Desarrollo activo, testing, features                │
│  📝 Configurado en CLAUDE.md como branch activo         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 FLUJO DE TRABAJO DIARIO

### 1️⃣ DESARROLLO (Estado Actual)

```bash
# Siempre trabajamos en:
Branch actual: backup-antes-de-automatizacion

# Cada cambio:
Claude hace cambios → Yo apruebo → Commit → Push

# Los cambios quedan en:
✅ backup-antes-de-automatizacion (GitHub)
❌ NO en main (todavía)
```

### 2️⃣ TESTING

```bash
# Probar localmente:
npm run dev

# Verificar en:
- Desktop (pantalla grande)
- Mobile (DevTools F12 → responsive mode)
- Todas las funcionalidades trabajadas
```

### 3️⃣ PRODUCCIÓN (Cuando esté listo)

```bash
# Solo cuando:
✅ Feature completa terminada
✅ Todo testeado sin bugs
✅ Yo digo: "OK, sube a producción"

# Entonces:
1. Pull Request: backup-antes-de-automatizacion → main
2. Merge del PR
3. Auto-deploy a Vercel (automático)
4. Sitio público actualizado
```

---

## ⚠️ REGLAS IMPORTANTES

### ✅ HACER:

1. **Siempre trabajar en `backup-antes-de-automatizacion`**
2. **Pedir aprobación antes de commit**
3. **Testear todo antes de pedir PR a main**
4. **Commits descriptivos con mensaje claro**

### ❌ NO HACER:

1. **NO commit/push directo a `main`**
2. **NO hacer PR a main sin mi aprobación**
3. **NO mezclar features incompletas**
4. **NO subir código sin testear**

---

## 📋 EJEMPLOS PRÁCTICOS

### Ejemplo 1: Feature Nueva (Mobile Responsive)

```
DÍA 1-3: Desarrollo
├─ Trabajo en: backup-antes-de-automatizacion
├─ Commits: "fix header mobile", "optimize cards", etc.
├─ Push: Cada commit aprobado
└─ Estado: En desarrollo, NO en producción

DÍA 4: Testing Completo
├─ Pruebo todo en local
├─ Verifico mobile y desktop
└─ Confirmo: "Todo funciona ✅"

DÍA 5: A Producción
├─ Yo digo: "OK, sube a producción"
├─ Claude: Crea PR → main
├─ Merge → Auto-deploy Vercel
└─ Público actualizado 🚀
```

### Ejemplo 2: Bug Fix Urgente

```
URGENTE: Bug crítico en producción
├─ Fix en: backup-antes-de-automatizacion
├─ Test rápido: Verifico que funciona
├─ Commit + Push
├─ PR inmediato a main
└─ Deploy automático → Bug resuelto
```

---

## 🎯 ESTADO ACTUAL DEL PROYECTO

### Commits Recientes (backup-antes-de-automatizacion):

```
8c9b01d - feat: Mobile responsive optimization for Autopilot sections
1411b9e - chore: Add documentation files
63c8aa2 - feat: Add period selector to Availability & Channels
...
```

### En Progreso:

- ✅ Availability & Channels - Completado
- ✅ Owner Decisions mobile - Completado
- ✅ Guest Communications mobile - Completado
- ✅ Maintenance & Tasks mobile - Completado
- ⏳ Continuar mobile responsive otros módulos
- ⏳ Deploy a Vercel (cuando termine mobile)

---

## 🔗 URLS IMPORTANTES

- **GitHub Repo:** https://github.com/Josecarrallo/myhost-bizmate
- **Vercel (Producción):** https://my-host-bizmate.vercel.app
- **Branch de trabajo:** backup-antes-de-automatizacion
- **Branch de producción:** main

---

## 📞 COMANDOS ÚTILES

```bash
# Ver branch actual
git branch

# Ver últimos commits
git log --oneline -10

# Ver estado
git status

# Ver diferencias con main
git log main..backup-antes-de-automatizacion --oneline
```

---

## 🚀 CHECKLIST ANTES DE IR A PRODUCCIÓN

Antes de hacer Pull Request a `main`, verificar:

- [ ] ✅ Feature completa y funcional
- [ ] ✅ Testeado en desktop
- [ ] ✅ Testeado en mobile
- [ ] ✅ Sin errores en consola
- [ ] ✅ Sin warnings críticos
- [ ] ✅ Aprobación explícita del owner
- [ ] ✅ Commit messages claros y descriptivos

---

**Última actualización:** 12 Febrero 2026
**Creado por:** Claude Code
**Revisado por:** José Carrallo
