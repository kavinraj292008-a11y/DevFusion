from typing import Optional
import os
import json
from dotenv import load_dotenv

load_dotenv()

_client = None


def get_client():
    global _client
    if _client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            return None
        from openai import OpenAI
        _client = OpenAI(api_key=api_key)
    return _client


def ask_json(system_prompt: str, user_prompt: str) -> Optional[dict]:
    """Calls the LLM and expects a JSON object back. Returns None if no API
    key is configured or the call fails, so callers can fall back to a
    rule-based response (useful for offline demos)."""
    client = get_client()
    if client is None:
        return None
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
            temperature=0.4,
        )
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception:
        return None
