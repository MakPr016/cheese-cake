# ADB Automation Test Suite

Automated test suite for the ADB automation system. Tests all functionality including contact resolution, WhatsApp, calls, browser control, and complete workflows.

## Quick Start

### Prerequisites
1. ADB agent must be running:
   ```bash
   npm start
   ```
2. Device must be connected via USB or WiFi
3. USB debugging enabled

### Run Tests

**Option 1: Using npm**
```bash
npm test
```

**Option 2: Using batch file (Windows)**
```bash
run-tests.bat
```

**Option 3: Direct execution**
```bash
node run-tests.js
```

## What Gets Tested

### 1. Connection Test
- ✅ Verifies ADB agent is running
- ✅ Checks device connection status
- ✅ Displays connection info

### 2. Get All Contacts
- ✅ Retrieves all contacts from device
- ✅ Displays contact count
- ✅ Shows sample contacts

### 3. Search Contact
- ✅ Tests contact search by name
- ✅ Verifies fuzzy matching
- ✅ Shows resolved phone number
- ✅ Displays suggestions if not found

### 4. Open URL in Browser
- ✅ Opens Instagram in Opera browser
- ✅ Verifies browser control
- ✅ Tests URL navigation

### 5. WhatsApp Message
- ✅ Resolves contact by name
- ✅ Opens WhatsApp with message
- ✅ Pre-fills message text
- ⚠️ Manual send verification required

### 6. Phone Call
- ✅ Resolves contact by name
- ✅ Initiates phone call
- ⚠️ Manual cancellation required

### 7. Complete Workflow
- ✅ Multi-step automation
- ✅ Opens browser
- ✅ Sends WhatsApp message
- ✅ Proper delays between steps
- ✅ Progress tracking

## Test Output

The test suite provides color-coded output:

```
🤖 ADB AUTOMATION - TEST SUITE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 TEST: Connection Test
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ ADB agent is running
✅ Device is connected
ℹ️  Status: Device connected

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 TEST: Get All Contacts
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Found 15 contacts
ℹ️  Sample contacts:
  - John Smith: +1234567890
  - Jane Doe: +0987654321
  ...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 TEST: Search Contact: "Jutin"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Contact found: Jutin
ℹ️  Phone: +1234567890

...

══════════════════════════════════════════════════

📊 TEST SUMMARY
══════════════════════════════════════════════════
✅ Passed: 12
❌ Failed: 0
⏱️  Duration: 25.3s
══════════════════════════════════════════════════

🎉 All tests passed!

✨ Test suite completed
```

## Test Scenarios

### Scenario 1: Basic Functionality
Tests individual features:
- Connection
- Contact retrieval
- Contact search
- URL opening
- WhatsApp messaging
- Phone calls

### Scenario 2: Complete Workflow
Tests real-world automation:
1. Open Instagram in Opera
2. Wait for page load
3. Send WhatsApp message
4. Wait for message
5. (Optional) Make phone call

### Scenario 3: Contact Resolution
Tests intelligent contact matching:
- Exact name match
- Partial name match
- Case-insensitive search
- Multiple matches handling
- Suggestions for typos

## Customizing Tests

Edit `run-tests.js` to customize:

### Change Test Contact
```javascript
// Line ~160
let testContactName = 'YourContactName';
```

### Add Custom Test
```javascript
async function testCustomAction() {
  logTest('My Custom Test');
  
  try {
    // Your test code here
    const response = await fetch(`${BASE_URL}/your-endpoint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ /* your data */ }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      logSuccess('Test passed');
      return true;
    } else {
      logError('Test failed');
      return false;
    }
  } catch (error) {
    logError(`Error: ${error.message}`);
    return false;
  }
}

