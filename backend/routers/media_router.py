from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services.media_service import media_service
import os

router = APIRouter(
    prefix="/media",
    tags=["media"]
)

class ProcessVideoRequest(BaseModel):
    input_path: str
    output_path: str
    width: int
    height: int

@router.post("/process/resize")
async def resize_video(request: ProcessVideoRequest):
    if not os.path.exists(request.input_path):
        raise HTTPException(status_code=404, detail="Input file not found")
    
    try:
        output = media_service.resize_video(
            request.input_path, 
            request.output_path, 
            request.width, 
            request.height
        )
        return {"status": "success", "output_path": output}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/info")
async def get_video_info(path: str):
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found")
    
    try:
        info = media_service.get_video_info(path)
        return info
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
