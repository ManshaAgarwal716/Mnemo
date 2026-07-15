import json
import uuid

from google import genai
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.config import settings
from src.messages.service import message_service


class SummaryService:

    def __init__(self):
        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY,
        )

    async def generate_summary(
        self,
        db: AsyncSession,
        conversation_id: uuid.UUID,
    ) -> dict:

        messages = await message_service.get_messages(
            db,
            conversation_id,
        )

        if not messages:
            return {
                "overview": "No conversation available.",
                "key_ideas": [],
                "important_concepts": [],
                "action_items": [],
                "questions_remaining": [],
            }

        conversation = "\n\n".join(
            [
                f"{'User' if message.role.value == 'user' else 'Assistant'}: {message.content}"
                for message in messages
            ]
        )

        prompt = f"""
You are an AI assistant.

Analyze the following conversation and generate a structured summary.

Conversation:

{conversation}

Return ONLY valid JSON in the following format:

{{
  "overview": "...",
  "key_ideas": [
    "...",
    "..."
  ],
  "important_concepts": [
    "...",
    "..."
  ],
  "action_items": [
    "...",
    "..."
  ],
  "questions_remaining": [
    "...",
    "..."
  ]
}}
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

        try:
            text = response.text.strip()

            if text.startswith("```json"):
                text = text[len("```json"):]

            if text.startswith("```"):
                text = text[len("```"):]

            if text.endswith("```"):
                text = text[:-3]

            text = text.strip()

            return json.loads(text)
        except Exception:
            return {
                "overview": response.text,
                "key_ideas": [],
                "important_concepts": [],
                "action_items": [],
                "questions_remaining": [],
            }


summary_service = SummaryService()