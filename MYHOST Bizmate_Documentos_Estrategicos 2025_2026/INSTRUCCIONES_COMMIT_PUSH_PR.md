# 🚨 INSTRUCCIONES CRÍTICAS: COMMIT, PUSH Y PULL REQUEST

**Fecha**: 14 Febrero 2026
**Estado del Proyecto**: CÓDIGO FUNCIONAL Y PROBADO ✅

---

## 📊 ESTADO ACTUAL DEL REPOSITORIO

### Ramas Existentes

```
main                              → Rama principal (PROTEGIDA)
backup-antes-de-automatizacion    → Rama de trabajo ACTUAL ⭐ (ESTÁS AQUÍ)
mobile-responsive-fixes           → Rama ya FUSIONADA en backup-antes-de-automatizacion
```

### ✅ Rama de Trabajo ACTUAL
**`backup-antes-de-automatizacion`** ← SIEMPRE trabajas aquí

### ✅ Rama Principal (Producción)
**`main`** ← NUNCA pushes directamente aquí, solo via Pull Request

---

## 🟢 PARA COMMIT Y PUSH (Guardar tu trabajo)

### ⚠️ REGLA DE ORO
**SOLO haz commit y push de lo que YA ESTÁ en el disco AHORA MISMO (HEAD)**

### Comandos a ejecutar:

```bash
# 1. Verificar en qué rama estás (debe decir: backup-antes-de-automatizacion)
git branch

# 2. Ver qué archivos han cambiado
git status

# 3. Agregar TODOS los cambios
git add .

# 4. Hacer commit con mensaje descriptivo
git commit -m "feat: [DESCRIPCIÓN CLARA DE LOS CAMBIOS]

- Detalle 1
- Detalle 2
- Detalle 3

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# 5. Push a la rama de trabajo
git push origin backup-antes-de-automatizacion
```

### 🚫 LO QUE NUNCA DEBES HACER AL GUARDAR

- ❌ NO hagas `git checkout` a ningún commit viejo
- ❌ NO hagas `git reset` a commits anteriores
- ❌ NO modifiques archivos antes de hacer commit
- ❌ NO cambies de rama antes de hacer commit
- ❌ NO hagas `git clean -fd` (borra archivos no rastreados)

### ✅ LO QUE SÍ DEBES HACER

- ✅ Verificar que estás en `backup-antes-de-automatizacion`
- ✅ Hacer `git status` para ver qué cambiará
- ✅ Hacer `git add .` para agregar TODO
- ✅ Hacer commit con mensaje claro
- ✅ Hacer push a `origin backup-antes-de-automatizacion`

---

## 🔵 PARA PULL REQUEST A MAIN (Llevar a Producción)

### ⚠️ REGLA DE ORO
**SOLO crea PR de la VERSIÓN ACTUAL (HEAD), NO modifiques NADA**

### Comandos a ejecutar:

```bash
# 1. Asegurarte que todo está commiteado y pusheado
git status
# (debe decir: "nothing to commit, working tree clean")

# 2. Crear Pull Request a main
gh pr create --base main --head backup-antes-de-automatizacion --title "Deploy: [DESCRIPCIÓN]" --body "## Cambios

- Cambio 1
- Cambio 2
- Cambio 3

## Probado

- [x] Funciona en portátil
- [x] Funciona en móvil
- [x] Mobile responsive OK

🤖 Generated with Claude Code"
```

### 🚫 LO QUE NUNCA DEBES HACER AL CREAR PR

- ❌ NO hagas checkout a main antes
- ❌ NO modifiques archivos antes de crear PR
- ❌ NO hagas merge manual a main
- ❌ NO hagas `git push origin main` directamente

### ✅ LO QUE SÍ DEBES HACER

- ✅ Verificar que estás en `backup-antes-de-automatizacion`
- ✅ Verificar que todo está pusheado (`git status` limpio)
- ✅ Crear PR con `gh pr create` usando el comando exacto de arriba
- ✅ Revisar el PR en GitHub antes de mergear
- ✅ Hacer merge desde GitHub UI

---

## 🆘 SI ALGO SALE MAL

