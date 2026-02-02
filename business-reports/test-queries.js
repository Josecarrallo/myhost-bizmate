/**
 * Test Script for Business Reports SQL Queries
 * Validates all queries against real Supabase data
 */

import { createClient } from '@supabase/supabase-js';
import { queries } from './sql-queries.js';

// Supabase connection (service role for server-side)
const SUPABASE_URL = 'https://jjpscimtxrudtepzwhag.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjk0MzIzMiwiZXhwIjoyMDc4NTE5MjMyfQ.RBD16xjgQB__nj5DtLrK2w55uQ4WFJiaa0mfZT2BeJg';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Test data
const TEST_PROPERTY_NISMARA = '3551cd18-af6b-48c2-85ba-4c5dc0074892';
const TEST_PROPERTY_IZUMI = '18711359-1378-4d12-9ea6-fb31c0b1bac2';
const TEST_OWNER_GITA = '1f32d384-4018-46a9-a6f9-058217e6924a';

// Expected results for validation
const EXPECTED_NISMARA = {
  total_bookings: 41,
  total_revenue: 139909985, // IDR
  currency: 'IDR'
};

const EXPECTED_IZUMI = {
  total_bookings: 165,
  total_revenue: 538140, // USD
  currency: 'USD'
};

/**
 * Execute a query using Supabase's from().select() or rpc()
 */
async function executeQuery(query, params = []) {
  try {
    // Replace placeholders with actual values
    let sql = query;
    params.forEach((param, index) => {
      const placeholder = `$${index + 1}`;
      const escapedParam = typeof param === 'string'
        ? `'${param.replace(/'/g, "''")}'`
        : param;
      sql = sql.replace(new RegExp(`\\${placeholder}`, 'g'), escapedParam);
    });

    // Use Supabase RPC to execute raw SQL
    const { data, error } = await supabase.rpc('execute_sql', { sql });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('❌ Query execution failed:', err.message);
    throw err;
  }
}

/**
 * Test Q1: Get owners with auto_reports_enabled
 */
