# ADB Agent Server Deployment Guide

## ⚠️ Important Limitation

**The ADB agent MUST run on a computer that has:**
1. ADB (Android Debug Bridge) installed
2. Physical or network connection to the Android device
3. USB debugging access to the device

**This means cloud deployment has limitations** - you cannot control a device that's not connected to the server's machine.

---

## Option 1: Run Server on Your PC (Recommended)

### Setup:
1. Keep the server running on your PC
2. Connect your phone via USB or WiFi ADB
3. Use `adb reverse` for localhost access, OR use your PC's IP address

### Start Server:
```bash
cd adb-agent
npm start
```

### Configure App:
In `app.json`, set:
```json
"ADB_AGENT_HOST": "localhost"  // if using adb reverse
// OR
"ADB_AGENT_HOST": "192.168.x.x"  // your PC's IP address
```

### Run ADB Reverse:
```bash
adb reverse tcp:3000 tcp:3000
```

---

## Option 2: Deploy to Cloud (Limited Use Case)

### Use Cases:
- Remote device control (device connected to cloud server)
- ADB over WiFi to a specific device
- Shared automation server for a team

### Deployment Platforms:

#### A. Railway.app (Free Tier Available)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
cd adb-agent
railway init
railway up
```

#### B. Render.com (Free Tier)
1. Go to render.com
2. Create new Web Service
3. Connect your GitHub repo
4. Set:
   - Build Command: `cd adb-agent && npm install`
   - Start Command: `cd adb-agent && npm start`
   - Port: 3000

#### C. Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
cd adb-agent
heroku create your-app-name

# Deploy
git init
git add .
git commit -m "Deploy ADB agent"
heroku git:remote -a your-app-name
git push heroku main
```

### After Cloud Deployment:

1. **Get your server URL** (e.g., `https://your-app.railway.app`)

2. **Update app.json**:
```json
"ADB_AGENT_HOST": "your-app.railway.app"
```

3. **Connect device to cloud server**:
   - Enable ADB over WiFi on your device
   - Configure ADB to connect to your device's IP
   - This requires the device to be accessible from the cloud server (complex networking)

---

## Option 3: Hybrid Approach (Best for Production)

### Architecture:
1. **Local ADB Agent** on your PC (for device control)
2. **Cloud API Server** (for app logic, authentication, etc.)
3. **App** connects to cloud API, which proxies commands to local agent

This requires:
- Setting up a tunnel (ngrok, cloudflare tunnel)
- Or VPN connection between cloud and your PC

---

## Recommended Setup for Your Use Case

**For personal use:**
- Keep server on your PC
- Use `adb reverse` for easy connection
- Start server when needed

**For production/team use:**
- Deploy a dedicated PC/server with ADB
- Connect devices via USB hub or WiFi ADB
- Use cloud hosting for the server
- Implement authentication and security

---

## Security Considerations

If deploying to cloud:
- Add authentication (API keys, JWT tokens)
- Restrict CORS to your app's domain
- Use HTTPS
- Implement rate limiting
- Log all commands for audit

---

## Current Status

Your server is configured to run locally. To use it:

```bash
# Terminal 1: Start ADB agent
cd adb-agent
npm start

# Terminal 2: Start Expo app
cd ..
npx expo start

# Terminal 3: Setup ADB reverse
adb reverse tcp:3000 tcp:3000
```

Then your APK will be able to connect to the server when the phone is connected via USB!
