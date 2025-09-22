import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Timeline from "../components/candidates/Timeline";

const CandidateProfilePage = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");
  const [newStage, setNewStage] = useState("");

  const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];

  useEffect(() => {
    fetchCandidateData();
  }, [id]);

  const fetchCandidateData = async () => {
    setLoading(true);
    setError("");

    try {
      // Fetch candidate details
      const candidateResponse = await fetch(`/api/candidates/${id}`);
      if (!candidateResponse.ok) {
        throw new Error("Candidate not found");
      }
      const candidateData = await candidateResponse.json();
      setCandidate(candidateData);
      setNewStage(candidateData.stage);

      // Fetch timeline
      const timelineResponse = await fetch(`/api/candidates/${id}/timeline`);
      if (timelineResponse.ok) {
        const timelineData = await timelineResponse.json();
        setTimeline(timelineData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStageUpdate = async (e) => {
    e.preventDefault();

    if (newStage === candidate.stage) {
      return;
    }

    try {
      const response = await fetch(`/api/candidates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: newStage,
          notes: notes.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update candidate");
      }

      // Refresh data
      await fetchCandidateData();
      setNotes("");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div
        className="loading-state"
        style={{ textAlign: "center", padding: "3rem" }}
      >
        <div className="spinner"></div>
        <p>Loading candidate...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="error-state"
        style={{ textAlign: "center", padding: "3rem" }}
      >
        <h3>Error</h3>
        <p>{error}</p>
        <Link to="/candidates" className="btn btn-primary">
          Back to Candidates
        </Link>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div
        className="empty-state"
        style={{ textAlign: "center", padding: "3rem" }}
      >
        <h3>Candidate not found</h3>
        <Link to="/candidates" className="btn btn-primary">
          Back to Candidates
        </Link>
      </div>
    );
  }

  return (
    <div className="candidate-profile">
      <div className="page-header">
        <div>
          <h1>{candidate.name}</h1>
          <p>{candidate.email}</p>
        </div>
        <Link to="/candidates" className="btn btn-secondary">
          Back to Candidates
        </Link>
      </div>

      <div className="profile-content">
        <div className="profile-main">
          <div className="card">
            <div className="card-header">
              <h3>Candidate Information</h3>
              <span className={`status-badge status-${candidate.stage}`}>
                {candidate.stage.charAt(0).toUpperCase() +
                  candidate.stage.slice(1)}
              </span>
            </div>
            <div className="candidate-details">
              <p>
                <strong>Email:</strong> {candidate.email}
              </p>
              <p>
                <strong>Applied:</strong>{" "}
                {new Date(candidate.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Current Stage:</strong> {candidate.stage}
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Update Stage</h3>
            </div>
            <form onSubmit={handleStageUpdate} className="stage-update-form">
              <div className="form-group">
                <label className="form-label">New Stage</label>
                <select
                  className="form-select"
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value)}
                >
                  {stages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage.charAt(0).toUpperCase() + stage.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Notes (optional)</label>
                <textarea
                  className="form-textarea"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this stage change..."
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={newStage === candidate.stage}
              >
                Update Stage
              </button>
            </form>
          </div>
        </div>

        <div className="profile-sidebar">
          <Timeline timeline={timeline} />
        </div>
      </div>
    </div>
  );
};

export default CandidateProfilePage;
