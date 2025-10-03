import React, { useState } from "react";
import api from "../api/axios";
import "../styles/createQuizModal.css";

export default function CreateQuizPage() {
  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    category: "",
    start_time: "",
    end_time: "",
    time_limit: "",
    is_published: true,
    passing_score: "",
    max_attempts: "",
    negative_marking: false,
    negative_marks_per_question: 0,
    shuffle_questions: true,
    shuffle_options: true,
    show_answers_post_quiz: true,
    difficulty: "easy",
    questions: [
      {
        text: "",
        question_type: "mcq",
        marks: 1,
        options: [
          { text: "", is_correct: false },
          { text: "", is_correct: false },
        ],
      },
    ],
  });

  const handleQuizChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuizData({
      ...quizData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleQuestionChange = (qIndex, field, value) => {
    const updated = [...quizData.questions];
    updated[qIndex][field] = value;
    setQuizData({ ...quizData, questions: updated });
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const updated = [...quizData.questions];
    updated[qIndex].options[oIndex][field] = value;
    setQuizData({ ...quizData, questions: updated });
  };

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        {
          text: "",
          question_type: "mcq",
          marks: 1,
          options: [
            { text: "", is_correct: false },
            { text: "", is_correct: false },
          ],
        },
      ],
    });
  };

  const addOption = (qIndex) => {
    const updated = [...quizData.questions];
    updated[qIndex].options.push({ text: "", is_correct: false });
    setQuizData({ ...quizData, questions: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("quizzes/quizzes/", quizData);
      alert("✅ Quiz created successfully!");
      console.log(res.data);
    } catch (err) {
      console.error("❌ Error creating quiz", err.response?.data || err.message);
      alert("Failed to create quiz!");
    }
  };

  return (
    <div className="quiz-container">
      <h2>✨ Create New Quiz</h2>

      <form onSubmit={handleSubmit}>
        {/* Quiz Title & Description */}
        <input
          type="text"
          name="title"
          placeholder="Quiz Title"
          value={quizData.title}
          onChange={handleQuizChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={quizData.description}
          onChange={handleQuizChange}
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={quizData.category}
          onChange={handleQuizChange}
        />

        {/* Date-Time */}
        <div className="grid">
          <div>
            <label>Start Time</label>
            <input
              type="datetime-local"
              name="start_time"
              value={quizData.start_time}
              onChange={handleQuizChange}
            />
          </div>
          <div>
            <label>End Time</label>
            <input
              type="datetime-local"
              name="end_time"
              value={quizData.end_time}
              onChange={handleQuizChange}
            />
          </div>
        </div>

        {/* Numeric Fields */}
        <div className="grid">
          <input
            type="number"
            name="time_limit"
            placeholder="Time Limit (mins)"
            value={quizData.time_limit}
            onChange={handleQuizChange}
          />
          <input
            type="number"
            name="passing_score"
            placeholder="Passing Score"
            value={quizData.passing_score}
            onChange={handleQuizChange}
          />
          <input
            type="number"
            name="max_attempts"
            placeholder="Max Attempts"
            value={quizData.max_attempts}
            onChange={handleQuizChange}
          />
        </div>

        {/* Checkboxes */}
        <div className="checkbox-grid">
          <label>
            <input
              type="checkbox"
              name="is_published"
              checked={quizData.is_published}
              onChange={handleQuizChange}
            />
            Publish Quiz
          </label>

          <label>
            <input
              type="checkbox"
              name="negative_marking"
              checked={quizData.negative_marking}
              onChange={handleQuizChange}
            />
            Negative Marking
          </label>

          <label>
            <input
              type="checkbox"
              name="shuffle_questions"
              checked={quizData.shuffle_questions}
              onChange={handleQuizChange}
            />
            Shuffle Questions
          </label>

          <label>
            <input
              type="checkbox"
              name="shuffle_options"
              checked={quizData.shuffle_options}
              onChange={handleQuizChange}
            />
            Shuffle Options
          </label>

          <label>
            <input
              type="checkbox"
              name="show_answers_post_quiz"
              checked={quizData.show_answers_post_quiz}
              onChange={handleQuizChange}
            />
            Show Answers Post Quiz
          </label>
        </div>

        {/* Negative Marks per Question */}
        {quizData.negative_marking && (
          <input
            type="number"
            step="0.01"
            name="negative_marks_per_question"
            placeholder="Negative Marks per Question"
            value={quizData.negative_marks_per_question}
            onChange={handleQuizChange}
          />
        )}

        {/* Difficulty */}
        <select
          name="difficulty"
          value={quizData.difficulty}
          onChange={handleQuizChange}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {/* Questions Section */}
        <h3>📝 Questions</h3>
        {quizData.questions.map((q, qIndex) => (
          <div key={qIndex} className="question-box">
            <input
              type="text"
              placeholder={`Question ${qIndex + 1}`}
              value={q.text}
              onChange={(e) =>
                handleQuestionChange(qIndex, "text", e.target.value)
              }
            />

            <select
              value={q.question_type}
              onChange={(e) =>
                handleQuestionChange(qIndex, "question_type", e.target.value)
              }
            >
              <option value="mcq">Multiple Choice</option>
              <option value="tf">True / False</option>
            </select>

            <input
              type="number"
              placeholder="Marks"
              value={q.marks}
              onChange={(e) => handleQuestionChange(qIndex, "marks", e.target.value)}
            />

            {q.options.map((opt, oIndex) => (
              <div key={oIndex} className="option-row">
                <input
                  type="text"
                  placeholder={`Option ${oIndex + 1}`}
                  value={opt.text}
                  onChange={(e) =>
                    handleOptionChange(qIndex, oIndex, "text", e.target.value)
                  }
                />
                <label>
                  <input
                    type="checkbox"
                    checked={opt.is_correct}
                    onChange={(e) =>
                      handleOptionChange(qIndex, oIndex, "is_correct", e.target.checked)
                    }
                  />
                  Correct
                </label>
              </div>
            ))}

            <button type="button" onClick={() => addOption(qIndex)}>
              ➕ Add Option
            </button>
          </div>
        ))}

        <button type="button" onClick={addQuestion}>
          ➕ Add Question
        </button>

        <div className="text-center">
          <button type="submit">✅ Create Quiz</button>
        </div>
      </form>
    </div>
  );
}