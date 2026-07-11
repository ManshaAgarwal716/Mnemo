from google.genai import types

import fitz
from google import genai
from src.core.config import settings

class ProcessingService:
    def __init__(self):

        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY,
        )
    def extract_text(
        self,
        file_path: str,
    ) -> str:

        document = fitz.open(file_path)

        text = ""

        for page in document:

            text += page.get_text()

        document.close()

        return text
    def chunk_text(
    self,
    text: str,
    chunk_size: int = 300,
) -> list[str]:

        words = text.split()

        chunks = []

        for i in range(
            0,
            len(words),
            chunk_size,
        ):

            chunk = words[
                i:i + chunk_size
            ]

            chunks.append(
                " ".join(chunk)
            )

        return chunks
    def generate_embedding(
    self,
    text: str,
) -> list[float]:

        response = self.client.models.embed_content(
            model="gemini-embedding-001",
            contents=text,
            config=types.EmbedContentConfig(
            task_type="RETRIEVAL_DOCUMENT",
        ),
        )

        return response.embeddings[0].values

processing_service = ProcessingService()