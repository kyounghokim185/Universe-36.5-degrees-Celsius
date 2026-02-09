from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from ..services.ai_service import ai_service
from ..services.prompt_service import prompt_service

router = APIRouter(
    prefix="/ai",
    tags=["ai"]
)

class RefinePromptRequest(BaseModel):
    user_data: Dict[str, Any]

class ImageGenRequest(BaseModel):
    prompt: str
    model: Optional[str] = "black-forest-labs/flux-1.1-pro"
    aspect_ratio: Optional[str] = "16:9"

class VideoGenRequest(BaseModel):
    prompt: str
    image_url: Optional[str] = None
    model: Optional[str] = "luma/ray"

@router.post("/refine")
async def refine_prompt(request: RefinePromptRequest):
    try:
        refined = prompt_service.refine_prompt(request.user_data)
        return {"prompt": refined}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate/image")
async def generate_image(request: ImageGenRequest):
    try:
        url = ai_service.generate_image(request.prompt, request.model, request.aspect_ratio)
        return {"url": url, "predictions": [{"bytesBase64Encoded": None, "url": url}]} 
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate/video")
async def generate_video(request: VideoGenRequest):
    try:
        url = ai_service.generate_video(request.prompt, request.image_url, request.model)
        return {"url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
