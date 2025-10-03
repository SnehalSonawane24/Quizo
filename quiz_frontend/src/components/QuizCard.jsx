// src/components/QuizCard.js
import React from "react";
import "../styles/userDashboard.css";

function QuizCard({ quiz }) {
  return (
    <div className="quiz-card">
      <h4>{quiz.title}</h4>
      <p>{quiz.description}</p>
      <p>Questions: {quiz.total_questions}</p>
      <p>Time Limit: {quiz.time_limit} mins</p>
      <button className="btn-primary">Start Quiz</button>
    </div>
  );
}

export default QuizCard;
