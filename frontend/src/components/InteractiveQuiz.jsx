import React, { useState } from "react";

export default function InteractiveQuiz({ quizData }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleOptionSelect = (qIndex, option) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmit = () => {
    let currentScore = 0;
    quizData.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) currentScore += 1;
    });
    setScore(currentScore);
    setIsSubmitted(true);
  };

  return (
    <div
      className="quiz-container"
      style={{
        background: "var(--bg-sidebar)",
        padding: "24px",
        borderRadius: "12px",
        border: "1px solid var(--border-light)",
      }}
    >
      <h3 style={{ marginBottom: "20px", color: "var(--text-primary)" }}>
        Practice Quiz
      </h3>

      {quizData.map((q, qIndex) => (
        <div key={qIndex} style={{ marginBottom: "24px" }}>
          <p style={{ fontWeight: "600", marginBottom: "12px" }}>
            {qIndex + 1}. {q.question}
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {q.options.map((option, oIndex) => {
              const isSelected = selectedAnswers[qIndex] === option;
              const isCorrect = isSubmitted && option === q.correctAnswer;
              const isWrong =
                isSubmitted && isSelected && option !== q.correctAnswer;

              // Dynamic button styling for correct/wrong answers
              let bg = "var(--bg-input)";
              let border = "1px solid var(--border-light)";
              let color = "var(--text-primary)";

              if (isSelected) {
                bg = "var(--bg-card-hover)";
                border = "1px solid var(--accent-color)";
              }
              if (isCorrect) {
                bg = "#10b98120";
                border = "1px solid #10b981";
                color = "#10b981";
              }
              if (isWrong) {
                bg = "#ef444420";
                border = "1px solid #ef4444";
                color = "#ef4444";
              }

              return (
                <button
                  key={oIndex}
                  onClick={() => handleOptionSelect(qIndex, option)}
                  disabled={isSubmitted}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "8px",
                    background: bg,
                    border: border,
                    color: color,
                    textAlign: "left",
                    cursor: isSubmitted ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!isSubmitted ? (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(selectedAnswers).length !== quizData.length}
          style={{
            width: "100%",
            padding: "12px",
            background: "var(--text-primary)",
            color: "var(--bg-main)",
            borderRadius: "8px",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
          }}
        >
          Submit Answers
        </button>
      ) : (
        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            border: "1px solid #10b981",
            borderRadius: "8px",
            textAlign: "center",
            color: "#10b981",
            fontWeight: "bold",
          }}
        >
          Your Score: {score} / {quizData.length}
        </div>
      )}
    </div>
  );
}
