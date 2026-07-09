/**
 * Chat.jsx — CyberShield AI
 * Modern AI chatbot interface powered by IBM Granite via /api/chat
 */

import { useState, useRef, useEffect } from "react";
import { sendChat } from "../services/api";
import "../styles/Chat.css";

const WELCOME_MESSAGE = {
  id: "welcome",
  role: "ai",
  text: "Hello! I'm CyberShield AI, powered by IBM Granite. Ask me anything about digital payments, cybersecurity, phishing scams, UPI safety, or online banking.",
  timestamp: new Date(),
};

export default function Chat() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  /* Auto-scroll to latest message */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function formatTime(date) {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  async function handleSend() {
    const text = input.trim();
    if (!text) return;

    const userMsg = { id: Date.now(), role: "user", text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await sendChat(text);
      const aiMsg = {
        id: Date.now() + 1,
        role: "ai",
        text: response.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleClear() {
    setMessages([WELCOME_MESSAGE]);
    setError("");
    textareaRef.current?.focus();
  }

  return (
    <main className="chat-page">
      {/* ── Hero Banner ── */}
      <section className="inner-page__hero">
        <div className="container">
          <div className="inner-page__eyebrow">
            <span className="badge badge-accent">IBM Granite AI</span>
          </div>
          <h1 className="inner-page__title">AI Assistant</h1>
          <p className="inner-page__subtitle">
            Ask questions about digital payments, online banking, cybersecurity,
            phishing scams, or financial safety.
          </p>
        </div>
      </section>

      {/* ── Chat Container ── */}
      <div className="container">
        <div className="chat-wrapper">

          {/* Header */}
          <div className="chat-header">
            <div className="chat-header__info">
              <div className="chat-header__avatar ai-avatar">🤖</div>
              <div>
                <p className="chat-header__name">CyberShield AI</p>
                <p className="chat-header__status">
                  <span className="status-dot" />
                  Powered by IBM Granite
                </p>
              </div>
            </div>
            <button className="chat-clear-btn" onClick={handleClear} title="Clear conversation">
              🗑 Clear Chat
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages" role="log" aria-live="polite">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble-row ${msg.role === "user" ? "user-row" : "ai-row"}`}>
                {msg.role === "ai" && (
                  <div className="bubble-avatar ai-avatar" aria-hidden="true">🤖</div>
                )}
                <div className={`chat-bubble ${msg.role === "user" ? "bubble-user" : "bubble-ai"}`}>
                  <p className="bubble-text">{msg.text}</p>
                  <span className="bubble-time">{formatTime(msg.timestamp)}</span>
                </div>
                {msg.role === "user" && (
                  <div className="bubble-avatar user-avatar" aria-hidden="true">👤</div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="chat-bubble-row ai-row">
                <div className="bubble-avatar ai-avatar">🤖</div>
                <div className="chat-bubble bubble-ai bubble-loading">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="chat-error" role="alert">
                ⚠️ {error}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="chat-input-area">
            <textarea
              ref={textareaRef}
              className="chat-textarea"
              rows={3}
              placeholder="Type your question… (Enter to send, Shift+Enter for new line)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              aria-label="Chat message input"
            />
            <button
              className="chat-send-btn btn btn-primary"
              onClick={handleSend}
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              {loading ? (
                <span className="btn-spinner" />
              ) : (
                <>Send ➤</>
              )}
            </button>
          </div>

          <p className="chat-hint">
            Shift + Enter for a new line &nbsp;•&nbsp; Enter to send
          </p>
        </div>
      </div>
    </main>
  );
}
