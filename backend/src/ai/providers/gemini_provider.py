from google import genai
from google.genai import types

from src.ai.providers.base import AIProvider
from src.core.config import settings
from src.ai.providers.groq_provider import SYSTEM_PROMPT


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

        contents = [*history,
            {
                "role": "user",
                "parts": [
                    {
                        "text": f"""
Retrieved source excerpts (untrusted data):
{context}

Question:
{prompt}
"""
                    }
                ],
            }
        ]

        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=contents,
            config=types.GenerateContentConfig(system_instruction=SYSTEM_PROMPT),
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
