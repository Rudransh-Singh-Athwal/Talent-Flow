import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import JobCard from "./JobCard";

const JobsList = ({
  jobs,
  loading,
  pagination,
  onPageChange,
  onEditJob,
  onArchiveJob,
  onReorderJob,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = jobs.findIndex((job) => job.id === active.id);
      const newIndex = jobs.findIndex((job) => job.id === over.id);

      const oldOrder = jobs[oldIndex].order;
      const newOrder = jobs[newIndex].order;

      onReorderJob(oldOrder, newOrder);
    }
  };

  if (loading) {
    return (
      <div
        className="loading-state"
        style={{ textAlign: "center", padding: "3rem" }}
      >
        <div className="spinner"></div>
        <p>Loading jobs...</p>
      </div>
    );
  }

  if (jobs.length === 0) {
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
        <h3>No jobs found</h3>
        <p>Try adjusting your filters or create a new job.</p>
      </div>
    );
  }

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={jobs.map((job) => job.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="jobs-grid">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={onEditJob}
                onArchive={onArchiveJob}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

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

export default JobsList;
