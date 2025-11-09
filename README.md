# Android AI Assistant with ADB Automation

## Project Overview

This is a React Native mobile application built with Expo that provides an AI-powered assistant with two primary modes: **Chat Mode** for conversational Q&A and **Automation Mode** for task execution planning and real-world automation on Android devices. The app understands natural language commands and can automatically execute complex tasks like sending WhatsApp messages, making calls, opening apps, and controlling the device through ADB (Android Debug Bridge).

### Core Features

- **Intelligent Contact Resolution**: No phone numbers needed - use names like "Jutin" with fuzzy matching
- **Voice Control**: Cross-platform voice input with transcription powered by AssemblyAI and Whisper
- **Multi-Step Workflows**: Chain multiple actions together with automatic timing and delays
- **Unlimited Chat History**: Semantic search through vector storage using Supabase and pgvector
- **Real Automation**: Execute tasks via ADB commands on connected Android devices

---

## 📱 App Screenshots

<div align="center">

### Main Interface
<img src="https://github.com/user-attachments/assets/c96c9796-cf15-478a-978c-871664651b1a" width="250" alt="Mobile App Home Screen"/>

*Your AI-powered mobile assistant*

---

### API Configuration
<img src="https://github.com/user-attachments/assets/890a29f5-ce61-488e-97f2-ddf141a7cce0" width="250" alt="API Setup Screen"/>

*Add your OpenRouter API key to get started*

---

### Feature Overview
<img src="https://github.com/user-attachments/assets/5d0d12bb-d053-4ecc-8f12-92ddd1a4f197" width="250" alt="Features Screen"/>

*Explore all available automation options*

---

### Automated Messaging
<img src="https://github.com/user-attachments/assets/e69a8a45-d16e-486e-b2f5-74da56fb85b2" width="250" alt="WhatsApp Automation"/>

*Send WhatsApp messages automatically through the app*

---

### Voice Control
<img src="https://github.com/user-attachments/assets/b5bdf694-99ba-4df8-88f5-4c0daf9e1965" width="250" alt="Voice Input"/>

*Speak naturally with the AI assistant*

---

### Automation Setup
<img src="https://github.com/user-attachments/assets/a2639772-663b-4ef6-b09e-56feda8c32f9" width="250" alt="Automation Configuration"/>

*Set up automation workflows for hands-free experience*

---

### Automation Results
<img src="https://github.com/user-attachments/assets/5a34c2f8-3704-4c8e-8a63-3cd910795b26" width="250" alt="Automation Success"/>

*See your automation tasks execute successfully*

</div>

---

## Market Analysis

### Target Users

- Android power users seeking productivity automation
- Developers testing mobile applications
- Accessibility-focused users requiring hands-free control
- Productivity enthusiasts automating repetitive tasks

### Use Cases

- **Hands-Free Device Control**: Voice commands for messaging and calls
- **Automated Messaging Workflows**: Send WhatsApp messages by name without typing numbers
- **Multi-App Task Automation**: Chain tasks across multiple applications
- **Accessibility Assistance**: Voice-driven device interaction

### Competitive Advantages

| Feature | Benefit |
|---------|---------|
| Free AI Model | Uses OpenRouter's Polaris Alpha (256K context, free tier) |
| Contact Resolution | Fuzzy matching finds contacts automatically |
| Cross-Platform Voice | Works on web, iOS, and Android |
| Vector Search | Unlimited chat history with semantic search |
| No Root Required | ADB-based automation without rooting device |

---

## Tech Stack

### Frontend Technologies

#### Framework & Core
- **React Native**: 0.81.4 - Core mobile UI framework
- **Expo SDK**: 54.0.9 - Cross-platform development framework
- **React**: 19.1.0 - JavaScript UI library
- **TypeScript**: 5.9.2 - Type-safe development

#### Navigation
- **Expo Router**: 6.0.7 - File-based routing with typed routes
- **React Navigation Native**: 7.1.6 - Navigation library
- **React Navigation Bottom Tabs**: 7.3.10 - Tab navigation

