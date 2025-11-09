# ADB-Based Automation System

## Overview

Your Android AI Assistant now includes powerful ADB-based automation with **intelligent contact resolution**. The system can execute complex tasks on your Android device by understanding natural language commands and automatically finding contacts by name.

## Key Features

### 🎯 Intelligent Contact Resolution
- **No phone numbers needed** - Just use names like "Jutin"
- **Fuzzy matching** - Works with partial names or variations
- **Auto-discovery** - Searches device contacts automatically
- **Fallback prompts** - Asks for clarification if contact not found

### 🤖 Supported Actions

| Action | Description | Example |
|--------|-------------|---------|
| `open_url` | Open URL in specific browser | Open Instagram in Opera |
| `open_app` | Launch any installed app | Open WhatsApp |
| `whatsapp` | Send WhatsApp message | Text Jutin "Are you coming?" |
| `call` | Make phone call | Call Jutin |
| `email` | Send email | Email john@example.com |
| `tap` | Tap screen coordinates | Tap button at (500, 1000) |
| `type` | Type text | Type "Hello World" |
| `swipe` | Swipe gesture | Swipe up to scroll |
| `key` | Press hardware key | Press HOME button |
| `wait` | Delay between actions | Wait 2 seconds |

### 🎤 Voice Control
- Speak your automation tasks
- AssemblyAI transcription (configured globally)
- Works on mobile devices

### 🔄 Multi-Step Workflows
- Chain multiple actions together
- Automatic timing and delays
- Progress tracking
- Error handling

## Architecture

```
┌─────────────────┐
│   Expo App      │  (React Native on Android)
│   - Voice Input │
│   - Task Planning│
│   - UI Display  │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│  ADB Agent      │  (Node.js on Windows PC)
│  - Contact Res. │
│  - ADB Commands │
│  - Execution    │
└────────┬────────┘
         │ ADB
         ▼
┌─────────────────┐
│ Android Device  │
│  - Apps         │
│  - Contacts     │
│  - Actions      │
└─────────────────┘
```

## How It Works

1. **User Input** - You speak or type a task (e.g., "Text Jutin on WhatsApp")
2. **AI Planning** - Polaris AI breaks it into steps with contact names
3. **Contact Resolution** - ADB agent searches device contacts for "Jutin"
4. **Execution** - ADB commands execute each step on the device
5. **Feedback** - App shows progress and results

## Example Workflows

### Simple WhatsApp Message
```
Input: "Text Jutin on WhatsApp and ask if he is coming to the party tomorrow?"

Plan:
1. Search contacts for "Jutin" → finds phone number
2. Open WhatsApp with pre-filled message
3. Send message

Result: Message sent to Jutin
```

### Multi-App Workflow
```
Input: "Open Instagram in Opera, then text Jutin on WhatsApp, then call him"

Plan:
1. Open Opera browser
2. Navigate to Instagram
3. Wait 2 seconds
4. Search contacts for "Jutin"
5. Open WhatsApp with message
6. Wait 2 seconds
7. Search contacts for "Jutin"
8. Initiate phone call

Result: All actions completed in sequence
```

### Browser Automation
```
Input: "Open Opera and open Instagram in it"

Plan:
1. Open Opera browser
2. Navigate to https://instagram.com

Result: Instagram loaded in Opera
```

## Files Structure

```
Expo-1/
├── adb-agent/                    # ADB automation server
│   ├── server.js                 # Main server with contact resolution
│   ├── package.json              # Dependencies
│   └── README.md                 # Setup instructions
│
├── src/
│   ├── services/
│   │   ├── PolarisService.ts     # AI planning (updated for ADB)
│   │   ├── AdbService.ts         # ADB communication (NEW)
│   │   └── ...
│   └── types/
│       └── index.ts              # Updated with new action types
│
├── app/
│   ├── automation.tsx            # Automation UI (updated)
│   └── ...
│
├── app.json                      # AssemblyAI key configured
├── start-automation.bat          # Quick start script
├── ADB_SETUP_GUIDE.md           # Detailed setup instructions
├── TESTING_GUIDE.md             # Testing scenarios
└── AUTOMATION_README.md         # This file
```

## Quick Start

### 1. One-Time Setup (5 minutes)

