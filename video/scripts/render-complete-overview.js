#!/usr/bin/env node

/**
 * COMPLETE OVERVIEW VIDEO RENDERER - MY HOST BIZMATE
 *
 * Genera video completo de 60s con TODAS las secciones:
 * - Revenue & Performance Analysis
 * - Performance Overview
 * - Revenue & Occupancy Timeline
 * - Properties Performance
 * - Booking Sources
 * - Payment Status
 */

import { execSync } from "child_process";
import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "fs";

const SUPABASE_URL = "https://jjpscimtxrudtepzwhag.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNzU3NjEsImV4cCI6MjA0OTk1MTc2MX0.lRvRtH7flFQos88-q3AdW9dsJaEljPK0WZr-u4AZPug";
const GITA_TENANT_ID = "1f32d384-4018-46a9-a6f9-058217e6924a";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log(`\n🎬 COMPLETE OVERVIEW VIDEO RENDERER\n`);
console.log(`📊 Fetching ALL data from Supabase for GITA...\n`);

async function fetchCompleteData() {
  try {
    // 1. Fetch all bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("*")
      .eq("tenant_id", GITA_TENANT_ID);

    if (bookingsError) {
      console.error("❌ Error fetching bookings:", bookingsError);
      return getDemoData();
    }

    console.log(`✅ Found ${bookings?.length || 0} bookings`);

    // 2. Fetch all properties
    const { data: properties, error: propsError } = await supabase
      .from("properties")
      .select("*")
      .eq("tenant_id", GITA_TENANT_ID);

    if (propsError) {
      console.error("❌ Error fetching properties:", propsError);
    }

    console.log(`✅ Found ${properties?.length || 0} properties\n`);

    if (!bookings || bookings.length === 0) {
      console.log("⚠️  No bookings found. Using demo data...\n");
      return getDemoData();
    }

    // 3. Calculate all metrics
    const stats = calculateCompleteStats(bookings, properties || []);

    return stats;
  } catch (error) {
    console.error("❌ Error:", error);
    return getDemoData();
  }
}

function calculateCompleteStats(bookings, properties) {
  const stats = {
    // Revenue & Performance Analysis
    totalRevenue: 0,
    totalBookings: bookings.length,
    avgBookingValue: 0,
    revenueGrowth: 12.5, // Placeholder

    // Performance Overview
    occupancyRate: 0,
    avgNightlyRate: 0,
    avgStayDuration: 0,
    totalNights: 0,

    // Timeline (monthly data - last 6 months)
    monthlyRevenue: [],
    monthlyOccupancy: [],

    // Properties Performance (top 3)
    topProperties: [],

    // Booking Sources
    airbnbBookings: 0,
    airbnbRevenue: 0,
    bookingComBookings: 0,
    bookingComRevenue: 0,
    directBookings: 0,
    directRevenue: 0,

    // Payment Status
    pendingPayments: 0,
    completedPayments: 0,
    failedPayments: 0,
    pendingAmount: 0,
    completedAmount: 0,

    // Meta
    generatedDate: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }),
  };

  // Process each booking
  const propertyStats = {};

  bookings.forEach((booking) => {
    const price = booking.total_price || 0;
    const source = (booking.source || "").toLowerCase();
    const propName = booking.property_name || "Unknown Property";
    const paymentStatus = (booking.payment_status || "").toLowerCase();

    // Total revenue
    stats.totalRevenue += price;

    // Calculate nights
    if (booking.check_in && booking.check_out) {
      const checkIn = new Date(booking.check_in);
      const checkOut = new Date(booking.check_out);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      if (nights > 0) {
        stats.totalNights += nights;
      }
    }

    // Booking sources
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

    // Payment status
    if (paymentStatus === "pending") {
      stats.pendingPayments++;
      stats.pendingAmount += price;
    } else if (paymentStatus === "completed" || paymentStatus === "paid") {
      stats.completedPayments++;
      stats.completedAmount += price;
    } else if (paymentStatus === "failed") {
      stats.failedPayments++;
    }

    // Property stats
    if (!propertyStats[propName]) {
      propertyStats[propName] = {
        name: propName,
        bookings: 0,
        revenue: 0,
        nights: 0,
      };
    }
    propertyStats[propName].bookings++;
    propertyStats[propName].revenue += price;
  });

  // Calculate averages
  if (stats.totalBookings > 0) {
    stats.avgBookingValue = Math.floor(stats.totalRevenue / stats.totalBookings);
  }

  if (stats.totalNights > 0) {
    stats.avgNightlyRate = Math.floor(stats.totalRevenue / stats.totalNights);
    stats.avgStayDuration = stats.totalNights / stats.totalBookings;
  }

  // Calculate occupancy rate
  if (properties.length > 0 && stats.totalNights > 0) {
    const totalPossibleNights = properties.length * 365;
    stats.occupancyRate = (stats.totalNights / totalPossibleNights) * 100;
  }

  // Top properties (sorted by bookings)
  stats.topProperties = Object.values(propertyStats)
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 3)
    .map(prop => ({
      name: prop.name,
      bookings: prop.bookings,
      revenue: prop.revenue,
      occupancy: ((prop.nights || prop.bookings * 4) / 365) * 100, // Estimate
    }));

  // Fill with placeholders if less than 3 properties
  while (stats.topProperties.length < 3) {
    stats.topProperties.push({
      name: `Property ${stats.topProperties.length + 1}`,
      bookings: 0,
      revenue: 0,
      occupancy: 0,
    });
  }

  // Monthly timeline (placeholder - would need month-by-month query)
  stats.monthlyRevenue = [0, 0, 0, 0, 0, 0];
  stats.monthlyOccupancy = [0, 0, 0, 0, 0, 0];

  return stats;
}

