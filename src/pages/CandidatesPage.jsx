import React, { useState, useEffect } from "react";
import CandidatesList from "../components/candidates/CandidatesList";
import KanbanBoard from "../components/candidates/KanbanBoard";

const CandidatesPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // 'list' or 'kanban'

  // Separate applied filters (used for API calls) from form filters (used for input)
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    stage: "",
    page: 1,
    pageSize: 50,
  });

  const [formFilters, setFormFilters] = useState({
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
        `/api/candidates?${new URLSearchParams(appliedFilters)}`
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
  }, [appliedFilters]);

  // Handle filter changes (updates form but doesn't trigger API call)
  const handleSearchChange = (search) => {
    setFormFilters((prev) => ({ ...prev, search }));
  };

  // Handle search button click (applies filters and triggers API call)
  const handleSearch = () => {
    const newAppliedFilters = { ...formFilters, page: 1 };
    setAppliedFilters(newAppliedFilters);
  };

  // Handle stage filter change (immediate effect for dropdown)
  const handleStageFilterChange = (stage) => {
    const newFilters = { ...formFilters, stage, page: 1 };
    setFormFilters(newFilters);
    setAppliedFilters(newFilters);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    const newAppliedFilters = { ...appliedFilters, page };
    setAppliedFilters(newAppliedFilters);
    setFormFilters((prev) => ({ ...prev, page }));
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setFormFilters((prev) => ({ ...prev, search: "" }));
    const newAppliedFilters = { ...formFilters, search: "", page: 1 };
    setAppliedFilters(newAppliedFilters);
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
      <div
        className="filters"
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "flex-end",
          marginBottom: "1.5rem",
          padding: "1rem",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          flexWrap: "wrap",
        }}
      >
        <div className="filter-group" style={{ flex: "1", minWidth: "200px" }}>
          <label
            className="form-label"
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "500",
            }}
          >
            Search
          </label>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by name or email..."
              value={formFilters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              style={{
                flex: "1",
                padding: "0.5rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="btn btn-primary"
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                whiteSpace: "nowrap",
              }}
            >
              {loading ? "Searching..." : "Search"}
            </button>
            {formFilters.search && (
              <button
                onClick={handleClearSearch}
                disabled={loading}
                style={{
                  padding: "0.5rem",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                }}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="filter-group" style={{ minWidth: "150px" }}>
          <label
            className="form-label"
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "500",
            }}
          >
            Stage
          </label>
          <select
            className="form-select"
            value={formFilters.stage}
            onChange={(e) => handleStageFilterChange(e.target.value)}
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
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
