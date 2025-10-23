# Quick Setup Guide - Gotenberg PDF Service

## Current Situation
- ✅ Gotenberg running locally on `localhost:3000`
- ✅ Supabase function configured to use `GOTENBERG_URL` environment variable
- ❌ Need to deploy to production for live website

## 🚀 Quick Deployment Options

### Option 1: Railway.app (Easiest - 5 minutes)

1. **Sign up at Railway.app**
2. **Connect your GitHub repository**
3. **Add this to your repository root:**

```yaml
# railway.toml
[build]
builder = "dockerfile"

[deploy]
startCommand = "gotenberg"
healthcheckPath = "/health"
healthcheckTimeout = 100
restartPolicyType = "always"

[env]
CHROMIUM_DISABLE_WEB_SECURITY = "true"
CHROMIUM_ALLOW_LIST = "file:///tmp/.*"
```

4. **Deploy and get your URL** (e.g., `https://your-app.railway.app`)
5. **Update Supabase environment variable:**
   - Go to Supabase Dashboard → Settings → Environment Variables
   - Add: `GOTENBERG_URL=https://your-app.railway.app`

### Option 2: Render.com (Free tier available)

1. **Sign up at Render.com**
2. **Create new Web Service**
3. **Use these settings:**
   - **Build Command**: `docker build -t gotenberg .`
   - **Start Command**: `gotenberg`
   - **Environment Variables**:
     - `CHROMIUM_DISABLE_WEB_SECURITY=true`
     - `CHROMIUM_ALLOW_LIST=file:///tmp/.*`

4. **Deploy and get your URL**
5. **Update Supabase environment variable**

### Option 3: Your Own Server/VPS

1. **Upload files to your server:**
   ```bash
   scp docker-compose.production.yml user@your-server:/opt/gotenberg/
   scp nginx.conf user@your-server:/opt/gotenberg/
   ```

2. **SSH to your server:**
   ```bash
   ssh user@your-server
   cd /opt/gotenberg
   ```

3. **Deploy:**
   ```bash
   # Linux/Mac
   chmod +x deploy-gotenberg.sh
   ./deploy-gotenberg.sh production
   
   # Windows
   deploy-gotenberg.bat production
   ```

4. **Configure domain and SSL** (optional but recommended)

## 🔧 Environment Variable Setup

### In Supabase Dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add new variable:
   - **Name**: `GOTENBERG_URL`
   - **Value**: `https://your-deployed-url.com`
3. **Save** and **redeploy** your Supabase function

## 🧪 Testing Your Deployment

### Test locally first:
```bash
# Test your local Gotenberg
curl http://localhost:3000/health

# Test PDF generation
curl -X POST http://localhost:3000/forms/chromium/convert/html \
  -F "files=@test.html" \
  -o test.pdf
```

### Test production:
```bash
# Test your deployed Gotenberg
curl https://your-deployed-url.com/health

# Test PDF generation
curl -X POST https://your-deployed-url.com/forms/chromium/convert/html \
  -F "files=@test.html" \
  -o test.pdf
```

## 📊 Monitoring Your Service

### Health Check:
```bash
curl -f https://your-gotenberg-url.com/health
```

### Check logs:
```bash
# If using Docker
docker logs gotenberg-pdf-service-prod

# If using Railway
railway logs

# If using Render
# Check in Render dashboard
```

## 🚨 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Add CORS headers to your Gotenberg deployment
   - Check if your domain is allowed

2. **Timeout Errors**
   - Increase timeout settings in your Supabase function
   - Check if your deployment has enough resources

3. **Memory Issues**
   - Increase memory limits in Docker deployment
   - Check if your cloud provider has memory limits

4. **Network Issues**
   - Check firewall settings
   - Verify DNS configuration
   - Test with `curl` from command line

### Debug Commands:
```bash
# Check if service is running
docker ps | grep gotenberg

# Check service logs
docker logs gotenberg-pdf-service-prod

# Test health endpoint
curl -v https://your-gotenberg-url.com/health

# Test PDF generation
curl -X POST https://your-gotenberg-url.com/forms/chromium/convert/html \
  -F "files=@test.html" \
  -v
```

## 💰 Cost Comparison

| Platform | Cost | Setup Time | Control |
|----------|------|------------|---------|
| Railway.app | $5/month | 5 minutes | Medium |
| Render.com | Free tier | 10 minutes | Low |
| DigitalOcean | $5/month | 30 minutes | High |
| Your VPS | $3-10/month | 1 hour | Full |

## 🎯 Recommended Approach

**For quick setup**: Use **Railway.app**
- ✅ Fastest deployment (5 minutes)
- ✅ Automatic HTTPS
- ✅ Easy scaling
- ✅ Good for production

**For cost optimization**: Use **Render.com**
- ✅ Free tier available
- ✅ Easy setup
- ✅ Good for testing

**For full control**: Use **Your VPS**
- ✅ Complete control
- ✅ Custom configuration
- ✅ Better for high traffic

## 🔄 Next Steps

1. **Choose your deployment platform**
2. **Deploy Gotenberg service**
3. **Update Supabase environment variable**
4. **Test the integration**
5. **Monitor and optimize**

## 📞 Support

If you need help with deployment:
1. Check the logs first
2. Test with `curl` commands
3. Verify environment variables
4. Check network connectivity

Your Supabase function is already configured correctly - you just need to update the `GOTENBERG_URL` environment variable with your deployed service URL!