### Problema: "No sé en qué rama estoy"
```bash
git branch
# La rama con * es donde estás
# Debe decir: * backup-antes-de-automatizacion
```

### Problema: "Cambié archivos por error y quiero volver"
```bash
# Ver qué cambió
git status

# Deshacer cambios en UN archivo específico
git checkout -- nombre-del-archivo.jsx

# Deshacer TODOS los cambios no commiteados (PELIGROSO, úsalo con cuidado)
git reset --hard HEAD
```

### Problema: "Hice commit pero no he pusheado, quiero deshacerlo"
```bash
# Ver últimos commits
git log --oneline -5

# Deshacer el último commit (pero mantener los cambios en disco)
git reset --soft HEAD~1

# Ahora puedes hacer un nuevo commit con los cambios
```

### Problema: "Ya hice push pero necesito revertir"
```bash
# NO HAGAS NADA SOLO
# PÍDELE A CLAUDE QUE TE AYUDE
# Es mejor hacerlo juntos para no perder código
```

---

## 📋 CHECKLIST ANTES DE COMMIT Y PUSH

```
[ ] Estoy en la rama backup-antes-de-automatizacion
[ ] He probado que todo funciona en portátil
[ ] He probado que todo funciona en móvil (si aplica)
[ ] He visto qué archivos cambiarán con `git status`
[ ] He escrito un mensaje de commit descriptivo
[ ] No he tocado archivos que no debía
[ ] No he borrado archivos importantes
```

---

## 📋 CHECKLIST ANTES DE PULL REQUEST

```
[ ] Ya hice commit y push de todos los cambios
[ ] `git status` dice "working tree clean"
[ ] Estoy en la rama backup-antes-de-automatizacion
[ ] He probado TODO en portátil y móvil
[ ] Tengo el título y descripción del PR listos
[ ] NO he hecho cambios de última hora
```

---

## 🎯 FLUJO DE TRABAJO IDEAL

```
1. TRABAJAR
   └─ Editar archivos en backup-antes-de-automatizacion

2. GUARDAR (cada vez que terminas una tarea)
   ├─ git add .
   ├─ git commit -m "mensaje"
   └─ git push origin backup-antes-de-automatizacion

3. LLEVAR A PRODUCCIÓN (cuando todo está listo y probado)
   ├─ gh pr create --base main --head backup-antes-de-automatizacion
   ├─ Revisar PR en GitHub
   └─ Merge en GitHub UI
```

---

## 🔒 REGLAS DE SEGURIDAD

1. **NUNCA** hagas `git push origin main` directamente
2. **SIEMPRE** trabaja en `backup-antes-de-automatizacion`
3. **SIEMPRE** usa Pull Request para llevar cambios a `main`
4. **NUNCA** hagas `git clean -fd` sin saber qué hará
5. **SIEMPRE** haz `git status` antes de cualquier comando git
6. **PREGUNTA** a Claude si tienes dudas antes de ejecutar comandos destructivos

---

## 📞 CUANDO PEDIR AYUDA A CLAUDE

- ❓ Cuando `git status` muestra algo raro
- ❓ Cuando no sabes si un comando es seguro
- ❓ Cuando quieres deshacer algo
- ❓ Cuando el push falla con un error
- ❓ Cuando hay conflictos de merge
- ❓ Cuando algo "no se ve bien" en git

---

## 💡 COMANDOS ÚTILES DE CONSULTA (SEGUROS)

```bash
# Ver en qué rama estás
git branch

# Ver estado actual
git status

# Ver últimos 5 commits
git log --oneline -5

# Ver qué cambió en un archivo
git diff nombre-archivo.jsx

# Ver todas las ramas (locales y remotas)
git branch -a

# Ver diferencias con lo que está en GitHub
git fetch
git status
```

---

**IMPORTANTE**: Si tienes CUALQUIER duda, pregunta a Claude ANTES de ejecutar el comando.

Es mejor perder 30 segundos preguntando que perder 2 horas recuperando código.

---

**Creado**: 14 Feb 2026
**Actualizado**: Después del susto del merge 😅
**Estado**: DOCUMENTACIÓN OFICIAL DE TRABAJO CON GIT
