#!/bin/bash
set -e

echo "🔒 EC2 Security Hardening Script"
echo "=================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
  echo "❌ Please run as root (use sudo)"
  exit 1
fi

echo "📋 Step 1: Updating system packages..."
apt-get update
apt-get upgrade -y

echo ""
echo "🔥 Step 2: Configuring UFW Firewall..."
# Install UFW if not present
apt-get install -y ufw

# Reset UFW to default
ufw --force reset

# Default policies
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (port 22)
ufw allow 22/tcp comment 'SSH'

# Allow HTTP (port 80)
ufw allow 80/tcp comment 'HTTP'

# Allow HTTPS (port 443)
ufw allow 443/tcp comment 'HTTPS'

# Enable UFW
ufw --force enable

echo "✅ Firewall configured"
ufw status verbose

echo ""
echo "🛡️  Step 3: Installing and configuring Fail2ban..."
apt-get install -y fail2ban

# Create Fail2ban configuration
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
destemail = root@localhost
sendername = Fail2Ban
action = %(action_mwl)s

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3
bantime = 7200

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-botsearch]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2
EOF

# Restart Fail2ban
systemctl restart fail2ban
systemctl enable fail2ban

echo "✅ Fail2ban configured"
fail2ban-client status

echo ""
echo "🔐 Step 4: Hardening SSH configuration..."
# Backup original SSH config
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Update SSH configuration
sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config

# Add additional security settings
cat >> /etc/ssh/sshd_config << 'EOF'

# Additional Security Settings
Protocol 2
MaxAuthTries 3
MaxSessions 2
ClientAliveInterval 300
ClientAliveCountMax 2
EOF

# Restart SSH
systemctl restart sshd

echo "✅ SSH hardened"

echo ""
echo "⚙️  Step 5: Setting up process limits..."
# Create limits for www-data user (used by nginx/pm2)
cat > /etc/security/limits.d/www-data.conf << 'EOF'
www-data soft nofile 4096
www-data hard nofile 8192
www-data soft nproc 512
www-data hard nproc 1024
www-data soft cpu 60
www-data hard cpu 120
EOF

# Create limits for ubuntu user
cat > /etc/security/limits.d/ubuntu.conf << 'EOF'
ubuntu soft nofile 4096
ubuntu hard nofile 8192
ubuntu soft nproc 512
ubuntu hard nproc 1024
EOF

echo "✅ Process limits configured"

echo ""
echo "🔍 Step 6: Installing monitoring tools..."
apt-get install -y htop iotop nethogs sysstat

# Enable sysstat
sed -i 's/ENABLED="false"/ENABLED="true"/' /etc/default/sysstat
systemctl restart sysstat

echo "✅ Monitoring tools installed"

echo ""
echo "🧹 Step 7: Cleaning up suspicious processes..."
# Kill any known mining processes
for proc in xmrig minerd cpuminer cryptonight; do
  pkill -9 $proc 2>/dev/null || true
done

# Find and kill high CPU processes (over 80% CPU for more than 5 minutes)
ps aux | awk '$3 > 80.0 {print $2}' | while read pid; do
  if [ ! -z "$pid" ]; then
    echo "⚠️  High CPU process detected: $pid"
    ps -p $pid -o comm=
    # Uncomment to auto-kill: kill -9 $pid
  fi
done

echo "✅ Process cleanup complete"

echo ""
echo "📊 Step 8: Setting up log rotation..."
cat > /etc/logrotate.d/rahmans-gallery << 'EOF'
/var/www/rahmans-gallery/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    notifempty
    create 0640 ubuntu ubuntu
    sharedscripts
}
EOF

echo "✅ Log rotation configured"

echo ""
echo "🔒 Step 9: Hardening kernel parameters..."
cat >> /etc/sysctl.conf << 'EOF'

# Security hardening
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.conf.all.secure_redirects = 0
net.ipv4.conf.default.secure_redirects = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0
net.ipv4.icmp_echo_ignore_broadcasts = 1
net.ipv4.icmp_ignore_bogus_error_responses = 1
net.ipv4.tcp_syncookies = 1
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1
net.ipv4.tcp_timestamps = 0

# Increase system limits
fs.file-max = 65535
net.core.somaxconn = 1024
net.ipv4.tcp_max_syn_backlog = 2048
EOF

# Apply sysctl changes
sysctl -p

echo "✅ Kernel parameters hardened"

echo ""
echo "🔧 Step 10: Updating PM2 configuration with resource limits..."
# This will be done manually by the user
echo "⚠️  Manual step required:"
echo "   Update /var/www/rahmans-gallery/ecosystem.config.js with:"
echo "   max_memory_restart: '512M',"
echo "   max_restarts: 10,"
echo "   min_uptime: '10s',"
echo ""
echo "   Then run: pm2 restart rahmans-gallery"

echo ""
echo "=================================="
echo "✅ Security hardening complete!"
echo "=================================="
echo ""
echo "📋 Summary of changes:"
echo "  ✓ System packages updated"
echo "  ✓ UFW firewall configured (ports 22, 80, 443)"
echo "  ✓ Fail2ban installed and configured"
echo "  ✓ SSH hardened (no root login, key-only auth)"
echo "  ✓ Process limits set"
echo "  ✓ Monitoring tools installed"
echo "  ✓ Suspicious processes cleaned"
echo "  ✓ Log rotation configured"
echo "  ✓ Kernel parameters hardened"
echo ""
echo "🔍 Next steps:"
echo "  1. Check firewall: sudo ufw status"
echo "  2. Check Fail2ban: sudo fail2ban-client status"
echo "  3. Monitor processes: htop"
echo "  4. Check for mining: ps aux | grep -E 'xmrig|minerd|cpuminer'"
echo "  5. Update PM2 config with resource limits"
echo "  6. Restart application: pm2 restart rahmans-gallery"
echo ""
echo "⚠️  IMPORTANT: Test SSH connection in a new terminal before closing this one!"
echo ""
