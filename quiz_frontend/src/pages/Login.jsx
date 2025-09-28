import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/main.css";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/user/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.Success) {
        // ✅ Save tokens to localStorage
        localStorage.setItem("access_token", data.Data.access);
        localStorage.setItem("refresh_token", data.Data.refresh);
        localStorage.setItem("user_id", data.Data.user);

        alert("✅ Login Successful!");

        // Redirect (you can change this later)
        navigate("/user/dashboard");
      } else {
        alert(`❌ ${data.Message}`);
      }
    } catch (err) {
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Welcome Back</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="login-footer">
        Don’t have an account? <a href="/register">Register</a>
      </div>
    </div>
  );
}