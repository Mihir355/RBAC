import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styling/signinpage.css"; // Import the specific CSS file

const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usertype, setUsertype] = useState("guest");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const api = axios.create({ baseURL: "https://rbac-backend-y8xs.onrender.com" });

  const handleSignin = async (e) => {
    e.preventDefault();

    const user = { email, password, usertype };

    try {
      const response = await api.post("/api/user/signin", user);
      const { userType, token, userEmail } = response.data;

      console.log("User logged in successfully");

      localStorage.setItem("authToken", token);
      localStorage.setItem("userType", userType);
      localStorage.setItem("email", userEmail);

      if (userType) {
        navigate("/landing");
      }
    } catch (error) {
      setError(error.response?.data.message || "Error logging in the user");
      console.error(
        error.response?.data.message || "Error logging in the user"
      );
    }
  };

  return (
    <div className="signin-page-container">
      <form className="signin-page-form" onSubmit={handleSignin}>
        <div className="signin-page-form-group">
          <label className="signin-page-label">Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="signin-page-input"
          />
        </div>
        <div className="signin-page-form-group">
          <label className="signin-page-label">Password:</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="signin-page-input"
          />
        </div>
        <div className="signin-page-form-group">
          <label className="signin-page-label">User Type:</label>
          <select
            value={usertype}
            onChange={(e) => setUsertype(e.target.value)}
            className="signin-page-select"
            required
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
            <option value="guest">Guest</option>
          </select>
        </div>
        {error && <p className="signin-page-error-message">{error}</p>}
        <div className="signin-page-button-container">
          <button type="submit" className="signin-page-button">
            Sign In!
          </button>
        </div>
      </form>
    </div>
  );
};

export default SigninPage;
