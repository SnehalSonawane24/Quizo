import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import "../styles/quizDetail.css";

export default function QuizDetailPage() {
  const { quizId } = useParams();
  const [quizDetails, setQuizDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get(`quizzes/quizzes/${quizId}/`);
        if (response.data.Success) {
          setQuizDetails(response.data.Data);
        }
      } catch (error) {
        console.error("Error fetching quiz details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetails();
  }, [quizId]);

  const optionLetters = ["A", "B", "C", "D", "E", "F"];

  if (loading) return <p className="loading">Loading quiz details...</p>;
  if (!quizDetails) return <p className="no-quiz">No quiz found.</p>;

  return (
    <div className="quiz-detail-page">

      <Link to="/admin/dashboard" className="back-btn">← Back to Quiz List</Link>

      <div className="quiz-header">
        <h1>{quizDetails.title}</h1>
        <p className="quiz-description">{quizDetails.description}</p>
        <div className="quiz-meta">
          <span><strong>Category:</strong> {quizDetails.category}</span>
          <span><strong>Time Limit:</strong> {quizDetails.time_limit} mins</span>
          <span><strong>Total Questions:</strong> {quizDetails.total_questions}</span>
          <span><strong>Passing Score:</strong> {quizDetails.passing_score}</span>
        </div>
      </div>

      <h3>Questions</h3>
      <div className="questions-container">
        {quizDetails.questions.map((q, index) => (
          <div key={q.id} className="question-card">
            <p className="question-text">
              <strong>Q{index + 1}:</strong> {q.text} ({q.marks} marks)
            </p>
            <div className="options">
              {q.options.map((opt, optIndex) => (
                <div
                  key={opt.id}
                  className={`option ${opt.is_correct ? "correct" : ""}`}
                >
                  <span className="option-letter">{optionLetters[optIndex]}.</span>
                  <span className="option-text">{opt.text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}