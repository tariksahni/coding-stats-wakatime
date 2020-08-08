#!/bin/sh -l

sh -c "echo $INPUT_WAKATIME_API_KEY"
sh -c "echo $GITHUB_REPOSITORY"
sh -c "echo Hello Bro"
sh -c "echo $*"

clone_repo="https://github.com/${GITHUB_REPOSITORY}.git"
git clone "${clone_repo}"
echo "Repository Cloned"
