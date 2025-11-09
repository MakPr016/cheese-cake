# Quick Test Guide

## 🚀 Run All Tests in 3 Steps

### 1. Start ADB Agent
```bash
cd adb-agent
npm start
```
*Keep this terminal open*

### 2. Run Test Suite
Open a **new terminal**:
```bash
cd adb-agent
npm test
```

### 3. Watch the Magic ✨
Tests will automatically:
- ✅ Check connection
- ✅ Get contacts
- ✅ Search for contact
- ✅ Open Instagram in Opera
- ✅ Send WhatsApp message
- ✅ Make phone call (cancel it!)
- ✅ Run complete workflow

## 📊 Expected Output

```
🤖 ADB AUTOMATION - TEST SUITE

✅ Passed: 12
❌ Failed: 0
⏱️  Duration: 25.3s

🎉 All tests passed!
```

## ⚠️ Manual Actions Required

During tests, you'll need to:
1. **WhatsApp** - Manually tap "Send" if message doesn't auto-send
2. **Phone Call** - **Cancel the call immediately**
3. **Browser** - Verify pages load correctly

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot reach ADB agent" | Run `npm start` first |
| "Device not connected" | Run `adb devices` |
| "Contact not found" | Tests use your first contact automatically |
| Port 3000 in use | Change PORT in `server.js` |

## 📝 Test Your Own Scenarios

Edit `run-tests.js` to customize:
- Line 160: Change test contact name
- Line 170+: Add your own tests
- Line 200+: Modify workflow steps

## 🎯 What Each Test Does

1. **Connection** - Verifies ADB agent + device
2. **Get Contacts** - Lists all contacts
3. **Search Contact** - Finds contact by name
4. **Open URL** - Opens Instagram in Opera
5. **WhatsApp** - Sends test message
6. **Call** - Initiates call (cancel it!)
7. **Workflow** - Runs multi-step automation

## ⏱️ Timing

- Individual test: 1-4 seconds
- Full suite: ~25-30 seconds
- Includes delays for apps to load

## 🔧 Advanced Usage

### Test Single Endpoint
```bash
curl http://localhost:3000/status
curl http://localhost:3000/contacts
curl -X POST http://localhost:3000/contacts/search -H "Content-Type: application/json" -d "{\"query\":\"John\"}"
```

### Custom Test Contact
```javascript
// In run-tests.js, line ~160
let testContactName = 'YourContactName';
```

### Skip Certain Tests
Comment out tests in `runAllTests()` function:
```javascript
// await testCall(testContactName);  // Skip call test
```

## 📱 Device Requirements

- Android device with USB debugging
- Connected via USB or WiFi
- Screen unlocked during tests
- WhatsApp installed (for WhatsApp tests)
- Opera browser installed (for browser tests)
- At least one contact saved

## ✅ Success Criteria

All tests pass when:
- ✅ Agent responds
- ✅ Device connected
- ✅ Contacts retrieved
- ✅ Contact found by name
- ✅ Apps open correctly
- ✅ Actions execute without errors

## 📚 More Info

- Full details: `TEST_README.md`
- Setup help: `ADB_SETUP_GUIDE.md`
- Manual tests: `TESTING_GUIDE.md`
- Architecture: `AUTOMATION_README.md`

---

**Ready to test?**
```bash
cd adb-agent
npm start    # Terminal 1
npm test     # Terminal 2
```
