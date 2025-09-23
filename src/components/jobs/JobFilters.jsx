import React from "react";

const JobFilters = ({
  filters,
  onFiltersChange,
  onSearch,
  onStatusChange,
  loading,
}) => {
  const handleSearchInputChange = (e) => {
    onFiltersChange({ search: e.target.value });
  };

  const handleStatusChange = (e) => {
    onStatusChange(e.target.value);
  };

  const handlePageSizeChange = (e) => {
    onFiltersChange({ pageSize: parseInt(e.target.value) });
  };

  const handleKeyPress = (e) => {
    // Allow Enter key to trigger search
    if (e.key === "Enter") {
      onSearch();
    }
  };

  const handleClearSearch = () => {
    onFiltersChange({ search: "" });
    onSearch(); // Immediately apply the clear
  };

  return (
    <div
      className="job-filters"
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        marginBottom: "1.5rem",
        padding: "1rem",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        flexWrap: "wrap",
      }}
    >
      {/* Search Input with Button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          flex: "1",
          minWidth: "200px",
        }}
      >
        <input
          type="text"
          placeholder="Search jobs..."
          value={filters.search}
          onChange={handleSearchInputChange}
          onKeyPress={handleKeyPress}
          disabled={loading}
          style={{
            padding: "0.5rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            flex: "1",
            minWidth: "150px",
          }}
        />
        <button
          onClick={onSearch}
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
        {filters.search && (
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

      {/* Status Filter */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <label style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
          Status:
        </label>
        <select
          value={filters.status}
          onChange={handleStatusChange}
          disabled={loading}
          style={{
            padding: "0.5rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            minWidth: "120px",
          }}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Page Size Filter */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <label style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
          Per Page:
        </label>
        <select
          value={filters.pageSize}
          onChange={handlePageSizeChange}
          disabled={loading}
          style={{
            padding: "0.5rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            minWidth: "80px",
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
};

export default JobFilters;
