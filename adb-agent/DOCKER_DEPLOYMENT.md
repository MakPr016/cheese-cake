# Docker + FastAPI Deployment Guide

## 🐳 What This Solves

✅ **Automatic ADB installation** - Docker installs everything needed
✅ **Consistent environment** - Works the same everywhere
✅ **Easy deployment** - One command to run
✅ **FastAPI** - Modern, fast Python API framework

## ⚠️ The Device Connection Challenge

**Critical Limitation:** The Docker container needs to connect to your Android device.

### Connection Options:

#### 1. **USB Connection (Local Docker Only)**
- ✅ Works on your PC with Docker Desktop
- ❌ Does NOT work on cloud platforms (Vercel, Huggingface, Railway, etc.)
- Why: Cloud platforms don't provide USB passthrough

#### 2. **ADB over WiFi (Works Everywhere)**
- ✅ Works on cloud platforms
- ⚠️ Requires device to be network-accessible to the server
- Setup: Enable ADB over WiFi on your device

---

## 🚀 Quick Start (Local)

### Build and Run:
```bash
cd adb-agent

# Build the Docker image
docker build -t adb-automation .

# Run the container
docker run -p 8000:8000 adb-automation
```

### Or use Docker Compose:
```bash
docker-compose up -d
```

### Test the API:
```bash
curl http://localhost:8000/health
curl http://localhost:8000/status
```

---

## ☁️ Cloud Deployment Options

### Option 1: Railway.app (Recommended)

**Pros:**
- Free tier available
- Supports Docker
- Easy deployment
- Persistent storage

**Setup:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd adb-agent
railway init

# Deploy
railway up
```

**Configure ADB over WiFi:**
1. On your phone: Settings → Developer Options → Wireless debugging
2. Note your device IP and port (e.g., 192.168.1.100:5555)
3. Add environment variable in Railway:
   ```
   DEVICE_IP=192.168.1.100
   ADB_PORT=5555
   ```

**Limitation:** Your device must be accessible from Railway's servers (requires VPN or public IP)

---

### Option 2: Render.com

**Pros:**
- Free tier
- Docker support
- Auto-deploy from GitHub

**Setup:**
1. Push code to GitHub
2. Go to render.com
3. New → Web Service
4. Connect repository
5. Select Docker runtime
6. Deploy

**Same limitation:** Device must be network-accessible

---

### Option 3: Huggingface Spaces

**Pros:**
- Free GPU/CPU
- Docker support
- Great for demos

**Setup:**
1. Create new Space
2. Choose Docker SDK
3. Push your code
4. Add Dockerfile

**Limitation:** Not ideal for persistent device connections

---

### Option 4: DigitalOcean/AWS/GCP (Best for Production)

**Pros:**
- Full control
- Can connect devices via VPN
- Reliable networking
- Can attach USB devices to VMs

**Setup:**
1. Create a VM/Droplet
2. Install Docker
3. Clone your repo
4. Run docker-compose up

**Cost:** ~$5-10/month

---

## 🔧 Recommended Architecture for Cloud

Since cloud platforms can't access your USB device directly, here's the best approach:

### **Hybrid Setup:**

```
[Your Phone] ←USB→ [Your PC running Docker] ←Internet→ [Your Expo App]
```

**Steps:**
1. Run Docker on your PC (not cloud)
2. Expose the server to internet using:
   - **ngrok** (easiest): `ngrok http 8000`
   - **Cloudflare Tunnel**: Free, secure
   - **Port forwarding**: On your router

3. Update your app to use the public URL

### Using ngrok:
```bash
# Install ngrok
npm install -g ngrok

# Run your Docker container
docker-compose up -d

# Expose to internet
ngrok http 8000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
```

### Update app.json:
```json
"ADB_AGENT_HOST": "abc123.ngrok.io"
```

---

## 🔐 Security for Production

If exposing to internet, add authentication:

### 1. Add API Key Authentication:
```python
# In fastapi_server.py
from fastapi import Header, HTTPException

API_KEY = os.getenv("API_KEY", "your-secret-key")

async def verify_api_key(x_api_key: str = Header()):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return x_api_key

# Add to endpoints
@app.post("/whatsapp", dependencies=[Depends(verify_api_key)])
async def send_whatsapp(data: WhatsAppMessage):
    ...
```

### 2. Use HTTPS (ngrok provides this automatically)

### 3. Rate Limiting:
```bash
pip install slowapi
```

---

## 📊 Comparison: Where to Deploy

| Solution | Cost | Ease | USB Access | WiFi ADB | Best For |
|----------|------|------|------------|----------|----------|
| **Local Docker** | Free | ⭐⭐⭐⭐⭐ | ✅ | ✅ | Development |
| **Local + ngrok** | Free | ⭐⭐⭐⭐ | ✅ | ✅ | Personal use |
| **Railway** | Free tier | ⭐⭐⭐⭐ | ❌ | ⚠️ | Demo |
| **Render** | Free tier | ⭐⭐⭐⭐ | ❌ | ⚠️ | Demo |
| **DigitalOcean** | $5/mo | ⭐⭐⭐ | ❌ | ✅ | Production |
| **AWS/GCP** | Variable | ⭐⭐ | ❌ | ✅ | Enterprise |

---

## 🎯 My Recommendation for You

**For your APK:**

1. **Run Docker locally on your PC**:
   ```bash
   cd adb-agent
   docker-compose up -d
   ```

2. **Expose with ngrok**:
   ```bash
   ngrok http 8000
   ```

3. **Update app.json** with ngrok URL

4. **Build APK**:
   ```bash
   eas build --platform android --profile preview
   ```

**Result:** Your APK can connect to your PC's Docker container from anywhere via ngrok!

---

## 🧪 Testing

### Test locally:
```bash
# Start server
docker-compose up

# Test health
curl http://localhost:8000/health

# Test WhatsApp (with device connected)
curl -X POST http://localhost:8000/whatsapp \
  -H "Content-Type: application/json" \
  -d '{"contact": "Jutin CSE", "message": "Test from Docker!"}'
```

---

## 🔄 Updating Your Expo App

Update the ADB service to use port 8000 instead of 3000:

In `src/config/adb.config.ts`:
```typescript
export const ADB_AGENT_PORT = 8000; // Changed from 3000
```

Or update app.json:
```json
"ADB_AGENT_HOST": "your-ngrok-url.ngrok.io"
```

---

## ✅ Next Steps

1. **Test locally first**: `docker-compose up`
2. **Verify it works**: Test WhatsApp automation
3. **Choose deployment**: Local + ngrok OR cloud platform
4. **Build APK**: `eas build --platform android --profile preview`
5. **Update app config**: Point to your server URL

**Want me to help you set up ngrok or deploy to a specific platform?**
