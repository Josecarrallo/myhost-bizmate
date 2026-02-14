import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";

export const PropertyShowcase: React.FC<{
  propertyName: string;
  location: string;
  bedrooms: number;
  price: string;
}> = ({ propertyName, location, bedrooms, price }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation for title
  const titleScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 100 },
  });

  // Animation for features
  const featuresOpacity = spring({
    frame: frame - 60,
    fps,
  });

  // Animation for CTA
  const ctaScale = spring({
    frame: frame - 120,
    fps,
    config: { damping: 80 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Background overlay */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))",
          zIndex: 1,
        }}
      />

      {/* Placeholder for property image - replace with actual image */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(135deg, #FF8C42 0%, #F97316 100%)",
          opacity: 0.3,
        }}
      />

      {/* Content */}
      <AbsoluteFill
        style={{
          zIndex: 2,
          padding: 80,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Header */}
        <div
          style={{
            transform: `scale(${titleScale})`,
            opacity: titleScale,
          }}
        >
          <div
            style={{
              fontSize: 40,
              color: "#FF8C42",
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            MY HOST BIZMATE PRESENTS
          </div>
          <h1
            style={{
              fontSize: 100,
              fontWeight: "bold",
              color: "#ffffff",
              margin: 0,
              lineHeight: 1.2,
              textShadow: "0 4px 8px rgba(0,0,0,0.5)",
            }}
          >
            {propertyName}
          </h1>
          <div
            style={{
              fontSize: 50,
              color: "#f0f0f0",
              marginTop: 10,
              display: "flex",
              alignItems: "center",
              gap: 15,
            }}
          >
            <span>📍</span>
            <span>{location}</span>
          </div>
        </div>

        {/* Features */}
        <div
          style={{
            opacity: featuresOpacity,
            display: "flex",
            gap: 60,
            marginBottom: 80,
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              borderRadius: 20,
              padding: "30px 50px",
              border: "2px solid rgba(255,255,255,0.2)",
            }}
          >
            <div style={{ fontSize: 70, marginBottom: 10 }}>🛏️</div>
            <div style={{ fontSize: 40, color: "#ffffff", fontWeight: "bold" }}>
              {bedrooms} Bedrooms
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              borderRadius: 20,
              padding: "30px 50px",
              border: "2px solid rgba(255,255,255,0.2)",
            }}
          >
            <div style={{ fontSize: 70, marginBottom: 10 }}>🏊</div>
            <div style={{ fontSize: 40, color: "#ffffff", fontWeight: "bold" }}>
              Private Pool
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              borderRadius: 20,
              padding: "30px 50px",
              border: "2px solid rgba(255,255,255,0.2)",
            }}
          >
            <div style={{ fontSize: 70, marginBottom: 10 }}>🌴</div>
            <div style={{ fontSize: 40, color: "#ffffff", fontWeight: "bold" }}>
              Garden View
            </div>
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            transform: `scale(${ctaScale})`,
            opacity: ctaScale,
            textAlign: "center",
          }}
        >
          <div
            style={{
              background: "#FF8C42",
              display: "inline-block",
              padding: "30px 80px",
              borderRadius: 25,
              fontSize: 60,
              fontWeight: "bold",
              color: "#ffffff",
              boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
              marginBottom: 20,
            }}
          >
            {price}
          </div>
          <div
            style={{
              fontSize: 35,
              color: "#f0f0f0",
            }}
          >
            Book Now • Available Year-Round
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
