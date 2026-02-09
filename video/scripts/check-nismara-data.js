#!/usr/bin/env node

/**
 * VERIFICAR DATOS DE NISMARA UMA EN SUPABASE
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jjpscimtxrudtepzwhag.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNzU3NjEsImV4cCI6MjA0OTk1MTc2MX0.lRvRtH7flFQos88-q3AdW9dsJaEljPK0WZr-u4AZPug";
const GITA_TENANT_ID = "1f32d384-4018-46a9-a6f9-058217e6924a";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log(`\n🔍 VERIFICANDO DATOS DE NISMARA UMA EN SUPABASE\n`);

async function checkData() {
  try {
    // 1. Fetch all bookings for GITA in 2026
    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("*")
      .eq("tenant_id", GITA_TENANT_ID)
      .gte("check_in", "2026-01-01")
      .lte("check_in", "2026-12-31");

    if (bookingsError) {
      console.error("❌ Error fetching bookings:", bookingsError);
      return;
    }

    console.log(`✅ Found ${bookings?.length || 0} bookings in 2026\n`);

    if (!bookings || bookings.length === 0) {
      console.log("⚠️  No bookings found in Supabase for 2026!");
      console.log("\n🔧 POSIBLES CAUSAS:");
      console.log("1. Los datos están en Excel pero NO en Supabase");
      console.log("2. El tenant_id es incorrecto");
      console.log("3. Las fechas no están en formato correcto\n");
      return;
    }

    // Calculate stats
    let totalRevenue = 0;
    let totalNights = 0;
    const sources = {};

    bookings.forEach(booking => {
      // Revenue
      totalRevenue += booking.total_price || 0;

      // Nights
      if (booking.check_in && booking.check_out) {
        const checkIn = new Date(booking.check_in);
        const checkOut = new Date(booking.check_out);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        totalNights += nights;
      }

      // Sources
      const source = booking.source || "Unknown";
      if (!sources[source]) {
        sources[source] = { count: 0, revenue: 0 };
      }
      sources[source].count++;
      sources[source].revenue += booking.total_price || 0;
    });

    console.log("📊 DATOS CALCULADOS:");
    console.log(`   Total Bookings: ${bookings.length}`);
    console.log(`   Total Nights: ${totalNights}`);
    console.log(`   Total Revenue: Rp ${totalRevenue.toLocaleString('id-ID')}\n`);

    console.log("📺 BOOKING SOURCES:");
    Object.entries(sources).forEach(([source, data]) => {
      console.log(`   ${source}: ${data.count} bookings • Rp ${data.revenue.toLocaleString('id-ID')}`);
    });

    console.log("\n🔍 PRIMERAS 3 BOOKINGS:");
    bookings.slice(0, 3).forEach((b, i) => {
      console.log(`   ${i + 1}. ${b.guest_name || 'N/A'} - ${b.source || 'N/A'} - Rp ${(b.total_price || 0).toLocaleString('id-ID')}`);
    });

    console.log("\n✅ Datos encontrados en Supabase!\n");

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

checkData();
