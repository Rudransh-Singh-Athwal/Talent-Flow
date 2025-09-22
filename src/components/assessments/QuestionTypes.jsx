import React from "react";

const QuestionTypes = ({ question, onChange }) => {
  const handleChange = (updates) => {
    onChange({ ...question, ...updates });
  };

  const addOption = () => {
    const options = question.options || [];
    handleChange({ options: [...options, ""] });
  };

  const updateOption = (index, value) => {
    const options = [...(question.options || [])];
    options[index] = value;
    handleChange({ options });
  };

  const removeOption = (index) => {
    const options = (question.options || []).filter((_, i) => i !== index);
    handleChange({ options });
  };

  return (
    <div className="question-editor">
      {/* Question Type */}
      <div className="form-group">
        <label className="form-label">Question Type</label>
        <select
          className="form-select"
          value={question.type}
          onChange={(e) => handleChange({ type: e.target.value })}
        >
          <option value="short-text">Short Text</option>
          <option value="long-text">Long Text</option>
          <option value="single-choice">Single Choice</option>
          <option value="multi-choice">Multiple Choice</option>
          <option value="numeric">Numeric</option>
          <option value="file-upload">File Upload</option>
        </select>
      </div>

      {/* Question Text */}
      <div className="form-group">
        <label className="form-label">Question</label>
        <input
          type="text"
          className="form-input"
          value={question.question || ""}
          onChange={(e) => handleChange({ question: e.target.value })}
          placeholder="Enter your question..."
        />
      </div>

      {/* Required Toggle */}
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={question.required || false}
            onChange={(e) => handleChange({ required: e.target.checked })}
          />
          Required Question
        </label>
      </div>

      {/* Type-specific options */}
      {(question.type === "single-choice" ||
        question.type === "multi-choice") && (
        <div className="form-group">
          <label className="form-label">Options</label>
          <div className="options-editor">
            {(question.options || []).map((option, index) => (
              <div key={index} className="option-row">
                <input
                  type="text"
                  className="form-input"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                <button
                  type="button"
                  className="btn btn-danger btn-small"
                  onClick={() => removeOption(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary btn-small"
              onClick={addOption}
            >
              Add Option
            </button>
          </div>
        </div>
      )}

      {question.type === "short-text" && (
        <div className="form-group">
          <label className="form-label">Max Length</label>
          <input
            type="number"
            className="form-input"
            value={question.maxLength || ""}
            onChange={(e) =>
              handleChange({ maxLength: parseInt(e.target.value) || undefined })
            }
            placeholder="Maximum character length"
          />
        </div>
      )}

      {question.type === "long-text" && (
        <div className="form-group">
          <label className="form-label">Max Length</label>
          <input
            type="number"
            className="form-input"
            value={question.maxLength || ""}
            onChange={(e) =>
              handleChange({ maxLength: parseInt(e.target.value) || undefined })
            }
            placeholder="Maximum character length"
          />
        </div>
      )}

      {question.type === "numeric" && (
        <div className="numeric-constraints">
          <div className="form-group">
            <label className="form-label">Minimum Value</label>
            <input
              type="number"
              className="form-input"
              value={question.min || ""}
              onChange={(e) =>
                handleChange({ min: parseFloat(e.target.value) || undefined })
              }
              placeholder="Minimum value"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Maximum Value</label>
            <input
              type="number"
              className="form-input"
              value={question.max || ""}
              onChange={(e) =>
                handleChange({ max: parseFloat(e.target.value) || undefined })
              }
              placeholder="Maximum value"
            />
          </div>
        </div>
      )}

      {/* Conditional Logic */}
      <div className="form-group">
        <label className="form-label">Show Condition (optional)</label>
        <input
          type="text"
          className="form-input"
          value={question.condition || ""}
          onChange={(e) => handleChange({ condition: e.target.value })}
          placeholder="e.g., Q1 === 'Yes'"
        />
        <small className="form-help">
          Show this question only when condition is met
        </small>
      </div>
    </div>
  );
};

export default QuestionTypes;
