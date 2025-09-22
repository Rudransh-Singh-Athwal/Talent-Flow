import React, { useState, useEffect } from "react";

const JobForm = ({ job, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    status: "active",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || "",
        slug: job.slug || "",
        status: job.status || "active",
        tags: job.tags || [],
      });
    }
  }, [job]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!job && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .trim();
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, job]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const url = job ? `/api/jobs/${job.id}` : "/api/jobs";
      const method = job ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save job");
      }

      onSave();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="job-form">
      {errors.submit && (
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
          {errors.submit}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Title *</label>
        <input
          type="text"
          className={`form-input ${errors.title ? "error" : ""}`}
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder="e.g., Senior Frontend Developer"
          disabled={loading}
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Slug *</label>
        <input
          type="text"
          className={`form-input ${errors.slug ? "error" : ""}`}
          value={formData.slug}
          onChange={(e) => handleInputChange("slug", e.target.value)}
          placeholder="senior-frontend-developer"
          disabled={loading}
        />
        {errors.slug && <span className="error-text">{errors.slug}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Status</label>
        <select
          className="form-select"
          value={formData.status}
          onChange={(e) => handleInputChange("status", e.target.value)}
          disabled={loading}
        >
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Tags</label>
        <div className="tag-input-container">
          <input
            type="text"
            className="form-input"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag..."
            disabled={loading}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddTag(e);
              }
            }}
          />
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={handleAddTag}
            disabled={loading || !tagInput.trim()}
          >
            Add
          </button>
        </div>

        {formData.tags.length > 0 && (
          <div className="tags-list">
            {formData.tags.map((tag, index) => (
              <span key={index} className="tag removable">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  disabled={loading}
                  className="tag-remove"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <div className="spinner"></div>
          ) : job ? (
            "Update Job"
          ) : (
            "Create Job"
          )}
        </button>
      </div>
    </form>
  );
};

export default JobForm;
