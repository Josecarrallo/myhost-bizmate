# Instalación Rápida - n8n MCP LITE

## ✅ Paso 1: Obtener API Key de n8n

1. **Abre tu n8n:** https://n8n-production-bb2d.up.railway.app
2. **Ve a:** Settings (⚙️) → API
3. **Genera nueva API key** y cópiala

## ✅ Paso 2: Configurar Claude Code

### Ubicación del archivo de configuración:

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Linux:**
```
~/.config/Claude/claude_desktop_config.json
```

### Contenido a agregar/modificar:

```json
{
  "mcpServers": {
    "n8n": {
      "command": "node",
      "args": ["C:\\myhost-bizmate\\.claude\\mcp\\n8n\\index.js"],
      "env": {
        "N8N_API_URL": "https://n8n-production-bb2d.up.railway.app/api/v1",
        "N8N_API_KEY": "TU_API_KEY_AQUI"
      }
    }
  }
}
```

**IMPORTANTE:**
- Reemplaza `TU_API_KEY_AQUI` con tu API key de n8n
- En Windows, usa doble barra invertida `\\` en las rutas
- Si ya tienes otros MCP servers, agrega "n8n" dentro de "mcpServers"

### Ejemplo con múltiples MCP servers:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/dir"]
    },
    "n8n": {
      "command": "node",
      "args": ["C:\\myhost-bizmate\\.claude\\mcp\\n8n\\index.js"],
      "env": {
        "N8N_API_URL": "https://n8n-production-bb2d.up.railway.app/api/v1",
        "N8N_API_KEY": "TU_API_KEY_AQUI"
      }
    }
  }
}
```

## ✅ Paso 3: Reiniciar Claude Code

1. **Cierra Claude Code completamente**
2. **Ábrelo de nuevo**
3. **Verifica que cargó el MCP:**
   - Deberías ver el ícono de herramientas (🔨)
   - O puedes preguntar: "What MCP servers are available?"

## ✅ Paso 4: Probar el MCP

Prueba con estos comandos:

```
"List all my n8n workflows"
```

Deberías ver una lista de tus workflows actuales.

```
"Show me the last 5 workflow executions"
```

Verás el historial de ejecuciones.

## 🔧 Troubleshooting

### No aparece el MCP server

**Solución:**
1. Verifica que la ruta en `claude_desktop_config.json` es correcta
2. Asegúrate de usar `\\` en Windows (no `/`)
3. Revisa que las dependencias están instaladas: `cd .claude/mcp/n8n && npm install`

### Error de API Key

**Solución:**
1. Verifica que copiaste la API key completa
2. Regenera una nueva API key en n8n
3. No uses comillas alrededor de la API key en el JSON

### Error de conexión a n8n

**Solución:**
1. Verifica que tu instancia Railway está corriendo
2. Prueba acceder a: https://n8n-production-bb2d.up.railway.app
3. Verifica que la URL en la config es correcta

## 📝 Verificación Completa

Ejecuta este checklist:

- [ ] API key obtenida de n8n
- [ ] archivo `claude_desktop_config.json` creado/modificado
- [ ] API key copiada correctamente (sin comillas extras)
- [ ] Rutas con `\\` en Windows
- [ ] Claude Code reiniciado completamente
- [ ] Comando de prueba ejecutado: "List all my n8n workflows"

## 🎉 Listo!

Si todo funcionó, ahora puedes:

✅ Crear workflows desde Claude Code
✅ Ver y analizar ejecuciones
✅ Triggear workflows manualmente
✅ Actualizar workflows existentes
✅ Listar todos tus workflows

## Próximos Pasos

Prueba creando tu primer workflow:

```
"Crea un workflow simple de prueba que se llame 'Hello World Test'"
```

O revisa las ejecuciones de un workflow específico:

```
"Muéstrame las últimas ejecuciones del workflow de pagos"
```

---

**Tiempo total de instalación:** ~5-10 minutos
**Herramientas disponibles:** 5 (list, create, get_executions, trigger, update)
