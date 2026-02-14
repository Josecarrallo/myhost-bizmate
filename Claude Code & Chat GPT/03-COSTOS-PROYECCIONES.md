# MY HOST BizMate - Costos y Proyecciones Financieras
## Modelo de negocio escalable

---

## 1. ARQUITECTURA DE COSTOS

### Modelo centralizado (1 cuenta para N clientes)

```
┌─────────────────────────────────────────────────────────┐
│                    TU CUENTA CHAKRAHQ                    │
│                     (1 instancia)                        │
├─────────────────────────────────────────────────────────┤
│  Plan Advanced: $49/mes                                  │
│  ├── 12 números incluidos                               │
│  ├── Números extra: ~$3-5/mes cada uno                  │
│  ├── Inbox compartido con labels                        │
│  └── API access ilimitado                               │
├─────────────────────────────────────────────────────────┤
│  Cliente001 ─── Label: "Izumi Hotel"                    │
│  Cliente002 ─── Label: "Villa Sunset"                   │
│  Cliente003 ─── Label: "Bali Dreams"                    │
│  ...                                                     │
│  Cliente100 ─── Label: "Paradise Inn"                   │
└─────────────────────────────────────────────────────────┘
```

---

## 2. DESGLOSE DE COSTOS FIJOS

### Por cliente (marginal)

| Concepto | Costo/mes | Notas |
|----------|-----------|-------|
| Número WhatsApp extra | $3-5 USD | Después de los 12 incluidos |
| Meta (plantillas) | ~$15 USD | ~500 mensajes × $0.03 |
| **Total por cliente** | **~$18-20 USD** | |

### Infraestructura compartida

| Concepto | Costo/mes | Notas |
|----------|-----------|-------|
| ChakraHQ Advanced | $49 USD | Base, incluye 12 números |
| Railway (n8n) | $20 USD | Pro plan |
| Supabase | $25 USD | Pro plan |
| OpenAI API | $50-100 USD | ~100 clientes |
| Dominio + extras | $10 USD | |
| **Total infraestructura** | **~$154-204 USD** | |

---

## 3. PROYECCIONES POR ESCALA

### 10 Clientes

| Concepto | Valor |
|----------|-------|
| Ingresos | $500/mes (10 × $50) |
| ChakraHQ | $49 (números incluidos) |
| Infra compartida | $105 |
| Meta plantillas | $150 |
| **Costos totales** | **$304** |
| **Beneficio neto** | **$196/mes (39%)** |

### 50 Clientes

| Concepto | Valor |
|----------|-------|
| Ingresos | $2,500/mes |
| ChakraHQ | $49 + (38 × $4) = $201 |
| Infra compartida | $154 |
| Meta plantillas | $750 |
| **Costos totales** | **$1,105** |
| **Beneficio neto** | **$1,395/mes (56%)** |

### 100 Clientes

| Concepto | Valor |
|----------|-------|
| Ingresos | $5,000/mes |
| ChakraHQ | $49 + (88 × $4) = $401 |
| Infra compartida | $204 |
| Meta plantillas | $1,500 |
| **Costos totales** | **$2,105** |
| **Beneficio neto** | **$2,895/mes (58%)** |

### 200 Clientes

| Concepto | Valor |
|----------|-------|
| Ingresos | $10,000/mes |
| ChakraHQ | ~$800 (múltiples cuentas) |
| Infra compartida | $400 |
| Meta plantillas | $3,000 |
| **Costos totales** | **$4,200** |
| **Beneficio neto** | **$5,800/mes (58%)** |

---

## 4. COMPARATIVA: CON vs SIN CHAKRAHQ

### Sin ChakraHQ (Meta API directo)

| Concepto | Impacto |
|----------|---------|
| Desarrollo inicial | 2-4 semanas, ~80 horas |
| Mantenimiento mensual | 10+ horas |
| Gestión de tokens | Manual (expiran) |
| Rate limits | Implementar manualmente |
| Inbox visual | No existe |
| Staff puede intervenir | No |
| Costo desarrollo | ~$4,000-8,000 (único) |

