/**
 * FraudAnalyzer.jsx — CyberShield AI
 *
 * Enhanced Fraud Analyzer with:
 *  • Drag-and-drop file upload (image / PDF / TXT)
 *  • OCR via Tesseract.js for images
 *  • PDF text extraction via pdfjs-dist
 *  • Inline image preview and file info display
 *  • Loading progress indicator
 *  • Rich result cards with risk score, red flags, recommendations
 *  • Copy result and Download as PDF buttons
 *  • Full error handling
 *
 * Uses the existing POST /api/fraud/analyze endpoint — no backend changes.
 */

import { useState, useRef, useCallback } from "react";
import { analyzeFraud } from "../services/api";
import "../styles/FraudAnalyzer.css";

// ─── Threat category icon map ───────────────────────────────────────────────
const CATEGORY_ICONS = {
  "Phishing":                  "🎣",
  "Smishing":                  "📱",
  "Vishing":                   "📞",
  "Fake Banking Website":      "🏦",
  "Fake Loan Offer":           "💸",
  "Investment Scam":           "📈",
  "QR Code Scam":              "📷",
  "UPI Fraud":                 "💳",
  "OTP Scam":                  "🔢",
  "KYC Scam":                  "🪪",
  "Identity Theft":            "👤",
  "Fake Customer Support":     "🎧",
  "Safe / Legitimate":         "✅",
  "Unknown / Needs Manual Review": "❓",
};

// ─── Risk level helpers ──────────────────────────────────────────────────────
function getRiskConfig(score) {
  if (score >= 80) return { label: "Critical",  cls: "risk-critical", bar: "bar-critical" };
  if (score >= 60) return { label: "High",      cls: "risk-high",     bar: "bar-high"     };
  if (score >= 40) return { label: "Medium",    cls: "risk-medium",   bar: "bar-medium"   };
  return              { label: "Low",       cls: "risk-low",      bar: "bar-low"      };
}

// ─── Accepted MIME types ─────────────────────────────────────────────────────
const ACCEPTED_TYPES = {
  "image/png":   "image",
  "image/jpeg":  "image",
  "image/jpg":   "image",
  "image/webp":  "image",
  "application/pdf": "pdf",
  "text/plain":  "text",
};
const MAX_FILE_SIZE_MB = 10;

// ─── Lazy-load heavy libraries (only when first used) ───────────────────────
let tesseractWorker = null;
async function runOCR(imageFile, onProgress) {
  // Dynamically import Tesseract so the main bundle stays small
  const Tesseract = (await import("tesseract.js")).default;

  if (!tesseractWorker) {
    tesseractWorker = await Tesseract.createWorker("eng", 1, {
      logger: (m) => {
        if (m.status === "recognizing text" && onProgress) {
          onProgress(Math.round(m.progress * 100));
        }
      },
    });
  }

  const { data } = await tesseractWorker.recognize(imageFile);
  return data.text;
}

async function extractPdfText(pdfFile, onProgress) {
  // Dynamically import pdfjs-dist
  const pdfjsLib = await import("pdfjs-dist");

  // Use a bundled worker stub so Vite doesn't complain
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url
  ).toString();

  const arrayBuffer = await pdfFile.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(" ");
    fullText += pageText + "\n\n";

    if (onProgress) {
      onProgress(Math.round((i / pdf.numPages) * 100));
    }
  }

  return fullText.trim();
}

