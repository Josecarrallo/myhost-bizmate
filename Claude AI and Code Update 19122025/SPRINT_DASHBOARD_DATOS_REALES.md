# Sprint 1.5: Dashboard con Datos Reales 📊

**Prioridad:** 🔥 **MÁXIMA - LO MÁS IMPORTANTE DE LA APP**
**Fecha:** 21 Diciembre 2025
**Objetivo:** Transformar Owner Executive Summary de demo a datos reales de Supabase

---

## ¿Por Qué es lo Más Importante?

Como dijo el usuario: **"esto es lo mas importante de la app"**

**Razones:**
1. ✅ Properties y Bookings ya están creando datos reales en Supabase
2. ✅ Necesitas ver métricas reales para tomar decisiones de negocio
3. ✅ Es la primera pantalla que ves al entrar (post-login)
4. ✅ Sin datos reales, no puedes validar si la app funciona
5. ✅ Los inversores/clientes necesitan ver métricas reales

---

## Estado Actual vs Objetivo

### 🔴 Estado Actual (Demo Data)

```javascript
// src/components/Dashboard/OwnerExecutiveSummary.jsx
const stats = {
  totalRevenue: 125000,           // ❌ Hardcoded
  occupancyRate: 87,              // ❌ Hardcoded
  activeBookings: 24,             // ❌ Hardcoded
  avgNightlyRate: 185             // ❌ Hardcoded
};

const checkIns = [                 // ❌ Hardcoded
  { id: 1, name: 'John Smith', property: 'Villa Serenity' },
  // ...
];
```

### 🟢 Objetivo (Real Data)

```javascript
// Datos desde Supabase en tiempo real
const stats = await getDashboardStats(); // ✅ Función SQL
const checkIns = await getTodayCheckIns(); // ✅ Query real
const alerts = await getActiveAlerts();   // ✅ Dinámico
```

---

## Arquitectura del Dashboard

### 1. Capa de Base de Datos (Supabase)

**Crear Funciones SQL para KPIs:**

```sql
-- Función: get_dashboard_stats
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE (
  total_revenue DECIMAL,
  occupancy_rate INTEGER,
  active_bookings INTEGER,
  avg_nightly_rate DECIMAL,
  total_properties INTEGER,
  confirmed_bookings INTEGER,
  pending_bookings INTEGER,
  guests_this_month INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    -- Revenue total (bookings confirmados y pagados)
    COALESCE(SUM(CASE WHEN b.status = 'confirmed' AND b.payment_status = 'paid'
                      THEN b.total_price ELSE 0 END), 0)::DECIMAL as total_revenue,

    -- Tasa de ocupación (% de noches ocupadas)
    COALESCE(
      (COUNT(DISTINCT CASE WHEN b.status = 'confirmed' THEN b.id END)::FLOAT /
       NULLIF(COUNT(DISTINCT p.id), 0) * 100)::INTEGER,
    0) as occupancy_rate,

    -- Bookings activos (confirmed + check-in hoy o futuro)
    COUNT(DISTINCT CASE
      WHEN b.status = 'confirmed' AND b.check_out >= CURRENT_DATE
      THEN b.id END)::INTEGER as active_bookings,

    -- Precio promedio por noche
    COALESCE(AVG(b.total_price / NULLIF(b.nights, 0)), 0)::DECIMAL as avg_nightly_rate,

    -- Total propiedades activas
    COUNT(DISTINCT p.id)::INTEGER as total_properties,

    -- Bookings confirmados
    COUNT(DISTINCT CASE WHEN b.status = 'confirmed' THEN b.id END)::INTEGER as confirmed_bookings,

    -- Bookings pendientes
    COUNT(DISTINCT CASE WHEN b.status = 'pending' THEN b.id END)::INTEGER as pending_bookings,

    -- Huéspedes este mes
    COUNT(DISTINCT CASE
      WHEN b.check_in >= date_trunc('month', CURRENT_DATE)
      THEN b.guest_email END)::INTEGER as guests_this_month
  FROM properties p
  LEFT JOIN bookings b ON p.id = b.property_id;
END;
$$ LANGUAGE plpgsql;
```

