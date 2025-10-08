import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FaCheckCircle, FaTimesCircle, FaUser, FaClock, FaTrophy } from "react-icons/fa";
import "../styles/resultPage.css";

export default function ResultPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!attemptId) return;

    const fetchResult = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);

        console.log("Fetching result for attemptId:", attemptId);
        const res = await api.get(`/quizzes/user/quizzes/${attemptId}/attempt_details/`);
        console.log("attempt_details response:", res.data);

        setResult(res.data.Data);
      } catch (err) {
        console.error("Error fetching result:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [attemptId]);

  if (loading) return <p className="loading">Loading result...</p>;
  if (!result) return <p>No result found.</p>;

  const totalQuestions = result.total_questions || 0;
  const correct = result.correct_answers || 0;
  const message = result.is_passed
    ? "🎉 Great job! You’ve nailed this quiz!"
    : "💪 Don’t worry, every attempt is a step toward mastery!";

  const calculateTotalTime = (start, end) => {
    if (!start || !end) return "N/A";
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime - startTime;

    if (diffMs <= 0) return "N/A";

    const totalSeconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}m ${seconds < 10 ? "0" : ""}${seconds}s`;
  };

  return (
    <div className="result-container">
      {/* Header */}
      <div className="result-header">
        <h2 className="quiz-title">{result.quiz_title}</h2>
        <div className="user-inline-info">
          <span className="user-name">
            <FaUser /> <strong>{user?.username}</strong>
          </span>
          <span className="user-email">{user?.email}</span>
        </div>
      </div>

      {/* Score Summary */}
      <div className="result-summary">
        <div className="score-box">
          {result.is_passed ? (
            <FaCheckCircle className="icon-pass" />
          ) : (
            <FaTimesCircle className="icon-fail" />
          )}
          <h3>
            {result.is_passed ? "Passed" : "Failed"} - Score: {result.score}/{totalQuestions}
          </h3>
        </div>

        <div className="time-info">
          <p>
            <FaClock /> <strong>Started At:</strong>{" "}
            {new Date(result.started_at).toLocaleString()}
          </p>
          <p>
            <FaClock /> <strong>Completed At:</strong>{" "}
            {new Date(result.completed_at).toLocaleString()}
          </p>
          {/* <p>
            <FaTrophy /> <strong>Total Time:</strong> {result.total_time || "N/A"}
          </p> */}
          <p>
            <FaTrophy /> <strong>Total Time:</strong>{" "}
            {calculateTotalTime(result.started_at, result.completed_at)}
          </p>
        </div>
      </div>

      {/* Motivational Message */}
      <div
        className={`message-box ${result.is_passed ? "pass" : "fail"}`}
      >
        <p>{message}</p>
      </div>

      {/* Retry or Dashboard Buttons */}
      <div className="result-actions">
        <button className="btn-dashboard" onClick={() => navigate("/user/dashboard")}>
          Go to Dashboard
        </button>
        {/* <button className="btn-retry" onClick={() => navigate(`/quiz/${result.quiz_id}/attempt`)}>
          Retry Quiz
        </button> */}
      </div>
    </div>
  );
}