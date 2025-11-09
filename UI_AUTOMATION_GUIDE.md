# UI Automation Guide

## Why Apps Open But Don't Perform Actions

The automation **opens apps correctly** using Android intents, but **UI interactions** (tapping buttons, typing text) require exact screen coordinates that vary by:
- Device model
- Screen size/resolution
- App version
- Android version

## Solution: Calibrate Your Device

### Quick Fix: Use the Calibration Tool

```bash
cd adb-agent

# 1. Calibrate WhatsApp send button
node calibrate.js whatsapp

# 2. Take a screenshot to find coordinates manually
node calibrate.js screenshot

# 3. Test specific coordinates
node calibrate.js tap 950 1850
```

### Manual Calibration Steps

#### For WhatsApp:

1. **Open WhatsApp** on your device
2. **Open any chat**
3. **Type a test message** (don't send)
4. **Run calibration:**
   ```bash
   node calibrate.js whatsapp
   ```
5. **Press Enter** when prompted
6. Check the output for coordinates
7. Open `screenshot.png` to verify button location

#### Find Coordinates Manually:

1. **Take screenshot:**
   ```bash
   node calibrate.js screenshot
   ```

2. **Open screenshot.png** in an image editor

3. **Hover over the send button** to see coordinates

4. **Note the X,Y position**

5. **Test the coordinates:**
   ```bash
   # Open WhatsApp with a message first, then:
   node calibrate.js tap X Y
   ```

## Current Implementation

The server now **automatically calculates** send button position based on screen size:

```javascript
// Send button is typically at bottom-right
const sendX = Math.floor(width * 0.9);  // 90% from left
const sendY = Math.floor(height * 0.95); // 95% from top
```

This works for most devices, but you can fine-tune if needed.

## Better Approach: Use Intents Only

For more reliable automation, use Android intents that don't require tapping:

### WhatsApp (Intent Only - No Tapping)

The message opens in WhatsApp, **user taps send manually**:
```javascript
// This is what currently happens
am start -a android.intent.action.SENDTO -d "whatsapp://send?phone=XXX&text=YYY"
```

**Pros:** ✅ Always works, no calibration needed
**Cons:** ⚠️ User must tap send button

### Alternative: Use Accessibility Service

For fully automated sending, you'd need to:
1. Create an Android Accessibility Service
2. Install it on the device
3. Grant accessibility permissions
4. Use it to find and tap buttons programmatically

This is more complex but more reliable.

## Testing Your Calibration

### Test WhatsApp Automation:

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Send a test message via API:**
   ```bash
   curl -X POST http://localhost:3000/whatsapp ^
     -H "Content-Type: application/json" ^
     -D "{\"contact\":\"YourContact\",\"message\":\"Test message\"}"
   ```

3. **Watch your device:**
   - WhatsApp should open ✅
   - Message should be pre-filled ✅
   - Send button should be tapped automatically ✅ (if calibrated correctly)

### If Send Button Doesn't Get Tapped:

**Option 1: Adjust the percentage**

Edit `server.js` line ~218-219:
```javascript
const sendX = Math.floor(width * 0.92);  // Try 0.92 instead of 0.9
const sendY = Math.floor(height * 0.96); // Try 0.96 instead of 0.95
```

**Option 2: Use exact coordinates**

After calibration, hardcode the exact coordinates:
```javascript
// Replace the calculation with your exact coordinates
const sendX = 1050;  // Your X coordinate
const sendY = 2100;  // Your Y coordinate
```

**Option 3: Manual send (simplest)**

Just let the user tap send - the message is already typed!

## Device-Specific Coordinates

Common devices and their typical send button positions:

| Device | Resolution | Send Button (X, Y) |
|--------|-----------|-------------------|
| Pixel 5 | 1080x2340 | (972, 2223) |
| Samsung S21 | 1080x2400 | (972, 2280) |
| OnePlus 9 | 1080x2400 | (972, 2280) |
| Generic HD | 1080x1920 | (972, 1824) |

**Your device (ZD222JRBJP):** Run calibration to find exact coordinates!

## Recommended Workflow

### For Development/Testing:
1. Use intents to open apps ✅
2. Pre-fill messages ✅
3. Let user tap send manually ⚠️

### For Production:
1. Calibrate once per device
2. Save coordinates in config
3. Fully automated ✅

## Advanced: UI Automator

For more reliable automation, use Android's UI Automator:

```bash
# Find elements by text
adb shell uiautomator dump
adb shell cat /sdcard/window_dump.xml

# Find send button
grep -i "send" /sdcard/window_dump.xml
```

Then extract bounds and calculate center point.

## Quick Commands

```bash
# Get screen size
adb shell wm size

# Take screenshot
adb shell screencap -p /sdcard/screen.png
adb pull /sdcard/screen.png

# Get UI hierarchy
adb shell uiautomator dump
adb shell cat /sdcard/window_dump.xml

# Tap at coordinates
adb shell input tap X Y

# Type text
adb shell input text "Hello"

# Press enter
adb shell input keyevent 66
```

## Summary

**Current Status:**
- ✅ Apps open correctly
- ✅ Messages are pre-filled
- ⚠️ Send button tap needs calibration

**Next Steps:**
1. Run `node calibrate.js whatsapp`
2. Find your device's send button coordinates
3. Update server.js if needed
4. Test again!

**Or:** Just let users tap send manually (simplest solution) 😊
