# Vercel Deployment Guide

## Quick Deploy (Recommended)

### Option 1: Deploy via Vercel Dashboard

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Quiz app with TestBook UI"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite settings
   - Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **For production:**
   ```bash
   vercel --prod
   ```

## Environment Setup

The app is already configured with:
- ✅ `vercel.json` - Vercel configuration
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`
- ✅ SPA routing configured

## Build Settings (Auto-detected)

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## Post-Deployment

After deployment, your app will be available at:
- Production: `https://your-app-name.vercel.app`
- Auto-generated preview URLs for each commit

## Troubleshooting

If you encounter issues:

1. **Build fails:** Check `npm run build` works locally
2. **Routes not working:** The `vercel.json` handles SPA routing
3. **Dependencies missing:** Make sure `package.json` is committed

## Custom Domain

To add a custom domain:
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records as instructed

## Automatic Deployments

Once connected to GitHub:
- Every push to `main` = Production deployment
- Every PR = Preview deployment with unique URL
