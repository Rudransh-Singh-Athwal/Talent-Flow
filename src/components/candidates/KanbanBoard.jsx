import React from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "react-router-dom";

const CandidateCard = ({ candidate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: candidate.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="candidate-card"
    >
      <div className="candidate-card-content">
        <Link to={`/candidates/${candidate.id}`} className="candidate-name">
          {candidate.name}
        </Link>
        <p className="candidate-email">{candidate.email}</p>
        <small>{new Date(candidate.createdAt).toLocaleDateString()}</small>
      </div>
    </div>
  );
};

const KanbanColumn = ({ stage, candidates, onStageUpdate }) => {
  const stageCandidates = candidates.filter((c) => c.stage === stage);

  return (
    <div className="kanban-column">
      <div className="kanban-column-header">
        <h3>{stage.charAt(0).toUpperCase() + stage.slice(1)}</h3>
        <span className="candidate-count">{stageCandidates.length}</span>
      </div>

      <SortableContext
        items={stageCandidates.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="kanban-column-content">
          {stageCandidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

const KanbanBoard = ({ candidates, loading, stages, onStageUpdate }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const candidateId = active.id;
    const candidate = candidates.find((c) => c.id === candidateId);

    // Determine the new stage based on where it was dropped
    let newStage = null;

    // Check if dropped on another candidate (get that candidate's stage)
    const overCandidate = candidates.find((c) => c.id === over.id);
    if (overCandidate) {
      newStage = overCandidate.stage;
    } else {
      // Dropped on a column, determine stage from DOM structure
      const overElement = document.querySelector(
        `[data-rbd-droppable-id="${over.id}"]`
      );
      if (overElement) {
        newStage = over.id;
      }
    }

    if (newStage && candidate && candidate.stage !== newStage) {
      onStageUpdate(candidateId, newStage);
    }
  };

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

  return (
    <div className="kanban-board">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="kanban-columns">
          {stages.map((stage) => (
            <KanbanColumn
              key={stage}
              stage={stage}
              candidates={candidates}
              onStageUpdate={onStageUpdate}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
