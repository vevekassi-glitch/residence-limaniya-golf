#!/bin/bash
cd "$(dirname "$0")"
PORT=3001 nohup node server/index.js > /tmp/limaniya-server.log 2>&1 &
echo $! > /tmp/limaniya-server.pid
sleep 2
echo "Server started with PID $(cat /tmp/limaniya-server.pid)"
cat /tmp/limaniya-server.log