#### UI & Design
- **@expo/vector-icons**: Icons (Ionicons exclusively)
- **react-native-reanimated**: 4.1.0 - High-performance animations
- **expo-blur**: 15.0.7 - Visual effects
- **Custom themed components** with modern dark mode design

#### State & Storage
- **React Hooks**: useState, useEffect for component state
- **AsyncStorage**: 2.2.0 - Local key-value storage
- **No external state management** - relies on local state and persistence

### Backend & Services

#### AI Integration
- **OpenAI SDK**: 6.8.1 - API client configured for OpenRouter
- **OpenRouter API**: AI model provider at `https://openrouter.ai/api/v1`
- **Polaris Alpha Model**: Free tier, 256K context, vision-capable
- **Whisper API**: Speech-to-text transcription

#### Storage Solutions
- **Supabase**: 2.80.0 - PostgreSQL with pgvector extension
- **pgvector**: Vector embeddings for semantic search
- **AsyncStorage Fallback**: Offline mode and backup storage

#### Automation
- **Node.js**: ADB Agent server runtime
- **Express.js**: REST API endpoints
- **Android Debug Bridge (ADB)**: Device control and automation

### Development Tools

- **Jest**: 29.2.1 - Testing framework
- **ESLint**: 9.25.0 - Code linting with Expo config
- **Expo Application Services (EAS)**: Build and deployment
- **Metro Bundler**: JavaScript bundling

---

## AI Models & Libraries

### 1. Polaris Alpha Model

**Provider**: OpenRouter API

**Capabilities**:
- 256K token context window for long conversations
- Vision-capable for image analysis
- Free tier access with API key
- Chat completion and task planning

**Use Cases**:
- Conversational chat responses
- Breaking down tasks into automation steps
- Understanding user intent
- Generating structured JSON for automation plans

**Configuration**:
```typescript
model: "openrouter/polaris-alpha"
baseURL: "https://openrouter.ai/api/v1"
maxTokens: 500-800 depending on use case
```

### 2. OpenAI Whisper Model

**Purpose**: Speech-to-text transcription

**Integration**: Accessed through OpenRouter's Whisper API endpoint (`openai/whisper-1`)

**Workflow**:
1. Records audio using expo-av
2. Uploads to OpenRouter
3. Polls for transcription completion
4. Returns text for user confirmation

**Platform Support**:
- **Native (iOS/Android)**: expo-av recording + Whisper transcription
- **Web**: Uses Web Speech API (no Whisper needed)

### 3. Text Embedding Model

**Model**: `text-embedding-3-small` (384 dimensions)

**Purpose**: Generates vector embeddings for semantic search

**Implementation**:
- Messages automatically embedded when saved to Supabase
- Enables similarity search for related conversations
- Uses HNSW indexing for efficient retrieval

---

## Key Libraries Explained

### OpenAI SDK (6.8.1)

**Purpose**: Client library for AI API communication

**Configuration**:
```typescript
new OpenAI({
  apiKey: apiKey,
  baseURL: 'https://openrouter.ai/api/v1',
  dangerouslyAllowBrowser: true
})
```

**Features**:
- Points to OpenRouter instead of OpenAI directly
- Handles chat completions and embeddings
- Browser-compatible configuration

### Supabase JS (2.80.0)

**Purpose**: Backend-as-a-service client

**Features**:
- Vector storage with pgvector extension
- PostgreSQL database access
- Automatic fallback handling
- Real-time subscriptions capability

**Schema**:
```sql
Table: chat_messages
- role: user | assistant
- content: text
- created_at: timestamp
- embedding: vector(384)
```

### React Native Reanimated (4.1.0)

**Purpose**: High-performance animations and gestures

**Use Cases**:
- Smooth UI transitions
- Draggable floating bubble component
- Gesture handling
- 60fps animations on the UI thread

### AsyncStorage (2.2.0)

**Purpose**: Persistent local key-value storage

