# 📋 PROTOCOLO OBLIGATORIO - COMMIT, PUSH Y SYNC (VERSIÓN 3.0)

**Actualizado:** 03/03/2026 - Después de bug crítico de multi-tenancy
**Branch de trabajo:** `backup-antes-de-automatizacion`
**Branch de producción:** `main`

---

## 🚨 ADVERTENCIA CRÍTICA

**Este protocolo es OBLIGATORIO después de 20+ errores críticos, incluyendo violación de multi-tenancy.**

**ERRORES RECURRENTES:**
1. ❌ **[NUEVO 03/Mar/2026] Multi-tenancy ROTO - Jose veía villas de Gita (violación de aislamiento de datos)**
2. ❌ Campos phone/email obligatorios NO se quitaron en Edit Lead/Booking (21 Feb)
3. ❌ Archivos de backup sobrescribieron código actual (20 Feb)
4. ❌ Dependencias faltantes en package.json causaron fallos en Vercel
5. ❌ Cambios aprobados en localhost NO entraron en el commit
6. ❌ `git add -p` rechazó hunks críticos sin darse cuenta
7. ❌ main NO sincronizado con backup → código diferente en producción

**RESULTADO:** Violación de privacidad, Vercel deployment falla, app rota en producción, pérdida total de confianza.

---

## 🎯 REGLAS ABSOLUTAS (NO NEGOCIABLES)

### 1. VERIFICACIÓN PRE-COMMIT OBLIGATORIA

**ANTES de cualquier commit, Claude DEBE:**

```bash
# Paso 1: Ver EXACTAMENTE qué archivos cambié en la sesión
git diff HEAD --name-status
```

**Claude DEBE preguntarse:**
- ¿Estos son TODOS los archivos que modifiqué en la sesión?
- ¿Falta algún archivo que trabajamos juntos?
- ¿Hay archivos aquí que NO deberían estar?

**Si la respuesta a cualquiera es "no estoy 100% seguro" → DETENER y preguntar al usuario**

### 2. COMPARACIÓN CON STAGED CHANGES

```bash
# Paso 2: Después de git add, comparar qué entró vs qué cambió
git diff --cached --name-status  # Lo que va a commitear
git diff HEAD --name-status      # Lo que realmente cambió

# Paso 3: Verificar que son IGUALES
# Si falta algo → ALGO ESTÁ MAL
```

### 3. CONFIRMACIÓN LÍNEA POR LÍNEA

**Para CADA archivo crítico modificado en la sesión:**

```bash
# Ver cambios específicos de cada archivo
git diff --cached src/components/ManualDataEntry/ManualDataEntry.jsx
git diff --cached src/components/Properties/Properties.jsx
git diff --cached src/services/data.js
```

**Claude DEBE verificar que los cambios incluyen:**
- ✅ TODOS los cambios que hicimos juntos
- ✅ NO hay código extra que no trabajamos
- ✅ NO hay reversiones accidentales

### 4. TESTS DE MULTI-TENANCY (NUEVO - 03/03/2026)

**🚨 OBLIGATORIO ejecutar ANTES de commit si se modificó:**
- `src/services/data.js`
- Cualquier función que filtre datos por tenant/property
- Queries a `bookings`, `villas`, `properties`
- Lógica de autenticación o permisos

**EJECUTAR:**
```bash
node test-multi-tenancy.cjs
```

**DEBE PASAR 16/16 tests:**
- ✅ Gita ve exactamente 3 villas (IDR)
- ✅ Jose ve exactamente 5 villas (USD)
- ✅ NO hay contaminación de datos entre tenants
- ✅ Bookings correctamente aislados
- ✅ Property ownership correcto

**SI FALLA ALGÚN TEST:**
- ❌ **NO HACER COMMIT**
- ❌ **NO continuar con el protocolo**
- 🛑 **DETENER y corregir el código primero**
- 📖 **Consultar DATABASE_SCHEMA.md**

**EJEMPLO DE OUTPUT ESPERADO:**
```
✅ Tests Pasados: 16
❌ Tests Fallidos: 0
✅ TODOS LOS TESTS PASARON - SEGURO PARA COMMIT
```

**Referencias:**
- Test suite: `test-multi-tenancy.cjs`
- Documentación: `DATABASE_SCHEMA.md`
- Commit de referencia: `185d1bd` (implementación correcta)

---

### 5. CHECKLIST ESPECÍFICO POR TIPO DE CAMBIO

