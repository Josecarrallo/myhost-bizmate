import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const HelloWorld: React.FC<{
  titleText: string;
  titleColor: string;
}> = ({ titleText, titleColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation: Title appears with spring effect
  const scale = spring({
    frame: frame - 10,
    fps,
    config: {
      damping: 100,
    },
  });

  // Animation: Fade in
  const opacity = spring({
    frame: frame - 20,
    fps,
    from: 0,
    to: 1,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1a1a2e",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
        }}
      >
        <h1
          style={{
            fontSize: 100,
            fontWeight: "bold",
            color: titleColor,
            textAlign: "center",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {titleText}
        </h1>
        <p
          style={{
            fontSize: 40,
            color: "#ffffff",
            textAlign: "center",
            marginTop: 20,
            fontFamily: "Arial, sans-serif",
          }}
        >
          Manage your properties with AI
        </p>
      </div>
    </AbsoluteFill>
  );
};
