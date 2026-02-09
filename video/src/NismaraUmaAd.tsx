import { AbsoluteFill, Audio, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export const NismaraUmaAd: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene timings (30s total = 900 frames @ 30fps)
  // Scene 1: Intro (0-225 frames = 0-7.5s)
  // Scene 2: Rice Fields (225-450 frames = 7.5-15s)
  // Scene 3: Private Pool (450-675 frames = 15-22.5s)
  // Scene 4: Call to Action (675-900 frames = 22.5-30s)

  const scene1Duration = 225;
  const scene2Duration = 450;
  const scene3Duration = 675;
  const scene4Duration = 900;

  // SCENE 1: INTRO - Bedroom with title
  const scene1Opacity = interpolate(
    frame,
    [0, 30, scene1Duration - 30, scene1Duration],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  const scene1TitleY = interpolate(
    frame,
    [0, 60],
    [100, 0],
    { extrapolateRight: "clamp" }
  );

  const scene1Scale = spring({
    frame: frame - 30,
    fps,
    config: {
      damping: 100,
    },
  });

  // SCENE 2: RICE FIELDS
  const scene2Opacity = interpolate(
    frame,
    [scene1Duration, scene1Duration + 30, scene2Duration - 30, scene2Duration],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  const scene2TextY = interpolate(
    frame,
    [scene1Duration, scene1Duration + 60],
    [80, 0],
    { extrapolateRight: "clamp" }
  );

  const scene2Zoom = interpolate(
    frame,
    [scene1Duration, scene2Duration],
    [1, 1.15],
    { extrapolateRight: "clamp" }
  );

  // SCENE 3: PRIVATE POOL
  const scene3Opacity = interpolate(
    frame,
    [scene2Duration, scene2Duration + 30, scene3Duration - 30, scene3Duration],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  const scene3TextX = interpolate(
    frame,
    [scene2Duration, scene2Duration + 60],
    [-100, 0],
    { extrapolateRight: "clamp" }
  );

  const scene3Zoom = interpolate(
    frame,
    [scene2Duration, scene3Duration],
    [1, 1.1],
    { extrapolateRight: "clamp" }
  );

  // SCENE 4: CALL TO ACTION
  const scene4Opacity = interpolate(
    frame,
    [scene3Duration, scene3Duration + 30],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  const scene4Scale = spring({
    frame: frame - scene3Duration - 20,
    fps,
    config: {
      damping: 80,
    },
  });

  const scene4ButtonScale = spring({
    frame: frame - scene3Duration - 60,
    fps,
    config: {
      damping: 100,
    },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>

      {/* SCENE 1: INTRO - Bedroom */}
      {frame < scene1Duration && (
        <AbsoluteFill style={{ opacity: scene1Opacity }}>
          <Img
            src={staticFile("images/nismara-bedroom.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {/* Dark overlay */}
          <AbsoluteFill
            style={{
              background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5))",
            }}
          />
          {/* Title */}
          <AbsoluteFill
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              transform: `translateY(${scene1TitleY}px) scale(${scene1Scale})`,
            }}
          >
            <h1
              style={{
                fontSize: 120,
                fontWeight: "bold",
                color: "#fff",
                textAlign: "center",
                margin: 0,
                textShadow: "0 8px 30px rgba(0,0,0,0.7)",
                fontFamily: "Arial, sans-serif",
                letterSpacing: "4px",
              }}
            >
              NISMARA UMA
            </h1>
            <p
              style={{
                fontSize: 48,
                color: "#f59e0b",
                textAlign: "center",
                margin: "20px 0 0 0",
                textShadow: "0 4px 20px rgba(0,0,0,0.7)",
                fontFamily: "Arial, sans-serif",
                letterSpacing: "2px",
              }}
            >
              Luxury Villa in Ubud
            </p>
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* SCENE 2: RICE FIELDS */}
      {frame >= scene1Duration && frame < scene2Duration && (
        <AbsoluteFill style={{ opacity: scene2Opacity }}>
          <Img
            src={staticFile("images/nismara-ricefields.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${scene2Zoom})`,
            }}
          />
          {/* Gradient overlay */}
          <AbsoluteFill
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent 50%)",
            }}
          />
          {/* Text */}
          <AbsoluteFill
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "center",
              padding: "80px",
              transform: `translateY(${scene2TextY}px)`,
            }}
          >
            <h2
              style={{
                fontSize: 80,
                fontWeight: "bold",
                color: "#fff",
                textAlign: "center",
                margin: 0,
                textShadow: "0 6px 25px rgba(0,0,0,0.8)",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Surrounded by Rice Terraces
            </h2>
            <p
              style={{
                fontSize: 42,
                color: "#fbbf24",
                textAlign: "center",
                margin: "20px 0 0 0",
                textShadow: "0 4px 20px rgba(0,0,0,0.8)",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Wake up to breathtaking views of Ubud's iconic landscapes
            </p>
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* SCENE 3: PRIVATE POOL */}
      {frame >= scene2Duration && frame < scene3Duration && (
        <AbsoluteFill style={{ opacity: scene3Opacity }}>
          <Img
            src={staticFile("images/nismara-pool.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${scene3Zoom})`,
            }}
          />
          {/* Gradient overlay */}
          <AbsoluteFill
            style={{
              background: "linear-gradient(to right, rgba(0,0,0,0.7), transparent 40%)",
            }}
          />
          {/* Text */}
          <AbsoluteFill
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              padding: "100px",
              transform: `translateX(${scene3TextX}px)`,
            }}
          >
            <h2
              style={{
                fontSize: 80,
                fontWeight: "bold",
                color: "#fff",
                margin: 0,
                textShadow: "0 6px 25px rgba(0,0,0,0.9)",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Your Private Paradise
            </h2>
            <div style={{ marginTop: "40px" }}>
              <p
                style={{
                  fontSize: 38,
                  color: "#fbbf24",
                  margin: "10px 0",
                  textShadow: "0 4px 20px rgba(0,0,0,0.8)",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                ✓ Private Pool
              </p>
              <p
                style={{
                  fontSize: 38,
                  color: "#fbbf24",
                  margin: "10px 0",
                  textShadow: "0 4px 20px rgba(0,0,0,0.8)",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                ✓ Traditional Balinese Design
              </p>
              <p
                style={{
                  fontSize: 38,
                  color: "#fbbf24",
                  margin: "10px 0",
                  textShadow: "0 4px 20px rgba(0,0,0,0.8)",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                ✓ Full Kitchen & Living Area
              </p>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* SCENE 4: CALL TO ACTION */}
      {frame >= scene3Duration && (
        <AbsoluteFill style={{ opacity: scene4Opacity }}>
          <Img
            src={staticFile("images/nismara-exterior.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {/* Dark overlay */}
          <AbsoluteFill
            style={{
              background: "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.7))",
            }}
          />
          {/* CTA Content */}
          <AbsoluteFill
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              transform: `scale(${scene4Scale})`,
            }}
          >
            <h2
              style={{
                fontSize: 90,
                fontWeight: "bold",
                color: "#fff",
                textAlign: "center",
                margin: 0,
                textShadow: "0 6px 30px rgba(0,0,0,0.9)",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Book Your Escape Today
            </h2>
            <p
              style={{
                fontSize: 48,
                color: "#fbbf24",
                textAlign: "center",
                margin: "30px 0",
                textShadow: "0 4px 20px rgba(0,0,0,0.8)",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Starting from $120/night
            </p>
            {/* Button */}
            <div
              style={{
                marginTop: "40px",
                transform: `scale(${scene4ButtonScale})`,
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  padding: "30px 80px",
                  borderRadius: "60px",
                  boxShadow: "0 15px 40px rgba(245, 158, 11, 0.4)",
                }}
              >
                <p
                  style={{
                    fontSize: 52,
                    fontWeight: "bold",
                    color: "#fff",
                    margin: 0,
                    fontFamily: "Arial, sans-serif",
                    letterSpacing: "2px",
                  }}
                >
                  RESERVE NOW
                </p>
              </div>
            </div>
            <p
              style={{
                fontSize: 36,
                color: "#cbd5e1",
                textAlign: "center",
                margin: "50px 0 0 0",
                textShadow: "0 2px 15px rgba(0,0,0,0.8)",
                fontFamily: "Arial, sans-serif",
              }}
            >
              www.nismaraumavilla.com
            </p>
          </AbsoluteFill>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
