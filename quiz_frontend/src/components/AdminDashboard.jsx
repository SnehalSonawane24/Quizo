import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/adminDashboard.css";
import { FaPlus, FaEdit, FaTrash, FaEye, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [quizReport, setQuizReport] = useState([]);
  const [userReport, setUserReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);


  const handleDelete = async (quizId) => {
    try {
      await api.delete(`http://127.0.0.1:8000/api/quizzes/quizzes/${quizId}/`);
      // Refresh the list after deletion
      setQuizzes(quizzes.filter(q => q.id !== quizId));
      console.log("Quiz deleted:", quizId);
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert("Failed to delete quiz. Try again!");
    }
  };

  const handleViewQuiz = (quizId) => {
    // Navigate to Quiz Detail page
    navigate(`/quiz/${quizId}`);
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      try {

        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);

        const quizRes = await api.get("quizzes/quizzes/");
        setQuizzes(quizRes.data.Data);

        const quizReportRes = await api.get("reports/admin/reports/quiz_performance/");
        setQuizReport(quizReportRes.data.Data);

        const userReportRes = await api.get("reports/admin/reports/user_performance/");
        setUserReport(userReportRes.data.Data);

      } catch (err) {
        console.error("Error fetching admin dashboard data", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) return <div className="loading">Loading admin dashboard...</div>;

  return (

    <div className="admin-dashboard-container">

      <div className="user-info-row">
        <FaUser size={40} className="user-icon" />
        <div className="user-details">
          <h2 className="username">{user?.username}</h2>
          <p className="email">{user?.email}</p>
        </div>
      </div>

      <div className="header">
        <h2>Admin Dashboard</h2>

        <button onClick={() => navigate("/admin/create-quiz")}>
          ➕ Create Quiz
        </button>

      </div>

      {/* Quiz List */}
      <h3>Quizzes</h3>
      <table className="styled-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Category</th>
            <th>Description</th>
            <th>Start Time</th>
            <th>Total Questions</th>
            <th>Score</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.length > 0 ? (
            quizzes.map((quiz, index) => (
              <tr key={quiz.id}>
                <td>{index + 1}</td>
                <td>{quiz.title}</td>
                <td>{quiz.category}</td>
                <td>{quiz.description}</td>
                <td>{new Date(quiz.start_time).toLocaleString()}</td>
                <td>{quiz.total_questions}</td>
                <td>{quiz.passing_score}</td>
                <td className="action-buttons">
                  <button className="btn-view" onClick={() => handleViewQuiz(quiz.id)}><FaEye /> View</button>
                  <button className="btn-edit" onClick={() => navigate(`/quiz/${quiz.id}/edit`)}><FaEdit /> Edit</button>
                  <button className="btn-delete" onClick={() => { setQuizToDelete(quiz); setShowDeleteModal(true); }}><FaTrash /> Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No quizzes available.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Quiz Performance Report */}
      <h3>Quiz Performance Report</h3>
      <table className="styled-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Quiz</th>
            <th>Avg Score</th>
            <th>Success Rate</th>
            <th>Total Attempts</th>
            <th>Total Passed</th>
          </tr>
        </thead>
        <tbody>
          {quizReport.length > 0 ? (
            quizReport.map((q, index) => (
              <tr key={q.quiz_id}>
                <td>{index + 1}</td>
                <td>{q.quiz_title}</td>
                <td>{q.avg_score}</td>
                <td>{q.success_rate}%</td>
                <td>{q.total_attempts}</td>
                <td>{q.total_passed}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No quiz performance data.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* User Performance Report */}
      <h3>User Performance Report</h3>
      <table className="styled-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Total Attempts</th>
            <th>Passed</th>
            <th>Failed</th>
            <th>Success Rate</th>
          </tr>
        </thead>
        <tbody>
          {userReport.length > 0 ? (
            userReport.map((u, index) => {
              const successRate = u.total_attempts > 0 ? ((u.passed_count / u.total_attempts) * 100).toFixed(1) : 0;
              return (
                <tr key={u.user_id}>
                  <td>{index + 1}</td>
                  <td>{u.username}</td>
                  <td>{u.total_attempts}</td>
                  <td>{u.passed_count}</td>
                  <td>{u.failed_count}</td>
                  <td>{successRate}%</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6">No user performance data.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && quizToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Are you sure you want to delete "{quizToDelete.title}"?</h3>
            <button onClick={() => { handleDelete(quizToDelete.id); setShowDeleteModal(false); setQuizToDelete(null); }}>Yes, Delete</button>
            <button onClick={() => { setShowDeleteModal(false); setQuizToDelete(null); }}>Cancel</button>
          </div>
        </div>
      )}

    </div>
    
  );
}
