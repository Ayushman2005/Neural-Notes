import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { uploadDocument, listDocuments, deleteDocument } from "../api";
import { useStore } from "../store";

export default function UploadPanel() {
  const { documents, setDocuments, addDocument, removeDocument } = useStore();
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const data = await listDocuments();
      setDocuments(data.documents || []);
    } catch {
      toast.error("Could not load documents");
    }
  };

  const handleFile = async (file) => {
    if (!file) return;
    const allowed = [".pdf", ".txt", ".md"];
    const ext = "." + file.name.split(".").pop().toLowerCase();

    if (!allowed.includes(ext)) {
      toast.error(`Unsupported file type. Use: ${allowed.join(", ")}`);
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File too large (max 50MB)");
      return;
    }

    setUploading(true);
    const toastId = toast.loading(`Vectorizing & indexing ${file.name}...`);

    try {
      // Hardcode "General" subject tag under the hood
      const res = await uploadDocument(file, "General");
      addDocument(res);
      toast.success("Vector embeddings successfully generated!", {
        id: toastId,
      });
    } catch (err) {
      toast.error(`Ingestion failed: ${err.message}`, { id: toastId });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDelete = async (docId, filename) => {
    if (!window.confirm(`Purge ${filename} from the vector store?`)) return;
    try {
      await deleteDocument(docId);
      removeDocument(docId);
      toast.success("Document purged");
    } catch (err) {
      toast.error(`Failed to delete: ${err.message}`);
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div
      className="upload-panel"
      style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}
    >
      {/* ── Zen Style Scope for Upload Panel ── */}
      <style>{`
        .dropzone {
          border: 2px dashed var(--border-light);
          border-radius: 16px;
          padding: 64px 24px;
          text-align: center;
          cursor: pointer;
          background: var(--bg-sidebar);
          transition: all 0.3s ease;
        }
        .dropzone.drag-over, .dropzone:hover {
          border-color: var(--accent-color);
          background: var(--bg-card-hover);
        }
        .mode-pill {
          background: var(--bg-input);
          border: 1px solid var(--border-light);
          color: var(--text-primary);
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .mode-pill:hover {
          background: var(--bg-card-hover);
          border-color: var(--accent-color);
        }
        .delete-btn {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
          font-size: 18px;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .delete-btn:hover {
          transform: scale(1.05);
          background: rgba(239, 68, 68, 0.2);
        }
      `}</style>

      <div
        className="panel-header"
        style={{ textAlign: "center", marginBottom: "48px" }}
      >
        <h2
          style={{
            fontSize: "36px",
            fontWeight: "800",
            marginBottom: "12px",
            color: "var(--text-primary)",
          }}
        >
          Knowledge Base Engine
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
          Securely upload syllabus documents. Files are chunked and vectorized
          locally into ChromaDB to power the RAG pipeline.
        </p>
      </div>

      {/* Upload Dropzone */}
      <div
        className={`dropzone ${dragOver ? "drag-over" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
          }
        }}
        onClick={() => fileRef.current?.click()}
      >
        <div
          style={{
            fontSize: "64px",
            marginBottom: "24px",
            transition: "transform 0.3s ease",
            transform: uploading ? "scale(1.1)" : "scale(1)",
          }}
        >
          {uploading ? "⚙️" : "☁️"}
        </div>
        <h3
          style={{
            fontSize: "24px",
            fontWeight: "700",
            marginBottom: "12px",
            color: "var(--text-primary)",
          }}
        >
          {uploading
            ? "Processing Document Context..."
            : "Click or Drag to Ingest"}
        </h3>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "15px",
            maxWidth: "450px",
            margin: "0 auto",
            lineHeight: "1.6",
          }}
        >
          {uploading
            ? "Generating high-dimensional embeddings via Sentence Transformers."
            : "Supported filetypes: PDF, TXT, MD. Maximum size 50MB per file."}
        </p>
        <input
          type="file"
          ref={fileRef}
          style={{ display: "none" }}
          accept=".pdf,.txt,.md"
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        />
      </div>

      <div style={{ marginTop: "64px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "24px",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "24px",
                fontWeight: "800",
                margin: 0,
                color: "var(--text-primary)",
              }}
            >
              Vector Store Registry
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "14px",
                marginTop: "8px",
              }}
            >
              {documents.length} File{documents.length !== 1 ? "s" : ""}{" "}
              currently indexed in local database.
            </p>
          </div>
          <button className="mode-pill" onClick={fetchDocs}>
            ↻ Sync Database
          </button>
        </div>

        {documents.length === 0 ? (
          <div
            className="advanced-card"
            style={{
              textAlign: "center",
              padding: "48px",
              color: "var(--text-secondary)",
              border: "1px dashed var(--border-light)",
              borderRadius: "16px",
            }}
          >
            <span
              style={{
                fontSize: "32px",
                display: "block",
                marginBottom: "16px",
              }}
            >
              📭
            </span>
            The vector store is currently empty. Upload syllabus material to
            enable AI generation.
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {documents.map((doc) => (
              <div
                key={doc.doc_id}
                className="advanced-card"
                style={{
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid var(--border-light)",
                  borderRadius: "16px",
                  background: "var(--bg-sidebar)",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "20px" }}
                >
                  <div
                    style={{
                      fontSize: "28px",
                      background: "var(--bg-input)",
                      width: "56px",
                      height: "56px",
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid var(--border-light)",
                    }}
                  >
                    {doc.filename.endsWith(".pdf") ? "📕" : "📄"}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "16px",
                        color: "var(--text-primary)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {doc.filename}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                        marginTop: "6px",
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                        fontWeight: "600",
                      }}
                    >
                      <span>{doc.chunk_count} Data Chunks</span>
                      <span>•</span>
                      <span>{formatDate(doc.uploaded_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Fixed Delete Button Styling */}
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(doc.doc_id, doc.filename)}
                  title={`Purge ${doc.filename}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
