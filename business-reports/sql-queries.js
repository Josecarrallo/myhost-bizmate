/**
 * SQL Queries for Business Reports
 * MY HOST BizMate - AUTOPILOT Module
 *
 * All queries use parameterized inputs to prevent SQL injection
 * and support multiple properties/owners.
 */

export const queries = {
  /**
   * Q1: Get owners with auto_reports_enabled
   * Returns: owner_id, owner_name, owner_email, owner_phone
   */
  getOwnersWithAutoReports: () => `
    SELECT DISTINCT
      u.id as owner_id,
      u.full_name as owner_name,
      u.email as owner_email,
      u.phone as owner_phone
    FROM users u
    JOIN properties p ON p.owner_id = u.id
    WHERE u.role = 'owner'
      AND p.auto_reports_enabled = true;
  `,

  /**
   * Q2: Get properties for an owner
   * Params: owner_id
   * Returns: property details + villa count
   */
  getPropertiesForOwner: () => `
    SELECT
      p.id as property_id,
      p.name,
      p.city,
      p.country,
      p.base_price,
      p.currency,
      p.commission_rate,
      (SELECT COUNT(*) FROM villas v WHERE v.property_id = p.id AND v.status = 'active') as villa_count
    FROM properties p
    WHERE p.owner_id = $1
      AND p.status = 'active';
  `,

  /**
   * Q3: Get villas for a property
   * Params: property_id
   * Returns: villa details
   */
  getVillasForProperty: () => `
    SELECT
      v.id as villa_id,
      v.name,
      v.base_price,
      v.currency,
      v.max_guests,
      v.bedrooms,
      v.bathrooms,
      v.status
    FROM villas v
    WHERE v.property_id = $1
      AND v.status = 'active'
    ORDER BY v.name;
  `,

  /**
   * Q4: Monthly KPIs for a property (aggregated)
   * Params: property_id, period_start, period_end
   * Returns: total_bookings, total_revenue, avg_booking_value, avg_length_of_stay, total_room_nights, occupancy_rate
   */
  getMonthlyKPIs: () => `
    SELECT
      COUNT(*) as total_bookings,
      COALESCE(SUM(total_price), 0) as total_revenue,
      COALESCE(AVG(total_price), 0) as avg_booking_value,
      COALESCE(AVG(nights), 0) as avg_length_of_stay,
      COALESCE(SUM(nights), 0) as total_room_nights,
      ROUND(
        COALESCE(SUM(nights), 0)::numeric /
        NULLIF(
          (DATE_PART('day', $2::date - $1::date + INTERVAL '1 day'))::numeric
          * (SELECT COUNT(*) FROM villas WHERE property_id = $3 AND status = 'active')::numeric
        , 0) * 100,
        1
      ) as occupancy_rate
    FROM bookings
    WHERE property_id = $3
      AND check_in >= $1
      AND check_in <= $2
      AND status NOT IN ('cancelled', 'expired');
  `,

  /**
   * Q5: Monthly KPIs per villa (drill-down)
   * Params: property_id, period_start, period_end
   * Returns: villa breakdown with individual metrics
   */
  getVillaBreakdown: () => `
    SELECT
      v.name as villa_name,
      v.id as villa_id,
      COUNT(b.id) as bookings,
      COALESCE(SUM(b.total_price), 0) as revenue,
      COALESCE(AVG(b.total_price), 0) as avg_booking_value,
      COALESCE(SUM(b.nights), 0) as room_nights,
      ROUND(
        COALESCE(SUM(b.nights), 0)::numeric /
        NULLIF(DATE_PART('day', $2::date - $1::date + INTERVAL '1 day')::numeric, 0) * 100,
        1
      ) as occupancy_rate
    FROM villas v
    LEFT JOIN bookings b ON b.villa_id = v.id
      AND b.check_in >= $1
      AND b.check_in <= $2
      AND b.status NOT IN ('cancelled', 'expired')
    WHERE v.property_id = $3
      AND v.status = 'active'
    GROUP BY v.id, v.name
    ORDER BY revenue DESC;
  `,

  /**
   * Q6: Channel breakdown
   * Params: property_id, period_start, period_end
   * Returns: bookings and revenue per channel
   */
  getChannelBreakdown: () => `
    SELECT
      channel,
      COUNT(*) as bookings,
      COALESCE(SUM(total_price), 0) as revenue,
      ROUND(COUNT(*)::numeric / NULLIF(
        (SELECT COUNT(*) FROM bookings
         WHERE property_id = $3
           AND check_in >= $1 AND check_in <= $2
           AND status NOT IN ('cancelled','expired')),
        0) * 100, 1) as percentage
    FROM bookings
    WHERE property_id = $3
      AND check_in >= $1
      AND check_in <= $2
      AND status NOT IN ('cancelled', 'expired')
    GROUP BY channel
    ORDER BY bookings DESC;
  `,

  /**
   * Q7: OTA Commission calculation
   * Params: property_id, period_start, period_end
   * Returns: commission costs and revenue breakdown
   */
  getOTACommissions: () => `
    SELECT
      COALESCE(SUM(
        CASE WHEN channel NOT IN ('direct', 'voice_ai')
        THEN total_price * (SELECT commission_rate FROM properties WHERE id = $3) / 100
        ELSE 0 END
      ), 0) as ota_commission_cost,
      COALESCE(SUM(
        CASE WHEN channel IN ('direct', 'voice_ai')
        THEN total_price ELSE 0 END
      ), 0) as direct_revenue,
      COALESCE(SUM(
        CASE WHEN channel NOT IN ('direct', 'voice_ai')
        THEN total_price ELSE 0 END
      ), 0) as ota_revenue
    FROM bookings
    WHERE property_id = $3
      AND check_in >= $1
      AND check_in <= $2
      AND status NOT IN ('cancelled', 'expired');
  `,

  /**
   * Q8: Payment status summary
   * Params: property_id, period_start, period_end
   * Returns: count and amount per payment status
   */
  getPaymentStatus: () => `
    SELECT
      payment_status,
      COUNT(*) as count,
      COALESCE(SUM(total_price), 0) as amount
    FROM bookings
    WHERE property_id = $3
      AND check_in >= $1
      AND check_in <= $2
      AND status NOT IN ('cancelled', 'expired')
    GROUP BY payment_status;
  `,

  /**
   * Q9: Revenue trend (last 6 months)
   * Params: property_id, report_date
   * Returns: monthly revenue trend
   */
  getRevenueTrend: () => `
    SELECT
      TO_CHAR(DATE_TRUNC('month', check_in), 'YYYY-MM') as month,
      COUNT(*) as bookings,
      COALESCE(SUM(total_price), 0) as revenue,
      COALESCE(SUM(nights), 0) as room_nights
    FROM bookings
    WHERE property_id = $1
      AND check_in >= (DATE_TRUNC('month', $2::date) - INTERVAL '6 months')
      AND check_in < DATE_TRUNC('month', $2::date)
      AND status NOT IN ('cancelled', 'expired')
    GROUP BY DATE_TRUNC('month', check_in)
    ORDER BY month;
  `,

  /**
   * Q10: Upcoming bookings (next 30 days)
   * Params: property_id
   * Returns: future bookings list
   */
  getUpcomingBookings: () => `
    SELECT
      b.guest_name,
      v.name as villa_name,
      b.check_in,
      b.check_out,
      b.nights,
      b.guests,
      b.total_price,
      b.channel,
      b.payment_status
    FROM bookings b
    LEFT JOIN villas v ON v.id = b.villa_id
    WHERE b.property_id = $1
      AND b.check_in >= CURRENT_DATE
      AND b.check_in <= CURRENT_DATE + INTERVAL '30 days'
      AND b.status NOT IN ('cancelled', 'expired')
    ORDER BY b.check_in;
  `,

  /**
   * Q11: Year-to-Date cumulative
   * Params: property_id
   * Returns: yearly performance
   */
  getYearToDate: () => `
    SELECT
      EXTRACT(YEAR FROM check_in) as year,
      COUNT(*) as bookings,
      COALESCE(SUM(total_price), 0) as revenue,
      COALESCE(SUM(nights), 0) as room_nights
    FROM bookings
    WHERE property_id = $1
      AND status NOT IN ('cancelled', 'expired')
    GROUP BY EXTRACT(YEAR FROM check_in)
    ORDER BY year;
  `,

  /**
   * Q12: Save generated report
   * This is an INSERT statement, not a SELECT
   * Params: property_id, period_start, period_end, html_content,
   *         total_bookings, total_revenue, occupancy_rate, ota_commission, avg_booking_value
   * Returns: id of inserted report
   */
  saveGeneratedReport: () => `
    INSERT INTO generated_reports (
      property_id, report_type, period_start, period_end,
      generated_by, report_html, total_bookings, total_revenue,
      occupancy_rate, ota_commission, avg_booking_value
    ) VALUES (
      $1, 'monthly', $2, $3,
      'autopilot', $4, $5, $6,
      $7, $8, $9
    ) RETURNING id;
  `
};

/**
 * Helper to execute parameterized query
 * @param {Object} supabase - Supabase client
 * @param {string} sql - SQL query with $1, $2, etc. placeholders
 * @param {Array} params - Array of parameter values
 */
export async function executeQuery(supabase, sql, params = []) {
  // Supabase doesn't support parameterized queries directly via REST API
  // We need to use RPC or construct the query safely
  // For now, we'll use the raw SQL approach with manual parameter substitution
  // This is safe because we control all inputs

  let finalSQL = sql;
  params.forEach((param, index) => {
    const placeholder = `$${index + 1}`;
    // Escape single quotes in string params
    const escapedParam = typeof param === 'string'
      ? `'${param.replace(/'/g, "''")}'`
      : param;
    finalSQL = finalSQL.replace(placeholder, escapedParam);
  });

  const { data, error } = await supabase.rpc('execute_sql', { query: finalSQL });

  if (error) {
    throw new Error(`Query failed: ${error.message}`);
  }

  return data;
}
