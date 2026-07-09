/**
 * Quiz.jsx — CyberShield AI
 * Improved cybersecurity quiz: 15 questions, difficulty levels, scoring, retry.
 */

import { useState, useEffect, useCallback } from "react";
import "../styles/Quiz.css";

const ALL_QUESTIONS = [
  {
    id: 1,
    difficulty: "Easy",
    question: "What does OTP stand for in banking?",
    options: ["One Time Password", "Online Transfer Password", "Official Transfer Protocol", "One Transaction Pin"],
    answer: 0,
  },
  {
    id: 2,
    difficulty: "Easy",
    question: "Which of the following is the safest way to create a password?",
    options: ["Use your date of birth", "Use a combination of letters, numbers, and symbols", "Use your phone number", "Use your pet's name"],
    answer: 1,
  },
  {
    id: 3,
    difficulty: "Easy",
    question: "What is phishing?",
    options: ["A type of fishing sport", "An attempt to steal sensitive info by pretending to be a trusted entity", "A banking term for large transfers", "A software update process"],
    answer: 1,
  },
  {
    id: 4,
    difficulty: "Easy",
    question: "UPI PIN is required when you want to:",
    options: ["Receive money", "Check your balance", "Send money", "View transaction history"],
    answer: 2,
  },
  {
    id: 5,
    difficulty: "Easy",
    question: "What does HTTPS in a website URL indicate?",
    options: ["The website is very fast", "The connection is encrypted and secure", "The website is government-owned", "The website is free to use"],
    answer: 1,
  },
  {
    id: 6,
    difficulty: "Medium",
    question: "A caller claims to be from your bank and asks for your OTP. What should you do?",
    options: ["Share it since they are from the bank", "Share only the first 2 digits", "Hang up and call your bank's official number", "Ask them to send an email first"],
    answer: 2,
  },
  {
    id: 7,
    difficulty: "Medium",
    question: "What is two-factor authentication (2FA)?",
    options: ["Logging in from two devices", "Using two passwords", "A security process requiring two forms of verification", "Sharing your password with two people"],
    answer: 2,
  },
  {
    id: 8,
    difficulty: "Medium",
    question: "Someone sends you a QR code saying 'Scan this to receive ₹500.' What is this?",
    options: ["A legitimate payment", "A UPI collect request scam — scanning could charge YOU", "A government scheme", "A cashback offer"],
    answer: 1,
  },
  {
    id: 9,
    difficulty: "Medium",
    question: "Which of these is a sign of a fake e-commerce website?",
    options: ["It uses HTTPS", "Prices are 80-90% lower than market rates", "It shows customer reviews", "It has a privacy policy"],
    answer: 1,
  },
  {
    id: 10,
    difficulty: "Medium",
    question: "What should you do if you receive a suspicious email asking you to click a link to verify your bank account?",
    options: ["Click the link and check if it's legitimate", "Forward it to friends as a warning", "Delete it and contact your bank directly", "Reply asking for more information"],
    answer: 2,
  },
  {
    id: 11,
    difficulty: "Hard",
    question: "What is 'SIM Swap Fraud'?",
    options: ["Swapping your old SIM for a new one", "A fraud where criminals get a duplicate SIM to intercept your OTPs", "Buying a SIM from an unauthorized dealer", "Using multiple SIM cards in one phone"],
    answer: 1,
  },
  {
    id: 12,
    difficulty: "Hard",
    question: "Which type of malware encrypts your files and demands payment to restore them?",
    options: ["Spyware", "Adware", "Ransomware", "Trojan"],
    answer: 2,
  },
  {
    id: 13,
    difficulty: "Hard",
    question: "What is a 'Man-in-the-Middle' (MITM) attack?",
    options: ["A physical robbery", "An attacker secretly intercepts and relays communication between two parties", "A social engineering call", "Installing malware via email"],
    answer: 1,
  },
  {
    id: 14,
    difficulty: "Hard",
    question: "What is the primary purpose of a VPN?",
    options: ["Speed up internet", "Encrypt internet traffic and hide IP address", "Block advertisements", "Prevent virus infections"],
    answer: 1,
  },
  {
    id: 15,
    difficulty: "Hard",
    question: "Which Indian helpline number should you call to report cybercrime?",
    options: ["100", "112", "1930", "1800-111-363"],
    answer: 2,
  },
];

