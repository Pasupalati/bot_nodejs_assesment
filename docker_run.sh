#!/bin/sh

echo "===== Grabbing latest code ====="
git checkout main
git pull origin main

echo "===== stop current container ====="
docker stop bot_nodejs_assessment || true && docker rm bot_nodejs_assessment || true

echo "\n\n === Sleeping for 5 sec(s) ==="
sleep 5

echo "===== Build Docker Image ====="
docker build -t bot_nodejs_assessment:latest .

echo "\n\n ===== Run docker container for bot_nodejs_assessment ==== "
docker run --cpus="1" -m="1g" --net=host -e PORT=3434 -d --name bot_nodejs_assessment bot_nodejs_assessment

echo "\n\n === Sleeping for 5 sec(s) ==="
sleep 5

echo "\n == Current docker instances ==="
docker ps -a

echo "\n\n === Sleeping for 5 sec(s) ==="
sleep 5

echo "\n == Log file ==="
docker logs --tail 3000 bot_nodejs_assessment
