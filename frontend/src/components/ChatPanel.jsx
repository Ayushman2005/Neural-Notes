import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import toast from "react-hot-toast";
import { askQuestion } from "../api";
import { useStore } from "../store";
import InteractiveQuiz from "./InteractiveQuiz";
import { useVoiceAssistant } from "../useVoice";
import html2pdf from "html2pdf.js";

const MODES = [
  { value: "quick", label: "Quick" },
  { value: "step-by-step", label: "Steps" },
  { value: "example-based", label: "Examples" },
  { value: "quiz", label: "Quiz" },
];

const SUGGESTIONS = [
  "Summarize the key concepts",
  "Generate a practice quiz",
  "Explain this to a beginner",
  "What are the practical applications?",
];

export default function ChatPanel() {
  const {
    session,
    messages,
    addMessage,
    level,
    setLevel,
    mode,
    setMode,
    subject,
    setActiveTopic,
    setRoadmapData,
  } = useStore();

  const [input, setInput] = useState("");
  const [loadingState, setLoadingState] = useState("");
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const {
    isListening,
    startListening,
    speakText,
    stopSpeaking,
    autoSpeak,
    setAutoSpeak,
    isSpeaking,
  } = useVoiceAssistant();

  const userName = session?.student_name || "Ayushman";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const greeting = getGreeting();

  const handleVoiceInput = (transcript) => {
    setInput(transcript);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  const getExportHTML = (question, answer) => {
    const formatText = (text) =>
      String(text)
        .replace(/\n/g, "<br>")
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/\*(.*?)\*/g, "<i>$1</i>");

    return `
      <div style="font-family: sans-serif; color: #000; padding: 20px; background: #fff;">
        <h2 style="color: #6b21a8; border-bottom: 1px solid #e5e5e5; padding-bottom: 10px;">NeuralNotes Q&A</h2>
        <h4 style="color: #333; margin-top: 20px;">Question:</h4>
        <div style="background: #f9f9f9; padding: 10px; border-radius: 5px; margin-bottom: 20px;">${formatText(question)}</div>
        <h4 style="color: #6b21a8;">Answer:</h4>
        <div style="background: #faf5ff; padding: 10px; border-radius: 5px;">${formatText(answer)}</div>
      </div>
    `;
  };

  const exportSingleToPDF = (question, answer) => {
    const htmlContent = getExportHTML(question, answer);
    const opt = {
      margin: 0.5,
      filename: `NeuralNotes_QnA_${new Date().getTime()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(opt).from(htmlContent).save();
  };

  const exportSingleToDoc = (question, answer) => {
    let htmlContent = "<html><head><meta charset='utf-8'></head><body>";
    htmlContent += getExportHTML(question, answer);
    htmlContent += "</body></html>";

    const blob = new Blob(["\ufeff", htmlContent], {
      type: "application/msword",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `StudyAI_QnA_${new Date().getTime()}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sendMessage = async (overrideText = null) => {
    const userText =
      typeof overrideText === "string" ? overrideText : input.trim();
    if (!userText || !session || loadingState) return;

    if (
      userText.toLowerCase().includes("learn") ||
      userText.toLowerCase().includes("roadmap")
    ) {
      const topic =
        userText.replace(/learn|roadmap for/gi, "").trim() || "New Subject";
      setActiveTopic(topic);
      setRoadmapData([
        {
          title: "Basics & Foundations",
          duration: "3h",
          description: `Initial concepts of ${topic}.`,
        },
        {
          title: "Technical Application",
          duration: "5h",
          description: "Hands-on implementation and structure.",
        },
        {
          title: "Final Synthesis",
          duration: "4h",
          description: "Advanced integration and testing.",
        },
      ]);
    }

    addMessage({ role: "user", content: userText });

    // Progressive Loading
    setLoadingState("Searching syllabus...");
    const loadingInterval = setInterval(() => {
      setLoadingState((prev) => {
        if (prev === "Searching syllabus...") return "Analyzing context...";
        if (prev === "Analyzing context...") return "Synthesizing answer...";
        return "Synthesizing answer...";
      });
    }, 2500);

    try {
      let finalQuestion = `Answer this: "${userText}". RULES: Format STRICTLY Pointwise. Use the SAME language as the question. No Images. Convert table data into spaced bullet points.`;

      if (userText.toLowerCase().includes("quiz")) {
        finalQuestion = `Generate a multiple-choice quiz based on: "${userText}". You MUST return ONLY a raw JSON array. Format exactly like this: [{"question": "Question text?", "options": ["Option A", "Option B", "Option C", "Option D"], "correctAnswer": "Option A"}]`;
      }

      const payload = {
        question: finalQuestion,
        session_id: session.session_id,
        student_level: level,
        explanation_mode: "quick",
      };

      const data = await askQuestion(payload);
      const aiResponseText = String(
        data.answer || data.message || "Data not available.",
      );

      addMessage({
        role: "ai",
        content: aiResponseText,
        suggestions: data.follow_up_suggestions,
      });

      if (autoSpeak) {
        if (!aiResponseText.trim().startsWith("[")) {
          speakText(aiResponseText);
        }
        setAutoSpeak(false);
      }
    } catch (err) {
      toast.error("Failed to fetch answer.");
    } finally {
      clearInterval(loadingInterval);
      setLoadingState("");
      setInput("");
    }
  };

  const renderInputBox = () => (
    <div className="input-box-wrapper">
      <div className="input-core">
        <button
          className={`input-action-btn ${isListening ? "active-mic" : ""}`}
          onClick={() => startListening(handleVoiceInput)}
          disabled={!!loadingState || !session}
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
        </button>

        {isSpeaking && (
          <button className="input-action-btn stop" onClick={stopSpeaking}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <rect x="6" y="6" width="12" height="12"></rect>
            </svg>
          </button>
        )}

        <textarea
          ref={textareaRef}
          className="text-input"
          placeholder="Ask AI a question or make a request..."
          value={input}
          onChange={handleTextareaChange}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            !e.shiftKey &&
            (e.preventDefault(), sendMessage())
          }
          rows={1}
          disabled={!session}
        />

        <button
          className="send-action-btn"
          onClick={() => sendMessage()}
          disabled={!!loadingState || !input.trim()}
          style={{
            opacity: !!loadingState || !input.trim() ? 0.3 : 1,
            background: input.trim()
              ? "var(--text-primary)"
              : "var(--border-light)",
            transition: "all 0.2s ease",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
          </svg>
        </button>
      </div>

      <div className="input-controls-row">
        <select
          className="clean-select"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <div className="clean-modes">
          {MODES.map((m) => (
            <button
              key={m.value}
              className={`clean-mode-btn ${mode === m.value ? "active" : ""}`}
              onClick={() => setMode(m.value)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="pure-chat-layout">
      {/* ── Scoped CSS to completely disable the pink/purple outline ── */}
      <style>{`
        .text-input:focus, 
        .clean-select:focus, 
        .input-action-btn:focus, 
        .send-action-btn:focus, 
        .clean-mode-btn:focus {
          outline: none !important;
          box-shadow: none !important;
        }
        
        /* Targets the wrapper box to ensure no pink borders appear on click */
        .input-core:focus-within {
          outline: none !important;
          box-shadow: none !important;
          border-color: var(--border-light) !important;
        }
        
        /* Failsafe to strip webkit default focus rings */
        textarea, input, select, button {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>

      <div className="pure-top-bar">
        <div className="top-model-selector">
          NeuralNotes Engine
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="hero-center-area">
          <div className="hero-greeting">
            <img
              src="/logo.png"
              alt="NeuralNotes Logo"
              style={{
                width: "64px",
                height: "auto",
                marginBottom: "20px",
              }}
            />
            <h1>
              {greeting}, {userName}
            </h1>
            <h2>What's on your mind?</h2>
          </div>

          <div className="hero-input-container">{renderInputBox()}</div>

          <div className="hero-suggestions-grid">
            <div className="suggestion-header">
              GET STARTED WITH AN EXAMPLE BELOW
            </div>
            <div className="suggestion-cards">
              {SUGGESTIONS.map((sug, i) => (
                <button
                  key={i}
                  className="suggestion-card"
                  onClick={() => sendMessage(sug)}
                >
                  <div className="card-text">{sug}</div>
                  <svg
                    className="card-icon"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="active-chat-area">
          <div className="messages-list">
            {messages.map((msg, idx) => (
              <div key={idx} className={`pure-message-row ${msg.role}`}>
                <div className="pure-avatar">
                  {msg.role === "ai" ? (
                    <div className="ai-orb-small"></div>
                  ) : (
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, var(--accent-color), #6b21a8)",
                        color: "white",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "14px",
                        flexShrink: 0,
                      }}
                    >
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="pure-message-content">
                  {(() => {
                    if (msg.role === "ai") {
                      try {
                        const contentStr = msg.content || "";
                        const jsonStart = contentStr.indexOf("[");
                        const jsonEnd = contentStr.lastIndexOf("]");

                        if (jsonStart !== -1 && jsonEnd !== -1) {
                          const cleanJson = contentStr.substring(
                            jsonStart,
                            jsonEnd + 1,
                          );
                          const parsedData = JSON.parse(cleanJson);

                          if (
                            Array.isArray(parsedData) &&
                            parsedData[0]?.question &&
                            parsedData[0]?.options
                          ) {
                            return <InteractiveQuiz quizData={parsedData} />;
                          }
                        }
                      } catch (e) {
                        // Fails silently; renders as Markdown
                      }
                    }

                    return (
                      <div className="markdown-body">
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          components={{
                            img: () => null,
                            code({
                              node,
                              inline,
                              className,
                              children,
                              ...props
                            }) {
                              const match = /language-(\w+)/.exec(
                                className || "",
                              );
                              return !inline && match ? (
                                <SyntaxHighlighter
                                  style={vscDarkPlus}
                                  language={match[1]}
                                  PreTag="div"
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                              ) : (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {String(msg.content || " ")}
                        </ReactMarkdown>

                        {msg.role === "ai" && (
                          <div
                            className="pure-actions-row"
                            style={{
                              display: "flex",
                              gap: "12px",
                              marginTop: "16px",
                            }}
                          >
                            <button
                              className="action-link"
                              onClick={() => {
                                navigator.clipboard.writeText(msg.content);
                                toast.success("Copied to clipboard!");
                              }}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <svg
                                viewBox="0 0 24 24"
                                width="14"
                                height="14"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <rect
                                  x="9"
                                  y="9"
                                  width="13"
                                  height="13"
                                  rx="2"
                                  ry="2"
                                ></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                              </svg>
                              Copy
                            </button>

                            <button
                              className="action-link"
                              onClick={() =>
                                exportSingleToPDF(
                                  idx > 0
                                    ? messages[idx - 1].content
                                    : "Context",
                                  msg.content,
                                )
                              }
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <svg
                                viewBox="0 0 24 24"
                                width="14"
                                height="14"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                              </svg>
                              Export PDF
                            </button>

                            <button
                              className="action-link"
                              onClick={() =>
                                exportSingleToDoc(
                                  idx > 0
                                    ? messages[idx - 1].content
                                    : "Context",
                                  msg.content,
                                )
                              }
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <svg
                                viewBox="0 0 24 24"
                                width="14"
                                height="14"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                              </svg>
                              Export DOC
                            </button>
                          </div>
                        )}

                        {msg.suggestions && msg.suggestions.length > 0 && (
                          <div className="pure-suggestions-row">
                            {msg.suggestions.map((sug, i) => (
                              <button
                                key={i}
                                className="pure-pill"
                                onClick={() => sendMessage(sug)}
                                disabled={!!loadingState}
                              >
                                {sug}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            ))}
            {loadingState && (
              <div className="pure-message-row ai">
                <div className="pure-avatar">
                  <div className="ai-orb-small pulse"></div>
                </div>
                <div className="pure-message-content">
                  <div className="typing-indicator">{loadingState}</div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="bottom-input-container">{renderInputBox()}</div>
        </div>
      )}
    </div>
  );
}
