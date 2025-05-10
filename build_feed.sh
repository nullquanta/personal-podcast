#!/bin/bash

set -e

WAV_DIR="./wav"
MP3_DIR="./episodes"
SCRIPT="./generatePodcastFeed.js"

mkdir -p "$MP3_DIR"

echo "Converting .wav files from $WAV_DIR to .mp3 in $MP3_DIR..."

for wav_path in "$WAV_DIR"/*.wav; do
  [ -e "$wav_path" ] || continue

  base_original=$(basename "$wav_path" .wav)
  base_cleaned=$(echo "$base_original" | tr ' ' '_')
  mp3_path="$MP3_DIR/$base_cleaned.mp3"

  echo "Converting '$base_original.wav' → '$base_cleaned.mp3'"
  ffmpeg -i "$wav_path" -codec:a libmp3lame -qscale:a 2 "$mp3_path" -y
done

echo "Running Node.js script to generate RSS feed..."
node "$SCRIPT"

echo "Done."