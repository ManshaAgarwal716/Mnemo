from google import genai

from src.ai.providers.base import AIProvider
from src.core.config import settings


class GeminiProvider(AIProvider):

    def __init__(self):
        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY,
        )

    async def generate(
        self,
        history,
        prompt: str,
        context: str,
    ) -> str:

        history.append(
            {
                "role": "user",
                "parts": [
                    {
                        "text": f"""
You are Mnemo AI, an AI research assistant.

Answer using the provided context whenever possible.

If the user greets you or asks casual questions,
respond naturally.

If the answer cannot be found inside the provided
context, clearly say you couldn't find relevant
information in the uploaded documents.

Context:
{context}

Question:
{prompt}
"""
                    }
                ],
            }
        )

        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=history,
        )

        return response.text

    async def generate_title(
        self,
        first_message: str,
    ) -> str:

        prompt = f"""
Generate a concise conversation title.

Rules:
- 3 to 6 words.
- No punctuation.
- No quotation marks.
- Return ONLY the title.

User message:

{first_message}
"""

        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                {
                    "role": "user",
                    "parts": [
                        {
                            "text": prompt,
                        }
                    ],
                }
            ],
        )

        return (
            response.text
            .strip()
            .strip('"')
            .strip("'")[:100]
        )