# Architecture Documentation

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Users                                │
│                    (Browsers/Mobile)                         │
└───────────────────────┬─────────────────────────────────────┘
                         │
                         │ HTTPS (443)
                         │
         ┌───────────────▼───────────────┐
         │         Nginx                  │
         │    (Reverse Proxy)             │
         │  - SSL/TLS Termination         │
         │  - Static File Serving         │
         │  - Gzip Compression            │
         └───────────────┬─────────────────┘
                         │
                         │ HTTP (3000)
                         │
         ┌───────────────▼─────────────────┐
         │      Next.js Application         │
         │    (PM2 Process Manager)         │
         │  - Server-Side Rendering         │
         │  - API Routes                    │
         │  - Static Generation             │
         └───────┬─────────────────┬───────┘
                 │                 │
                 │                 │
    ┌────────────▼──────┐  ┌───────▼──────────────┐
    │   AWS S3          │  │   Supabase          │
    │   (Images)        │  │   (Database)        │
    │                   │  │   - Memories        │
    │                   │  │   - Guestbook      │
    └───────────────────┘  └─────────────────────┘
```

## Component Details

### Frontend (Next.js)

#### App Router Structure
- **Pages:** Server Components by default for better performance
- **API Routes:** Server-side API endpoints
- **Static Generation:** Pre-rendered pages for SEO
- **Dynamic Routes:** Category-based routing with `[category]` parameter

#### Key Components

**Navigation.tsx**
- Responsive navigation bar
- Dark mode toggle
- Mobile hamburger menu
- Active route highlighting

**PhotoCard.tsx**
- Image card component
- Lazy loading support
- Click handler for fullscreen modal
- Optimized image rendering

**FullscreenModal.tsx**
- Fullscreen image viewer
- Keyboard navigation (arrow keys, ESC)
- Touch gestures for mobile
- Image preloading

**Guestbook.tsx**
- Memories display component
- Real-time updates from Supabase
- Pagination support
- Filtering by relation type

**Timeline.tsx**
- Interactive timeline component
- Chronological events display
- Responsive design

### Backend Services

#### Supabase Integration

**Database Schema:**
```sql
CREATE TABLE memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  relation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**API Route:** `/api/memories`
- **POST:** Create new memory entry
- **GET:** Fetch memories (via Supabase client in components)
- Error handling and validation

**Client Configuration:**
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Row Level Security (RLS) enabled
- Anonymous access for reading/writing memories

#### AWS S3 Integration

**Bucket:** `rahmansgallerybucket`
**Region:** `ap-south-1`

**Image Structure:**
- **Hero Images:** Optimized JPEGs (~1920px width)
- **Thumbnails:** Small previews (~400px width)
- **Fullscreen:** High-quality images (~2048px width)
- **Originals:** Original JPG files

**CORS Configuration:**
- Allows GET requests from website domain
- Supports image loading in browsers

**Access Pattern:**
- Public read access for images
- Write access via AWS CLI/SDK with credentials

### Infrastructure

#### EC2 Instance
- **Type:** t2.micro
- **OS:** Ubuntu 22.04 LTS
- **Memory:** 1GB RAM + 1GB Swap
- **Storage:** EBS volume

#### PM2 Process Manager
- **Configuration:** `ecosystem.config.js`
- **Features:**
  - Auto-restart on failure
  - Log management
  - Memory limit: 1GB
  - Environment variable injection

**Commands:**
```bash
pm2 start ecosystem.config.js
pm2 restart rahmans-gallery
pm2 stop rahmans-gallery
pm2 logs rahmans-gallery
pm2 monit
```

#### Nginx Configuration

