#!/usr/bin/env node

/**
 * OVERVIEW DASHBOARD VIDEO RENDERER - MY HOST BIZMATE
 *
 * Este script:
 * 1. Obtiene datos completos del dashboard de Supabase
 * 2. Calcula todas las métricas del overview
 * 3. Genera video del dashboard con Remotion
 *
 * Uso:
 *   node scripts/render-overview.js
 */

import { execSync } from "child_process";
import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const SUPABASE_URL = "https://jjpscimtxrudtepzwhag.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNzU3NjEsImV4cCI6MjA0OTk1MTc2MX0.lRvRtH7flFQos88-q3AdW9dsJaEljPK0WZr-u4AZPug";
const GITA_TENANT_ID = "1f32d384-4018-46a9-a6f9-058217e6924a";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log(`\n🎬 OVERVIEW DASHBOARD VIDEO RENDERER\n`);

async function fetchOverviewData() {
  try {
    console.log("📊 Fetching overview data from Supabase...\n");

    // 1. Fetch all properties
    const { data: properties, error: propsError } = await supabase
      .from("properties")
      .select("*")
      .eq("tenant_id", GITA_TENANT_ID);

    if (propsError) {
      console.error("❌ Error fetching properties:", propsError);
      return getDemoData();
    }

    console.log(`   ✅ Found ${properties?.length || 0} properties`);

    // 2. Fetch all bookings (all-time)
    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("*")
      .eq("tenant_id", GITA_TENANT_ID);

    if (bookingsError) {
      console.error("❌ Error fetching bookings:", bookingsError);
      return getDemoData();
    }

    console.log(`   ✅ Found ${bookings?.length || 0} bookings\n`);

    // 3. Calculate overview stats
    const stats = calculateOverviewStats(properties || [], bookings || []);

    return stats;
  } catch (error) {
    console.error("❌ Error:", error);
    console.log("   Using demo data instead...\n");
    return getDemoData();
  }
}

function calculateOverviewStats(properties, bookings) {
  const now = new Date();
  const sevenDaysFromNow = new Date(now);
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  const stats = {
    // Business Overview
    totalProperties: properties.length,
    totalBookings: bookings.length,
    totalRevenue: 0,

    // Performance Metrics
    occupancyRate: 0,
    avgNightlyRate: 0,
    avgStayDuration: 0,

    // Current Status
    activeBookings: 0,
    upcomingCheckIns: 0,
    upcomingCheckOuts: 0,

    // Reviews (placeholder - would come from reviews table)
    averageRating: 4.8,
    totalReviews: 0,

    // Top Performers
    topProperty: "Nismara Uma Villa",
    topChannel: "Airbnb",

    // Date
    generatedDate: now.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }),
  };

  // Calculate revenue and other metrics
  let totalNights = 0;
  const propertyCounts = {};
  const channelCounts = {};

  bookings.forEach((booking) => {
    const price = booking.total_price || 0;
    const source = (booking.source || "").toLowerCase();
    const propName = booking.property_name || "Unknown";
    const status = (booking.status || "").toLowerCase();

    // Total revenue
    stats.totalRevenue += price;

    // Calculate nights
    if (booking.check_in && booking.check_out) {
      const checkIn = new Date(booking.check_in);
      const checkOut = new Date(booking.check_out);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      totalNights += nights;
    }

    // Property counts
    propertyCounts[propName] = (propertyCounts[propName] || 0) + 1;

    // Channel counts
    if (source === "airbnb") {
      channelCounts["Airbnb"] = (channelCounts["Airbnb"] || 0) + 1;
    } else if (source === "booking.com") {
      channelCounts["Booking.com"] = (channelCounts["Booking.com"] || 0) + 1;
    } else if (source === "gita" || source === "direct") {
      channelCounts["Direct"] = (channelCounts["Direct"] || 0) + 1;
    } else {
      channelCounts["Other"] = (channelCounts["Other"] || 0) + 1;
    }

    // Active bookings (status = confirmed, checked_in)
    if (status === "confirmed" || status === "checked_in") {
      stats.activeBookings++;
    }

    // Upcoming check-ins (next 7 days)
    if (booking.check_in) {
      const checkIn = new Date(booking.check_in);
      if (checkIn >= now && checkIn <= sevenDaysFromNow) {
        stats.upcomingCheckIns++;
      }
    }

    // Upcoming check-outs (next 7 days)
    if (booking.check_out) {
      const checkOut = new Date(booking.check_out);
      if (checkOut >= now && checkOut <= sevenDaysFromNow) {
        stats.upcomingCheckOuts++;
      }
    }
  });

  // Calculate averages
  if (bookings.length > 0) {
    stats.avgNightlyRate = Math.floor(stats.totalRevenue / totalNights);
    stats.avgStayDuration = totalNights / bookings.length;
  }

  // Calculate occupancy rate (simplified)
  if (properties.length > 0) {
    const totalPossibleNights = properties.length * 365; // Assume 365 days/year
    stats.occupancyRate = (totalNights / totalPossibleNights) * 100;
  }

  // Determine top property
  const topProp = Object.entries(propertyCounts).sort((a, b) => b[1] - a[1])[0];
  if (topProp) {
    stats.topProperty = topProp[0];
  }

  // Determine top channel
  const topChan = Object.entries(channelCounts).sort((a, b) => b[1] - a[1])[0];
  if (topChan) {
    stats.topChannel = topChan[0];
  }

  // Total reviews (would come from reviews table in real implementation)
  stats.totalReviews = Math.floor(bookings.length * 0.7); // Estimate 70% review rate

  return stats;
}

