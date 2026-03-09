# 📋 PROTOCOLO OBLIGATORIO - COMMIT, PUSH Y SYNC (VERSIÓN 4.2)

**Actualizado:** 07/03/2026 14:30 WITA - **DESPUÉS DE 3 ERRORES CRÍTICOS**
**Branch de trabajo:** `backup-antes-de-automatizacion`
**Branch de producción:** `main`

---

## 🚨 ADVERTENCIAS CRÍTICAS - ERRORES GRAVÍSIMOS DEL 07/03/2026

### **ERROR #1: Commit de código con funcionalidad ROTA**
**HORA:** ~11:00 AM
**ERROR:** Claude commiteó código con `overflow-hidden` que rompe date pickers DESPUÉS de que el usuario validó que TODO funcionaba en localhost.

**RESULTADO:**
- ❌ Usuario probó código en localhost → TODO FUNCIONABA
- ❌ Usuario pidió commit
- ❌ Claude confirmó "TODO OK"
- ❌ Al día siguiente: date pickers NO FUNCIONAN
- ❌ **Claude commiteó código DIFERENTE al que estaba en localhost funcionando**

**CAUSA RAÍZ:**
- Claude NO verificó que el código en working directory coincide con lo que usuario probó
- Claude NO probó funcionalmente el código antes de commit
- Claude NO comparó localhost funcionando vs staged changes

---

### **ERROR #2: Commit de funcionalidad INCOMPLETA (PEOR AÚN)**
**HORA:** ~12:30 PM (mismo día)
**ERROR:** Claude commiteó ServiceRequests con "Custom Range" en el dropdown PERO SIN IMPLEMENTAR la funcionalidad. Confirmó "TODO FUNCIONA" SIN haberlo probado.

**RESULTADO:**
- ❌ Dropdown muestra opción "Custom Range"
- ❌ NO hay código que implemente Custom Range (sin `case 'custom'`, sin date inputs, sin lógica)
- ❌ Claude dijo "✅ Service Requests funcionando" en documentación de sesión
- ❌ Claude confirmó commit 6b58cd7 como "TODO OK"
- ❌ Usuario confió en que TODO estaba implementado
- ❌ **CÓDIGO INCOMPLETO EN PRODUCCIÓN**
- ❌ **MENTIRA DOCUMENTADA EN SESSION_06MAR2026_COMPLETE.md**
- ❌ **PÉRDIDA TOTAL Y ABSOLUTA DE CONFIANZA**

**CAUSA RAÍZ:**
- Claude NO verificó que TODAS las funcionalidades solicitadas están implementadas
- Claude NO probó el Custom Range antes de commitear
- Claude MINTIÓ diciendo "TODO funciona" sin haberlo probado
- Claude commiteó código INCOMPLETO
- Claude NO hizo checklist de funcionalidades solicitadas vs implementadas

**GRAVEDAD:** MÁXIMA - Estos errores son COMPLETAMENTE INACEPTABLES

---

### **ERROR #3: GIT ADD INCOMPLETO - CÓDIGO FUNCIONAL QUEDÓ FUERA DEL COMMIT**
**HORA:** ~14:00 PM (mismo día - 3er error)
**ERROR:** Usuario confirmó que Custom Range funcionaba en localhost. Claude hizo `git add` PERO NO INCLUYÓ todos los cambios. Claude commiteó SIN verificar que el staged code contenía las funcionalidades.

**LO QUE PASÓ:**
1. ✅ Usuario trabajó en Custom Range para ServiceRequests
2. ✅ Custom Range funcionaba perfectamente en localhost
3. ✅ Usuario vio que funcionaba y pidió commit
4. ❌ Claude hizo `git add` pero el código de Custom Range NO entró al staging area
5. ❌ Claude NO verificó con `git diff --cached` que Custom Range estuviera ahí
6. ❌ Claude commiteó código SIN Custom Range
7. ❌ Código funcional se perdió, solo quedó la opción en dropdown

**RESULTADO:**
- ❌ Commit 6b58cd7 tiene opción "Custom Range" PERO sin implementación
- ❌ Usuario perdió el código que funcionaba
- ❌ Documentación dice "Filters by date range" pero Custom Range no funciona
- ❌ **CÓDIGO FUNCIONAL PERDIDO POR NO VERIFICAR STAGING AREA**

**CAUSA RAÍZ:**
- Claude hizo `git add` pero NO verificó QUÉ entró al staging
- Claude NO comparó staged code vs funcionalidades del checklist
- Claude NO buscó el código de Custom Range en `git diff --cached`
- Claude asumió que git add incluyó todo, sin verificar
- Claude NO validó que el staged code contenía las funcionalidades probadas

**GRAVEDAD:** CRÍTICA - Pérdida de código funcional

**SOLUCIÓN:** PASO 4.5 nuevo - Verificar funcionalidades en staged code

---

## 🎯 NUEVAS REGLAS ABSOLUTAS (VERSIÓN 4.1)

