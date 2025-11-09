# ADB Automation Agent

A Node.js server that provides ADB automation capabilities for Android devices with intelligent contact resolution.

## Features

- ✅ **Contact Resolution**: Automatically finds contacts by name
- ✅ **WhatsApp Automation**: Send messages by contact name
- ✅ **Phone Calls**: Call contacts by name
- ✅ **Browser Control**: Open URLs in specific browsers (Opera, Chrome, etc.)
- ✅ **App Launching**: Open any installed app
- ✅ **UI Interaction**: Tap, swipe, type, press keys
- ✅ **Screen Capture**: Take screenshots and get UI dumps

## Setup

### 1. Install ADB (Android Debug Bridge)

**Windows:**
- Download [Android SDK Platform Tools](https://developer.android.com/studio/releases/platform-tools)
- Extract to `C:\adb\`
- Add to PATH: `setx PATH "%PATH%;C:\adb\platform-tools"`

**Verify installation:**
```bash
adb --version
```

### 2. Enable USB Debugging on Android

1. Go to **Settings** → **About Phone**
2. Tap **Build Number** 7 times to enable Developer Options
3. Go to **Settings** → **Developer Options**
4. Enable **USB Debugging**
5. Enable **Install via USB** (if available)

### 3. Connect Device

**Via USB:**
```bash
adb devices
```
You should see your device listed. Accept the USB debugging prompt on your phone.

**Via WiFi (optional):**
```bash
# First connect via USB, then:
adb tcpip 5555
# Find your device IP in Settings → About → Status
adb connect <DEVICE_IP>:5555
```

### 4. Grant Permissions

```bash
# Allow phone calls
adb shell pm grant com.android.phone android.permission.CALL_PHONE

# Allow reading contacts (if needed)
adb shell pm grant com.android.contacts android.permission.READ_CONTACTS
```

### 5. Install Dependencies

```bash
cd adb-agent
npm install
```

### 6. Start the Agent

```bash
npm start
```

The server will start on `http://localhost:3000`

### 7. Run Tests (Optional)

To verify everything works:

```bash
# In a new terminal
npm test
```

See `TEST_README.md` for detailed test documentation.

## API Endpoints

### Check Connection
```bash
GET http://localhost:3000/status
```

### Search Contacts
```bash
POST http://localhost:3000/contacts/search
Body: { "query": "Jutin" }
```

### Send WhatsApp Message
```bash
POST http://localhost:3000/whatsapp
Body: { "contact": "Jutin", "message": "Are you coming to the party tomorrow?" }
```

### Make Phone Call
```bash
POST http://localhost:3000/call
Body: { "contact": "Jutin" }
```

### Open URL in Browser
```bash
POST http://localhost:3000/open-url
Body: { "url": "https://instagram.com", "browser": "opera" }
```

### Execute Automation Plan
```bash
POST http://localhost:3000/execute-plan
Body: {
  "steps": [
    {
      "action": "open_url",
      "target": "https://instagram.com",
      "browser": "opera",
      "reasoning": "Open Instagram in Opera"
    },
    {
      "action": "whatsapp",
      "target": "Jutin",
      "text": "Are you coming to the party tomorrow?",
      "reasoning": "Message Jutin on WhatsApp"
    },
    {
      "action": "wait",
      "target": "2000",
      "reasoning": "Wait 2 seconds"
    },
    {
      "action": "call",
      "target": "Jutin",
      "reasoning": "Call Jutin"
    }
  ]
}
```

## Supported Actions

- `open_app` - Launch an app by package name
- `open_url` - Open URL in browser (specify browser: "opera", "chrome", etc.)
- `whatsapp` - Send WhatsApp message (auto-resolves contact names)
- `call` - Make phone call (auto-resolves contact names)
- `email` - Send email
- `tap` - Tap at coordinates
- `type` - Type text
- `swipe` - Swipe gesture
- `key` - Press key (HOME=3, BACK=4, ENTER=66)
- `wait` - Wait/delay

## Troubleshooting

### Device not found
```bash
adb kill-server
adb start-server
adb devices
```

### Permission denied
```bash
adb shell pm grant <package> <permission>
```

### WhatsApp not auto-sending
- The tap coordinates (950, 1850) may need adjustment for your device
- Use UI dump to find exact send button coordinates:
```bash
GET http://localhost:3000/ui-dump
```

### Contact not found
- Ensure contacts are synced on the device
- Try the full name or partial match
- Check contact list:
```bash
GET http://localhost:3000/contacts
```

## Integration with Expo App

The Expo app will send automation plans to this agent. Make sure:
1. Agent is running on `http://localhost:3000`
2. Device is connected and authorized
3. Required permissions are granted

## Security Notes

- This agent runs locally and requires physical device access
- Never expose this server to the internet
- Only use on devices you own
- Be careful with automated actions (calls, messages, etc.)
