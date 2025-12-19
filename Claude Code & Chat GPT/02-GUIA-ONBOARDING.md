# MY HOST BizMate - Guía de Onboarding de Clientes
## Proceso de 20 minutos para activar un nuevo cliente

---

## RESUMEN

| Fase | Responsable | Duración |
|------|-------------|----------|
| Preparación | Cliente | 10 min |
| Configuración ChakraHQ | MY HOST | 5 min |
| Conexión Coexistence | Ambos | 5 min |
| **TOTAL** | | **20 min** |

---

## FASE 1: PREPARACIÓN (Cliente - 10 min)

### Lo que el cliente necesita tener listo:

1. **Facebook Business Manager** configurado
   - URL: https://business.facebook.com
   - Cuenta verificada

2. **WhatsApp Business App** instalada
   - En el teléfono donde tiene el número del hotel
   - Número verificado con WhatsApp Business

3. **Datos del hotel** para nosotros:
   - Nombre del hotel
   - Dirección completa
   - Número WhatsApp
   - Email de contacto
   - Tipos de habitación y precios
   - Políticas (check-in, check-out, cancelación)

### Email de preparación para enviar al cliente:

```
Asunto: Preparación para activar MY HOST BizMate - 10 minutos

Hola [Nombre],

Para activar tu asistente WhatsApp AI, necesitamos que prepares:

1. ✅ Tu cuenta de Facebook Business Manager (https://business.facebook.com)
2. ✅ La app WhatsApp Business instalada en tu teléfono
3. ✅ Los datos de tu hotel (te envío formulario adjunto)

Una vez tengas esto, agendamos una llamada de 10 minutos para conectarlo todo.

Saludos,
Equipo MY HOST BizMate
```

---

## FASE 2: CONFIGURACIÓN CHAKRAHQ (MY HOST - 5 min)

### Pasos en ChakraHQ:

1. **Añadir número de WhatsApp**
   - Settings → Phone Numbers → Add Number
   - Seleccionar "Coexistence Mode"

2. **Crear Label para el cliente**
   - Settings → Labels → Create
   - Nombre: `[NombreHotel]` o `Cliente001`

3. **Configurar en Supabase**
   - Añadir registro en tabla `properties`
   - Añadir registro en tabla `tenants` (cuando esté implementado)

4. **Configurar webhook en n8n**
   - El workflow multi-tenant detectará automáticamente el nuevo cliente

### Script SQL para nuevo cliente:

```sql
-- Añadir propiedad
INSERT INTO properties (name, location, description, owner_email, whatsapp_number)
VALUES (
  '[Nombre Hotel]',
  '[Ciudad, País]',
  '[Descripción]',
  '[email@hotel.com]',
  '[+62XXXXXXXXXX]'
);

-- Obtener el ID generado y usarlo para room_types, etc.
```

---

## FASE 3: CONEXIÓN COEXISTENCE (Ambos - 5 min)

### Durante la videollamada:

1. **MY HOST comparte pantalla** mostrando ChakraHQ

2. **Cliente en su teléfono:**
   - Abre WhatsApp Business
   - Va a Settings → Linked Devices
   - Escanea el QR que aparece en ChakraHQ

3. **Verificación:**
   - Enviar mensaje de prueba al WhatsApp del hotel
   - Confirmar que llega a ChakraHQ
   - Confirmar que el AI responde correctamente

4. **Configuración final:**
   - Activar el workflow en n8n
   - Asignar label al número

### Checklist de conexión:

- [ ] QR escaneado correctamente
- [ ] Mensaje de prueba recibido en ChakraHQ
- [ ] AI responde correctamente
- [ ] Label asignado
- [ ] Workflow activado

---

## POST-ONBOARDING

### Primeras 24 horas:

1. **Monitoreo activo**
   - Revisar las primeras conversaciones
   - Ajustar prompts si es necesario

2. **Email de bienvenida al cliente:**

```
Asunto: ¡Tu asistente WhatsApp AI está activo! 🎉

Hola [Nombre],

Tu asistente de MY HOST BizMate ya está funcionando 24/7.

📱 Número activo: [+62XXXXXXXXXX]
🤖 Capacidades: Consultas, disponibilidad, reservas

Próximos pasos:
- Envía un mensaje de prueba a tu número
- Revisa el inbox en [URL del dashboard]
- Cualquier duda, escríbenos

¡Bienvenido a MY HOST BizMate!
```

3. **Seguimiento día 3:**
   - Llamada de 5 minutos
   - Revisar métricas
   - Resolver dudas

---

## TROUBLESHOOTING

### Problema: QR no escanea
**Solución:** Cerrar y abrir WhatsApp Business, intentar de nuevo

### Problema: Mensajes no llegan a ChakraHQ
**Solución:** Verificar que Coexistence está activo, revisar conexión

### Problema: AI no responde
**Solución:** Verificar workflow activo en n8n, revisar logs

### Problema: Respuestas incorrectas
**Solución:** Ajustar prompt del AI Agent, añadir más contexto

---

## ESCALABILIDAD

### Capacidad actual (1 persona):
- 3 clientes/día = 15 clientes/semana
- 60 clientes/mes máximo

### Con proceso automatizado:
- Onboarding self-service
- 100+ clientes/mes posibles

---

**Última actualización:** 13 Diciembre 2025
