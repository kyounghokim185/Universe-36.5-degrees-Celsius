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

    def concat_videos(self, video_paths: list[str], output_path: str):
        """
        Concatenates multiple videos into one.
        Assumes all videos have same codec/dimensions for best results, or re-encodes.
        Using stream concat method.
        """
        try:
            inputs = [ffmpeg.input(path) for path in video_paths]
            # Concat strictly (n=number of inputs, v=1 video out, a=1 audio out)
            # This requires complex filter.
            # Simplified approach: create a file list for concat demuxer if simple,
            # but API approach uses filter_complex for robustness with different formats.
            
            # Let's try simple concat filter
            (
                ffmpeg
                .concat(*inputs, v=1, a=1)
                .output(output_path)
                .overwrite_output()
                .run(capture_stdout=True, capture_stderr=True)
            )
            return output_path
        except ffmpeg.Error as e:
            print(f"FFmpeg concat error: {e.stderr.decode() if e.stderr else str(e)}")
            raise e
            
    def add_overlay_text(self, input_path: str, output_path: str, text: str):
        """
        Adds text overlay to video. 
        Note: Requires font file path usually, or system font. 
        Defaults to basic drawtext.
        """
        try:
            (
                ffmpeg
                .input(input_path)
                .output(output_path, vf=f"drawtext=text='{text}':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=(h-text_h)/2")
                .overwrite_output()
                .run(capture_stdout=True, capture_stderr=True)
            )
            return output_path
        except ffmpeg.Error as e:
            print(f"FFmpeg overlay error: {e.stderr.decode() if e.stderr else str(e)}")
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
