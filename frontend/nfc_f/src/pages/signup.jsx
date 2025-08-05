import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import translations from "../assets/language";

export default function Signup() {

  const [language, setLanguage] = useState("English");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    password: "",
    photo: null
  });
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { register } = useAuth();

  useEffect(() => {
    const storedRole = localStorage.getItem("selectedRole");
    if (storedRole) {
      setSelectedRole(storedRole);
    } else {
      navigate("/roles"); // fallback if user opens directly
    }
  }, [navigate]);

  const t = translations[language];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const userData = {
        username: formData.email,
        email: formData.email,
        password: formData.password,
        role: selectedRole.toLowerCase(),
        phone: formData.phone,
        gender: formData.gender,
        location: formData.address,
        language_preference: 'English', // Default language
        age: 25 // Default age, you can add age field to form if needed
      };
      
      const result = await register(userData);
      if (result.success) {
        navigate('/dashboard');
      } else {
        // Handle validation errors
        if (typeof result.error === 'object') {
          const errorMessages = Object.values(result.error).flat().join(', ');
          setError(errorMessages);
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>{t.submit}</h2>
      <div style={styles.languageToggle}>
        <label style={{ marginRight: "8px" }}>🌐 Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={styles.select}
        >
          {Object.keys(translations).map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          placeholder={t.name}
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          placeholder={t.email}
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          placeholder={t.phone}
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          placeholder={t.address}
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">{t.gender}</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input
          placeholder={t.password}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <div style={styles.readonlyRole}>
          <strong>{t.role}:</strong> {selectedRole}
        </div>

        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleChange}
          style={styles.input}
        />
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <button type="submit" disabled={loading} style={styles.submitBtn}>
          {loading ? 'Creating Account...' : t.submit}
        </button>
        <p>
          {t.already} <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "2rem auto",
    padding: "2rem",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  input: {
    padding: "0.8rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem"
  },
  submitBtn: {
    background: "#007BFF",
    color: "#fff",
    border: "none",
    padding: "0.9rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem"
  },
  languageToggle: {
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center"
  },
  select: {
    padding: "0.5rem",
    fontSize: "1rem"
  },
  readonlyRole: {
    fontSize: "1rem",
    padding: "0.8rem",
    background: "#f1f1f1",
    borderRadius: "6px"
  }
};
