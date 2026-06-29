import json


from app.core.config import settings
from app.core.llm import client
from app.core.llmResponse import (generateResponse)


# parse the resume and genereate  report
def analyze_resume(resume_text):
    prompt = f"""
You are an expert ATS resume analyzer.

Analyze this resume and return STRICT JSON only.
do not hallucinate

Required JSON format:

{{
  "ats_score": number,
  "skills": [],
  "projects":[
        {{
            "title":"project title",
            "description":"project description",
            "tech_stack":[list of tech_stack used]
        }}
    ],
  "experience":[internship or work experience],
  "missing_keywords": [skills or keywords that are not included but used in projects],
  "strengths": [which shows the depth and complex topics],
  "weaknesses": [areas where one laks],
  "suggestions": []
}}

Resume:
{resume_text}
"""
    response = generateResponse(prompt=prompt)

    try:
        return json.loads(response)
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
