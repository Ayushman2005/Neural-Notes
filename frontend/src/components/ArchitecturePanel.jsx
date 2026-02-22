import React from "react";

// Clean, minimalist tech badge component
const TechBadge = ({ name }) => <span className="tech-badge">{name}</span>;

export default function ArchitecturePanel() {
  return (
    <div
      className="architecture-panel"
      style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}
    >
      {/* ── Minimalist CSS for specific elements in this panel ── */}
      <style>{`
        .tech-badge {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 20px;
          background: var(--bg-input);
          border: 1px solid var(--border-light);
          color: var(--text-primary);
          font-size: 12px;
          font-weight: 600;
          margin-right: 8px;
          margin-bottom: 8px;
          transition: all 0.2s ease;
        }

        .tech-badge:hover {
          background: var(--bg-card-hover);
          border-color: var(--accent-color);
          color: var(--accent-color);
        }

        .icon-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: var(--bg-input);
          border: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 48px;
        }
      `}</style>

      <div
        className="panel-header"
        style={{ textAlign: "center", marginBottom: "48px" }}
      >
        <h2
          style={{ fontSize: "36px", fontWeight: "800", marginBottom: "12px" }}
        >
          System Architecture
        </h2>
        <p
          className="panel-sub"
          style={{
            margin: "0 auto",
            color: "var(--text-secondary)",
            maxWidth: "700px",
            lineHeight: "1.6",
          }}
        >
          A high-performance, syllabus-aware AI learning platform. Built with
          modern asynchronous frameworks and a locally vectorized
          Retrieval-Augmented Generation (RAG) pipeline.
        </p>
      </div>

      {/* ── Clean Tech Stack Grid ── */}
      <div className="metrics-grid">
        {/* Frontend Card */}
        <div
          className="advanced-card"
          style={{
            padding: "24px",
            border: "1px solid var(--border-light)",
            borderRadius: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div className="icon-box">🎨</div>
            <h3
              className="card-title"
              style={{ fontSize: "20px", margin: 0, fontWeight: "700" }}
            >
              Frontend UI & State
            </h3>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <TechBadge name="React 18" />
            <TechBadge name="Vite" />
            <TechBadge name="Zustand" />
            <TechBadge name="Framer Motion" />
          </div>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "14px",
              lineHeight: "1.7",
              margin: 0,
            }}
          >
            Lightning-fast SPA rendered via <strong>Vite</strong>. Global state
            is persisted using <strong>Zustand</strong>. Smooth UI transitions
            and Learning Velocity graphs are powered by{" "}
            <strong>Framer Motion</strong>.
          </p>
        </div>

        {/* Backend Card */}
        <div
          className="advanced-card"
          style={{
            padding: "24px",
            border: "1px solid var(--border-light)",
            borderRadius: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div className="icon-box">⚙️</div>
            <h3
              className="card-title"
              style={{ fontSize: "20px", margin: 0, fontWeight: "700" }}
            >
              Backend API
            </h3>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <TechBadge name="Python 3" />
            <TechBadge name="FastAPI" />
            <TechBadge name="Pydantic" />
          </div>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "14px",
              lineHeight: "1.7",
              margin: 0,
            }}
          >
            Driven by a highly concurrent <strong>FastAPI</strong> ASGI server.
            Endpoints enforce strict type-hinting and robust payload validation
            using <strong>Pydantic</strong> models.
          </p>
        </div>

        {/* Engine Card */}
        <div
          className="advanced-card"
          style={{
            padding: "24px",
            border: "1px solid var(--border-light)",
            borderRadius: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div className="icon-box">🧠</div>
            <h3
              className="card-title"
              style={{ fontSize: "20px", margin: 0, fontWeight: "700" }}
            >
              AI & RAG Engine
            </h3>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <TechBadge name="ChromaDB" />
            <TechBadge name="SentenceTransformers" />
            <TechBadge name="PyPDF" />
          </div>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "14px",
              lineHeight: "1.7",
              margin: 0,
            }}
          >
            Documents are chunked via <strong>PyPDF</strong> and vectorized into
            a local <strong>ChromaDB</strong> space to ground LLM generations
            strictly within the syllabus context.
          </p>
        </div>

        {/* Utilities Card */}
        <div
          className="advanced-card"
          style={{
            padding: "24px",
            border: "1px solid var(--border-light)",
            borderRadius: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div className="icon-box">🛠️</div>
            <h3
              className="card-title"
              style={{ fontSize: "20px", margin: 0, fontWeight: "700" }}
            >
              Parsing & Storage
            </h3>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <TechBadge name="React Markdown" />
            <TechBadge name="KaTeX" />
            <TechBadge name="SQLite" />
            <TechBadge name="html2pdf.js" />
          </div>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "14px",
              lineHeight: "1.7",
              margin: 0,
            }}
          >
            Chat supports syntax highlighting and <strong>KaTeX</strong> math
            rendering. Dual <strong>SQLite</strong> databases manage multi-turn
            memory and learning analytics, with <strong>html2pdf</strong>{" "}
            enabling local exports.
          </p>
        </div>
      </div>

      {/* ── 5-Step RAG Data Pipeline Timeline ── */}
      <h3
        style={{
          fontSize: "28px",
          marginBottom: "32px",
          textAlign: "center",
          fontWeight: "800",
          color: "var(--text-primary)",
        }}
      >
        The RAG Data Pipeline
      </h3>

      <div
        className="advanced-card"
        style={{
          padding: "40px",
          border: "1px solid var(--border-light)",
          borderRadius: "16px",
        }}
      >
        <div className="timeline-container">
          {/* Step 1 */}
          <div
            className="timeline-item"
            style={{
              display: "flex",
              gap: "24px",
              paddingBottom: "40px",
              position: "relative",
            }}
          >
            <div
              className="timeline-line"
              style={{
                position: "absolute",
                left: "19px",
                top: "40px",
                bottom: 0,
                width: "2px",
                background: "var(--border-light)",
              }}
            ></div>
            <div
              className="step-number"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "var(--bg-sidebar)",
                border: "2px solid var(--accent-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                zIndex: 1,
                flexShrink: 0,
              }}
            >
              1
            </div>
            <div className="timeline-content">
              <h3
                className="timeline-title"
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  marginBottom: "8px",
                }}
              >
                Document Ingestion & Chunking
              </h3>
              <p
                className="timeline-desc"
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: "1.6",
                  margin: 0,
                }}
              >
                Syllabus files are parsed via PyPDF and split into overlapping
                chunks (e.g., 400 words). The algorithm uses overlap to ensure
                no context is lost between page breaks or paragraphs.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div
            className="timeline-item"
            style={{
              display: "flex",
              gap: "24px",
              paddingBottom: "40px",
              position: "relative",
            }}
          >
            <div
              className="timeline-line"
              style={{
                position: "absolute",
                left: "19px",
                top: "40px",
                bottom: 0,
                width: "2px",
                background: "var(--border-light)",
              }}
            ></div>
            <div
              className="step-number"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "var(--bg-sidebar)",
                border: "2px solid var(--accent-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                zIndex: 1,
                flexShrink: 0,
              }}
            >
              2
            </div>
            <div className="timeline-content">
              <h3
                className="timeline-title"
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  marginBottom: "8px",
                }}
              >
                Vector Embedding Generation
              </h3>
              <p
                className="timeline-desc"
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: "1.6",
                  margin: 0,
                }}
              >
                Each text chunk is processed through a dense embedding model
                (like all-MiniLM-L6-v2) to convert the semantic meaning of the
                text into high-dimensional mathematical vector arrays.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div
            className="timeline-item"
            style={{
              display: "flex",
              gap: "24px",
              paddingBottom: "40px",
              position: "relative",
            }}
          >
            <div
              className="timeline-line"
              style={{
                position: "absolute",
                left: "19px",
                top: "40px",
                bottom: 0,
                width: "2px",
                background: "var(--border-light)",
              }}
            ></div>
            <div
              className="step-number"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "var(--bg-sidebar)",
                border: "2px solid var(--accent-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                zIndex: 1,
                flexShrink: 0,
              }}
            >
              3
            </div>
            <div className="timeline-content">
              <h3
                className="timeline-title"
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  marginBottom: "8px",
                }}
              >
                Vector Database Indexing
              </h3>
              <p
                className="timeline-desc"
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: "1.6",
                  margin: 0,
                }}
              >
                The generated vectors, along with their original text metadata,
                are stored in a local ChromaDB instance optimized for
                ultra-fast, highly scalable similarity searches.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div
            className="timeline-item"
            style={{
              display: "flex",
              gap: "24px",
              paddingBottom: "40px",
              position: "relative",
            }}
          >
            <div
              className="timeline-line"
              style={{
                position: "absolute",
                left: "19px",
                top: "40px",
                bottom: 0,
                width: "2px",
                background: "var(--border-light)",
              }}
            ></div>
            <div
              className="step-number"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "var(--bg-sidebar)",
                border: "2px solid var(--accent-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                zIndex: 1,
                flexShrink: 0,
              }}
            >
              4
            </div>
            <div className="timeline-content">
              <h3
                className="timeline-title"
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  marginBottom: "8px",
                }}
              >
                Query Processing & Retrieval
              </h3>
              <p
                className="timeline-desc"
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: "1.6",
                  margin: 0,
                }}
              >
                When a question is asked, it is converted into a vector. The
                engine performs a mathematical cosine-similarity search to fetch
                the top 3-5 most relevant chunks directly from the syllabus.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div
            className="timeline-item"
            style={{ display: "flex", gap: "24px", position: "relative" }}
          >
            <div
              className="step-number"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "var(--bg-sidebar)",
                border: "2px solid var(--accent-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                zIndex: 1,
                flexShrink: 0,
              }}
            >
              5
            </div>
            <div className="timeline-content">
              <h3
                className="timeline-title"
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  marginBottom: "8px",
                }}
              >
                LLM Synthesis & Generation
              </h3>
              <p
                className="timeline-desc"
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: "1.6",
                  margin: 0,
                }}
              >
                The retrieved syllabus chunks are injected into the prompt
                alongside the query. The system uses this isolated context to
                generate a formatted, pointwise response without hallucinating.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
