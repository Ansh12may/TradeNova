import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isStrongPassword = (password) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*]/.test(password)
    );
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword)
      return setError("Passwords do not match");

    if (!isStrongPassword(password))
      return setError(
        "Password must be 8+ chars, include uppercase, number & special character"
      );

    try {
      setLoading(true);

      // Register
      await axios.post(
  `${process.env.REACT_APP_API_URL}/register`,
  { name, email, password }
);

      setSuccess("Account created! Redirecting to login...");

      //  redirect to dashboard login (port 3001 if dashboard runs there)
      // Adjust the URL to wherever your dashboard app is hosted
   setTimeout(() => {
  window.location.href = process.env.REACT_APP_DASHBOARD_URL;
}, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create your account</h2>
        <p>Start investing commission-free</p>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p style={{ marginTop: "16px", fontSize: "14px", color: "#666" }}>
          Already have an account?{" "}
          {/* check this */}
     <a href={`${process.env.REACT_APP_DASHBOARD_URL}/login`}>
  Log in
</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;