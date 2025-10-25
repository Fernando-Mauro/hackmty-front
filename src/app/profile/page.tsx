import Card from "@/components/card";
import CardSection from "@/components/cardsection";
import { BadgePercent, User } from "lucide-react";

// Sample data
const featured = [
  { name: "RESTAURANT 1", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK0eZ2onIuGCYMnIQEP0DQJxKYGw5K2RCQtQ&s", votes:286},
  { name: "RESTAURANT 2", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK0eZ2onIuGCYMnIQEP0DQJxKYGw5K2RCQtQ&s", votes:252},
  { name: "RESTAURANT 3", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK0eZ2onIuGCYMnIQEP0DQJxKYGw5K2RCQtQ&s", votes:190},
  { name: "RESTAURANT 4", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK0eZ2onIuGCYMnIQEP0DQJxKYGw5K2RCQtQ&s", votes:211},
];

const healthy = [
  { name: "RESTAURANT 1", image: "https://static.wixstatic.com/media/d606f3_d6a45b4946284a25b980248196956726~mv2.png/v1/fill/w_280,h_281,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/HN%20pick.png",votes:22},
  { name: "RESTAURANT 2", image: "https://static.wixstatic.com/media/d606f3_d6a45b4946284a25b980248196956726~mv2.png/v1/fill/w_280,h_281,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/HN%20pick.png", votes:22 },
  { name: "RESTAURANT 3", image: "https://static.wixstatic.com/media/d606f3_d6a45b4946284a25b980248196956726~mv2.png/v1/fill/w_280,h_281,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/HN%20pick.png", votes:22 },
  { name: "RESTAURANT 4", image: "https://static.wixstatic.com/media/d606f3_d6a45b4946284a25b980248196956726~mv2.png/v1/fill/w_280,h_281,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/HN%20pick.png",votes:22 },
];

const pizza = [
  { name: "RESTAURANT 1", image: "https://static.promodescuentos.com/threads/raw/7B9Q5/873520_1/re/1024x1024/qt/60/873520_1.jpg", votes:22 },
  { name: "RESTAURANT 2", image: "https://static.promodescuentos.com/threads/raw/7B9Q5/873520_1/re/1024x1024/qt/60/873520_1.jpg",votes:22 },
  { name: "RESTAURANT 3", image: "https://static.promodescuentos.com/threads/raw/7B9Q5/873520_1/re/1024x1024/qt/60/873520_1.jpg", votes:22 },
  { name: "RESTAURANT 4", image: "https://static.promodescuentos.com/threads/raw/7B9Q5/873520_1/re/1024x1024/qt/60/873520_1.jpg",votes:22 },
];

const flexCenter = { display: "inline-flex", alignItems: "center", gap: "10px" };

export default function Profile() {
  return (
    <div style={{ margin: "20px" }}>

      {/* Promotions and Profile */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "35px", marginBottom: "10px" }}>
        <div style={flexCenter}>
          <BadgePercent size={34} color="#cd2427"/>
          <button style={{ fontSize: "30px" }}>Promos</button>
        </div>
      </div>

      {/* Promo categories */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "8px", overflowX: "auto", whiteSpace: "nowrap", padding: "8px 0" }}>
        <button style={{ fontSize: "16px", flex: "0 0 auto", background: "#013e5b", color: "white", border: "none", padding: "8px 14px", borderRadius: "9999px", cursor: "pointer" }}>Sushi</button>
        <button style={{ fontSize: "16px", flex: "0 0 auto", background: "#013e5b", color: "white", border: "none", padding: "8px 14px", borderRadius: "9999px", cursor: "pointer" }}>Chicken</button>
        <button style={{ fontSize: "16px", flex: "0 0 auto", background: "#013e5b", color: "white", border: "none", padding: "8px 14px", borderRadius: "9999px", cursor: "pointer" }}>Desserts</button>
        <button style={{ fontSize: "16px", flex: "0 0 auto", background: "#013e5b", color: "white", border: "none", padding: "8px 14px", borderRadius: "9999px", cursor: "pointer" }}>Coffee</button>
        <button style={{ fontSize: "16px", flex: "0 0 auto", background: "#013e5b", color: "white", border: "none", padding: "8px 14px", borderRadius: "9999px", cursor: "pointer" }}>Paninis</button>
        <button style={{ fontSize: "16px", flex: "0 0 auto", background: "#013e5b", color: "white", border: "none", padding: "8px 14px", borderRadius: "9999px", cursor: "pointer" }}>Healthy</button>
        <button style={{ fontSize: "16px", flex: "0 0 auto", background: "#013e5b", color: "white", border: "none", padding: "8px 14px", borderRadius: "9999px", cursor: "pointer" }}>Pasta</button>
      </div>

      {/* Featured */}
      <CardSection name={"Featured"}>
        {featured.map((r, index) => (
          <Card name={r.name} image={r.image} votes={r.votes} key={index} />
        ))}
      </CardSection>

      {/* Healthy */}
      <CardSection name={"Healthy"}>
        {healthy.map((r, index) => (
          <Card name={r.name} image={r.image} votes={r.votes} key={index} />
        ))}
      </CardSection>

      {/* Pizza */}
      <CardSection name={"Pizza"}>
        {pizza.map((r, index) => (
          <Card name={r.name} image={r.image} votes={r.votes} key={index} />
        ))}
      </CardSection>

    </div>
  );
}
