import { ChevronRight } from "lucide-react";

export default function Cardsection({ name, children }: { name: string; children: React.ReactNode }) {
  const flexCenter = { display: "inline-flex", alignItems: "center", gap: "10px" };

  return (
    <div style={{ margin: "0 10px" }}>
      <div style={{ ...flexCenter, justifyContent: "space-between" }}>
        <h1 style={{ fontSize: "25px", margin: 0 }}>{name}</h1>
        <button><ChevronRight /></button>
      </div>

      <div style={{ display: "flex", gap: "20px", overflowX: "auto", padding: "10px 0" }}>
        {children}
      </div>
    </div>
  );
}