```bash
# Install ADB (if not already installed)
# Download from: https://developer.android.com/studio/releases/platform-tools
# Add to PATH

# Enable USB debugging on phone
# Settings → About → Tap Build Number 7 times
# Settings → Developer Options → Enable USB Debugging

# Connect device
adb devices

# Install agent dependencies
cd adb-agent
npm install
```

### 2. Daily Usage

```bash
# Run the quick start script
start-automation.bat

# Or manually:
# Terminal 1: Start ADB Agent
cd adb-agent
npm start

# Terminal 2: Start Expo App
cd ..
npm start
```

### 3. Use the App

1. Open app on your phone
2. Go to **Automation** tab
3. Enter task: "Text Jutin on WhatsApp and ask if he is coming to the party tomorrow?"
4. Tap **Plan Task**
5. Review the generated steps
6. Tap **Execute**
7. Watch the automation run!

## Configuration

### AssemblyAI API Key
Already configured in `app.json`:
```json
{
  "expo": {
    "extra": {
      "ASSEMBLYAI_API_KEY": "05a93f2d0f8342c48fd077353b449eb9"
    }
  }
}
```

### ADB Agent URL
Default: `http://localhost:3000`

To change, edit `src/services/AdbService.ts`:
```typescript
constructor(baseUrl: string = 'http://localhost:3000') {
```

### Contact Matching
Fuzzy matching is enabled by default. Contacts are matched case-insensitively with partial name matching.

## API Reference

### ADB Agent Endpoints

#### Check Connection
```
GET /status
Response: { connected: boolean, message: string }
```

#### Search Contact
```
POST /contacts/search
Body: { query: "Jutin" }
Response: { success: boolean, contact: { name, number }, suggestions: [] }
```

#### Get All Contacts
```
GET /contacts
Response: { success: boolean, contacts: [{ name, number }] }
```

#### Send WhatsApp Message
```
POST /whatsapp
Body: { contact: "Jutin", message: "Hello!" }
Response: { success: boolean, resolvedNumber: string }
```

#### Make Phone Call
```
POST /call
Body: { contact: "Jutin" }
Response: { success: boolean, resolvedNumber: string }
```

#### Execute Plan
```
POST /execute-plan
Body: { steps: [...] }
Response: { success: boolean, results: [...] }
```

## Troubleshooting

### Common Issues

**Device not found**
```bash
adb kill-server
adb start-server
adb devices
```

**Contact not found**
- Ensure contact exists on device
- Try full name or partial match
- Check: `curl http://localhost:3000/contacts`

**ADB agent not responding**
- Restart: `npm start` in adb-agent folder
- Check: http://localhost:3000/status

**WhatsApp not sending**
- Tap coordinates may need adjustment for your device
- Use UI dump to find exact coordinates
- Manual send may be required (auto-send is best-effort)

## Security & Privacy

- ✅ Runs locally on your PC and device
- ✅ No data sent to external servers (except AI API)
- ✅ AssemblyAI key is shared (for transcription only)
- ✅ OpenRouter key is user-specific (stored locally)
- ⚠️ Never expose ADB agent to the internet
- ⚠️ Only use on devices you own
- ⚠️ Be careful with automated calls/messages

## Limitations

- Requires PC with ADB agent running
- Device must be connected (USB or WiFi)
- Some apps may block automation
- WhatsApp auto-send may require manual confirmation
- Coordinates may vary by device/screen size
- Contact matching requires synced contacts

## Future Enhancements

Potential improvements:
- [ ] Bluetooth ADB connection
- [ ] OCR for screen reading
- [ ] Computer vision for UI element detection
- [ ] More app-specific integrations
- [ ] Scheduling and recurring tasks
- [ ] Multi-device support
- [ ] Cloud-based agent (optional)

## Support

For issues or questions:
1. Check `ADB_SETUP_GUIDE.md` for setup help
2. Check `TESTING_GUIDE.md` for test scenarios
3. Review ADB agent logs
4. Review Expo app logs
5. Check `adb-agent/README.md` for API details

## Credits

- **ADB** - Android Debug Bridge by Google
- **AssemblyAI** - Speech-to-text transcription
- **OpenRouter** - AI model routing (Polaris Alpha)
- **Expo** - React Native framework
- **Node.js** - ADB agent runtime

## License

This automation system is part of your Android AI Assistant project.
Use responsibly and in accordance with app terms of service.
