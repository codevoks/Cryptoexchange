#!/bin/bash

# Diagnostic script to check WebSocket connection issues

echo "🔍 WebSocket Connection Diagnostic Tool"
echo "=========================================="
echo ""

# Get EC2 host from GitHub vars (you'll need to replace this)
EC2_HOST="${1:-your-ec2-host}"

echo "1. Checking if WebSocket server is accessible..."
if curl -s --max-time 5 "http://${EC2_HOST}:8080" > /dev/null 2>&1; then
    echo "   ✅ Port 8080 is accessible"
else
    echo "   ❌ Port 8080 is NOT accessible"
    echo "   → Check EC2 Security Group: Port 8080 should be open (0.0.0.0/0 or your IP)"
fi

echo ""
echo "2. Testing WebSocket connection..."
echo "   Try opening browser console and check for:"
echo "   - '🔌 Connecting to WebSocket: ws://${EC2_HOST}:8080?symbols=...'"
echo "   - '✅ WebSocket connected for symbol: ...'"
echo "   - Any error messages starting with '❌'"

echo ""
echo "3. To check if NEXT_PUBLIC_WS_URL is in the bundle:"
echo "   Open browser DevTools → Sources → Look for the built JS file"
echo "   Search for 'ws://' or 'wss://' - you should see your EC2 host"

echo ""
echo "4. To manually rebuild on EC2 (if needed):"
echo "   ssh into EC2 and run:"
echo "   cd ~/application"
echo "   docker compose -f docker-compose.prod.yml pull"
echo "   docker compose -f docker-compose.prod.yml down"
echo "   docker compose -f docker-compose.prod.yml up -d"

echo ""
echo "5. Check container logs:"
echo "   docker logs crypto-ws"
echo "   docker logs crypto-web"

