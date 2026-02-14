-- =====================================================
-- ADD MISSING FIELDS TO GUESTS TABLE FOR SEGMENTATION
-- =====================================================

-- Add last_booking_date column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='guests' AND column_name='last_booking_date')
  THEN
    ALTER TABLE public.guests ADD COLUMN last_booking_date TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Verify columns exist
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'guests'
  AND column_name IN ('total_bookings', 'total_spent', 'avg_rating', 'last_booking_date')
ORDER BY column_name;
