#!/bin/bash
set -e

version=$1

tag="korylprince/youtube-check-ui"

docker build --no-cache --build-arg "VERSION=$version" --build-arg "CLIENT_ID=$CLIENT_ID" --tag "$tag:$version" .

docker push "$tag:$version"

if [ "$2" = "latest" ]; then
    docker tag "$tag:$version" "$tag:latest"
    docker push "$tag:latest"
fi
