import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AssessmentBuilder from "../components/assessments/AssessmentBuilder";
import AssessmentPreview from "../components/assessments/AssessmentPreview";

const AssessmentsPage = () => {
  const { jobId } = useParams();
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(jobId || "");
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      fetchAssessment();
    }
  }, [selectedJobId]);

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/jobs?status=active&pageSize=100");
      if (response.ok) {
        const data = await response.json();
        setJobs(data.data);

        // If no jobId in URL but we have jobs, select the first one
        if (!selectedJobId && data.data.length > 0) {
          setSelectedJobId(data.data[0].id.toString());
        }
      }
    } catch (err) {
      setError("Failed to fetch jobs");
    }
  };

  const fetchAssessment = async () => {
    if (!selectedJobId) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/assessments/${selectedJobId}`);
      if (response.ok) {
        const data = await response.json();
        setAssessment(data || createEmptyAssessment());
      } else {
        setAssessment(createEmptyAssessment());
      }
    } catch (err) {
      setError("Failed to fetch assessment");
      setAssessment(createEmptyAssessment());
    } finally {
      setLoading(false);
    }
  };

  const createEmptyAssessment = () => ({
    title: "",
    sections: [
      {
        title: "General Questions",
        questions: [],
      },
    ],
  });

  const saveAssessment = async (assessmentData) => {
    if (!selectedJobId) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/assessments/${selectedJobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assessmentData),
      });

      if (!response.ok) {
        throw new Error("Failed to save assessment");
      }

      const saved = await response.json();
      setAssessment(saved);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleJobChange = (jobId) => {
    setSelectedJobId(jobId);
    // Update URL without full navigation
    window.history.pushState(null, "", `/assessments/${jobId}`);
  };

  const selectedJob = jobs.find((job) => job.id.toString() === selectedJobId);

  return (
    <div className="assessments-page">
      <div className="page-header">
        <h1>Assessment Builder</h1>
        <div className="job-selector">
          <label className="form-label">Select Job:</label>
          <select
            className="form-select"
            value={selectedJobId}
            onChange={(e) => handleJobChange(e.target.value)}
          >
            <option value="">Select a job...</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div
          className="error-message"
          style={{
            background: "#fee",
            color: "#c33",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}

      {selectedJobId && selectedJob && (
        <div className="assessment-workspace">
          <div className="workspace-header">
            <h2>Assessment for: {selectedJob.title}</h2>
            {saving && <div className="spinner"></div>}
          </div>

          <div className="workspace-content">
            <div className="builder-section">
              <h3>Builder</h3>
              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading assessment...</p>
                </div>
              ) : assessment ? (
                <AssessmentBuilder
                  assessment={assessment}
                  onChange={setAssessment}
                  onSave={saveAssessment}
                  saving={saving}
                />
              ) : null}
            </div>

            <div className="preview-section">
              <h3>Preview</h3>
              {assessment && <AssessmentPreview assessment={assessment} />}
            </div>
          </div>
        </div>
      )}

      {!selectedJobId && jobs.length === 0 && (
        <div
          className="empty-state"
          style={{
            textAlign: "center",
            padding: "3rem",
            background: "white",
            borderRadius: "12px",
          }}
        >
          <h3>No active jobs found</h3>
          <p>Create some active jobs first to build assessments.</p>
        </div>
      )}
    </div>
  );
};

export default AssessmentsPage;
