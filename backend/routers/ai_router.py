from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from ..services.ai_service import ai_service

router = APIRouter(
    prefix="/ai",
    tags=["ai"]
)

class ImageGenRequest(BaseModel):
    prompt: str
    model: Optional[str] = "black-forest-labs/flux-1.1-pro"

class VideoGenRequest(BaseModel):
    prompt: str
    image_url: Optional[str] = None
    model: Optional[str] = "luma/ray"

@router.post("/generate/image")
async def generate_image(request: ImageGenRequest):
    try:
        url = ai_service.generate_image(request.prompt, request.model)
        # Some legacy frontend code expects 'status' or 'predictions' format, 
        # but we are simplifying to return { "url": ... } or { "predictions": ... }
        # Let's adapt if needed, but for now standard return.
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