```sql
-- Función: get_today_checkins
CREATE OR REPLACE FUNCTION get_today_checkins()
RETURNS TABLE (
  booking_id UUID,
  guest_name TEXT,
  guest_email TEXT,
  guest_phone TEXT,
  property_name TEXT,
  check_in DATE,
  check_out DATE,
  nights INTEGER,
  guests INTEGER,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id as booking_id,
    b.guest_name,
    b.guest_email,
    b.guest_phone,
    p.name as property_name,
    b.check_in,
    b.check_out,
    b.nights,
    b.guests,
    b.status
  FROM bookings b
  JOIN properties p ON b.property_id = p.id
  WHERE b.check_in = CURRENT_DATE
  AND b.status = 'confirmed'
  ORDER BY b.check_in ASC;
END;
$$ LANGUAGE plpgsql;
```

```sql
-- Función: get_today_checkouts
CREATE OR REPLACE FUNCTION get_today_checkouts()
RETURNS TABLE (
  booking_id UUID,
  guest_name TEXT,
  property_name TEXT,
  check_out DATE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id as booking_id,
    b.guest_name,
    p.name as property_name,
    b.check_out
  FROM bookings b
  JOIN properties p ON b.property_id = p.id
  WHERE b.check_out = CURRENT_DATE
  AND b.status = 'confirmed'
  ORDER BY b.check_out ASC;
END;
$$ LANGUAGE plpgsql;
```

```sql
-- Función: get_active_alerts
CREATE OR REPLACE FUNCTION get_active_alerts()
RETURNS TABLE (
  alert_type TEXT,
  message TEXT,
  severity TEXT,
  created_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  -- Bookings pendientes de pago
  SELECT
    'payment_pending'::TEXT as alert_type,
    'Tienes ' || COUNT(*)::TEXT || ' reservas pendientes de pago' as message,
    'warning'::TEXT as severity,
    NOW() as created_at
  FROM bookings
  WHERE payment_status = 'pending'
  AND status = 'confirmed'
  HAVING COUNT(*) > 0

  UNION ALL

  -- Check-ins hoy sin confirmar
  SELECT
    'checkin_today'::TEXT,
    COUNT(*)::TEXT || ' check-ins programados para hoy',
    'info'::TEXT,
    NOW()
  FROM bookings
  WHERE check_in = CURRENT_DATE
  AND status = 'confirmed'
  HAVING COUNT(*) > 0

  UNION ALL

  -- Propiedades sin reservas próximas
  SELECT
    'low_occupancy'::TEXT,
    'Hay ' || COUNT(*)::TEXT || ' propiedades sin reservas en los próximos 7 días',
    'warning'::TEXT,
    NOW()
  FROM properties p
  WHERE NOT EXISTS (
    SELECT 1 FROM bookings b
    WHERE b.property_id = p.id
    AND b.check_in BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
    AND b.status = 'confirmed'
  )
  AND p.status = 'active'
  HAVING COUNT(*) > 0;
END;
$$ LANGUAGE plpgsql;
```

---

### 2. Capa de Servicio (Frontend)

**Actualizar `src/services/data.js`:**

