from typing import Optional
"""
Thin wrapper around the OpenAI API.

Design goals (see MASTER PROMPT sections 16 & 20):
- never crash the request if the LLM call fails or no API key is set
- always return either a validated dict or None (never raise to the caller)
- never leak the API key in error messages
"""

import os
import json
from dotenv import load_dotenv

load_dotenv()

_client = None


def get_client():
    global _client
    if _client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key or api_key == "your_api_key_here":
            return None
        from openai import OpenAI
        _client = OpenAI(api_key=api_key)
    return _client


def ask_json(system_prompt: str, user_prompt: str) -> Optional[dict]:
    """Call the LLM and parse a JSON object response.
    Returns None (never raises) if no key is configured, the call fails,
    or the response isn't valid JSON — callers must have a deterministic
    fallback for this case."""
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
            temperature=0.3,
        )
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception:
        return None