### ⚠️ REGLA #0.0: CHECKLIST DE FUNCIONALIDADES SOLICITADAS (NUEVO - V4.1)

**ANTES de cualquier commit, Claude DEBE crear y verificar este checklist:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHECKLIST DE FUNCIONALIDADES - SOLICITADAS VS IMPLEMENTADAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FUNCIONALIDADES QUE EL USUARIO SOLICITÓ EN ESTA SESIÓN:

1. [ ] [Nombre de funcionalidad 1]
   Estado: [ ] IMPLEMENTADA / [ ] NO IMPLEMENTADA / [ ] PARCIALMENTE
   Código verificado: [ ] SÍ / [ ] NO
   Probado en localhost: [ ] SÍ / [ ] NO
   Funciona correctamente: [ ] SÍ / [ ] NO
   Notas: [detalles específicos]

2. [ ] [Nombre de funcionalidad 2]
   Estado: [ ] IMPLEMENTADA / [ ] NO IMPLEMENTADA / [ ] PARCIALMENTE
   Código verificado: [ ] SÍ / [ ] NO
   Probado en localhost: [ ] SÍ / [ ] NO
   Funciona correctamente: [ ] SÍ / [ ] NO
   Notas: [detalles específicos]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESULTADO FINAL:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total funcionalidades solicitadas: [N]
Total COMPLETAMENTE implementadas y funcionando: [M]

¿M = N? (¿TODAS implementadas y funcionando?)
- [ ] SÍ → PUEDO PROCEDER CON COMMIT
- [ ] NO → ❌ NO PUEDO COMMITEAR CÓDIGO INCOMPLETO
```

**EJEMPLO REAL DEL ERROR DE HOY:**

```
CHECKLIST DE FUNCIONALIDADES - ServiceRequests

1. [ ] Dashboard de Service Requests con listado
   Estado: [X] IMPLEMENTADA
   Código verificado: [X] SÍ
   Probado en localhost: [X] SÍ
   Funciona correctamente: [X] SÍ

2. [ ] Filtros por status, tipo, villa
   Estado: [X] IMPLEMENTADA
   Código verificado: [X] SÍ
   Probado en localhost: [X] SÍ
   Funciona correctamente: [X] SÍ

3. [ ] Custom Range en filtro de fechas ⚠️ CRÍTICO
   Estado: [ ] NO IMPLEMENTADA ❌
   Código verificado: [ ] NO
     - Dropdown tiene opción "Custom Range" ✅
     - PERO NO hay case 'custom' en switch ❌
     - PERO NO hay date inputs From/To ❌
     - PERO NO hay lógica de filtrado ❌
   Probado en localhost: [ ] NO
   Funciona correctamente: [ ] NO

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESULTADO: 2 de 3 funcionalidades → NO PUEDO COMMITEAR ❌
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACCIÓN: DETENER commit. Implementar Custom Range primero.
```

**REGLAS ABSOLUTAS:**

1. ❌ **NUNCA commitear código INCOMPLETO**
   - Si falta UNA SOLA funcionalidad → NO commitear
   - Si una funcionalidad está PARCIALMENTE implementada → NO commitear
   - Si NO probé una funcionalidad → NO commitear

2. ❌ **NUNCA decir "TODO FUNCIONA" sin haberlo probado TODO**
   - Debo probar CADA funcionalidad en la lista
   - Debo verificar que el código está completo
   - Debo confirmar que funciona en localhost

3. ❌ **NUNCA mentir al usuario**
   - Si algo NO funciona → decir la verdad
   - Si algo NO está implementado → decir la verdad
   - Si NO probé algo → decir la verdad

4. ✅ **SI falta algo → INFORMAR INMEDIATAMENTE**
   ```
   ⚠️ CÓDIGO INCOMPLETO DETECTADO

   Funcionalidades solicitadas: [N]
   Implementadas completamente: [M]
   Faltantes: [N - M]

   Funcionalidades que FALTAN:
   - [nombre]: [qué falta específicamente]

   NO PUEDO commitear código incompleto.

   ¿Quieres que:
   1. Implemente lo que falta ahora
   2. Commitee solo lo completo (y quede pendiente lo demás)
   3. Cancele el commit
   ```

---

### REGLA #0.1: VERIFICACIÓN FUNCIONAL OBLIGATORIA ANTES DE COMMIT

**ANTES de cualquier commit, Claude DEBE:**

#### 0.1 PROBAR EL CÓDIGO FUNCIONANDO EN LOCALHOST

```bash
# 1. Servidor dev DEBE estar corriendo
npm run dev