function getDemoData() {
  return {
    totalProperties: 12,
    totalBookings: 156,
    totalRevenue: 540000000,
    occupancyRate: 72.3,
    avgNightlyRate: 3500000,
    avgStayDuration: 4.2,
    activeBookings: 18,
    upcomingCheckIns: 8,
    upcomingCheckOuts: 6,
    averageRating: 4.8,
    totalReviews: 109,
    topProperty: "Nismara Uma Villa",
    topChannel: "Airbnb",
    generatedDate: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }),
  };
}

async function renderVideo(stats) {
  console.log("📊 Overview Statistics:");
  console.log(`   Total Properties: ${stats.totalProperties}`);
  console.log(`   Total Bookings: ${stats.totalBookings}`);
  console.log(`   Total Revenue: Rp ${stats.totalRevenue.toLocaleString('id-ID')}`);
  console.log(`   Occupancy Rate: ${stats.occupancyRate.toFixed(1)}%`);
  console.log(`   Avg Nightly Rate: Rp ${stats.avgNightlyRate.toLocaleString('id-ID')}`);
  console.log(`   Avg Stay Duration: ${stats.avgStayDuration.toFixed(1)} nights`);
  console.log(`   Active Bookings: ${stats.activeBookings}`);
  console.log(`   Upcoming Check-ins (7 days): ${stats.upcomingCheckIns}`);
  console.log(`   Upcoming Check-outs (7 days): ${stats.upcomingCheckOuts}`);
  console.log(`   Average Rating: ${stats.averageRating}/5.0 (${stats.totalReviews} reviews)`);
  console.log(`   Top Property: ${stats.topProperty}`);
  console.log(`   Top Channel: ${stats.topChannel}\n`);

  // Create output filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  const outputFile = `out/overview-dashboard-${timestamp}.mp4`;

  console.log("🎬 Rendering video with Remotion...");
  console.log(`   Output: ${outputFile}\n`);

  try {
    // Build the remotion render command
    const propsJson = JSON.stringify(stats);
    const command = `npx remotion render OverviewDashboard ${outputFile} --props='${propsJson}'`;

    console.log("   ⏳ This may take 30-45 seconds...\n");

    // Execute the render command
    execSync(command, {
      cwd: process.cwd(),
      stdio: "inherit",
    });

    console.log(`\n✅ Video rendered successfully!`);
    console.log(`   📹 ${outputFile}\n`);
    console.log(`🎉 Overview dashboard video is ready to share!\n`);

  } catch (error) {
    console.error("\n❌ Error rendering video:", error.message);
    process.exit(1);
  }
}

// Main execution
async function main() {
  const stats = await fetchOverviewData();
  await renderVideo(stats);
}

main();
