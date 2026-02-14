# LECCIÓN APRENDIDA - Vercel Deployment

**Fecha:** 04 Enero 2026

## Problema Identificado

La integración **GitHub ↔ Vercel NO FUNCIONA CORRECTAMENTE** en este proyecto.

### Síntomas:
- Vercel muestra "invalid-email-address" en deployments
- Auto-deploy desde GitHub push NO funciona
- Mobile y desktop reciben versiones diferentes (deployments viejos vs nuevos)
- Múltiples forced rebuilds NO solucionan el problema

### Causa Raíz:
**Integración GitHub-Vercel rota** - Vercel no detecta nuevos commits automáticamente

## Solución Definitiva

### ✅ USAR SIEMPRE VERCEL CLI DIRECTO

```bash
# 1. Limpiar build anterior
rm -rf dist
rm -rf node_modules/.vite

# 2. Build fresco
npm run build

# 3. Deploy directo a producción (BYPASS GitHub integration)
vercel --prod --yes
```

### ❌ NO CONFIAR EN:
- Auto-deploy de GitHub pushes
- Vercel dashboard "Redeploy" button
- GitHub integration hasta que se reconecte correctamente

## Impacto del Problema

- **3+ horas** perdidas depurando "problemas de código" que no existían
- Múltiples commits innecesarios intentando "arreglar" el código
- El código **SIEMPRE estuvo correcto**, solo era problema de deployment

## Acción Futura

**SIEMPRE** usar Vercel CLI para deployments:
```bash
npm run build && vercel --prod --yes
```

## Fix Permanente (Pendiente)

Para arreglar la integración GitHub-Vercel:
1. Ir a Vercel Dashboard → Project Settings
2. Git Integration → Disconnect repository
3. Reconnect repository con credenciales correctas
4. Verificar email address en Vercel account settings

---

**Lección:** No asumir que el problema es el código cuando el deployment no funciona.
Verificar PRIMERO la infraestructura (GitHub-Vercel integration).