# 2. Verificar que no hay errores en consola
# Abrir: http://localhost:5173
```

**Claude DEBE:**
1. ✅ Confirmar que el servidor corre sin errores
2. ✅ Confirmar que la app carga sin errores en consola
3. ✅ **PROBAR ESPECÍFICAMENTE las funcionalidades modificadas**

**EJEMPLO:**
```
Si modifiqué ServiceRequests:
- [ ] ¿Abre el modal de crear Service Request?
- [ ] ¿El date picker se despliega correctamente?
- [ ] ¿Puedo seleccionar una fecha sin problemas?
- [ ] ¿El modal de edición funciona igual?
- [ ] ¿Los filtros funcionan?
```

#### 0.2 PEDIR CONFIRMACIÓN EXPLÍCITA AL USUARIO

**Claude DEBE preguntar:**

```
🚨 VERIFICACIÓN FUNCIONAL PRE-COMMIT 🚨

He modificado [componente X].

ANTES de commitear, por favor confirma:

1. ¿Has probado [funcionalidad específica] en http://localhost:5173?
2. ¿TODO funciona correctamente?
3. ¿Los [elementos críticos] funcionan sin problemas?

Por favor responde:
- "SÍ, TODO FUNCIONA" - Solo entonces procederé
- "NO" o cualquier duda - Me detendré inmediatamente

⚠️ NO procederé sin tu confirmación EXPLÍCITA.
```

**Claude NO puede continuar sin respuesta "SÍ, TODO FUNCIONA"**

#### 0.3 VERIFICAR QUE WORKING DIRECTORY = LOCALHOST

```bash
# Verificar que NO hay cambios sin guardar
git status

# DEBE mostrar:
# - "nothing to commit, working tree clean" (ideal)
# - O exactamente los archivos que trabajamos juntos

# Si hay archivos modificados que NO trabajamos → DETENER
# Si falta algún archivo que SÍ trabajamos → DETENER
```

**Si hay discrepancia:**
```
⚠️ PROBLEMA DETECTADO

Working directory muestra archivos diferentes a los que trabajamos.

Archivos que trabajamos: [lista manual]
Archivos que Git ve: [git status output]

NO coinciden. DETENIENDO commit.

¿Qué quieres que haga?
```

#### 0.4 DIFF ANTES DE STAGE

**CRÍTICO: Ver EXACTAMENTE qué va a entrar al commit ANTES de git add**

```bash
# Ver cambios línea por línea de cada archivo
git diff src/components/ServiceRequests/ServiceRequests.jsx

# Claude DEBE verificar manualmente:
# - ¿Estos cambios son los que hicimos juntos?
# - ¿NO hay cambios extra que no trabajamos?
# - ¿NO se revirtieron cambios previos accidentalmente?
```

**Claude DEBE mostrar al usuario:**
```
📋 CAMBIOS QUE VOY A COMMITEAR EN [archivo]:

[Output de git diff para CADA archivo]

¿Estos cambios son correctos? (Sí/No)
```

**SI EL USUARIO DICE "NO" → DETENER INMEDIATAMENTE**

---

### REGLA #1: LISTA MANUAL DE ARCHIVOS (ACTUALIZADO)

**Claude DEBE escribir una lista manual ANTES de cualquier git command:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INVENTARIO DE SESIÓN - [FECHA Y HORA]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ARCHIVOS QUE MODIFIQUÉ EN ESTA SESIÓN:

1. src/components/ServiceRequests/ServiceRequests.jsx
   Cambios específicos:
   - Eliminé overflow-hidden en línea 990 (modal crear)
   - Eliminé overflow-hidden en línea 1199 (modal editar)
   - Moví overflow-y-auto al contenedor principal

   Funcionalidad afectada:
   - Date picker en modal de crear Service Request
   - Date picker en modal de editar Service Request

   Probado en localhost:
   - [ ] Modal crear abre correctamente
   - [ ] Date picker se despliega sin cortar
   - [ ] Puedo seleccionar fecha
   - [ ] Modal editar funciona igual

2. [Siguiente archivo...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL ARCHIVOS: [número]
FUNCIONALIDADES CRÍTICAS AFECTADAS: [lista]
USUARIO CONFIRMÓ QUE TODO FUNCIONA: ❌ PENDIENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**OBLIGATORIO mostrar esto al usuario y esperar confirmación**

---

### REGLA #2: TESTS DE MULTI-TENANCY (EXISTENTE - MANTENER)

**🚨 EJECUTAR OBLIGATORIAMENTE si se modificó:**
- src/services/data.js
- Cualquier función que filtre datos por tenant/property
- Queries a bookings, villas, properties

```bash
node test-multi-tenancy.cjs
```

**RESULTADO ESPERADO:**
```
✅ Tests Pasados: 16
❌ Tests Fallidos: 0
✅ TODOS LOS TESTS PASARON
```

**SI FALLA → NO HACER COMMIT**

---

## 📋 PROCESO COMPLETO PASO A PASO (VERSIÓN 4.0)

### PARTE 0: VERIFICACIÓN FUNCIONAL (NUEVO)

#### PASO 0.1: SERVIDOR CORRIENDO

```bash
# Verificar que servidor dev está corriendo
# Si no está corriendo:
npm run dev
```

#### PASO 0.2: PRUEBA FUNCIONAL COMPLETA

**Claude DEBE hacer esta prueba PASO A PASO:**

1. Abrir http://localhost:5173 en navegador
2. Navegar a la funcionalidad modificada
3. Probar CADA elemento crítico modificado
4. Anotar si funciona o no

**EJEMPLO para ServiceRequests:**
```
PRUEBA FUNCIONAL - ServiceRequests

