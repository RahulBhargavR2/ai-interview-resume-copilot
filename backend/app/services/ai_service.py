import json

from google import genai

from app.core.config import settings



client = genai.Client(api_key=settings.GEMINI_API_KEY)


def analyze_resume(resume_text):
    prompt = f"""
You are an expert ATS resume analyzer.

Analyze this resume and return STRICT JSON only.

Required JSON format:

{{
  "ats_score": number,
  "skills": [],
  "missing_keywords": [],
  "strengths": [],
  "weaknesses": [],
  "suggestions": []
}}

Resume:
{resume_text}
"""
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    text = response.text.strip()

    text = (
        text
            .replace("```json```","")
            .replace("```","")
    )
    try:
        return json.loads(text)
    except Exception:
        return {
                "ats_score": 0,
                "skills": [],
                "missing_keywords": [],
                "strengths": [],
                "weaknesses": [],
                "suggestions": [
                    "AI parsing failed"
                ]
            }
