# PROMPT DE CONTINUACIÓN - SESIÓN NISMARA UMA VILLA

**Usar este prompt si la sesión se cierra y necesitas continuar:**

---

## PROMPT PARA CLAUDE CODE:

```
Estoy trabajando en el proyecto MYHOST Bizmate. Necesito continuar con la implementación de Business Reports para Nismara Uma Villa.

CONTEXTO:
- Cliente: Nismara Uma Villa (Owner: Gita Pradnyana, nismaraumavilla@gmail.com)
- 41 bookings históricos de Sep 2025 - Ago 2026
- Revenue total: IDR 139.9M (~$8,744 USD)
- Landing page: https://nismauma.lovable.app/

ESTADO ACTUAL:
1. ✅ Datos de Nismara Uma procesados y documentados
2. ✅ Business Reports implementado en Autopilot (pero hardcoded para Jose Carrallo)
3. ✅ RPC Functions creadas en Supabase (get_property_report_data, get_monthly_breakdown)
4. ⏳ Datos de Nismara Uma siendo insertados en Supabase por Claude AI
5. ❌ Business Reports NO configurado para Nismara Uma todavía

ARCHIVOS CLAVE:
- Informe completo: Claude AI and Code Update 01022026/INFORME_COMPLETO_NISMARA_UMA_01_FEBRERO_2026.md
- Datos JSON: nismara-report-data.json (41 bookings procesados)
- Componente: src/components/Autopilot/Autopilot.jsx

LO QUE FALTA HACER:
1. Verificar que datos de Nismara Uma están en Supabase (owner + property + bookings)
2. Actualizar Autopilot.jsx para generar reportes por owner (no hardcoded)
3. Generar primer informe HTML para Nismara Uma
4. Validar que métricas coinciden con Excel original

SIGUIENTE PASO INMEDIATO:
Verificar si los datos de Nismara Uma ya están en Supabase ejecutando:

SELECT u.id, u.full_name, u.email,
       p.id as property_id, p.name as property_name,
       COUNT(b.id) as total_bookings
FROM users u
LEFT JOIN properties p ON p.owner_id = u.id
LEFT JOIN bookings b ON b.property_id = p.id
WHERE u.email = 'nismaraumavilla@gmail.com'
GROUP BY u.id, u.full_name, u.email, p.id, p.name;

Si devuelve datos, continuar con paso 2 (actualizar Autopilot).
Si no devuelve nada, esperar a que termine inserción con Claude AI.

IMPORTANTE:
- NO crear más archivos SQL innecesarios
- NO intentar insertar datos directamente (Claude AI lo está haciendo)
- Ir despacio y confirmar cada paso
- Verificar antes de modificar código
```

---

## INFORMACIÓN ADICIONAL SI LA NECESITAS:

**Supabase Details:**
- URL: https://jjpscimtxrudtepzwhag.supabase.co
- Tenant ID: c24393db-d318-4d75-8bbf-0fa240b9c1db
- Current owner en DB: Jose Carrallo (josecarrallodelafuente@gmail.com)
- RPC Functions: Ya creadas y funcionando

**Owner Data Nismara Uma:**
- Email: nismaraumavilla@gmail.com
- Full Name: Gita Pradnyana
- Phone: +62 813 5351 5520
- Property: Nismara Uma Villa (Ubud, Bali)

**Bookings Data:**
- Total: 41 bookings
- Period: Sep 2025 - Ago 2026
- Total Revenue: IDR 139,909,985
- Sources: 38 Bali Buntu (OTA), 2 Direct (Gita), 1 Complimentary
- Data file: nismara-report-data.json

**Dev Server:**
- Running on: localhost:5173
- Branch: backup-antes-de-automatizacion
- Last commit: (verificar con git log)

---

## COMANDOS ÚTILES PARA VERIFICAR:

```bash
# Ver estado actual de git
git status

# Ver últimos commits
git log --oneline -5

# Ver archivos de Nismara Uma
ls -la "Claude AI and Code Update 01022026/"

# Verificar que dev server corre
curl http://localhost:5173
```

---

**Documento creado: 01 Febrero 2026**
**Propósito: Continuidad de sesión - Business Reports Nismara Uma Villa**
