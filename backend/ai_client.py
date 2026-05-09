import os
import json
import google.generativeai as genai
from ollama import AsyncClient
from config import settings

class AIClient:
    def __init__(self):
        self.use_gemini = bool(settings.gemini_api_key)
        
        if self.use_gemini:
            print("[AI] Using Google Gemini Engine")
            genai.configure(api_key=settings.gemini_api_key)
            self.gemini_model = genai.GenerativeModel(settings.gemini_model)
        else:
            print("[AI] Using Local Ollama Engine")
            # Connects to your local Ollama server
            self.ollama_client = AsyncClient(host="http://localhost:11434")
            self.model_name = "llama3"

    async def complete(self, prompt: str, max_tokens: int = 1500) -> dict:
        """Asynchronous completion using either Gemini or Local Ollama."""
        if self.use_gemini:
            return await self._complete_gemini(prompt, max_tokens)
        else:
            return await self._complete_ollama(prompt, max_tokens)

    async def stream_complete(self, prompt: str, max_tokens: int = 1500):
        """Streaming completion for Gemini."""
        if self.use_gemini:
            try:
                response = await self.gemini_model.generate_content_async(
                    prompt,
                    generation_config=genai.types.GenerationConfig(
                        max_output_tokens=max_tokens,
                        temperature=0.7,
                    ),
                    stream=True
                )
                async for chunk in response:
                    if chunk.text:
                        yield chunk.text
            except Exception as e:
                error_msg = str(e)
                if "API_KEY_INVALID" in error_msg or "400" in error_msg:
                    yield "[Deployment Error] Gemini API Key is invalid or missing. Please set GEMINI_API_KEY in Render."
                else:
                    yield f"[Gemini Error] {error_msg}"
        else:
            # Fallback for Ollama
            res = await self._complete_ollama(prompt, max_tokens)
            yield res["text"]

    async def _complete_gemini(self, prompt: str, max_tokens: int) -> dict:
        try:
            response = await self.gemini_model.generate_content_async(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=max_tokens,
                    temperature=0.7,
                )
            )
            return {"text": response.text, "web_sources": []}
        except Exception as e:
            error_msg = str(e)
            if "API_KEY_INVALID" in error_msg or "400" in error_msg:
                return {"text": "[Deployment Error] Gemini API Key is missing or invalid. Check Render settings.", "web_sources": []}
            return {"text": f"[Gemini Error] {error_msg}", "web_sources": []}

    async def _complete_ollama(self, prompt: str, max_tokens: int) -> dict:
        try:
            response = await self.ollama_client.generate(
                model=self.model_name,
                prompt=prompt,
                options={"num_predict": max_tokens},
            )
            return {"text": response["response"], "web_sources": []}
        except Exception as e:
            return {
                "text": f"[Ollama Error] Is Ollama running? Details: {str(e)}",
                "web_sources": [],
            }
