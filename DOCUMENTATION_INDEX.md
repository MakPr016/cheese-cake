# Documentation Index

Complete guide to all documentation files for the ADB Automation System.

## 🚀 Quick Start

**New to the project?** Start here:
1. [`ADB_SETUP_GUIDE.md`](ADB_SETUP_GUIDE.md) - Setup ADB and connect device
2. [`AUTOMATION_README.md`](AUTOMATION_README.md) - System overview
3. [`QUICK_TEST_GUIDE.md`](QUICK_TEST_GUIDE.md) - Run tests in 3 steps

## 📚 Documentation Files

### Setup & Configuration
| File | Description |
|------|-------------|
| [`ADB_SETUP_GUIDE.md`](ADB_SETUP_GUIDE.md) | Complete setup instructions for ADB, device, and agent |
| [`adb-agent/README.md`](adb-agent/README.md) | ADB agent API reference and setup |
| [`start-automation.bat`](start-automation.bat) | Quick start script for Windows |

### System Overview
| File | Description |
|------|-------------|
| [`AUTOMATION_README.md`](AUTOMATION_README.md) | Architecture, features, and how it works |
| [`README.md`](README.md) | Main project README |

### Testing
| File | Description |
|------|-------------|
| [`QUICK_TEST_GUIDE.md`](QUICK_TEST_GUIDE.md) | Run tests in 3 steps - quickest way to test |
| [`TEST_EXECUTION_SUMMARY.md`](TEST_EXECUTION_SUMMARY.md) | What was created and how to use the test suite |
| [`adb-agent/TEST_README.md`](adb-agent/TEST_README.md) | Complete test documentation with examples |
| [`adb-agent/TESTS_SUMMARY.txt`](adb-agent/TESTS_SUMMARY.txt) | Quick reference card for tests |
| [`TESTING_GUIDE.md`](TESTING_GUIDE.md) | Manual testing scenarios and troubleshooting |

### Reference
| File | Description |
|------|-------------|
| [`adb-agent/run-tests.js`](adb-agent/run-tests.js) | Test suite source code |
| [`adb-agent/run-tests.bat`](adb-agent/run-tests.bat) | Windows test runner |
| [`adb-agent/server.js`](adb-agent/server.js) | ADB agent server source |

## 🎯 By Task

### I want to...

#### Set up the system
1. Read [`ADB_SETUP_GUIDE.md`](ADB_SETUP_GUIDE.md)
2. Follow step-by-step instructions
3. Run `start-automation.bat`

#### Understand how it works
1. Read [`AUTOMATION_README.md`](AUTOMATION_README.md)
2. Check architecture diagrams
3. Review example workflows

#### Run tests
1. Read [`QUICK_TEST_GUIDE.md`](QUICK_TEST_GUIDE.md)
2. Run `npm test` in adb-agent folder
3. Check [`TEST_EXECUTION_SUMMARY.md`](TEST_EXECUTION_SUMMARY.md) for details

#### Troubleshoot issues
1. Check [`TESTING_GUIDE.md`](TESTING_GUIDE.md) - Troubleshooting section
2. Review [`ADB_SETUP_GUIDE.md`](ADB_SETUP_GUIDE.md) - Troubleshooting
3. Check [`adb-agent/TEST_README.md`](adb-agent/TEST_README.md) - Debugging

#### Customize automation
1. Edit [`adb-agent/server.js`](adb-agent/server.js) - Add endpoints
2. Edit [`src/services/PolarisService.ts`](src/services/PolarisService.ts) - Modify AI planning
3. Edit [`adb-agent/run-tests.js`](adb-agent/run-tests.js) - Add tests

#### Use the API
1. Read [`adb-agent/README.md`](adb-agent/README.md) - API endpoints
2. Check examples in [`AUTOMATION_README.md`](AUTOMATION_README.md)
3. Test with curl commands

## 📖 Reading Order

### For Beginners
1. [`AUTOMATION_README.md`](AUTOMATION_README.md) - Understand what it does
2. [`ADB_SETUP_GUIDE.md`](ADB_SETUP_GUIDE.md) - Set it up
3. [`QUICK_TEST_GUIDE.md`](QUICK_TEST_GUIDE.md) - Test it
4. [`TESTING_GUIDE.md`](TESTING_GUIDE.md) - Learn more

### For Developers
1. [`AUTOMATION_README.md`](AUTOMATION_README.md) - Architecture
2. [`adb-agent/README.md`](adb-agent/README.md) - API reference
3. [`adb-agent/server.js`](adb-agent/server.js) - Source code
4. [`adb-agent/TEST_README.md`](adb-agent/TEST_README.md) - Testing