**Stored Data**:
- OpenRouter API key with timestamp
- Chat history backup (last 20 messages)
- Fallback when vector storage fails
- Cross-platform compatibility (iOS, Android, Web)

### Expo AV (16.0.7)

**Purpose**: Audio and video playback/recording

**Use Case**:
- Records voice input on native platforms
- Manages audio permissions
- Provides audio playback controls

### Expo Linking (8.0.8)

**Purpose**: Deep linking and URL handling

**Automation Use**:
- `whatsapp://` - Opens WhatsApp with pre-filled messages
- `tel:` - Initiates phone calls
- `mailto:` - Opens email client
- Opens URLs in specific browsers

---

## ADB Automation Architecture

### ADB Agent Server

**Technology**: Node.js with Express.js
**Port**: 3000
**Location**: Runs on Windows PC connected to Android device

**Core Functions**:
- Executes ADB shell commands
- Resolves contact names to phone numbers with fuzzy matching
- Controls device UI (tap, swipe, type)
- Opens apps and URLs
- Manages WhatsApp and phone automation

### Supported Actions

#### Communication
| Action | Description | Example |
|--------|-------------|---------|
| `whatsapp` | Send message with auto-contact resolution | `{ action: "whatsapp", target: "Jutin", text: "Hello!" }` |
| `call` | Make phone call by name | `{ action: "call", target: "Jutin" }` |
| `email` | Send email with pre-filled content | `{ action: "email", target: "john@example.com", text: "Message" }` |

#### Navigation
| Action | Description | Example |
|--------|-------------|---------|
| `open_url` | Open URL in specific browser | `{ action: "open_url", target: "https://instagram.com", browser: "opera" }` |
| `open_app` | Launch app by package name | `{ action: "open_app", target: "com.whatsapp" }` |
| `key` | Press hardware key | `{ action: "key", keycode: 3 }` (Home button) |

#### UI Control
| Action | Description | Example |
|--------|-------------|---------|
| `tap` | Tap screen coordinates | `{ action: "tap", x: 500, y: 1000 }` |
| `type` | Type text input | `{ action: "type", text: "Hello World" }` |
| `swipe` | Swipe gesture | `{ action: "swipe", ... }` |
| `wait` | Delay between actions | `{ action: "wait", target: "2000" }` |

### Contact Resolution

**Process**:
1. User provides contact name (e.g., "Jutin")
2. ADB queries device contacts database
3. Fuzzy matching finds closest name
4. Returns phone number automatically

**Advantages**:
- No need to memorize phone numbers
- Works with partial names
- Case-insensitive matching
- Provides suggestions if not found

---

## Installation & Setup

### Prerequisites

#### Software Requirements
- Node.js and npm installed
- Android SDK Platform Tools (ADB)
- Expo CLI
- Git (optional)

#### Device Requirements
- Android device with USB debugging enabled
- USB cable or WiFi connection
- Developer options enabled
- At least one contact saved

### Step 1: Install Dependencies

```bash
# Install main project dependencies
npm install

# Install ADB agent dependencies
cd adb-agent
npm install
cd ..
```

### Step 2: Set Up ADB

1. **Download Android SDK Platform Tools** from https://developer.android.com/studio/releases/platform-tools
2. Extract to `C:\adb\` and add to system PATH
3. **Enable USB debugging** on Android device:
   - Go to Settings → About Phone
   - Tap Build Number 7 times (enables Developer Options)
   - Go to Settings → Developer Options
   - Enable USB Debugging
4. **Connect device** and verify:
```bash
adb devices
```

### Step 3: Configure API Keys

1. Open the app and navigate to API Setup screen
2. Enter your OpenRouter API key (get free key from https://openrouter.ai)
3. The key is stored locally in AsyncStorage

### Step 4: Run the Application

#### Method 1: Automated Start (Windows)
```bash
start-automation.bat
```

#### Method 2: Manual Start
```bash
# Terminal 1: Start ADB Agent
cd adb-agent
npm start

# Terminal 2: Setup port forwarding
adb reverse tcp:3000 tcp:3000

