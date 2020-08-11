#!/bin/sh

clone_repo="https://github.com/${GITHUB_REPOSITORY}.git"
git clone "${clone_repo}"
echo "Repository Cloned"
