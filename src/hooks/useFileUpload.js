/**
 * useFileUpload.js — CyberShield AI
 * ─────────────────────────────────────────────────────────
 * Custom hook for handling file uploads in the chat.
 *
 * Supported file types:
 *   • Text-based  : PDF, TXT, DOCX  → extracts text content
 *   • Image-based : PNG, JPG, JPEG  → generates a preview URL
 *
 * Exposed API:
 *   selectedFile     – the File object currently selected
 *   filePreview      – { type: "text"|"image", content, name, size }
 *   fileError        – human-readable error string
 *   isProcessing     – true while parsing the file
 *   handleFileSelect – call with an input change event
 *   clearFile        – reset all file state
 * ─────────────────────────────────────────────────────────
 */

import { useState, useCallback, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import mammoth from "mammoth";

/* ── PDF.js worker setup ─────────────────────────────────
 * pdfjs-dist v3+ requires a worker URL.
 * Vite bundles the worker via the ?url import suffix.
 * We use the CDN fallback for robustness.
 * ───────────────────────────────────────────────────────── */
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

/* ── Constants ───────────────────────────────────────────── */
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
]);

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_BYTES   = MAX_FILE_SIZE_MB * 1024 * 1024;

/* ── Helper: human-readable file size ───────────────────── */
function formatSize(bytes) {
  if (bytes < 1024)            return `${bytes} B`;
  if (bytes < 1024 * 1024)     return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ─────────────────────────────────────────────────────────
 * PDF text extraction
 * Reads all pages and concatenates their text content.
 * ───────────────────────────────────────────────────────── */
async function extractPdfText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf         = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pageTexts   = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page    = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text    = content.items.map((item) => item.str).join(" ");
    pageTexts.push(text);
  }

  return pageTexts.join("\n\n");
}

/* ─────────────────────────────────────────────────────────
 * DOCX text extraction via mammoth
 * Converts .docx → plain text, stripping formatting.
 * ───────────────────────────────────────────────────────── */
async function extractDocxText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result      = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

/* ─────────────────────────────────────────────────────────
 * TXT extraction
 * Simply reads the file as UTF-8 text.
 * ───────────────────────────────────────────────────────── */
function extractTxtText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = (e) => resolve(e.target.result);
    reader.onerror = ()  => reject(new Error("Failed to read text file."));
    reader.readAsText(file, "utf-8");
  });
}

/* ─────────────────────────────────────────────────────────
 * Image preview
 * Generates a local object URL for display.
 * ───────────────────────────────────────────────────────── */
function createImagePreview(file) {
  return URL.createObjectURL(file);
}

/* ═══════════════════════════════════════════════════════════
 * useFileUpload — the hook
 * ═══════════════════════════════════════════════════════════ */
export default function useFileUpload() {
  const [selectedFile,  setSelectedFile]  = useState(null);
  const [filePreview,   setFilePreview]   = useState(null);   // { type, content, name, size }
  const [fileError,     setFileError]     = useState("");
  const [isProcessing,  setIsProcessing]  = useState(false);

  // Keep a ref to the current object URL so we can revoke it on cleanup
  const objectUrlRef = useRef(null);

  /* ── clearFile ─────────────────────────────────────────── */
  const clearFile = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setSelectedFile(null);
    setFilePreview(null);
    setFileError("");
    setIsProcessing(false);
  }, []);

  /* ── handleFileSelect ──────────────────────────────────── */
  const handleFileSelect = useCallback(async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset previous state
    clearFile();
    setFileError("");

    /* ── Validation ──────────────────────────────────────── */
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      setFileError(
        `Unsupported file type "${file.type || file.name.split(".").pop()}". ` +
        "Allowed types: PDF, TXT, DOCX, PNG, JPG, JPEG."
      );
      // Reset the input element value so the same file can be re-selected after fix
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      setFileError(`File is too large (${formatSize(file.size)}). Maximum allowed size is ${MAX_FILE_SIZE_MB} MB.`);
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    setIsProcessing(true);

    try {
      const isImage = file.type.startsWith("image/");

      if (isImage) {
        /* ── Image: just create a preview URL ──────────────── */
        const url = createImagePreview(file);
        objectUrlRef.current = url;
        setFilePreview({
          type:    "image",
          content: url,   // object URL for <img> src
          name:    file.name,
          size:    formatSize(file.size),
        });

      } else {
        /* ── Text-based: extract content ───────────────────── */
        let extractedText = "";

        if (file.type === "application/pdf") {
          extractedText = await extractPdfText(file);
        } else if (
          file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          extractedText = await extractDocxText(file);
        } else {
          // text/plain
          extractedText = await extractTxtText(file);
        }

        if (!extractedText.trim()) {
          setFileError("Could not extract any text from this file. It may be empty or encrypted.");
          setSelectedFile(null);
          return;
        }

        setFilePreview({
          type:    "text",
          content: extractedText,
          name:    file.name,
          size:    formatSize(file.size),
        });
      }
    } catch (err) {
      console.error("[useFileUpload] Error processing file:", err);
      setFileError(`Failed to process "${file.name}". ${err.message || "Please try a different file."}`);
      setSelectedFile(null);
      setFilePreview(null);
    } finally {
      setIsProcessing(false);
      // Reset the input value to allow re-selecting the same file later
      event.target.value = "";
    }
  }, [clearFile]);

  return {
    selectedFile,
    filePreview,
    fileError,
    isProcessing,
    handleFileSelect,
    clearFile,
  };
}
