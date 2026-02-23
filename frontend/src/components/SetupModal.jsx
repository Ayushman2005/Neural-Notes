import { useState } from "react";
import toast from "react-hot-toast";
import { createSession } from "../api";
import { useStore } from "../store";
import { motion } from "framer-motion";

export default function SetupModal() {
  const { setSession } = useStore();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStart = async (e) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setLoading(true);
    try {
      // Pass "General" as a fallback to satisfy the backend
      const data = await createSession(name.trim(), "General");
      setSession(data);
      toast.success(`Welcome, ${data.student_name}!`);
    } catch (err) {
      toast.error(`Could not connect to backend: ${err.message}`);
    }
    setLoading(false);
  };

  const features = [
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="6"></circle>
          <circle cx="12" cy="12" r="2"></circle>
        </svg>
      ),
      text: (
        <span>
          <strong>RAG-powered</strong> — grounded strictly in your syllabus
        </span>
      ),
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a8 8 0 0 0-8 8c0 5.4 3.6 8.5 8 11 4.4-2.5 8-5.6 8-11a8 8 0 0 0-8-8z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      ),
      text: (
        <span>
          Adapts explanation depth to your <strong>learning level</strong>
        </span>
      ),
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      ),
      text: (
        <span>
          Multi-turn memory for <strong>contextual follow-ups</strong>
        </span>
      ),
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      ),
      text: (
        <span>
          Tracks <strong>confusion areas</strong> and learning history
        </span>
      ),
    },
  ];

  return (
    <div
      className="setup-modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(8px)",
        zIndex: 1000,
        padding: "24px",
      }}
    >
      {/* ── Scoped CSS for Setup Modal Animations & Layout ── */}
      <style>{`
        .setup-card {
          width: 100%;
          max-width: 480px;
          background: var(--bg-sidebar);
          border: 1px solid var(--border-light);
          border-radius: 24px;
          padding: 48px 40px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          position: relative;
          overflow: hidden;
        }
        .setup-glow {
          position: absolute;
          top: -50px;
          left: 50%;
          transform: translateX(-50%);
          width: 150px;
          height: 150px;
          background: var(--accent-color);
          filter: blur(80px);
          opacity: 0.2;
          pointer-events: none;
        }
        .setup-feature-item {
          display: flex;
          align-items: center;
          gap: 16px;
          color: var(--text-secondary);
          font-size: 15px;
          margin-bottom: 20px;
          line-height: 1.5;
        }
        .setup-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: var(--bg-input);
          border: 1px solid var(--border-light);
          color: var(--accent-color);
          flex-shrink: 0;
        }
        .setup-input {
          width: 100%;
          background: var(--bg-input);
          border: 1px solid var(--border-light);
          color: var(--text-primary);
          padding: 16px 20px;
          border-radius: 12px;
          font-size: 16px;
          outline: none;
          transition: all 0.3s ease;
          margin-bottom: 24px;
        }
        .setup-input:focus {
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
        }
        .setup-btn {
          width: 100%;
          padding: 16px;
          border-radius: 12px;
          border: none;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
        }
        .setup-btn:disabled {
          background: var(--bg-input);
          color: var(--text-secondary);
          cursor: not-allowed;
          opacity: 0.7;
        }
        .setup-btn:not(:disabled) {
          background: linear-gradient(135deg, var(--accent-color), #6b21a8);
          color: white;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        }
        .setup-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
        }
        /* Custom spinner animation */
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinner-icon {
          animation: spin 1s linear infinite;
        }
      `}</style>

      <motion.div
        className="setup-card"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
      >
        <div className="setup-glow"></div>

        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            style={{ marginBottom: "16px", display: "inline-block" }}
          >
            {/* If you have logo.png in the public folder, use: <img src="/logo.png" width="48" /> */}
            <svg
              viewBox="0 0 24 24"
              width="40"
              height="40"
              fill="none"
              stroke="var(--accent-color)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </motion.div>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "800",
              color: "var(--text-primary)",
              marginBottom: "12px",
            }}
          >
            Welcome to NeuralNotes
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "15px",
              lineHeight: "1.6",
            }}
          >
            Your syllabus-aware learning assistant. I answer questions{" "}
            <strong>only from your uploaded material</strong> — no
            hallucinations, no off-syllabus content, with full source
            attribution.
          </p>
        </div>

        {/* Features List */}
        <div style={{ marginBottom: "40px" }}>
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="setup-feature-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
            >
              <div className="setup-icon-wrapper">{feature.icon}</div>
              <div>{feature.text}</div>
            </motion.div>
          ))}
        </div>

        {/* Input & Form Area */}
        <form onSubmit={handleStart}>
          <div
            style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "var(--text-secondary)",
              letterSpacing: "1px",
              marginBottom: "8px",
              textTransform: "uppercase",
            }}
          >
            Your Name *
          </div>
          <input
            type="text"
            className="setup-input"
            placeholder="e.g. Priya Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            autoFocus
          />

          <button
            type="submit"
            className="setup-btn"
            disabled={!name.trim() || loading}
          >
            {loading ? (
              <span
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <svg
                  className="spinner-icon"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="2" x2="12" y2="6"></line>
                  <line x1="12" y1="18" x2="12" y2="22"></line>
                  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                  <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                  <line x1="2" y1="12" x2="6" y2="12"></line>
                  <line x1="18" y1="12" x2="22" y2="12"></line>
                  <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                  <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                </svg>
                Connecting...
              </span>
            ) : (
              <>
                Start Learning
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
