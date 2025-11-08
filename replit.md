# AI Assistant Mobile App

## Overview

This is a React Native mobile application built with Expo that provides an AI-powered assistant with two primary modes: Chat Mode for conversational Q&A and Automation Mode for task execution planning. The app leverages OpenRouter's Polaris Alpha model to provide intelligent responses and task automation planning capabilities. It features a modern dark theme design and uses AsyncStorage for local data persistence.

## Recent Changes

**November 8, 2025 (Latest)**: Cross-Platform Voice Input Implementation
- Upgraded VoiceInput to work on ALL platforms (web, iOS, Android) with Expo Go compatibility
- Web: Uses Web Speech API for real-time voice recognition
- Native (iOS/Android): Uses expo-av for audio recording + OpenAI Whisper API for transcription
- Added Whisper transcription to PolarisService with OpenRouter integration
- Requires OpenRouter API key for native voice input (web works without it)
- Available in both Chat and Automation screens on all platforms

**November 8, 2025**: Supabase Vector Database Integration Completed
- Implemented vector storage for unlimited chat history with semantic search
- Created SupabaseClient.ts and VectorStorageService.ts services
- Automatic embedding generation using OpenRouter's text-embedding-3-small (384 dimensions)
- Comprehensive fallback handling: vector storage → AsyncStorage on any failure
- Dual-write strategy prevents data loss during Supabase outages
- User alerts when system degrades to local storage mode
- Database schema: chat_messages table with pgvector support and HNSW indexing

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
- **Cross-platform support**: Works on web, iOS, and Android with Expo Go
- **Web implementation**: Web Speech API for real-time browser-based voice recognition
- **Native implementation**: expo-av audio recording + OpenAI Whisper API transcription
- Modal interface with recording state visualization (animated microphone icon)
- Transcription confirmation dialog before populating input fields
- Platform-specific behavior: real-time on web, record-then-transcribe on native
- Automatic microphone permission requests
- Loading states during transcription on native platforms
- Error handling for permissions, unsupported browsers, and API failures
- Available in both Chat and Automation screens
- Fully compatible with Expo Go (no custom native modules required)

**State Management**:
- Component-level state using React hooks (useState, useEffect)
- No external state management library; relies on local state and AsyncStorage for persistence
- Real-time UI updates during automation execution using callback patterns

**Routing Structure**:
- `/` - Home screen with navigation cards
- `/chat` - Chat mode interface
- `/automation` - Automation planning and execution
- `/api-setup` - API key configuration
- `/(tabs)` - Tab navigation container

### Backend Architecture

**AI Service Layer** (`PolarisService`):
- OpenAI SDK client configured for OpenRouter API
- Base URL: `https://openrouter.ai/api/v1`
- Chat model: `openrouter/polaris-alpha` (free tier, 256K context, vision-capable)
- Transcription model: `openai/whisper-1` for voice-to-text on native platforms
- Handles text-based chat, image analysis, and audio transcription
- Audio transcription via OpenRouter's Whisper API endpoint
- Error handling with descriptive user-facing messages

**Automation Service** (`AutomationService`):
- Manages step-by-step task execution with status tracking
- Simulates automation delays based on action type
- Validates automation steps before execution
- Provides execution time estimation
- Supports actions: tap, type, swipe, scroll, wait, open_app

**Intent Detection** (`intents.ts`):
- Keyword-based classification to route user input to chat vs automation mode
- Pattern matching for action-oriented commands
- Maintains list of automation-specific keywords

### Data Storage Solutions

**Vector Storage (Primary)** (`VectorStorageService`):
- Supabase PostgreSQL with pgvector extension for semantic search
- Unlimited chat history storage with automatic embeddings (384 dimensions)
- Uses OpenRouter's text-embedding-3-small model for vector generation
- HNSW index for efficient similarity search
- Database table: `chat_messages` with role, content, created_at, embedding columns
- Comprehensive error handling with null returns to signal failures

**AsyncStorage (Fallback & Backup)**:
- API key storage with timestamp metadata
- Chat history backup (synced with vector storage)
- Automatic fallback when Supabase is unavailable
- Local-only mode when vector storage is not configured
- Dual-write strategy ensures no message loss during outages

**Fallback Strategy**:
- Initialization: Try vector storage → if fails, load from AsyncStorage
- Save: Try vector storage → if fails, save to AsyncStorage only
- Clear: Try vector storage → if fails, clear AsyncStorage only
- User notification when system operates in degraded local-only mode
- Automatic disabling of vector storage on persistent failures

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
- **@react-native-async-storage/async-storage 2.2.0**: Local key-value storage and fallback
- **@supabase/supabase-js 2.47.15**: Vector database client for unlimited chat storage
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