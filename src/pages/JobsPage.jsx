import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import JobsList from "../components/jobs/JobsList";
import JobFilters from "../components/jobs/JobFilters";
import JobForm from "../components/jobs/JobForm";
import Modal from "../components/ui/Modal";

const JobsPage = () => {
  const { jobId } = useParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    page: 1,
    pageSize: 10,
  });
  const [pagination, setPagination] = useState({});
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [error, setError] = useState("");

  // Fetch jobs
  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/jobs?${new URLSearchParams(filters)}`);

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();
      setJobs(data.data);
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

  // Load specific job if jobId in URL
  const loadJobFromUrl = async () => {
    if (jobId) {
      try {
        const response = await fetch(`/api/jobs/${jobId}`);
        if (response.ok) {
          const job = await response.json();
          setEditingJob(job);
          setShowJobForm(true);
        }
      } catch (err) {
        setError("Job not found");
      }
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  useEffect(() => {
    loadJobFromUrl();
  }, [jobId]);

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // Handle job actions
  const handleCreateJob = () => {
    setEditingJob(null);
    setShowJobForm(true);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleJobSaved = () => {
    setShowJobForm(false);
    setEditingJob(null);
    fetchJobs();
  };

  const handleArchiveJob = async (jobId, archived) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: archived ? "archived" : "active" }),
      });

      if (!response.ok) {
        throw new Error("Failed to update job");
      }

      fetchJobs();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleJobReorder = async (fromOrder, toOrder) => {
    // Optimistic update
    const reorderedJobs = [...jobs];
    const draggedJob = reorderedJobs.find((job) => job.order === fromOrder);
    const targetJob = reorderedJobs.find((job) => job.order === toOrder);

    if (draggedJob && targetJob) {
      draggedJob.order = toOrder;
      targetJob.order = fromOrder;
      setJobs(reorderedJobs.sort((a, b) => a.order - b.order));
    }

    try {
      const response = await fetch(`/api/jobs/${draggedJob.id}/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromOrder, toOrder }),
      });

      if (!response.ok) {
        throw new Error("Reorder failed");
      }
    } catch (err) {
      // Rollback on error
      setError("Reorder failed - changes reverted");
      fetchJobs();
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Jobs Management</h1>
        <button className="btn btn-primary" onClick={handleCreateJob}>
          Create Job
        </button>
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

      <JobFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        loading={loading}
      />

      <JobsList
        jobs={jobs}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onEditJob={handleEditJob}
        onArchiveJob={handleArchiveJob}
        onReorderJob={handleJobReorder}
      />

      {showJobForm && (
        <Modal
          title={editingJob ? "Edit Job" : "Create Job"}
          onClose={() => {
            setShowJobForm(false);
            setEditingJob(null);
          }}
        >
          <JobForm
            job={editingJob}
            onSave={handleJobSaved}
            onCancel={() => {
              setShowJobForm(false);
              setEditingJob(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default JobsPage;
