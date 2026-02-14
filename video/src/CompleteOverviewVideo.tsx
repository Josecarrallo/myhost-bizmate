import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

interface PropertyPerformance {
  name: string;
  bookings: number;
  revenue: number;
  occupancy: number;
}

interface CompleteOverviewProps {
  // Revenue & Performance Analysis
  totalRevenue: number;
  totalBookings: number;
  avgBookingValue: number;
  revenueGrowth: number;

  // Performance Overview
  occupancyRate: number;
  avgNightlyRate: number;
  avgStayDuration: number;
  totalNights: number;

  // Revenue & Occupancy Timeline (simplified - monthly data)
  monthlyRevenue: number[];
  monthlyOccupancy: number[];

  // Properties Performance (top 3)
  topProperties: PropertyPerformance[];

  // Booking Sources
  airbnbBookings: number;
  airbnbRevenue: number;
  bookingComBookings: number;
  bookingComRevenue: number;
  directBookings: number;
  directRevenue: number;

  // Payment Status
  pendingPayments: number;
  completedPayments: number;
  failedPayments: number;
  pendingAmount: number;
  completedAmount: number;

  // Meta
  generatedDate: string;
}

export const CompleteOverviewVideo: React.FC<CompleteOverviewProps> = ({
  totalRevenue,
  totalBookings,
  avgBookingValue,
  revenueGrowth,
  occupancyRate,
  avgNightlyRate,
  avgStayDuration,
  totalNights,
  monthlyRevenue,
  monthlyOccupancy,
  topProperties,
  airbnbBookings,
  airbnbRevenue,
  bookingComBookings,
  bookingComRevenue,
  directBookings,
  directRevenue,
  pendingPayments,
  completedPayments,
  failedPayments,
  pendingAmount,
  completedAmount,
  generatedDate,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ensure topProperties has at least 3 items (fill with placeholders if needed)
  const safeTopProperties = [...topProperties];
  while (safeTopProperties.length < 3) {
    safeTopProperties.push({
      name: `Property ${safeTopProperties.length + 1}`,
      bookings: 0,
      revenue: 0,
      occupancy: 0
    });
  }

  // Scene timings (60s total = 1800 frames @ 30fps)
  // Scene 1: Intro (0-150 = 0-5s)
  // Scene 2: Revenue & Performance Analysis (150-390 = 5-13s)
  // Scene 2.5: Performance Chart (390-570 = 13-19s) ← NEW SCENE
  // Scene 3: Booking Sources (570-810 = 19-27s)
  // Scene 4: Properties Performance (810-1050 = 27-35s)
  // Scene 5: Payment Status (1050-1290 = 35-43s)
  // Scene 6: Timeline Preview (1290-1530 = 43-51s)
  // Scene 7: Summary & CTA (1530-1800 = 51-60s)

  const scene1End = 150;
  const scene2End = 390;      // Shortened from 450 to 390
  const scene2_5End = 570;    // NEW: Performance Chart scene (6 seconds)
  const scene3End = 810;      // Adjusted from 750
  const scene4End = 1050;     // Kept same
  const scene5End = 1290;     // Adjusted from 1350
  const scene6End = 1530;     // Adjusted from 1650
  const scene7End = 1800;     // Kept same

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

  // SCENE 2: REVENUE & PERFORMANCE
  const scene2Opacity = interpolate(
    frame,
    [scene1End, scene1End + 20, scene2End - 20, scene2End],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  const animatedRevenue = Math.floor(
    interpolate(
      frame,
      [scene1End, scene1End + 80],
      [0, totalRevenue],
      { extrapolateRight: "clamp" }
    )
  );

  const animatedBookings = Math.floor(
    interpolate(
      frame,
      [scene1End + 20, scene1End + 100],
      [0, totalBookings],
      { extrapolateRight: "clamp" }
    )
  );

  // SCENE 2.5: PERFORMANCE CHART (NEW)
  const scene2_5Opacity = interpolate(
    frame,
    [scene2End, scene2End + 20, scene2_5End - 20, scene2_5End],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  const chartScale = spring({
    frame: frame - scene2End - 10,
    fps,
    config: { damping: 100 },
  });

  // SCENE 3: BOOKING SOURCES
  const scene3Opacity = interpolate(
    frame,
    [scene2_5End, scene2_5End + 20, scene3End - 20, scene3End],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  const totalSourceBookings = airbnbBookings + bookingComBookings + directBookings;
  const hasBookingData = totalSourceBookings > 0;

  const airbnbBar = hasBookingData ? interpolate(
    frame,
    [scene2_5End + 30, scene2_5End + 90],
    [0, (airbnbBookings / totalSourceBookings) * 100],
    { extrapolateRight: "clamp" }
  ) : 0;

  const bookingComBar = hasBookingData ? interpolate(
    frame,
    [scene2_5End + 50, scene2_5End + 110],
    [0, (bookingComBookings / totalSourceBookings) * 100],
    { extrapolateRight: "clamp" }
  ) : 0;

  const directBar = hasBookingData ? interpolate(
    frame,
    [scene2_5End + 70, scene2_5End + 130],
    [0, (directBookings / totalSourceBookings) * 100],
    { extrapolateRight: "clamp" }
  ) : 0;

  // SCENE 4: PROPERTIES PERFORMANCE
  const scene4Opacity = interpolate(
    frame,
    [scene3End, scene3End + 20, scene4End - 20, scene4End],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  // SCENE 5: PAYMENT STATUS
  const scene5Opacity = interpolate(
    frame,
    [scene4End, scene4End + 20, scene5End - 20, scene5End],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  const totalPayments = pendingPayments + completedPayments + failedPayments;

  const completedArc = interpolate(
    frame,
    [scene4End + 30, scene4End + 90],
    [0, (completedPayments / totalPayments) * 100],
    { extrapolateRight: "clamp" }
  );

  // SCENE 6: TIMELINE PREVIEW
  const scene6Opacity = interpolate(
    frame,
    [scene5End, scene5End + 20, scene6End - 20, scene6End],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  // SCENE 7: SUMMARY
  const scene7Opacity = interpolate(
    frame,
    [scene6End, scene6End + 20],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  const scene7Scale = spring({
    frame: frame - scene6End - 15,
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
              COMPLETE OVERVIEW
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
              GITA - MY HOST BIZMATE
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
            <p
              style={{
                fontSize: 32,
                color: "rgba(255,140,66,0.9)",
                textAlign: "center",
                margin: "15px 0 0 0",
                fontFamily: "Arial, sans-serif",
                fontWeight: "bold",
              }}
            >
              Year 2026 - Full Year Report
            </p>
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* SCENE 2: REVENUE & PERFORMANCE ANALYSIS */}
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
              padding: "60px",
            }}
          >
            <h2
              style={{
                fontSize: 60,
                fontWeight: "bold",
                color: "#f59e0b",
                margin: "0 0 50px 0",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Revenue & Performance Analysis
            </h2>
            <div style={{ display: "flex", gap: "80px", flexWrap: "wrap", justifyContent: "center" }}>
              {/* Total Revenue */}
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 110, fontWeight: "bold", color: "#10b981", margin: 0, fontFamily: "Arial, sans-serif" }}>
                  {formatCurrency(animatedRevenue)}
                </p>
                <p style={{ fontSize: 34, color: "#94a3b8", margin: "10px 0 0 0", fontFamily: "Arial, sans-serif" }}>
                  Total Revenue
                </p>
              </div>
              {/* Total Bookings */}
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 110, fontWeight: "bold", color: "#0ea5e9", margin: 0, fontFamily: "Arial, sans-serif" }}>
                  {animatedBookings}
                </p>
                <p style={{ fontSize: 34, color: "#94a3b8", margin: "10px 0 0 0", fontFamily: "Arial, sans-serif" }}>
                  Total Bookings
                </p>
              </div>
              {/* Avg Booking Value */}
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 110, fontWeight: "bold", color: "#8b5cf6", margin: 0, fontFamily: "Arial, sans-serif" }}>
                  {formatCurrency(avgBookingValue)}
                </p>
                <p style={{ fontSize: 34, color: "#94a3b8", margin: "10px 0 0 0", fontFamily: "Arial, sans-serif" }}>
                  Avg Booking Value
                </p>
              </div>
            </div>
            <div style={{ marginTop: "50px", display: "flex", gap: "60px" }}>
              {/* Occupancy Rate */}
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 90, fontWeight: "bold", color: "#ec4899", margin: 0, fontFamily: "Arial, sans-serif" }}>
                  {occupancyRate.toFixed(1)}%
                </p>
                <p style={{ fontSize: 32, color: "#94a3b8", margin: "10px 0 0 0", fontFamily: "Arial, sans-serif" }}>
                  Occupancy Rate
                </p>
              </div>
              {/* Avg Nightly Rate */}
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 90, fontWeight: "bold", color: "#f59e0b", margin: 0, fontFamily: "Arial, sans-serif" }}>
                  {formatCurrency(avgNightlyRate)}
                </p>
                <p style={{ fontSize: 32, color: "#94a3b8", margin: "10px 0 0 0", fontFamily: "Arial, sans-serif" }}>
                  Avg Nightly Rate
                </p>
              </div>
              {/* Avg Stay */}
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 90, fontWeight: "bold", color: "#06b6d4", margin: 0, fontFamily: "Arial, sans-serif" }}>
                  {avgStayDuration.toFixed(1)}
                </p>
                <p style={{ fontSize: 32, color: "#94a3b8", margin: "10px 0 0 0", fontFamily: "Arial, sans-serif" }}>
                  Avg Nights/Stay
                </p>
              </div>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* SCENE 2.5: PERFORMANCE CHART */}
      {frame >= scene2End && frame < scene2_5End && (
        <AbsoluteFill
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            opacity: scene2_5Opacity,
          }}
        >
          <AbsoluteFill
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "60px",
            }}
          >
            <h2
              style={{
                fontSize: 60,
                fontWeight: "bold",
                color: "#f59e0b",
                margin: "0 0 40px 0",
                fontFamily: "Arial, sans-serif",
                textAlign: "center",
              }}
            >
              Performance Overview
            </h2>
            <div
              style={{
                transform: `scale(${Math.min(chartScale, 1)})`,
                width: "90%",
                height: "70%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Img
                src={staticFile("images/performance-chart.png")}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: "20px",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                }}
              />
            </div>
            <p
              style={{
                fontSize: 28,
                color: "#94a3b8",
                margin: "30px 0 0 0",
                fontFamily: "Arial, sans-serif",
                textAlign: "center",
              }}
            >
              Monthly Revenue & Bookings Trend
            </p>
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* SCENE 3: BOOKING SOURCES */}
      {frame >= scene2_5End && frame < scene3End && (
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
            <h2 style={{ fontSize: 60, fontWeight: "bold", color: "#f59e0b", margin: "0 0 60px 0", fontFamily: "Arial, sans-serif" }}>
              Booking Sources
            </h2>
            <div style={{ width: "85%", display: "flex", flexDirection: "column", gap: "45px" }}>
              {/* Airbnb */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ fontSize: 36, color: "#fff", fontFamily: "Arial, sans-serif", fontWeight: "bold" }}>
                    Airbnb
                  </span>
                  <span style={{ fontSize: 36, color: "#fff", fontFamily: "Arial, sans-serif" }}>
                    {airbnbBookings} bookings • {formatCurrency(airbnbRevenue)}
                  </span>
                </div>
                <div style={{ background: "#334155", height: "45px", borderRadius: "22px", overflow: "hidden" }}>
                  <div
                    style={{
                      background: "linear-gradient(90deg, #ff385c, #e31c5f)",
                      height: "100%",
                      width: `${airbnbBar}%`,
                    }}
                  />
                </div>
              </div>
              {/* Booking.com */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ fontSize: 36, color: "#fff", fontFamily: "Arial, sans-serif", fontWeight: "bold" }}>
                    Booking.com
                  </span>
                  <span style={{ fontSize: 36, color: "#fff", fontFamily: "Arial, sans-serif" }}>
                    {bookingComBookings} bookings • {formatCurrency(bookingComRevenue)}
                  </span>
                </div>
                <div style={{ background: "#334155", height: "45px", borderRadius: "22px", overflow: "hidden" }}>
                  <div
                    style={{
                      background: "linear-gradient(90deg, #003580, #0057b8)",
                      height: "100%",
                      width: `${bookingComBar}%`,
                    }}
                  />
                </div>
              </div>
              {/* Direct */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ fontSize: 36, color: "#fff", fontFamily: "Arial, sans-serif", fontWeight: "bold" }}>
                    Direct Bookings
                  </span>
                  <span style={{ fontSize: 36, color: "#fff", fontFamily: "Arial, sans-serif" }}>
                    {directBookings} bookings • {formatCurrency(directRevenue)}
                  </span>
                </div>
                <div style={{ background: "#334155", height: "45px", borderRadius: "22px", overflow: "hidden" }}>
                  <div
                    style={{
                      background: "linear-gradient(90deg, #10b981, #059669)",
                      height: "100%",
                      width: `${directBar}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* SCENE 4: PROPERTIES PERFORMANCE */}
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
              padding: "70px",
            }}
          >
            <h2 style={{ fontSize: 60, fontWeight: "bold", color: "#f59e0b", margin: "0 0 50px 0", fontFamily: "Arial, sans-serif" }}>
              Properties Performance
            </h2>
            {topProperties.length > 0 && topProperties[0].revenue > 0 ? (
              <div style={{ display: "flex", gap: "50px", justifyContent: "center" }}>
                {safeTopProperties.slice(0, 3).map((prop, index) => (
                  <div
                    key={index}
                    style={{
                      background: "rgba(14, 165, 233, 0.1)",
                      border: "3px solid #0ea5e9",
                      borderRadius: "25px",
                      padding: "35px 45px",
                      textAlign: "center",
                      minWidth: "320px",
                    }}
                  >
                    <p style={{ fontSize: 70, margin: 0, fontFamily: "Arial, sans-serif" }}>
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </p>
                    <p style={{ fontSize: 38, fontWeight: "bold", color: "#fff", margin: "15px 0", fontFamily: "Arial, sans-serif" }}>
                      {prop.name}
                    </p>
                    <p style={{ fontSize: 80, fontWeight: "bold", color: "#10b981", margin: "10px 0 0 0", fontFamily: "Arial, sans-serif" }}>
                      {prop.bookings}
                    </p>
                    <p style={{ fontSize: 28, color: "#94a3b8", margin: "5px 0", fontFamily: "Arial, sans-serif" }}>
                      Bookings
                    </p>
                    <p style={{ fontSize: 36, fontWeight: "bold", color: "#0ea5e9", margin: "10px 0 0 0", fontFamily: "Arial, sans-serif" }}>
                      {formatCurrency(prop.revenue)}
                    </p>
                    <p style={{ fontSize: 28, color: "#94a3b8", margin: "5px 0", fontFamily: "Arial, sans-serif" }}>
                      Revenue
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "60px" }}>
                <p style={{ fontSize: 50, color: "#94a3b8", margin: "20px 0", fontFamily: "Arial, sans-serif" }}>
                  📊
                </p>
                <p style={{ fontSize: 40, color: "#fff", margin: "20px 0", fontFamily: "Arial, sans-serif" }}>
                  Property performance data not available
                </p>
                <p style={{ fontSize: 32, color: "#94a3b8", margin: "10px 0", fontFamily: "Arial, sans-serif" }}>
                  Configure property tracking in database
                </p>
              </div>
            )}
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* SCENE 5: PAYMENT STATUS */}
      {frame >= scene4End && frame < scene5End && (
        <AbsoluteFill
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            opacity: scene5Opacity,
          }}
        >
          <AbsoluteFill
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "70px",
            }}
          >
            <h2 style={{ fontSize: 60, fontWeight: "bold", color: "#f59e0b", margin: "0 0 50px 0", fontFamily: "Arial, sans-serif" }}>
              Payment Status
            </h2>
            <div style={{ display: "flex", gap: "60px", justifyContent: "center" }}>
              {/* Completed */}
              <div
                style={{
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "3px solid #10b981",
                  borderRadius: "25px",
                  padding: "40px 55px",
                  textAlign: "center",
                  minWidth: "300px",
                }}
              >
                <p style={{ fontSize: 100, fontWeight: "bold", color: "#10b981", margin: 0, fontFamily: "Arial, sans-serif" }}>
                  {completedPayments}
                </p>
                <p style={{ fontSize: 32, color: "#94a3b8", margin: "15px 0", fontFamily: "Arial, sans-serif" }}>
                  Completed
                </p>
                <p style={{ fontSize: 42, fontWeight: "bold", color: "#10b981", margin: "10px 0 0 0", fontFamily: "Arial, sans-serif" }}>
                  {formatCurrency(completedAmount)}
                </p>
              </div>
              {/* Pending */}
              <div
                style={{
                  background: "rgba(245, 158, 11, 0.1)",
                  border: "3px solid #f59e0b",
                  borderRadius: "25px",
                  padding: "40px 55px",
                  textAlign: "center",
                  minWidth: "300px",
                }}
              >
                <p style={{ fontSize: 100, fontWeight: "bold", color: "#f59e0b", margin: 0, fontFamily: "Arial, sans-serif" }}>
                  {pendingPayments}
                </p>
                <p style={{ fontSize: 32, color: "#94a3b8", margin: "15px 0", fontFamily: "Arial, sans-serif" }}>
                  Pending
                </p>
                <p style={{ fontSize: 42, fontWeight: "bold", color: "#f59e0b", margin: "10px 0 0 0", fontFamily: "Arial, sans-serif" }}>
                  {formatCurrency(pendingAmount)}
                </p>
              </div>
              {/* Failed */}
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "3px solid #ef4444",
                  borderRadius: "25px",
                  padding: "40px 55px",
                  textAlign: "center",
                  minWidth: "300px",
                }}
              >
                <p style={{ fontSize: 100, fontWeight: "bold", color: "#ef4444", margin: 0, fontFamily: "Arial, sans-serif" }}>
                  {failedPayments}
                </p>
                <p style={{ fontSize: 32, color: "#94a3b8", margin: "15px 0", fontFamily: "Arial, sans-serif" }}>
                  Failed
                </p>
              </div>
            </div>
            <div style={{ marginTop: "50px", textAlign: "center" }}>
              <p style={{ fontSize: 36, color: "#94a3b8", margin: 0, fontFamily: "Arial, sans-serif" }}>
                Success Rate: <span style={{ color: "#10b981", fontWeight: "bold" }}>{completedArc.toFixed(1)}%</span>
              </p>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* SCENE 6: TIMELINE PREVIEW */}
      {frame >= scene5End && frame < scene6End && (
        <AbsoluteFill
          style={{
            background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
            opacity: scene6Opacity,
          }}
        >
          <AbsoluteFill
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "70px",
            }}
          >
            <h2 style={{ fontSize: 60, fontWeight: "bold", color: "#f59e0b", margin: "0 0 40px 0", fontFamily: "Arial, sans-serif" }}>
              Revenue & Occupancy Timeline
            </h2>
            <p style={{ fontSize: 38, color: "#94a3b8", margin: "0 0 50px 0", fontFamily: "Arial, sans-serif" }}>
              Last 6 Months Performance
            </p>
            <div style={{ display: "flex", gap: "100px" }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 90, fontWeight: "bold", color: "#10b981", margin: 0, fontFamily: "Arial, sans-serif" }}>
                  {totalNights}
                </p>
                <p style={{ fontSize: 36, color: "#94a3b8", margin: "15px 0", fontFamily: "Arial, sans-serif" }}>
                  Total Nights Booked
                </p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 90, fontWeight: "bold", color: "#0ea5e9", margin: 0, fontFamily: "Arial, sans-serif" }}>
                  {monthlyRevenue.length}
                </p>
                <p style={{ fontSize: 36, color: "#94a3b8", margin: "15px 0", fontFamily: "Arial, sans-serif" }}>
                  Months Tracked
                </p>
              </div>
            </div>
            <p style={{ fontSize: 32, color: "#64748b", margin: "50px 0 0 0", fontFamily: "Arial, sans-serif", fontStyle: "italic" }}>
              📊 Detailed monthly charts available in full dashboard
            </p>
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* SCENE 7: SUMMARY & CTA */}
      {frame >= scene6End && (
        <AbsoluteFill
          style={{
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)",
            opacity: scene7Opacity,
          }}
        >
          <AbsoluteFill
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              transform: `scale(${scene7Scale})`,
            }}
          >
            <h2 style={{ fontSize: 80, fontWeight: "bold", color: "#fff", margin: "0 0 40px 0", fontFamily: "Arial, sans-serif", textAlign: "center" }}>
              Complete Business Overview
            </h2>
            <div style={{ display: "flex", gap: "80px", marginBottom: "50px" }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 70, margin: 0 }}>📊</p>
                <p style={{ fontSize: 36, color: "#fff", margin: "10px 0 0 0", fontFamily: "Arial, sans-serif" }}>
                  All Metrics Tracked
                </p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 70, margin: 0 }}>✅</p>
                <p style={{ fontSize: 36, color: "#fff", margin: "10px 0 0 0", fontFamily: "Arial, sans-serif" }}>
                  Real-Time Data
                </p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 70, margin: 0 }}>🚀</p>
                <p style={{ fontSize: 36, color: "#fff", margin: "10px 0 0 0", fontFamily: "Arial, sans-serif" }}>
                  Always Updated
                </p>
              </div>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "35px 70px",
                borderRadius: "45px",
                backdropFilter: "blur(10px)",
              }}
            >
              <p style={{ fontSize: 42, color: "#fff", margin: 0, fontFamily: "Arial, sans-serif", textAlign: "center" }}>
                MY HOST BIZMATE - Powered by Supabase
              </p>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
