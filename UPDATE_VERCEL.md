# How to Update Your Existing Vercel Project

You have 3 easy ways to update your Vercel project:

## Option 1: Using Vercel CLI (Fastest - Recommended) ⚡

### Step 1: Link to Your Existing Project
```bash
vercel link
```
- It will ask for your project name - select your existing project
- It will ask for scope (your account) - select it
- This links your local folder to your Vercel project

### Step 2: Deploy the Update
```bash
vercel --prod
```
- This deploys to production immediately
- Your live site will update in 1-2 minutes!

**That's it!** Your project is updated! 🎉

---

## Option 2: Git + Auto-Deploy (If Connected to GitHub) 🔄

If your Vercel project is connected to GitHub:

### Step 1: Push Changes to GitHub
```bash
git add .
git commit -m "Update dashboard features"
git push
```

### Step 2: Vercel Auto-Deploys!
- Vercel automatically detects changes
- Deploys automatically in 2-3 minutes
- You'll see the deployment in your Vercel dashboard

---

## Option 3: Deploy from Vercel Dashboard 🌐

1. Go to [vercel.com](https://vercel.com) and login
2. Go to your project
3. Click **"Deployments"** tab
4. Click **"Redeploy"** on the latest deployment
5. Or click **"Deploy"** → **"Deploy with Git"** to connect a repo

---

## Quick Command Summary

```bash
# Link to existing project (first time only)
vercel link

# Deploy to production (updates your live site)
vercel --prod

# Or deploy to preview (test before production)
vercel
```

---

## Troubleshooting

**"Project not found" error?**
- Run `vercel link` first to connect to your project
- Make sure you're logged in: `vercel login`

**Want to see what changed?**
- Check Vercel dashboard → Deployments tab
- See build logs and deployment status

**Need to undo a deployment?**
- Vercel dashboard → Deployments → Click on a previous deployment → "Promote to Production"

