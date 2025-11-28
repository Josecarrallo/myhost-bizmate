#!/bin/bash

# Extract AITripPlanner (1167-1330)
sed -n '1167,1330p' src/App.jsx > /tmp/AITripPlanner_temp.jsx

# Extract BookingsReservationsWorkflow (1331-1602)
sed -n '1331,1602p' src/App.jsx > /tmp/BookingWorkflow_temp.jsx

# Extract ReportsInsights (1603-2037)
sed -n '1603,2037p' src/App.jsx > /tmp/Reports_temp.jsx

# Extract DigitalCheckIn (2038-2215)
sed -n '2038,2215p' src/App.jsx > /tmp/DigitalCheckIn_temp.jsx

# Extract RMSIntegration (2216-2351)
sed -n '2216,2351p' src/App.jsx > /tmp/RMSIntegration_temp.jsx

# Extract ReviewsReputation (2352-2530)
sed -n '2352,2530p' src/App.jsx > /tmp/Reviews_temp.jsx

# Extract OperationsHub (2531-2613)
sed -n '2531,2613p' src/App.jsx > /tmp/Operations_temp.jsx

# Extract VoiceAIAgent (2614-2959)
sed -n '2614,2959p' src/App.jsx > /tmp/VoiceAI_temp.jsx

# Extract BookingEngineWidget (2960-3413)
sed -n '2960,3413p' src/App.jsx > /tmp/BookingEngine_temp.jsx

# Extract PMSCalendar (3414-3837)
sed -n '3414,3837p' src/App.jsx > /tmp/PMSCalendar_temp.jsx

echo "All remaining modules extracted"
