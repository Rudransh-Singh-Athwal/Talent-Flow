import React from "react";
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
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-brand">
            <h2>TalentFlow</h2>
          </div>
          <div className="nav-links">
            <NavLink
              to="/jobs"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Jobs
            </NavLink>
            <NavLink
              to="/candidates"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Candidates
            </NavLink>
            <NavLink
              to="/assessments"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Assessments
            </NavLink>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<JobsPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:jobId" element={<JobsPage />} />
            <Route path="/candidates" element={<CandidatesPage />} />
            <Route path="/candidates/:id" element={<CandidateProfilePage />} />
            {/* <Route path="/assessments" element={<AssessmentsPage />} /> */}
            {/* <Route path="/assessments/:jobId" element={<AssessmentsPage />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