# Terminal 3: Start Expo App
npm start
```

### Step 5: Open App on Device

- Scan QR code with Expo Go app
- Or press 'a' for Android emulator
- The app will connect to `localhost:3000` (forwarded to PC via ADB)

---

## Testing

### Verify ADB Connection

```bash
# Check device connection
adb devices

# Verify ADB agent
curl http://localhost:3000/status
```

### Run Automated Test Suite

```bash
cd adb-agent
npm test
```

**Expected Output**:
```
🤖 ADB AUTOMATION - TEST SUITE

✅ Passed: 12
❌ Failed: 0
⏱️  Duration: 25.3s

🎉 All tests passed!
```

### Example Commands to Test

1. **"Open Opera and open Instagram in it"**
2. **"Text Jutin on WhatsApp and ask if he is coming to the party tomorrow"**
3. **"Call Jutin"**

---

## Network Configuration

### ADB Port Forwarding (Recommended)

```bash
adb reverse tcp:3000 tcp:3000
```
This allows the phone to access PC's localhost:3000

### WiFi ADB (Optional - No Cable)

```bash
# First connect via USB
adb tcpip 5555

# Get phone IP
adb shell ip addr show wlan0

# Connect wirelessly
adb connect 192.168.x.x:5555

# Setup port forwarding
adb reverse tcp:3000 tcp:3000
```

---

## Troubleshooting

### Device Not Found
```bash
adb kill-server
adb start-server
adb devices
```

### Port Already in Use
Change PORT in `adb-agent/server.js`

### Connection Issues
- Verify port forwarding is active
- Check firewall settings
- Ensure device is unlocked

### Contact Not Found
- Verify contacts are synced on device
- Try full name or partial match
- Check available contacts at http://localhost:3000/contacts

---

## Project Structure

```
makpr016-cheese-cake/
├── app/                          # Screen components (file-based routing)
│   ├── chat.tsx                  # Chat mode interface
│   ├── automation.tsx            # Automation planning and execution
│   ├── api-setup.tsx             # API key configuration
│   └── (tabs)/                   # Tab navigation
├── src/
│   ├── services/                 # Core business logic
│   │   ├── PolarisService.ts     # AI chat and planning
│   │   ├── AutomationService.ts  # Task execution
│   │   ├── AdbService.ts         # ADB communication
│   │   └── VectorStorageService.ts # Vector embeddings
│   ├── components/               # Reusable UI components
│   │   ├── MessageBubble.tsx     # Chat message display
│   │   ├── ActionCard.tsx        # Automation step card
│   │   ├── VoiceInput.tsx        # Voice recording
│   │   └── FloatingBubble.tsx    # Draggable AI button
│   ├── types/                    # TypeScript definitions
│   └── utils/                    # Helper functions
├── adb-agent/                    # Node.js automation server
│   ├── server.js                 # Main ADB agent
│   ├── run-tests.js              # Test suite
│   └── package.json              # Dependencies
├── app.json                      # Expo configuration
├── package.json                  # Main dependencies
└── tsconfig.json                 # TypeScript config
```

---

## API Endpoints

### ADB Agent REST API

```
GET  /status                 - Check connection status
GET  /contacts               - Get all contacts
POST /contacts/search        - Search contact by name
POST /whatsapp              - Send WhatsApp message
POST /call                  - Make phone call
POST /open-url              - Open URL in browser
POST /open-app              - Launch application
POST /execute-plan          - Execute automation plan
GET  /screenshot            - Take device screenshot
GET  /ui-dump               - Get UI hierarchy
```

---

## Security & Privacy

- ✅ Runs locally on your PC and device
- ✅ No data sent to external servers (except AI API)
- ✅ API keys stored locally with AsyncStorage
- ⚠️ Never expose ADB agent to the internet
- ⚠️ Only use on devices you own
- ⚠️ Be careful with automated calls/messages

---

<div align="center">

**Built with ❤️ using React Native, Expo, and ADB**

</div>
