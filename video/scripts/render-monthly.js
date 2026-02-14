#!/usr/bin/env node

/**
 * MONTHLY VIDEO RENDERER - MY HOST BIZMATE
 *
 * Este script:
 * 1. Obtiene datos de Supabase del mes actual
 * 2. Calcula estadísticas automáticamente
 * 3. Genera video mensual con Remotion
 *
 * Uso:
 *   node scripts/render-monthly.js
 *   node scripts/render-monthly.js --month=1 --year=2026
 */

import { execSync } from "child_process";
import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const SUPABASE_URL = "https://jjpscimtxrudtepzwhag.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNzU3NjEsImV4cCI6MjA0OTk1MTc2MX0.lRvRtH7flFQos88-q3AdW9dsJaEljPK0WZr-u4AZPug";
const GITA_TENANT_ID = "1f32d384-4018-46a9-a6f9-058217e6924a";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Parse command line arguments
const args = process.argv.slice(2);
const getArg = (name) => {
  const arg = args.find((a) => a.startsWith(`--${name}=`));
  return arg ? arg.split("=")[1] : null;
};

// Get month and year (default to current)
const now = new Date();
const targetMonth = parseInt(getArg("month") || (now.getMonth() + 1));
const targetYear = parseInt(getArg("year") || now.getFullYear());

// Month names
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

console.log(`\n🎬 MONTHLY VIDEO RENDERER\n`);
console.log(`📅 Generating video for: ${monthNames[targetMonth - 1]} ${targetYear}\n`);

async function fetchMonthlyData() {
  try {
    console.log("📊 Fetching data from Supabase...");

    // Calculate date range for the month
    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    console.log(`   Date range: ${startDateStr} to ${endDateStr}`);

    // Fetch bookings for the month
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("tenant_id", GITA_TENANT_ID)
      .gte("check_in", startDateStr)
      .lte("check_in", endDateStr);

    if (error) {
      console.error("❌ Error fetching bookings:", error);
      process.exit(1);
    }

    if (!bookings || bookings.length === 0) {
      console.log("⚠️  No bookings found for this month.");
      console.log("   Using demo data instead...\n");
      return getDemoData();
    }

    console.log(`   ✅ Found ${bookings.length} bookings\n`);

    // Calculate statistics
    const stats = calculateStats(bookings);

    return stats;
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

function calculateStats(bookings) {
  const stats = {
    month: monthNames[targetMonth - 1],
    year: targetYear,
    totalBookings: bookings.length,
    totalRevenue: 0,
    airbnbBookings: 0,
    airbnbRevenue: 0,
    bookingComBookings: 0,
    bookingComRevenue: 0,
    directBookings: 0,
    directRevenue: 0,
    occupancyRate: 0,
    avgBookingValue: 0,
    topPerformer: "Nismara Uma Villa",
  };

  // Calculate revenue and channel breakdown
  bookings.forEach((booking) => {
    const price = booking.total_price || 0;
    const source = (booking.source || "").toLowerCase();

    stats.totalRevenue += price;

    if (source === "airbnb") {
      stats.airbnbBookings++;
      stats.airbnbRevenue += price;
    } else if (source === "booking.com") {
      stats.bookingComBookings++;
      stats.bookingComRevenue += price;
    } else if (source === "gita" || source === "direct") {
      stats.directBookings++;
      stats.directRevenue += price;
    }
  });

  // Calculate average booking value
  stats.avgBookingValue = stats.totalBookings > 0
    ? Math.floor(stats.totalRevenue / stats.totalBookings)
    : 0;

  // Calculate occupancy rate (simplified - assumes 30 days, 1 property)
  stats.occupancyRate = Math.min((bookings.length / 30) * 100, 100);

  // Determine top performer (property with most bookings)
  const propertyCounts = {};
  bookings.forEach((booking) => {
    const propName = booking.property_name || "Unknown";
    propertyCounts[propName] = (propertyCounts[propName] || 0) + 1;
  });

  const topProp = Object.entries(propertyCounts).sort((a, b) => b[1] - a[1])[0];
  if (topProp) {
    stats.topPerformer = topProp[0];
  }

  return stats;
}

function getDemoData() {
  return {
    month: monthNames[targetMonth - 1],
    year: targetYear,
    totalBookings: 41,
    totalRevenue: 140709985,
    airbnbBookings: 34,
    airbnbRevenue: 103701906,
    bookingComBookings: 3,
    bookingComRevenue: 21008079,
    directBookings: 3,
    directRevenue: 16000000,
    occupancyRate: 68.3,
    avgBookingValue: 3431951,
    topPerformer: "Nismara Uma Villa",
  };
}

async function renderVideo(stats) {
  console.log("📊 Statistics Summary:");
  console.log(`   Total Bookings: ${stats.totalBookings}`);
  console.log(`   Total Revenue: Rp ${stats.totalRevenue.toLocaleString('id-ID')}`);
  console.log(`   Airbnb: ${stats.airbnbBookings} bookings`);
  console.log(`   Booking.com: ${stats.bookingComBookings} bookings`);
  console.log(`   Direct: ${stats.directBookings} bookings`);
  console.log(`   Occupancy: ${stats.occupancyRate.toFixed(1)}%`);
  console.log(`   Avg Booking Value: Rp ${stats.avgBookingValue.toLocaleString('id-ID')}`);
  console.log(`   Top Performer: ${stats.topPerformer}\n`);

  // Create output filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  const outputFile = `out/monthly-report-${monthNames[targetMonth - 1].toLowerCase()}-${targetYear}-${timestamp}.mp4`;

  console.log("🎬 Rendering video with Remotion...");
  console.log(`   Output: ${outputFile}\n`);

  try {
    // Build the remotion render command
    const propsJson = JSON.stringify(stats);
    const command = `npx remotion render MonthlyReport ${outputFile} --props='${propsJson}'`;

    console.log("   ⏳ This may take 1-2 minutes...\n");

    // Execute the render command
    execSync(command, {
      cwd: process.cwd(),
      stdio: "inherit",
    });

    console.log(`\n✅ Video rendered successfully!`);
    console.log(`   📹 ${outputFile}\n`);
    console.log(`🎉 Monthly report video is ready to share!\n`);

  } catch (error) {
    console.error("\n❌ Error rendering video:", error.message);
    process.exit(1);
  }
}

// Main execution
async function main() {
  const stats = await fetchMonthlyData();
  await renderVideo(stats);
}

main();
