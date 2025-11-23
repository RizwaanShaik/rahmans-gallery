#!/bin/bash

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2

# Install Certbot for Let's Encrypt
sudo apt install -y certbot python3-certbot-nginx

# Create application directory
sudo mkdir -p /var/www/rahmans-gallery
sudo chown ubuntu:ubuntu /var/www/rahmans-gallery

# Clone the repository
cd /var/www/rahmans-gallery
git clone https://github.com/RizwaanShaik/rahmans-gallery.git .

# Install dependencies
npm install

# Create .env.production file with Supabase credentials
cat > .env.production << 'ENVEOF'
NEXT_PUBLIC_SUPABASE_URL=https://yobsydzqblekahndatnh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvYnN5ZHpxYmxla2FobmRhdG5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MzMyNjksImV4cCI6MjA3OTQwOTI2OX0.CDwkj0r_1zwVE9NVg_iMWgzfimfxScwHsDBvU8ywdgg
ENVEOF

# Build the application (environment variables are bundled at build time for NEXT_PUBLIC_*)
npm run build

# Configure PM2 to start the application with environment variables
# Use ecosystem.config.js which includes Supabase credentials
pm2 start ecosystem.config.js

# Save PM2 process list and configure it to start on boot
pm2 save
pm2 startup

# Configure Nginx
sudo tee /etc/nginx/sites-available/rahmans-gallery << EOF
server {
    listen 80;
    server_name skrahman.art;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the site
sudo ln -s /etc/nginx/sites-available/rahmans-gallery /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Set up Let's Encrypt SSL certificate
sudo certbot --nginx -d skrahman.art --non-interactive --agree-tos --email shaikrizwaan123@gmail.com

# Configure automatic renewal of SSL certificate
echo "0 0 * * * root certbot renew --quiet" | sudo tee -a /etc/cron.d/certbot-renew 