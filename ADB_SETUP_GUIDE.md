# ADB Automation Setup Guide

This guide will help you set up ADB-based automation for your Android AI Assistant app.

## What You'll Get

With ADB automation, your app can:
- ✅ **Auto-resolve contacts** - Just say "Call Jutin" without needing phone numbers
- ✅ **Open apps and URLs** - "Open Instagram in Opera browser"
- ✅ **Send WhatsApp messages** - Automatically find contacts and send messages
- ✅ **Make phone calls** - Call contacts by name
- ✅ **Control UI** - Tap, swipe, type, and navigate apps
- ✅ **Complex workflows** - Chain multiple actions together

## Example Tasks

1. **"Open Opera and open Instagram in it"**
   - Opens Opera browser
   - Navigates to Instagram

2. **"Text Jutin on WhatsApp and ask if he is coming to the party tomorrow?"**
   - Finds "Jutin" in your contacts
   - Opens WhatsApp
   - Sends the message

3. **"Call Jutin"**
   - Finds "Jutin" in your contacts
   - Initiates a phone call

## Setup Steps

### 1. Install ADB (Android Debug Bridge)

**Windows:**
1. Download [Android SDK Platform Tools](https://developer.android.com/studio/releases/platform-tools)
2. Extract to `C:\adb\`
3. Add to PATH:
   - Press `Win + X` → System → Advanced system settings
   - Click "Environment Variables"
   - Under "System variables", find "Path" and click "Edit"
   - Click "New" and add: `C:\adb\platform-tools`
   - Click OK on all dialogs

**Verify installation:**
```bash
adb --version
```

### 2. Enable USB Debugging on Your Android Device

1. Go to **Settings** → **About Phone**
2. Tap **Build Number** 7 times (you'll see "You are now a developer!")
3. Go back to **Settings** → **Developer Options**
4. Enable **USB Debugging**
5. Enable **Install via USB** (if available)

### 3. Connect Your Device

**Via USB (Recommended for first setup):**
1. Connect your phone to PC via USB cable
2. Open Command Prompt/PowerShell
3. Run: `adb devices`
4. On your phone, accept the "Allow USB debugging?" prompt
5. Check the "Always allow from this computer" box
6. Tap "Allow"

You should see your device listed:
```
List of devices attached
ABC123XYZ    device
```

**Via WiFi (Optional, after USB setup):**
1. First connect via USB and ensure it works
2. Find your phone's IP address: Settings → About → Status → IP address
3. Run:
   ```bash
   adb tcpip 5555
   adb connect <YOUR_PHONE_IP>:5555
   ```
4. You can now disconnect the USB cable

### 4. Grant Required Permissions

Run these commands to grant necessary permissions:

```bash
# Allow making phone calls
adb shell pm grant com.android.phone android.permission.CALL_PHONE

# Allow reading contacts (for auto-resolution)
adb shell pm grant com.android.contacts android.permission.READ_CONTACTS
```

### 5. Install ADB Agent Dependencies

1. Open Command Prompt/PowerShell
2. Navigate to the adb-agent folder:
   ```bash
   cd C:\Users\makpr\Downloads\Expo-1\Expo-1\adb-agent
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### 6. Start the ADB Agent

In the adb-agent folder, run:
```bash
npm start
```

You should see:
```
🤖 ADB Automation Agent running on http://localhost:3000

Make sure:
1. ADB is installed and in PATH
2. Device is connected via USB or WiFi
3. USB debugging is enabled

Test connection: http://localhost:3000/status
```

### 7. Test the Connection

Open a browser and go to: http://localhost:3000/status

You should see:
```json
{
  "connected": true,
  "message": "Device connected"
}
```

### 8. Start Your Expo App

In a new terminal:
```bash
cd C:\Users\makpr\Downloads\Expo-1\Expo-1
npm start
```

## Using the Automation Feature

1. Open the app on your phone
2. Go to the **Automation** tab
3. Enter a task like: "Text Jutin on WhatsApp and ask if he is coming to the party tomorrow?"
4. Tap **Plan Task**
5. Review the generated steps
6. Tap **Execute** to run the automation

## Troubleshooting

### "Device not found" or "offline"
```bash
adb kill-server
adb start-server
adb devices
```

### "ADB Agent Required" alert in app
- Make sure the ADB agent is running: `npm start` in the adb-agent folder
- Check that it's accessible: http://localhost:3000/status

### Contact not found
- Ensure your contacts are synced on the device
- Try using the full name or a partial match
- Check available contacts: http://localhost:3000/contacts

### WhatsApp message not sending
- The app opens WhatsApp with the message pre-filled
- You may need to manually tap "Send" (auto-send coordinates may vary by device)
- To find exact coordinates, use: http://localhost:3000/ui-dump

### Permission denied errors
Grant the specific permission:
```bash
adb shell pm grant <package_name> <permission>
```

## Advanced Usage

### Custom Actions

You can add custom actions to the ADB agent server. Edit `adb-agent/server.js` and add new endpoints.

### UI Automation

For precise UI control:
1. Get UI dump: http://localhost:3000/ui-dump
2. Find element coordinates
3. Use tap/swipe actions with those coordinates

### Screenshots

Take a screenshot: http://localhost:3000/screenshot

## Security Notes

⚠️ **Important:**
- The ADB agent runs locally on your PC
- Never expose it to the internet
- Only use on devices you own
- Be careful with automated actions (calls, messages, etc.)
- The AssemblyAI API key is embedded in the app for transcription

## Package Names for Common Apps

Use these with the `open_app` action:
- WhatsApp: `com.whatsapp`
- Instagram: `com.instagram.android`
- Chrome: `com.android.chrome`
- Opera: `com.opera.browser`
- Gmail: `com.google.android.gm`
- Phone: `com.android.phone`

## Need Help?

1. Check the ADB agent logs in the terminal
2. Check the Expo app logs
3. Verify device connection: `adb devices`
4. Test ADB agent: http://localhost:3000/status
5. Review the README in the adb-agent folder

## Example Automation Plans

### Send a WhatsApp message
```json
[
  {
    "action": "whatsapp",
    "target": "Jutin",
    "text": "Hey! Are you coming to the party tomorrow?",
    "reasoning": "Message Jutin on WhatsApp"
  }
]
```

### Open Instagram in Opera
```json
[
  {
    "action": "open_url",
    "target": "https://instagram.com",
    "browser": "opera",
    "reasoning": "Open Instagram in Opera browser"
  }
]
```

### Complete workflow
```json
[
  {
    "action": "open_url",
    "target": "https://instagram.com",
    "browser": "opera",
    "reasoning": "Open Instagram in Opera"
  },
  {
    "action": "wait",
    "target": "3000",
    "reasoning": "Wait for page to load"
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
    "reasoning": "Wait for WhatsApp to send"
  },
  {
    "action": "call",
    "target": "Jutin",
    "reasoning": "Call Jutin"
  }
]
```