// ─── Download result as PDF using jsPDF ────────────────────────────────────
async function downloadResultAsPDF(result, analyzedAt) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const risk = getRiskConfig(result.riskScore);
  const icon = CATEGORY_ICONS[result.threatCategory] || "⚠️";
  const margin = 18;
  let y = 20;

  // Header
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("CyberShield AI — Fraud Analysis Report", margin, y);
  y += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120);
  doc.text(`Analyzed at: ${new Date(analyzedAt).toLocaleString()}`, margin, y);
  y += 12;

  // Risk score
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.text(`Risk Score: ${result.riskScore}/100  |  Risk Level: ${risk.label}`, margin, y);
  y += 8;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`${icon} Threat Category: ${result.threatCategory}`, margin, y);
  y += 8;
  doc.text(`Confidence: ${result.confidence}`, margin, y);
  y += 12;

  // Summary
  doc.setFont("helvetica", "bold");
  doc.text("Summary", margin, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  const summaryLines = doc.splitTextToSize(result.summary || "—", 170);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 5 + 6;

  // Red flags
  if (result.redFlags?.length) {
    doc.setFont("helvetica", "bold");
    doc.text("Red Flags", margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    result.redFlags.forEach((flag) => {
      const lines = doc.splitTextToSize(`• ${flag}`, 170);
      doc.text(lines, margin, y);
      y += lines.length * 5 + 2;
    });
    y += 4;
  }

  // Recommendations
  if (result.recommendation?.length) {
    doc.setFont("helvetica", "bold");
    doc.text("Recommendations", margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    result.recommendation.forEach((rec, i) => {
      const lines = doc.splitTextToSize(`${i + 1}. ${rec}`, 170);
      doc.text(lines, margin, y);
      y += lines.length * 5 + 2;
    });
    y += 4;
  }

  // Tip
  if (result.financialLiteracyTip) {
    doc.setFont("helvetica", "bold");
    doc.text("Financial Literacy Tip", margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    const tipLines = doc.splitTextToSize(result.financialLiteracyTip, 170);
    doc.text(tipLines, margin, y);
  }

  doc.save(`cybershield-fraud-report-${Date.now()}.pdf`);
}

// ════════════════════════════════════════════════════════════════════════════
//  Main Component
// ════════════════════════════════════════════════════════════════════════════
export default function FraudAnalyzer() {
  const [content,       setContent]      = useState("");
  const [uploadedFile,  setUploadedFile]  = useState(null);   // { file, type, preview, name }
  const [extractedText, setExtractedText] = useState("");     // OCR / PDF extracted text
  const [loading,       setLoading]       = useState(false);
  const [loadingMsg,    setLoadingMsg]    = useState("");
  const [progress,      setProgress]      = useState(0);      // 0-100
  const [result,        setResult]        = useState(null);
  const [error,         setError]         = useState("");
  const [dragOver,      setDragOver]      = useState(false);
  const [copied,        setCopied]        = useState(false);

  const fileInputRef = useRef(null);

  // ─── File validation ───────────────────────────────────────────────────
  function validateFile(file) {
    const type = ACCEPTED_TYPES[file.type];
    if (!type) {
      return `Unsupported file format: ${file.type || "unknown"}. Please upload PNG, JPG, PDF, or TXT.`;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `File is too large. Maximum size is ${MAX_FILE_SIZE_MB} MB.`;
    }
    return null;
  }

  // ─── Process dropped/selected file ────────────────────────────────────
  const processFile = useCallback((file) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const type = ACCEPTED_TYPES[file.type];
    const preview = type === "image" ? URL.createObjectURL(file) : null;

    setUploadedFile({ file, type, preview, name: file.name });
    setExtractedText("");
    setError("");
    setResult(null);
  }, []);

  // ─── Drag-and-drop handlers ────────────────────────────────────────────
  function handleDragOver(e) {
    e.preventDefault();
    setDragOver(true);
  }
  function handleDragLeave() {
    setDragOver(false);
  }
  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }
  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset input so the same file can be re-selected after clearing
    e.target.value = "";
  }

  // ─── Extract text from uploaded file ──────────────────────────────────
  async function extractFileText() {
    if (!uploadedFile) return "";

    const { file, type } = uploadedFile;

    if (type === "text") {
      return await file.text();
    }

    if (type === "image") {
      setLoadingMsg("Running OCR on image…");
      try {
        const text = await runOCR(file, (pct) => {
          setProgress(pct);
          setLoadingMsg(`OCR in progress… ${pct}%`);
        });
        if (!text.trim()) throw new Error("OCR produced no readable text from this image.");
        return text;
      } catch (err) {
        throw new Error(`OCR failed: ${err.message}`);
      }
    }

    if (type === "pdf") {
      setLoadingMsg("Extracting text from PDF…");
      try {
        const text = await extractPdfText(file, (pct) => {
          setProgress(pct);
          setLoadingMsg(`Reading PDF… ${pct}%`);
        });
        if (!text.trim()) throw new Error("No readable text found in the PDF.");
        return text;
      } catch (err) {
        throw new Error(`PDF extraction failed: ${err.message}`);
      }
    }

    return "";
  }

  // ─── Main analyze handler ──────────────────────────────────────────────
  async function handleAnalyze() {
    // Combine manual text + file-extracted text
    const manualText = content.trim();

    if (!manualText && !uploadedFile) {
      setError("Please paste a suspicious message or upload a file to analyze.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setProgress(0);
    setExtractedText("");

    try {
      let fileText = "";

      if (uploadedFile) {
        fileText = await extractFileText();
        setExtractedText(fileText);
      }

      // Combine both sources; label them for clarity in the prompt
      let combinedContent = "";
      if (manualText && fileText) {
        combinedContent = `[User-entered text]\n${manualText}\n\n[Extracted from ${uploadedFile.type.toUpperCase()} file: ${uploadedFile.name}]\n${fileText}`;
      } else if (fileText) {
        combinedContent = `[Extracted from ${uploadedFile.type.toUpperCase()} file: ${uploadedFile.name}]\n${fileText}`;
      } else {
        combinedContent = manualText;
      }

      if (combinedContent.length > 10000) {
        combinedContent = combinedContent.slice(0, 10000);
      }

      setLoadingMsg("Analyzing with IBM Granite AI…");
      setProgress(0);

      // Simulate progress while waiting for the AI response
      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 4, 90));
      }, 300);

      const data = await analyzeFraud(combinedContent);

      clearInterval(progressInterval);
      setProgress(100);
      setResult({ ...data, analyzedAt: new Date().toISOString() });

    } catch (err) {
      // Surface meaningful errors: network, OCR, PDF, API
      const msg = err.message || "Analysis failed. Please try again.";
      if (msg.includes("fetch") || msg.includes("network") || msg.includes("Failed to fetch")) {
        setError("Network error: Could not reach the CyberShield backend. Ensure the server is running on port 5000.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
      setLoadingMsg("");
      setProgress(0);
    }
  }

  // ─── Clear all state ───────────────────────────────────────────────────
  function handleClear() {
    setContent("");
    setUploadedFile(null);
    setExtractedText("");
    setResult(null);
    setError("");
    setProgress(0);
    setCopied(false);
  }

  // ─── Copy JSON result to clipboard ────────────────────────────────────
  function handleCopy() {
    if (!result) return;
    const { analyzedAt, ...rest } = result;
    navigator.clipboard.writeText(JSON.stringify(rest, null, 2)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  // ─── Download as PDF ───────────────────────────────────────────────────
  async function handleDownloadPDF() {
    if (!result) return;
    try {
      await downloadResultAsPDF(result, result.analyzedAt);
    } catch {
      setError("PDF download failed. Please try again.");
    }
  }

  const risk         = result ? getRiskConfig(result.riskScore) : null;
  const categoryIcon = result ? (CATEGORY_ICONS[result.threatCategory] || "⚠️") : null;
  const hasContent   = content.trim() || uploadedFile;

  return (
    <main className="inner-page">
      {/* ── Hero ── */}
      <section className="inner-page__hero">
        <div className="container">
          <div className="inner-page__eyebrow">
            <span className="badge badge-accent">AI Tool</span>
          </div>
          <h1 className="inner-page__title">Fraud Analyzer</h1>
          <p className="inner-page__subtitle">
            Upload a screenshot, PDF, or paste suspicious text. IBM Granite AI
            performs deep fraud detection and returns a detailed risk report.
          </p>
        </div>
      </section>

      <section className="container fraud-container">

        {/* ── Input Card ── */}
        <div className="fraud-input-card card">

          {/* ── Drag-and-drop upload zone ── */}
          <div
            className={`fa-upload-zone ${dragOver ? "fa-upload-zone--active" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Upload file for analysis"
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.webp,.pdf,.txt"
              style={{ display: "none" }}
              onChange={handleFileChange}
              disabled={loading}
            />

            {/* Uploaded image preview */}
            {uploadedFile?.preview ? (
              <div className="fa-preview-wrapper">
                <img
                  src={uploadedFile.preview}
                  alt="Uploaded preview"
                  className="fa-image-preview"
                />
                <span className="fa-file-name">📎 {uploadedFile.name}</span>
              </div>
            ) : uploadedFile ? (
              <div className="fa-file-info">
                <span className="fa-file-icon">
                  {uploadedFile.type === "pdf" ? "📄" : "📝"}
                </span>
                <span className="fa-file-name">{uploadedFile.name}</span>
                <span className="fa-file-type-badge">{uploadedFile.type.toUpperCase()}</span>
              </div>
            ) : (
              <div className="fa-upload-placeholder">
                <span className="fa-upload-icon">📂</span>
                <p className="fa-upload-title">
                  Drag &amp; drop a file here, or <span className="fa-upload-link">browse</span>
                </p>
                <p className="fa-upload-hint">
                  Supports: PNG, JPG, JPEG, WEBP, PDF, TXT &nbsp;·&nbsp; Max {MAX_FILE_SIZE_MB} MB
                </p>
              </div>
            )}
          </div>

          {/* ── Text input ── */}
          <label className="fraud-label" htmlFor="fraud-input">
            📋 Paste Suspicious Content <span className="fraud-label-optional">(optional if file uploaded)</span>
          </label>
          <textarea
            id="fraud-input"
            className="fraud-textarea"
            rows={6}
            placeholder="Paste the suspicious SMS, email, website text, UPI request, or transaction description here…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
          />

          {/* ── Character count ── */}
          <div className="fa-char-count">
            {content.length} / 10 000 characters
          </div>

          {/* ── Actions ── */}
          <div className="fraud-actions">
            <button
              className="btn btn-primary fraud-analyze-btn"
              onClick={handleAnalyze}
              disabled={loading || !hasContent}
            >
              {loading ? (
                <>
                  <span className="btn-spinner" />
                  {loadingMsg || "Analyzing…"}
                </>
              ) : (
                <>🔍 Analyze for Fraud</>
              )}
            </button>

            {(hasContent || result) && (
              <button className="btn btn-outline" onClick={handleClear} disabled={loading}>
                🗑️ Clear All
              </button>
            )}
          </div>

          {/* ── Loading progress bar ── */}
          {loading && (
            <div className="fa-progress-wrapper" aria-label="Analysis progress">
              <div className="fa-progress-track">
                <div
                  className="fa-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="fa-progress-label">{progress}%</span>
            </div>
          )}

          {/* ── Error ── */}
          {error && (
            <div className="fraud-error" role="alert">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* ── Extracted text preview ── */}
        {extractedText && !loading && (
          <div className="fa-extracted-card card">
            <h3 className="fa-extracted-title">
              🔤 Extracted Text
              <span className="fa-extracted-badge">{uploadedFile?.type?.toUpperCase()}</span>
            </h3>
            <pre className="fa-extracted-body">{extractedText}</pre>
          </div>
        )}

        {/* ── Result Card ── */}
        {result && (
          <div className="fraud-result-card card" id="fraud-result">

            {/* Header */}
            <div className="fraud-result-header">
              <h2 className="fraud-result-title">
                {categoryIcon} Analysis Report
              </h2>
              <div className="fa-result-badges">
                <span className={`risk-badge ${risk.cls}`}>
                  {risk.label} Risk
                </span>
                <span className="fa-confidence-badge">
                  Confidence: {result.confidence}
                </span>
              </div>
            </div>

            {/* Risk Score Bar */}
            <div className="risk-score-section">
              <div className="risk-score-label">
                <span>Risk Score</span>
                <strong className={risk.cls}>{result.riskScore} / 100</strong>
              </div>
              <div className="risk-bar-track">
                <div
                  className={`risk-bar-fill ${risk.bar}`}
                  style={{ width: `${result.riskScore}%` }}
                  role="progressbar"
                  aria-valuenow={result.riskScore}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>

            {/* Details Grid */}
            <div className="fraud-details-grid">

              {/* Threat Category */}
              <div className="fraud-detail-item">
                <span className="fraud-detail-label">⚠️ Threat Category</span>
                <span className="fraud-detail-value fa-category-value">
                  {categoryIcon} {result.threatCategory}
                </span>
              </div>

              {/* Analyzed At */}
              <div className="fraud-detail-item">
                <span className="fraud-detail-label">🕒 Analyzed At</span>
                <span className="fraud-detail-value fraud-timestamp">
                  {new Date(result.analyzedAt).toLocaleString()}
                </span>
              </div>

              {/* Summary */}
              <div className="fraud-detail-item fraud-detail-full">
                <span className="fraud-detail-label">🔎 Summary</span>
                <p className="fraud-detail-value">{result.summary}</p>
              </div>

              {/* Red Flags */}
              {result.redFlags?.length > 0 && (
                <div className="fraud-detail-item fraud-detail-full fa-red-flags">
                  <span className="fraud-detail-label">🚩 Red Flags Detected ({result.redFlags.length})</span>
                  <ul className="fa-flag-list">
                    {result.redFlags.map((flag, i) => (
                      <li key={i} className="fa-flag-item">
                        <span className="fa-flag-dot" />
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendation?.length > 0 && (
                <div className="fraud-detail-item fraud-detail-full fa-recommendations">
                  <span className="fraud-detail-label">✅ Recommendations</span>
                  <ol className="fa-rec-list">
                    {result.recommendation.map((rec, i) => (
                      <li key={i} className="fa-rec-item">{rec}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Financial Literacy Tip */}
              {result.financialLiteracyTip && (
                <div className="fraud-detail-item fraud-detail-full fa-literacy-tip">
                  <span className="fraud-detail-label">💡 Financial Literacy Tip</span>
                  <p className="fraud-detail-value">{result.financialLiteracyTip}</p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="fa-result-actions">
              <button className="btn btn-outline fa-action-btn" onClick={handleCopy}>
                {copied ? "✅ Copied!" : "📋 Copy Result"}
              </button>
              <button className="btn btn-outline fa-action-btn" onClick={handleDownloadPDF}>
                📥 Download PDF
              </button>
            </div>
          </div>
        )}

      </section>
    </main>
  );
}
