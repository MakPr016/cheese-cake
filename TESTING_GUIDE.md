# Testing Guide - ADB Automation

This guide will help you test the ADB automation features with your example scenarios.

## Prerequisites

Before testing, ensure:
- ✅ ADB is installed and in PATH
- ✅ Device is connected (USB or WiFi)
- ✅ USB debugging is enabled
- ✅ ADB agent is running (`npm start` in adb-agent folder)
- ✅ Expo app is running on your device

## Quick Start

Run the automated setup:
```bash
start-automation.bat
```

Or manually:
```bash
# Terminal 1: Start ADB Agent
cd adb-agent
npm start

# Terminal 2: Start Expo App
cd ..
npm start
```

## Test Scenarios

### Test 1: Open Opera and Open Instagram

**Task Input:**
```
Open Opera and open Instagram in it
```

**Expected Plan:**
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

**Expected Behavior:**
1. Opera browser opens
2. Instagram website loads

**Verification:**
- [ ] Opera browser launched
- [ ] Instagram loaded in Opera

---

### Test 2: Text Jutin on WhatsApp

**Task Input:**
```
Text Jutin on WhatsApp and ask if he is coming to the party tomorrow?
```

**Expected Plan:**
```json
[
  {
    "action": "whatsapp",
    "target": "Jutin",
    "text": "Are you coming to the party tomorrow?",
    "reasoning": "Send WhatsApp message to Jutin"
  }
]
```

**Expected Behavior:**
1. System searches contacts for "Jutin"
2. WhatsApp opens with message pre-filled
3. Message is sent (or ready to send)

**Verification:**
- [ ] Contact "Jutin" found automatically
- [ ] WhatsApp opened
- [ ] Message pre-filled correctly
- [ ] Message sent or ready to send

---

### Test 3: Call Jutin

**Task Input:**
```
Call Jutin
```

**Expected Plan:**
```json
[
  {
    "action": "call",
    "target": "Jutin",
    "reasoning": "Make phone call to Jutin"
  }
]
```

**Expected Behavior:**
1. System searches contacts for "Jutin"
2. Phone dialer opens with number
3. Call is initiated

**Verification:**
- [ ] Contact "Jutin" found automatically
- [ ] Phone dialer opened
- [ ] Call initiated

---

### Test 4: Complete Workflow

**Task Input:**
```
Open Instagram in Opera, then text Jutin on WhatsApp asking if he's coming to the party tomorrow, then call him
```

**Expected Plan:**
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
    "target": "2000",
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
    "reasoning": "Wait for message to send"
  },
  {
    "action": "call",
    "target": "Jutin",
    "reasoning": "Call Jutin"
  }
]
```

**Expected Behavior:**
1. Opera opens with Instagram
2. Waits 2 seconds
3. WhatsApp opens with message
4. Waits 2 seconds
5. Phone dialer opens for call

**Verification:**
- [ ] All steps execute in order
- [ ] Proper delays between actions
- [ ] Contact resolved correctly
- [ ] All apps opened successfully

---

## Manual Testing via API

You can test the ADB agent directly using curl or a browser:

### Check Connection
```bash
curl http://localhost:3000/status
```

### Search for Contact
```bash
curl -X POST http://localhost:3000/contacts/search ^
  -H "Content-Type: application/json" ^
  -d "{\"query\":\"Jutin\"}"
```

### Get All Contacts
```bash
curl http://localhost:3000/contacts
```

### Send WhatsApp Message
```bash
curl -X POST http://localhost:3000/whatsapp ^
  -H "Content-Type: application/json" ^
  -d "{\"contact\":\"Jutin\",\"message\":\"Test message\"}"
```

### Make Phone Call
```bash
curl -X POST http://localhost:3000/call ^
  -H "Content-Type: application/json" ^
  -d "{\"contact\":\"Jutin\"}"
```

### Open URL in Browser
```bash
curl -X POST http://localhost:3000/open-url ^
  -H "Content-Type: application/json" ^
  -d "{\"url\":\"https://instagram.com\",\"browser\":\"opera\"}"
```

### Execute Complete Plan
```bash
curl -X POST http://localhost:3000/execute-plan ^
  -H "Content-Type: application/json" ^
  -d "{\"steps\":[{\"action\":\"open_url\",\"target\":\"https://instagram.com\",\"browser\":\"opera\",\"reasoning\":\"Test\"}]}"
