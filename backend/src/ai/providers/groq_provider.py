from groq import AsyncGroq

from src.ai.providers.base import AIProvider
from src.core.config import settings


SYSTEM_PROMPT = """
You are Mnemo AI, an AI research assistant.

Answer using the provided context whenever possible.

If the user greets you or asks casual questions,
respond naturally.

If the answer cannot be found inside the provided
context, clearly say you couldn't find relevant
information in the uploaded documents.
"""


class GroqProvider(AIProvider):

    def __init__(self):
        self.client = AsyncGroq(
            api_key=settings.GROQ_API_KEY,
        )

    async def generate(
        self,
        history,
        prompt: str,
        context: str,
    ) -> str:

        messages = [
            {
                "role": "system",
                "content": f"{SYSTEM_PROMPT}\n\nContext:\n{context}",
            }
        ]

        for message in history:

            role = (
                "assistant"
                if message["role"] == "model"
                else "user"
            )

            text = message["parts"][0]["text"]

            messages.append(
                {
                    "role": role,
                    "content": text,
                }
            )

        messages.append(
            {
                "role": "user",
                "content": prompt,
            }
        )

        response = await self.client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.2,
        )

        return response.choices[0].message.content

    async def generate_title(
        self,
        first_message: str,
    ) -> str:

        response = await self.client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": """
Generate a concise conversation title.

Rules:
- 3 to 6 words
- No punctuation
- No quotation marks
- Return ONLY the title
""",
                },
                {
                    "role": "user",
                    "content": first_message,
                },
            ],
            temperature=0,
        )

        return (
            response.choices[0]
            .message.content.strip()
            .strip('"')
            .strip("'")[:100]
        )