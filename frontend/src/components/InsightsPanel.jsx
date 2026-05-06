import { useEffect, useState } from "react";
import { useStore } from "../store";
import { motion } from "framer-motion";

export default function InsightsPanel() {
  const { insights, getElapsedSessionTime, clearAllHistory } =
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
    <div className="insights-panel">
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

      <header className="insights-header">
        <h1 className="insights-title">
          Daily Monitoring
        </h1>
        <p className="insights-subtitle">
          Tracking your syllabus mastery and interaction velocity.
        </p>
      </header>

      {/* Top Metrics Row */}
      <motion.div
        className="metrics-grid"
        variants={container}
        initial="hidden"
        animate="show"
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
            clearAllHistory();
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

      <div className="insights-content-grid">
        {/* Activity Tracker (Fixed Bars) */}
        <motion.div
          className="advanced-card velocity-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="card-title-lg">
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
                <span className="velocity-label">
                  {["M", "T", "W", "T", "F", "S", "S"][i]}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Friction Points */}
        <motion.div
          className="advanced-card friction-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="card-title-lg">
            Friction Points ⚠️
          </h3>
          <div className="friction-list">
            {insights?.confusion_areas?.length > 0 ? (
              insights.confusion_areas.map((area, idx) => (
                <div
                  key={idx}
                  className="friction-item"
                >
                  <p>
                    {area.topic || area}
                  </p>
                </div>
              ))
            ) : (
              <div className="friction-empty">
                <p>
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
/* eslint-disable react/prop-types */
function MetricCard({ icon, label, value, variants }) {
  return (
    <motion.div
      variants={variants}
      className="advanced-card metric-card-inner"
    >
      <div className="metric-icon">{icon}</div>
      <div>
        <div className="metric-label">
          {label}
        </div>
        <div className="metric-value">
          {value}
        </div>
      </div>
    </motion.div>
  );
}
