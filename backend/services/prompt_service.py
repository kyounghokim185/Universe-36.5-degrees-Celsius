import os
import google.generativeai as genai
from typing import Dict, Any

class PromptService:
    def __init__(self):
        # Expecting GEMINI_API_KEY in env
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            print("Warning: GEMINI_API_KEY is not set for PromptService.")
        else:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')

    def refine_prompt(self, user_data: Dict[str, Any]) -> str:
        """
        Refines user data into a professional video generation prompt.
        """
        if not self.api_key:
            return f"Cinematic shot of a birthday party for {user_data.get('name', 'someone')}, highly detailed, 8k."

        try:
            prompt_text = f"""
            You are an expert AI video prompt engineer.
            Convert the following user input into a highly detailed, cinematic text-to-video prompt for a realistic AI model (like Luma or Veo).

            User Info:
            - Name: {user_data.get('name')}
            - Age: {user_data.get('age')}
            - Vibe: {user_data.get('vibe')}
            - Location: {user_data.get('locationName')}
            - Food: {user_data.get('food')}
            - Country Style: {user_data.get('country', 'General')}

            Requirements:
            - Wide angle 21:9 aspect ratio description.
            - First person POV.
            - Describe lighting, camera movement (handheld 360), and texture.
            - Output ONLY the prompt in English.
            """
            
            response = self.model.generate_content(prompt_text)
            return response.text.strip()
        except Exception as e:
            print(f"Error refining prompt: {str(e)}")
            return f"Birthday party at {user_data.get('locationName')} with {user_data.get('food')}, cinematic lighting, 8k."

prompt_service = PromptService()
