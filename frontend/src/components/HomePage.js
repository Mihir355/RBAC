import React from "react";
import { Link } from "react-router-dom";
import "../styling/homepage.css";

const Homepage = () => {
  return (
    <div className="homepage">
      <header className="homepage-header">
        <h1>Welcome to the CMS System</h1>
        <p>Manage roles, content, and permissions with ease!</p>
      </header>
      <div className="homepage-buttons">
        <Link to="/signin" className="button signin-button">
          Sign In
        </Link>
        <Link to="/signup" className="button signup-button">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Homepage;
