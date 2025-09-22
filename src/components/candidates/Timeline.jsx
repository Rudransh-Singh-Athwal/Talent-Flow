import React from "react";

const Timeline = ({ timeline }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const getStageColor = (stage) => {
    const colors = {
      applied: "#007aff",
      screen: "#ff9500",
      tech: "#5856d6",
      offer: "#34c759",
      hired: "#30d158",
      rejected: "#ff3b30",
    };
    return colors[stage] || "#8e8e93";
  };

  if (!timeline || timeline.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h3>Timeline</h3>
        </div>
        <div className="empty-timeline">
          <p>No timeline events yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3>Timeline</h3>
      </div>
      <div className="timeline">
        {timeline.map((event, index) => (
          <div key={event.id || index} className="timeline-event">
            <div
              className="timeline-marker"
              style={{ backgroundColor: getStageColor(event.stage) }}
            ></div>
            <div className="timeline-content">
              <div className="timeline-stage">
                <span className={`status-badge status-${event.stage}`}>
                  {event.stage.charAt(0).toUpperCase() + event.stage.slice(1)}
                </span>
              </div>
              <div className="timeline-time">{formatDate(event.timestamp)}</div>
              {event.notes && (
                <div className="timeline-notes">{event.notes}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
