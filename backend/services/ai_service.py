import replicate
import os
from typing import Optional, Dict, Any

class AIService:
    def __init__(self):
        # API token should be loaded from env REPLICATE_API_TOKEN by replicate package automatically,
        # but we can check it here.
        if not os.getenv("REPLICATE_API_TOKEN"):
            print("Warning: REPLICATE_API_TOKEN is not set.")

    def generate_image(self, prompt: str, model: str = "black-forest-labs/flux-1.1-pro") -> str:
        """
        Generates an image using the specified Replicate model.
        Returns the URL of the generated image.
        """
        print(f"Generating image with prompt: {prompt}, model: {model}")
        try:
            output = replicate.run(
                model,
                input={
                    "prompt": prompt,
                    "aspect_ratio": "16:9",
                    "output_format": "webp",
                    "output_quality": 80,
                    "safety_tolerance": 2
                }
            )
            # Output is usually a list of strings (URLs) or a file object depending on model.
            # For Flux Pro, it returns a generic object that behaves like a string or list.
            if isinstance(output, list):
                return str(output[0])
            return str(output)
        except Exception as e:
            print(f"Error generating image: {e}")
            raise e

    def generate_video(self, prompt: str, image_url: Optional[str] = None, model: str = "luma/ray") -> str:
        """
        Generates a video using the specified Replicate model.
        Supports text-to-video or image-to-video if the model supports it.
        """
        print(f"Generating video with prompt: {prompt}, image: {image_url}, model: {model}")
        
        input_data = {
            "prompt": prompt,
            "loop": False
        }
        
        if image_url:
            input_data["start_image_url"] = image_url

        try:
            output = replicate.run(
                model,
                input=input_data
            )
            
            # Luma/ray typically returns a string URL
            if isinstance(output, list):
                 return str(output[0])
            return str(output)
            
        except Exception as e:
            print(f"Error generating video: {e}")
            raise e

ai_service = AIService()
