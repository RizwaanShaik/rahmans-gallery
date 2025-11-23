#!/bin/bash
# Script to fix Supabase connection issues on EC2
# This script verifies environment variables, rebuilds the app, and restarts PM2

set -e

cd /var/www/rahmans-gallery

echo "🔍 Checking Supabase Configuration..."
echo ""

# Check if environment variables are set
echo "1. Checking environment variables in ecosystem.config.js..."
if grep -q "NEXT_PUBLIC_SUPABASE_URL" ecosystem.config.js; then
    # Extract value between single quotes (field 2 after splitting by ')
    SUPABASE_URL=$(grep "NEXT_PUBLIC_SUPABASE_URL" ecosystem.config.js | sed "s/.*'\([^']*\)'.*/\1/" | head -1)
    if [ -z "$SUPABASE_URL" ]; then
        # Try alternative extraction method
        SUPABASE_URL=$(grep "NEXT_PUBLIC_SUPABASE_URL" ecosystem.config.js | grep -oP "(?<=')[^']*(?=')" | head -1)
    fi
    if [ -n "$SUPABASE_URL" ]; then
        echo "   ✓ Found SUPABASE_URL: $SUPABASE_URL"
    else
        echo "   ✗ Could not extract SUPABASE_URL from ecosystem.config.js"
        echo "   Line found: $(grep 'NEXT_PUBLIC_SUPABASE_URL' ecosystem.config.js)"
        exit 1
    fi
else
    echo "   ✗ SUPABASE_URL not found in ecosystem.config.js"
    exit 1
fi

if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" ecosystem.config.js; then
    # Extract value between single quotes (field 2 after splitting by ')
    ANON_KEY=$(grep "NEXT_PUBLIC_SUPABASE_ANON_KEY" ecosystem.config.js | sed "s/.*'\([^']*\)'.*/\1/" | head -1)
    if [ -z "$ANON_KEY" ]; then
        # Try alternative extraction method
        ANON_KEY=$(grep "NEXT_PUBLIC_SUPABASE_ANON_KEY" ecosystem.config.js | grep -oP "(?<=')[^']*(?=')" | head -1)
    fi
    if [ -n "$ANON_KEY" ]; then
        if [ ${#ANON_KEY} -gt 50 ]; then
            echo "   ✓ Found SUPABASE_ANON_KEY (length: ${#ANON_KEY} chars)"
        else
            echo "   ⚠️  ANON_KEY seems too short (${#ANON_KEY} chars). Should be ~200+ chars"
        fi
    else
        echo "   ✗ Could not extract SUPABASE_ANON_KEY from ecosystem.config.js"
        echo "   Line found: $(grep 'NEXT_PUBLIC_SUPABASE_ANON_KEY' ecosystem.config.js)"
        exit 1
    fi
else
    echo "   ✗ SUPABASE_ANON_KEY not found in ecosystem.config.js"
    exit 1
fi

echo ""
echo "2. Testing Supabase URL connectivity..."
if curl -s --max-time 5 "$SUPABASE_URL/rest/v1/" > /dev/null 2>&1; then
    echo "   ✓ Supabase URL is reachable"
else
    echo "   ✗ Cannot reach Supabase URL: $SUPABASE_URL"
    echo "   This might indicate:"
    echo "   - The Supabase project is paused"
    echo "   - Network/firewall issues"
    echo "   - Incorrect URL"
    echo ""
    echo "   Please verify the URL in Supabase Dashboard: https://app.supabase.com"
    exit 1
fi

echo ""
echo "3. Checking .env.production file..."
if [ -f .env.production ]; then
    echo "   ✓ .env.production exists"
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.production; then
        echo "   ✓ Contains SUPABASE_URL"
    else
        echo "   ⚠️  Missing SUPABASE_URL in .env.production"
    fi
else
    echo "   ⚠️  .env.production not found (creating it...)"
    cat > .env.production << EOF
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY
EOF
    echo "   ✓ Created .env.production"
fi

echo ""
echo "4. Rebuilding Next.js application..."
echo "   (This is required because NEXT_PUBLIC_* vars are bundled at build time)"
npm run build

echo ""
echo "5. Restarting PM2 with updated configuration..."
pm2 delete rahmans-gallery 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

echo ""
echo "6. Waiting for app to start..."
sleep 3

echo ""
echo "7. Checking PM2 status..."
pm2 status

echo ""
echo "8. Checking recent logs for Supabase initialization..."
pm2 logs rahmans-gallery --lines 20 --nostream | grep -i "supabase" || echo "   (No Supabase logs found - this might be normal)"

echo ""
echo "✅ Fix complete!"
echo ""
echo "📋 Next steps:"
echo "1. Check logs: pm2 logs rahmans-gallery --lines 50"
echo "2. Look for: [Supabase Init] URL: https://..."
echo "3. Test the contact form: https://skrahman.art/contact"
echo "4. If still failing, verify Supabase project is active: https://app.supabase.com"
echo ""