#### Si se modificó ManualDataEntry:
- [ ] ¿Quité `required` de phone en Add Lead? (línea ~1642)
- [ ] ¿Quité `required` de email en Add Lead? (línea ~1657)
- [ ] ¿Quité `required` de phone en Edit Lead? (línea ~3221)
- [ ] ¿Quité `required` de email en Edit Lead? (línea ~3233)
- [ ] ¿Quité `required` de phone en Add Booking? (línea ~1994)
- [ ] ¿Quité `required` de email en Add Booking? (línea ~2007)
- [ ] ¿Quité `required` de phone en Edit Booking? (línea ~2783)
- [ ] ¿Quité `required` de email en Edit Booking? (línea ~2794)

#### Si se agregó una dependencia nueva:
- [ ] ¿Está en package.json?
- [ ] ¿Corrí npm install?
- [ ] ¿Está package-lock.json en el commit?

#### Si se modificó un componente React:
- [ ] ¿Todos los imports tienen sus librerías instaladas?
- [ ] ¿No hay errores en consola de localhost?
- [ ] ¿npm run build completa sin errores?

---

## 📋 PROCESO COMPLETO PASO A PASO

### PARTE A: COMMIT Y PUSH A BACKUP BRANCH

#### PASO 1: INVENTARIO DE CAMBIOS DE LA SESIÓN

**Claude DEBE escribir una lista manual de TODOS los archivos que modificó:**

```
ARCHIVOS QUE MODIFIQUÉ EN ESTA SESIÓN:
1. src/components/ManualDataEntry/ManualDataEntry.jsx
   - Cambios: Quité `required` de 8 campos (phone/email en Add/Edit Lead/Booking)

2. src/components/Autopilot/Autopilot.jsx
   - Cambios: Eliminé hardcoded PROPERTY_ID

3. package.json
   - Cambios: Agregué dependencia xlsx
```

**OBLIGATORIO: Mostrar esta lista al usuario y pedir confirmación**

---

#### PASO 1.5: TESTS DE MULTI-TENANCY (SI APLICA)

**🚨 EJECUTAR OBLIGATORIAMENTE si la lista de PASO 1 incluye:**
- src/services/data.js
- Cualquier archivo que filtre por tenant/property
- Cambios en queries de bookings/villas/properties

```bash
# Ejecutar test suite
node test-multi-tenancy.cjs
```

**RESULTADO ESPERADO:**
```
✅ Tests Pasados: 16
❌ Tests Fallidos: 0
✅ TODOS LOS TESTS PASARON
```

**SI FALLA:**
```
❌ Tests Fallidos: [número > 0]
❌ NO HACER COMMIT - Multi-tenancy ROTO
```

**Acciones si falla:**
1. 🛑 **DETENER el protocolo inmediatamente**
2. 📖 **Revisar DATABASE_SCHEMA.md**
3. 🔧 **Corregir el código**
4. 🔄 **Ejecutar test-multi-tenancy.cjs nuevamente**
5. ✅ **Solo continuar cuando pase 16/16 tests**

**Claude DEBE informar al usuario:**
```
⚠️ TESTS DE MULTI-TENANCY:
[Resultado: PASÓ/FALLÓ]
[16/16 tests exitosos / X tests fallidos]

[Si falló: NO PUEDO CONTINUAR CON EL COMMIT hasta que esto se corrija]
```

---

#### PASO 2: GIT STATUS Y DIFF

```bash
# Ver qué archivos tienen cambios
git status --short

# Ver qué archivos específicamente cambiaron
git diff HEAD --name-only

# Ver estadísticas de cada archivo
git diff HEAD --stat
```

**Claude DEBE comparar:**
- Lista de PASO 1 (lo que trabajamos)
- Output de git diff (lo que Git ve)

**Si NO coinciden → ALGO ESTÁ MAL → DETENER**

---

#### PASO 3: GIT ADD ESPECÍFICO (NUNCA git add .)

```bash
# NUNCA:
git add .  # ❌ PROHIBIDO

# SIEMPRE:
git add src/components/ManualDataEntry/ManualDataEntry.jsx
git add src/components/Autopilot/Autopilot.jsx
git add package.json
git add package-lock.json
```

**Agregar SOLO los archivos de la lista de PASO 1**

---

#### PASO 4: VERIFICACIÓN DE STAGED CHANGES

