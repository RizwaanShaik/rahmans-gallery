#!/bin/bash
# Script to set up environment variables on EC2 instance
# Run this on your EC2 instance: bash SETUP_EC2_ENV.sh

cd /var/www/rahmans-gallery

echo "🔧 Setting up environment variables for Supabase..."

# Create .env.production file
cat > .env.production << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://yobsydzqblekahndatnh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=NwILBXKVRdv3A85K3vdz6Cj4NZEOPqi0bn7GxbNKb0zSgD+VWUE+RjPIXg2PuTqbEYkAQN7+xcAtqsEfPDEUcw==
EOF

echo "✅ Created .env.production file"

# Create ecosystem.config.js for PM2
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'rahmans-gallery',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/rahmans-gallery',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      NEXT_PUBLIC_SUPABASE_URL: 'https://yobsydzqblekahndatnh.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'NwILBXKVRdv3A85K3vdz6Cj4NZEOPqi0bn7GxbNKb0zSgD+VWUE+RjPIXg2PuTqbEYkAQN7+xcAtqsEfPDEUcw==',
    },
    error_file: '/var/www/rahmans-gallery/logs/pm2-error.log',
    out_file: '/var/www/rahmans-gallery/logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
  }]
};
EOF

echo "✅ Created ecosystem.config.js file"

# Create logs directory
mkdir -p logs

echo "✅ Created logs directory"

# Rebuild the application (Next.js bundles NEXT_PUBLIC_* vars at build time)
echo "🔨 Rebuilding application with environment variables..."
npm run build

echo "✅ Build complete"

# Restart PM2 with new configuration
echo "🔄 Restarting PM2..."
pm2 delete rahmans-gallery 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

echo "✅ PM2 restarted with new configuration"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To verify:"
echo "1. Check PM2 status: pm2 status"
echo "2. Check logs: pm2 logs rahmans-gallery"
echo "3. Look for: [Supabase Init] URL: https://..."
echo "4. Test the contact form at https://skrahman.art/contact"
echo ""


