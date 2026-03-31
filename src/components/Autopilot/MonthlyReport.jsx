import React from 'react';
import {
  CheckCircle,
  TrendingUp,
  ClipboardList,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

/**
 * MonthlyReport Component
 * Displays monthly summary data from owner_monthly_summaries table
 *
 * IMPORTANT: This component reads pre-aggregated data from n8n.
 * Do NOT calculate KPIs, channels, or occupancy - read directly from JSON fields.
 *
 * @param {string} propertyId - Property ID to filter
 * @param {string} propertyName - Property name for title
 * @param {string} tenantId - Tenant ID for data fetching
 * @param {object} monthlySummary - Monthly summary data object
 * @param {boolean} loading - Loading state
 */
const MonthlyReport = ({
  propertyId,
  propertyName,
  tenantId,
  monthlySummary,
  loading
}) => {
  console.log('🔍 MonthlyReport props:', { propertyId, propertyName, tenantId, monthlySummary, loading });

  // Helper function to format IDR currency
  const formatIDR = (n) => {
    if (!n || isNaN(n)) return 'Rp 0';
    return 'Rp ' + Math.round(n).toLocaleString('id-ID');
  };

  if (loading) {
    return (
      <div className="text-center py-8 bg-[#2a2f3a] rounded-lg border-2 border-gray-700">
        <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-300 text-lg">Loading monthly summary...</p>
      </div>
    );
  }

  if (!monthlySummary) {
    return (
      <div className="text-center py-8 bg-[#2a2f3a] rounded-lg border-2 border-gray-700">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <p className="text-gray-300 text-lg">No monthly summary available</p>
        <p className="text-gray-500 text-sm mt-1">Monthly summary will appear here once generated</p>
      </div>
    );
  }

  // Extract data from monthly summary
  const summary = monthlySummary;
  const bookingsList = summary.bookings_list || [];

  // BUG C FIX: Villa ID to name mapping
  const villaIdToName = {
    'b1000001': 'Nismara 1BR Villa',
    'b2000002': 'Graha Uma 1 Bedroom Pool Villa',
    'b3000003': 'NISMARA 2 BEDROOM POOL VILLA'
  };

  // Convert revenue_by_villa from object to array (same as Weekly)
  const revenueByVillaObj = summary.revenue_by_villa || {};
  const revenueByVilla = Array.isArray(revenueByVillaObj)
    ? revenueByVillaObj
    : Object.entries(revenueByVillaObj).map(([villa_name, revenue]) => ({
        villa_name,
        revenue
      }));

  const decisionsList = summary.decisions_list || [];
  const strategicRecs = summary.strategic_recommendations_json || [];

  // auto_resolved_summary is an object with {count, items, by_type}
  const autoResolvedObj = summary.auto_resolved_summary || {};
  const autoResolved = autoResolvedObj.items || [];

  // pending_approval can be either array or object {count, items}
  const pendingApprovalData = summary.pending_approval || [];
  const pendingApproval = Array.isArray(pendingApprovalData)
    ? pendingApprovalData
    : (pendingApprovalData.items || []);

  // DEBUG: Log pending_approval structure
  if (pendingApproval.length > 0) {
    console.log('🔍 PENDING APPROVAL DATA:', pendingApproval[0]);
  }

  // CAMBIO 4: Read from occupancy_summary (pre-aggregated)
  const occupancySummary = summary.occupancy_summary || {};

  // CAMBIO 5: Read from booking_trends_json (pre-aggregated)
  const bookingTrends = summary.booking_trends_json || {};
  const channelsObj = bookingTrends.channels || {};
  // Convert channels object to array: {"airbnb": 2, "direct": 1} → [{channel: "airbnb", bookings: 2}, ...]
  const channels = Object.entries(channelsObj).map(([channel, bookings]) => ({
    channel,
    bookings
  }));

  // CAMBIO 3: Parse month_key for dynamic title (e.g., "2026-03")
  const monthKey = summary.month_key || '';
  const [year, month] = monthKey.split('-');
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthName = month ? monthNames[parseInt(month) - 1] : '';
  const monthDisplay = monthName && year ? `${monthName} ${year}` : monthKey;

  // CAMBIO 6: Read occupancy data from occupancy_summary (NOT calculated)
  const villaCount = occupancySummary.villa_count || revenueByVilla.length || 0;
  const daysInMonth = occupancySummary.days_in_month || 31;

  return (
    <div className="bg-[#2a2f3a] rounded-lg p-6 border-2 border-[#FF8C42]/50 space-y-6">
      {/* CAMBIO 3: Header with dynamic title */}
      <div className="border-b border-gray-700 pb-4">
        <h3 className="text-xl font-bold text-[#FF8C42]">
          MONTHLY — {monthDisplay}
        </h3>
        <h3 className="text-xl font-bold text-[#FF8C42]">
          {propertyName || 'Property'} · {villaCount} villas · {daysInMonth} días
        </h3>
      </div>

      {/* KPIs - Same 4 as Daily/Weekly v4.3 but with CAMBIO 4 data sources */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI 1: Occupancy rate - CAMBIO 4: Read from occupancy_summary */}
        {(() => {
          // BUG A FIX: Read from occupancy_summary.occupancy_rate (not average_occupancy_pct)
          const occupancyNum = occupancySummary.occupancy_rate || 0;
          const colorClass = occupancyNum >= 70 ? 'text-green-400' :
                            occupancyNum >= 40 ? 'text-orange-400' : 'text-red-400';
          const borderClass = occupancyNum >= 70 ? 'border-green-500/30' :
                             occupancyNum >= 40 ? 'border-orange-500/30' : 'border-red-500/30';
          return (
            <div className={`bg-[#1f2937] p-4 rounded-lg border ${borderClass} text-center`}>
              <p className="text-gray-400 text-sm mb-1">Occupancy rate</p>
              <p className={`text-xl md:text-3xl font-bold ${colorClass}`}>
                {occupancyNum.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {occupancySummary.total_nights_occupied || 0} of {occupancySummary.total_nights_possible || 0} nights
              </p>
            </div>
          );
        })()}

        {/* KPI 2: Total bookings - BUG B FIX: Use bookingsList.length */}
        <div className="bg-[#1f2937] p-4 rounded-lg border border-blue-500/30 text-center">
          <p className="text-gray-400 text-sm mb-1">Total bookings</p>
          <p className="text-xl md:text-3xl font-bold text-blue-400">
            {bookingsList.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">this month</p>
        </div>

        {/* KPI 3: Confirmed revenue */}
        <div className="bg-[#1f2937] p-4 rounded-lg border border-purple-500/30 text-center">
          <p className="text-gray-400 text-sm mb-1">Confirmed revenue</p>
          <p className="text-sm md:text-xl font-bold text-purple-400 whitespace-nowrap">
            {formatIDR(summary.revenue_total_idr || summary.revenue_total || 0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">total mensual</p>
        </div>

        {/* KPI 4: Gap nights - CAMBIO 4: Read from occupancy_summary (NOT calculated) */}
        {(() => {
          const gapNights = occupancySummary.gap_nights || 0;
          const gapColorClass = gapNights === 0 ? 'text-green-400' :
                               gapNights <= 10 ? 'text-orange-400' : 'text-red-400';
          const gapBorderClass = gapNights === 0 ? 'border-green-500/30' :
                                gapNights <= 10 ? 'border-orange-500/30' : 'border-red-500/30';
          return (
            <div className={`bg-[#1f2937] p-4 rounded-lg border ${gapBorderClass} text-center`}>
              <p className="text-gray-400 text-sm mb-1">Gap nights</p>
              <p className={`text-3xl font-bold ${gapColorClass}`}>
                {gapNights}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {summary.gap_label || ''}
              </p>
            </div>
          );
        })()}
      </div>

      {/* Bookings table - ALWAYS SHOW (without Fecha column like Weekly) */}
      <div className="bg-[#1f2937] p-5 rounded-lg border border-blue-500/30">
        <h4 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
          <ClipboardList className="w-5 h-5" />
          Bookings — {monthDisplay} ({bookingsList.length})
        </h4>
        {bookingsList && bookingsList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-xs md:text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="pb-2 pr-2 md:pr-4 text-gray-400">Guest</th>
                  <th className="pb-2 pr-2 md:pr-4 text-gray-400">Villa</th>
                  <th className="pb-2 pr-2 md:pr-3 text-gray-400 whitespace-nowrap">Check-in</th>
                  <th className="pb-2 pr-2 md:pr-3 text-gray-400 whitespace-nowrap">Check-out</th>
                  <th className="pb-2 pr-2 md:pr-3 text-gray-400 text-center">Noches</th>
                  <th className="pb-2 pr-2 md:pr-3 text-gray-400 whitespace-nowrap">Revenue IDR</th>
                  <th className="pb-2 pr-2 md:pr-3 text-gray-400">Canal</th>
                  <th className="pb-2 text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {bookingsList.map((booking, idx) => {
                  const checkIn = booking.check_in ? new Date(booking.check_in) : null;
                  const checkOut = booking.check_out ? new Date(booking.check_out) : null;
                  const checkInFormatted = checkIn ? `${checkIn.getDate()} ${checkIn.toLocaleString('en', { month: 'short' })}` : '—';
                  const checkOutFormatted = checkOut ? `${checkOut.getDate()} ${checkOut.toLocaleString('en', { month: 'short' })}` : '—';

                  // BUG C FIX: Calculate nights from check_in/check_out
                  const nights = (checkIn && checkOut) ?
                    Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)) :
                    (booking.nights || booking.total_nights || 0);

                  // BUG C FIX: Map villa_id to villa_name
                  const villaName = booking.villa_name || booking.villa || villaIdToName[booking.villa_id] || booking.villa_id || '—';

                  const status = booking.status || 'confirmed';
                  const statusBadge = status === 'confirmed' ? 'bg-[#D1FAE5] text-[#065F46]' :
                                     status === 'cancelled' ? 'bg-[#FEE2E2] text-[#991B1B]' :
                                     'bg-[#FEF3C7] text-[#92400E]';
                  return (
                    <tr key={idx} className="text-gray-300">
                      <td className="py-1 pr-2 md:py-2 md:pr-4 font-semibold text-white whitespace-nowrap">{booking.guest_name || booking.guest || '—'}</td>
                      <td className="py-1 pr-2 md:py-2 md:pr-4">{villaName}</td>
                      <td className="py-1 pr-2 md:py-2 md:pr-3 whitespace-nowrap">{checkInFormatted}</td>
                      <td className="py-1 pr-2 md:py-2 md:pr-3 whitespace-nowrap">{checkOutFormatted}</td>
                      <td className="py-1 pr-2 md:py-2 md:pr-3 text-center whitespace-nowrap">{nights}</td>
                      <td className="py-1 pr-2 md:py-2 md:pr-3 font-semibold text-purple-400 whitespace-nowrap">{formatIDR(booking.total_price || booking.revenue || 0)}</td>
                      <td className="py-1 pr-2 md:py-2 md:pr-3 capitalize whitespace-nowrap">{booking.channel || booking.source || '—'}</td>
                      <td className="py-1 md:py-2 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${statusBadge}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">0 bookings this month.</p>
        )}
      </div>

      {/* Revenue by villa table - ALWAYS SHOW */}
      <div className="bg-[#1f2937] p-5 rounded-lg border border-purple-500/30">
        <h4 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Revenue by villa
        </h4>
        {revenueByVilla && revenueByVilla.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[300px] text-left text-xs md:text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="pb-2 text-gray-400">Villa</th>
                  <th className="pb-2 text-gray-400 text-right">Revenue IDR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {revenueByVilla.map((villa, idx) => (
                  <tr key={idx} className="text-gray-300">
                    <td className="py-1 md:py-2 font-semibold text-white">{villa.villa_name || villa.villa || '—'}</td>
                    <td className="py-1 md:py-2 font-bold text-purple-400 text-right whitespace-nowrap">{formatIDR(villa.revenue || 0)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-purple-500/50">
                  <td className="py-1 md:py-2 font-bold text-white">TOTAL</td>
                  <td className="py-1 md:py-2 font-bold text-purple-400 text-right whitespace-nowrap">
                    {formatIDR(revenueByVilla.reduce((sum, v) => sum + (v.revenue || 0), 0))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">0 villas this month.</p>
        )}
      </div>

      {/* CAMBIO 5 + CAMBIO 6: Sales Channels + Occupancy Detail - Grid 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CAMBIO 5: Sales Channels - Read from booking_trends_json (NOT calculated) */}
        <div className="bg-[#1f2937] p-5 rounded-lg border border-pink-500/30">
          <h4 className="text-lg font-bold text-pink-400 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Sales channels
          </h4>
          <div className="space-y-2">
            {channels.map((channel, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-gray-300 capitalize font-semibold">
                  {channel.channel === 'booking' ? 'Booking.com' :
                   channel.channel === 'airbnb' ? 'Airbnb' :
                   channel.channel === 'direct' ? 'Direct' : channel.channel}
                </span>
                <span className="text-white font-bold">{channel.bookings || channel.count || 0}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2 border-t border-gray-700">
              <span className="text-red-400 font-semibold">Cancellations</span>
              <span className="text-red-400 font-bold">
                {bookingTrends.cancelled || 0} ({bookingTrends.cancellation_rate || 0}%)
              </span>
            </div>
          </div>
        </div>

        {/* CAMBIO 6: Occupancy Detail - Read from occupancy_summary (NOT calculated) */}
        <div className="bg-[#1f2937] p-5 rounded-lg border border-blue-500/30">
          <h4 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Occupancy detail
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Available nights</span>
              <span className="text-white font-bold">
                {occupancySummary.total_nights_available || (villaCount * daysInMonth)}
                ({villaCount}×{daysInMonth}d)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Occupied nights</span>
              <span className="text-green-400 font-bold">{occupancySummary.total_nights_occupied || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 font-semibold">Gap nights</span>
              <span className="text-orange-400 font-bold">{occupancySummary.gap_nights || 0}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-700">
              <span className="text-gray-300 font-semibold">Occupancy rate</span>
              <span className="text-blue-400 font-bold">{(occupancySummary.occupancy_rate || 0).toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approval section (ALWAYS show) - TABLE FORMAT */}
      <div className="bg-[#1f2937] p-5 rounded-lg border border-orange-500/30">
        <h4 className="text-lg font-bold text-orange-400 mb-4">
          Pending Approval
        </h4>
        {pendingApproval && pendingApproval.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-xs md:text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="pb-2 pr-2 md:pr-4 text-gray-400">Prior.</th>
                  <th className="pb-2 pr-2 md:pr-4 text-gray-400">Tipo</th>
                  <th className="pb-2 pr-2 md:pr-4 text-gray-400">Villa</th>
                  <th className="pb-2 text-gray-400">Request</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {pendingApproval.map((item, idx) => (
                  <tr key={idx} className="text-gray-300">
                    <td className="py-1 pr-2 md:py-2 md:pr-4">{item.priority || '—'}</td>
                    <td className="py-1 pr-2 md:py-2 md:pr-4">{item.type || '—'}</td>
                    <td className="py-1 pr-2 md:py-2 md:pr-4">{item.villa || '—'}</td>
                    <td className="py-1 md:py-2">{item.request || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">0 decisiones pendientes de aprobacion this month.</p>
        )}
      </div>

      {/* Auto-resolved section - ALWAYS SHOW */}
      <div className="bg-[#1f2937] p-5 rounded-lg border border-green-500/30">
        <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Auto-resolved — {autoResolved.length} this month
        </h4>
        {autoResolved && autoResolved.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-xs md:text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="pb-2 pr-2 md:pr-3 text-gray-400">Date</th>
                  <th className="pb-2 pr-2 md:pr-3 text-gray-400">Guest</th>
                  <th className="pb-2 pr-2 md:pr-3 text-gray-400">Type</th>
                  <th className="pb-2 text-gray-400">Resolution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {autoResolved.map((item, idx) => {
                  const fecha = item.created_at || item.date || item.resolved_at || item.timestamp ?
                    new Date(item.created_at || item.date || item.resolved_at || item.timestamp) : null;
                  const fechaFormatted = fecha ?
                    `${fecha.getDate()} ${fecha.toLocaleString('en', { month: 'short' })}` :
                    '—';

                  return (
                    <tr key={idx} className="text-gray-300">
                      <td className="py-1 pr-2 md:py-2 md:pr-3 whitespace-nowrap">{fechaFormatted}</td>
                      <td className="py-1 pr-2 md:py-2 md:pr-3">{item.guest_name || item.guest || '—'}</td>
                      <td className="py-1 pr-2 md:py-2 md:pr-3">{item.type || item.decision_type || '—'}</td>
                      <td className="py-1 md:py-2">{item.description || item.title || item.resolution || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">0 decisions auto-resolved this month.</p>
        )}
      </div>

      {/* Guest Requests - ALWAYS SHOW (last 30 days) */}
      <div className="bg-[#1f2937] p-5 rounded-lg border border-pink-500/30">
        <h4 className="text-lg font-bold text-pink-400 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Guest Requests
        </h4>
        {(() => {
          // BUG D FIX: Show ALL guest_requests for the month (no 30-day filter)
          const guestRequests = summary.guest_requests || [];

          return guestRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="pb-2 pr-2 md:pr-3 text-gray-400">Date</th>
                    <th className="pb-2 pr-2 md:pr-3 text-gray-400">Villa</th>
                    <th className="pb-2 pr-2 md:pr-3 text-gray-400">Guest</th>
                    <th className="pb-2 pr-2 md:pr-3 text-gray-400">Request</th>
                    <th className="pb-2 text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {guestRequests.map((request, idx) => {
                    const fecha = request.created_at || request.date ? new Date(request.created_at || request.date) : null;
                    const fechaFormatted = fecha ?
                      `${fecha.getDate()} ${fecha.toLocaleString('en', { month: 'short' })}` :
                      '—';

                    const isApproved = request.status === 'approved';
                    const isRejected = request.status === 'rejected';
                    const isAuto = request.approved_by === 'autopilot';

                    // BUG 2 FIX: Use request field (already clean, no guest name)
                    const requestTitle = request.request || request.description || request.title || 'N/A';

                    return (
                      <tr key={request.id || idx} className="text-gray-300">
                        <td className="py-1 pr-2 md:py-2 md:pr-3 whitespace-nowrap">{fechaFormatted}</td>
                        <td className="py-1 pr-2 md:py-2 md:pr-3">{request.villa_name || request.villa || '—'}</td>
                        <td className="py-1 pr-2 md:py-2 md:pr-3">{request.guest_name || request.guest || '—'}</td>
                        <td className="py-1 pr-2 md:py-2 md:pr-3">{requestTitle}</td>
                        <td className="py-1 md:py-2">
                          {isApproved && (
                            <div className="flex items-center gap-2">
                              <span className="text-green-400">✅ Approved</span>
                              {isAuto && (
                                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#D1FAE5] text-[#065F46]">
                                  Auto
                                </span>
                              )}
                            </div>
                          )}
                          {isRejected && (
                            <span className="text-red-400">❌ Rejected</span>
                          )}
                          {!isApproved && !isRejected && (
                            <span className="text-gray-500">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">0 requests this month.</p>
          );
        })()}
      </div>

      {/* Decisions - this month */}
      <div className="bg-[#1f2937] p-5 rounded-lg border border-red-500/30">
        <h4 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Decisions — this month ({decisionsList.length})
        </h4>
        {decisionsList && decisionsList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-xs md:text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="pb-2 pr-2 md:pr-3 text-gray-400">Date</th>
                  <th className="pb-2 pr-2 md:pr-3 text-gray-400">Priority</th>
                  <th className="pb-2 pr-2 md:pr-3 text-gray-400">Type</th>
                  <th className="pb-2 pr-2 md:pr-3 text-gray-400">Guest</th>
                  <th className="pb-2 pr-2 md:pr-3 text-gray-400">Villa</th>
                  <th className="pb-2 text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {decisionsList.map((decision, idx) => {
                  const fecha = decision.created_at || decision.date ? new Date(decision.created_at || decision.date) : null;
                  const fechaFormatted = fecha ?
                    `${fecha.getDate()} ${fecha.toLocaleString('en', { month: 'short' })}` :
                    '—';

                  return (
                    <tr key={decision.id || idx} className="text-gray-300">
                      <td className="py-1 pr-2 md:py-2 md:pr-3 whitespace-nowrap">{fechaFormatted}</td>
                      <td className="py-1 pr-2 md:py-2 md:pr-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          decision.priority === 'urgent' ? 'bg-[#FEE2E2] text-[#991B1B]' :
                          decision.priority === 'high' ? 'bg-[#FEF3C7] text-[#92400E]' :
                          decision.priority === 'medium' ? 'bg-[#DBEAFE] text-[#1E40AF]' :
                          'bg-[#F3F4F6] text-[#6B7280]'
                        }`}>
                          {decision.priority}
                        </span>
                      </td>
                      <td className="py-1 pr-2 md:py-2 md:pr-3">{decision.decision_type || decision.type || '—'}</td>
                      <td className="py-1 pr-2 md:py-2 md:pr-3">{decision.guest_name || decision.guest || '—'}</td>
                      <td className="py-1 pr-2 md:py-2 md:pr-3">{decision.villa_name || decision.villa || '—'}</td>
                      <td className="py-1 md:py-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          decision.status === 'approved' ? 'bg-[#D1FAE5] text-[#065F46]' :
                          decision.status === 'rejected' ? 'bg-[#FEE2E2] text-[#991B1B]' :
                          'bg-[#FEF3C7] text-[#92400E]'
                        }`}>
                          {decision.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">0 decisions this month.</p>
        )}
      </div>

      {/* Strategic recommendations */}
      {strategicRecs && strategicRecs.length > 0 && (
        <div className="bg-[#1f2937] p-5 rounded-lg border border-purple-500/30">
          <h4 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Strategic Recommendations
          </h4>
          <div className="space-y-3">
            {strategicRecs.map((rec, idx) => {
              // Parse action text - format: "3 pending: item1 — guest1; item2 — guest2; item3 — guest3"
              const actionText = rec.recommendation || rec.action || '—';

              let prefix = '';
              let itemsText = actionText;

              // Check if text has format "X pending: items..." or similar prefix with colon
              if (actionText.includes(':') && actionText.includes(';')) {
                const colonIndex = actionText.indexOf(':');
                prefix = actionText.substring(0, colonIndex + 1); // "3 pending:"
                // Make prefix more descriptive: "3 pending:" → "3 pending approvals:"
                if (prefix.includes('pending:')) {
                  prefix = prefix.replace('pending:', 'pending approvals:');
                }
                itemsText = actionText.substring(colonIndex + 1); // " item1; item2; item3"
              }

              const actionItems = itemsText.includes(';') ? itemsText.split(';').map(s => s.trim()) : [itemsText.trim()];

              return (
                <div key={idx} className="bg-[#2a2f3a] p-4 rounded-lg border-l-4 border-purple-500">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-white font-semibold capitalize">{rec.category || rec.area || 'General'}</p>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      rec.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                      rec.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                      rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {rec.priority?.toUpperCase() || 'MEDIUM'}
                    </span>
                  </div>
                  <div>
                    {prefix && <p className="text-gray-300 text-sm font-semibold mb-1">{prefix}</p>}
                    <div className="space-y-1 ml-4">
                      {actionItems.map((item, itemIdx) => (
                        <p key={itemIdx} className="text-gray-300 text-sm">• {item}</p>
                      ))}
                    </div>
                  </div>
                  {rec.impact && <p className="text-gray-400 text-xs mt-2">Impact: {rec.impact}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyReport;
