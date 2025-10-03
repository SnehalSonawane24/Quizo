import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/editQuiz.css";

export default function EditQuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quizDetails, setQuizDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuizDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`quizzes/quizzes/${quizId}/`);
        if (res.data.Success) setQuizDetails(res.data.Data);
      } catch (err) {
        console.error("Error fetching quiz:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizDetails();
  }, [quizId]);

  if (loading) return <p className="loading">Loading quiz data...</p>;
  if (!quizDetails) return <p className="no-quiz">No quiz found.</p>;

  const handleQuizChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setQuizDetails((prev) => ({ ...prev, [name]: val }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quizDetails.questions];
    updatedQuestions[index][field] = value;
    setQuizDetails((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const updatedQuestions = [...quizDetails.questions];
    updatedQuestions[qIndex].options[oIndex][field] = value;
    setQuizDetails((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const addQuestion = () => {
    const newQuestion = { text: "", question_type: "mcq", marks: 1, options: [] };
    setQuizDetails((prev) => ({ ...prev, questions: [...prev.questions, newQuestion] }));
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = [...quizDetails.questions];
    updatedQuestions.splice(index, 1);
    setQuizDetails((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const addOption = (qIndex) => {
    const newOption = { text: "", image: null, is_correct: false };
    const updatedQuestions = [...quizDetails.questions];
    updatedQuestions[qIndex].options.push(newOption);
    setQuizDetails((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const deleteOption = (qIndex, oIndex) => {
    const updatedQuestions = [...quizDetails.questions];
    updatedQuestions[qIndex].options.splice(oIndex, 1);
    setQuizDetails((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Prepare payload according to backend serializer
      const payload = {
        ...quizDetails,
        questions: quizDetails.questions.map((q) => ({
          ...(q.id && { id: q.id }),
          text: q.text,
          marks: Number(q.marks),
          question_type: q.question_type,
          options: q.options.map((o) => ({
            ...(o.id && { id: o.id }),
            text: o.text,
            image: o.image || null,
            is_correct: o.is_correct,
          })),
        })),
      };

      const res = await api.put(`quizzes/quizzes/${quizId}/`, payload);
      if (res.data.Success) {
        alert("Quiz updated successfully!");
        navigate("/admin/dashboard");
      }
    } catch (err) {
      console.error("Error updating quiz:", err);
      alert("Failed to update quiz. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="edit-quiz-page">
      <button className="back-btn" onClick={() => navigate("/admin/dashboard")}>
        ← Back to Dashboard
      </button>

      <h1>Edit Quiz</h1>

      {/* Quiz metadata */}
      <div className="quiz-meta">
        {[
          { label: "Title", name: "title", type: "text" },
          { label: "Description", name: "description", type: "textarea" },
          { label: "Category", name: "category", type: "text" },
          { label: "Time Limit (mins)", name: "time_limit", type: "number" },
          { label: "Passing Score", name: "passing_score", type: "number" },
          { label: "Max Attempts", name: "max_attempts", type: "number" },
        ].map((field) => (
          <label key={field.name}>
            {field.label}:
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                value={quizDetails[field.name]}
                onChange={handleQuizChange}
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={quizDetails[field.name]}
                onChange={handleQuizChange}
              />
            )}
          </label>
        ))}

        {[
          { label: "Negative Marking", name: "negative_marking" },
          { label: "Shuffle Questions", name: "shuffle_questions" },
          { label: "Shuffle Options", name: "shuffle_options" },
          { label: "Show Score Post Quiz", name: "show_score_post_quiz" },
          { label: "Allow Back Navigation", name: "allow_back_navigation" },
        ].map((field) => (
          <label key={field.name}>
            {field.label}:
            <input
              type="checkbox"
              name={field.name}
              checked={quizDetails[field.name]}
              onChange={handleQuizChange}
            />
          </label>
        ))}

        <label>
          Difficulty:
          <select
            name="difficulty"
            value={quizDetails.difficulty}
            onChange={handleQuizChange}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
      </div>

      {/* Questions */}
      <h2>Questions</h2>
      <button className="add-btn" onClick={addQuestion}>
        + Add Question
      </button>

      {quizDetails.questions.map((q, qIndex) => (
        <div key={q.id || qIndex} className="question-card">
          <div className="question-header">
            <p>
              <strong>Q{qIndex + 1}:</strong>{" "}
              <input
                type="text"
                value={q.text}
                onChange={(e) => handleQuestionChange(qIndex, "text", e.target.value)}
              />
            </p>
            <p>
              Marks:{" "}
              <input
                type="number"
                value={q.marks}
                onChange={(e) => handleQuestionChange(qIndex, "marks", e.target.value)}
              />
            </p>
            <p>
              Type:{" "}
              <select
                value={q.question_type}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "question_type", e.target.value)
                }
              >
                <option value="mcq">MCQ</option>
                <option value="tf">True/False</option>
              </select>
            </p>
            <button className="delete-btn" onClick={() => deleteQuestion(qIndex)}>
              Delete Question
            </button>
          </div>

          <div className="options">
            {q.options.map((opt, oIndex) => (
              <div key={opt.id || oIndex} className={`option ${opt.is_correct ? "correct" : ""}`}>
                <span>{String.fromCharCode(65 + oIndex)}.</span>
                <input
                  type="text"
                  value={opt.text}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, "text", e.target.value)}
                />
                <label>
                  Correct:
                  <input
                    type="checkbox"
                    checked={opt.is_correct}
                    onChange={(e) =>
                      handleOptionChange(qIndex, oIndex, "is_correct", e.target.checked)
                    }
                  />
                </label>
                <button onClick={() => deleteOption(qIndex, oIndex)}>Delete Option</button>
              </div>
            ))}
            <button className="add-btn" onClick={() => addOption(qIndex)}>
              + Add Option
            </button>
          </div>
        </div>
      ))}

      <button className="save-btn" onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Quiz"}
      </button>
    </div>
  );
}