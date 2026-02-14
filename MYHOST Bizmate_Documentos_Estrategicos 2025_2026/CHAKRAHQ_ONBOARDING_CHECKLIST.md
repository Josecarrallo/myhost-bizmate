# CHAKRAHQ ONBOARDING - Checklist para añadir número de Owner

---

## 1. PREPARAR AL OWNER (Antes de la sesión)

Pedir por WhatsApp/email:

- [ ] Número que quieren usar en **WhatsApp Business** (ideal: app WhatsApp Business ya instalada)
- [ ] Cuenta personal de **Facebook** con la que puedan iniciar sesión
- [ ] Datos a mano:
  - Nombre del negocio
  - País (Indonesia)
  - Web o Instagram (opcional pero ayuda)

---

## 2. INICIAR PROCESO EN CHAKRA (Tú haces)

1. Inicias sesión en tu cuenta de Chakra
2. Vas a la sección de WhatsApp ("Chat / WhatsApp / Connect" o similar)
3. Click en **"Connect WhatsApp"** o **"Add Phone Number (Embedded Signup)"**

> Esto abre una ventana/iframe de Meta dentro de Chakra (Embedded Signup)

---

## 3. EMBEDDED SIGNUP (Guiar al owner)

### Paso 3.1 - Login con Facebook
- [ ] Owner pulsa "Continuar con Facebook"
- [ ] Mete usuario/contraseña
- [ ] **IMPORTANTE:** Aceptar TODOS los permisos para Chakra (no quitar checks)

### Paso 3.2 - Crear o elegir Business Manager
- [ ] Meta pregunta: crear nuevo negocio o usar existente
- [ ] Si no tiene → crear nuevo:
  - Nombre de negocio
  - País (Indonesia)
  - Datos básicos

### Paso 3.3 - Crear o elegir cuenta WhatsApp Business
- [ ] Elegir **"Create a new WhatsApp Business Account"**
- [ ] Poner nombre visible (ej. "Villa Surya Bali")
- [ ] Categoría y descripción corta

### Paso 3.4 - Añadir y verificar número
- [ ] Escribir número completo con prefijo (ej. +62...)
- [ ] Elegir verificación: **SMS** o **Llamada**
- [ ] Introducir código cuando llegue al móvil

### Paso 3.5 - Confirmar y finalizar
- [ ] Revisar resumen (Business, WABA, número)
- [ ] Click en **"Finish" / "Done"**
- [ ] Ventana se cierra → Chakra muestra número conectado

> ✅ En este momento, Chakra ya tiene: WABA, phone_number_id, coexistence activo

---

## 4. CONFIGURACIÓN EN CHAKRA (Tú haces)

- [ ] Verificar que número aparece en lista con estado **"Connected/Active"**
- [ ] Activar **Coexistence** si aparece como opción (para que owner siga usando app WhatsApp Business)
- [ ] Opcional: ajustar nombre visible, foto de perfil, horario, mensajes automáticos

---

## 5. INTEGRAR CON MY HOST BizMate (Técnico)

El owner no toca nada aquí:

- [ ] Tomar de Chakra: phone_number_id, webhooks
- [ ] En Supabase crear/actualizar owner con referencia al número
- [ ] En n8n/BANYU configurar flujos para ese owner usando ese número

---

## 6. CIERRE CON EL OWNER (Lo que le explicas)

Script sugerido:

> "A partir de ahora, todos los mensajes que entren en tu WhatsApp Business pasan también por nuestra plataforma."
>
> "Tu número sigue funcionando normal en el móvil, pero cuando haga falta, el asistente contestará por ti o te avisará."
>
> "Si quieres cambiar algo (horarios, mensajes, etc.), me lo dices y lo ajustamos."

---

## RESULTADO FINAL

```
Número owner (+62 XXX) → ChakraHQ → Webhook → BANYU responde automático
                              ↓
                    Owner sigue viendo chats en su móvil
```

---

## NOTAS IMPORTANTES

- Todo se hace desde Chakra con ventana Meta incrustada
- NO necesitas tocar Facebook Developers
- El owner NO navega paneles raros
- Coexistence permite que owner use app normal + automatización API

---
