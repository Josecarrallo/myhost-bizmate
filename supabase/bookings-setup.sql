-- Agregar columnas faltantes
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS reservation_id text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS room_id text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS adults integer DEFAULT 1;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS children integer DEFAULT 0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS currency_code text DEFAULT 'USD';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS source text DEFAULT 'domus';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS channel_id integer;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS raw_data jsonb;


-- Crear índices si no existen
CREATE INDEX IF NOT EXISTS idx_bookings_reservation_id ON public.bookings(reservation_id);
CREATE INDEX IF NOT EXISTS idx_bookings_check_in ON public.bookings(check_in);
CREATE INDEX IF NOT EXISTS idx_bookings_check_out ON public.bookings(check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_source ON public.bookings(source);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at);
