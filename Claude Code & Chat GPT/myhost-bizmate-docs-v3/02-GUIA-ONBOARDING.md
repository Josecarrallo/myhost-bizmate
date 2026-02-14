# MY HOST BIZMATE - GUÍA DE ONBOARDING
## Nueva Propiedad en 30 Minutos
### Versión 3.0 - 15 Diciembre 2024

---

## CHECKLIST RÁPIDO

### Paso 1: Supabase (5 min)
- [ ] Crear registro en tabla `properties`
- [ ] Anotar el `property_id` generado
- [ ] Configurar precios en tabla `room_rates` (si aplica)

### Paso 2: n8n Workflows (10 min)
- [ ] Duplicar workflow VIII (WhatsApp AI Agent)
- [ ] Actualizar `property_id` en los 3 tools
- [ ] Actualizar System Prompt con info del hotel
- [ ] Activar workflow

### Paso 3: ChakraHQ/WhatsApp (5 min)
- [ ] Crear nuevo número o usar existente
- [ ] Configurar webhook apuntando al nuevo workflow
- [ ] Probar envío de mensaje

### Paso 4: Vapi.ai (10 min)
- [ ] Duplicar asistente "Ayu - Izumi Hotel"
- [ ] Cambiar nombre y System Prompt
- [ ] Actualizar Server URL del tool
- [ ] Duplicar workflow IX y actualizar property_id
- [ ] Probar llamada de voz

---

## DATOS NECESARIOS DEL CLIENTE

```
Nombre del hotel: ________________
Dirección: ________________
Teléfono: ________________
Email de contacto: ________________
Horario check-in: ________________
Horario check-out: ________________

HABITACIONES:
1. Nombre: _______ Precio/noche: $_______
2. Nombre: _______ Precio/noche: $_______
3. Nombre: _______ Precio/noche: $_______

Políticas especiales: ________________
```

---

## PERSONALIZACIÓN DEL PROMPT

### Secciones a modificar:

1. **Nombre del asistente:** Cambiar "Ayu" por nombre local
2. **Info del hotel:** Dirección, horarios, apertura
3. **Habitaciones y precios:** Lista completa
4. **Contacto de handoff:** WhatsApp y email del hotel

### Template base:
```
You are [NOMBRE], the virtual receptionist at [HOTEL], 
a [TIPO] hotel in [UBICACIÓN].

HOTEL INFO:
- Location: [DIRECCIÓN]
- Check-in: [HORA] | Check-out: [HORA]
- [INFO ADICIONAL]

ROOMS AND PRICES:
- [HABITACIÓN 1]: $[PRECIO]/night
- [HABITACIÓN 2]: $[PRECIO]/night
...
```

---

## VERIFICACIÓN FINAL

- [ ] WhatsApp responde a mensaje de texto
- [ ] WhatsApp responde a nota de voz
- [ ] WhatsApp analiza imagen enviada
- [ ] Consulta de disponibilidad funciona
- [ ] Cálculo de precio funciona
- [ ] Creación de reserva funciona
- [ ] Vapi responde a llamada de voz
- [ ] Reserva aparece en Supabase

---

*Tiempo total estimado: 30 minutos*