const DIFFICULTY_COLORS = {
  Easy: "diff-easy",
  Medium: "diff-medium",
  Hard: "diff-hard",
};

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent]     = useState(0);
  const [selected, setSelected]   = useState(null);
  const [answers, setAnswers]     = useState([]);
  const [stage, setStage]         = useState("intro"); // intro | quiz | result

  const startQuiz = useCallback(() => {
    setQuestions(shuffle(ALL_QUESTIONS));
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setStage("quiz");
  }, []);

  useEffect(() => {
    if (stage === "quiz") setSelected(null);
  }, [current, stage]);

  function handleSelect(optionIndex) {
    if (selected !== null) return;
    setSelected(optionIndex);
  }

  function handleNext() {
    const isCorrect = selected === questions[current].answer;
    const newAnswers = [...answers, { questionId: questions[current].id, selected, isCorrect }];
    setAnswers(newAnswers);

    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
      setSelected(null);
    } else {
      setStage("result");
    }
  }

  const score  = answers.filter((a) => a.isCorrect).length;
  const total  = questions.length;
  const pct    = total > 0 ? Math.round((score / total) * 100) : 0;

  function getGrade() {
    if (pct >= 90) return { label: "Excellent! 🏆", color: "#34d399" };
    if (pct >= 70) return { label: "Good Job! 👍", color: "#60a5fa" };
    if (pct >= 50) return { label: "Keep Learning 📚", color: "#fbbf24" };
    return { label: "Needs Improvement 💪", color: "#f87171" };
  }

  const q = questions[current];

  return (
    <main className="inner-page">
      <section className="inner-page__hero">
        <div className="container">
          <div className="inner-page__eyebrow">
            <span className="badge badge-accent">Gamified Learning</span>
          </div>
          <h1 className="inner-page__title">Cyber Safety Quiz</h1>
          <p className="inner-page__subtitle">
            Test your cybersecurity knowledge with 15 questions across Easy,
            Medium, and Hard difficulty levels.
          </p>
        </div>
      </section>

      <section className="container quiz-container">

        {/* ── Intro Screen ── */}
        {stage === "intro" && (
          <div className="quiz-intro card">
            <div className="quiz-intro__icon">🛡️</div>
            <h2 className="quiz-intro__title">Ready to test your cyber knowledge?</h2>
            <p className="quiz-intro__desc">
              15 questions covering phishing, UPI safety, passwords, digital fraud,
              and more. Questions are randomized each attempt.
            </p>
            <div className="quiz-difficulty-legend">
              <span className="diff-easy diff-pill">Easy</span>
              <span className="diff-medium diff-pill">Medium</span>
              <span className="diff-hard diff-pill">Hard</span>
            </div>
            <button className="btn btn-primary quiz-start-btn" onClick={startQuiz}>
              Start Quiz →
            </button>
          </div>
        )}

        {/* ── Quiz Screen ── */}
        {stage === "quiz" && q && (
          <div className="quiz-card card">
            {/* Progress */}
            <div className="quiz-progress-header">
              <span className="quiz-progress-text">
                Question {current + 1} of {total}
              </span>
              <span className={`diff-pill ${DIFFICULTY_COLORS[q.difficulty]}`}>
                {q.difficulty}
              </span>
            </div>
            <div className="quiz-progress-track">
              <div
                className="quiz-progress-fill"
                style={{ width: `${((current) / total) * 100}%` }}
              />
            </div>

            {/* Question */}
            <p className="quiz-question">{q.question}</p>

            {/* Options */}
            <ul className="quiz-options">
              {q.options.map((opt, i) => {
                let cls = "quiz-option";
                if (selected !== null) {
                  if (i === q.answer) cls += " correct";
                  else if (i === selected) cls += " wrong";
                }
                return (
                  <li key={i}>
                    <button
                      className={cls}
                      onClick={() => handleSelect(i)}
                      disabled={selected !== null}
                    >
                      <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                      {opt}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Feedback & Next */}
            {selected !== null && (
              <div className={`quiz-feedback ${selected === q.answer ? "feedback-correct" : "feedback-wrong"}`}>
                {selected === q.answer
                  ? "✅ Correct! Well done."
                  : `❌ Incorrect. The correct answer is: "${q.options[q.answer]}"`}
              </div>
            )}

            <button
              className="btn btn-primary quiz-next-btn"
              onClick={handleNext}
              disabled={selected === null}
            >
              {current + 1 === total ? "See Results →" : "Next Question →"}
            </button>
          </div>
        )}

        {/* ── Result Screen ── */}
        {stage === "result" && (
          <div className="quiz-result card">
            <div className="quiz-result__score-circle">
              <span className="score-num">{score}</span>
              <span className="score-denom">/{total}</span>
            </div>

            <h2 className="quiz-result__grade" style={{ color: getGrade().color }}>
              {getGrade().label}
            </h2>
            <p className="quiz-result__pct">You scored {pct}%</p>

            {/* Summary */}
            <div className="quiz-summary-grid">
              <div className="quiz-summary-item correct-bg">
                <span className="summary-value">{score}</span>
                <span className="summary-label">Correct</span>
              </div>
              <div className="quiz-summary-item wrong-bg">
                <span className="summary-value">{total - score}</span>
                <span className="summary-label">Incorrect</span>
              </div>
              <div className="quiz-summary-item score-bg">
                <span className="summary-value">{pct}%</span>
                <span className="summary-label">Score</span>
              </div>
            </div>

            {/* Per-question review */}
            <div className="quiz-review">
              <h3 className="quiz-review-title">Question Review</h3>
              {questions.map((qs, i) => {
                const a = answers[i];
                return (
                  <div key={qs.id} className={`review-item ${a?.isCorrect ? "review-correct" : "review-wrong"}`}>
                    <span className="review-num">Q{i + 1}</span>
                    <div className="review-content">
                      <p className="review-question">{qs.question}</p>
                      <p className="review-answer">
                        Your answer: <strong>{qs.options[a?.selected]}</strong>
                        {!a?.isCorrect && (
                          <span className="review-correct-answer">
                            {" "}• Correct: <strong>{qs.options[qs.answer]}</strong>
                          </span>
                        )}
                      </p>
                    </div>
                    <span className="review-icon">{a?.isCorrect ? "✅" : "❌"}</span>
                  </div>
                );
              })}
            </div>

            <button className="btn btn-primary quiz-retry-btn" onClick={startQuiz}>
              🔄 Retry Quiz
            </button>
          </div>
        )}

      </section>
    </main>
  );
}
