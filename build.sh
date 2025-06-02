#!/usr/bin/env bash

if [ "$1" != "chrome" -a "$1" != "firefox" ]; then
  echo "browser argument required: (chrome | firefox)"
  exit 1
fi

browser="$1"
git_version=$(git rev-list HEAD --count 2>&1)
output_filename="microformats-reader-$browser-$git_version.zip"
echo "Building version $git_version for $browser..."

npm run "build-$browser"
cd "./dist/$browser-production" && zip -r "../$output_filename" ./* && cd ../..

echo "Output: ./dist/$output_filename"
