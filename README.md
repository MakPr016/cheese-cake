# Android AI Assistant with ADB Automation

## Project Overview

This is a React Native mobile application built with Expo that provides an AI-powered assistant with two primary modes: **Chat Mode** for conversational Q&A and **Automation Mode** for task execution planning and real-world automation on Android devices. The app understands natural language commands and can automatically execute complex tasks like sending WhatsApp messages, making calls, opening apps, and controlling the device through ADB (Android Debug Bridge).[10]

### Core Features

- **Intelligent Contact Resolution**: No phone numbers needed - use names like "Jutin" with fuzzy matching[10]
- **Voice Control**: Cross-platform voice input with transcription powered by AssemblyAI and Whisper[10]
- **Multi-Step Workflows**: Chain multiple actions together with automatic timing and delays[10]
- **Unlimited Chat History**: Semantic search through vector storage using Supabase and pgvector[10]
- **Real Automation**: Execute tasks via ADB commands on connected Android devices[10]

Here is your mobile app:
![WhatsApp Image 2025-11-09 at 06 17 10_366fa263](https://github.com/user-attachments/assets/c96c9796-cf15-478a-978c-871664651b1a)

Add your open router API key:
![WhatsApp Image 2025-11-09 at 06 17 12_5a19c2b1](https://github.com/user-attachments/assets/890a29f5-ce61-488e-97f2-ddf141a7cce0)

Explore all the options:
![WhatsApp Image 2025-11-09 at 06 17 10_5c4c3348](https://github.com/user-attachments/assets/5d0d12bb-d053-4ecc-8f12-92ddd1a4f197)

Send chats using our app automatically:
![WhatsApp Image 2025-11-09 at 06 17 11_83afb50c](https://github.com/user-attachments/assets/e69a8a45-d16e-486e-b2f5-74da56fb85b2)

speak with the AI:
![WhatsApp Image 2025-11-09 at 06 17 11_2631bcd2](https://github.com/user-attachments/assets/b5bdf694-99ba-4df8-88f5-4c0daf9e1965)


set up yout automation for hands free experience:
![WhatsApp Image 2025-11-09 at 06 22 03_aba03ab3](https://github.com/user-attachments/assets/a2639772-663b-4ef6-b09e-56feda8c32f9)
Automation result:
![WhatsApp Image 2025-11-09 at 06 22 04_20c0775b](https://github.com/user-attachments/assets/5a34c2f8-3704-4c8e-8a63-3cd910795b26)


***

## Market Analysis

### Target Users

- Android power users seeking productivity automation[10]
- Developers testing mobile applications[10]
- Accessibility-focused users requiring hands-free control[10]
- Productivity enthusiasts automating repetitive tasks[10]

### Use Cases

- **Hands-Free Device Control**: Voice commands for messaging and calls[10]
- **Automated Messaging Workflows**: Send WhatsApp messages by name without typing numbers[10]
- **Multi-App Task Automation**: Chain tasks across multiple applications[10]
- **Accessibility Assistance**: Voice-driven device interaction[10]

### Competitive Advantages

| Feature | Benefit |
|---------|---------|
| Free AI Model | Uses OpenRouter's Polaris Alpha (256K context, free tier)[10] |
| Contact Resolution | Fuzzy matching finds contacts automatically[10] |
| Cross-Platform Voice | Works on web, iOS, and Android[10] |
| Vector Search | Unlimited chat history with semantic search[10] |
| No Root Required | ADB-based automation without rooting device[10] |

***

## Tech Stack

### Frontend Technologies

#### Framework & Core
- **React Native**: 0.81.4 - Core mobile UI framework[10]
- **Expo SDK**: 54.0.9 - Cross-platform development framework[10]
- **React**: 19.1.0 - JavaScript UI library[10]
- **TypeScript**: 5.9.2 - Type-safe development[10]

#### Navigation
- **Expo Router**: 6.0.7 - File-based routing with typed routes[10]
- **React Navigation Native**: 7.1.6 - Navigation library[10]
- **React Navigation Bottom Tabs**: 7.3.10 - Tab navigation[10]

#### UI & Design
- **@expo/vector-icons**: Icons (Ionicons exclusively)[10]
- **react-native-reanimated**: 4.1.0 - High-performance animations[10]
- **expo-blur**: 15.0.7 - Visual effects[10]
- **Custom themed components** with modern dark mode design[10]

#### State & Storage
- **React Hooks**: useState, useEffect for component state[10]
- **AsyncStorage**: 2.2.0 - Local key-value storage[10]
- **No external state management** - relies on local state and persistence[10]

### Backend & Services

#### AI Integration
- **OpenAI SDK**: 6.8.1 - API client configured for OpenRouter[10]
- **OpenRouter API**: AI model provider at `https://openrouter.ai/api/v1`[10]
- **Polaris Alpha Model**: Free tier, 256K context, vision-capable[10]
- **Whisper API**: Speech-to-text transcription[10]

#### Storage Solutions
- **Supabase**: 2.80.0 - PostgreSQL with pgvector extension[10]
- **pgvector**: Vector embeddings for semantic search[10]
- **AsyncStorage Fallback**: Offline mode and backup storage[10]

#### Automation
- **Node.js**: ADB Agent server runtime[10]
- **Express.js**: REST API endpoints[10]
- **Android Debug Bridge (ADB)**: Device control and automation[10]

### Development Tools

- **Jest**: 29.2.1 - Testing framework[10]
- **ESLint**: 9.25.0 - Code linting with Expo config[10]
- **Expo Application Services (EAS)**: Build and deployment[10]
- **Metro Bundler**: JavaScript bundling[10]

***

## AI Models & Libraries

### 1. Polaris Alpha Model

**Provider**: OpenRouter API[10]

**Capabilities**:
- 256K token context window for long conversations[10]
- Vision-capable for image analysis[10]
- Free tier access with API key[10]
- Chat completion and task planning[10]

**Use Cases**:
- Conversational chat responses[10]
- Breaking down tasks into automation steps[10]
- Understanding user intent[10]
- Generating structured JSON for automation plans[10]

**Configuration**:
```typescript
model: "openrouter/polaris-alpha"
baseURL: "https://openrouter.ai/api/v1"
maxTokens: 500-800 depending on use case
```


### 2. OpenAI Whisper Model

**Purpose**: Speech-to-text transcription[10]

**Integration**: Accessed through OpenRouter's Whisper API endpoint (`openai/whisper-1`)[10]

**Workflow**:
1. Records audio using expo-av[10]
2. Uploads to OpenRouter[10]
3. Polls for transcription completion[10]
4. Returns text for user confirmation[10]

**Platform Support**:
- **Native (iOS/Android)**: expo-av recording + Whisper transcription[10]
- **Web**: Uses Web Speech API (no Whisper needed)[10]

### 3. Text Embedding Model

**Model**: `text-embedding-3-small` (384 dimensions)[10]

**Purpose**: Generates vector embeddings for semantic search[10]

**Implementation**:
- Messages automatically embedded when saved to Supabase[10]
- Enables similarity search for related conversations[10]
- Uses HNSW indexing for efficient retrieval[10]

***

## Key Libraries Explained

### OpenAI SDK (6.8.1)

**Purpose**: Client library for AI API communication[10]

**Configuration**:
```typescript
new OpenAI({
  apiKey: apiKey,
  baseURL: 'https://openrouter.ai/api/v1',
  dangerouslyAllowBrowser: true
})
```


**Features**:
- Points to OpenRouter instead of OpenAI directly[10]
- Handles chat completions and embeddings[10]
- Browser-compatible configuration[10]

### Supabase JS (2.80.0)

**Purpose**: Backend-as-a-service client[10]

**Features**:
- Vector storage with pgvector extension[10]
- PostgreSQL database access[10]
- Automatic fallback handling[10]
- Real-time subscriptions capability[10]

**Schema**:
```sql
Table: chat_messages
- role: user | assistant
- content: text
- created_at: timestamp
- embedding: vector(384)
```


### React Native Reanimated (4.1.0)

**Purpose**: High-performance animations and gestures[10]

**Use Cases**:
- Smooth UI transitions[10]
- Draggable floating bubble component[10]
- Gesture handling[10]
- 60fps animations on the UI thread[10]

### AsyncStorage (2.2.0)

**Purpose**: Persistent local key-value storage[10]

**Stored Data**:
- OpenRouter API key with timestamp[10]
- Chat history backup (last 20 messages)[10]
- Fallback when vector storage fails[10]
- Cross-platform compatibility (iOS, Android, Web)[10]

### Expo AV (16.0.7)

**Purpose**: Audio and video playback/recording[10]

**Use Case**:
- Records voice input on native platforms[10]
- Manages audio permissions[10]
- Provides audio playback controls[10]

### Expo Linking (8.0.8)

**Purpose**: Deep linking and URL handling[10]

**Automation Use**:
- `whatsapp://` - Opens WhatsApp with pre-filled messages[10]
- `tel:` - Initiates phone calls[10]
- `mailto:` - Opens email client[10]
- Opens URLs in specific browsers[10]

***

## ADB Automation Architecture

### ADB Agent Server

**Technology**: Node.js with Express.js[10]
**Port**: 3000[10]
**Location**: Runs on Windows PC connected to Android device[10]

**Core Functions**:
- Executes ADB shell commands[10]
- Resolves contact names to phone numbers with fuzzy matching[10]
- Controls device UI (tap, swipe, type)[10]
- Opens apps and URLs[10]
- Manages WhatsApp and phone automation[10]

### Supported Actions

#### Communication
| Action | Description | Example |
|--------|-------------|---------|
| `whatsapp` | Send message with auto-contact resolution | `{ action: "whatsapp", target: "Jutin", text: "Hello!" }`[10] |
| `call` | Make phone call by name | `{ action: "call", target: "Jutin" }`[10] |
| `email` | Send email with pre-filled content | `{ action: "email", target: "john@example.com", text: "Message" }`[10] |

#### Navigation
| Action | Description | Example |
|--------|-------------|---------|
| `open_url` | Open URL in specific browser | `{ action: "open_url", target: "https://instagram.com", browser: "opera" }`[10] |
| `open_app` | Launch app by package name | `{ action: "open_app", target: "com.whatsapp" }`[10] |
| `key` | Press hardware key | `{ action: "key", keycode: 3 }` (Home button)[10] |

#### UI Control
| Action | Description | Example |
|--------|-------------|---------|
| `tap` | Tap screen coordinates | `{ action: "tap", x: 500, y: 1000 }`[10] |
| `type` | Type text input | `{ action: "type", text: "Hello World" }`[10] |
| `swipe` | Swipe gesture | `{ action: "swipe", ... }`[10] |
| `wait` | Delay between actions | `{ action: "wait", target: "2000" }`[10] |

### Contact Resolution

**Process**:
1. User provides contact name (e.g., "Jutin")[10]
2. ADB queries device contacts database[10]
3. Fuzzy matching finds closest name[10]
4. Returns phone number automatically[10]

**Advantages**:
- No need to memorize phone numbers[10]
- Works with partial names[10]
- Case-insensitive matching[10]
- Provides suggestions if not found[10]

***

## Installation & Setup

### Prerequisites

#### Software Requirements
- Node.js and npm installed[10]
- Android SDK Platform Tools (ADB)[10]
- Expo CLI[10]
- Git (optional)[10]

#### Device Requirements
- Android device with USB debugging enabled[10]
- USB cable or WiFi connection[10]
- Developer options enabled[10]
- At least one contact saved[10]

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

1. **Download Android SDK Platform Tools** from https://developer.android.com/studio/releases/platform-tools[10]
2. Extract to `C:\adb\` and add to system PATH[10]
3. **Enable USB debugging** on Android device:
   - Go to Settings → About Phone[10]
   - Tap Build Number 7 times (enables Developer Options)[10]
   - Go to Settings → Developer Options[10]
   - Enable USB Debugging[10]
4. **Connect device** and verify:
```bash
adb devices
```


### Step 3: Configure API Keys

1. Open the app and navigate to API Setup screen[10]
2. Enter your OpenRouter API key (get free key from https://openrouter.ai)[10]
3. The key is stored locally in AsyncStorage[10]

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

- Scan QR code with Expo Go app[10]
- Or press 'a' for Android emulator[10]
- The app will connect to `localhost:3000` (forwarded to PC via ADB)[10]

***

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

1. **"Open Opera and open Instagram in it"**[10]
2. **"Text Jutin on WhatsApp and ask if he is coming to the party tomorrow"**[10]
3. **"Call Jutin"**[10]

***

## Network Configuration

### ADB Port Forwarding (Recommended)

```bash
adb reverse tcp:3000 tcp:3000
```
This allows the phone to access PC's localhost:3000[10]

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


***

## Troubleshooting

### Device Not Found
```bash
adb kill-server
adb start-server
adb devices
```


### Port Already in Use
Change PORT in `adb-agent/server.js`[10]

### Connection Issues
- Verify port forwarding is active[10]
- Check firewall settings[10]
- Ensure device is unlocked[10]

### Contact Not Found
- Verify contacts are synced on device[10]
- Try full name or partial match[10]
- Check available contacts at http://localhost:3000/contacts[10]

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


***

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


***

## Security & Privacy

- ✅ Runs locally on your PC and device[10]
- ✅ No data sent to external servers (except AI API)[10]
- ✅ API keys stored locally with AsyncStorage[10]
- ⚠️ Never expose ADB agent to the internet[10]
- ⚠️ Only use on devices you own[10]
- ⚠️ Be careful with automated calls/messages[10]

***
