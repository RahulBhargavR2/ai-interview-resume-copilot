import json



from app.core.config import settings
from app.core.llm import client



# parse the resume and genereate  report
def analyze_resume(resume_text):
    prompt = f"""
You are an expert ATS resume analyzer.

Analyze this resume and return STRICT JSON only.

Required JSON format:

{{
  "ats_score": number,
  "skills": [],
  "projects":[],
  "experience":[],
  "missing_keywords": [],
  "strengths": [],
  "weaknesses": [],
  "suggestions": []
}}

Resume:
{resume_text}
"""
    response = client.generate(
        model=settings.LLM_MODEL,
        prompt=prompt
    )

    text = response['response'].strip()

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
