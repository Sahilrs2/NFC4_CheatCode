import React from "react";
import { useNavigate } from "react-router-dom";

const roles = [
  { label: "LEARNER", emoji: "👤" },
  { label: "Mentor", emoji: "🎓" },
  { label: "Employer", emoji: "💼" },
  { label: "NGO", emoji: "🤝" }
];

export default function Startup() {
  const navigate = useNavigate();

  const handleRoleClick = (role) => {
    localStorage.setItem("selectedRole", role);
    navigate("/signup");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Choose Your Role</h1>
      <div style={styles.roleContainer}>
        {roles.map((r) => (
          <div
            key={r.label}
            onClick={() => handleRoleClick(r.label)}
            style={styles.roleCard}
          >
            <span style={styles.emoji}>{r.emoji}</span>
            <span style={styles.label}>{r.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f5f5",
    padding: "2rem"
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "1.5rem"
  },
  roleContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "1rem",
    width: "100%",
    maxWidth: "600px"
  },
  roleCard: {
    padding: "1.5rem",
    background: "white",
    borderRadius: "12px",
    textAlign: "center",
    cursor: "pointer",
    fontSize: "1.1rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease-in-out"
  },
  emoji: {
    fontSize: "2rem",
    display: "block",
    marginBottom: "0.5rem"
  },
  label: {
    fontWeight: "600"
  }
};
