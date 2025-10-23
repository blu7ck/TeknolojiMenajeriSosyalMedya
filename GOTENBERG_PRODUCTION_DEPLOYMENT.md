# Gotenberg PDF Service - Production Deployment Guide

## Current Setup
- **Local Service**: `gotenberg-pdf-service` running on `localhost:3000`
- **Docker Image**: `gotenberg/gotenberg:8`
- **Current URL**: `http://localhost:3000`

## Production Deployment Options

### Option 1: VPS/Server Deployment (Recommended)

#### 1.1 Deploy on Your Own Server
```bash
# Create production docker-compose.yml
version: '3.8'

services:
  gotenberg:
    image: gotenberg/gotenberg:8
    container_name: gotenberg-pdf-service-prod
    restart: unless-stopped
    ports:
      - "3000:3000"  # Expose to public
    environment:
      - CHROMIUM_DISABLE_WEB_SECURITY=true
      - CHROMIUM_ALLOW_LIST=file:///tmp/.*
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - SETGID
      - SETUID
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

#### 1.2 Deploy with Nginx Reverse Proxy
```nginx
# /etc/nginx/sites-available/gotenberg
server {
    listen 80;
    server_name your-gotenberg-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeout settings for PDF generation
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

### Option 2: Cloud Platform Deployment

#### 2.1 Railway.app Deployment
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

#### 2.2 Render.com Deployment
```yaml
# render.yaml
services:
  - type: web
    name: gotenberg-pdf-service
    env: docker
    dockerfilePath: ./Dockerfile
    envVars:
      - key: CHROMIUM_DISABLE_WEB_SECURITY
        value: true
      - key: CHROMIUM_ALLOW_LIST
        value: file:///tmp/.*
    healthCheckPath: /health
```

#### 2.3 DigitalOcean App Platform
```yaml
# .do/app.yaml
name: gotenberg-pdf-service
services:
- name: gotenberg
  source_dir: /
  github:
    repo: your-repo
    branch: main
  run_command: gotenberg
  environment_slug: docker
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: CHROMIUM_DISABLE_WEB_SECURITY
    value: "true"
  - key: CHROMIUM_ALLOW_LIST
    value: "file:///tmp/.*"
  health_check:
    http_path: /health
```

### Option 3: Docker Swarm/Kubernetes

#### 3.1 Docker Swarm
```yaml
# docker-stack.yml
version: '3.8'
services:
  gotenberg:
    image: gotenberg/gotenberg:8
    deploy:
      replicas: 2
      placement:
        constraints:
          - node.role == worker
      resources:
        limits:
          cpus: '2'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
    ports:
      - "3000:3000"
    environment:
      - CHROMIUM_DISABLE_WEB_SECURITY=true
      - CHROMIUM_ALLOW_LIST=file:///tmp/.*
```

## Environment Configuration

### Update Supabase Environment Variables
```bash
# Add to your Supabase project environment variables
GOTENBERG_URL=https://your-gotenberg-domain.com
# or
GOTENBERG_URL=https://your-app.railway.app
# or
GOTENBERG_URL=https://your-app.render.com
```

### Update Your Supabase Function
The function already has the correct configuration:
```typescript
const gotenbergUrl = Deno.env.get('GOTENBERG_URL') || 'http://localhost:3000'
```

## Security Considerations

### 1. Network Security
```yaml
# Add to docker-compose.yml
networks:
  gotenberg-network:
    driver: bridge
    internal: true  # Internal network only

services:
  gotenberg:
    networks:
      - gotenberg-network
    # Remove public port exposure
    # ports:
    #   - "3000:3000"
```

### 2. Authentication (Optional)
```typescript
// Add to your Supabase function
const gotenbergAuth = Deno.env.get('GOTENBERG_AUTH_TOKEN')
const headers = {
  'Content-Type': 'application/json',
  ...(gotenbergAuth && { 'Authorization': `Bearer ${gotenbergAuth}` })
}
```

### 3. Rate Limiting
```yaml
# Add to docker-compose.yml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - gotenberg
```

## Monitoring and Health Checks

### 1. Health Check Endpoint
```bash
curl -f https://your-gotenberg-domain.com/health
```

### 2. Monitoring Script
```bash
#!/bin/bash
# monitor-gotenberg.sh
while true; do
  if ! curl -f https://your-gotenberg-domain.com/health > /dev/null 2>&1; then
    echo "Gotenberg is down! Alerting..."
    # Send alert to your monitoring system
  fi
  sleep 30
done
```

### 3. Docker Health Check
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

## Deployment Steps

### Step 1: Choose Your Platform
1. **VPS/Server**: Full control, cost-effective
2. **Railway.app**: Easy deployment, good for small projects
3. **Render.com**: Free tier available, easy setup
4. **DigitalOcean**: Scalable, professional

### Step 2: Deploy Gotenberg
```bash
# For VPS deployment
git clone your-repo
cd your-repo
docker-compose up -d

# For Railway
railway login
railway init
railway up
```

### Step 3: Update Environment Variables
```bash
# In your Supabase dashboard
GOTENBERG_URL=https://your-deployed-url.com
```

### Step 4: Test the Integration
```bash
# Test PDF generation
curl -X POST https://your-supabase-function-url \
  -H "Content-Type: application/json" \
  -d '{"requestId":"test","website":"https://example.com","name":"Test","email":"test@example.com"}'
```

## Troubleshooting

### Common Issues
1. **CORS Errors**: Add CORS headers to Gotenberg
2. **Memory Issues**: Increase memory limits
3. **Timeout Issues**: Increase timeout settings
4. **Network Issues**: Check firewall and DNS

### Debug Commands
```bash
# Check Gotenberg logs
docker logs gotenberg-pdf-service

# Test health endpoint
curl -v https://your-gotenberg-domain.com/health

# Test PDF generation
curl -X POST https://your-gotenberg-domain.com/forms/chromium/convert/html \
  -F "files=@test.html"
```

## Cost Estimation

### VPS Deployment
- **DigitalOcean**: $5-10/month (basic droplet)
- **Linode**: $5-10/month (nanode)
- **Vultr**: $3.50-6/month (regular)

### Cloud Platform
- **Railway**: $5/month (hobby plan)
- **Render**: Free tier available
- **DigitalOcean App Platform**: $5/month (basic)

## Recommended Approach

For your use case, I recommend:

1. **Start with Railway.app** (easiest setup)
2. **Move to VPS** if you need more control
3. **Use Nginx** for production-grade setup

Would you like me to help you set up any of these deployment options?
