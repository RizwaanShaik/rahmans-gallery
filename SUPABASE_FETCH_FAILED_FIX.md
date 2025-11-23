# Fixing "TypeError: fetch failed" Supabase Connection Issue

## Problem
You're seeing this error in PM2 logs:
```
TypeError: fetch failed
at node:internal/deps/undici/undici:13502:13
```

This indicates that the Next.js app cannot connect to Supabase.

## Root Causes

### 1. **Next.js Build-Time Bundling** (Most Common)
`NEXT_PUBLIC_*` environment variables are **bundled at build time**, not runtime. If you:
- Set environment variables after building
- Change environment variables without rebuilding
- Export variables but don't rebuild

The app will still use the old values (or no values) from when it was built.

### 2. **Supabase Project Paused**
If your Supabase project is paused, the URL will be unreachable.

### 3. **Incorrect Environment Variables**
- Wrong Supabase URL
- Wrong anon key format (should start with `eyJ...`)

## Solution

### Step 1: Run the Fix Script (Recommended)

On your EC2 server, run:
```bash
cd /var/www/rahmans-gallery
bash scripts/fix-supabase-connection.sh
```

This script will:
- Verify environment variables
- Test Supabase connectivity
- Rebuild the Next.js app
- Restart PM2

### Step 2: Manual Fix (If Script Doesn't Work)

#### 2.1 Verify Environment Variables

Check `ecosystem.config.js`:
```bash
cat ecosystem.config.js | grep SUPABASE
```

Should show:
```javascript
NEXT_PUBLIC_SUPABASE_URL: 'https://yobsydzqblekahndatnh.supabase.co',
NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
```

#### 2.2 Verify Supabase Project is Active

1. Go to https://app.supabase.com
2. Check if your project shows as "Active" (not "Paused")
3. If paused, you need to restore it or create a new project

#### 2.3 Test Supabase URL Connectivity

From your EC2 server:
```bash
curl -I https://yobsydzqblekahndatnh.supabase.co/rest/v1/
```

Should return HTTP 200 or 401 (not connection refused).

#### 2.4 Rebuild the Application

**CRITICAL**: You MUST rebuild after changing `NEXT_PUBLIC_*` variables:

```bash
cd /var/www/rahmans-gallery
npm run build
```

#### 2.5 Restart PM2

```bash
pm2 delete rahmans-gallery
pm2 start ecosystem.config.js
pm2 save
```

#### 2.6 Verify It's Working

Check logs:
```bash
pm2 logs rahmans-gallery --lines 30
```

Look for:
```
[Supabase Init] URL: https://yobsydzqblekahndatnh.supabase.co
[Supabase Init] Anon Key: Present (XXX chars)
[Supabase Init] ✓ Supabase client created successfully
```

### Step 3: Verify Anon Key Format

The anon key should:
- Start with `eyJ...` (it's a JWT token)
- Be ~200+ characters long
- Come from Supabase Dashboard → Settings → API → "anon" or "public" key

**NOT**:
- `sb_publishable_...` (this is wrong)
- `NwILBXKVRdv3A85K3vdz6Cj4NZEOPqi0bn7GxbNKb0zSgD+VWUE+RjPIXg2PuTqbEYkAQN7+xcAtqsEfPDEUcw==` (this looks like a different type of key)

### Step 4: Test the Contact Form

1. Go to https://skrahman.art/contact
2. Submit a test message
3. Check PM2 logs for errors
4. Check Supabase Table Editor to see if the record was inserted

## Common Issues

### Issue: "Still getting fetch failed after rebuild"

**Solutions**:
1. Verify Supabase project is active (not paused)
2. Check firewall/security groups allow outbound HTTPS
3. Verify the Supabase URL is correct
4. Check if you're using the correct anon key (not service_role key)

### Issue: "Environment variables not loading"

**Solutions**:
1. Make sure you're using `pm2 start ecosystem.config.js` (not `pm2 start npm -- start`)
2. Verify variables are in `ecosystem.config.js` `env` section
3. Rebuild after changing variables
4. Check PM2 env: `pm2 env rahmans-gallery`

### Issue: "Supabase project is paused"

**Solutions**:
1. Go to Supabase Dashboard
2. Restore the paused project (if you have backups)
3. Or create a new project and update credentials
4. See `SUPABASE_RESTORE_GUIDE.md` for details

## Quick Checklist

- [ ] Environment variables set in `ecosystem.config.js`
- [ ] Supabase project is active (not paused)
- [ ] Anon key starts with `eyJ...` and is ~200+ chars
- [ ] Supabase URL is correct and reachable
- [ ] Application rebuilt after setting variables (`npm run build`)
- [ ] PM2 restarted with `ecosystem.config.js`
- [ ] Logs show Supabase initialization success
- [ ] Contact form test submission works

## Still Having Issues?

1. Check PM2 logs: `pm2 logs rahmans-gallery --lines 100`
2. Look for `[Supabase Init]` messages
3. Check Supabase Dashboard → Logs for API errors
4. Verify network connectivity: `curl -I https://yobsydzqblekahndatnh.supabase.co/rest/v1/`