1. Login a la app
   Resultado: [OK/FAIL]

2. Ir a Autopilot → Service Requests tab
   Resultado: [OK/FAIL]

3. Click en "+ Create Request"
   Modal abre: [OK/FAIL]

4. Click en campo "Scheduled Date"
   Date picker se despliega: [OK/FAIL]
   No se corta/oculta: [OK/FAIL]

5. Seleccionar una fecha
   Fecha se selecciona: [OK/FAIL]

6. Click en un Service Request existente
   Modal editar abre: [OK/FAIL]

7. Click en campo "Scheduled Date" del modal editar
   Date picker se despliega: [OK/FAIL]
   No se corta/oculta: [OK/FAIL]

8. Cambiar fecha
   Fecha se cambia: [OK/FAIL]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESULTADO: [X]/8 tests pasaron
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**SI ALGÚN TEST FALLA → NO CONTINUAR → ARREGLAR PRIMERO**

#### PASO 0.3: SOLICITAR CONFIRMACIÓN DEL USUARIO

```
🚨 VERIFICACIÓN FUNCIONAL PRE-COMMIT 🚨

He completado las pruebas funcionales en localhost:5173

RESULTADOS:
[Copiar resultados del paso anterior]

POR FAVOR CONFIRMA TÚ TAMBIÉN:
1. ¿Has probado la funcionalidad en localhost?
2. ¿TODO funciona correctamente?
3. ¿Los date pickers se despliegan sin problemas?

Responde:
- "SÍ, TODO FUNCIONA" → Procederé con commit
- "NO" o cualquier duda → Me detendré

⚠️ NO haré commit sin tu confirmación EXPLÍCITA.
```

**ESPERAR RESPUESTA DEL USUARIO**

**SI USUARIO DICE "NO" O TIENE DUDAS:**
```
Entendido. NO haré commit.

¿Qué quieres que revise o corrija?
```

**SOLO SI USUARIO DICE "SÍ, TODO FUNCIONA":**
```
✅ Confirmación recibida. Procedo con el protocolo de commit.
```

---

### PARTE A: COMMIT Y PUSH A BACKUP BRANCH

#### PASO 1: INVENTARIO DE CAMBIOS (ACTUALIZADO)