```javascript
export const dataService = {
  // ... métodos existentes ...

  // Dashboard Stats
  async getDashboardStats() {
    const { data, error } = await supabase
      .rpc('get_dashboard_stats');

    if (error) {
      console.error('Error fetching dashboard stats:', error);
      return null;
    }

    return data[0]; // Retorna el primer registro
  },

  // Today's Check-ins
  async getTodayCheckIns() {
    const { data, error } = await supabase
      .rpc('get_today_checkins');

    if (error) {
      console.error('Error fetching check-ins:', error);
      return [];
    }

    return data;
  },

  // Today's Check-outs
  async getTodayCheckOuts() {
    const { data, error } = await supabase
      .rpc('get_today_checkouts');

    if (error) {
      console.error('Error fetching check-outs:', error);
      return [];
    }

    return data;
  },

  // Active Alerts
  async getActiveAlerts() {
    const { data, error } = await supabase
      .rpc('get_active_alerts');

    if (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }

    return data;
  },

  // Revenue Chart (últimos 30 días)
  async getRevenueChart() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabase
      .from('bookings')
      .select('created_at, total_price, status')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .eq('status', 'confirmed')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching revenue chart:', error);
      return [];
    }

    // Agrupar por día
    const grouped = data.reduce((acc, booking) => {
      const date = booking.created_at.split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, revenue: 0 };
      }
      acc[date].revenue += booking.total_price;
      return acc;
    }, {});

    return Object.values(grouped);
  },

  // Occupancy Chart (próximos 30 días)
  async getOccupancyChart() {
    const { data: properties, error: propsError } = await supabase
      .from('properties')
      .select('id')
      .eq('status', 'active');

    if (propsError) return [];

    const totalProperties = properties.length;

    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);

    const { data, error } = await supabase
      .from('bookings')
      .select('check_in, check_out')
      .gte('check_in', today.toISOString().split('T')[0])
      .lte('check_in', next30Days.toISOString().split('T')[0])
      .eq('status', 'confirmed');

    if (error) return [];

    // Calcular ocupación por día
    const occupancyByDay = {};
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      const occupied = data.filter(b =>
        b.check_in <= dateStr && b.check_out > dateStr
      ).length;

      occupancyByDay[dateStr] = {
        date: dateStr,
        occupancy: Math.round((occupied / totalProperties) * 100)
      };
    }

    return Object.values(occupancyByDay);
  }
};
```

---

### 3. Capa de UI (Component)

**Actualizar `src/components/Dashboard/OwnerExecutiveSummary.jsx`:**