### Con ChakraHQ

| Concepto | Impacto |
|----------|---------|
| Desarrollo inicial | 0 (conexión 1-click) |
| Mantenimiento mensual | 0 horas |
| Gestión de tokens | Automático |
| Rate limits | Gestionado |
| Inbox visual | ✅ Incluido |
| Staff puede intervenir | ✅ Sí |
| Costo mensual | $12.49-49/mes |

**Conclusión:** ChakraHQ ahorra ~$5,000 en desarrollo + 10 horas/mes de mantenimiento.

---

## 5. PRICING PARA CLIENTES

### Modelo recomendado

| Plan | Precio/mes | Incluye |
|------|------------|---------|
| **Starter** | $50 USD | 1 propiedad, 500 mensajes |
| **Growth** | $99 USD | 3 propiedades, 2000 mensajes |
| **Pro** | $199 USD | Ilimitado, soporte prioritario |

### Justificación del precio ($50/mes)

**Valor para el cliente:**
- Ahorro de 4+ horas/día en atención WhatsApp
- Atención 24/7 (no pierden consultas nocturnas)
- Aumento reservas directas (sin comisión OTAs)
- Profesionalización de la comunicación

**Cálculo ROI cliente:**
- 1 reserva directa extra/mes = $100-500
- Ahorro en personal = $200-400/mes
- **ROI: 6x-18x** sobre los $50/mes

---

## 6. MÉTRICAS CLAVE (KPIs)

### Dashboard SQL

```sql
-- Ingresos mensuales por cliente
SELECT 
  t.name as cliente,
  COUNT(b.id) as reservas,
  SUM(b.total_price) as ingresos_generados,
  COUNT(c.id) as conversaciones
FROM tenants t
LEFT JOIN bookings b ON b.tenant_id = t.id
LEFT JOIN conversations c ON c.tenant_id = t.id
WHERE b.created_at >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY t.id, t.name
ORDER BY ingresos_generados DESC;
```

### KPIs a monitorear

| Métrica | Objetivo |
|---------|----------|
| Tasa de conversión (consulta → reserva) | >15% |
| Tiempo respuesta promedio | <30 segundos |
| Satisfacción cliente (CSAT) | >4.5/5 |
| Churn mensual | <5% |
| LTV (Lifetime Value) | >$600 (12 meses) |

---

## 7. BREAK-EVEN ANALYSIS

### Costos fijos mensuales: ~$200

| Clientes | Ingresos | Costos | Beneficio | Break-even |
|----------|----------|--------|-----------|------------|
| 5 | $250 | $290 | -$40 | ❌ |
| 7 | $350 | $326 | +$24 | ✅ |
| 10 | $500 | $380 | +$120 | ✅ |

**Break-even: 7 clientes** a $50/mes cada uno.

---

## 8. PROYECCIÓN ANUAL (Año 1)

| Mes | Clientes | MRR | Costos | Beneficio |
|-----|----------|-----|--------|-----------|
| 1 | 5 | $250 | $290 | -$40 |
| 2 | 10 | $500 | $380 | $120 |
| 3 | 18 | $900 | $524 | $376 |
| 4 | 28 | $1,400 | $704 | $696 |
| 5 | 40 | $2,000 | $920 | $1,080 |
| 6 | 55 | $2,750 | $1,190 | $1,560 |
| 7 | 70 | $3,500 | $1,460 | $2,040 |
| 8 | 85 | $4,250 | $1,730 | $2,520 |
| 9 | 100 | $5,000 | $2,000 | $3,000 |
| 10 | 115 | $5,750 | $2,270 | $3,480 |
| 11 | 130 | $6,500 | $2,540 | $3,960 |
| 12 | 150 | $7,500 | $2,900 | $4,600 |

**Total Año 1:**
- MRR final: $7,500
- ARR: $90,000
- Beneficio acumulado: ~$24,000

---

**Última actualización:** 13 Diciembre 2025
