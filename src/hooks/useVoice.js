/**
 * useVoice.js — CyberShield AI
 * ─────────────────────────────────────────────────────────
 * Custom hook that wraps the browser Web Speech API.
 *
 * Provides:
 *   • Speech-to-Text  : startListening / stopListening
 *   • Text-to-Speech  : speak / stopSpeaking
 *   • State flags     : isListening, isSpeaking, voiceError
 * ─────────────────────────────────────────────────────────
 */

import { useState, useRef, useCallback, useEffect } from "react";

/**
 * Detect browser support for SpeechRecognition and SpeechSynthesis.
 * Both are prefixed on some browsers.
 */
const SpeechRecognitionAPI =
  window.SpeechRecognition || window.webkitSpeechRecognition || null;

const hasSpeechSynthesis = "speechSynthesis" in window;

export default function useVoice({ onTranscript }) {
  /* ── State ──────────────────────────────────────────── */
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking,  setIsSpeaking]  = useState(false);
  const [voiceError,  setVoiceError]  = useState("");

  /* ── Refs ────────────────────────────────────────────── */
  const recognitionRef = useRef(null);  // SpeechRecognition instance
  const utteranceRef   = useRef(null);  // Current SpeechSynthesisUtterance

  /* ── Cleanup on unmount ──────────────────────────────── */
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);

  /* ─────────────────────────────────────────────────────
   * startListening
   * Creates a SpeechRecognition session, collects the
   * final transcript, and passes it to the onTranscript cb.
   * ───────────────────────────────────────────────────── */
  const startListening = useCallback(() => {
    setVoiceError("");

    if (!SpeechRecognitionAPI) {
      setVoiceError("Speech recognition is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    // Abort any active session before starting a new one
    recognitionRef.current?.abort();

    const recognition = new SpeechRecognitionAPI();
    recognition.lang        = "en-US";
    recognition.interimResults = false;  // We only want the final result
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend   = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      if (transcript && typeof onTranscript === "function") {
        onTranscript(transcript);
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === "not-allowed" || event.error === "permission-denied") {
        setVoiceError("Microphone access denied. Please allow microphone permissions and try again.");
      } else if (event.error === "no-speech") {
        setVoiceError("No speech detected. Please try again.");
      } else if (event.error === "network") {
        setVoiceError("Network error during speech recognition. Please check your connection.");
      } else {
        setVoiceError(`Speech recognition error: ${event.error}`);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [onTranscript]);

  /* ─────────────────────────────────────────────────────
   * stopListening
   * Manually stops an active recognition session.
   * ───────────────────────────────────────────────────── */
  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  /* ─────────────────────────────────────────────────────
   * speak
   * Uses the SpeechSynthesis API to read a text string
   * aloud. Cancels any ongoing utterance first.
   * ───────────────────────────────────────────────────── */
  const speak = useCallback((text) => {
    if (!hasSpeechSynthesis) {
      setVoiceError("Text-to-speech is not supported in this browser.");
      return;
    }
    if (!text) return;

    // Cancel any previous speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang  = "en-US";
    utterance.rate  = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend   = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  /* ─────────────────────────────────────────────────────
   * stopSpeaking
   * Cancels any active speech synthesis.
   * ───────────────────────────────────────────────────── */
  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  /* ── Clear voice error helper ────────────────────────── */
  const clearVoiceError = useCallback(() => setVoiceError(""), []);

  return {
    isListening,
    isSpeaking,
    voiceError,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    clearVoiceError,
    isSpeechRecognitionSupported: !!SpeechRecognitionAPI,
    isSpeechSynthesisSupported:   hasSpeechSynthesis,
  };
}
