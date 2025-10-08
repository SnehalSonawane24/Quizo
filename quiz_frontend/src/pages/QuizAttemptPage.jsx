import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import QuestionCard from "../components/QuestionCard";
import "../styles/quizAttempt.css";

export default function QuizAttemptPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [quiz, setQuiz] = useState({});
  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [timer, setTimer] = useState(600);
  const [loading, setLoading] = useState(true);

  // Fetch user and quiz
  useEffect(() => {
    const initQuizAttempt = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        let userData = storedUser;

        if (!userData) {
          const userRes = await api.get("/auth/user/");
          userData = userRes.data.Data;
          localStorage.setItem("user", JSON.stringify(userData));
        }
        setUser(userData);

        const startRes = await api.post(`/quizzes/user/quizzes/${quizId}/start_attempt/`);
        const newAttemptId = startRes.data.Data.id;
        setAttemptId(newAttemptId);

        const quizRes = await api.get(`/quizzes/user/quizzes/${quizId}/`);
        setQuiz(quizRes.data.Data);
        setQuestions(quizRes.data.Data.questions || []);
      } catch (err) {
        console.error("Error initializing quiz attempt:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    initQuizAttempt();
  }, [quizId]);

  // Timer countdown
  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          handleFinishAttempt();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmitAnswer = async () => {
    if (!attemptId) return;
    const currentQuestion = questions[currentQIndex];
    if (!currentQuestion) return;

    try {
      await api.post(`/quizzes/user/quizzes/${attemptId}/submit_answer/`, {
        question: currentQuestion.id,
        selected_options: selectedOptions,
      });
    } catch (err) {
      console.error("Error submitting answer:", err.response?.data || err.message);
    }
  };

  const handleFinishAttempt = async () => {
    if (!attemptId) return;
    try {
      await api.post(`/quizzes/user/quizzes/${attemptId}/finish_attempt/`);
      navigate(`/quiz/${attemptId}/result`);
    } catch (err) {
      console.error("Error finishing attempt:", err.response?.data || err.message);
    }
  };

  const handleNext = async () => {
    await handleSubmitAnswer();
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOptions([]);
    } else {
      handleFinishAttempt();
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  if (loading) return <div className="loading">Loading quiz...</div>;

  const currentQuestion = questions[currentQIndex];

  return (
    <div className="quiz-attempt-container">
      {/* --- Header --- */}
      <div className="quiz-header">
        <div className="quiz-header-left">
          <h2 className="quiz-title">{quiz.title}</h2>
          <div className="user-inline-info">
            <span><strong>{user?.username}</strong></span>
            <span className="user-email">{user?.email}</span>
          </div>
        </div>


        {/* <div className="quiz-header-right">
          <div className="timer-box">
            <strong>⏰ {formatTime(timer)}</strong>
          </div>
          <div className="question-count">
            Question {currentQIndex + 1} / {questions.length}
          </div>
        </div> */}

        <div className="quiz-meta">
          <div className="question-progress">
            Question {currentQIndex + 1} / {questions.length}
          </div>
          <div className="timer">
            ⏱ <strong>⏰ {formatTime(timer)}</strong>
          </div>
        </div>

      </div>



      {/* --- Question --- */}
      {currentQuestion ? (
        <QuestionCard
          question={currentQuestion}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          questionNumber={currentQIndex + 1}
        />
      ) : (
        <p>No questions found.</p>
      )}

      {/* --- Controls --- */}
      <div className="quiz-controls">
        {currentQIndex > 0 && (
          <button className="btn-secondary" onClick={() => setCurrentQIndex(currentQIndex - 1)}>
            Previous
          </button>
        )}
        <button className="btn-primary" onClick={handleNext}>
          {currentQIndex === questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}