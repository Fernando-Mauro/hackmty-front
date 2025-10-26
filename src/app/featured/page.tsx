import { ChevronRight, Flame, MapPin } from "lucide-react";

// Sample data
const featured = [
  { name: "RESTAURANT 1", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK0eZ2onIuGCYMnIQEP0DQJxKYGw5K2RCQtQ&s", stars: 5, promotion: "2x1 Cookie Tuesday", distance:"2 km"},
  { name: "RESTAURANT 2", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK0eZ2onIuGCYMnIQEP0DQJxKYGw5K2RCQtQ&s", stars: 4.5, promotion: "All you can eat", distance:"1.5 km" },
  { name: "RESTAURANT 3", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK0eZ2onIuGCYMnIQEP0DQJxKYGw5K2RCQtQ&s", stars: 4, promotion: "Eat for less than 6 dlls", distance:"3 km"   },
  { name: "RESTAURANT 4", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK0eZ2onIuGCYMnIQEP0DQJxKYGw5K2RCQtQ&s", stars: 5, promotion: "4x3 Promo", distance:"2 km"   },
  { name: "RESTAURANT 5", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK0eZ2onIuGCYMnIQEP0DQJxKYGw5K2RCQtQ&s", stars: 3.5, promotion: "Family size combo", distance:"3 km"   },
  { name: "RESTAURANT 6", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK0eZ2onIuGCYMnIQEP0DQJxKYGw5K2RCQtQ&s", stars: 4.5,promotion: "2x1 Popcorn Tuesday", distance:"1 km"   },
  { name: "RESTAURANT 7", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK0eZ2onIuGCYMnIQEP0DQJxKYGw5K2RCQtQ&s", stars: 5, promotion: "All you can eat", distance:"2 km"   },
  { name: "RESTAURANT 8", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK0eZ2onIuGCYMnIQEP0DQJxKYGw5K2RCQtQ&s", stars: 4, promotion: "Eat for less than 5 dlls", distance:"1 km"  },
];

const flexCenter = { display: "inline-flex", alignItems: "center", gap: "10px" };

export default function Featured() {
  return (
    <div style={{ margin: "20px" }}>
      {/* Featured header */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "35px", marginBottom: "10px" }}>
        <div style={flexCenter}>
          <Flame size={34} color="#cd2427" />
          <button style={{ fontSize: "30px" }}>Featured</button>
        </div>
      </div>

      {/* Lista vertical de restaurantes destacados */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "8px 0" }}>
        {featured.map((restaurant, index) => (
          <div key={index} style={{backgroundColor: "#1c6f95ff",borderRadius: "7px",padding: "13px 20px",display: "flex",flexDirection: "column",gap: "10px",color: "white",maxWidth: "600px",
          }}>
            {/* Promo + icon + distancia */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <p style={{fontSize: "15px",backgroundColor: "#013e5b",color: "white",borderRadius: "20px",padding: "5px 15px",cursor: "pointer",}}>
                {restaurant.promotion}</p>
                <button><ChevronRight /></button>
                </div>

            {/* Nombre del restaurante */}
            <div style={{ fontSize: "14px",display: "flex", alignItems: "center", gap: "50px", flexWrap: "wrap" }}>
              {restaurant.name}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap"}}>
                <MapPin size={18} color="#cd2427" /> <p>{restaurant.distance}</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}