# AI Assistant Mobile App

## Overview

This is a React Native mobile application built with Expo that provides an AI-powered assistant with two primary modes: Chat Mode for conversational Q&A and Automation Mode for task execution planning. The app leverages OpenRouter's Polaris Alpha model to provide intelligent responses and task automation planning capabilities. It features a modern dark theme design and uses AsyncStorage for local data persistence.

## Recent Changes

**November 8, 2025 (Latest)**: MacroDroid Integration for Real Android Automation
- Integrated MacroDroid webhook-based automation for real device control
- Updated AutomationService to trigger MacroDroid webhooks instead of simulations
- Enhanced PolarisService AI planning with 13 MacroDroid-compatible actions
- Created comprehensive MacroDroid Setup screen with 3-tab interface (setup, macros, testing)
- Added new automation actions: open_browser, search_google, open_url, make_call, send_sms, go_back, go_home
- Implemented complete payload building with query text, messages, contacts, URLs
- Added home screen navigation card for MacroDroid setup
- Clear documentation about webhook URL configuration requirements
- Integration architect-approved and ready for MVP testing

**November 8, 2025**: PostgreSQL Database Integration
- Integrated Replit's Neon PostgreSQL database for cloud-based chat message persistence
- Created database schema with Drizzle ORM for messages table (user_id, role, content, timestamp)
- Built Express backend API on port 3000 with GET, POST, DELETE endpoints
- Updated storage service to use cloud database while keeping API keys local
- Implemented automatic message limit enforcement (20 messages per user)
- Backend and frontend properly handle individual message saves to prevent duplicates
- Both workflows (Expo app on 8000, API server on 3000) running successfully
- Feature verified and architect-approved

**November 8, 2025**: Voice Input Feature Implementation
- Added VoiceInput component with Web Speech API integration
- Voice input works in browsers with recording modal and visual feedback
- Transcription confirmation dialog before populating text fields
- Integrated voice input into both Chat and Automation screens
- Platform detection with graceful unsupported message for native platforms
- Feature verified and architect-approved

**November 8, 2025**: Complete implementation of AI Assistant app
- Created all core services (PolarisService, AutomationService)
- Built all UI components (MessageBubble, ActionCard, FloatingBubble, VoiceInput)
- Implemented all app screens (Home, Chat, Automation, API Setup)
- Added theme system with modern dark mode design
- Configured AsyncStorage for API key and chat history persistence with web fallback
- Set up Expo workflow running on port 8000
- App is fully functional and ready to use with OpenRouter API key

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React Native with Expo SDK 54
- Uses Expo Router for file-based navigation with typed routes
- Implements a tab-based navigation structure with Stack navigation for modals
- Supports cross-platform deployment (Android, iOS, Web) with platform-specific optimizations

**UI Components**:
- Custom themed components (`ThemedText`, `ThemedView`) for consistent styling
- Reusable UI components: `MessageBubble` for chat interface, `ActionCard` for automation steps, `FloatingBubble` for draggable AI button, `VoiceInput` for voice-to-text input
- Uses `@expo/vector-icons` (Ionicons) exclusively for all iconography
- Implements `react-native-reanimated` for smooth animations and gestures
- Dark mode as primary design language with modern, sleek aesthetic

**Voice Input** (`VoiceInput.tsx`):
- Web Speech API integration for browser-based voice recognition
- Modal interface with recording state visualization (animated microphone icon)
- Real-time transcription with confirmation dialog
- Platform detection - works on web browsers, shows message for native
- Error handling for unsupported browsers or permission denials
- User can retry recording or confirm transcription before populating input fields

**State Management**:
- Component-level state using React hooks (useState, useEffect)
- No external state management library; relies on local state and AsyncStorage for persistence
- Real-time UI updates during automation execution using callback patterns

**Routing Structure**:
- `/` - Home screen with navigation cards
- `/chat` - Chat mode interface
- `/automation` - Automation planning and execution
- `/macrodroid-setup` - MacroDroid setup and configuration guide
- `/api-setup` - API key configuration
- `/(tabs)` - Tab navigation container

### Backend Architecture

**AI Service Layer** (`PolarisService`):
- OpenAI SDK client configured for OpenRouter API
- Base URL: `https://openrouter.ai/api/v1`
- Model: `openrouter/polaris-alpha` (free tier, 256K context, vision-capable)
- Handles both text-based chat and image analysis capabilities
- Error handling with descriptive user-facing messages

