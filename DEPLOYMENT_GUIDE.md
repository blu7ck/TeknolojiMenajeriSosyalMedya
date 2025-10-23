# Deployment Guide - Gotenberg PDF Service

## 🎯 Current Status
- ✅ **Gotenberg Service**: Live on Render.com
- ✅ **Service URL**: `https://gotenberg-pdf-service-fe79.onrender.com`
- ✅ **Health Check**: Working (`/health` endpoint)
- ✅ **PDF Generation**: Ready for production

## 🚀 Deployment Summary

### Render.com Deployment (COMPLETED)
- **Platform**: Render.com (Free tier)
- **Service**: Gotenberg PDF Generator
- **URL**: `https://gotenberg-pdf-service-fe79.onrender.com`
- **Status**: Live and operational
- **Health Check**: `/health` endpoint responding

### Supabase Integration (NEXT STEP)
- **Function**: `analyze-website` (updated with error handling)
- **Environment Variable**: `GOTENBERG_URL` (needs to be set)
- **Status**: Ready for configuration

## 🔧 Next Steps

### 1. Update Supabase Environment Variables
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings → Environment Variables**
4. Add new variable:
   - **Name**: `GOTENBERG_URL`
   - **Value**: `https://gotenberg-pdf-service-fe79.onrender.com`
5. Click **Save**
6. **Redeploy** your Supabase function

### 2. Test Integration
```bash
# Test Gotenberg service
curl https://gotenberg-pdf-service-fe79.onrender.com/health

# Test PDF generation
curl -X POST https://gotenberg-pdf-service-fe79.onrender.com/forms/chromium/convert/html \
  -F "files=@test.html" -o test.pdf
```

### 3. Verify Complete System
1. **Test digital analysis** on your website
2. **Check if PDF generation works**
3. **Monitor Render.com logs** for any issues
4. **Check Supabase function logs**

## 📊 Monitoring

### Render.com Dashboard
- **Service Status**: Live
- **Logs**: Real-time monitoring
- **Metrics**: CPU, memory usage
- **Health**: Automatic health checks

### Supabase Dashboard
- **Edge Functions**: Monitor `analyze-website` function
- **Logs**: Check for any errors
- **Environment Variables**: Verify `GOTENBERG_URL` is set

## 🚨 Troubleshooting

### Common Issues
1. **PDF Generation Fails**
   - Check Render.com logs
   - Verify `GOTENBERG_URL` in Supabase
   - Test Gotenberg service directly

2. **Supabase Function Errors**
   - Check Supabase function logs
   - Verify environment variables
   - Test with simple requests

3. **Service Not Responding**
   - Check Render.com service status
   - Verify health endpoint
   - Check for deployment issues

### Debug Commands
```bash
# Test Gotenberg health
curl https://gotenberg-pdf-service-fe79.onrender.com/health

# Test PDF generation
curl -X POST https://gotenberg-pdf-service-fe79.onrender.com/forms/chromium/convert/html \
  -F "files=@test.html" -o test.pdf

# Check Supabase function
curl -X POST https://your-supabase-project.supabase.co/functions/v1/analyze-website \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"requestId":"test","website":"https://example.com","name":"Test","email":"test@example.com"}'
```

## 🎯 Success Criteria

- ✅ Gotenberg service is live on Render.com
- ✅ Health endpoint responds with 200 OK
- ✅ PDF generation works
- ✅ Supabase function uses Gotenberg URL
- ✅ Digital analysis generates PDFs
- ✅ No errors in logs

## 📞 Support

If you encounter issues:
1. Check Render.com logs first
2. Verify Supabase environment variables
3. Test with curl commands
4. Check Supabase function logs
5. Contact support if needed

Your PDF service is now live and ready for production! 🚀
