import google.generativeai as genai
from django.conf import settings
import os

genai.configure(api_key=API_KEY)

def Genai_response(prompt: str)->str:
    model = genai.GenerativeModel("gemini-2.0-flash",system_instruction="You are a kind Career Advisor, you need to suggest skill path and give proper career advise.")
    response = model.generate_content(prompt)
    return response.text
