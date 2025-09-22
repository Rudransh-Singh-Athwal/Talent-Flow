import React, { useState, useEffect } from "react";

const AssessmentPreview = ({ assessment }) => {
  const [responses, setResponses] = useState({});
  const [errors, setErrors] = useState({});

  const handleResponseChange = (questionId, value) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors((prev) => ({ ...prev, [questionId]: "" }));
    }
  };

  const validateQuestion = (question) => {
    const response = responses[question.id];

    if (
      question.required &&
      (!response || (Array.isArray(response) && response.length === 0))
    ) {
      return "This field is required";
    }

    if (
      question.type === "numeric" &&
      response !== undefined &&
      response !== ""
    ) {
      const num = parseFloat(response);
      if (isNaN(num)) {
        return "Please enter a valid number";
      }
      if (question.min !== undefined && num < question.min) {
        return `Value must be at least ${question.min}`;
      }
      if (question.max !== undefined && num > question.max) {
        return `Value must be at most ${question.max}`;
      }
    }

    if (question.type === "short-text" || question.type === "long-text") {
      if (
        question.maxLength &&
        response &&
        response.length > question.maxLength
      ) {
        return `Maximum ${question.maxLength} characters allowed`;
      }
    }

    return null;
  };

  const shouldShowQuestion = (question, sectionQuestions) => {
    if (!question.condition) return true;

    // Simple condition parsing (e.g., "Q1 === 'Yes'")
    try {
      const condition = question.condition.replace(
        /Q(\d+)/g,
        (match, questionNum) => {
          const targetQuestion = sectionQuestions[parseInt(questionNum) - 1];
          if (targetQuestion) {
            const response = responses[targetQuestion.id];
            return JSON.stringify(response);
          }
          return "null";
        }
      );

      return eval(condition);
    } catch (e) {
      return true; // Show by default if condition parsing fails
    }
  };

  const renderQuestion = (question, questionIndex, sectionQuestions) => {
    if (!shouldShowQuestion(question, sectionQuestions)) {
      return null;
    }

    const error = errors[question.id];
    const response = responses[question.id];

    return (
      <div key={question.id} className="preview-question">
        <label className="preview-question-label">
          {questionIndex + 1}. {question.question}
          {question.required && <span className="required">*</span>}
        </label>

        {question.type === "short-text" && (
          <input
            type="text"
            className={`form-input ${error ? "error" : ""}`}
            value={response || ""}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            maxLength={question.maxLength}
          />
        )}

        {question.type === "long-text" && (
          <textarea
            className={`form-textarea ${error ? "error" : ""}`}
            value={response || ""}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            maxLength={question.maxLength}
            rows={4}
          />
        )}

        {question.type === "numeric" && (
          <input
            type="number"
            className={`form-input ${error ? "error" : ""}`}
            value={response || ""}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            min={question.min}
            max={question.max}
          />
        )}

        {question.type === "single-choice" && (
          <div className="radio-group">
            {(question.options || []).map((option, optionIndex) => (
              <label key={optionIndex} className="radio-label">
                <input
                  type="radio"
                  name={`question_${question.id}`}
                  value={option}
                  checked={response === option}
                  onChange={(e) =>
                    handleResponseChange(question.id, e.target.value)
                  }
                />
                {option}
              </label>
            ))}
          </div>
        )}

        {question.type === "multi-choice" && (
          <div className="checkbox-group">
            {(question.options || []).map((option, optionIndex) => (
              <label key={optionIndex} className="checkbox-label">
                <input
                  type="checkbox"
                  value={option}
                  checked={(response || []).includes(option)}
                  onChange={(e) => {
                    const currentResponses = response || [];
                    const newResponses = e.target.checked
                      ? [...currentResponses, option]
                      : currentResponses.filter((r) => r !== option);
                    handleResponseChange(question.id, newResponses);
                  }}
                />
                {option}
              </label>
            ))}
          </div>
        )}

        {question.type === "file-upload" && (
          <div className="file-upload-placeholder">
            <input type="file" className="form-input" disabled />
            <small className="form-help">
              File upload functionality (placeholder)
            </small>
          </div>
        )}

        {error && <div className="error-text">{error}</div>}

        {question.maxLength &&
          (question.type === "short-text" || question.type === "long-text") && (
            <small className="character-count">
              {(response || "").length} / {question.maxLength} characters
            </small>
          )}
      </div>
    );
  };

  const validateForm = () => {
    const newErrors = {};
    let hasErrors = false;

    assessment.sections.forEach((section) => {
      section.questions.forEach((question) => {
        if (shouldShowQuestion(question, section.questions)) {
          const error = validateQuestion(question);
          if (error) {
            newErrors[question.id] = error;
            hasErrors = true;
          }
        }
      });
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      alert("Assessment submitted successfully! (This is just a preview)");
    }
  };

  if (!assessment || !assessment.sections || assessment.sections.length === 0) {
    return (
      <div className="preview-empty">
        <p>No assessment content to preview.</p>
      </div>
    );
  }

  return (
    <div className="assessment-preview">
      <div className="preview-header">
        <h3>{assessment.title || "Untitled Assessment"}</h3>
      </div>

      <form onSubmit={handleSubmit} className="preview-form">
        {assessment.sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="preview-section">
            <h4 className="section-title">{section.title}</h4>

            {section.questions.map((question, questionIndex) =>
              renderQuestion(question, questionIndex, section.questions)
            )}
          </div>
        ))}

        <div className="preview-actions">
          <button type="submit" className="btn btn-primary">
            Submit Assessment (Preview)
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssessmentPreview;
