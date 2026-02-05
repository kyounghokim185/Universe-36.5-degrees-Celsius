import ffmpeg
import os
from typing import Dict, Any

class MediaService:
    def get_video_info(self, file_path: str) -> Dict[str, Any]:
        """
        Returns metadata for the video file.
        """
        try:
            probe = ffmpeg.probe(file_path)
            video_stream = next((stream for stream in probe['streams'] if stream['codec_type'] == 'video'), None)
            return {
                "format": probe['format'],
                "video_stream": video_stream
            }
        except ffmpeg.Error as e:
            print(f"FFmpeg error: {e.stderr.decode() if e.stderr else str(e)}")
            raise e

    def resize_video(self, input_path: str, output_path: str, width: int, height: int):
        """
        Resizes a video to specific dimensions.
        """
        try:
            (
                ffmpeg
                .input(input_path)
                .filter('scale', width, height)
                .output(output_path)
                .overwrite_output()
                .run(capture_stdout=True, capture_stderr=True)
            )
            return output_path
        except ffmpeg.Error as e:
            print(f"FFmpeg error: {e.stderr.decode() if e.stderr else str(e)}")
            raise e

    def convert_video(self, input_path: str, output_path: str):
        """
        Converts video format (e.g. avi to mp4).
        """
        try:
            (
                ffmpeg
                .input(input_path)
                .output(output_path)
                .overwrite_output()
                .run(capture_stdout=True, capture_stderr=True)
            )
            return output_path
        except ffmpeg.Error as e:
            print(f"FFmpeg error: {e.stderr.decode() if e.stderr else str(e)}")
            raise e

media_service = MediaService()
