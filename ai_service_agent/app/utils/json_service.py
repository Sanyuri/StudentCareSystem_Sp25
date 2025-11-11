import re

def extract_json_from_llm_response(raw: str) -> str:
    """
    Clean LLM output to extract JSON string from Markdown-style formatting.
    """
    # Remove ```json or ``` if present
    cleaned = re.sub(r"^```json\s*|\s*```$", "", raw.strip(), flags=re.MULTILINE)
    return cleaned.strip()