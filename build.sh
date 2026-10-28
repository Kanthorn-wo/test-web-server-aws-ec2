#!/bin/sh
# Rebuild the image and restart the container.
# Usage: ./build.sh            (host port 8080)
#        HOST_PORT=80 ./build.sh   (override host port, e.g. on EC2)

IMAGE_NAME="vite-react"
CONTAINER_NAME="vite-react-ts"
HOST_PORT="${HOST_PORT:-8080}"

# Stop on first error
set -e

# Remove the old container if it exists (ignore error when it does not)
docker rm -f "$CONTAINER_NAME" 2>/dev/null || true

docker build -t "$IMAGE_NAME" .

docker run -d --name "$CONTAINER_NAME" -p "$HOST_PORT":80 "$IMAGE_NAME"

echo "Running at http://localhost:$HOST_PORT"
