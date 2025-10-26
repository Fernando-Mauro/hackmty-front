import { ArrowBigUp, Heart } from "lucide-react";

export default function Card({ name, image, votes }: { name: string; image: string; votes: number }) {
    const flexRow = { display: "flex", alignItems: "center", justifyContent: "space-between" };

    return (
        <div style={{ minWidth: "200px" }}>
            <button style={{ width: "100%" }}>
                <img src={image} alt={name} style={{ width: "100%", borderRadius: "10px" }} />
            </button>

            <div style={{ display: "flex", flexDirection: "column", marginTop: "5px" }}>
                <div style={flexRow}>
                    <p style={{ margin: 0 }}>{name}</p>
                    <button><Heart size={19} /></button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "gray", fontSize: "14px" }}>
                    <span>{votes}</span>
                    <ArrowBigUp size={20} />
                </div>
            </div>
        </div>
    );
}