async function testQ1() {
  console.log('\n📊 Testing Q1: Get owners with auto_reports_enabled');
  console.log('─'.repeat(60));

  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        full_name,
        email,
        phone,
        properties!inner(auto_reports_enabled)
      `)
      .eq('role', 'owner')
      .eq('properties.auto_reports_enabled', true);

    if (error) throw error;

    console.log('✅ Found', data.length, 'owner(s) with auto_reports enabled');
    data.forEach(owner => {
      console.log(`   - ${owner.full_name} (${owner.email})`);
    });

    return data;
  } catch (err) {
    console.error('❌ Q1 failed:', err.message);
    return null;
  }
}

/**
 * Test Q2: Get properties for owner
 */
async function testQ2(ownerId) {
  console.log('\n📊 Testing Q2: Get properties for owner');
  console.log('─'.repeat(60));

  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('owner_id', ownerId)
      .eq('status', 'active');

    if (error) throw error;

    console.log('✅ Found', data.length, 'property(ies)');
    for (const prop of data) {
      // Get villa count
      const { count } = await supabase
        .from('villas')
        .select('*', { count: 'exact', head: true })
        .eq('property_id', prop.id)
        .eq('status', 'active');

      console.log(`   - ${prop.name} (${prop.currency})`);
      console.log(`     Villas: ${count}, Commission: ${prop.commission_rate}%`);
    }

    return data;
  } catch (err) {
    console.error('❌ Q2 failed:', err.message);
    return null;
  }
}

/**
 * Test Q3: Get villas for property
 */
async function testQ3(propertyId) {
  console.log('\n📊 Testing Q3: Get villas for property');
  console.log('─'.repeat(60));

  try {
    const { data, error } = await supabase
      .from('villas')
      .select('*')
      .eq('property_id', propertyId)
      .eq('status', 'active')
      .order('name');

    if (error) throw error;

    console.log('✅ Found', data.length, 'villa(s)');
    data.forEach(villa => {
      console.log(`   - ${villa.name} (${villa.bedrooms} BR, ${villa.currency} ${villa.base_price})`);
    });

    return data;
  } catch (err) {
    console.error('❌ Q3 failed:', err.message);
    return null;
  }
}

/**
 * Test Q4: Monthly KPIs
 */
async function testQ4(propertyId, periodStart, periodEnd, expected) {
  console.log('\n📊 Testing Q4: Monthly KPIs');
  console.log('─'.repeat(60));

  try {
    // Get bookings with aggregations
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('total_price, nights')
      .eq('property_id', propertyId)
      .gte('check_in', periodStart)
      .lte('check_in', periodEnd)
      .not('status', 'in', '(cancelled,expired)');

    if (bookingsError) throw bookingsError;

    // Get villa count
    const { count: villaCount } = await supabase
      .from('villas')
      .select('*', { count: 'exact', head: true })
      .eq('property_id', propertyId)
      .eq('status', 'active');

    // Calculate metrics
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
    const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;
    const totalRoomNights = bookings.reduce((sum, b) => sum + (b.nights || 0), 0);
    const avgLengthOfStay = totalBookings > 0 ? totalRoomNights / totalBookings : 0;

    // Calculate days in period
    const start = new Date(periodStart);
    const end = new Date(periodEnd);
    const daysInPeriod = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Calculate occupancy
    const occupancyRate = villaCount > 0
      ? ((totalRoomNights / (daysInPeriod * villaCount)) * 100).toFixed(1)
      : 0;

    console.log('✅ KPIs calculated successfully:');
    console.log(`   Total Bookings: ${totalBookings} (expected: ${expected?.total_bookings || 'N/A'})`);
    console.log(`   Total Revenue: ${totalRevenue.toLocaleString()} (expected: ${expected?.total_revenue?.toLocaleString() || 'N/A'})`);
    console.log(`   Avg Booking Value: ${avgBookingValue.toFixed(2)}`);
    console.log(`   Avg Length of Stay: ${avgLengthOfStay.toFixed(1)} nights`);
    console.log(`   Total Room Nights: ${totalRoomNights}`);
    console.log(`   Occupancy Rate: ${occupancyRate}%`);
    console.log(`   Period: ${daysInPeriod} days, Villas: ${villaCount}`);

    // Validation
    if (expected) {
      const bookingsMatch = totalBookings === expected.total_bookings;
      const revenueMatch = Math.abs(totalRevenue - expected.total_revenue) < 1; // Allow 1 cent difference

      if (bookingsMatch && revenueMatch) {
        console.log('✅ VALIDATION PASSED - Numbers match expected values');
      } else {
        console.log('⚠️  VALIDATION WARNING:');
        if (!bookingsMatch) console.log(`   Bookings: ${totalBookings} vs ${expected.total_bookings}`);
        if (!revenueMatch) console.log(`   Revenue: ${totalRevenue} vs ${expected.total_revenue}`);
      }
    }

    return {
      total_bookings: totalBookings,
      total_revenue: totalRevenue,
      avg_booking_value: avgBookingValue,
      avg_length_of_stay: avgLengthOfStay,
      total_room_nights: totalRoomNights,
      occupancy_rate: parseFloat(occupancyRate)
    };
  } catch (err) {
    console.error('❌ Q4 failed:', err.message);
    return null;
  }
}

/**
 * Test Q5: Villa Breakdown
 */
async function testQ5(propertyId, periodStart, periodEnd) {
  console.log('\n📊 Testing Q5: Villa Breakdown');
  console.log('─'.repeat(60));

  try {
    // Get all villas
    const { data: villas, error: villasError } = await supabase
      .from('villas')
      .select('id, name')
      .eq('property_id', propertyId)
      .eq('status', 'active')
      .order('name');

    if (villasError) throw villasError;

    console.log('✅ Villa breakdown:');

    const breakdown = [];
    for (const villa of villas) {
      // Get bookings for this villa
      const { data: bookings } = await supabase
        .from('bookings')
        .select('total_price, nights')
        .eq('villa_id', villa.id)
        .gte('check_in', periodStart)
        .lte('check_in', periodEnd)
        .not('status', 'in', '(cancelled,expired)');

      const villaBookings = bookings.length;
      const villaRevenue = bookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
      const villaRoomNights = bookings.reduce((sum, b) => sum + (b.nights || 0), 0);
      const avgBookingValue = villaBookings > 0 ? villaRevenue / villaBookings : 0;

      // Calculate days in period
      const start = new Date(periodStart);
      const end = new Date(periodEnd);
      const daysInPeriod = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

      const villaOccupancy = ((villaRoomNights / daysInPeriod) * 100).toFixed(1);

      console.log(`   ${villa.name}:`);
      console.log(`     Bookings: ${villaBookings}, Revenue: ${villaRevenue.toLocaleString()}`);
      console.log(`     Room Nights: ${villaRoomNights}, Occupancy: ${villaOccupancy}%`);

      breakdown.push({
        villa_name: villa.name,
        bookings: villaBookings,
        revenue: villaRevenue,
        avg_booking_value: avgBookingValue,
        room_nights: villaRoomNights,
        occupancy_rate: parseFloat(villaOccupancy)
      });
    }

    return breakdown;
  } catch (err) {
    console.error('❌ Q5 failed:', err.message);
    return null;
  }
}

/**
 * Test Q6: Channel Breakdown
 */
async function testQ6(propertyId, periodStart, periodEnd) {
  console.log('\n📊 Testing Q6: Channel Breakdown');
  console.log('─'.repeat(60));

  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('channel, total_price')
      .eq('property_id', propertyId)
      .gte('check_in', periodStart)
      .lte('check_in', periodEnd)
      .not('status', 'in', '(cancelled,expired)');

    if (error) throw error;

    // Group by channel
    const channels = {};
    bookings.forEach(b => {
      if (!channels[b.channel]) {
        channels[b.channel] = { bookings: 0, revenue: 0 };
      }
      channels[b.channel].bookings++;
      channels[b.channel].revenue += b.total_price || 0;
    });

    const totalBookings = bookings.length;

    console.log('✅ Channel breakdown:');
    Object.entries(channels)
      .sort((a, b) => b[1].bookings - a[1].bookings)
      .forEach(([channel, stats]) => {
        const percentage = ((stats.bookings / totalBookings) * 100).toFixed(1);
        console.log(`   ${channel}: ${stats.bookings} bookings (${percentage}%), Revenue: ${stats.revenue.toLocaleString()}`);
      });

    return channels;
  } catch (err) {
    console.error('❌ Q6 failed:', err.message);
    return null;
  }
}

/**
 * Test Q7: OTA Commissions
 */
async function testQ7(propertyId, periodStart, periodEnd, commissionRate = 15) {
  console.log('\n📊 Testing Q7: OTA Commissions');
  console.log('─'.repeat(60));

  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('channel, total_price')
      .eq('property_id', propertyId)
      .gte('check_in', periodStart)
      .lte('check_in', periodEnd)
      .not('status', 'in', '(cancelled,expired)');

    if (error) throw error;

    let otaRevenue = 0;
    let directRevenue = 0;
    let otaCommissionCost = 0;

    bookings.forEach(b => {
      if (b.channel === 'direct' || b.channel === 'voice_ai') {
        directRevenue += b.total_price || 0;
      } else {
        otaRevenue += b.total_price || 0;
        otaCommissionCost += (b.total_price || 0) * (commissionRate / 100);
      }
    });

    const totalRevenue = directRevenue + otaRevenue;
    const otaPercentage = totalRevenue > 0 ? ((otaRevenue / totalRevenue) * 100).toFixed(1) : 0;

    console.log('✅ OTA Commission Analysis:');
    console.log(`   Direct Revenue: $${directRevenue.toLocaleString()}`);
    console.log(`   OTA Revenue: $${otaRevenue.toLocaleString()} (${otaPercentage}% of total)`);
    console.log(`   OTA Commission Cost: $${otaCommissionCost.toLocaleString()} (${commissionRate}% of OTA revenue)`);
    console.log(`   Net Revenue After Commission: $${(totalRevenue - otaCommissionCost).toLocaleString()}`);

    return {
      direct_revenue: directRevenue,
      ota_revenue: otaRevenue,
      ota_commission_cost: otaCommissionCost,
      total_revenue: totalRevenue
    };
  } catch (err) {
    console.error('❌ Q7 failed:', err.message);
    return null;
  }
}

/**
 * Test Q8: Payment Status
 */
async function testQ8(propertyId, periodStart, periodEnd) {
  console.log('\n📊 Testing Q8: Payment Status');
  console.log('─'.repeat(60));

  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('payment_status, total_price')
      .eq('property_id', propertyId)
      .gte('check_in', periodStart)
      .lte('check_in', periodEnd)
      .not('status', 'in', '(cancelled,expired)');

    if (error) throw error;

    // Group by payment_status
    const paymentStats = {};
    bookings.forEach(b => {
      const status = b.payment_status || 'unknown';
      if (!paymentStats[status]) {
        paymentStats[status] = { count: 0, amount: 0 };
      }
      paymentStats[status].count++;
      paymentStats[status].amount += b.total_price || 0;
    });

    console.log('✅ Payment Status breakdown:');
    Object.entries(paymentStats)
      .sort((a, b) => b[1].count - a[1].count)
      .forEach(([status, stats]) => {
        console.log(`   ${status}: ${stats.count} bookings, $${stats.amount.toLocaleString()}`);
      });

    return paymentStats;
  } catch (err) {
    console.error('❌ Q8 failed:', err.message);
    return null;
  }
}

/**
 * Test Q9: Revenue Trend (last 6 months)
 */
async function testQ9(propertyId, reportDate = new Date()) {
  console.log('\n📊 Testing Q9: Revenue Trend (last 6 months)');
  console.log('─'.repeat(60));

  try {
    // Calculate 6 months ago
    const sixMonthsAgo = new Date(reportDate);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('check_in, total_price, nights')
      .eq('property_id', propertyId)
      .gte('check_in', sixMonthsAgo.toISOString().split('T')[0])
      .lt('check_in', reportDate.toISOString().split('T')[0])
      .not('status', 'in', '(cancelled,expired)');

    if (error) throw error;

    // Group by month
    const monthlyStats = {};
    bookings.forEach(b => {
      const month = b.check_in.substring(0, 7); // YYYY-MM
      if (!monthlyStats[month]) {
        monthlyStats[month] = { bookings: 0, revenue: 0, room_nights: 0 };
      }
      monthlyStats[month].bookings++;
      monthlyStats[month].revenue += b.total_price || 0;
      monthlyStats[month].room_nights += b.nights || 0;
    });

    console.log('✅ Revenue Trend:');
    Object.entries(monthlyStats)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .forEach(([month, stats]) => {
        console.log(`   ${month}: ${stats.bookings} bookings, $${stats.revenue.toLocaleString()}, ${stats.room_nights} room nights`);
      });

    return monthlyStats;
  } catch (err) {
    console.error('❌ Q9 failed:', err.message);
    return null;
  }
}

/**
 * Test Q10: Upcoming Bookings (next 30 days)
 */
async function testQ10(propertyId) {
  console.log('\n📊 Testing Q10: Upcoming Bookings (next 30 days)');
  console.log('─'.repeat(60));

  try {
    const today = new Date();
    const thirtyDaysLater = new Date(today);
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        guest_name,
        check_in,
        check_out,
        nights,
        guests,
        total_price,
        channel,
        payment_status,
        villas (name)
      `)
      .eq('property_id', propertyId)
      .gte('check_in', today.toISOString().split('T')[0])
      .lte('check_in', thirtyDaysLater.toISOString().split('T')[0])
      .not('status', 'in', '(cancelled,expired)')
      .order('check_in');

    if (error) throw error;

    console.log(`✅ Upcoming bookings: ${bookings.length}`);
    bookings.slice(0, 5).forEach(b => {
      const villaName = b.villas?.name || 'N/A';
      console.log(`   ${b.check_in}: ${b.guest_name} (${villaName}), $${b.total_price}, ${b.payment_status}`);
    });

    if (bookings.length > 5) {
      console.log(`   ... and ${bookings.length - 5} more`);
    }

    return bookings;
  } catch (err) {
    console.error('❌ Q10 failed:', err.message);
    return null;
  }
}

