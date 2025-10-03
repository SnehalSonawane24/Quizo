import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/userDashboard.css";
import { FaUser, FaCheckCircle, FaTimesCircle, FaPlay } from "react-icons/fa";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);

        const quizRes = await api.get("quizzes/user/quizzes/");
        setQuizzes(quizRes.data.Data);

        const attemptsRes = await api.get("reports/user/reports/attempts/");
        setAttempts(attemptsRes.data.Data);

        const progressRes = await api.get("reports/user/reports/progress/");
        setProgress(progressRes.data.Data);
      } catch (err) {
        console.error(
          "Error fetching dashboard data",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      <div className="user-info">
        <FaUser size={30} />
        <h3>{user?.username}</h3>
        <p>{user?.email}</p>
      </div>

      {/* Progress */}
      <div className="progress-section">
        <h3>Progress</h3>
        <div className="progress-bar-container">
          <span>Quizzes Completed: {progress?.attempted_quizzes || 0} / {progress?.total_quizzes || 0}</span>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{
                width: `${progress?.progress_percentage || 0}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Active Quizzes */}
      <h3>Active Quizzes</h3>
      <table className="quiz-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Total Questions</th>
            <th>Time Limit</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.length > 0 ? (
            quizzes.map((quiz, index) => (
              <tr key={quiz.id}>
                <td>{index + 1}</td>
                <td>{quiz.title}</td>
                <td>{quiz.description}</td>
                <td>{quiz.total_questions}</td>
                <td>{quiz.time_limit} mins</td>
                <td>
                  <button className="btn-start">
                    <FaPlay /> Start
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No active quizzes right now.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Attempt History */}
      <h3>Attempt History</h3>
      <table className="attempt-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Status</th>
            <th>Score</th>
            <th>Completed At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {attempts.length > 0 ? (
            attempts.map((a, index) => (
              <tr key={a.id}>
                <td>{index + 1}</td>
                <td>{a.title}</td>
                <td className={a.is_passed ? "passed" : "failed"}>
                  {a.is_passed ? <FaCheckCircle /> : <FaTimesCircle />}
                  &nbsp;{a.is_passed ? "Passed" : "Failed"}
                </td>
                <td>{a.score}</td>
                <td>{a.completed_at}</td>
                <td>
                  <button className="btn-retry">
                    <FaPlay /> Retry
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No attempts yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
