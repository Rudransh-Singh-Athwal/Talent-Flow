import React from "react";
import { List } from "react-window";
import { Link } from "react-router-dom";

const CandidateRow = ({ index, style, data }) => {
  const { candidates, onStageUpdate } = data;
  const candidate = candidates[index];

  const handleStageChange = (e) => {
    onStageUpdate(candidate.id, e.target.value);
  };

  return (
    <div style={style} className="candidate-row">
      <div className="candidate-item">
        <div className="candidate-info">
          <div className="candidate-name">
            <Link to={`/candidates/${candidate.id}`} className="candidate-link">
              {candidate.name}
            </Link>
          </div>
          <div className="candidate-email">{candidate.email}</div>
        </div>

        <div className="candidate-stage">
          <select
            className="form-select"
            value={candidate.stage}
            onChange={handleStageChange}
          >
            <option value="applied">Applied</option>
            <option value="screen">Screening</option>
            <option value="tech">Technical</option>
            <option value="offer">Offer</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="candidate-meta">
          <span className={`status-badge status-${candidate.stage}`}>
            {candidate.stage}
          </span>
          <small>{new Date(candidate.createdAt).toLocaleDateString()}</small>
        </div>
      </div>
    </div>
  );
};

const CandidatesList = ({
  candidates,
  loading,
  pagination,
  onPageChange,
  onStageUpdate,
}) => {
  if (loading) {
    return (
      <div
        className="loading-state"
        style={{ textAlign: "center", padding: "3rem" }}
      >
        <div className="spinner"></div>
        <p>Loading candidates...</p>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div
        className="empty-state"
        style={{
          textAlign: "center",
          padding: "3rem",
          background: "white",
          borderRadius: "12px",
        }}
      >
        <h3>No candidates found</h3>
        <p>Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="candidates-list">
      <div className="candidates-header">
        <h3>Candidates ({pagination.total})</h3>
      </div>

      <div
        className="virtualized-list"
        style={{ height: "600px", background: "white", borderRadius: "12px" }}
      >
        <List
          height={600}
          itemCount={candidates.length}
          itemSize={80}
          itemData={{ candidates, onStageUpdate }}
        >
          {CandidateRow}
        </List>
      </div>

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            Previous
          </button>

          <span>
            Page {pagination.page} of {pagination.totalPages}({pagination.total}{" "}
            total)
          </span>

          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CandidatesList;
