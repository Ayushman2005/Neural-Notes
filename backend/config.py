"""
config.py — Centralized configuration for NeuralNotes backend
All environment variables and constants live here.
"""

import os
from dataclasses import dataclass, field
from typing import Optional
from dotenv import load_dotenv

# Load .env file
load_dotenv()


@dataclass
class Config:
    # ── API Keys ──────────────────────────────────────────────────────────────
    gemini_api_key: str = field(
        default_factory=lambda: os.environ.get("GEMINI_API_KEY", "").strip()
    )

    # ── AI Model ──────────────────────────────────────────────────────────────
    gemini_model: str = "gemini-1.5-flash"  # Optimized for performance
    max_tokens: int = 1500

    # ── RAG ───────────────────────────────────────────────────────────────────
    chroma_persist_dir: str = os.environ.get("CHROMA_STORE_PATH", "./chroma_store")
    embedding_model: str = "models/gemini-embedding-001"
    chunk_size: int = 400          # words
    chunk_overlap: int = 80        # words
    retrieval_top_k: int = 5
    retrieval_threshold: float = 0.25   # cosine similarity minimum

    # ── Memory ────────────────────────────────────────────────────────────────
    memory_db_path: str = "./studyai_memory.db"
    memory_history_window: int = 6      # turns to inject into prompt

    # ── Insights ──────────────────────────────────────────────────────────────
    insights_db_path: str = "./studyai_insights.db"

    # ── Upload ────────────────────────────────────────────────────────────────
    max_upload_size_mb: int = 50
    allowed_extensions: tuple = (".pdf", ".txt", ".md")

    # ── Server ────────────────────────────────────────────────────────────────
    host: str = os.environ.get("HOST", "0.0.0.0")
    port: int = int(os.environ.get("PORT", 8000))
    cors_origins: list = field(
        default_factory=lambda: os.environ.get("CORS_ORIGINS", "*").split(",")
    )

    def validate(self):
        """Validate critical settings. Logs warning if misconfigured."""
        if not self.gemini_api_key or len(self.gemini_api_key) < 10 or "YOUR_API_KEY" in self.gemini_api_key:
            print("\n" + "!"*60)
            print("  CRITICAL ERROR: GEMINI_API_KEY is not set correctly!")
            print("  In Render: Environment -> Add Environment Variable")
            print("  Key: GEMINI_API_KEY | Value: [Your Actual AIza... Key]")
            print("!"*60 + "\n")
            return False
        
        if not self.gemini_api_key.startswith("AIza"):
            print(f"[CONFIG] WARNING: GEMINI_API_KEY starts with unexpected characters. Check your Render settings.")
            
        return True


# Singleton instance
settings = Config()
# Initial validation
settings.validate()