**Automation Service** (`AutomationService`):
- MacroDroid webhook-based execution for real Android device control
- Triggers MacroDroid macros via HTTP POST requests to webhook URLs
- Manages step-by-step task execution with status tracking
- Validates automation steps before execution
- Provides execution time estimation
- Supports 13 MacroDroid actions: open_browser, search_google, open_url, make_call, send_sms, open_app, tap, type, swipe, scroll, go_back, go_home, wait
- Builds complete payloads with query text, messages, contacts, URLs, and coordinates
- Configurable webhook IDs and base URL for production use
- 10-second timeout per webhook request with error handling

**Intent Detection** (`intents.ts`):
- Keyword-based classification to route user input to chat vs automation mode
- Pattern matching for action-oriented commands
- Maintains list of automation-specific keywords

### Data Storage Solutions

**PostgreSQL Database** (Replit Neon):
- Cloud-based chat message persistence using Replit's managed PostgreSQL
- Messages table with user_id, role, content, and timestamp columns
- Drizzle ORM for type-safe database queries
- Express API backend on port 3000 for database operations
- Automatic enforcement of 20-message limit per user
- User ID generation and persistence for device-specific chat history

**Express Backend API** (`server/index.ts`):
- GET `/api/messages/:userId` - Retrieves last 20 messages for a user
- POST `/api/messages` - Saves a new message and maintains 20-message cap
- DELETE `/api/messages/:userId` - Clears all messages for a user
- CORS enabled for cross-origin requests from Expo app
- Running on port 3000 via tsx workflow

**AsyncStorage Implementation**:
- API key storage with timestamp metadata (device-local for security)
- User ID persistence for consistent chat history per device
- Web platform support via localStorage with memory fallback

**Data Models**:
- `Message`: Chat message with role (user/assistant), content, and timestamp
- `AutomationStep`: Task step with action type, target, optional text, reasoning, and execution status
- `ApiKeyConfig`: API key with creation timestamp

### Design Patterns

**Theme System**:
- Centralized theme configuration in `src/utils/theme.ts`
- Consistent color palette focused on dark mode
- Standardized spacing, border radius, and shadow definitions
- Responsive to system color scheme preferences

**Component Architecture**:
- Separation of concerns: UI components, services, utilities
- Props-based component communication
- TypeScript for type safety across all modules

**Error Handling**:
- Try-catch blocks in async operations
- User-friendly alert messages
- Graceful degradation when API key is missing

## External Dependencies

### Core Framework
- **Expo SDK 54**: Cross-platform mobile development framework
- **React Native 0.81.4**: Core mobile UI framework
- **React 19.1.0**: JavaScript UI library

### Navigation
- **expo-router 6.0.7**: File-based routing system
- **@react-navigation/native 7.1.6**: Navigation library
- **@react-navigation/bottom-tabs 7.3.10**: Tab navigation

### AI Integration
- **openai 6.8.1**: OpenAI SDK for API communication
- **OpenRouter API**: AI model provider (Polaris Alpha model)
  - Endpoint: https://openrouter.ai/api/v1
  - Free tier usage with API key authentication

### UI & Animation
- **@expo/vector-icons 15.0.2**: Icon library (Ionicons)
- **react-native-reanimated 4.1.0**: Animation library
- **react-native-gesture-handler 2.28.0**: Touch gesture handling
- **expo-blur 15.0.7**: Blur effects for iOS tab bar

### Storage & System
- **@react-native-async-storage/async-storage 2.2.0**: Local key-value storage
- **expo-constants 18.0.9**: System constants access
- **expo-haptics 15.0.7**: Haptic feedback (iOS)

### Development Tools
- **TypeScript 5.9.2**: Static type checking
- **ESLint 9.25.0**: Code linting with Expo config
- **Jest 29.2.1**: Testing framework

### Additional Expo Modules
- expo-font: Custom font loading
- expo-splash-screen: Splash screen management
- expo-status-bar: Status bar styling
- expo-linking: Deep linking support
- expo-web-browser: In-app browser
- react-native-safe-area-context: Safe area handling
- react-native-screens: Native screen optimization