```bash
# Ver qué se va a commitear
git diff --cached --name-status
git diff --cached --stat

# CRÍTICO: Contar archivos
echo "Archivos que voy a commitear:"
git diff --cached --name-only | wc -l

echo "Archivos que modifiqué en la sesión:"
# [Número de archivos de la lista de PASO 1]
```

**Si los números NO coinciden → ALGO FALTA O SOBRA → DETENER**

---

#### PASO 5: VERIFICACIÓN LÍNEA POR LÍNEA DE CAMBIOS CRÍTICOS

**Para cambios en formularios (required, validación, etc.):**

```bash
# Ver cambios específicos de phone/email
git diff --cached src/components/ManualDataEntry/ManualDataEntry.jsx | grep -C 3 "required"
```

**Claude DEBE verificar manualmente:**
- ¿Todos los `required` que debía quitar están quitados?
- ¿No quedó ningún `required` que debía eliminar?

**MOSTRAR OUTPUT AL USUARIO para confirmación**

---

#### PASO 6: RESUMEN PRE-COMMIT (OBLIGATORIO)

**Claude DEBE generar y mostrar:**

```
🚨 RESUMEN PRE-COMMIT - CONFIRMACIÓN OBLIGATORIA 🚨

📋 ARCHIVOS QUE VOY A COMMITEAR:
[git diff --cached --name-only output]

📊 ESTADÍSTICAS:
[git diff --cached --stat output]

🔍 VERIFICACIONES COMPLETADAS:
✅ Lista manual de archivos modificados: [número] archivos
✅ **[NUEVO] Tests multi-tenancy: [16/16 PASÓ / NO APLICA / X FALLÓ]**
✅ Git diff muestra: [número] archivos
✅ Números coinciden: [SÍ/NO]
✅ NO hay archivos de carpetas "Claude AI and Code Update XXX/"
✅ NO hay archivos de backup que sobrescriban código actual
✅ npm run build completó sin errores
✅ package.json tiene todas las dependencias usadas

🎯 CAMBIOS ESPECÍFICOS VERIFICADOS:
[Listar cada cambio crítico con checkbox]

📝 MENSAJE DEL COMMIT:
[mensaje propuesto]

🚨 ¿CONFIRMAS QUE TODO ESTÁ CORRECTO Y PUEDO PROCEDER? (Sí/No)

⚠️ Si dices "No", DETENDRÉ inmediatamente y esperaré instrucciones.
⚠️ Si algo falta o está mal, dime qué corregir.
```

**Claude NO puede proceder sin un "Sí" EXPLÍCITO del usuario**

---

#### PASO 7: COMMIT (SOLO DESPUÉS DE CONFIRMACIÓN)

```bash
# SOLO si el usuario dijo "Sí"
git commit -m "[mensaje aprobado por el usuario]"

# Verificar que el commit se creó
git log -1 --stat

# Verificar que incluye TODOS los archivos
git show HEAD --name-only
```

**Claude DEBE comparar:**
- Archivos en `git show HEAD --name-only`
- Lista de archivos de PASO 1

**Si NO coinciden → ALGO SALIÓ MAL → git reset HEAD~1 y empezar de nuevo**

---

#### PASO 8: PUSH A BACKUP BRANCH

```bash
# Push al branch de trabajo
git push origin backup-antes-de-automatizacion

# Verificar que llegó a GitHub
git log origin/backup-antes-de-automatizacion -1 --oneline
```

---

#### PASO 9: VERIFICACIÓN POST-PUSH

```bash
# Verificar que GitHub tiene el commit
git fetch origin
git diff HEAD origin/backup-antes-de-automatizacion

# NO debe haber diferencias
# Si hay diferencias → ALGO SALIÓ MAL
```

---

### PARTE B: ACTUALIZAR MAIN (SINCRONIZACIÓN)

#### PASO 10: CAMBIAR A MAIN Y PULL

```bash
# Cambiar a branch main
git checkout main

# Pull de GitHub para tener última versión
git pull origin main
```

---

#### PASO 11: MERGE BACKUP → MAIN

```bash
# Merge de backup-antes-de-automatizacion a main
git merge backup-antes-de-automatizacion --no-ff -m "chore: Sync main with backup-antes-de-automatizacion

Includes latest changes from backup branch.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Verificar que el merge fue exitoso
git log -1 --oneline
```

**⚠️ Si hay conflictos:**
1. DETENER inmediatamente
2. Informar al usuario
3. NO intentar resolver automáticamente
4. Esperar instrucciones