/**
 * Test Q11: Year-to-Date
 */
async function testQ11(propertyId) {
  console.log('\n📊 Testing Q11: Year-to-Date');
  console.log('─'.repeat(60));

  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('check_in, total_price, nights')
      .eq('property_id', propertyId)
      .not('status', 'in', '(cancelled,expired)');

    if (error) throw error;

    // Group by year
    const yearlyStats = {};
    bookings.forEach(b => {
      const year = b.check_in.substring(0, 4); // YYYY
      if (!yearlyStats[year]) {
        yearlyStats[year] = { bookings: 0, revenue: 0, room_nights: 0 };
      }
      yearlyStats[year].bookings++;
      yearlyStats[year].revenue += b.total_price || 0;
      yearlyStats[year].room_nights += b.nights || 0;
    });

    console.log('✅ Year-to-Date Performance:');
    Object.entries(yearlyStats)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .forEach(([year, stats]) => {
        console.log(`   ${year}: ${stats.bookings} bookings, $${stats.revenue.toLocaleString()}, ${stats.room_nights} room nights`);
      });

    return yearlyStats;
  } catch (err) {
    console.error('❌ Q11 failed:', err.message);
    return null;
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('🚀 BUSINESS REPORTS - SQL QUERIES TEST');
  console.log('═'.repeat(60));
  console.log('Testing against Supabase:', SUPABASE_URL);
  console.log('═'.repeat(60));

  try {
    // Test with Nismara Uma (auto_reports enabled)
    console.log('\n🏨 TESTING WITH: NISMARA UMA VILLA');
    console.log('═'.repeat(60));

    // Q1: Get owners with auto reports
    await testQ1();

    // Q2: Get properties for Gita
    await testQ2(TEST_OWNER_GITA);

    // Q3: Get villas for Nismara
    await testQ3(TEST_PROPERTY_NISMARA);

    // Q4: Monthly KPIs (full period)
    await testQ4(
      TEST_PROPERTY_NISMARA,
      '2024-01-01',
      '2026-12-31',
      EXPECTED_NISMARA
    );

    // Q5: Villa breakdown
    await testQ5(TEST_PROPERTY_NISMARA, '2024-01-01', '2026-12-31');

    // Q6: Channel breakdown
    await testQ6(TEST_PROPERTY_NISMARA, '2024-01-01', '2026-12-31');

    // Q7: OTA Commissions
    await testQ7(TEST_PROPERTY_NISMARA, '2024-01-01', '2026-12-31', 15);

    // Q8: Payment Status
    await testQ8(TEST_PROPERTY_NISMARA, '2024-01-01', '2026-12-31');

    // Q9: Revenue Trend
    await testQ9(TEST_PROPERTY_NISMARA, new Date('2026-02-01'));

    // Q10: Upcoming Bookings
    await testQ10(TEST_PROPERTY_NISMARA);

    // Q11: Year-to-Date
    await testQ11(TEST_PROPERTY_NISMARA);

    // Test with Izumi Hotel
    console.log('\n\n🏨 TESTING WITH: IZUMI HOTEL & VILLAS');
    console.log('═'.repeat(60));

    // Q2: Get properties for Jose (owner of Izumi)
    const TEST_OWNER_JOSE = 'c24393db-d318-4d75-8bbf-0fa240b9c1db';
    await testQ2(TEST_OWNER_JOSE);

    // Q3: Get villas for Izumi
    await testQ3(TEST_PROPERTY_IZUMI);

    // Q4: Monthly KPIs (full period)
    await testQ4(
      TEST_PROPERTY_IZUMI,
      '2024-01-01',
      '2026-12-31',
      EXPECTED_IZUMI
    );

    // Q5: Villa breakdown
    await testQ5(TEST_PROPERTY_IZUMI, '2024-01-01', '2026-12-31');

    // Q6: Channel breakdown
    await testQ6(TEST_PROPERTY_IZUMI, '2024-01-01', '2026-12-31');

    // Q7: OTA Commissions
    await testQ7(TEST_PROPERTY_IZUMI, '2024-01-01', '2026-12-31', 15);

    // Q8: Payment Status
    await testQ8(TEST_PROPERTY_IZUMI, '2024-01-01', '2026-12-31');

    // Q9: Revenue Trend
    await testQ9(TEST_PROPERTY_IZUMI, new Date('2026-02-01'));

    // Q10: Upcoming Bookings
    await testQ10(TEST_PROPERTY_IZUMI);

    // Q11: Year-to-Date
    await testQ11(TEST_PROPERTY_IZUMI);

    console.log('\n═'.repeat(60));
    console.log('✅ ALL TESTS COMPLETED');
    console.log('═'.repeat(60));

  } catch (err) {
    console.error('\n❌ TEST SUITE FAILED:', err.message);
    console.error(err);
    process.exit(1);
  }
}

// Run tests
runTests();
