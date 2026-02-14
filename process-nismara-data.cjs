const XLSX = require('xlsx');

// Convert Excel serial date to JavaScript Date
function excelSerialToDate(serial) {
  // Excel dates are days since 1900-01-01 (with 1900 incorrectly treated as leap year)
  const excelEpoch = new Date(1899, 11, 30);
  const date = new Date(excelEpoch.getTime() + serial * 24 * 60 * 60 * 1000);
  return date;
}

// Format date as "DD Month YYYY"
function formatDate(date) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Parse date string or Excel serial
function parseDate(value) {
  if (typeof value === 'number') {
    return excelSerialToDate(value);
  }
  if (typeof value === 'string') {
    // Try to parse strings like "31 August", "1 October", "3 January"
    const parts = value.trim().split(' ');
    if (parts.length >= 2) {
      const day = parseInt(parts[0]);
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      const month = monthNames.findIndex(m => m.toLowerCase().startsWith(parts[1].toLowerCase()));
      if (month >= 0 && !isNaN(day)) {
        // Use current context year (2025 or 2026 based on sheet)
        return { day, month, needsYear: true };
      }
    }
  }
  return null;
}

// Calculate days between two dates
function daysBetween(date1, date2) {
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Main processing function
function processNismaraData() {
  const workbook = XLSX.readFile('NISMARA UMA PLAN MYHOST BIZMATE/NISMARA UMA VILLA OCCUPANCY (1).xlsx');

  const allBookings = [];
  const monthlyData = {};

  // Process 2025 sheet
  const sheet2025 = workbook.Sheets['2025'];
  const data2025 = XLSX.utils.sheet_to_json(sheet2025, { header: 1 });

  console.log('=== PROCESSING 2025 DATA ===\n');

  for (let i = 2; i < data2025.length; i++) { // Start from row 3 (index 2)
    const row = data2025[i];
    if (!row || row.length < 8) continue; // Skip empty rows

    const bookingNum = row[0];
    if (!bookingNum) continue; // Skip rows without booking number

    const guestName = row[2] || 'Unknown';
    const checkInRaw = row[3];
    const checkOutRaw = row[4];
    const pax = parseInt(row[5]) || 0;
    const roomNights = parseInt(row[6]) || 0;

    // Parse price - handle strings like "-" or empty values
    let price = 0;
    if (row[7] && typeof row[7] === 'number') {
      price = row[7];
    } else if (row[7] && typeof row[7] === 'string' && row[7] !== '-' && row[7].trim() !== '') {
      price = parseFloat(row[7].replace(/[^0-9.]/g, '')) || 0;
    }

    const bookingSource = row[8] || 'Unknown';
    const paymentStatus = row[9] || 'Unknown';

    // Parse dates
    let checkIn, checkOut;
    const checkInParsed = parseDate(checkInRaw);
    const checkOutParsed = parseDate(checkOutRaw);

    if (typeof checkInRaw === 'number') {
      checkIn = excelSerialToDate(checkInRaw);
    } else if (checkInParsed && checkInParsed.needsYear) {
      checkIn = new Date(2025, checkInParsed.month, checkInParsed.day);
    }

    if (typeof checkOutRaw === 'number') {
      checkOut = excelSerialToDate(checkOutRaw);
    } else if (checkOutParsed && checkOutParsed.needsYear) {
      // Determine year based on check-in
      const year = checkIn && checkIn.getFullYear() === 2025 && checkOutParsed.month < checkInParsed.month ? 2025 : 2025;
      checkOut = new Date(year, checkOutParsed.month, checkOutParsed.day);
    }

    const booking = {
      id: bookingNum,
      year: 2025,
      guestName: guestName.trim(),
      checkIn,
      checkOut,
      checkInStr: checkIn ? formatDate(checkIn) : checkInRaw,
      checkOutStr: checkOut ? formatDate(checkOut) : checkOutRaw,
      pax,
      roomNights,
      price,
      bookingSource: bookingSource.trim(),
      paymentStatus: paymentStatus.trim(),
      isOTA: bookingSource.toLowerCase().includes('bali buntu') ||
             bookingSource.toLowerCase().includes('airbnb') ||
             bookingSource.toLowerCase().includes('booking')
    };

    allBookings.push(booking);

    // Track monthly data
    if (checkIn) {
      const monthKey = `${checkIn.getFullYear()}-${String(checkIn.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: checkIn.toLocaleString('en-US', { month: 'short' }),
          year: checkIn.getFullYear(),
          bookings: 0,
          revenue: 0,
          roomNights: 0,
          label: `${checkIn.toLocaleString('en-US', { month: 'short' })} ${String(checkIn.getFullYear()).slice(2)}`
        };
      }
      monthlyData[monthKey].bookings++;
      monthlyData[monthKey].revenue += price;
      monthlyData[monthKey].roomNights += roomNights;
    }
  }

  console.log(`Processed ${allBookings.filter(b => b.year === 2025).length} bookings from 2025\n`);

  // Process 2026 sheet
  const sheet2026 = workbook.Sheets['2026'];
  const data2026 = XLSX.utils.sheet_to_json(sheet2026, { header: 1 });

  console.log('=== PROCESSING 2026 DATA ===\n');

  for (let i = 2; i < data2026.length; i++) {
    const row = data2026[i];
    if (!row || row.length < 8) continue;

    const bookingNum = row[0];
    if (!bookingNum) continue;

    const guestName = row[2] || 'Unknown';
    const checkInRaw = row[3];
    const checkOutRaw = row[4];
    const pax = parseInt(row[5]) || 0;
    const roomNights = parseInt(row[6]) || 0;

    // Parse price - handle strings like "-" or empty values
    let price = 0;
    if (row[7] && typeof row[7] === 'number') {
      price = row[7];
    } else if (row[7] && typeof row[7] === 'string' && row[7] !== '-' && row[7].trim() !== '') {
      price = parseFloat(row[7].replace(/[^0-9.]/g, '')) || 0;
    }

    const paymentStatus = row[8] || 'Unknown';

    // For 2026, assume booking source is OTA (we can adjust later)
    const bookingSource = 'Bali Buntu'; // Default assumption

    let checkIn, checkOut;
    const checkInParsed = parseDate(checkInRaw);
    const checkOutParsed = parseDate(checkOutRaw);

    if (typeof checkInRaw === 'number') {
      checkIn = excelSerialToDate(checkInRaw);
    } else if (checkInParsed && checkInParsed.needsYear) {
      checkIn = new Date(2026, checkInParsed.month, checkInParsed.day);
    }

    if (typeof checkOutRaw === 'number') {
      checkOut = excelSerialToDate(checkOutRaw);
    } else if (checkOutParsed && checkOutParsed.needsYear) {
      checkOut = new Date(2026, checkOutParsed.month, checkOutParsed.day);
    }

    const booking = {
      id: bookingNum,
      year: 2026,
      guestName: guestName.trim(),
      checkIn,
      checkOut,
      checkInStr: checkIn ? formatDate(checkIn) : checkInRaw,
      checkOutStr: checkOut ? formatDate(checkOut) : checkOutRaw,
      pax,
      roomNights,
      price,
      bookingSource,
      paymentStatus: paymentStatus.trim(),
      isOTA: true // Assume OTA for 2026
    };

    allBookings.push(booking);

    if (checkIn) {
      const monthKey = `${checkIn.getFullYear()}-${String(checkIn.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: checkIn.toLocaleString('en-US', { month: 'short' }),
          year: checkIn.getFullYear(),
          bookings: 0,
          revenue: 0,
          roomNights: 0,
          label: `${checkIn.toLocaleString('en-US', { month: 'short' })} ${String(checkIn.getFullYear()).slice(2)}`
        };
      }
      monthlyData[monthKey].bookings++;
      monthlyData[monthKey].revenue += price;
      monthlyData[monthKey].roomNights += roomNights;
    }
  }

  console.log(`Processed ${allBookings.filter(b => b.year === 2026).length} bookings from 2026\n`);

  // Calculate metrics
  const bookings2025 = allBookings.filter(b => b.year === 2025);
  const bookings2026 = allBookings.filter(b => b.year === 2026);

  const totalBookings = allBookings.length;
  const totalRevenue = allBookings.reduce((sum, b) => sum + b.price, 0);
  const totalRoomNights = allBookings.reduce((sum, b) => sum + b.roomNights, 0);
  const avgBookingValue = totalRevenue / totalBookings;
  const avgLengthOfStay = totalRoomNights / totalBookings;

  const revenue2025 = bookings2025.reduce((sum, b) => sum + b.price, 0);
  const revenue2026 = bookings2026.reduce((sum, b) => sum + b.price, 0);
  const roomNights2025 = bookings2025.reduce((sum, b) => sum + b.roomNights, 0);
  const roomNights2026 = bookings2026.reduce((sum, b) => sum + b.roomNights, 0);

  // Calculate OTA commission (15%)
  const otaBookings = allBookings.filter(b => b.isOTA);
  const otaRevenue = otaBookings.reduce((sum, b) => sum + b.price, 0);
  const otaCommission = otaRevenue * 0.15;

  // Calculate occupancy rates
  // Assuming 1 villa with 365 days/year
  const days2025Sept_Dec = 122; // Sept (30) + Oct (31) + Nov (30) + Dec (31) = 122 days
  const days2026Jan_Sept = 243; // Jan-Sept = 243 days

  const occupancy2025 = (roomNights2025 / days2025Sept_Dec) * 100;
  const occupancy2026 = (roomNights2026 / days2026Jan_Sept) * 100;

  // Calculate ADR (Average Daily Rate)
  const adr2025 = revenue2025 / roomNights2025;
  const adr2026 = revenue2026 / roomNights2026;

  // Booking sources breakdown
  const sourceBreakdown = {};
  allBookings.forEach(b => {
    if (!sourceBreakdown[b.bookingSource]) {
      sourceBreakdown[b.bookingSource] = { count: 0, revenue: 0 };
    }
    sourceBreakdown[b.bookingSource].count++;
    sourceBreakdown[b.bookingSource].revenue += b.price;
  });

  // Sort monthly data by date
  const sortedMonthlyData = Object.entries(monthlyData)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, value]) => value);

  // Output results
  console.log('=== KEY METRICS ===\n');
  console.log(`Total Bookings: ${totalBookings} (${bookings2025.length} in 2025 | ${bookings2026.length} in 2026)`);
  console.log(`Total Revenue: IDR ${(totalRevenue / 1000000).toFixed(1)}M (~$${(totalRevenue / 16000).toFixed(0)} USD)`);
  console.log(`Average Booking Value: IDR ${(avgBookingValue / 1000000).toFixed(1)}M (~$${(avgBookingValue / 16000).toFixed(0)} USD)`);
  console.log(`Average Length of Stay: ${avgLengthOfStay.toFixed(1)} nights`);
  console.log(`\nOTA Commission (15%): IDR ${(otaCommission / 1000000).toFixed(1)}M (~$${(otaCommission / 16000).toFixed(0)} USD)`);

  console.log('\n=== 2025 PERFORMANCE (Sept-Dec) ===\n');
  console.log(`Bookings: ${bookings2025.length}`);
  console.log(`Revenue: IDR ${(revenue2025 / 1000000).toFixed(1)}M`);
  console.log(`Room Nights: ${roomNights2025}`);
  console.log(`Occupancy Rate: ${occupancy2025.toFixed(0)}%`);
  console.log(`ADR: IDR ${(adr2025 / 1000).toFixed(0)}K/night`);

  console.log('\n=== 2026 PERFORMANCE (Jan-Sept YTD) ===\n');
  console.log(`Bookings: ${bookings2026.length}`);
  console.log(`Revenue: IDR ${(revenue2026 / 1000000).toFixed(1)}M`);
  console.log(`Room Nights: ${roomNights2026}`);
  console.log(`Occupancy Rate: ${occupancy2026.toFixed(0)}%`);
  console.log(`ADR: IDR ${(adr2026 / 1000).toFixed(0)}K/night`);

  console.log('\n=== BOOKING SOURCES ===\n');
  Object.entries(sourceBreakdown).forEach(([source, data]) => {
    const percentage = (data.count / totalBookings) * 100;
    console.log(`${source}: ${data.count} bookings (${percentage.toFixed(1)}%) | IDR ${(data.revenue / 1000000).toFixed(1)}M`);
  });

  console.log('\n=== MONTHLY BREAKDOWN ===\n');
  sortedMonthlyData.forEach(month => {
    console.log(`${month.label}: ${month.bookings} bookings | IDR ${(month.revenue / 1000000).toFixed(1)}M | ${month.roomNights} nights`);
  });

  // Generate JSON output for use in report
  const reportData = {
    metrics: {
      totalBookings,
      bookings2025: bookings2025.length,
      bookings2026: bookings2026.length,
      totalRevenue,
      totalRevenueM: (totalRevenue / 1000000).toFixed(1),
      totalRevenueUSD: (totalRevenue / 16000).toFixed(0),
      avgBookingValue,
      avgBookingValueM: (avgBookingValue / 1000000).toFixed(1),
      avgBookingValueUSD: (avgBookingValue / 16000).toFixed(0),
      avgLengthOfStay: avgLengthOfStay.toFixed(1),
      otaCommission,
      otaCommissionM: (otaCommission / 1000000).toFixed(1),
      otaCommissionUSD: (otaCommission / 16000).toFixed(0)
    },
    performance2025: {
      bookings: bookings2025.length,
      revenue: revenue2025,
      revenueM: (revenue2025 / 1000000).toFixed(1),
      roomNights: roomNights2025,
      occupancy: occupancy2025.toFixed(0),
      adr: adr2025,
      adrK: (adr2025 / 1000).toFixed(0)
    },
    performance2026: {
      bookings: bookings2026.length,
      revenue: revenue2026,
      revenueM: (revenue2026 / 1000000).toFixed(1),
      roomNights: roomNights2026,
      occupancy: occupancy2026.toFixed(0),
      adr: adr2026,
      adrK: (adr2026 / 1000).toFixed(0)
    },
    bookingSources: sourceBreakdown,
    monthlyData: sortedMonthlyData,
    bookings: allBookings
  };

  // Save to JSON file
  const fs = require('fs');
  fs.writeFileSync('nismara-report-data.json', JSON.stringify(reportData, null, 2));
  console.log('\n=== REPORT DATA SAVED ===');
  console.log('File: nismara-report-data.json');
}

// Run the processing
try {
  processNismaraData();
} catch (error) {
  console.error('Error processing data:', error);
}
