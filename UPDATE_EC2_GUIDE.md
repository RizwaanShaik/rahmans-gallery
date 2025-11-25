# EC2 Update Guide - Clean Branch

This guide walks you through updating your EC2 deployment to the latest `clean` branch with EmailJS environment variables.

## 🚀 Quick Update (Recommended)

### Option 1: Using the Update Script (Easiest)

**On your local machine:**

1. **Commit and push your changes** (if not already done):
```bash
git add .
git commit -m "Update EmailJS to use environment variables"
git push origin clean
```

2. **Copy the update script to EC2:**
```bash
scp update-ec2.sh ubuntu@skrahman.art:/tmp/
scp ecosystem.config.js ubuntu@skrahman.art:/tmp/
```

**On your EC2 instance (SSH in):**

```bash
ssh ubuntu@skrahman.art

# Copy files to project directory
cp /tmp/update-ec2.sh /var/www/rahmans-gallery/
cp /tmp/ecosystem.config.js /var/www/rahmans-gallery/

# Run the update script
cd /var/www/rahmans-gallery
bash update-ec2.sh
```

That's it! The script will:
- Pull latest code from `clean` branch
- Install dependencies
- Rebuild the application
- Restart PM2 with new EmailJS env vars

---

### Option 2: Manual Update

**On your EC2 instance:**

```bash
# SSH into EC2
ssh ubuntu@skrahman.art

# Navigate to project directory
cd /var/www/rahmans-gallery

# Pull latest changes from clean branch
git fetch origin
git checkout clean
git pull origin clean

# Install dependencies
npm install

# Update ecosystem.config.js manually (or copy from local)
nano ecosystem.config.js
# Add these lines inside env: { ... }
#   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: 'KGyg8MIyzMnx7qIiY',
#   NEXT_PUBLIC_EMAILJS_SERVICE_ID: 'service_k027bvr',
#   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: 'template_mlnh9pb',

# Rebuild application (IMPORTANT: Next.js bundles NEXT_PUBLIC_* at build time)
npm run build

# Restart PM2
pm2 delete rahmans-gallery
pm2 start ecosystem.config.js
pm2 save

# Check status
pm2 status
pm2 logs rahmans-gallery --lines 20
```

---

## 📋 What Changed?

### Environment Variables Added

The following EmailJS environment variables are now required:

```javascript
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: 'KGyg8MIyzMnx7qIiY'
NEXT_PUBLIC_EMAILJS_SERVICE_ID: 'service_k027bvr'
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: 'template_mlnh9pb'
```

These are added to `ecosystem.config.js` in the `env` section.

### Code Changes

- Removed hardcoded EmailJS keys from `src/app/contact/page.tsx`
- Now uses environment variables instead
- More secure and easier to manage

---

## ✅ Verification Checklist

After updating, verify everything works:

1. **Check PM2 Status:**
   ```bash
   pm2 status
   ```
   Should show `rahmans-gallery` as `online`

2. **Check Logs:**
   ```bash
   pm2 logs rahmans-gallery --lines 50
   ```
   Look for any errors related to EmailJS or Supabase

3. **Test Local Server:**
   ```bash
   curl http://localhost:3000
   ```
   Should return HTML

4. **Test Website:**
   - Visit: https://skrahman.art
   - Check if homepage loads
   - Test contact form submission
   - Verify memories carousel works

5. **Test EmailJS:**
   - Submit a memory (non-anonymous)
   - Check if email is sent successfully
   - Check PM2 logs for EmailJS success messages

---

## 🔧 Troubleshooting

### Issue: PM2 won't start

```bash
# Check PM2 logs
pm2 logs rahmans-gallery --lines 100

# Check if port 3000 is in use
sudo netstat -tlnp | grep 3000

# Try restarting PM2
pm2 restart rahmans-gallery
```

### Issue: EmailJS not working

```bash
# Check environment variables
pm2 env rahmans-gallery | grep EMAILJS

# Verify ecosystem.config.js has EmailJS vars
cat ecosystem.config.js | grep EMAILJS

# Rebuild and restart
npm run build
pm2 restart rahmans-gallery
```

### Issue: Build fails

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

### Issue: Git pull fails

```bash
# Check current branch
git branch

# If on wrong branch, switch
git checkout clean

# If there are local changes, stash them
git stash
git pull origin clean
git stash pop
```

---

## 📝 Important Notes

1. **Build Required**: Since we're using `NEXT_PUBLIC_*` environment variables, you **must** run `npm run build` after updating. Next.js bundles these at build time.

2. **PM2 Restart**: Always restart PM2 after updating `ecosystem.config.js` to load new environment variables.

3. **Branch Name**: Make sure you're pulling from the `clean` branch (not `main` or `infinite-scroll`).

4. **Zero Downtime**: The update script stops PM2, updates, rebuilds, and restarts. There will be a brief downtime (usually 30-60 seconds).

---

## 🎯 Quick Reference Commands

```bash
# PM2 Commands
pm2 status                    # Check status
pm2 logs rahmans-gallery      # View logs
pm2 restart rahmans-gallery   # Restart app
pm2 stop rahmans-gallery      # Stop app
pm2 delete rahmans-gallery    # Remove from PM2

# Git Commands
git pull origin clean         # Pull latest from clean branch
git status                   # Check changes
git log --oneline -5         # View recent commits

# Build Commands
npm run build                # Build production
npm install                 # Install dependencies

# Verification
curl http://localhost:3000   # Test local server
pm2 env rahmans-gallery      # Check environment variables
```

---

## 🆘 Need Help?

If something goes wrong:

1. Check PM2 logs: `pm2 logs rahmans-gallery --lines 100`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify environment variables: `pm2 env rahmans-gallery`
4. Test build locally first before deploying

---

**Last Updated:** December 2025

