export default function CardSkeleton({ minWidth = 200 }: { minWidth?: number }) {
  return (
    <div style={{ minWidth }}>
      <div style={{ width: "100%" }}>
        <div
          className="animate-pulse"
          style={{ width: "100%", height: 120, borderRadius: 10, backgroundColor: "#e5e7eb" }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginTop: 5, gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div className="animate-pulse" style={{ height: 16, width: "60%", borderRadius: 6, backgroundColor: "#e5e7eb" }} />
          <div className="animate-pulse" style={{ height: 20, width: 20, borderRadius: 6, backgroundColor: "#e5e7eb" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div className="animate-pulse" style={{ height: 14, width: 24, borderRadius: 6, backgroundColor: "#e5e7eb" }} />
          <div className="animate-pulse" style={{ height: 20, width: 20, borderRadius: 6, backgroundColor: "#e5e7eb" }} />
        </div>
      </div>
    </div>
  );
}