---

#### PASO 12: PUSH MAIN A GITHUB

```bash
# Push de main a GitHub
git push origin main

# Verificar que llegó
git log origin/main -1 --oneline
```

**✅ En este punto, Vercel desplegará automáticamente desde main**

---

#### PASO 13: REGRESAR A BACKUP BRANCH

```bash
# Volver al branch de trabajo
git checkout backup-antes-de-automatizacion

# Verificar que estamos en el branch correcto
git branch --show-current
# Debe mostrar: backup-antes-de-automatizacion
```

---

### PARTE C: COPIA DE SEGURIDAD LOCAL

#### PASO 14: CREAR COPIA LOCAL

```bash
# Crear directorio con fecha de hoy
$fecha = Get-Date -Format "ddMMyyyy"
$backupPath = "C:\Claude Code - Update codigo $fecha"
mkdir $backupPath

# Copiar archivos SOLO de código y configuración
robocopy "C:\myhost-bizmate\src" "$backupPath\src" /E /R:0 /W:0
robocopy "C:\myhost-bizmate\public" "$backupPath\public" /E /R:0 /W:0
robocopy "C:\myhost-bizmate\video\src" "$backupPath\video\src" /E /R:0 /W:0
copy "C:\myhost-bizmate\package.json" "$backupPath\"
copy "C:\myhost-bizmate\vite.config.js" "$backupPath\"
copy "C:\myhost-bizmate\vercel.json" "$backupPath\"
copy "C:\myhost-bizmate\index.html" "$backupPath\"
copy "C:\myhost-bizmate\video\server.cjs" "$backupPath\video\"
copy "C:\myhost-bizmate\video\package.json" "$backupPath\video\"

# Copiar documentación de la sesión de hoy
robocopy "C:\myhost-bizmate\Claude AI and Code Update 21022026" "$backupPath\Documentacion Sesion" /E /R:0 /W:0

# Verificar que la copia tiene archivos
dir "$backupPath" /s /b | find /c /v ""
```

**✅ CHECKPOINT: Backup local creado en `C:\Claude Code - Update codigo [FECHA]`**

---

### PARTE D: VERIFICACIÓN FINAL

#### PASO 15: VERIFICACIONES COMPLETAS

```bash
# 1. Verificar que local está sincronizado con GitHub
git fetch --all
git status

# 2. Verificar que main tiene el commit de hoy
git log origin/main --oneline -3

# 3. Verificar que backup y main están sincronizados
git log origin/backup-antes-de-automatizacion -1 --oneline
git log origin/main -1 --oneline
# Deben mostrar el mismo commit o main uno adelante (el merge)

# 4. Verificar archivos en backup local
dir "C:\Claude Code - Update codigo [FECHA]\src" /s /b | find /c /v ""
# Debe mostrar número > 0
```

---

## 📊 RESUMEN EJECUTIVO FINAL (copiar y entregar al usuario)

```
✅ SESIÓN COMPLETADA - [FECHA]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1️⃣ COMMIT INFO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Hash: [commit hash]
Mensaje: [primera línea del commit]
Archivos modificados: [número]
Líneas agregadas: [número]
Líneas eliminadas: [número]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2️⃣ GITHUB STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
backup-antes-de-automatizacion:
  ✅ Updated
  Commit: [hash]

main:
  ✅ Sincronizado con backup
  ✅ Push exitoso
  Commit: [hash]

Branches sincronizadas: ✅ SÍ

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3️⃣ VERCEL DEPLOYMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status: Building... (auto-deploy desde main)
URL: https://my-host-bizmate.vercel.app
Tiempo estimado: 2-3 minutos

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4️⃣ BACKUP LOCAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ubicación: C:\Claude Code - Update codigo [FECHA]
Archivos copiados: [número]
Tamaño: [MB]

Contenido:
✅ src/ (componentes React)
✅ public/ (assets)
✅ video/src/ (Remotion)
✅ package.json
✅ vite.config.js
✅ vercel.json
✅ index.html
✅ video/server.cjs
✅ Documentación Sesion/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5️⃣ ARCHIVOS CRÍTICOS VERIFICADOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ src/components/ManualDataEntry/ManualDataEntry.jsx
✅ [otros archivos modificados]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6️⃣ PRÓXIMOS PASOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Esperar 2-3 minutos para Vercel deployment
2. Verificar en: https://vercel.com/josecarrallo/my-host-bizmate
3. Probar app en: https://my-host-bizmate.vercel.app
4. Confirmar que cambios están en producción

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ PROTOCOLO SEGUIDO AL 100%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🔒 PROTOCOLO DE EMERGENCIA

### Si algo falla en cualquier paso:

1. **DETENER inmediatamente**
2. **NO continuar al siguiente paso**
3. **NO improvisar soluciones**
4. **Informar al usuario exactamente qué falló**
5. **Esperar instrucciones**

### Si el merge a main tiene conflictos:

```bash
# NO intentar resolver automáticamente
git merge --abort

