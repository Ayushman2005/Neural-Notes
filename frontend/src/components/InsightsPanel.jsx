import { useEffect, useState } from "react";
import { useStore } from "../store";
import { motion } from "framer-motion";

export default function InsightsPanel() {
  const { insights, getElapsedSessionTime, setInsights, clearAllHistory } =
    useStore();
  const [sessionDisplay, setSessionDisplay] = useState("0m");

  useEffect(() => {
    // Safely handle session time updating without crashing if the function is unavailable temporarily
    const updateSession = () => {
      if (getElapsedSessionTime) {
        setSessionDisplay(getElapsedSessionTime());
      }
    };

    updateSession();
    const interval = setInterval(updateSession, 10000);
    return () => clearInterval(interval);
  }, [getElapsedSessionTime]);

  // Framer Motion Animation Variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div
      className="insights-panel"
      style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}
    >
      {/* ── Fixed CSS for Velocity Bars ── */}
      <style>{`
        .velocity-container {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          height: 180px; 
          padding-top: 20px;
        }
        .velocity-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          flex: 1;
          height: 100%;
          justify-content: flex-end; /* Forces bars to align to the bottom */
        }
        .velocity-bar-wrapper {
           height: 100%;
           width: 16px;
           background: var(--bg-sidebar); /* Creates a subtle track for the bar */
           border-radius: 6px;
           display: flex;
           align-items: flex-end;
           overflow: hidden;
        }
        .clear-all-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
          margin-bottom: 32px;
        }
        .clear-all-btn:hover {
          background: rgba(239, 68, 68, 0.2);
        }
      `}</style>

      <header style={{ marginBottom: "48px" }}>
        <h1
          style={{
            fontSize: "42px",
            fontWeight: "800",
            marginBottom: "8px",
            color: "var(--text-primary)",
          }}
        >
          Daily Monitoring
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
          Tracking your syllabus mastery and interaction velocity.
        </p>
      </header>

      {/* Top Metrics Row */}
      <motion.div
        className="metrics-grid"
        variants={container}
        initial="hidden"
        animate="show"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        <MetricCard
          variants={item}
          icon="🔥"
          label="Study Streak"
          value="5 Days"
        />
        <MetricCard
          variants={item}
          icon="🧠"
          label="Concepts Mastered"
          value={insights?.total_questions || 0}
        />
        <MetricCard
          variants={item}
          icon="⏱️"
          label="Avg. Session"
          value="42m"
        />
        <MetricCard
          variants={item}
          icon="📈"
          label="Retention Rate"
          value="88%"
        />
        <MetricCard
          variants={item}
          icon="⏳"
          label="Current Session"
          value={sessionDisplay}
        />
      </motion.div>

      {/* Clear History Button Fix */}
      {clearAllHistory && (
        <button
          className="clear-all-btn"
          onClick={() => {
            if (
              window.confirm(
                "Are you sure you want to clear all chat history? This cannot be undone.",
              )
            ) {
              clearAllHistory();
            }
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          Clear All History
        </button>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "24px",
        }}
      >
        {/* Activity Tracker (Fixed Bars) */}
        <motion.div
          className="advanced-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            padding: "32px",
            border: "1px solid var(--border-light)",
            borderRadius: "16px",
          }}
        >
          <h3 style={{ marginBottom: "24px", color: "var(--text-primary)" }}>
            Learning Velocity (7 Days)
          </h3>
          <div className="velocity-container">
            {/* Array of percentages determining height */}
            {[40, 70, 45, 90, 65, 80, 95].map((height, i) => (
              <div key={i} className="velocity-col">
                <div className="velocity-bar-wrapper">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 1, delay: i * 0.1, type: "spring" }}
                    style={{
                      width: "100%",
                      background: "var(--accent-color)", // Using the global accent variable
                      borderRadius: "6px",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    fontWeight: "600",
                  }}
                >
                  {["M", "T", "W", "T", "F", "S", "S"][i]}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Friction Points */}
        <motion.div
          className="advanced-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            padding: "32px",
            border: "1px solid var(--border-light)",
            borderRadius: "16px",
          }}
        >
          <h3 style={{ marginBottom: "20px", color: "var(--text-primary)" }}>
            Friction Points ⚠️
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {insights?.confusion_areas?.length > 0 ? (
              insights.confusion_areas.map((area, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "16px",
                    borderLeft: "3px solid var(--accent-color)",
                    background: "var(--bg-input)",
                    borderRadius: "0 8px 8px 0",
                  }}
                >
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--text-primary)",
                      margin: 0,
                      lineHeight: "1.5",
                    }}
                  >
                    {area}
                  </p>
                </div>
              ))
            ) : (
              <div
                style={{
                  padding: "20px",
                  textAlign: "center",
                  border: "1px dashed var(--border-light)",
                  borderRadius: "8px",
                }}
              >
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "14px",
                    margin: 0,
                  }}
                >
                  No roadblocks detected today. Great job!
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Fixed Metric Card to inherit global theme colors instead of hardcoded white
function MetricCard({ icon, label, value, variants }) {
  return (
    <motion.div
      variants={variants}
      className="advanced-card"
      style={{
        padding: "24px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        border: "1px solid var(--border-light)",
        borderRadius: "16px",
      }}
    >
      <div style={{ fontSize: "32px" }}>{icon}</div>
      <div>
        <div
          style={{
            fontSize: "12px",
            color: "var(--text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "1px",
            fontWeight: "600",
            marginBottom: "4px",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: "28px",
            fontWeight: "800",
            color: "var(--text-primary)",
          }}
        >
          {value}
        </div>
      </div>
    </motion.div>
  );
}
