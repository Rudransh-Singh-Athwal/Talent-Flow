import React from "react";

const JobFilters = ({ filters, onFiltersChange, loading }) => {
  const handleInputChange = (key, value) => {
    onFiltersChange({ [key]: value });
  };

  return (
    <div className="filters">
      <div className="filter-group">
        <label className="form-label">Search</label>
        <input
          type="text"
          className="form-input"
          placeholder="Search by title or tags..."
          value={filters.search}
          onChange={(e) => handleInputChange("search", e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="filter-group">
        <label className="form-label">Status</label>
        <select
          className="form-select"
          value={filters.status}
          onChange={(e) => handleInputChange("status", e.target.value)}
          disabled={loading}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="form-label">Page Size</label>
        <select
          className="form-select"
          value={filters.pageSize}
          onChange={(e) =>
            handleInputChange("pageSize", parseInt(e.target.value))
          }
          disabled={loading}
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
        </select>
      </div>
    </div>
  );
};

export default JobFilters;
