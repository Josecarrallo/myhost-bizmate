const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jjpscimtxrudtepzwhag.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0'
);

(async () => {
  const { data, error } = await supabase
    .from('bookings')
    .select('source, total_price, check_in, guest_name')
    .order('check_in', { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  console.log('=== CHANNEL STATISTICS ===\n');
  console.log(`Total bookings: ${data.length}\n`);

  const byChannel = {
    airbnb: { count: 0, revenue: 0, bookings: [] },
    'booking.com': { count: 0, revenue: 0, bookings: [] },
    gita: { count: 0, revenue: 0, bookings: [] },
    other: { count: 0, revenue: 0, bookings: [] }
  };

  data.forEach(b => {
    const source = (b.source || '').toLowerCase();
    const price = b.total_price || 0;

    if (source === 'airbnb') {
      byChannel.airbnb.count++;
      byChannel.airbnb.revenue += price;
      byChannel.airbnb.bookings.push({ guest: b.guest_name, price, date: b.check_in });
    } else if (source === 'booking.com') {
      byChannel['booking.com'].count++;
      byChannel['booking.com'].revenue += price;
      byChannel['booking.com'].bookings.push({ guest: b.guest_name, price, date: b.check_in });
    } else if (source === 'gita') {
      byChannel.gita.count++;
      byChannel.gita.revenue += price;
      byChannel.gita.bookings.push({ guest: b.guest_name, price, date: b.check_in });
    } else {
      byChannel.other.count++;
      byChannel.other.revenue += price;
      byChannel.other.bookings.push({ guest: b.guest_name, price, source, date: b.check_in });
    }
  });

  Object.keys(byChannel).forEach(channel => {
    if (byChannel[channel].count > 0) {
      console.log(`\n📊 ${channel.toUpperCase()}`);
      console.log(`   Count: ${byChannel[channel].count} bookings`);
      console.log(`   Revenue: $${byChannel[channel].revenue.toLocaleString()}`);
      console.log(`   Bookings:`);
      byChannel[channel].bookings.forEach(b => {
        console.log(`     - ${b.guest} | $${b.price.toLocaleString()} | ${b.date}${b.source ? ` (${b.source})` : ''}`);
      });
    }
  });
})();