# Informar al usuario:
"⚠️ CONFLICTO DE MERGE DETECTADO

Archivos en conflicto:
[listar archivos]

NECESITO TU AYUDA para resolver esto manualmente.
¿Qué quieres hacer?"

# Esperar instrucciones del usuario
```

---

## ✅ CHECKLIST FINAL COMPLETO

**PARTE A - Commit y Push:**
- [ ] Lista manual de archivos modificados creada
- [ ] **[NUEVO] Tests multi-tenancy ejecutados (si aplica): 16/16 pasaron**
- [ ] git diff HEAD vs lista manual coinciden
- [ ] git add de archivos específicos (NO git add .)
- [ ] git diff --cached vs lista manual coinciden
- [ ] Verificación línea por línea de cambios críticos
- [ ] Resumen pre-commit mostrado al usuario
- [ ] Usuario respondió "Sí" explícitamente
- [ ] Commit creado
- [ ] git show HEAD vs lista manual coinciden
- [ ] Push exitoso a backup-antes-de-automatizacion
- [ ] git diff HEAD origin/branch sin diferencias

**PARTE B - Sincronizar Main:**
- [ ] Cambio a main exitoso
- [ ] Pull de origin/main sin conflictos
- [ ] Merge backup → main exitoso
- [ ] Push a origin/main exitoso
- [ ] Regreso a backup-antes-de-automatizacion

**PARTE C - Backup Local:**
- [ ] Directorio backup creado con fecha
- [ ] src/ copiado
- [ ] public/ copiado
- [ ] video/src/ copiado
- [ ] Archivos de configuración copiados
- [ ] Documentación copiada
- [ ] Verificación de archivos > 0

**PARTE D - Verificaciones:**
- [ ] Local sincronizado con GitHub
- [ ] main tiene commits de hoy
- [ ] backup y main sincronizados
- [ ] Backup local completo

**SOLO si TODOS están marcados → Sesión completada con éxito ✅**

---

## 💡 USO DE ESTE PROTOCOLO

**Al final de cada sesión, el usuario dirá:**

```
Ejecuta el PROTOCOLO COMPLETO. Fecha de hoy: [DÍA/MES/AÑO]
```

**Claude ejecutará automáticamente:**
1. ✅ Commit y push a backup-antes-de-automatizacion
2. ✅ Sincronización de main con backup
3. ✅ Push de main (trigger Vercel deployment)
4. ✅ Copia de seguridad local
5. ✅ Verificaciones completas
6. ✅ Resumen ejecutivo al usuario

---

## 📚 DOCUMENTACIÓN DE REFERENCIA

### Nuevos Documentos (03/03/2026)

1. **`DATABASE_SCHEMA.md`**
   - Esquema completo de tablas Supabase
   - Documentación de multi-tenancy architecture
   - Errores comunes y cómo evitarlos
   - **LEER ANTES** de modificar data.js

2. **`test-multi-tenancy.cjs`**
   - Test suite de 16 validaciones
   - Verifica aislamiento de datos Gita/Jose
   - Exit code 0 = OK, 1 = FAIL
   - **EJECUTAR ANTES** de commit a código de filtrado

### Commits de Referencia

- **185d1bd** (21 Feb 2026): Implementación correcta de multi-tenancy
  - getVillas() filtra por property_id via lookup en bookings
  - **USAR COMO REFERENCIA** para lógica de filtrado

---

**Versión:** 3.0
**Fecha:** 03 de Marzo de 2026
**Razón de actualización:** Agregado tests obligatorios de multi-tenancy después de bug crítico de aislamiento de datos
**Cambio crítico:** Paso 1.5 nuevo - tests antes de commit
**Gravedad:** MÁXIMA - Violación de privacidad entre tenants
**Prioridad:** CRÍTICA - Cero tolerancia a bugs de multi-tenancy
