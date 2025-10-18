# importing packages
from datetime import datetime, timedelta
import random
from moviepy.audio.AudioClip import concatenate_audioclips
from moviepy.audio.io.AudioFileClip import AudioFileClip
from pytubefix import YouTube
import os
from moviepy.video.io.VideoFileClip import VideoFileClip


def convert_mp4_to_mp3(input_file, output_file, clip_start_sec=0.0, clip_end_sec=None):
    print(f'clip_start_sec <{clip_start_sec}>, clip_end_sec <{clip_end_sec}>')
    video_clip = VideoFileClip(input_file).subclipped(clip_start_sec, clip_end_sec)
    audio_clip = video_clip.audio
    audio_clip.write_audiofile(output_file, codec='mp3')
    audio_clip.close()
    video_clip.close()


def download_mp4(yt, destination):
    # look for the MP4 stream
    video = yt.streams.filter(only_audio=False, file_extension='mp4').first()
    # download the file
    mp4_file = video.download(output_path=destination, skip_existing=False)
    print(f'out_file <{mp4_file}>')
    return mp4_file


def get_thumbnail_url(url):
    yt = YouTube(url)
    return yt.thumbnail_url


def download_mp3(url_to_download, index, target_dir, clip_start_sec=0.0, clip_end_sec=None):
    # download the MP4 video
    yt = YouTube(url_to_download)
    mp4_file = download_mp4(yt, target_dir)

    # convert MP4 to MP3
    base, ext = os.path.splitext(mp4_file)
    print(f'base <{base}>, ext <{ext}>')

    mp3_path = ""
    if ext == ".mp4":
        print("Got an MP4 file....converting to MP3")
        mp3_path = os.path.join(target_dir, base + str(index) + '.mp3')
        convert_mp4_to_mp3(mp4_file, mp3_path, clip_start_sec, clip_end_sec)

    # delete the MP4 file
    os.remove(mp4_file)

    # result of success
    print(yt.title + " has been successfully downloaded and saved as <" + mp3_path.title() + ">.")
    print(f'Video Thumbnail URL <{yt.thumbnail_url}>')

    return mp3_path

def convert_time_to_seconds(time_str: str) -> float:
    """
    Converts a time string into total seconds.
    Supports formats:
      - HH:MM:SS.mmm
      - MM:SS.mmm
      - SS.mmm
      - HH:MM:SS
      - MM:SS
      - SS
    """
    if not time_str:
        return 0.0

    # Split milliseconds (if any)
    if '.' in time_str:
        time_part, millis_part = time_str.split('.', 1)
        milliseconds = int(millis_part.ljust(3, '0'))  # Pad to 3 digits
    else:
        time_part, milliseconds = time_str, 0

    # Split hours/minutes/seconds
    parts = [int(p) for p in time_part.split(':')]

    hours, minutes, seconds = 0, 0, 0

    if len(parts) == 3:
        hours, minutes, seconds = parts
    elif len(parts) == 2:
        minutes, seconds = parts
    elif len(parts) == 1:
        seconds = parts[0]
    else:
        raise ValueError(f"Invalid time format: {time_str}")

    total_seconds = hours * 3600 + minutes * 60 + seconds + milliseconds / 1000
    return total_seconds


def download_song_clip(url, index, start_time, end_time, target_dir):
    #start_second = float(start_time.split(':')[0]) * 60 * 60 + float(start_time.split(':')[1]) * 60 + float(start_time.split(':')[2])
    #end_second = float(end_time.split(':')[0]) * 60 * 60 + float(end_time.split(':')[1]) * 60 + float(end_time.split(':')[2])
    start_second = convert_time_to_seconds(start_time)
    end_second = convert_time_to_seconds(end_time)
    print(f'Input audio file <{url}>')
    print(f'Output dir <{target_dir}>')
    print(f'Start Second: {start_second}')
    print(f'End Second: {end_second}')
    mp3_song_clip = download_mp3(url, index, target_dir, start_second, end_second)
    return mp3_song_clip


def trim_merge(url_list, start_time_list, end_time_list):
    mp3_list = []
    target_dir = 'static\\working_dir'
    for index, url in enumerate(url_list):
        mp3_list.append(download_song_clip(url, index, start_time_list[index], end_time_list[index], target_dir))

    random_code = str(random.randint(123456, 999999))
    merged_file = "merged_file_" + datetime.now().strftime("%Y-%m-%d_%H-%M-%S") + "_" + random_code  + ".mp3"
    merged_file = os.path.join(target_dir, merged_file)
    print(f'merged file name <{merged_file}>')
    audio_clips = [AudioFileClip(c) for c in mp3_list]
    final_audio_clip = concatenate_audioclips(audio_clips)
    final_audio_clip.write_audiofile(merged_file)

    for c in mp3_list:
        os.remove(c)

    print(f'output file <{merged_file}> created')
    return merged_file

def delete_old_merged_files(directory="static/working_dir"):
    now = datetime.now()
    cutoff_time = now - timedelta(hours=1) #one hour before now

    for filename in os.listdir(directory):
        if filename.startswith("merged_file_") and filename.endswith(".mp3"):
            filepath = os.path.join(directory, filename)
            try:
                # Get the file modification time
                file_mtime = datetime.fromtimestamp(os.path.getmtime(filepath))
                
                # Delete if older than 1 hour
                if file_mtime < cutoff_time:
                    os.remove(filepath)
                    print(f"Deleted old file: {filename}")
            except Exception as e:
                print(f"Error deleting {filename}: {e}")

