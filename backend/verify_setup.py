import os
import sys
import shutil

def check_ffmpeg():
    print("Checking FFmpeg...")
    if shutil.which("ffmpeg"):
        print("✅ FFmpeg is installed and in PATH.")
        return True
    else:
        print("❌ FFmpeg is NOT found in PATH. Please install FFmpeg.")
        return False

def check_env():
    print("Checking Environment Variables...")
    # Try to load .env just in case, though this script might run standalone
    try:
        from dotenv import load_dotenv
        load_dotenv()
    except ImportError:
        print("⚠️  python-dotenv not installed, checking system env only.")

    token = os.getenv("REPLICATE_API_TOKEN")
    if token:
        print("✅ REPLICATE_API_TOKEN is set.")
        return True
    else:
        print("❌ REPLICATE_API_TOKEN is NOT set in environment.")
        return False

if __name__ == "__main__":
    print(f"Python version: {sys.version}")
    ffmpeg_ok = check_ffmpeg()
    env_ok = check_env()
    
    if ffmpeg_ok and env_ok:
        print("\n🎉 System appears ready for AI Server!")
    else:
        print("\n⚠️  Some checks failed. See above.")
