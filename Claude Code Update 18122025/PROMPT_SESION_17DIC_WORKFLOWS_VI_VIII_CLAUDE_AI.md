# PROMPT PARA SESIÓN - ACTUALIZAR WORKFLOWS VI Y VIII
## MY HOST BizMate - 17 Diciembre 2024

---

## COPIAR Y PEGAR ESTO:

```
Hola, soy José de MY HOST BizMate. Continuamos con la actualización de los workflows de n8n.

CONTEXTO:
- El widget Vapi ya funciona en la web (www.my-host-bizmate.com)
- Necesitamos actualizar los workflows para incluir la info de contacto

DATOS DE CONTACTO IZUMI HOTEL:
📞 CONTACTO IZUMI HOTEL
WhatsApp: +62 813 2576 4867 (24/7)
Teléfono: +62 813 2576 4867 (8:00-22:00)
Web: www.my-host-bizmate.com (Asistente de voz 24/7)

TAREAS:

1. WORKFLOW VI (OxNTDO0yitqV6MAL) - Booking Confirmation
   - Añadir bloque de contacto al final del mensaje de confirmación de reserva
   - Tanto en el email (SendGrid) como en el WhatsApp al huésped

2. WORKFLOW VIII (ln2myAS3406D6F8W) - WhatsApp AI Agent  
   - Actualizar System Prompt con:
     a) Regla 5: Cuando cliente pide hablar/llamar → dar opciones de contacto
     b) Regla 8: Después de info importante o reserva → recordar opciones de contacto
   - Diferenciar entre "quiero llamar" (dar opciones) vs "quiero persona real" (handoff humano)

WORKFLOWS EN N8N:
- URL: https://n8n-production-bb2d.up.railway.app
- Workflow VI ID: OxNTDO0yitqV6MAL
- Workflow VIII ID: ln2myAS3406D6F8W

¿Empezamos con el Workflow VI o VIII?
```

---

## RESUMEN DE CAMBIOS A HACER

### Workflow VI - Booking Confirmation

**Email (SendGrid) - Añadir al final:**
```
━━━━━━━━━━━━━━━━━━━━━

📞 CONTACTO IZUMI HOTEL
WhatsApp: +62 813 2576 4867 (24/7)
Teléfono: +62 813 2576 4867 (8:00-22:00)
Web: www.my-host-bizmate.com (Asistente de voz 24/7)

¡Te esperamos! 🌺
```

**WhatsApp Huésped - Añadir al final:**
```
━━━━━━━━━━━━━━━━━━━━━

📞 *¿Preguntas?*
💬 WhatsApp: +62 813 2576 4867 (24/7)
📞 Teléfono: +62 813 2576 4867 (8:00-22:00)
🌐 Web: www.my-host-bizmate.com

¡Te esperamos! 🌺
```

---

### Workflow VIII - WhatsApp AI Agent

**Añadir Regla 5 al System Prompt:**
```
5. OPCIÓN DE LLAMADA DE VOZ:
   Si el usuario dice que prefiere hablar, llamar, o comunicarse por voz, responde:
   
   "¡Por supuesto! Tienes varias opciones:
   
   💬 *WhatsApp:* +62 813 2576 4867 (24/7)
   📞 *Teléfono:* +62 813 2576 4867 (8:00-22:00)
   🌐 *Web con asistente de voz:* www.my-host-bizmate.com
   
   ¿Hay algo más en lo que pueda ayudarte?"
```

**Añadir Regla 8 al System Prompt:**
```
8. CIERRE DE CONVERSACIONES IMPORTANTES:
   Después de completar una reserva o dar información detallada, añadir:
   
   "Si tienes más preguntas, estoy aquí 24/7 💬
   También puedes hablar por voz desde: www.my-host-bizmate.com"
```

**Actualizar Regla 6 (Handoff):**
```
6. HANDOFF A HUMANO - SOLO en estos casos:
   - El usuario pide explícitamente hablar con una PERSONA REAL
   - Quejas o problemas urgentes
   - Cancelación o modificación de reserva existente
   - Negociación de precios o descuentos
   - Grupos de +10 personas o eventos
   
   Respuesta: "Voy a conectarte con nuestro equipo humano. Te contactarán pronto (8:00-22:00 hora Bali). 
   WhatsApp: +62 813 2576 4867 / Email: reservations@izumi-hotel.com"
```

---

## DIFERENCIA CLAVE

| Cliente dice | Respuesta |
|--------------|-----------|
| "Quiero llamar" / "Prefiero hablar" | → Dar opciones: WhatsApp, Teléfono, Web (Regla 5) |
| "Quiero hablar con persona real" / "Un humano" | → Handoff a equipo humano (Regla 6) |

---

*Documento preparado: 16 Diciembre 2024*
*Para sesión del 17 Diciembre 2024*
