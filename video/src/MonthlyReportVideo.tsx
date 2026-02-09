import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface MonthlyReportProps {
  month: string;
  year: number;
  totalBookings: number;
  totalRevenue: number;
  airbnbBookings: number;
  airbnbRevenue: number;
  bookingComBookings: number;
  bookingComRevenue: number;
  directBookings: number;
  directRevenue: number;
  occupancyRate: number;
  avgBookingValue: number;
  topPerformer?: string;
}

export const MonthlyReportVideo: React.FC<MonthlyReportProps> = ({
  month,
  year,
  totalBookings,
  totalRevenue,
  airbnbBookings,
  airbnbRevenue,
  bookingComBookings,
  bookingComRevenue,
  directBookings,
  directRevenue,
  occupancyRate,
  avgBookingValue,
  topPerformer = "Nismara Uma Villa",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene timings (45s total = 1350 frames @ 30fps)
  // Scene 1: Intro + Month (0-300 frames = 0-10s)
  // Scene 2: Total Stats (300-600 frames = 10-20s)
  // Scene 3: Channel Breakdown (600-900 frames = 20-30s)
  // Scene 4: Performance Metrics (900-1200 frames = 30-40s)
  // Scene 5: Top Performer + CTA (1200-1350 frames = 40-45s)

  const scene1End = 300;
  const scene2End = 600;
  const scene3End = 900;
  const scene4End = 1200;
  const scene5End = 1350;

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)}M`;
    }
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  // SCENE 1: INTRO
  const scene1Opacity = interpolate(
    frame,
    [0, 30, scene1End - 30, scene1End],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  const scene1TitleScale = spring({
    frame: frame - 20,
    fps,
    config: { damping: 100 },
  });

  const scene1MonthY = interpolate(
    frame,
    [60, 120],
    [100, 0],
    { extrapolateRight: "clamp" }
  );

  // SCENE 2: TOTAL STATS
  const scene2Opacity = interpolate(
    frame,
    [scene1End, scene1End + 30, scene2End - 30, scene2End],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  const animatedBookings = Math.floor(
    interpolate(
      frame,
      [scene1End, scene1End + 90],
      [0, totalBookings],
      { extrapolateRight: "clamp" }
    )
  );

  const animatedRevenue = Math.floor(
    interpolate(
      frame,
      [scene1End + 30, scene1End + 120],
      [0, totalRevenue],
      { extrapolateRight: "clamp" }
    )
  );

  // SCENE 3: CHANNEL BREAKDOWN
  const scene3Opacity = interpolate(
    frame,
    [scene2End, scene2End + 30, scene3End - 30, scene3End],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  const airbnbWidth = interpolate(
    frame,
    [scene2End + 40, scene2End + 100],
    [0, (airbnbBookings / totalBookings) * 100],
    { extrapolateRight: "clamp" }
  );

  const bookingComWidth = interpolate(
    frame,
    [scene2End + 70, scene2End + 130],
    [0, (bookingComBookings / totalBookings) * 100],
    { extrapolateRight: "clamp" }
  );

  const directWidth = interpolate(
    frame,
    [scene2End + 100, scene2End + 160],
    [0, (directBookings / totalBookings) * 100],
    { extrapolateRight: "clamp" }
  );

  // SCENE 4: PERFORMANCE METRICS
  const scene4Opacity = interpolate(
    frame,
    [scene3End, scene3End + 30, scene4End - 30, scene4End],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  const occupancyArc = interpolate(
    frame,
    [scene3End + 40, scene3End + 120],
    [0, occupancyRate],
    { extrapolateRight: "clamp" }
  );

  // SCENE 5: TOP PERFORMER + CTA
  const scene5Opacity = interpolate(
    frame,
    [scene4End, scene4End + 30],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  const scene5Scale = spring({
    frame: frame - scene4End - 20,
    fps,
    config: { damping: 80 },
  });

  return (
    <AbsoluteFill>
      {/* SCENE 1: INTRO */}
      {frame < scene1End && (
        <AbsoluteFill
          style={{
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)",
            opacity: scene1Opacity,
          }}
        >
          <AbsoluteFill
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ transform: `scale(${scene1TitleScale})` }}>
              <h1
                style={{
                  fontSize: 100,
                  fontWeight: "bold",
                  color: "#fff",
                  textAlign: "center",
                  margin: 0,
                  textShadow: "0 10px 40px rgba(0,0,0,0.3)",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                MY HOST BIZMATE
              </h1>
              <p
                style={{
                  fontSize: 48,
                  color: "rgba(255,255,255,0.9)",
                  textAlign: "center",
                  margin: "20px 0 0 0",
                  textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                Monthly Performance Report
              </p>
            </div>
            <div
              style={{
                marginTop: "80px",
                transform: `translateY(${scene1MonthY}px)`,
              }}
            >
              <h2
                style={{
                  fontSize: 120,
                  fontWeight: "bold",
                  color: "#fff",
                  textAlign: "center",
                  margin: 0,
                  textShadow: "0 8px 30px rgba(0,0,0,0.4)",
                  fontFamily: "Arial, sans-serif",
                  letterSpacing: "4px",
                }}
              >
                {month.toUpperCase()} {year}
              </h2>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* SCENE 2: TOTAL STATS */}
      {frame >= scene1End && frame < scene2End && (
        <AbsoluteFill
          style={{
            background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
            opacity: scene2Opacity,
          }}
        >
          <AbsoluteFill
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "100px",
            }}
          >
            <h2
              style={{
                fontSize: 70,
                fontWeight: "bold",
                color: "#f59e0b",
                margin: "0 0 80px 0",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Overall Performance
            </h2>
            <div style={{ display: "flex", gap: "120px" }}>
              {/* Total Bookings */}
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontSize: 140,
                    fontWeight: "bold",
                    color: "#fff",
                    margin: 0,
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {animatedBookings}
                </p>
                <p
                  style={{
                    fontSize: 40,
                    color: "#94a3b8",
                    margin: "10px 0 0 0",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  Total Bookings
                </p>
              </div>
              {/* Total Revenue */}
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontSize: 140,
                    fontWeight: "bold",
                    color: "#10b981",
                    margin: 0,
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {formatCurrency(animatedRevenue)}
                </p>
                <p
                  style={{
                    fontSize: 40,
                    color: "#94a3b8",
                    margin: "10px 0 0 0",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  Total Revenue
                </p>
              </div>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* SCENE 3: CHANNEL BREAKDOWN */}
      {frame >= scene2End && frame < scene3End && (
        <AbsoluteFill
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            opacity: scene3Opacity,
          }}
        >
          <AbsoluteFill
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "100px",
            }}
          >
            <h2
              style={{
                fontSize: 70,
                fontWeight: "bold",
                color: "#f59e0b",
                margin: "0 0 80px 0",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Channel Breakdown
            </h2>
            <div style={{ width: "80%", display: "flex", flexDirection: "column", gap: "50px" }}>
              {/* Airbnb */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                  <span style={{ fontSize: 38, color: "#fff", fontFamily: "Arial, sans-serif" }}>
                    Airbnb
                  </span>
                  <span style={{ fontSize: 38, color: "#fff", fontFamily: "Arial, sans-serif" }}>
                    {airbnbBookings} bookings • {formatCurrency(airbnbRevenue)}
                  </span>
                </div>
                <div style={{ background: "#334155", height: "50px", borderRadius: "25px", overflow: "hidden" }}>
                  <div
                    style={{
                      background: "linear-gradient(90deg, #ff385c, #e31c5f)",
                      height: "100%",
                      width: `${airbnbWidth}%`,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
              {/* Booking.com */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                  <span style={{ fontSize: 38, color: "#fff", fontFamily: "Arial, sans-serif" }}>
                    Booking.com
                  </span>
                  <span style={{ fontSize: 38, color: "#fff", fontFamily: "Arial, sans-serif" }}>
                    {bookingComBookings} bookings • {formatCurrency(bookingComRevenue)}
                  </span>
                </div>
                <div style={{ background: "#334155", height: "50px", borderRadius: "25px", overflow: "hidden" }}>
                  <div
                    style={{
                      background: "linear-gradient(90deg, #003580, #0057b8)",
                      height: "100%",
                      width: `${bookingComWidth}%`,
                    }}
                  />
                </div>
              </div>
              {/* Direct */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                  <span style={{ fontSize: 38, color: "#fff", fontFamily: "Arial, sans-serif" }}>
                    Direct Bookings
                  </span>
                  <span style={{ fontSize: 38, color: "#fff", fontFamily: "Arial, sans-serif" }}>
                    {directBookings} bookings • {formatCurrency(directRevenue)}
                  </span>
                </div>
                <div style={{ background: "#334155", height: "50px", borderRadius: "25px", overflow: "hidden" }}>
                  <div
                    style={{
                      background: "linear-gradient(90deg, #10b981, #059669)",
                      height: "100%",
                      width: `${directWidth}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* SCENE 4: PERFORMANCE METRICS */}
      {frame >= scene3End && frame < scene4End && (
        <AbsoluteFill
          style={{
            background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
            opacity: scene4Opacity,
          }}
        >
          <AbsoluteFill
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "100px",
            }}
          >
            <h2
              style={{
                fontSize: 70,
                fontWeight: "bold",
                color: "#f59e0b",
                margin: "0 0 80px 0",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Key Metrics
            </h2>
            <div style={{ display: "flex", gap: "150px" }}>
              {/* Occupancy Rate */}
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontSize: 120,
                    fontWeight: "bold",
                    color: "#3b82f6",
                    margin: 0,
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {occupancyArc.toFixed(1)}%
                </p>
                <p
                  style={{
                    fontSize: 40,
                    color: "#94a3b8",
                    margin: "10px 0 0 0",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  Occupancy Rate
                </p>
              </div>
              {/* Avg Booking Value */}
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontSize: 120,
                    fontWeight: "bold",
                    color: "#8b5cf6",
                    margin: 0,
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {formatCurrency(avgBookingValue)}
                </p>
                <p
                  style={{
                    fontSize: 40,
                    color: "#94a3b8",
                    margin: "10px 0 0 0",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  Avg Booking Value
                </p>
              </div>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* SCENE 5: TOP PERFORMER + CTA */}
      {frame >= scene4End && (
        <AbsoluteFill
          style={{
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)",
            opacity: scene5Opacity,
          }}
        >
          <AbsoluteFill
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              transform: `scale(${scene5Scale})`,
            }}
          >
            <h2
              style={{
                fontSize: 70,
                fontWeight: "bold",
                color: "#fff",
                margin: "0 0 40px 0",
                fontFamily: "Arial, sans-serif",
              }}
            >
              🏆 Top Performer
            </h2>
            <p
              style={{
                fontSize: 90,
                fontWeight: "bold",
                color: "#fff",
                margin: 0,
                textShadow: "0 8px 30px rgba(0,0,0,0.3)",
                fontFamily: "Arial, sans-serif",
              }}
            >
              {topPerformer}
            </p>
            <div
              style={{
                marginTop: "100px",
                background: "rgba(255,255,255,0.2)",
                padding: "40px 80px",
                borderRadius: "50px",
                backdropFilter: "blur(10px)",
              }}
            >
              <p
                style={{
                  fontSize: 42,
                  color: "#fff",
                  margin: 0,
                  fontFamily: "Arial, sans-serif",
                  textAlign: "center",
                }}
              >
                Keep up the excellent work! 🎉
              </p>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
