#!/bin/bash
# Update script for EC2 deployment
# Run this on your EC2 instance: bash update-ec2.sh

set -e  # Exit on error

cd /var/www/rahmans-gallery

echo "🔄 Updating rahmans-gallery application..."
echo ""

# Step 1: Pull latest changes from clean branch
echo "📥 Step 1: Pulling latest changes from 'clean' branch..."
git fetch origin
git checkout clean
git pull origin clean
echo "✅ Code updated"
echo ""

# Step 2: Install/update dependencies
echo "📦 Step 2: Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Step 3: Update ecosystem.config.js (if it changed)
echo "⚙️  Step 3: Checking PM2 configuration..."
if [ -f ecosystem.config.js ]; then
    echo "✅ ecosystem.config.js found"
else
    echo "⚠️  Warning: ecosystem.config.js not found, creating from template..."
fi
echo ""

# Step 4: Rebuild application (required for NEXT_PUBLIC_* env vars)
echo "🔨 Step 4: Building application..."
npm run build
echo "✅ Build complete"
echo ""

# Step 5: Restart PM2 with updated configuration
echo "🔄 Step 5: Restarting PM2 application..."
pm2 delete rahmans-gallery 2>/dev/null || echo "  (No existing process to delete)"
pm2 start ecosystem.config.js
pm2 save
echo "✅ PM2 restarted"
echo ""

# Step 6: Show status
echo "📊 Step 6: Application status:"
pm2 status
echo ""

# Step 7: Show recent logs
echo "📋 Recent logs (last 20 lines):"
pm2 logs rahmans-gallery --lines 20 --nostream
echo ""

echo "✅ Update complete!"
echo ""
echo "🔍 Verification steps:"
echo "1. Check PM2 status: pm2 status"
echo "2. View live logs: pm2 logs rahmans-gallery"
echo "3. Test website: curl http://localhost:3000"
echo "4. Visit: https://skrahman.art"
echo ""

