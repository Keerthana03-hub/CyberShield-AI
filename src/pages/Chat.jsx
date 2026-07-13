/**
 * Chat.jsx — CyberShield AI
 * ─────────────────────────────────────────────────────────────
 * Modern AI chatbot interface powered by IBM Granite via /api/chat.
 *
 * Enhanced with:
 *   • Voice Assistant  — microphone (STT) + speaker (TTS)
 *   • File Upload      — PDF, TXT, DOCX, PNG, JPG, JPEG support
 *
 * All existing functionality is preserved unchanged.
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { sendChat } from "../services/api";
import useVoice      from "../hooks/useVoice";
import useFileUpload from "../hooks/useFileUpload";
import "../styles/Chat.css";

/* ── Welcome message (unchanged) ────────────────────────── */
const WELCOME_MESSAGE = {
  id:        "welcome",
  role:      "ai",
  text:      "Hello! I'm CyberShield AI, powered by IBM Granite. Ask me anything about digital payments, cybersecurity, phishing scams, UPI safety, or online banking.",
  timestamp: new Date(),
};

/* ── Small helper ────────────────────────────────────────── */
function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/* ═════════════════════════════════════════════════════════
 * Chat Component
 * ═════════════════════════════════════════════════════════ */
export default function Chat() {
  /* ── Core chat state (unchanged) ─────────────────────── */
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const bottomRef   = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);   // hidden <input type="file">

  /* ── Voice hook ───────────────────────────────────────── */
  const {
    isListening,
    isSpeaking,
    voiceError,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    clearVoiceError,
    isSpeechRecognitionSupported,
    isSpeechSynthesisSupported,
  } = useVoice({
    // When speech is transcribed, append it to the current input
    onTranscript: useCallback((transcript) => {
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      textareaRef.current?.focus();
    }, []),
  });

  /* ── File upload hook ─────────────────────────────────── */
  const {
    filePreview,
    fileError,
    isProcessing,
    handleFileSelect,
    clearFile,
  } = useFileUpload();

  /* ── Auto-scroll to latest message (unchanged) ─────────── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ── Dismiss voice error automatically after 5 s ─────── */
  useEffect(() => {
    if (!voiceError) return;
    const timer = setTimeout(clearVoiceError, 5000);
    return () => clearTimeout(timer);
  }, [voiceError, clearVoiceError]);

  /* ─────────────────────────────────────────────────────────
   * handleSend
   * Builds the message text (optionally including extracted
   * file content) and calls the existing sendChat API.
   * ───────────────────────────────────────────────────────── */
  async function handleSend() {
    const text = input.trim();
    if (!text && !filePreview) return;

    // ── Build the message payload ──────────────────────────
    let messageText = text;

    if (filePreview) {
      if (filePreview.type === "text") {
        // Append extracted file content to the user prompt
        const header = `[Attached file: ${filePreview.name} (${filePreview.size})]\n\n`;
        messageText = text
          ? `${text}\n\n${header}${filePreview.content}`
          : `${header}${filePreview.content}`;
      } else {
        // Image — include a note; future backend vision support
        const note = `[Attached image: ${filePreview.name} (${filePreview.size}) — image content sent for analysis]`;
        messageText = text ? `${text}\n\n${note}` : note;
      }
    }

    // ── Optimistically render the user bubble ──────────────
    const displayText = text || `📎 ${filePreview.name}`;
    const userMsg = {
      id:        Date.now(),
      role:      "user",
      text:      displayText,
      timestamp: new Date(),
      // Attach image preview URL for display only
      imagePreview: filePreview?.type === "image" ? filePreview.content : null,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setError("");
    setLoading(true);

    // Clear the file after it's been attached to the message
    clearFile();

    try {
      const response = await sendChat(messageText);
      const aiMsg = {
        id:        Date.now() + 1,
        role:      "ai",
        text:      response.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  /* ── Keyboard handler (unchanged) ────────────────────── */
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  /* ── Clear conversation (unchanged) ──────────────────── */
  function handleClear() {
    setMessages([WELCOME_MESSAGE]);
    setError("");
    clearFile();
    textareaRef.current?.focus();
  }

  /* ── Mic button toggle ────────────────────────────────── */
  function handleMicClick() {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }

  /* ── Trigger the hidden file input ───────────────────── */
  function handleAttachClick() {
    fileInputRef.current?.click();
  }

  /* ── Derived: send button should be enabled when there's
   *   text OR a file loaded and we're not loading ──────── */
  const canSend = !loading && (input.trim().length > 0 || !!filePreview);

  /* ═════════════════════════════════════════════════════════
   * Render
   * ═════════════════════════════════════════════════════════ */
  return (
    <main className="chat-page">

      {/* ── Hero Banner (unchanged) ── */}
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

          {/* ── Header (unchanged) ── */}
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

          {/* ── Messages Area ── */}
          <div className="chat-messages" role="log" aria-live="polite">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble-row ${msg.role === "user" ? "user-row" : "ai-row"}`}
              >
                {/* AI avatar */}
                {msg.role === "ai" && (
                  <div className="bubble-avatar ai-avatar" aria-hidden="true">🤖</div>
                )}

                {/* ── Bubble ── */}
                <div className={`chat-bubble ${msg.role === "user" ? "bubble-user" : "bubble-ai"}`}>

                  {/* Image preview inside user bubble */}
                  {msg.imagePreview && (
                    <img
                      src={msg.imagePreview}
                      alt="Attached image preview"
                      className="bubble-image-preview"
                    />
                  )}

                  <p className="bubble-text">{msg.text}</p>
                  <span className="bubble-time">{formatTime(msg.timestamp)}</span>

                  {/* ── Speaker button for AI messages (TTS) ── */}
                  {msg.role === "ai" && isSpeechSynthesisSupported && (
                    <button
                      className={`bubble-speak-btn ${isSpeaking ? "speaking" : ""}`}
                      onClick={() => (isSpeaking ? stopSpeaking() : speak(msg.text))}
                      title={isSpeaking ? "Stop reading" : "Read aloud"}
                      aria-label={isSpeaking ? "Stop reading aloud" : "Read this message aloud"}
                    >
                      {isSpeaking ? "⏹" : "🔊"}
                    </button>
                  )}
                </div>

                {/* User avatar */}
                {msg.role === "user" && (
                  <div className="bubble-avatar user-avatar" aria-hidden="true">👤</div>
                )}
              </div>
            ))}

            {/* ── Loading indicator (unchanged) ── */}
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

            {/* ── API error (unchanged) ── */}
            {error && (
              <div className="chat-error" role="alert">
                ⚠️ {error}
              </div>
            )}

            {/* ── Voice error notification ── */}
            {voiceError && (
              <div className="chat-error chat-voice-error" role="alert">
                🎤 {voiceError}
                <button
                  className="chat-error-dismiss"
                  onClick={clearVoiceError}
                  aria-label="Dismiss voice error"
                >
                  ✕
                </button>
              </div>
            )}

            {/* ── File error notification ── */}
            {fileError && (
              <div className="chat-error chat-file-error" role="alert">
                📎 {fileError}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* ── File Preview Banner ── */}
          {filePreview && (
            <div className="file-preview-banner">
              {filePreview.type === "image" ? (
                /* Image preview */
                <div className="file-preview-image-container">
                  <img
                    src={filePreview.content}
                    alt={`Preview of ${filePreview.name}`}
                    className="file-preview-image"
                  />
                  <div className="file-preview-meta">
                    <span className="file-preview-icon">🖼️</span>
                    <span className="file-preview-name">{filePreview.name}</span>
                    <span className="file-preview-size">{filePreview.size}</span>
                  </div>
                </div>
              ) : (
                /* Text-based file preview */
                <div className="file-preview-text-container">
                  <span className="file-preview-icon">
                    {filePreview.name.endsWith(".pdf") ? "📄" :
                     filePreview.name.endsWith(".docx") ? "📝" : "📃"}
                  </span>
                  <div className="file-preview-info">
                    <span className="file-preview-name">{filePreview.name}</span>
                    <span className="file-preview-size">{filePreview.size}</span>
                  </div>
                  <span className="file-preview-ready">✓ Text extracted, ready to send</span>
                </div>
              )}
              {/* Remove attachment button */}
              <button
                className="file-preview-remove"
                onClick={clearFile}
                title="Remove attachment"
                aria-label="Remove attached file"
              >
                ✕
              </button>
            </div>
          )}

          {/* ── Processing indicator (shown while extracting file text) ── */}
          {isProcessing && (
            <div className="file-processing-indicator">
              <span className="btn-spinner file-spinner" />
              Processing file…
            </div>
          )}

          {/* ── Microphone listening indicator ── */}
          {isListening && (
            <div className="mic-listening-indicator" aria-live="polite">
              <span className="mic-pulse" />
              Listening… speak now
            </div>
          )}

          {/* ── Input Area ── */}
          <div className="chat-input-area">

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.docx,.png,.jpg,.jpeg"
              className="chat-file-input-hidden"
              onChange={handleFileSelect}
              aria-hidden="true"
              tabIndex={-1}
            />

            {/* Attachment button */}
            <button
              className="chat-icon-btn chat-attach-btn"
              onClick={handleAttachClick}
              disabled={loading || isProcessing}
              title="Attach file (PDF, TXT, DOCX, PNG, JPG)"
              aria-label="Attach a file"
            >
              📎
            </button>

            {/* Microphone button */}
            {isSpeechRecognitionSupported && (
              <button
                className={`chat-icon-btn chat-mic-btn ${isListening ? "active" : ""}`}
                onClick={handleMicClick}
                disabled={loading}
                title={isListening ? "Stop listening" : "Speak your message"}
                aria-label={isListening ? "Stop voice input" : "Start voice input"}
                aria-pressed={isListening}
              >
                {isListening ? "🔴" : "🎤"}
              </button>
            )}

            {/* Textarea (unchanged binding) */}
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

            {/* Send button (unchanged) */}
            <button
              className="chat-send-btn btn btn-primary"
              onClick={handleSend}
              disabled={!canSend}
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
            📎 Attach files &nbsp;•&nbsp; 🎤 Voice input &nbsp;•&nbsp;
            Shift + Enter for new line &nbsp;•&nbsp; Enter to send
          </p>
        </div>
      </div>
    </main>
  );
}
