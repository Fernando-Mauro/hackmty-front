import { ArrowBigDown, ArrowBigUp, Star, User } from "lucide-react";

const profile = [
  {
    name: "NOMBRE DEL USERR",
    username: "user123",
    email: "user123@email.com",
    image:
      "https://www.nicepng.com/png/full/202-2022264_usuario-annimo-usuario-annimo-user-icon-png-transparent.png",
    rating: 4.5,
    upvotes: 230,
    downvotes: 20,
    posts: 20,
  },
];

const flexCenter = { display: "inline-flex", alignItems: "center", gap: "10px" };

export default function Profile() {
  return (
    <div style={{ margin: "20px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "35px",
          marginBottom: "10px",
        }}
      >
        <div style={flexCenter}>
          <User size={34} color="#cd2427" />
          <button style={{ fontSize: "30px" }}>Profile</button>
        </div>
      </div>

      {/* Contenido del perfil */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          padding: "8px 0",
        }}
      >
        {profile.map((user, index) => (
          <div key={index}>
            {/* Primer cuadro: perfil */}
            <div
              style={{
                backgroundColor: "#1c6f95ff",
                borderRadius: "7px",
                padding: "20px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                color: "white",
                maxWidth: "600px",
                margin: "auto",
                gap: "20px",
              }}
            >
              {/* Info izquierda */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <h2 style={{ margin: "0 0 8px 0" }}>{user.name}</h2>

                {/* Rating */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <p style={{ margin: 0, fontWeight: "bold" }}>Rating:</p>
                  <p style={{ margin: 0 }}>{user.rating}</p>
                  <Star size={18} color="gold" />
                </div>

                {/* Votos */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#ddd" }}>
                  <p style={{ margin: 0 }}>Upvotes: {user.upvotes}</p>
                  <ArrowBigUp color="#3bb839ff" />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#ddd" }}>
                  <p style={{ margin: 0 }}>Downvotes: {user.downvotes}</p>
                  <ArrowBigDown color="#cd2427" />
                </div>

                <p style={{ margin: 0, color: "#ddd" }}>
                  Posts: {user.posts}
                </p>
              </div>

              {/* Imagen a la derecha */}
              <img
                src={user.image}
                alt={user.name}
                style={{
                  width: "130px",
                  height: "130px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* Segundo cuadro: info de usuario y botón */}
            <div
              style={{
                backgroundColor: "#144d68",
                borderRadius: "7px",
                padding: "10px",
                color: "white",
                maxWidth: "600px",
                margin: "20px auto 0",
                textAlign: "center",
              }}
            >
              <p style={{ marginBottom: "8px" }}>
                <strong>Username:</strong> {user.username}
              </p>
              <p style={{ marginBottom: "15px" }}>
                <strong>Email:</strong> {user.email}
              </p>

              <button
                style={{
                  backgroundColor: "#cd2427",
                  color: "white",
                  border: "none",
                  padding: "5px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Reset Password
              </button>
            </div>
            <div style={{ display: "flex",justifyContent: "center", alignItems: "center",}}>
                <img src="/logo.PNG" style={{
                  width: "115px",
                  marginTop: "20px",
                  marginBottom:"20px"
                }}/>
            </div>
            <div style={{ display: "flex",justifyContent: "center", alignItems: "center",}}><p>By Map My Meal</p></div>

          </div>
        ))}
      </div>
    </div>
  );
}
