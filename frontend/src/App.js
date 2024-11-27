import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SigninPage from "./components/SigninPage";
import SignupPage from "./components/SignupPage";
import HomePage from "./components/HomePage";
import LandingPage from "./components/LandingPage";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/landing" element={<LandingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