### For Testers
1. [`QUICK_TEST_GUIDE.md`](QUICK_TEST_GUIDE.md) - Quick start
2. [`TEST_EXECUTION_SUMMARY.md`](TEST_EXECUTION_SUMMARY.md) - What to expect
3. [`adb-agent/TEST_README.md`](adb-agent/TEST_README.md) - Detailed tests
4. [`TESTING_GUIDE.md`](TESTING_GUIDE.md) - Manual scenarios

## 🔍 Quick Reference

### Commands
```bash
# Setup
cd adb-agent
npm install

# Start agent
npm start

# Run tests
npm test

# Check connection
adb devices
```

### URLs
- Agent: http://localhost:3000
- Status: http://localhost:3000/status
- Contacts: http://localhost:3000/contacts

### Key Files
- Server: `adb-agent/server.js`
- Tests: `adb-agent/run-tests.js`
- Service: `src/services/AdbService.ts`
- Planning: `src/services/PolarisService.ts`

## 📊 File Sizes & Complexity

| File | Lines | Complexity | Read Time |
|------|-------|------------|-----------|
| `ADB_SETUP_GUIDE.md` | ~400 | Easy | 10 min |
| `AUTOMATION_README.md` | ~500 | Medium | 15 min |
| `QUICK_TEST_GUIDE.md` | ~150 | Easy | 3 min |
| `TEST_EXECUTION_SUMMARY.md` | ~400 | Easy | 8 min |
| `adb-agent/TEST_README.md` | ~600 | Medium | 15 min |
| `TESTING_GUIDE.md` | ~800 | Medium | 20 min |
| `adb-agent/README.md` | ~300 | Easy | 8 min |

## 🎓 Learning Path

### Day 1: Setup & Basics
- [ ] Read `AUTOMATION_README.md`
- [ ] Follow `ADB_SETUP_GUIDE.md`
- [ ] Run `start-automation.bat`
- [ ] Test with `QUICK_TEST_GUIDE.md`

### Day 2: Testing & Usage
- [ ] Read `TEST_EXECUTION_SUMMARY.md`
- [ ] Run full test suite
- [ ] Try manual scenarios from `TESTING_GUIDE.md`
- [ ] Test your own automation tasks

### Day 3: Customization
- [ ] Review `adb-agent/server.js`
- [ ] Read API docs in `adb-agent/README.md`
- [ ] Add custom endpoints
- [ ] Create custom tests

## 🆘 Help & Support

### Common Issues
1. **Device not connecting** → [`ADB_SETUP_GUIDE.md`](ADB_SETUP_GUIDE.md#troubleshooting)
2. **Tests failing** → [`adb-agent/TEST_README.md`](adb-agent/TEST_README.md#troubleshooting)
3. **Contact not found** → [`TESTING_GUIDE.md`](TESTING_GUIDE.md#contact-not-found)
4. **WhatsApp not working** → [`TESTING_GUIDE.md`](TESTING_GUIDE.md#whatsapp-not-opening)

### Where to Look
- **Setup problems** → `ADB_SETUP_GUIDE.md`
- **Test problems** → `adb-agent/TEST_README.md`
- **API questions** → `adb-agent/README.md`
- **How it works** → `AUTOMATION_README.md`

## 📝 Notes

- All documentation is in Markdown format
- Code examples use bash/PowerShell syntax
- Port 3000 is used throughout (changed from 3000)
- AssemblyAI key is configured in `app.json`
- OpenRouter key is user-specific (stored locally)

## 🔄 Updates

This documentation was created for:
- **Project:** Android AI Assistant with ADB Automation
- **Date:** November 2025
- **Version:** 1.0.0
- **Port:** 3000 (changed from 3000)

## ✨ Quick Links

**Most Important Files:**
1. 🚀 [`QUICK_TEST_GUIDE.md`](QUICK_TEST_GUIDE.md) - Start here for testing
2. 📖 [`AUTOMATION_README.md`](AUTOMATION_README.md) - Understand the system
3. ⚙️ [`ADB_SETUP_GUIDE.md`](ADB_SETUP_GUIDE.md) - Set everything up
4. 🧪 [`TEST_EXECUTION_SUMMARY.md`](TEST_EXECUTION_SUMMARY.md) - Test suite overview

**For Quick Reference:**
- [`adb-agent/TESTS_SUMMARY.txt`](adb-agent/TESTS_SUMMARY.txt) - One-page test reference
- [`start-automation.bat`](start-automation.bat) - One-click startup

---

**Need help?** Start with the file that matches your current task from the "I want to..." section above.
