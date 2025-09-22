import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const JobCard = ({ job, onEdit, onArchive }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="card job-card"
    >
      <div className="card-header">
        <div>
          <h3 className="card-title">{job.title}</h3>
          <p className="job-slug">/{job.slug}</p>
        </div>
        <div className="job-actions">
          <span className={`status-badge status-${job.status}`}>
            {job.status}
          </span>
          <button
            className="drag-handle btn btn-secondary btn-small"
            {...listeners}
            style={{ cursor: "grab" }}
          >
            ⋮⋮
          </button>
        </div>
      </div>

      <div className="job-tags">
        {job.tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="job-meta">
        <small>Created: {formatDate(job.createdAt)}</small>
        <small>Order: #{job.order}</small>
      </div>

      <div className="job-card-actions">
        <button
          className="btn btn-secondary btn-small"
          onClick={() => onEdit(job)}
        >
          Edit
        </button>
        <button
          className={`btn btn-small ${
            job.status === "active" ? "btn-danger" : "btn-primary"
          }`}
          onClick={() => onArchive(job.id, job.status === "active")}
        >
          {job.status === "active" ? "Archive" : "Activate"}
        </button>
      </div>
    </div>
  );
};

export default JobCard;
