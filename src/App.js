import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import JobsPage from "./pages/JobsPage";
import CandidatesPage from "./pages/CandidatesPage";
import CandidateProfilePage from "./pages/CandidateProfilePage";
import AssessmentsPage from "./pages/AssessmentsPage";
import "./App.css";

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-brand">
            <h2>TalentFlow</h2>
          </div>

          {/* Hamburger Menu Button */}
          <button
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${mobileMenuOpen ? "open" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          <div className={`nav-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
            <NavLink
              to="/jobs"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={closeMobileMenu}
            >
              Jobs
            </NavLink>
            <NavLink
              to="/candidates"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={closeMobileMenu}
            >
              Candidates
            </NavLink>
            <NavLink
              to="/assessments"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={closeMobileMenu}
            >
              Assessments
            </NavLink>
          </div>

          {/* Overlay for mobile menu */}
          {mobileMenuOpen && (
            <div className="mobile-menu-overlay" onClick={closeMobileMenu} />
          )}
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<JobsPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:jobId" element={<JobsPage />} />
            <Route path="/candidates" element={<CandidatesPage />} />
            <Route path="/candidates/:id" element={<CandidateProfilePage />} />
            <Route path="/assessments" element={<AssessmentsPage />} />
            <Route path="/assessments/:jobId" element={<AssessmentsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
