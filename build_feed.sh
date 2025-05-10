#!/bin/bash

set -e

WAV_DIR="./wav"
MP3_DIR="./episodes"
SCRIPT="./generatePodcastFeed.js"

mkdir -p "$MP3_DIR"

echo "Converting .wav files from $WAV_DIR to .mp3 in $MP3_DIR..."

for wav_file in "$WAV_DIR"/*.wav; do
  [ -e "$wav_file" ] || continue
  base_name=$(basename "$wav_file" .wav)
  mp3_file="$MP3_DIR/$base_name.mp3"

  echo "Converting $wav_file → $mp3_file"
  ffmpeg -i "$wav_file" -codec:a libmp3lame -qscale:a 2 "$mp3_file" -y
done

echo "Running Node.js script to generate RSS feed..."
node "$SCRIPT"

echo "Done."
