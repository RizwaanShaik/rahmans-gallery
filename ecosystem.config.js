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
      // Supabase Configuration
      NEXT_PUBLIC_SUPABASE_URL: 'https://yobsydzqblekahndatnh.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvYnN5ZHpxYmxla2FobmRhdG5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MzMyNjksImV4cCI6MjA3OTQwOTI2OX0.CDwkj0r_1zwVE9NVg_iMWgzfimfxScwHsDBvU8ywdgg',
      // EmailJS Configuration
      NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: 'KGyg8MIyzMnx7qIiY',
      NEXT_PUBLIC_EMAILJS_SERVICE_ID: 'service_k027bvr',
      NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: 'template_mlnh9pb',
    },
    error_file: '/var/www/rahmans-gallery/logs/pm2-error.log',
    out_file: '/var/www/rahmans-gallery/logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000,
    kill_timeout: 5000,
    listen_timeout: 3000,
  }]
};

