import React from "react";
import "../styles/questionCard.css";

export default function QuestionCard({
  question,
  selectedOptions,
  setSelectedOptions,
  questionNumber,
}) {
  const handleOptionChange = (optionId) => {
    setSelectedOptions([optionId]); // single-choice
  };

  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div className="question-card">
      <h3 className="question-text">
        {questionNumber}. {question.text}
      </h3>
      <div className="options-container">
        {question.options &&
          question.options.map((opt, index) => (
            <label key={opt.id} className="option-item">
              <input
                type="radio"
                name={`question-${question.id}`}
                value={opt.id}
                checked={selectedOptions.includes(opt.id)}
                onChange={() => handleOptionChange(opt.id)}
              />
              <span className="option-label">
                {optionLabels[index] || String.fromCharCode(65 + index)}.
              </span>{" "}
              {opt.text}
            </label>
          ))}
      </div>
    </div>
  );
}