**Key Features:**
- SSL/TLS termination (Let's Encrypt)
- Reverse proxy to Next.js (port 3000)
- Static file serving
- Gzip compression
- Security headers

**Configuration File:** `nginx/skrahman.art.conf`

**Proxy Settings:**
```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

## Data Flow

### Image Loading Flow

1. **User requests page** → Next.js renders page
2. **Page requests images** → API route queries S3
3. **S3 returns image URLs** → Next.js Image component
4. **Browser requests images** → S3 CDN serves optimized images
5. **Images cached** → Browser cache for subsequent requests

### Memory Submission Flow

1. **User fills form** → Contact page form
2. **Form submission** → POST to `/api/memories`
3. **API validates data** → Server-side validation
4. **Supabase insert** → Creates memory record
5. **Success response** → User sees confirmation
6. **Guestbook updates** → Real-time display via Supabase client

## Performance Optimizations

### Image Optimization
- **Next.js Image Component:** Automatic optimization
- **Sharp Library:** Server-side image processing
- **Multiple Sizes:** Hero, thumbnail, fullscreen variants
- **Lazy Loading:** Images load on scroll
- **CDN Delivery:** S3 CloudFront for fast delivery

### Code Optimization
- **Static Generation:** Pre-rendered pages
- **Code Splitting:** Automatic route-based splitting
- **Tree Shaking:** Unused code elimination
- **Minification:** Production build optimization

### Caching Strategy
- **Browser Cache:** Static assets cached
- **CDN Cache:** S3 CloudFront caching
- **Next.js Cache:** ISR (Incremental Static Regeneration)

## Security Considerations

### Environment Variables
- **Never commit secrets:** `.env` files in `.gitignore`
- **Build-time variables:** `NEXT_PUBLIC_*` bundled at build
- **Runtime variables:** Server-side only variables

### Supabase Security
- **Row Level Security:** Database-level access control
- **Anonymous Key:** Public read/write for memories
- **Input Validation:** Server-side validation

### AWS Security
- **IAM Roles:** Least privilege access
- **S3 Bucket Policy:** Public read, restricted write
- **CORS Configuration:** Domain-specific access

### Nginx Security
- **SSL/TLS:** Encrypted connections
- **Security Headers:** X-Frame-Options, X-Content-Type-Options
- **Rate Limiting:** Protection against abuse

## Deployment Workflow

### Development
1. Local development with `npm run dev`
2. Hot reload for changes
3. Environment variables from `.env.local`

### Production Build
1. `npm run build` - Creates optimized production build
2. Static pages pre-rendered
3. API routes compiled
4. Environment variables bundled

### Deployment
1. Git pull latest changes
2. Install dependencies: `npm install`
3. Build application: `npm run build`
4. Restart PM2: `pm2 restart rahmans-gallery`
5. Verify: Check logs and website

### Rollback Strategy
1. Git checkout previous commit
2. Rebuild: `npm run build`
3. Restart: `pm2 restart rahmans-gallery`

## Monitoring & Logging

### Application Logs
- **PM2 Logs:** `pm2 logs rahmans-gallery`
- **Error Logs:** `/var/www/rahmans-gallery/logs/pm2-error.log`
- **Output Logs:** `/var/www/rahmans-gallery/logs/pm2-out.log`

### Web Server Logs
- **Access Log:** `/var/log/nginx/access.log`
- **Error Log:** `/var/log/nginx/error.log`

### Monitoring Commands
```bash
# PM2 Status
pm2 status
pm2 monit

# System Resources
free -h          # Memory usage
df -h            # Disk usage
top              # CPU/Memory processes

# Nginx Status
sudo systemctl status nginx
sudo nginx -t    # Test configuration
```

## Scalability Considerations

### Current Capacity
- **Concurrent Users:** ~5 real users/second
- **Peak Hour:** 44 unique visitors
- **Server:** t2.micro handles current load efficiently

### Scaling Options

**Vertical Scaling:**
- Upgrade to t2.small or t2.medium
- Increase memory and CPU

**Horizontal Scaling:**
- Multiple EC2 instances
- Load balancer (ALB)
- PM2 cluster mode

**CDN Optimization:**
- CloudFront distribution for S3
- Edge caching for images
- Reduced origin load

**Database Scaling:**
- Supabase auto-scaling
- Connection pooling
- Read replicas if needed

## Backup & Recovery

### Code Backup
- Git repository (GitHub)
- Regular commits
- Tagged releases

### Database Backup
- Supabase automatic backups
- Manual export via Supabase dashboard
- See `SUPABASE_RESTORE_GUIDE.md`

### Image Backup
- S3 versioning enabled
- Cross-region replication (optional)
- Manual backup scripts

## Future Enhancements

### Potential Improvements
- **Search Functionality:** Full-text search for images
- **Image Metadata:** EXIF data display
- **Collections:** User-created collections
- **Comments:** Image-specific comments
- **Analytics:** Visitor analytics dashboard
- **Admin Panel:** Content management interface

### Technical Debt
- Image optimization script improvements
- Automated deployment pipeline
- CI/CD integration
- Automated testing

---

**Last Updated:** November 2025


