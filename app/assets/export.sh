#!/usr/bin/env bash

: '
Simple utility to rasterize our source icon.svg file into required sizes of PNG.
An optional prefix may be added to the output filename by invoking this script
with a string argument.
'

filename_prefix=""
if [[ $# -eq 1 ]]; then
  filename_prefix="$1-"
fi

output_path="../static/icon/"

for pixelSize in 16 32 48 128
do
  inkscape --export-area-page \
    --export-width $pixelSize \
    --export-height $pixelSize \
    --export-filename="${output_path}${filename_prefix}${pixelSize}.png" \
    "icon.svg"
done
