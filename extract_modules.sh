#!/bin/bash

# Extract Payments (398-511)
sed -n '398,511p' src/App.jsx > /tmp/Payments_temp.jsx

# Extract Bookings (512-551)
sed -n '512,551p' src/App.jsx > /tmp/Bookings_temp.jsx

# Extract Messages (552-599)
sed -n '552,599p' src/App.jsx > /tmp/Messages_temp.jsx

# Extract AIAssistant (600-640)
sed -n '600,640p' src/App.jsx > /tmp/AIAssistant_temp.jsx

# Extract MultichannelIntegration (641-678)
sed -n '641,678p' src/App.jsx > /tmp/Multichannel_temp.jsx

# Extract Properties (679-866)
sed -n '679,866p' src/App.jsx > /tmp/Properties_temp.jsx

# Extract MarketingSuite (867-927)
sed -n '867,927p' src/App.jsx > /tmp/Marketing_temp.jsx

# Extract SocialPublisher (928-1021)
sed -n '928,1021p' src/App.jsx > /tmp/SocialPublisher_temp.jsx

# Extract Pricing (1022-1166)
sed -n '1022,1166p' src/App.jsx > /tmp/SmartPricing_temp.jsx

echo "Modules extracted to /tmp/*_temp.jsx"
