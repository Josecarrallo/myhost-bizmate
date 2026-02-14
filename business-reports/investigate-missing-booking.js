/**
 * Investigation Script - Missing Izumi Booking
 * Expected: 165 bookings, $538,140
 * Found: 164 bookings, $535,640
 * Missing: 1 booking, $2,500
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jjpscimtxrudtepzwhag.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjk0MzIzMiwiZXhwIjoyMDc4NTE5MjMyfQ.RBD16xjgQB__nj5DtLrK2w55uQ4WFJiaa0mfZT2BeJg';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const IZUMI_PROPERTY_ID = '18711359-1378-4d12-9ea6-fb31c0b1bac2';

async function investigate() {
  console.log('🔍 INVESTIGATING MISSING IZUMI BOOKING');
  console.log('═'.repeat(60));
  console.log('Expected: 165 bookings, $538,140');
  console.log('Found:    164 bookings, $535,640');
  console.log('Missing:  1 booking, $2,500');
  console.log('═'.repeat(60));

  try {
    // Query 1: Get ALL bookings for Izumi (no filters)
    console.log('\n📊 Query 1: ALL bookings for Izumi (no status filter)');
    console.log('─'.repeat(60));

    const { data: allBookings, error: allError } = await supabase
      .from('bookings')
      .select('*')
      .eq('property_id', IZUMI_PROPERTY_ID)
      .order('created_at', { ascending: false });

    if (allError) throw allError;

    console.log(`✅ Total bookings in DB: ${allBookings.length}`);

    // Group by status
    const byStatus = {};
    allBookings.forEach(b => {
      byStatus[b.status] = (byStatus[b.status] || 0) + 1;
    });

    console.log('\n📋 Bookings by status:');
    Object.entries(byStatus).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`);
    });

    // Query 2: Count with our filter (NOT cancelled, NOT expired)
    console.log('\n📊 Query 2: Bookings with filter (status NOT IN cancelled, expired)');
    console.log('─'.repeat(60));

    const { data: filteredBookings, error: filteredError } = await supabase
      .from('bookings')
      .select('*')
      .eq('property_id', IZUMI_PROPERTY_ID)
      .not('status', 'in', '(cancelled,expired)');

    if (filteredError) throw filteredError;

    console.log(`✅ Filtered bookings: ${filteredBookings.length}`);

    const filteredRevenue = filteredBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
    console.log(`   Total revenue: $${filteredRevenue.toLocaleString()}`);

    // Query 3: Check for bookings outside date range
    console.log('\n📊 Query 3: Bookings outside 2024-2026 range');
    console.log('─'.repeat(60));

    const outsideDateRange = filteredBookings.filter(b => {
      const checkIn = new Date(b.check_in);
      return checkIn < new Date('2024-01-01') || checkIn > new Date('2026-12-31');
    });

    console.log(`✅ Bookings outside date range: ${outsideDateRange.length}`);
    if (outsideDateRange.length > 0) {
      outsideDateRange.forEach(b => {
        console.log(`   - ${b.guest_name}: Check-in ${b.check_in}, $${b.total_price}`);
      });
    }

    // Query 4: Find bookings with $2,500 price
    console.log('\n📊 Query 4: Bookings with $2,500 price');
    console.log('─'.repeat(60));

    const priceMatch = allBookings.filter(b => b.total_price === 2500);
    console.log(`✅ Found ${priceMatch.length} booking(s) with $2,500 price:`);

    priceMatch.forEach(b => {
      console.log(`   - Guest: ${b.guest_name}`);
      console.log(`     Check-in: ${b.check_in}, Check-out: ${b.check_out}`);
      console.log(`     Status: ${b.status}, Payment: ${b.payment_status}`);
      console.log(`     Villa ID: ${b.villa_id}`);
      console.log(`     Channel: ${b.channel}`);

      // Check if it's in our filtered set
      const isInFiltered = filteredBookings.some(fb => fb.id === b.id);
      console.log(`     In filtered results: ${isInFiltered ? '✅ YES' : '❌ NO'}`);

      if (!isInFiltered) {
        console.log(`     ⚠️  EXCLUDED REASON: Status is '${b.status}'`);
      }
    });

    // Query 5: Calculate difference
    console.log('\n📊 Query 5: Calculate the exact difference');
    console.log('─'.repeat(60));

    const expectedTotal = 538140;
    const actualTotal = filteredRevenue;
    const difference = expectedTotal - actualTotal;

    console.log(`   Expected: $${expectedTotal.toLocaleString()}`);
    console.log(`   Actual:   $${actualTotal.toLocaleString()}`);
    console.log(`   Difference: $${difference.toLocaleString()}`);

    // Find which booking(s) make up this difference
    const possibleMatches = allBookings.filter(b => {
      const isNotInFiltered = !filteredBookings.some(fb => fb.id === b.id);
      return isNotInFiltered && b.total_price === difference;
    });

    if (possibleMatches.length > 0) {
      console.log(`\n🎯 FOUND THE MISSING BOOKING(S):`);
      possibleMatches.forEach(b => {
        console.log(`   - Guest: ${b.guest_name}`);
        console.log(`     Price: $${b.total_price}`);
        console.log(`     Check-in: ${b.check_in}`);
        console.log(`     Status: ${b.status} ← THIS IS WHY IT'S EXCLUDED`);
        console.log(`     Payment: ${b.payment_status}`);
      });
    } else {
      console.log(`\n⚠️  Could not find exact match. Investigating further...`);

      // Try to find combination of bookings
      const excluded = allBookings.filter(b => !filteredBookings.some(fb => fb.id === b.id));
      console.log(`\n📋 All EXCLUDED bookings (${excluded.length}):`);
      excluded.forEach(b => {
        console.log(`   - ${b.guest_name}: $${b.total_price}, Status: ${b.status}, Check-in: ${b.check_in}`);
      });

      const excludedTotal = excluded.reduce((sum, b) => sum + (b.total_price || 0), 0);
      console.log(`\n   Total value of excluded bookings: $${excludedTotal.toLocaleString()}`);
    }

    console.log('\n═'.repeat(60));
    console.log('✅ INVESTIGATION COMPLETE');
    console.log('═'.repeat(60));

  } catch (err) {
    console.error('❌ Investigation failed:', err.message);
    console.error(err);
  }
}

investigate();