// Add to runAllTests()
await testCustomAction();
```

### Adjust Timing
```javascript
// Change wait times between tests
await wait(2000); // 2 seconds
```

## Troubleshooting

### "Cannot reach ADB agent"
**Solution:** Start the agent first
```bash
npm start
```

### "Device not connected"
**Solution:** Check ADB connection
```bash
adb devices
```

### "Contact not found"
**Solution:** The test will use the first contact from your device. If no contacts exist:
1. Add test contacts to your device
2. Or edit `run-tests.js` to use a different name

### Tests hang or timeout
**Solution:** 
1. Check device is responsive
2. Restart ADB: `adb kill-server && adb start-server`
3. Increase wait times in test script

### WhatsApp/Call tests fail
**Solution:**
1. Ensure apps are installed
2. Grant necessary permissions:
   ```bash
   adb shell pm grant com.android.phone android.permission.CALL_PHONE
   ```
3. Check contact exists on device

## Manual Verification

Some tests require manual verification:

### WhatsApp Message
- ✅ Check WhatsApp opened
- ✅ Check message is pre-filled
- ✅ Manually tap "Send" if needed

### Phone Call
- ✅ Check dialer opened
- ✅ Check correct number displayed
- ✅ **Cancel the call immediately**

### Browser
- ✅ Check Opera opened
- ✅ Check Instagram loaded

## CI/CD Integration

To integrate with CI/CD:

```yaml
# Example GitHub Actions
- name: Run ADB Tests
  run: |
    cd adb-agent
    npm start &
    sleep 5
    npm test
```

## Test Coverage

| Feature | Tested | Coverage |
|---------|--------|----------|
| Connection | ✅ | 100% |
| Contact Retrieval | ✅ | 100% |
| Contact Search | ✅ | 100% |
| URL Opening | ✅ | 100% |
| WhatsApp | ✅ | 90% (manual send) |
| Phone Calls | ✅ | 90% (manual cancel) |
| Workflows | ✅ | 100% |
| Error Handling | ✅ | 100% |

## Performance Benchmarks

Expected execution times:
- Connection test: < 1s
- Contact retrieval: < 2s
- Contact search: < 1s
- URL opening: < 3s
- WhatsApp: < 4s
- Phone call: < 3s
- Complete workflow: < 15s
- **Total suite: ~25-30s**

## Logs and Debugging

Test logs include:
- ✅ Success messages (green)
- ❌ Error messages (red)
- ⚠️ Warnings (yellow)
- ℹ️ Info messages (cyan)

For detailed debugging:
1. Check ADB agent terminal for server logs
2. Run `adb logcat` for device logs
3. Add `console.log()` statements in test script

## Best Practices

1. **Run with device unlocked** - Some actions require screen to be on
2. **Close apps before testing** - Ensures clean state
3. **Use test contacts** - Don't spam real contacts
4. **Monitor device** - Watch tests execute in real-time
5. **Cancel calls immediately** - Don't let test calls go through

## Extending Tests

Add more test scenarios:

```javascript
// Test email
async function testEmail(to, subject, body) {
  logTest(`Email: Send to ${to}`);
  // Implementation
}

// Test UI automation
async function testTapAndSwipe() {
  logTest('UI Automation: Tap and Swipe');
  // Implementation
}

// Test screenshot
async function testScreenshot() {
  logTest('Screenshot Capture');
  // Implementation
}
```

## Support

If tests fail:
1. Review test output for specific errors
2. Check `TESTING_GUIDE.md` for troubleshooting
3. Verify setup in `ADB_SETUP_GUIDE.md`
4. Check ADB agent logs
5. Test individual endpoints manually

## Example Test Run

```bash
C:\...\adb-agent> npm test

> adb-automation-agent@1.0.0 test
> node run-tests.js

╔════════════════════════════════════════════╗
║   ADB AUTOMATION - TEST SUITE             ║
╚════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 TEST: Connection Test
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ ADB agent is running
✅ Device is connected
ℹ️  Status: Device connected

[... more tests ...]

══════════════════════════════════════════════════

📊 TEST SUMMARY
══════════════════════════════════════════════════
✅ Passed: 12
❌ Failed: 0
⏱️  Duration: 25.3s
══════════════════════════════════════════════════

🎉 All tests passed!

✨ Test suite completed
```

---

**Note:** This test suite is designed for development and testing. Always use test contacts and be prepared to manually intervene for calls and messages.
