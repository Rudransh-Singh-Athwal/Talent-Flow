import React, { useState, useEffect } from "react";
import CandidatesList from "../components/candidates/CandidatesList";
import KanbanBoard from "../components/candidates/KanbanBoard";

const CandidatesPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // 'list' or 'kanban'
  const [filters, setFilters] = useState({
    search: "",
    stage: "",
    page: 1,
    pageSize: 50,
  });
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState("");

  const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];

  // Fetch candidates
  const fetchCandidates = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/api/candidates?${new URLSearchParams(filters)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch candidates");
      }

      const data = await response.json();
      setCandidates(data.data);
      setPagination({
        total: data.total,
        page: data.page,
        totalPages: data.totalPages,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [filters]);

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // Handle stage update
  const handleStageUpdate = async (candidateId, newStage, notes = "") => {
    try {
      const response = await fetch(`/api/candidates/${candidateId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage, notes }),
      });

      if (!response.ok) {
        throw new Error("Failed to update candidate");
      }

      // Update local state
      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate.id === candidateId
            ? { ...candidate, stage: newStage }
            : candidate
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Candidates Management</h1>
        <div className="view-switcher">
          <button
            className={`btn ${
              view === "list" ? "btn-primary" : "btn-secondary"
            }`}
            onClick={() => setView("list")}
          >
            List View
          </button>
          <button
            className={`btn ${
              view === "kanban" ? "btn-primary" : "btn-secondary"
            }`}
            onClick={() => setView("kanban")}
          >
            Kanban View
          </button>
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

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label className="form-label">Search</label>
          <input
            type="text"
            className="form-input"
            placeholder="Search by name or email..."
            value={filters.search}
            onChange={(e) => handleFiltersChange({ search: e.target.value })}
            disabled={loading}
          />
        </div>

        <div className="filter-group">
          <label className="form-label">Stage</label>
          <select
            className="form-select"
            value={filters.stage}
            onChange={(e) => handleFiltersChange({ stage: e.target.value })}
            disabled={loading}
          >
            <option value="">All Stages</option>
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {stage.charAt(0).toUpperCase() + stage.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {view === "list" ? (
        <CandidatesList
          candidates={candidates}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onStageUpdate={handleStageUpdate}
        />
      ) : (
        <KanbanBoard
          candidates={candidates}
          loading={loading}
          stages={stages}
          onStageUpdate={handleStageUpdate}
        />
      )}
    </div>
  );
};

export default CandidatesPage;