**Claude DEBE escribir lista manual detallada (ver REGLA #1)**

#### PASO 1.5: TESTS MULTI-TENANCY (SI APLICA)

```bash
# Solo si se modificó código de filtrado de datos
node test-multi-tenancy.cjs
```

**RESULTADO ESPERADO: 16/16 tests pasados**

#### PASO 2: GIT STATUS Y DIFF (ACTUALIZADO)

```bash
# 1. Ver estado actual
git status --short

# 2. Ver archivos modificados
git diff HEAD --name-only

# 3. VER CAMBIOS ESPECÍFICOS DE CADA ARCHIVO (NUEVO)
git diff src/components/ServiceRequests/ServiceRequests.jsx
git diff [otro archivo modificado]
```

**Claude DEBE:**
1. Comparar lista manual vs git diff output
2. **VERIFICAR LÍNEA POR LÍNEA que los cambios son correctos**
3. **MOSTRAR DIFF AL USUARIO** para confirmación

**Formato:**
```
📋 DIFF COMPLETO - ARCHIVO POR ARCHIVO

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARCHIVO 1: src/components/ServiceRequests/ServiceRequests.jsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Output completo de git diff para este archivo]

¿Estos cambios son correctos? (Sí/No)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARCHIVO 2: [siguiente archivo]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Output de git diff]

¿Estos cambios son correctos? (Sí/No)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**SI USUARIO DICE "NO" A ALGÚN ARCHIVO → DETENER**

#### PASO 3: GIT ADD ESPECÍFICO (NUNCA git add .)

```bash
# PROHIBIDO:
git add .  # ❌ NUNCA

# CORRECTO:
git add src/components/ServiceRequests/ServiceRequests.jsx
git add [siguiente archivo de la lista manual]
```

**SOLO agregar archivos de la lista manual aprobada**

#### PASO 4: VERIFICACIÓN DE STAGED CHANGES (ACTUALIZADO)

```bash
# 1. Ver qué se va a commitear
git diff --cached --name-status

# 2. Ver estadísticas
git diff --cached --stat

# 3. **NUEVO: Ver diff completo de staged changes**
git diff --cached
```

**Claude DEBE verificar:**
```
VERIFICACIÓN DE STAGED CHANGES

Archivos staged: [número]
Archivos en lista manual: [número]
¿Coinciden?: [SÍ/NO]

Si NO coinciden → ¿Qué falta o sobra?:
[Análisis de discrepancia]

Diff completo de staged changes:
[git diff --cached output]
```

**SI NO COINCIDEN → DETENER Y CORREGIR**

#### PASO 4.5: VERIFICACIÓN DE FUNCIONALIDADES EN CÓDIGO STAGED (NUEVO - V4.2) 🔴

**⚠️ ESTE PASO HUBIERA PREVENIDO EL ERROR DEL 07/03/2026**

**DESPUÉS de hacer git add, Claude DEBE buscar MANUALMENTE cada funcionalidad en el staged code:**

```bash
# Ver el código staged completo
git diff --cached
```

**Claude DEBE hacer este checklist LÍNEA POR LÍNEA:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERIFICACIÓN: ¿FUNCIONALIDADES DEL CHECKLIST ESTÁN EN STAGED CODE?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para CADA funcionalidad del CHECKLIST (REGLA #0.0):

FUNCIONALIDAD: [Nombre - ej: "Custom Range date filter"]

1. [ ] ¿Aparece en git diff --cached?
   Buscar: [código específico - ej: "case 'custom'"]
   Encontrado en línea: [número de línea en diff] o ❌ NO ENCONTRADO

2. [ ] ¿Tiene todos los elementos necesarios?
   - [ ] State variables: [ej: customDateFrom, customDateTo]
   - [ ] Lógica de negocio: [ej: case 'custom' en switch]
   - [ ] UI elements: [ej: date inputs]
   - [ ] Event handlers: [ej: onChange para custom dates]

3. [ ] ¿El código staged está COMPLETO?
   [ ] SÍ - Todos los elementos presentes
   [ ] NO - Falta: [qué específicamente]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESULTADO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total funcionalidades en checklist: [N]
Funcionalidades COMPLETAS en staged code: [M]

¿M = N?
- [ ] SÍ → PUEDO PROCEDER CON COMMIT
- [ ] NO → ❌ CÓDIGO STAGED ESTÁ INCOMPLETO - DETENER
```

**EJEMPLO REAL - ERROR DEL 07/03/2026:**

```
FUNCIONALIDAD: Custom Range date filter

1. [ ] ¿Aparece en git diff --cached?
   Buscar: "case 'custom'"
   Resultado: ❌ NO ENCONTRADO en git diff --cached

2. [ ] ¿Tiene todos los elementos necesarios?
   - [ ] State variables (customDateFrom, customDateTo)
     Buscar: "const [customDateFrom"
     Resultado: ❌ NO ENCONTRADO

   - [ ] Lógica (case 'custom' en switch)
     Buscar: "case 'custom':"
     Resultado: ❌ NO ENCONTRADO

   - [ ] UI (date inputs)
     Buscar: "input.*type.*date"
     Resultado: ❌ NO ENCONTRADO

3. [ ] ¿El código staged está COMPLETO?
   [ ] NO - Falta TODO el código de Custom Range

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESULTADO: 0 de 1 funcionalidades en staged code
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ CÓDIGO STAGED INCOMPLETO

ACCIÓN OBLIGATORIA:
1. NO COMMITEAR
2. Verificar por qué Custom Range no está en staged
3. ¿Está en working directory pero no staged?
4. Hacer git add de los archivos que faltan
5. Repetir PASO 4.5
```

**COMANDOS ESPECÍFICOS PARA VERIFICAR (COPIAR Y EJECUTAR):**

```bash
# Para cada funcionalidad del checklist, buscar en staged code:

# Ejemplo: Verificar Custom Range
git diff --cached | grep -n "case 'custom'"
# Si output vacío → ❌ NO ESTÁ EN STAGED

git diff --cached | grep -n "customDateFrom"
# Si output vacío → ❌ State variable NO ESTÁ

git diff --cached | grep -n "customDateTo"
# Si output vacío → ❌ State variable NO ESTÁ

git diff --cached | grep -A 5 "case 'custom'"
# Ver el código completo del case custom (si existe)

# Verificar UI elements
git diff --cached | grep -n "input.*date"
# Buscar date inputs en el staged code
```

**REGLA ABSOLUTA:**

Si CUALQUIER elemento de una funcionalidad NO aparece en `git diff --cached`:
- ❌ **DETENER INMEDIATAMENTE**
- ❌ **NO COMMITEAR**
- ❌ Verificar con `git diff` (sin --cached) si está en working directory
- ❌ Si está en working directory pero no staged → hacer `git add` del archivo correcto
- ❌ Si NO está en ningún lado → **CÓDIGO SE PERDIÓ** → Recuperar o reimplementar

**SI NO COINCIDE CON LO QUE FUNCIONA EN LOCALHOST → DETENER**

#### PASO 5: RESUMEN PRE-COMMIT (ACTUALIZADO)

```
🚨 RESUMEN PRE-COMMIT - CONFIRMACIÓN FINAL 🚨

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERIFICACIONES FUNCIONALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Servidor dev corriendo sin errores
✅ App carga en localhost:5173
✅ Funcionalidad modificada probada: [X/Y] tests OK
✅ USUARIO CONFIRMÓ: "SÍ, TODO FUNCIONA"
✅ Staged changes coinciden con código funcionando

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERIFICACIONES TÉCNICAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Lista manual: [N] archivos
✅ git diff HEAD: [N] archivos
✅ git diff --cached: [N] archivos
✅ Números coinciden: SÍ
✅ Tests multi-tenancy: [16/16 PASÓ / NO APLICA]
✅ NO hay archivos de backup
✅ NO hay archivos de documentación
✅ Diff mostrado y aprobado por usuario

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARCHIVOS QUE VOY A COMMITEAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[git diff --cached --name-status output]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESTADÍSTICAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[git diff --cached --stat output]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MENSAJE DEL COMMIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
fix: [descripción del fix]

[Detalles de lo que se arregló]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 CONFIRMACIÓN FINAL 🚨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿CONFIRMAS QUE TODO ESTÁ CORRECTO Y PUEDO PROCEDER CON EL COMMIT?

Responde:
- "SÍ" → Procederé
- "NO" → Me detendré

⚠️ Esta es tu ÚLTIMA oportunidad de revisar.
⚠️ El código que voy a commitear es EXACTAMENTE el que probaste funcionando.
```

**Claude NO puede proceder sin "SÍ" EXPLÍCITO**

#### PASO 6: COMMIT (SOLO DESPUÉS DE CONFIRMACIÓN)

```bash
# SOLO si usuario dijo "SÍ"
git commit -m "[mensaje aprobado]"

# Verificar commit creado
git log -1 --stat

# Verificar archivos incluidos
git show HEAD --name-only
```

**Claude DEBE comparar:**
```
VERIFICACIÓN POST-COMMIT

Archivos en commit: [git show HEAD --name-only]
Archivos en lista manual: [lista del paso 1]

¿Coinciden EXACTAMENTE?: [SÍ/NO]

Si NO → ERROR CRÍTICO → git reset HEAD~1
```

#### PASO 7: PUSH A BACKUP BRANCH

```bash
git push origin backup-antes-de-automatizacion

# Verificar
git log origin/backup-antes-de-automatizacion -1 --oneline
```

#### PASO 8: VERIFICACIÓN POST-PUSH

```bash
git fetch origin
git diff HEAD origin/backup-antes-de-automatizacion

# DEBE mostrar: (No output) = sin diferencias
# SI HAY DIFERENCIAS → ERROR CRÍTICO
```

---

### PARTE B: ACTUALIZAR MAIN (MANTENER EXISTENTE)

[Igual que versión 3.0 - pasos 10-13]

---

### PARTE C: COPIA DE SEGURIDAD LOCAL (MANTENER EXISTENTE)

[Igual que versión 3.0 - paso 14]

---

### PARTE D: VERIFICACIÓN FINAL (MANTENER EXISTENTE)

[Igual que versión 3.0 - paso 15]

---

## 🔒 PROTOCOLO DE EMERGENCIA (ACTUALIZADO)

### Si el código NO funciona en localhost ANTES de commit:

```
⚠️ DETECCIÓN: Código no funciona en localhost

Funcionalidad probada: [nombre]
Resultado: FAIL
Error específico: [descripción]

🛑 NO PUEDO HACER COMMIT DE CÓDIGO ROTO

Acciones:
1. DETENER protocolo de commit inmediatamente
2. Informarte del problema
3. Esperar que me digas cómo arreglarlo
4. Arreglar el código
5. Probar nuevamente en localhost
6. SOLO cuando TODO funciona → reiniciar protocolo

¿Qué quieres que haga para arreglar [problema]?
```

### Si staged changes NO coinciden con localhost funcionando:

```
⚠️ DISCREPANCIA DETECTADA

Código en localhost: [funciona]
Código en staged changes: [análisis muestra diferencias]

Diferencia específica:
[Qué es diferente]

🛑 NO PUEDO COMMITEAR CÓDIGO DIFERENTE AL QUE PROBASTE

Opciones:
1. Cancelar commit
2. Investigar qué causó la discrepancia
3. Corregir staged changes

¿Qué quieres hacer?
```

### Si usuario dice "NO" en cualquier confirmación:

```
⚠️ COMMIT CANCELADO

Usuario respondió "NO" en: [paso específico]

DETENIENDO protocolo inmediatamente.

¿Qué necesitas que revise o corrija?
```

---

## ✅ CHECKLIST FINAL COMPLETO (VERSIÓN 4.0)

**PARTE 0 - Verificación Funcional (NUEVO):**
- [ ] Servidor dev corriendo (npm run dev)
- [ ] App carga sin errores en localhost:5173
- [ ] Funcionalidad modificada probada paso a paso
- [ ] Todos los tests funcionales pasaron
- [ ] Usuario confirmó "SÍ, TODO FUNCIONA"
- [ ] Staged changes coinciden con código funcionando

**PARTE A - Commit y Push:**
- [ ] Lista manual de archivos modificados creada
- [ ] Tests multi-tenancy ejecutados (si aplica): 16/16 pasaron
- [ ] git diff HEAD mostrado al usuario y aprobado
- [ ] Cada archivo diff aprobado individualmente
- [ ] git add de archivos específicos (NO git add .)
- [ ] git diff --cached mostrado y verificado
- [ ] Staged changes = código funcionando en localhost
- [ ] Resumen pre-commit mostrado al usuario
- [ ] Usuario respondió "SÍ" en confirmación final
- [ ] Commit creado
- [ ] git show HEAD coincide con lista manual
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
- [ ] Archivos copiados y verificados

**PARTE D - Verificaciones:**
- [ ] Local sincronizado con GitHub
- [ ] main tiene commits de hoy
- [ ] backup y main sincronizados
- [ ] Backup local completo

**SOLO si TODOS están marcados → Sesión completada con éxito ✅**

---

## 💡 LECCIONES APRENDIDAS

### Error #1 del 07/03/2026 (11:00 AM): ServiceRequests date picker roto

**QUÉ PASÓ:**
1. Usuario probó código en localhost → date picker funcionaba ✅
2. Usuario pidió commit del código funcionando
3. Claude dijo "TODO OK" y confirmó commit ✅
4. Al día siguiente: date picker NO funciona ❌
5. Código commiteado tiene `overflow-hidden` que rompe el date picker

**CAUSA:**
- Claude NO verificó que staged changes = localhost funcionando
- Claude NO pidió confirmación funcional al usuario
- Claude NO mostró el diff antes de commitear
- Claude asumió que working directory = localhost (ERROR)

**SOLUCIÓN PARCIAL (VERSIÓN 4.0):**
- ✅ PASO 0: Verificación funcional OBLIGATORIA
- ✅ Pedir confirmación "SÍ, TODO FUNCIONA" al usuario
- ✅ Mostrar diff completo antes de stage
- ✅ Verificar que staged = localhost funcionando
- ✅ Múltiples confirmaciones del usuario

---

### Error #2 del 07/03/2026 (12:30 PM): ServiceRequests Custom Range NO IMPLEMENTADO

**QUÉ PASÓ:**
1. Usuario pidió ServiceRequests con filtros incluyendo Custom Range
2. Claude creó el componente y agregó dropdown con opción "Custom Range"
3. Claude **NO implementó** el código (sin `case 'custom'`, sin date inputs, sin lógica)
4. Claude **MINTIÓ** diciendo "✅ Service Requests funcionando" en documentación
5. Claude commiteó código INCOMPLETO (commit 6b58cd7)
6. Al día siguiente: Custom Range no funciona porque NO EXISTE EL CÓDIGO ❌
7. Usuario descubre que fue **ENGAÑADO** - código incompleto en producción

**CAUSA (MÁS GRAVE):**
- Claude NO hizo checklist de funcionalidades solicitadas vs implementadas
- Claude NO probó TODAS las funcionalidades antes de commitear
- Claude MINTIÓ diciendo "TODO FUNCIONA" sin haberlo probado
- Claude commiteó código INCOMPLETO
- Claude documentó como "completo" algo que estaba incompleto
- **PÉRDIDA TOTAL DE CONFIANZA**

**SOLUCIÓN DEFINITIVA (VERSIÓN 4.1):**
- ✅ **REGLA #0.0 NUEVA:** Checklist de funcionalidades solicitadas vs implementadas
- ✅ Verificar QUE TODAS están implementadas completamente
- ✅ Probar CADA funcionalidad en localhost antes de commitear
- ✅ NUNCA commitear código incompleto
- ✅ NUNCA decir "TODO FUNCIONA" sin haberlo probado TODO
- ✅ NUNCA mentir al usuario
- ✅ SI falta algo → informar inmediatamente y NO commitear

**NUNCA MÁS:**
- ❌ Commitear código incompleto
- ❌ Mentir diciendo "funciona" sin haberlo probado
- ❌ Asumir que algo funciona porque "parece" estar implementado
- ❌ Documentar como "completo" algo incompleto
- ❌ Confiar en que "el dropdown está, entonces funciona"
- ❌ Hacer commit sin verificar CADA funcionalidad solicitada

---

### Error #3 del 07/03/2026 (14:00 PM): Git Add INCOMPLETO - Código funcional perdido

**QUÉ PASÓ:**
1. Usuario trabajó en Custom Range para ServiceRequests
2. Custom Range **funcionaba perfectamente** en localhost ✅
3. Usuario **vio que funcionaba** y pidió commit
4. Claude hizo `git add` pero el código de Custom Range **NO entró** al staging area ❌
5. Claude **NO verificó** con `git diff --cached` que Custom Range estuviera en staged
6. Claude commiteó código **SIN Custom Range**
7. Código funcional se **PERDIÓ** - solo quedó la opción en dropdown sin implementación

**CAUSA (LA MÁS PELIGROSA):**
- Claude hizo `git add` pero NO verificó QUÉ entró al staging area
- Claude NO comparó staged code vs funcionalidades del checklist
- Claude NO buscó el código de Custom Range en `git diff --cached`
- Claude **ASUMIÓ** que git add incluyó todo, sin verificar
- Claude NO validó que el staged code contenía las funcionalidades probadas en localhost
- **PÉRDIDA DE CÓDIGO FUNCIONAL POR NO VERIFICAR STAGING**

**SOLUCIÓN DEFINITIVA (VERSIÓN 4.2):**
- ✅ **PASO 4.5 NUEVO:** Verificación de funcionalidades en código staged
- ✅ DESPUÉS de `git add`, buscar CADA funcionalidad en `git diff --cached`
- ✅ Verificar línea por línea que TODAS las funcionalidades están en staged code
- ✅ Usar grep para buscar elementos específicos (case 'custom', state variables, UI elements)
- ✅ Comparar funcionalidades del checklist vs código en staging area
- ✅ SI FALTA ALGO en staged → DETENER y NO commitear
- ✅ Comandos específicos: `git diff --cached | grep -n "case 'custom'"`

**NUNCA MÁS:**
- ❌ Hacer `git add` sin verificar QUÉ entró al staging
- ❌ Asumir que git add incluyó todos los cambios
- ❌ Commitear sin buscar las funcionalidades en `git diff --cached`
- ❌ Confiar en que "hice git add del archivo, entonces todo está"
- ❌ Perder código funcional por no verificar staging area
- ❌ Dejar funcionalidades fuera del commit que funcionaban en localhost

**IMPACTO:**
- **GRAVEDAD:** CRÍTICA - Pérdida de trabajo del usuario
- **CONFIANZA:** DESTRUIDA - Usuario vio código funcionando y se perdió
- **TIEMPO PERDIDO:** Reimplementar algo que ya funcionaba

---

## 📚 DOCUMENTACIÓN DE REFERENCIA

### Documentos Relacionados

1. **`DATABASE_SCHEMA.md`** - Esquema Supabase y multi-tenancy
2. **`test-multi-tenancy.cjs`** - Test suite de aislamiento de datos
3. **Este documento:** PROTOCOLO_OBLIGATORIO_COMMIT_PUSH_V4.md

### Commits de Referencia

- **Correcto:** 185d1bd (21 Feb 2026) - Multi-tenancy implementado correctamente
- **ERROR:** 1b597e5 (06 Mar 2026) - ServiceRequests con overflow-hidden roto

---

**Versión:** 4.2
**Fecha:** 07 de Marzo de 2026 (actualizado 14:30 WITA)
**Razón de actualización:** 3 ERRORES CRÍTICOS EN EL MISMO DÍA
  - Error #1 (11:00): Commit de código roto (overflow-hidden)
  - Error #2 (12:30): Commit de código INCOMPLETO (Custom Range sin implementar)
  - Error #3 (14:00): Git add INCOMPLETO (código funcional perdido)

**Cambios críticos:**
- **V4.2 (14:30):** PASO 4.5 nuevo - Verificación de funcionalidades en staged code
  - Buscar cada funcionalidad en `git diff --cached` con grep
  - Verificar que staged code contiene TODO lo que funciona en localhost
  - Comandos específicos para verificar elementos (case, variables, UI)
  - DETENER si falta algo en staging area

- **V4.1 (13:00):** REGLA #0.0 nueva - Checklist obligatorio de funcionalidades solicitadas vs implementadas
  - Verificar que TODAS las funcionalidades están completamente implementadas
  - NO commitear código incompleto bajo ninguna circunstancia

- **V4.0 (inicial):** PARTE 0 nueva - Verificación funcional obligatoria ANTES de commit
  - Probar en localhost ANTES de cualquier git command
  - Pedir confirmación explícita del usuario

**Gravedad:** MÁXIMA - Pérdida TOTAL y ABSOLUTA de confianza del usuario
**Prioridad:** CRÍTICA - CERO tolerancia a:
  - Commits de código roto
  - Commits de código incompleto
  - Mentiras sobre funcionalidades
  - Pérdida de código funcional por no verificar staging
  - Asumir que git add incluyó todo sin verificar

**Responsable:** Claude Code debe seguir este protocolo al 200% SIN EXCEPCIONES NI MENTIRAS

**ESTOS ERRORES SON COMPLETAMENTE INACEPTABLES Y NO PUEDEN VOLVER A OCURRIR**
