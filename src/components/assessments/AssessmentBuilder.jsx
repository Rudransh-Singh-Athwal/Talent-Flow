import React, { useState } from "react";
import QuestionTypes from "./QuestionTypes";

const AssessmentBuilder = ({ assessment, onChange, onSave, saving }) => {
  const [activeSection, setActiveSection] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(null);

  const updateAssessment = (updates) => {
    onChange({ ...assessment, ...updates });
  };

  const addSection = () => {
    const newSection = {
      title: `Section ${assessment.sections.length + 1}`,
      questions: [],
    };
    updateAssessment({
      sections: [...assessment.sections, newSection],
    });
  };

  const updateSection = (sectionIndex, updates) => {
    const sections = [...assessment.sections];
    sections[sectionIndex] = { ...sections[sectionIndex], ...updates };
    updateAssessment({ sections });
  };

  const removeSection = (sectionIndex) => {
    if (assessment.sections.length <= 1) return;
    const sections = assessment.sections.filter((_, i) => i !== sectionIndex);
    updateAssessment({ sections });
    setActiveSection(Math.min(activeSection, sections.length - 1));
  };

  const addQuestion = (sectionIndex) => {
    const newQuestion = {
      id: Date.now(),
      type: "short-text",
      question: "New Question",
      required: false,
    };

    const sections = [...assessment.sections];
    sections[sectionIndex].questions.push(newQuestion);
    updateAssessment({ sections });

    setActiveQuestion({
      sectionIndex,
      questionIndex: sections[sectionIndex].questions.length - 1,
    });
  };

  const updateQuestion = (sectionIndex, questionIndex, updates) => {
    const sections = [...assessment.sections];
    sections[sectionIndex].questions[questionIndex] = {
      ...sections[sectionIndex].questions[questionIndex],
      ...updates,
    };
    updateAssessment({ sections });
  };

  const removeQuestion = (sectionIndex, questionIndex) => {
    const sections = [...assessment.sections];
    sections[sectionIndex].questions = sections[sectionIndex].questions.filter(
      (_, i) => i !== questionIndex
    );
    updateAssessment({ sections });
    setActiveQuestion(null);
  };

  const handleSave = () => {
    onSave(assessment);
  };

  const currentSection = assessment.sections[activeSection];

  return (
    <div className="assessment-builder">
      {/* Assessment Title */}
      <div className="builder-section">
        <label className="form-label">Assessment Title</label>
        <input
          type="text"
          className="form-input"
          value={assessment.title || ""}
          onChange={(e) => updateAssessment({ title: e.target.value })}
          placeholder="Enter assessment title..."
        />
      </div>

      {/* Sections Management */}
      <div className="builder-section">
        <div className="sections-header">
          <h4>Sections</h4>
          <button className="btn btn-secondary btn-small" onClick={addSection}>
            Add Section
          </button>
        </div>

        <div className="sections-tabs">
          {assessment.sections.map((section, index) => (
            <div
              key={index}
              className={`section-tab ${
                index === activeSection ? "active" : ""
              }`}
              onClick={() => setActiveSection(index)}
            >
              <span>{section.title}</span>
              {assessment.sections.length > 1 && (
                <button
                  className="remove-section"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSection(index);
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Section Editor */}
      {currentSection && (
        <div className="builder-section">
          <div className="section-editor">
            <div className="section-header">
              <input
                type="text"
                className="form-input section-title-input"
                value={currentSection.title}
                onChange={(e) =>
                  updateSection(activeSection, { title: e.target.value })
                }
                placeholder="Section title..."
              />
              <button
                className="btn btn-primary btn-small"
                onClick={() => addQuestion(activeSection)}
              >
                Add Question
              </button>
            </div>

            {/* Questions List */}
            <div className="questions-list">
              {currentSection.questions.map((question, questionIndex) => (
                <div
                  key={question.id || questionIndex}
                  className={`question-item ${
                    activeQuestion?.sectionIndex === activeSection &&
                    activeQuestion?.questionIndex === questionIndex
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveQuestion({
                      sectionIndex: activeSection,
                      questionIndex,
                    })
                  }
                >
                  <div className="question-header">
                    <span className="question-type">{question.type}</span>
                    <span className="question-text">{question.question}</span>
                    <button
                      className="btn-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeQuestion(activeSection, questionIndex);
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Question Editor */}
      {activeQuestion &&
        currentSection.questions[activeQuestion.questionIndex] && (
          <div className="builder-section">
            <h4>Edit Question</h4>
            <QuestionTypes
              question={currentSection.questions[activeQuestion.questionIndex]}
              onChange={(updates) =>
                updateQuestion(
                  activeQuestion.sectionIndex,
                  activeQuestion.questionIndex,
                  updates
                )
              }
            />
          </div>
        )}

      {/* Save Button */}
      <div className="builder-actions">
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? <div className="spinner"></div> : "Save Assessment"}
        </button>
      </div>
    </div>
  );
};

export default AssessmentBuilder;
