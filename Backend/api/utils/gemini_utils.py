import google.generativeai as genai
from django.conf import settings
import os

genai.configure(api_key='AIzaSyD7Y_pcpGa0Mb8SSrQ9hlku0v6X1Nkc-Ng')

def Genai_response(prompt: str)->str:
    model = genai.GenerativeModel("gemini-2.0-flash",system_instruction="You are a kind Career Advisor, you need to suggest skill path and give proper career advise.")
    response = model.generate_content(prompt)
    return response.text
