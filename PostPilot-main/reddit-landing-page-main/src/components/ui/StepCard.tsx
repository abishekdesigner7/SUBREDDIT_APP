interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

export default function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div style={{ position: "relative", padding: "32px 28px", flex: 1 }}>
      {/* Large background number */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 20,
          fontSize: "7rem",
          fontWeight: 900,
          color: "rgba(255,69,0,0.07)",
          lineHeight: 1,
          fontFamily: "var(--font-space), sans-serif",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {number}
      </div>

      {/* Step badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "#FF4500",
          color: "#fff",
          fontWeight: 800,
          fontSize: "0.95rem",
          marginBottom: 20,
          position: "relative",
          zIndex: 1,
          fontFamily: "var(--font-space), sans-serif",
        }}
      >
        {number}
      </div>

      <h3
        style={{
          fontSize: "1.2rem",
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: 12,
          position: "relative",
          zIndex: 1,
          fontFamily: "var(--font-space), sans-serif",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: "0.92rem",
          color: "var(--text-secondary)",
          lineHeight: 1.7,
          position: "relative",
          zIndex: 1,
        }}
      >
        {description}
      </p>
    </div>
  );
}
