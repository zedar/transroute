#!/bin/bash

# ------------------
# BUILD app.profile.js
# ------------------
set -e

UTILDIR=$(cd $(dirname $0) && pwd)
BASEDIR=$(cd "$UTILDIR/../.." && pwd)
SRCDIR="$BASEDIR/vendor/dojo"
TOOLSDIR="$SRCDIR/dojo/util/buildscripts"
PROFILE="$BASEDIR/build/js/app.profile.js"
RELEASEDIR="$BASEDIR/vendor/dojo-release"

if [ ! -d "$TOOLSDIR" ]; then
  echo "Can't find Dojo build tools -- did you initialise submodules? (git submodule update --init --recursive)"
  exit 1
fi

if [ ! -f "$PROFILE" ]; then
  echo "Invalid input profile"
  exit 1
fi

echo "Using $PROFILE."

# clean the old distribution files
echo "============================"
echo "Cleaning $RELEASEDIR folder..."
echo "============================"
rm -rf "$RELEASEDIR"
echo "Done: cleaning $RELEASEDIR folder"

if which node >/dev/null; then
  echo "============================"
  echo "Using node.js to build js..."
  echo "============================"
  $TOOLSDIR/build.sh --profile $PROFILE
elif which java >/dev/null; then
  echo "============================"
  echo "Using java to build js..."
  echo "============================"
  $TOOLSDIR/build.sh --bin java --profile $PROFILE
else
  echo "Need node.js or Java to build!"
  exit 1
fi

echo "============================"
echo "Build complete"
echo "============================"