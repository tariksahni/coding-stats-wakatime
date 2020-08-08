#!/bin/sh

# `$*` expands the `args` supplied in an `array` individually
# or splits `args` in a string separated by whitespace.
sh -c "echo $*"

sh -c "echo $INPUT_WAKATIME_API_KEY"
sh -c "echo $GITHUB_REPOSITORY"
sh -c "echo Hello Bro"

clone_repo="https://github.com/${GITHUB_REPOSITORY}.git"
git clone "${clone_repo}"
echo "Repository Cloned"
