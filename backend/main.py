from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from .routers import ai_router, media_router

# Load environment variables
load_dotenv()

app = FastAPI(title="Happy Birthday AI Server")

# CORS configuration
origins = [
    "http://localhost:5173",  # Vite default
    "http://localhost:3000",  # Next.js default
    "*",                      # Allow all for development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_router.router)
app.include_router(media_router.router)

@app.get("/")
def read_root():
    return {"message": "Happy Birthday AI Server is running!"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
