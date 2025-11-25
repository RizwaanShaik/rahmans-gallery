# Professor Rahman's Photography Gallery

A digital gallery showcasing the photographic work and legacy of Professor Shaik Khaleel-ur-Rahman (1966–2021). This website honors the memory of a master photographer and educator whose work left a lasting impact on students, colleagues, friends, and family.

**Live Website:** [skrahman.art](https://skrahman.art)

## 🎯 Features

### Core Features
- **Responsive Design** - Optimized for all devices (mobile, tablet, desktop)
- **Category-Based Organization** - Hierarchical organization with main categories and subcategories
- **Image Optimization** - Automatic image optimization with Next.js Image component
- **Dark Mode Support** - System-aware dark/light theme toggle
- **SEO Optimized** - Meta tags, sitemap, robots.txt, and semantic HTML
- **Fast Performance** - Static generation, image optimization, and efficient loading

### Gallery Features
- **Infinite Scroll** - Smooth infinite scroll for browsing large collections
- **Fullscreen Modal** - Click any image to view in fullscreen with navigation
- **Masonry Layout** - Beautiful grid layout that adapts to image dimensions
- **Hero Images** - Custom hero images for each category
- **Category Filtering** - Browse by Places, Heritage & History, Nature & Wildlife, Photography Styles
- **Social Sharing** - Share individual images on social media

### Interactive Features
- **Memories/Guestbook** - Visitors can share memories and messages (powered by Supabase)
- **Contact Form** - Contact form with EmailJS integration
- **Timeline** - Interactive timeline showcasing Professor Rahman's journey
- **Featured Collections** - Curated featured collections on homepage

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.2.3** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Backend & Services
- **Supabase** - Database for memories/guestbook feature
- **AWS S3** - Image storage and CDN
- **EmailJS** - Contact form email service
- **PM2** - Process manager for production
- **Nginx** - Reverse proxy and web server

### Image Processing
- **Sharp** - Image optimization library
- **Next.js Image** - Automatic image optimization

## 📁 Project Structure

```
rahmans-gallery/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # API routes
│   │   │   ├── memories/       # Supabase memories API
│   │   │   └── photos/         # S3 photos API
│   │   ├── about/              # About page
│   │   ├── contact/            # Contact page with memories
│   │   ├── gallery/            # Gallery pages
│   │   │   ├── [category]/     # Dynamic category pages
│   │   │   ├── places/         # Places subcategory
│   │   │   ├── heritage-history/
│   │   │   ├── nature-wildlife/
│   │   │   └── photography-styles/
│   │   └── page.tsx            # Homepage
│   ├── components/             # React components
│   │   ├── Navigation.tsx
│   │   ├── PhotoCard.tsx
│   │   ├── FullscreenModal.tsx
│   │   ├── Guestbook.tsx
│   │   ├── Timeline.tsx
│   │   └── ...
│   ├── lib/
│   │   └── supabase.ts         # Supabase client
│   └── utils/
│       └── imageUtils.ts       # Image utility functions
├── scripts/                    # Utility scripts
│   ├── generate-hero-image.js # Generate optimized hero images
│   ├── sync-to-s3.sh          # Sync images to S3
│   ├── fix-supabase-connection.sh
│   └── ...
├── nginx/                      # Nginx configuration
│   └── skrahman.art.conf
├── ecosystem.config.js         # PM2 configuration
├── deploy.sh                   # Deployment script
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or later
- **npm** or **yarn**
- **AWS Account** (for S3 image storage)
- **Supabase Account** (for memories/guestbook feature)
- **EmailJS Account** (for contact form)

### Local Development Setup

1. **Clone the repository:**
```bash
git clone https://github.com/RizwaanShaik/rahmans-gallery.git
cd rahmans-gallery
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Create a `.env.local` file in the root directory:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AWS S3 Configuration (for scripts)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_DEFAULT_REGION=ap-south-1

# EmailJS Configuration (optional)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

4. **Start the development server:**
```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000)** to view the website.

### Environment Variables

#### Required for Production
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

#### Required for Image Management Scripts
- `AWS_ACCESS_KEY_ID` - AWS access key for S3
- `AWS_SECRET_ACCESS_KEY` - AWS secret key for S3
- `AWS_DEFAULT_REGION` - AWS region (default: `ap-south-1`)

#### Optional
- `NEXT_PUBLIC_EMAILJS_*` - EmailJS configuration for contact form

**Note:** `NEXT_PUBLIC_*` variables are bundled at build time in Next.js. Changes require rebuilding the application.

## 📸 Image Management

### S3 Bucket Structure

Images are stored in AWS S3 with the following structure:
```
s3://rahmansgallerybucket/
├── [Category]/
│   ├── hero/
│   │   └── [Category]_[Number]_hero.jpeg
│   ├── thumbnails/
│   │   └── [Category]_[Number].jpeg
│   ├── fullscreen/
│   │   └── [Category]_[Number].jpeg
│   └── [Category]_[Number].jpg (original)
```

### Adding New Images

1. **Generate optimized hero image:**
```bash
node scripts/generate-hero-image.js [Category] [ImageName].jpg
# Example: node scripts/generate-hero-image.js Warangal Warangal_009.jpg
```

2. **Upload to S3:**
```bash
# Upload hero image
aws s3 cp [Category]/hero/[Category]_[Number]_hero.jpeg \
  s3://rahmansgallerybucket/[Category]/hero/ --region ap-south-1

# Upload thumbnails and fullscreen images
# (Use sync-to-s3.sh script for batch uploads)
```

3. **Update code references:**
- Update `src/app/gallery/[category]/page.tsx` for category hero images
- Update `src/app/gallery/page.tsx` for main gallery hero images
- Update category-specific pages if needed

### Available Scripts

- `scripts/generate-hero-image.js` - Generate optimized hero images
- `scripts/sync-to-s3.sh` - Sync images to S3 bucket
- `scripts/fix-supabase-connection.sh` - Fix Supabase connection issues on EC2
- `scripts/verify-s3-hampi.js` - Verify S3 image structure

## 🌐 Deployment

### EC2 Deployment (Production)

The website is deployed on AWS EC2 with PM2 and Nginx.

#### Quick Deployment

1. **SSH into EC2:**
```bash
ssh ubuntu@your-ec2-ip
```

2. **Navigate to project directory:**
```bash
cd /var/www/rahmans-gallery
```

3. **Pull latest changes:**
```bash
git pull origin main
```

4. **Run deployment script:**
```bash
bash deploy.sh
```

#### Manual Deployment Steps

1. **Install dependencies:**
```bash
npm install
```

2. **Set environment variables:**
   - Update `ecosystem.config.js` with Supabase credentials
   - Or create `.env.production` file

3. **Build the application:**
```bash
npm run build
```

4. **Restart PM2:**
```bash
pm2 restart rahmans-gallery
# or
pm2 start ecosystem.config.js
```

5. **Check status:**
```bash
pm2 status
pm2 logs rahmans-gallery
```

#### Nginx Configuration

Nginx serves as a reverse proxy. Configuration file: `nginx/skrahman.art.conf`

Key features:
- SSL/TLS termination
- Reverse proxy to Next.js (port 3000)
- Static file serving
- Gzip compression

#### PM2 Configuration

Process management via `ecosystem.config.js`:
- Auto-restart on failure
- Log management
- Memory limit: 1GB
- Environment variables

### Troubleshooting Deployment

#### Supabase Connection Issues

If Supabase is not working after deployment:

1. **Run the fix script:**
```bash
bash scripts/fix-supabase-connection.sh
```

This script will:
- Verify environment variables
- Test Supabase connectivity
- Create/update `.env.production`
- Rebuild the application
- Restart PM2

2. **Check logs:**
```bash
pm2 logs rahmans-gallery --lines 50
```

Look for `[Supabase Init]` messages to verify connection.

#### Memory Issues

For t2.micro instances, add swap space:
```bash
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## 📊 Performance & Monitoring

### Current Performance Metrics

- **Peak Concurrent Users:** ~5 real users per second
- **Peak Hour Unique Visitors:** 44 IPs
- **Total Unique Visitors:** 207 real user IPs
- **Server Capacity:** t2.micro instance handles current load efficiently

### Monitoring

- **PM2 Monitoring:** `pm2 monit`
- **Nginx Logs:** `/var/log/nginx/access.log`
- **Application Logs:** `pm2 logs rahmans-gallery`

## 🔧 API Endpoints

### Memories API
- **POST** `/api/memories` - Submit a memory/guestbook entry
  - Body: `{ name, email, message, relation }`
  - Stores in Supabase `memories` table

### Photos API
- **GET** `/api/photos/[category]` - Get photos for a category
  - Returns list of images from S3 bucket
  - Supports pagination and filtering

## 📚 Documentation

Additional documentation files:
- `EC2_DEPLOYMENT_GUIDE.md` - Detailed EC2 deployment guide
- `EC2_ENV_SETUP.md` - Environment setup for EC2
- `SUPABASE_FETCH_FAILED_FIX.md` - Troubleshooting Supabase issues
- `SUPABASE_RESTORE_GUIDE.md` - Supabase backup/restore guide
- `PRE_LAUNCH_CHECKLIST.md` - Pre-launch checklist
- `MOBILE_IMPROVEMENTS.md` - Mobile optimization notes

## 🐛 Troubleshooting

### Common Issues

#### Images Not Loading
- Verify S3 bucket permissions and CORS configuration
- Check S3 bucket URL in code matches actual bucket name
- Verify image paths match S3 structure

#### Supabase Connection Failed
- Run `scripts/fix-supabase-connection.sh`
- Verify environment variables are set correctly
- Rebuild application after changing `NEXT_PUBLIC_*` variables

#### Build Errors
- Clear `.next` directory: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

#### PM2 Not Starting
- Check logs: `pm2 logs`
- Verify ecosystem.config.js syntax
- Check port 3000 is available: `lsof -i :3000`

## 🤝 Contributing

This is a personal tribute project. For suggestions or issues, please open an issue on GitHub.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built in memory of Professor Shaik Khaleel-ur-Rahman (1966–2021)
- Photography collections from Professor Rahman's archives
- Built with Next.js, React, and modern web technologies

---

**Last Updated:** November 2025
**Website:** [skrahman.art](https://skrahman.art)