```javascript
import React, { useState, useEffect } from 'react';
import { TrendingUp, Home, Calendar, DollarSign, AlertCircle, Users } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dataService } from '../../services/data';

const OwnerExecutiveSummary = ({ userName }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [checkIns, setCheckIns] = useState([]);
  const [checkOuts, setCheckOuts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [occupancyData, setOccupancyData] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [
        statsData,
        checkInsData,
        checkOutsData,
        alertsData,
        revenueChart,
        occupancyChart
      ] = await Promise.all([
        dataService.getDashboardStats(),
        dataService.getTodayCheckIns(),
        dataService.getTodayCheckOuts(),
        dataService.getActiveAlerts(),
        dataService.getRevenueChart(),
        dataService.getOccupancyChart()
      ]);

      setStats(statsData);
      setCheckIns(checkInsData);
      setCheckOuts(checkOutsData);
      setAlerts(alertsData);
      setRevenueData(revenueChart);
      setOccupancyData(occupancyChart);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center">
        <div className="text-white text-2xl">Cargando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-6 overflow-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          ¡Bienvenido, {userName || 'Owner'}! ☀️
        </h1>
        <p className="text-white/80 text-lg">
          Resumen ejecutivo de tus propiedades - {new Date().toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<DollarSign className="w-8 h-8" />}
          title="Ingresos Totales"
          value={`$${stats?.total_revenue?.toLocaleString() || 0}`}
          change="+12.5%"
          bgColor="bg-green-500"
        />
        <StatCard
          icon={<TrendingUp className="w-8 h-8" />}
          title="Tasa de Ocupación"
          value={`${stats?.occupancy_rate || 0}%`}
          change="+5.2%"
          bgColor="bg-blue-500"
        />
        <StatCard
          icon={<Calendar className="w-8 h-8" />}
          title="Reservas Activas"
          value={stats?.active_bookings || 0}
          change="+3"
          bgColor="bg-purple-500"
        />
        <StatCard
          icon={<Home className="w-8 h-8" />}
          title="Precio Promedio/Noche"
          value={`$${stats?.avg_nightly_rate?.toFixed(0) || 0}`}
          change="+8.3%"
          bgColor="bg-orange-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">Ingresos (últimos 30 días)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="date"
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'white' }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'white' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white'
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Occupancy Chart */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">Ocupación (próximos 30 días)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="date"
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'white' }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'white' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white'
                }}
              />
              <Line
                type="monotone"
                dataKey="occupancy"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Check-ins/Check-outs + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Today's Activity */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Actividad de Hoy
          </h2>

          <div className="mb-4">
            <h3 className="text-white font-semibold mb-2">✅ Check-ins ({checkIns.length})</h3>
            {checkIns.length > 0 ? (
              <div className="space-y-2">
                {checkIns.map(checkin => (
                  <div key={checkin.booking_id} className="bg-white/10 rounded-xl p-3">
                    <p className="text-white font-medium">{checkin.guest_name}</p>
                    <p className="text-white/70 text-sm">{checkin.property_name}</p>
                    <p className="text-white/50 text-xs">
                      {checkin.guests} huéspedes • {checkin.nights} noches
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/60 text-sm">No hay check-ins hoy</p>
            )}
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">🚪 Check-outs ({checkOuts.length})</h3>
            {checkOuts.length > 0 ? (
              <div className="space-y-2">
                {checkOuts.map(checkout => (
                  <div key={checkout.booking_id} className="bg-white/10 rounded-xl p-3">
                    <p className="text-white font-medium">{checkout.guest_name}</p>
                    <p className="text-white/70 text-sm">{checkout.property_name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/60 text-sm">No hay check-outs hoy</p>
            )}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            Alertas y Notificaciones
          </h2>
          {alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`rounded-xl p-4 ${
                    alert.severity === 'warning'
                      ? 'bg-yellow-500/20 border border-yellow-500/30'
                      : 'bg-blue-500/20 border border-blue-500/30'
                  }`}
                >
                  <p className="text-white font-medium">{alert.message}</p>
                  <p className="text-white/60 text-xs mt-1">
                    {new Date(alert.created_at).toLocaleTimeString('es-ES')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/60">✨ Todo está bajo control</p>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickStat label="Propiedades" value={stats?.total_properties || 0} icon={<Home />} />
        <QuickStat label="Confirmadas" value={stats?.confirmed_bookings || 0} icon={<Calendar />} />
        <QuickStat label="Pendientes" value={stats?.pending_bookings || 0} icon={<AlertCircle />} />
        <QuickStat label="Huéspedes (mes)" value={stats?.guests_this_month || 0} icon={<Users />} />
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, change, bgColor }) => (
  <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
    <div className={`${bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-white`}>
      {icon}
    </div>
    <p className="text-white/80 text-sm mb-1">{title}</p>
    <p className="text-white text-3xl font-bold mb-2">{value}</p>
    <span className="text-green-300 text-sm font-medium">{change} este mes</span>
  </div>
);

const QuickStat = ({ label, value, icon }) => (
  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-center">
    <div className="text-white/70 mb-2">{icon}</div>
    <p className="text-white text-2xl font-bold">{value}</p>
    <p className="text-white/60 text-sm">{label}</p>
  </div>
);

export default OwnerExecutiveSummary;
```

---

## Plan de Implementación

### ✅ Paso 1: Crear Funciones SQL (10 min)
1. Abrir Supabase SQL Editor
2. Ejecutar los 4 CREATE FUNCTION
3. Probar cada función con `SELECT * FROM get_dashboard_stats();`

### ✅ Paso 2: Actualizar data.js (10 min)
1. Agregar los 6 métodos nuevos
2. Probar cada uno desde consola del navegador

### ✅ Paso 3: Actualizar OwnerExecutiveSummary (30 min)
1. Reemplazar datos demo con hooks useEffect
2. Agregar estados de loading
3. Agregar gráficos con Recharts
4. Probar en localhost

### ✅ Paso 4: Testing (15 min)
1. Crear 2-3 properties de prueba
2. Crear 5-10 bookings de prueba (diferentes fechas)
3. Verificar que KPIs se calculan correctamente
4. Verificar que gráficos muestran datos reales

---

## Resultado Final

**Dashboard completamente funcional con:**
- ✅ KPIs calculados desde Supabase en tiempo real
- ✅ Gráficos de ingresos (últimos 30 días)
- ✅ Gráficos de ocupación (próximos 30 días)
- ✅ Check-ins y check-outs de hoy
- ✅ Alertas dinámicas basadas en datos reales
- ✅ Quick stats (propiedades, bookings, huéspedes)

---

## Tiempo Total Estimado

⏱️ **1-2 horas** para implementación completa

---

## Próximos Pasos Después del Dashboard

1. Arreglar flujo de Properties (SMTP → SendGrid)
2. Integrar VAPI Voice Assistant
3. Configurar Channel Manager

Pero primero: **Dashboard con datos reales** 🎯
