import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const StatsVideo: React.FC<{
  totalBookings: number;
  totalRevenue: number;
  airbnbBookings: number;
  bookingComBookings: number;
  directBookings: number;
}> = ({
  totalBookings,
  totalRevenue,
  airbnbBookings,
  bookingComBookings,
  directBookings,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Format currency
  const formatCurrency = (amount: number) => {
    return `Rp ${Math.round(amount).toLocaleString("id-ID")}`;
  };

  // Animation timings
  const titleAppear = spring({
    frame: frame - 10,
    fps,
    config: { damping: 100 },
  });

  const stat1Appear = spring({
    frame: frame - 40,
    fps,
    config: { damping: 100 },
  });

  const stat2Appear = spring({
    frame: frame - 70,
    fps,
    config: { damping: 100 },
  });

  const stat3Appear = spring({
    frame: frame - 100,
    fps,
    config: { damping: 100 },
  });

  // Counter animations
  const bookingsCount = Math.floor(
    interpolate(frame, [40, 80], [0, totalBookings], {
      extrapolateRight: "clamp",
    })
  );

  const revenueCount = Math.floor(
    interpolate(frame, [70, 110], [0, totalRevenue], {
      extrapolateRight: "clamp",
    })
  );

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: 60,
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Title */}
      <div
        style={{
          transform: `scale(${titleAppear})`,
          opacity: titleAppear,
          marginBottom: 60,
        }}
      >
        <h1
          style={{
            fontSize: 80,
            fontWeight: "bold",
            color: "#ffffff",
            margin: 0,
            textShadow: "0 4px 6px rgba(0,0,0,0.3)",
          }}
        >
          MY HOST BizMate
        </h1>
        <p
          style={{
            fontSize: 40,
            color: "#f0f0f0",
            margin: "10px 0 0 0",
          }}
        >
          Performance Overview
        </p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 40,
          marginTop: 80,
        }}
      >
        {/* Total Bookings */}
        <div
          style={{
            transform: `translateX(${interpolate(stat1Appear, [0, 1], [-100, 0])}px)`,
            opacity: stat1Appear,
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(10px)",
            borderRadius: 20,
            padding: 40,
            border: "2px solid rgba(255,255,255,0.3)",
          }}
        >
          <div style={{ fontSize: 40, color: "#ffffff", marginBottom: 10 }}>
            📊 Total Bookings
          </div>
          <div
            style={{
              fontSize: 100,
              fontWeight: "bold",
              color: "#FFD700",
            }}
          >
            {bookingsCount}
          </div>
        </div>

        {/* Total Revenue */}
        <div
          style={{
            transform: `translateX(${interpolate(stat2Appear, [0, 1], [-100, 0])}px)`,
            opacity: stat2Appear,
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(10px)",
            borderRadius: 20,
            padding: 40,
            border: "2px solid rgba(255,255,255,0.3)",
          }}
        >
          <div style={{ fontSize: 40, color: "#ffffff", marginBottom: 10 }}>
            💰 Total Revenue
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: "bold",
              color: "#4ADE80",
            }}
          >
            {formatCurrency(revenueCount)}
          </div>
        </div>

        {/* Channel Breakdown */}
        <div
          style={{
            transform: `translateY(${interpolate(stat3Appear, [0, 1], [50, 0])}px)`,
            opacity: stat3Appear,
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(10px)",
            borderRadius: 20,
            padding: 40,
            border: "2px solid rgba(255,255,255,0.3)",
          }}
        >
          <div style={{ fontSize: 40, color: "#ffffff", marginBottom: 20 }}>
            📡 Channel Distribution
          </div>
          <div
            style={{
              display: "flex",
              gap: 60,
              fontSize: 30,
              color: "#ffffff",
            }}
          >
            <div>
              <div style={{ color: "#FF8C42" }}>Airbnb</div>
              <div style={{ fontSize: 60, fontWeight: "bold" }}>
                {airbnbBookings}
              </div>
            </div>
            <div>
              <div style={{ color: "#60A5FA" }}>Booking.com</div>
              <div style={{ fontSize: 60, fontWeight: "bold" }}>
                {bookingComBookings}
              </div>
            </div>
            <div>
              <div style={{ color: "#34D399" }}>Direct</div>
              <div style={{ fontSize: 60, fontWeight: "bold" }}>
                {directBookings}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
