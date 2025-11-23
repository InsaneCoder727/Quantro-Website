# Deployment Guide

This guide will help you deploy your Crypto Dashboard to Vercel (free hosting).

## Option 1: Deploy via Vercel CLI (Quickest)

1. **Install Vercel CLI globally:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from your project directory:**
   ```bash
   vercel
   ```
   Follow the prompts - it will ask if you want to link to an existing project or create a new one.

4. **For production deployment:**
   ```bash
   vercel --prod
   ```

Your app will be live at a URL like: `https://your-project-name.vercel.app`

## Option 2: Deploy via GitHub + Vercel Web (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin master
   ```

2. **Go to [vercel.com](https://vercel.com)** and sign up/login with GitHub

3. **Click "Add New Project"**

4. **Import your GitHub repository**

5. **Vercel will auto-detect Next.js** - just click "Deploy"

6. **Wait 2-3 minutes** and your app will be live!

## Environment Variables (if needed)

If you need to add API keys later:
1. Go to your project on Vercel dashboard
2. Settings → Environment Variables
3. Add any required variables

## Your Live URL

Once deployed, you'll get a URL like:
- `https://crypto-pump-dump-dashboard.vercel.app`

You can share this URL with anyone!

## Custom Domain (Optional)

In Vercel dashboard:
1. Go to your project → Settings → Domains
2. Add your custom domain if you have one
