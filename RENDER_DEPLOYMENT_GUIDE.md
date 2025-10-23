# Render.com Deployment Guide - FREE Alternative

## 🎯 Why Render.com?
- ✅ **100% FREE** (no credit card required)
- ✅ **Supports Docker** (perfect for Gotenberg)
- ✅ **Easy setup** (5 minutes)
- ✅ **Reliable hosting**
- ✅ **Automatic HTTPS**

## 🚀 Step-by-Step Render Deployment

### Step 1: Create Render Account
1. **Go to [Render.com](https://render.com)**
2. **Click "Get Started for Free"**
3. **Sign up with GitHub** (recommended)
4. **Authorize Render** to access your repositories

### Step 2: Create New Web Service
1. **Click "New +"** in your dashboard
2. **Select "Web Service"**
3. **Connect GitHub repository**
4. **Find and select**: `TeknolojiMenajeriSosyalMedya`

### Step 3: Configure Service
1. **Name**: `gotenberg-pdf-service`
2. **Environment**: `Docker`
3. **Build Command**: `docker build -t gotenberg .`
4. **Start Command**: `gotenberg`
5. **Instance Type**: `Free` (or `Starter` for better performance)

### Step 4: Add Environment Variables
Click "Advanced" and add these environment variables:
```
CHROMIUM_DISABLE_WEB_SECURITY=true
CHROMIUM_ALLOW_LIST=file:///tmp/.*
GOTENBERG_LOG_LEVEL=info
```

### Step 5: Deploy
1. **Click "Create Web Service"**
2. **Wait 5-10 minutes** for deployment
3. **Watch the build logs** for any errors

### Step 6: Get Your Service URL
1. **Go to your service dashboard**
2. **Copy the service URL** (e.g., `https://gotenberg-pdf-service.onrender.com`)
3. **Save this URL** for Supabase configuration

### Step 7: Test Your Deployment
1. **Open the service URL** in your browser
2. **Test health endpoint**: `https://your-service.onrender.com/health`
3. **Should return**: `{"status":"ok"}` or similar

### Step 8: Update Supabase
1. **Go to Supabase Dashboard**
2. **Settings → Environment Variables**
3. **Add**: `GOTENBERG_URL=https://your-service.onrender.com`
4. **Save and redeploy** your Supabase function

## 🧪 Testing Commands

### Test Health
```bash
curl https://your-service.onrender.com/health
```

### Test PDF Generation
```bash
# Create test HTML
echo "<h1>Test PDF</h1><p>Generated at $(date)</p>" > test.html

# Test PDF generation
curl -X POST https://your-service.onrender.com/forms/chromium/convert/html \
  -F "files=@test.html" \
  -o test.pdf
```

## 🔧 Render Dashboard Features

### Monitoring
- **Logs**: Real-time deployment and runtime logs
- **Metrics**: CPU, memory usage
- **Health**: Service health status
- **Deployments**: Build and deployment history

### Configuration
- **Environment Variables**: Easy to update
- **Custom Domains**: Available for paid plans
- **Auto-deploy**: Automatic deployments on Git push

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check build logs in Render dashboard
   - Verify Dockerfile syntax
   - Ensure all files are committed to Git

2. **Service Won't Start**
   - Check runtime logs
   - Verify start command
   - Check environment variables

3. **Health Check Fails**
   - Wait 5-10 minutes for service to start
   - Check if port 3000 is exposed
   - Verify Gotenberg configuration

4. **PDF Generation Fails**
   - Check service logs
   - Test with simple HTML first
   - Verify environment variables

### Debug Steps
1. **Check Render logs** in dashboard
2. **Test health endpoint** with curl
3. **Verify environment variables**
4. **Test with simple HTML**

## 💰 Render Pricing

### Free Tier
- **$0/month**
- **750 hours/month** (enough for small services)
- **512MB RAM**
- **Custom domains**

### Paid Plans
- **Starter**: $7/month
- **Standard**: $25/month
- **Pro**: $85/month

## 🎯 Success Indicators

- ✅ Service shows "Live" status in Render dashboard
- ✅ Health endpoint returns 200 OK
- ✅ PDF generation works
- ✅ Supabase function uses Render URL
- ✅ Digital analysis generates PDFs

## 📞 Support

If you encounter issues:
1. **Check Render logs** first
2. **Verify environment variables**
3. **Test with curl commands**
4. **Check Supabase function logs**
5. **Contact Render support** if needed

## 🚀 Next Steps

1. **Deploy to Render.com** (follow steps above)
2. **Get your service URL**
3. **Update Supabase environment variable**
4. **Test the complete integration**
5. **Monitor service health**

Your Gotenberg service will be live and ready to generate PDFs! 🎉
