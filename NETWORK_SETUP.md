# Network Setup Guide - Safe & Flexible

## The Problem

Your phone needs to connect to the ADB agent on your PC, but hardcoding IPs is risky and not portable.

## ✅ Safe Solution: Use ADB Port Forwarding

This is the **recommended approach** - no IP addresses needed!

### Setup (One-Time)

```bash
# Forward port 3000 from phone to PC
adb reverse tcp:3000 tcp:3000
```

Now your phone can use `localhost:3000` to reach your PC! 🎉

### How It Works

```
Phone (localhost:3000) → ADB Reverse → PC (localhost:3000)
```

The phone thinks it's connecting to itself, but ADB forwards it to your PC.

### Start Your Services

```bash
# Terminal 1: ADB Agent
cd adb-agent
npm start

# Terminal 2: Setup port forwarding
adb reverse tcp:3000 tcp:3000

# Terminal 3: Expo App
npm start
```

### Verify It Works

On your phone, the app will connect to `http://localhost:3000` and it will work!

---

## Alternative: WiFi ADB (No USB Cable)

If you want wireless debugging:

### Step 1: Connect via USB first
```bash
adb tcpip 5555
```

### Step 2: Find phone's IP
```bash
adb shell ip addr show wlan0
# Look for: inet 192.168.x.x
```

### Step 3: Connect wirelessly
```bash
adb connect 192.168.x.x:5555
```

### Step 4: Setup port forwarding
```bash
adb reverse tcp:3000 tcp:3000
```

Now you can unplug the USB cable!

---

## For Different Networks (Optional)

If you need to use different networks (home/work), you can set the host in `app.json`:

### Edit `app.json`
```json
{
  "expo": {
    "extra": {
      "ASSEMBLYAI_API_KEY": "05a93f2d0f8342c48fd077353b449eb9",
      "ADB_AGENT_HOST": "localhost"
    }
  }
}
```

**Options:**
- `"localhost"` - Use with ADB reverse (recommended)
- `"192.168.1.100"` - Your PC's IP (if reverse doesn't work)
- `"10.0.2.2"` - Special IP for Android emulator

---

## Quick Start (Recommended)

```bash
# 1. Start ADB agent
cd adb-agent
npm start

# 2. Setup port forwarding (in new terminal)
adb reverse tcp:3000 tcp:3000

# 3. Start Expo (in new terminal)
npm start

# 4. Open app on phone and test!
```

---

## Troubleshooting

### "Connection refused" or "Network request failed"

**Check port forwarding:**
```bash
adb reverse tcp:3000 tcp:3000
```

**Verify device connected:**
```bash
adb devices
# Should show: ZD222JRBJP    device
```

**Test from phone:**
```bash
# In Expo app, check logs for connection status
```

### Port forwarding not working?

**Restart ADB:**
```bash
adb kill-server
adb start-server
adb devices
adb reverse tcp:3000 tcp:3000
```

### Still not working?

**Use IP address as fallback:**

1. Find your PC's IP:
   ```bash
   ipconfig
   # Look for IPv4 Address: 192.168.x.x
   ```

2. Edit `app.json`:
   ```json
   "extra": {
     "ADB_AGENT_HOST": "192.168.1.100"
   }
   ```

3. Restart Expo:
   ```bash
   npm start
   ```

---

## Why ADB Reverse is Better

| Method | Pros | Cons |
|--------|------|------|
| **ADB Reverse** | ✅ No IP needed<br>✅ Works everywhere<br>✅ Secure<br>✅ Easy | ⚠️ Requires USB (initially) |
| **IP Address** | ✅ Works over WiFi | ❌ Changes per network<br>❌ Not portable<br>❌ Firewall issues |
| **Emulator** | ✅ Use 10.0.2.2 | ❌ Only for emulator |

---

## Summary

**Best practice:**
1. Use `adb reverse tcp:3000 tcp:3000`
2. Keep `ADB_AGENT_HOST` as `localhost` (default)
3. No IP addresses to manage!

**Your setup:**
```bash
adb reverse tcp:3000 tcp:3000  # Run once per connection
cd adb-agent && npm start       # Terminal 1
npm start                       # Terminal 2
```

Done! 🚀
