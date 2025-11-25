# EC2 Deployment Guide

This guide walks you through deploying the gallery website to your EC2 instance.

## Prerequisites

- EC2 instance running Ubuntu
- SSH access to your EC2 instance
- Domain name pointing to EC2 IP (skrahman.art)
- Git repository access

## Option 1: Fresh Deployment (First Time)

If this is your first time deploying or you want a clean setup:

### Step 1: SSH into EC2

```bash
ssh ubuntu@your-ec2-ip
# or
ssh ubuntu@skrahman.art
```

### Step 2: Run the Deployment Script

On your **local machine**, copy the deploy script to EC2:

```bash
# From your local machine
scp deploy.sh ubuntu@your-ec2-ip:/tmp/
scp ecosystem.config.js ubuntu@your-ec2-ip:/tmp/
```

Then on EC2:

```bash
# Move to home directory
cd ~

# Copy scripts to project location
sudo mkdir -p /var/www/rahmans-gallery
sudo chown ubuntu:ubuntu /var/www/rahmans-gallery
cp /tmp/deploy.sh /var/www/rahmans-gallery/
cp /tmp/ecosystem.config.js /var/www/rahmans-gallery/

# Run deployment script
cd /var/www/rahmans-gallery
bash deploy.sh
```

The script will:
- Install Node.js, Nginx, PM2
- Clone your repository
- Install dependencies
- Build the application
- Configure PM2 with Supabase credentials
- Set up Nginx reverse proxy
- Configure SSL certificate

---

## Option 2: Update Existing Deployment

If you already have the app running and just want to update it:

### Step 1: SSH into EC2

```bash
ssh ubuntu@your-ec2-ip
```

### Step 2: Navigate to Project Directory

```bash
cd /var/www/rahmans-gallery
```

### Step 3: Pull Latest Changes

```bash
git pull origin main
# or
git pull origin infinite-scroll  # if that's your branch
```

### Step 4: Update PM2 Configuration (if needed)

If `ecosystem.config.js` changed, update it:

```bash
# Copy the new ecosystem.config.js from your local machine
# Or manually edit it:
nano ecosystem.config.js
```

Make sure it has:
```javascript
env: {
  NODE_ENV: 'production',
  NEXT_PUBLIC_SUPABASE_URL: 'https://yobsydzqblekahndatnh.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
}
```

### Step 5: Install Dependencies (if package.json changed)

```bash
npm install
```

### Step 6: Rebuild Application

```bash
npm run build
```

### Step 7: Restart PM2

```bash
# Stop current process
pm2 delete rahmans-gallery

# Start with new config
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
```

### Step 8: Check Status

```bash
# Check if app is running
pm2 status

# Check logs
pm2 logs rahmans-gallery --lines 50

# Check if website is accessible
curl http://localhost:3000
```

---

## Quick Update Script

Create this script on EC2 for quick updates:

```bash
# Create update script
cat > /var/www/rahmans-gallery/update.sh << 'EOF'
#!/bin/bash
set -e

cd /var/www/rahmans-gallery

echo "🔄 Pulling latest changes..."
git pull

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building application..."
npm run build

echo "🔄 Restarting PM2..."
pm2 restart rahmans-gallery

echo "✅ Update complete!"
pm2 status
EOF

chmod +x /var/www/rahmans-gallery/update.sh
```

Then just run:
```bash
bash /var/www/rahmans-gallery/update.sh
```

---

## Troubleshooting

### App Not Starting

```bash
# Check PM2 logs
pm2 logs rahmans-gallery --lines 100

# Check if port 3000 is in use
sudo netstat -tlnp | grep 3000

# Restart PM2
pm2 restart rahmans-gallery
```

### Supabase Not Working

```bash
# Check environment variables
pm2 env rahmans-gallery

# Verify Supabase credentials in ecosystem.config.js
cat ecosystem.config.js | grep SUPABASE

# Restart PM2 to reload env vars
pm2 restart rahmans-gallery
```

### Nginx Issues

```bash
# Test Nginx configuration
sudo nginx -t

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew --dry-run
```

---

## Important Notes

1. **Supabase Credentials**: Now hardcoded in `src/lib/supabase.ts` as fallback, but PM2 `ecosystem.config.js` still works if you prefer env vars.

2. **Build Time**: The `npm run build` step bundles `NEXT_PUBLIC_*` variables at build time, so you need to rebuild after changing them.

3. **PM2**: Always use `pm2 start ecosystem.config.js` (not `pm2 start npm -- start`) to ensure environment variables are loaded.

4. **Git Branch**: Make sure you're pulling from the correct branch (main, infinite-scroll, etc.)

5. **Port**: The app runs on port 3000, Nginx proxies to it.

---

## Verification Checklist

After deployment, verify:

- [ ] `pm2 status` shows app running
- [ ] `curl http://localhost:3000` returns HTML
- [ ] Website loads at https://skrahman.art
- [ ] Contact form submits successfully (check Supabase dashboard)
- [ ] Images load correctly from S3
- [ ] SSL certificate is valid (green lock in browser)

---

## Quick Commands Reference

```bash
# PM2
pm2 status                    # Check status
pm2 logs rahmans-gallery      # View logs
pm2 restart rahmans-gallery   # Restart app
pm2 stop rahmans-gallery      # Stop app
pm2 delete rahmans-gallery    # Remove from PM2

# Git
git pull                      # Pull latest changes
git status                   # Check changes
git log --oneline -5         # View recent commits

# Build
npm run build                # Build production
npm run dev                  # Development (don't use on EC2)

# Nginx
sudo nginx -t                # Test config
sudo systemctl restart nginx # Restart Nginx
sudo tail -f /var/log/nginx/error.log  # View errors
```


