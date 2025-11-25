# Documentation Index

This document provides an overview of all available documentation for the Professor Rahman's Photography Gallery project.

## 📚 Main Documentation Files

### Getting Started
- **[README.md](./README.md)** - Main project documentation
  - Features overview
  - Quick start guide
  - Environment setup
  - Deployment instructions
  - Troubleshooting

### Architecture & Technical Details
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture documentation
  - Component architecture
  - Data flow diagrams
  - Performance optimizations
  - Security considerations
  - Scalability options

### Deployment Guides
- **[EC2_DEPLOYMENT_GUIDE.md](./EC2_DEPLOYMENT_GUIDE.md)** - Detailed EC2 deployment guide
  - Step-by-step deployment
  - PM2 configuration
  - Nginx setup
  - SSL/TLS configuration
  - Environment variable setup

### Scripts Documentation
- **[scripts/README.md](./scripts/README.md)** - Complete scripts documentation
  - Image management scripts
  - S3 synchronization
  - AWS configuration
  - Utility scripts

- **[scripts/README-CATEGORIZATION.md](./scripts/README-CATEGORIZATION.md)** - Image categorization guide (reference)
  - AI-powered categorization
  - Validation workflows
  - Category management

## 🚀 Quick Reference

### Common Tasks

**Local Development:**
```bash
npm install
npm run dev
```

**Deploy to Production:**
```bash
bash deploy.sh
```

**Generate Hero Image:**
```bash
node scripts/generate-hero-image.js Category ImageName.jpg
```

**Check PM2 Status:**
```bash
pm2 status
pm2 logs rahmans-gallery
```

### Key Files

**Configuration:**
- `ecosystem.config.js` - PM2 configuration
- `nginx/skrahman.art.conf` - Nginx configuration
- `.env.local` - Local environment variables
- `.env.production` - Production environment variables

**Deployment:**
- `deploy.sh` - Main deployment script
- `SETUP_EC2_ENV.sh` - EC2 initial setup script

## 📖 Documentation by Topic

### For Developers
1. Start with **[README.md](./README.md)** for overview
2. Read **[ARCHITECTURE.md](./ARCHITECTURE.md)** for technical details
3. Check **[scripts/README.md](./scripts/README.md)** for available tools

### For Deployment
1. Follow **[EC2_DEPLOYMENT_GUIDE.md](./EC2_DEPLOYMENT_GUIDE.md)** for first-time setup
2. Use `deploy.sh` for regular deployments
3. Check PM2 logs for troubleshooting

### For Image Management
1. Read **[scripts/README.md](./scripts/README.md)** for image scripts
2. Use `generate-hero-image.js` for hero images
3. Use `sync-to-s3.sh` for S3 uploads

## 🔗 External Resources

### Services Used
- **Next.js:** https://nextjs.org/docs
- **AWS S3:** https://docs.aws.amazon.com/s3/
- **PM2:** https://pm2.keymetrics.io/docs/
- **Nginx:** https://nginx.org/en/docs/

### Project Links
- **Live Website:** https://skrahman.art
- **GitHub Repository:** https://github.com/RizwaanShaik/rahmans-gallery

## 📝 Documentation Standards

### When Adding New Documentation
1. Use Markdown format
2. Include code examples where applicable
3. Add to this index if creating new documentation file
4. Follow existing documentation structure
5. Include "Last Updated" date

### Documentation Maintenance
- Update documentation when making significant changes
- Keep examples current with codebase
- Remove outdated information
- Add troubleshooting notes for common issues

## 🆘 Getting Help

### Common Issues
1. Check **[README.md](./README.md)** troubleshooting section
2. Review **[EC2_DEPLOYMENT_GUIDE.md](./EC2_DEPLOYMENT_GUIDE.md)** for deployment issues
3. Check PM2 logs: `pm2 logs rahmans-gallery`

### Logs to Check
- **Application:** `pm2 logs rahmans-gallery`
- **Nginx:** `/var/log/nginx/error.log`
- **System:** `journalctl -u nginx`

---

**Last Updated:** November 2025
**Maintained by:** Project Contributors
