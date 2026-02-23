import { useStore } from "../store";

export default function Sidebar() {
  const {
    activeView,
    setActiveView,
    theme,
    toggleTheme,
    setSession,
    session,
    clearAllHistory,
  } = useStore();

  const navItems = [
    {
      id: "chat",
      label: "Chat Engine",
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
    },
    {
      id: "upload",
      label: "Knowledge Base",
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
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
      ),
    },
    {
      id: "progress",
      label: "Learning Roadmap",
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
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      ),
    },
    {
      id: "insights",
      label: "Analytics",
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
    },
    {
      id: "architecture",
      label: "System Engine",
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
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      ),
    },
  ];

  const handleLogout = () => {
    setSession(null);
    localStorage.clear();
    window.location.reload();
  };

  const handleClearHistory = () => {
    if (window.confirm("Clear all chat history? This cannot be undone.")) {
      clearAllHistory();
    }
  };

  const userInitial = session?.student_name
    ? session.student_name.charAt(0).toUpperCase()
    : "U";

  return (
    <aside
      className="thin-sidebar"
      style={{
        width: "72px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "24px 0",
        background: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border-light)",
        height: "100vh",
        zIndex: 100,
      }}
    >
      {/* ── Scoped CSS for Perfect Hover States ── */}
      <style>{`
        .icon-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 8px;
        }
        .icon-btn:hover {
          background: var(--bg-card-hover);
          color: var(--text-primary);
        }
        .icon-btn.active {
          background: var(--bg-input);
          color: var(--accent-color);
          border: 1px solid var(--border-light);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .danger-btn:hover {
          color: #ef4444 !important;
          background: rgba(239, 68, 68, 0.1) !important;
        }
        /* Removed .brand-orb style, added .sidebar-logo */
        .sidebar-logo {
          width: 40px;
          height: auto;
          margin-bottom: 24px;
          /* Optional: add a subtle drop shadow for depth */
          /* filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1)); */
        }
      `}</style>

      <div
        className="sidebar-top"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* REPLACED ORB WITH LOGO IMAGE */}
        {/* Ensure 'logo.png' is in your 'public' folder */}
        <img src="/logo.png" alt="NeuralNotes Logo" className="sidebar-logo" />

        <div
          className="nav-icons"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            width: "100%",
            alignItems: "center",
          }}
        >
          {/* New Chat Button (Prominent) */}
          <button
            className="icon-btn"
            onClick={() => {
              setSession({ ...session, session_id: Date.now().toString() });
              setActiveView("chat");
            }}
            title="New Chat Session"
            style={{
              marginBottom: "16px",
              background: "var(--bg-input)",
              border: "1px dashed var(--border-light)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-color)";
              e.currentTarget.style.color = "var(--accent-color)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "var(--border-light)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
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
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>

          {/* Mapping Nav Items */}
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`icon-btn ${activeView === item.id ? "active" : ""}`}
              onClick={() => setActiveView(item.id)}
              title={item.label}
            >
              {item.icon}
            </button>
          ))}
        </div>
      </div>

      <div
        className="sidebar-bottom"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          gap: "8px",
        }}
      >
        {clearAllHistory && (
          <button
            className="icon-btn danger-btn"
            onClick={handleClearHistory}
            title="Clear All History"
          >
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
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        )}

        <button
          className="icon-btn"
          onClick={toggleTheme}
          title="Toggle Dark/Light Mode"
        >
          {theme === "dark" ? (
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
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
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
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>

        <button
          className="icon-btn danger-btn"
          onClick={handleLogout}
          title="Sign Out"
        >
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
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>

        {/* Upgraded Premium Avatar */}
        <div
          style={{
            background: "linear-gradient(135deg, var(--accent-color), #6b21a8)",
            color: "white",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "16px",
            marginTop: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          {userInitial}
        </div>
      </div>
    </aside>
  );
}
