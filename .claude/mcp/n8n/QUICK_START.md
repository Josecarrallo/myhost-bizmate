# ⚡ Quick Start - n8n MCP en 5 Pasos

## 1️⃣ Obtén tu API Key (2 min)

```
https://n8n-production-bb2d.up.railway.app
→ Settings ⚙️
→ API
→ Create API Key
→ COPIA LA KEY
```

## 2️⃣ Prueba la Conexión (1 min)

```bash
# Windows PowerShell
$env:N8N_API_KEY="tu_key"; node .claude\mcp\n8n\test.js

# macOS/Linux
N8N_API_KEY=tu_key node .claude/mcp/n8n/test.js
```

Debe decir: ✅ Connection successful!

## 3️⃣ Configura Claude Code (3 min)

### Archivo a editar:

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

### Contenido:

```json
{
  "mcpServers": {
    "n8n": {
      "command": "node",
      "args": ["C:\\myhost-bizmate\\.claude\\mcp\\n8n\\index.js"],
      "env": {
        "N8N_API_URL": "https://n8n-production-bb2d.up.railway.app/api/v1",
        "N8N_API_KEY": "PEGA_TU_KEY_AQUI"
      }
    }
  }
}
```

**Importante en Windows:** Usa `\\` (doble backslash)

## 4️⃣ Reinicia Claude Code (1 min)

1. Cierra Claude Code **completamente**
2. Abre de nuevo
3. Espera 10-15 segundos

## 5️⃣ Prueba que Funciona (1 min)

Escribe en Claude Code:

```
"List all my n8n workflows"
```

Si ves tus workflows → **✅ FUNCIONA!**

---

## 🚀 Comandos que Puedes Usar Ahora

```
"Muéstrame todos los workflows"
"Crea un workflow de prueba"
"Muéstrame las últimas ejecuciones"
"Ejecuta el workflow de bienvenida"
"Añade un nodo de Slack al workflow X"
```

## 🎯 Crear tu Flujo B

```
"Crea el Flujo B de Recomendaciones IA Diarias:
- Schedule: diario 9 AM
- Query: active guests from Supabase
- AI: Claude recommendations
- Send: email + WhatsApp
- Log: to Supabase"
```

**Tiempo:** ~3-5 minutos vs 45-60 min manualmente

---

## ❌ Si Algo Sale Mal

### MCP no aparece
→ Verifica ruta en config (usa `\\` en Windows)
→ Reinicia Claude Code

### API error
→ Regenera API key en n8n
→ Actualiza en config

### No conecta
→ Verifica Railway está corriendo
→ Abre: https://n8n-production-bb2d.up.railway.app

---

**Tiempo total:** ~8 minutos
**Ahorro en primer workflow:** ~40-50 minutos
**ROI:** Inmediato 🎉
