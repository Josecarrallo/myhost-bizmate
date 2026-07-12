// Guest 360 - Design Tokens & Constants
// Basado en el tema oscuro de MY HOST BizMate

export const COLORS = {
  // Fondos
  background: '#272e39',
  card: '#333b47',
  inset: '#2c333e',
  chip: '#3a434f',
  chipHover: '#434d5a',

  // Acento (marca)
  accent: '#f5791f',
  accentAlt: '#ff6a00',
  accentLight: '#f2b04a',

  // Estados
  success: '#34c07f',
  successText: '#4cd08f',
  successButton: '#2ea36a',
  warning: '#e6b24d',
  warningBase: '#e0a83b',
  danger: '#f0806e',
  dangerBase: '#ef6b57',

  // Texto
  textPrimary: '#ffffff',
  textSecondary: '#aab2bf',
  textMuted: '#8a93a1',
  textVeryMuted: '#7c8593',
  textFaint: '#6d7683',

  // Bordes
  border: 'rgba(255,255,255,0.82)',
  borderLight: 'rgba(255,255,255,0.32)',
  borderFaint: 'rgba(255,255,255,0.16)',
  borderButton: 'rgba(255,255,255,0.5)',

  // Rating
  stars: '#f2b04a',
};

// Estados de booking - NO existe 'completed'
export const BOOKING_STATUS = {
  confirmed: { label: 'Confirmada', color: 'success', bgClass: 'bg-green-500/20', textClass: 'text-green-400' },
  checked_in: { label: 'En estancia', color: 'success', bgClass: 'bg-green-500/20', textClass: 'text-green-400' },
  pending_payment: { label: 'Pago pendiente', color: 'warning', bgClass: 'bg-yellow-500/20', textClass: 'text-yellow-400' },
  partial_payment: { label: 'Pago parcial', color: 'warning', bgClass: 'bg-yellow-500/20', textClass: 'text-yellow-400' },
  cancelled: { label: 'Cancelada', color: 'danger', bgClass: 'bg-red-500/20', textClass: 'text-red-400' },
};

// Estados de pago
export const PAYMENT_STATUS = {
  pending: { label: 'Pendiente', color: 'warning', bgClass: 'bg-yellow-500/20', textClass: 'text-yellow-400' },
  paid: { label: 'Pagado', color: 'success', bgClass: 'bg-green-500/20', textClass: 'text-green-400' },
  failed: { label: 'Fallido', color: 'danger', bgClass: 'bg-red-500/20', textClass: 'text-red-400' },
  refunded: { label: 'Reembolsado', color: 'info', bgClass: 'bg-blue-500/20', textClass: 'text-blue-400' },
};

// Estados de decisión OCS
export const DECISION_STATUS = {
  pending: { label: 'Pendiente', color: 'warning' },
  approved: { label: 'Aprobada', color: 'success' },
  rejected: { label: 'Rechazada', color: 'danger' },
};

// Prioridades de decisión
export const DECISION_PRIORITY = {
  urgent: { label: 'Urgente', bgClass: 'bg-red-500/20', textClass: 'text-red-400' },
  high: { label: 'Alta', bgClass: 'bg-red-500/20', textClass: 'text-red-400' },
  medium: { label: 'Media', bgClass: 'bg-yellow-500/20', textClass: 'text-yellow-400' },
  low: { label: 'Baja', bgClass: 'bg-blue-500/20', textClass: 'text-blue-400' },
};

// Journey steps
export const JOURNEY_STEPS = [
  { id: 'confirmed', label: 'Confirmed', event: 'booking_confirmed' },
  { id: 'pre_arrival_7d', label: 'Pre-arrival 7d', event: 'pre_arrival_7d_sent' },
  { id: 'pre_arrival_48h', label: 'Pre-arrival 48h', event: 'pre_arrival_48h_sent' },
  { id: 'checkin', label: 'Check-in', event: 'checkin_sent' },
  { id: 'in_stay', label: 'In Stay', event: 'in_stay_active' },
  { id: 'checkout', label: 'Check-out', event: 'checkout_sent' },
  { id: 'post_stay', label: 'Post-stay', event: 'post_stay_sent' },
];

// Guest 360 Tabs
export const GUEST_TABS = [
  { id: 'bookings', label: 'Bookings' },
  { id: 'payments', label: 'Payments' },
  { id: 'services', label: 'Services' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'reviews', label: 'Reviews' },
];

// Helper: calcular si booking es pasada (NO usar status='completed')
export const isPastBooking = (booking) => {
  if (!booking?.check_out) return false;
  return new Date(booking.check_out) < new Date() && booking.status !== 'cancelled';
};

// Helper: obtener sufijo de 9 dígitos del teléfono
export const getPhoneSuffix = (phone) => {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  return digits.slice(-9);
};

// Helper: formatear moneda (USD vs IDR)
export const formatCurrency = (amount, currency = 'USD') => {
  if (!amount || isNaN(amount)) return currency === 'IDR' ? 'IDR 0' : '$0';

  if (currency === 'IDR') {
    return `IDR ${Math.round(amount).toLocaleString('id-ID')}`;
  }

  return `$${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Helper: format date
export const formatDate = (date, options = {}) => {
  if (!date) return '—';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: options.includeYear ? 'numeric' : undefined,
    ...options,
  });
};

// Helper: format time
export const formatTime = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

// Helper: calcular días de estancia
export const calculateStayDays = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return { current: 0, total: 0 };
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const today = new Date();

  const total = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const current = Math.max(0, Math.ceil((today - start) / (1000 * 60 * 60 * 24)));

  return { current: Math.min(current, total), total };
};

// Helper: calcular progreso de estancia con datos completos
export const calculateStayProgress = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) {
    return { progress: 0, daysIn: 0, daysLeft: 0, totalNights: 0, phase: 'before' };
  }

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const now = new Date();

  // Set times to midnight for accurate day calculations
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const totalNights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const daysIn = Math.ceil((today - start) / (1000 * 60 * 60 * 24));
  const daysLeft = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

  // Determine phase
  let phase = 'during';
  if (today < start) {
    phase = 'before';
  } else if (today >= end) {
    phase = 'after';
  }

  // Calculate progress (0-100)
  let progress = 0;
  if (phase === 'after') {
    progress = 100;
  } else if (phase === 'during' && totalNights > 0) {
    progress = Math.min(100, Math.max(0, Math.round((daysIn / totalNights) * 100)));
  }

  return {
    progress,
    daysIn: Math.max(0, daysIn),
    daysLeft: Math.max(0, daysLeft),
    totalNights,
    phase,
  };
};

// Breakpoints para responsive
export const BREAKPOINTS = {
  mobile: 360,
  mobileLg: 390,
  tablet: 768,
  desktop: 1024,
  wide: 1200,
};
