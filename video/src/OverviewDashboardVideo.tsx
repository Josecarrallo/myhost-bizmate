import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface OverviewDashboardProps {
  // Business Overview
  totalProperties: number;
  totalBookings: number;
  totalRevenue: number;

  // Performance Metrics
  occupancyRate: number;
  avgNightlyRate: number;
  avgStayDuration: number;

  // Current Status
  activeBookings: number;
  upcomingCheckIns: number;
  upcomingCheckOuts: number;

  // Reviews
  averageRating: number;
  totalReviews: number;

  // Top Performers
  topProperty?: string;
  topChannel?: string;

  // Date
  generatedDate?: string;
}

export const OverviewDashboardVideo: React.FC<OverviewDashboardProps> = ({
  totalProperties,
  totalBookings,
  totalRevenue,
  occupancyRate,
  avgNightlyRate,
  avgStayDuration,
  activeBookings,
  upcomingCheckIns,
  upcomingCheckOuts,
  averageRating,
  totalReviews,
  topProperty = "Nismara Uma Villa",
  topChannel = "Airbnb",
  generatedDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene timings (20s total = 600 frames @ 30fps)
  // Scene 1: Intro (0-120 frames = 0-4s)
  // Scene 2: Business Overview (120-240 frames = 4-8s)
  // Scene 3: Performance Metrics (240-360 frames = 8-12s)
  // Scene 4: Current Status (360-480 frames = 12-16s)
  // Scene 5: Top Performers + CTA (480-600 frames = 16-20s)

  const scene1End = 120;
  const scene2End = 240;
  const scene3End = 360;
  const scene4End = 480;
  const scene5End = 600;

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
    [0, 20, scene1End - 20, scene1End],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  const scene1Scale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 100 },
  });

  // SCENE 2: BUSINESS OVERVIEW
  const scene2Opacity = interpolate(
    frame,
    [scene1End, scene1End + 20, scene2End - 20, scene2End],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  const animatedProperties = Math.floor(
    interpolate(
      frame,
      [scene1End, scene1End + 40],
      [0, totalProperties],
      { extrapolateRight: "clamp" }
    )
  );

  const animatedBookings = Math.floor(
    interpolate(
      frame,
      [scene1End + 15, scene1End + 55],
      [0, totalBookings],
      { extrapolateRight: "clamp" }
    )
  );

  const animatedRevenue = Math.floor(
    interpolate(
      frame,
      [scene1End + 30, scene1End + 70],
      [0, totalRevenue],
      { extrapolateRight: "clamp" }
    )
  );

  // SCENE 3: PERFORMANCE METRICS
  const scene3Opacity = interpolate(
    frame,
    [scene2End, scene2End + 20, scene3End - 20, scene3End],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  const animatedOccupancy = interpolate(
    frame,
    [scene2End + 20, scene2End + 60],
    [0, occupancyRate],
    { extrapolateRight: "clamp" }
  );

  const animatedNightlyRate = Math.floor(
    interpolate(
      frame,
      [scene2End + 30, scene2End + 70],
      [0, avgNightlyRate],
      { extrapolateRight: "clamp" }
    )
  );

  const animatedStayDuration = interpolate(
    frame,
    [scene2End + 40, scene2End + 80],
    [0, avgStayDuration],
    { extrapolateRight: "clamp" }
  );

  // SCENE 4: CURRENT STATUS
  const scene4Opacity = interpolate(
    frame,
    [scene3End, scene3End + 20, scene4End - 20, scene4End],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  const scene4CardScale = spring({
    frame: frame - scene3End - 30,
    fps,
    config: { damping: 90 },
  });

  // SCENE 5: TOP PERFORMERS
  const scene5Opacity = interpolate(
    frame,
    [scene4End, scene4End + 20],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  const scene5Scale = spring({
    frame: frame - scene4End - 15,
    fps,
    config: { damping: 80 },
  });

  return (
    <AbsoluteFill>
      {/* SCENE 1: INTRO */}
      {frame < scene1End && (
        <AbsoluteFill
          style={{
            background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)",
            opacity: scene1Opacity,
          }}
        >
          <AbsoluteFill
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              transform: `scale(${scene1Scale})`,
            }}
          >
            <h1
              style={{
                fontSize: 110,
                fontWeight: "bold",
                color: "#fff",
                textAlign: "center",
                margin: 0,
                textShadow: "0 10px 40px rgba(0,0,0,0.3)",
                fontFamily: "Arial, sans-serif",
              }}
            >
              DASHBOARD OVERVIEW
            </h1>
            <p
              style={{
                fontSize: 50,
                color: "rgba(255,255,255,0.9)",
                textAlign: "center",
                margin: "30px 0 0 0",
                textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                fontFamily: "Arial, sans-serif",
              }}
            >
              MY HOST BIZMATE
            </p>
            <p
              style={{
                fontSize: 36,
                color: "rgba(255,255,255,0.8)",
                textAlign: "center",
                margin: "20px 0 0 0",
                fontFamily: "Arial, sans-serif",
              }}
            >
              {generatedDate}
            </p>
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* SCENE 2: BUSINESS OVERVIEW */}
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
              padding: "80px",
            }}
          >
            <h2
              style={{
                fontSize: 60,
                fontWeight: "bold",
                color: "#0ea5e9",
                margin: "0 0 60px 0",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Business Overview
            </h2>
            <div style={{ display: "flex", gap: "100px", justifyContent: "center" }}>
              {/* Total Properties */}
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
                  {animatedProperties}
                </p>
                <p
                  style={{
                    fontSize: 38,
                    color: "#94a3b8",
                    margin: "10px 0 0 0",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  Properties
                </p>
              </div>
              {/* Total Bookings */}
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontSize: 120,
                    fontWeight: "bold",
                    color: "#0ea5e9",
                    margin: 0,
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {animatedBookings}
                </p>
                <p
                  style={{
                    fontSize: 38,
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
                    fontSize: 120,
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
                    fontSize: 38,
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

      {/* SCENE 3: PERFORMANCE METRICS */}
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
              padding: "80px",
            }}
          >
            <h2
              style={{
                fontSize: 60,
                fontWeight: "bold",
                color: "#0ea5e9",
                margin: "0 0 60px 0",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Performance Metrics
            </h2>
            <div style={{ display: "flex", gap: "100px", justifyContent: "center" }}>
              {/* Occupancy Rate */}
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontSize: 110,
                    fontWeight: "bold",
                    color: "#f59e0b",
                    margin: 0,
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {animatedOccupancy.toFixed(1)}%
                </p>
                <p
                  style={{
                    fontSize: 36,
                    color: "#94a3b8",
                    margin: "10px 0 0 0",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  Occupancy Rate
                </p>
              </div>
              {/* Avg Nightly Rate */}
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontSize: 110,
                    fontWeight: "bold",
                    color: "#ec4899",
                    margin: 0,
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {formatCurrency(animatedNightlyRate)}
                </p>
                <p
                  style={{
                    fontSize: 36,
                    color: "#94a3b8",
                    margin: "10px 0 0 0",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  Avg Nightly Rate
                </p>
              </div>
              {/* Avg Stay Duration */}
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontSize: 110,
                    fontWeight: "bold",
                    color: "#06b6d4",
                    margin: 0,
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {animatedStayDuration.toFixed(1)}
                </p>
                <p
                  style={{
                    fontSize: 36,
                    color: "#94a3b8",
                    margin: "10px 0 0 0",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  Avg Nights/Stay
                </p>
              </div>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* SCENE 4: CURRENT STATUS */}
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
              padding: "80px",
            }}
          >
            <h2
              style={{
                fontSize: 60,
                fontWeight: "bold",
                color: "#0ea5e9",
                margin: "0 0 60px 0",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Current Status
            </h2>
            <div
              style={{
                display: "flex",
                gap: "60px",
                justifyContent: "center",
                transform: `scale(${scene4CardScale})`,
              }}
            >
              {/* Active Bookings */}
              <div
                style={{
                  background: "rgba(14, 165, 233, 0.1)",
                  border: "3px solid #0ea5e9",
                  borderRadius: "30px",
                  padding: "40px 60px",
                  textAlign: "center",
                  minWidth: "280px",
                }}
              >
                <p
                  style={{
                    fontSize: 90,
                    fontWeight: "bold",
                    color: "#0ea5e9",
                    margin: 0,
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {activeBookings}
                </p>
                <p
                  style={{
                    fontSize: 32,
                    color: "#94a3b8",
                    margin: "15px 0 0 0",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  Active Bookings
                </p>
              </div>
              {/* Upcoming Check-ins */}
              <div
                style={{
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "3px solid #10b981",
                  borderRadius: "30px",
                  padding: "40px 60px",
                  textAlign: "center",
                  minWidth: "280px",
                }}
              >
                <p
                  style={{
                    fontSize: 90,
                    fontWeight: "bold",
                    color: "#10b981",
                    margin: 0,
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {upcomingCheckIns}
                </p>
                <p
                  style={{
                    fontSize: 32,
                    color: "#94a3b8",
                    margin: "15px 0 0 0",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  Check-ins (7 days)
                </p>
              </div>
              {/* Upcoming Check-outs */}
              <div
                style={{
                  background: "rgba(245, 158, 11, 0.1)",
                  border: "3px solid #f59e0b",
                  borderRadius: "30px",
                  padding: "40px 60px",
                  textAlign: "center",
                  minWidth: "280px",
                }}
              >
                <p
                  style={{
                    fontSize: 90,
                    fontWeight: "bold",
                    color: "#f59e0b",
                    margin: 0,
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {upcomingCheckOuts}
                </p>
                <p
                  style={{
                    fontSize: 32,
                    color: "#94a3b8",
                    margin: "15px 0 0 0",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  Check-outs (7 days)
                </p>
              </div>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* SCENE 5: TOP PERFORMERS */}
      {frame >= scene4End && (
        <AbsoluteFill
          style={{
            background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)",
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
                fontSize: 60,
                fontWeight: "bold",
                color: "#fff",
                margin: "0 0 50px 0",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Top Performers
            </h2>
            <div style={{ display: "flex", gap: "80px" }}>
              {/* Top Property */}
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontSize: 42,
                    color: "rgba(255,255,255,0.8)",
                    margin: "0 0 15px 0",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  🏆 Top Property
                </p>
                <p
                  style={{
                    fontSize: 56,
                    fontWeight: "bold",
                    color: "#fff",
                    margin: 0,
                    textShadow: "0 6px 25px rgba(0,0,0,0.3)",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {topProperty}
                </p>
              </div>
              {/* Top Channel */}
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontSize: 42,
                    color: "rgba(255,255,255,0.8)",
                    margin: "0 0 15px 0",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  🌟 Top Channel
                </p>
                <p
                  style={{
                    fontSize: 56,
                    fontWeight: "bold",
                    color: "#fff",
                    margin: 0,
                    textShadow: "0 6px 25px rgba(0,0,0,0.3)",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {topChannel}
                </p>
              </div>
            </div>
            <div
              style={{
                marginTop: "70px",
                background: "rgba(255,255,255,0.2)",
                padding: "35px 70px",
                borderRadius: "45px",
                backdropFilter: "blur(10px)",
              }}
            >
              <p
                style={{
                  fontSize: 40,
                  color: "#fff",
                  margin: 0,
                  fontFamily: "Arial, sans-serif",
                  textAlign: "center",
                }}
              >
                ⭐ Avg Rating: {averageRating.toFixed(1)}/5.0 ({totalReviews} reviews)
              </p>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
