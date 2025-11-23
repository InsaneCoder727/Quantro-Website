# Quick Deployment Script for Crypto Dashboard
Write-Host "🚀 Starting deployment to Vercel..." -ForegroundColor Green

# Check if vercel is installed
try {
    vercel --version | Out-Null
    Write-Host "✓ Vercel CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

Write-Host ""
Write-Host "📝 Make sure you're logged in to Vercel (will prompt if not)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Deploying your app..." -ForegroundColor Cyan
Write-Host ""

# Deploy to Vercel
vercel --prod

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "Your app is now live! Share the URL with anyone." -ForegroundColor Cyan
