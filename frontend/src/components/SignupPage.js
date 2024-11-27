import React, { useState } from "react";
import axios from "axios";
import "../styling/signuppage.css"; // Import the specific CSS file

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [usertype, setUsertype] = useState("guest");
  const [error, setError] = useState("");
  const minPasswordLength = 8;

  const api = axios.create({ baseURL: "http://localhost:5000" });

  const handleSignUp = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password !== rePassword) {
      setError("Password and Repassword do not match");
      return;
    }
    if (password.length < minPasswordLength) {
      setError(
        `Password should be at least ${minPasswordLength} characters long`
      );
      return;
    }

    try {
      const user = { name, email, password, usertype };

      await api.post("/api/user/signup", user);
      console.log("User registered successfully");
      window.alert("User registered successfully");
      setError("");
    } catch (error) {
      setError(error.response?.data.message || "Error registering the user");
      console.error(
        error.response?.data.message || "Error registering the user"
      );
    }
  };

  return (
    <div className="signup-page-container">
      <form className="signup-page-form" onSubmit={handleSignUp}>
        <div className="signup-page-form-group">
          <label className="signup-page-label">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="signup-page-input"
            required
          />
        </div>
        <div className="signup-page-form-group">
          <label className="signup-page-label">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="signup-page-input"
            required
          />
        </div>
        <div className="signup-page-form-group">
          <label className="signup-page-label">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="signup-page-input"
            required
          />
        </div>
        <div className="signup-page-form-group">
          <label className="signup-page-label">Re-Password:</label>
          <input
            type="password"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
            placeholder="Re-enter your password"
            className="signup-page-input"
            required
          />
        </div>
        <div className="signup-page-form-group">
          <label className="signup-page-label">User Type:</label>
          <select
            value={usertype}
            onChange={(e) => setUsertype(e.target.value)}
            className="signup-page-select"
            required
          >
            <option value="admin">Admin</option>
            <option value="guest">Guest</option>
          </select>
        </div>
        {error && <p className="signup-page-error-message">{error}</p>}
        <div className="signup-page-button-container">
          <button type="submit" className="signup-page-button">
            Sign Up!
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;