function getDemoData() {
  return {
    totalRevenue: 140709985,
    totalBookings: 41,
    avgBookingValue: 3431951,
    revenueGrowth: 12.5,
    occupancyRate: 68.3,
    avgNightlyRate: 3500000,
    avgStayDuration: 4.2,
    totalNights: 172,
    monthlyRevenue: [20000000, 22000000, 25000000, 23000000, 24000000, 26709985],
    monthlyOccupancy: [65, 68, 72, 69, 70, 68.3],
    topProperties: [
      { name: "Nismara Uma Villa", bookings: 25, revenue: 87500000, occupancy: 75.2 },
      { name: "Graha Uma Villa", bookings: 10, revenue: 35000000, occupancy: 60.5 },
      { name: "Villa Serenity", bookings: 6, revenue: 18209985, occupancy: 45.8 },
    ],
    airbnbBookings: 34,
    airbnbRevenue: 103701906,
    bookingComBookings: 3,
    bookingComRevenue: 21008079,
    directBookings: 3,
    directRevenue: 16000000,
    pendingPayments: 3,
    completedPayments: 35,
    failedPayments: 3,
    pendingAmount: 12000000,
    completedAmount: 128709985,
    generatedDate: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }),
  };
}

async function renderVideo(stats) {
  console.log("📊 COMPLETE OVERVIEW STATISTICS:\n");
  console.log("=== REVENUE & PERFORMANCE ===");
  console.log(`   Total Revenue: Rp ${stats.totalRevenue.toLocaleString('id-ID')}`);
  console.log(`   Total Bookings: ${stats.totalBookings}`);
  console.log(`   Avg Booking Value: Rp ${stats.avgBookingValue.toLocaleString('id-ID')}`);
  console.log(`   Revenue Growth: ${stats.revenueGrowth}%\n`);

  console.log("=== PERFORMANCE OVERVIEW ===");
  console.log(`   Occupancy Rate: ${stats.occupancyRate.toFixed(1)}%`);
  console.log(`   Avg Nightly Rate: Rp ${stats.avgNightlyRate.toLocaleString('id-ID')}`);
  console.log(`   Avg Stay Duration: ${stats.avgStayDuration.toFixed(1)} nights`);
  console.log(`   Total Nights: ${stats.totalNights}\n`);

  console.log("=== BOOKING SOURCES ===");
  console.log(`   Airbnb: ${stats.airbnbBookings} bookings • Rp ${stats.airbnbRevenue.toLocaleString('id-ID')}`);
  console.log(`   Booking.com: ${stats.bookingComBookings} bookings • Rp ${stats.bookingComRevenue.toLocaleString('id-ID')}`);
  console.log(`   Direct: ${stats.directBookings} bookings • Rp ${stats.directRevenue.toLocaleString('id-ID')}\n`);

  console.log("=== PROPERTIES PERFORMANCE ===");
  stats.topProperties.forEach((prop, i) => {
    console.log(`   ${i + 1}. ${prop.name}: ${prop.bookings} bookings • Rp ${prop.revenue.toLocaleString('id-ID')}`);
  });
  console.log();

  console.log("=== PAYMENT STATUS ===");
  console.log(`   Completed: ${stats.completedPayments} (Rp ${stats.completedAmount.toLocaleString('id-ID')})`);
  console.log(`   Pending: ${stats.pendingPayments} (Rp ${stats.pendingAmount.toLocaleString('id-ID')})`);
  console.log(`   Failed: ${stats.failedPayments}\n`);

  const timestamp = new Date().toISOString().split('T')[0];
  const outputFile = `out/complete-overview-${timestamp}.mp4`;

  console.log("🎬 Rendering complete overview video (60 seconds)...");
  console.log(`   Output: ${outputFile}\n`);

  try {
    // Write props to temp file (Windows-friendly)
    const propsFile = "temp-props.json";
    writeFileSync(propsFile, JSON.stringify(stats, null, 2));

    const command = `npx remotion render CompleteOverview ${outputFile} --props=${propsFile}`;

    console.log("   ⏳ This may take 1-2 minutes...\n");

    execSync(command, {
      cwd: process.cwd(),
      stdio: "inherit",
    });

    // Clean up temp file
    try {
      execSync(`del ${propsFile}`, { cwd: process.cwd() });
    } catch (e) {
      // Ignore cleanup errors
    }

    console.log(`\n✅ Video rendered successfully!`);
    console.log(`   📹 ${outputFile}\n`);
    console.log(`🎉 Complete overview video is ready!\n`);

  } catch (error) {
    console.error("\n❌ Error rendering video:", error.message);
    process.exit(1);
  }
}

async function main() {
  const stats = await fetchCompleteData();
  await renderVideo(stats);
}

main();