```

---

## Troubleshooting Tests

### Contact Not Found

**Problem:** "No contact found matching 'Jutin'"

**Solutions:**
1. Check if contact exists:
   ```bash
   curl http://localhost:3000/contacts
   ```
2. Try different name variations:
   - Full name: "Jutin Smith"
   - Partial: "Jut"
   - Case-insensitive: "jutin"
3. Add test contact on device

### WhatsApp Not Opening

**Problem:** WhatsApp doesn't open or message not pre-filled

**Solutions:**
1. Verify WhatsApp is installed
2. Check package name:
   ```bash
   adb shell pm list packages | findstr whatsapp
   ```
3. Try opening manually:
   ```bash
   adb shell am start -n com.whatsapp/.Main
   ```

### Call Not Initiating

**Problem:** Phone dialer doesn't open

**Solutions:**
1. Grant CALL_PHONE permission:
   ```bash
   adb shell pm grant com.android.phone android.permission.CALL_PHONE
   ```
2. Check if phone number is valid
3. Try with a direct number instead of name

### Opera Not Opening

**Problem:** Opera browser doesn't launch

**Solutions:**
1. Check if Opera is installed
2. Try with default browser:
   ```json
   {"action": "open_url", "target": "https://instagram.com"}
   ```
3. Install Opera from Play Store

### ADB Agent Not Responding

**Problem:** "Cannot reach ADB agent"

**Solutions:**
1. Check if agent is running:
   - Look for terminal window with "ADB Automation Agent running"
2. Restart agent:
   ```bash
   cd adb-agent
   npm start
   ```
3. Check port 3000 is not in use:
   ```bash
   netstat -ano | findstr :3000
   ```

### Device Offline

**Problem:** `adb devices` shows "offline"

**Solutions:**
1. Restart ADB:
   ```bash
   adb kill-server
   adb start-server
   adb devices
   ```
2. Reconnect device
3. Re-enable USB debugging on phone

---

## Test Checklist

Before reporting issues, verify:

- [ ] ADB installed and in PATH (`adb --version`)
- [ ] Device connected (`adb devices` shows device)
- [ ] USB debugging enabled on device
- [ ] ADB agent running (http://localhost:3000/status shows connected)
- [ ] Expo app running on device
- [ ] OpenRouter API key configured in app
- [ ] Contact "Jutin" exists on device (or use a real contact name)
- [ ] Required apps installed (WhatsApp, Opera, etc.)
- [ ] Permissions granted (CALL_PHONE, READ_CONTACTS)

---

## Voice Input Testing

You can also test using voice input:

1. Open Automation tab
2. Tap the microphone icon
3. Speak: "Text Jutin on WhatsApp and ask if he is coming to the party tomorrow"
4. Wait for transcription (AssemblyAI)
5. Confirm the text
6. Tap "Plan Task"
7. Review and execute

**Voice Test Checklist:**
- [ ] Microphone permission granted
- [ ] AssemblyAI API key configured
- [ ] Voice recorded successfully
- [ ] Transcription accurate
- [ ] Task planned correctly

---

## Performance Metrics

Track these metrics during testing:

| Metric | Target | Actual |
|--------|--------|--------|
| Contact resolution time | < 1s | |
| WhatsApp open time | < 3s | |
| Call initiation time | < 2s | |
| Browser open time | < 3s | |
| Complete workflow time | < 15s | |
| Voice transcription time | < 5s | |

---

## Test Results Template

```
Test: [Test Name]
Date: [Date]
Device: [Device Model]
Android Version: [Version]

Setup:
- ADB Version: [Version]
- Agent Running: [Yes/No]
- Device Connected: [Yes/No]

Results:
- Plan Generated: [Yes/No]
- Steps Executed: [X/Y]
- Contact Resolved: [Yes/No]
- Time Taken: [Xs]
- Success: [Yes/No]

Issues:
[List any issues encountered]

Notes:
[Additional observations]
```

---

## Next Steps After Testing

Once basic tests pass:

1. **Add more contacts** - Test with various contact names
2. **Try complex workflows** - Chain multiple actions
3. **Test error handling** - Try invalid contacts, missing apps
4. **Optimize timing** - Adjust wait times for your device
5. **Add custom actions** - Extend the ADB agent with new endpoints
6. **Test voice input** - Use voice for all scenarios
7. **Test on different devices** - Verify compatibility

---

## Reporting Issues

If you encounter issues, provide:

1. Test scenario name
2. Expected behavior
3. Actual behavior
4. ADB agent logs
5. Expo app logs
6. Device info (model, Android version)
7. Steps to reproduce

Check logs:
- **ADB Agent**: Terminal where `npm start` is running
- **Expo App**: Metro bundler terminal
- **Device**: `adb logcat`
