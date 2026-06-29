from app.core.llm import client
from app.core.config import settings
from app.core.logger import logger


def generateResponse(prompt:str):
    try:
        response = client.generate(
            settings.LLM_MODEL,
            prompt=prompt,
            options={
                "temperature":0
            }
        )
        text = response.get("response","").replace("```json", "").replace("```", "").strip()
        return text
    except Exception as e:
        logger.error(str(e))

