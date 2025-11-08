import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/src/utils/theme';
import { Message } from '@/src/types';
import { MessageBubble } from '@/src/components/MessageBubble';
import { VoiceInput } from '@/src/components/VoiceInput';
import { PolarisService } from '@/src/services/PolarisService';
import { getApiKey, getChatHistory, saveChatHistory } from '@/src/utils/storage';

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [polarisService, setPolarisService] = useState<PolarisService | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    console.log('Initializing chat...');
    const apiKey = await getApiKey();
    console.log('API key retrieved:', apiKey ? 'yes' : 'no');
    
    if (!apiKey) {
      console.log('No API key found, showing alert');
      Alert.alert('API Key Required', 'Please configure your API key in API Setup first.');
      return;
    }

    setPolarisService(new PolarisService(apiKey));
    const history = await getChatHistory();
    setMessages(history);
    console.log('Chat initialized with', history.length, 'messages');
  };

  const sendMessage = async () => {
    console.log('Send message clicked, input:', inputText.trim().length, 'chars');
    
    if (!inputText.trim()) {
      console.log('Empty message, returning');
      return;
    }
    
    if (!polarisService) {
      console.log('No Polaris service, showing alert');
      Alert.alert('API Key Required', 'Please configure your API key in API Setup first.');
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: inputText.trim(),
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setLoading(true);

    try {
      const response = await polarisService.chat(userMessage.content, messages);

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      await saveChatHistory(finalMessages);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    Alert.alert(
      'Clear Chat History',
      'Are you sure you want to clear all messages?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            setMessages([]);
            await saveChatHistory([]);
          },
        },
      ]
    );
  };

  const handleVoiceConfirm = (text: string) => {
    console.log('Voice input confirmed:', text);
    setInputText(text);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Stack.Screen
        options={{
          title: 'Chat',
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text,
          headerRight: () => (
            <Pressable onPress={clearHistory} style={styles.headerButton}>
              <Ionicons name="trash-outline" size={24} color={theme.colors.text} />
            </Pressable>
          ),
        }}
      />

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color={theme.colors.textTertiary} />
            <Text style={styles.emptyText}>Start a conversation with your AI assistant</Text>
          </View>
        }
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Thinking...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          placeholderTextColor={theme.colors.textTertiary}
          multiline
          maxLength={500}
        />
        <Pressable
          style={styles.micButton}
          onPress={() => setShowVoiceInput(true)}
        >
          <Ionicons name="mic" size={24} color={theme.colors.primary} />
        </Pressable>
        <Pressable
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim() || loading}
        >
          <Ionicons
            name="send"
            size={24}
            color={inputText.trim() ? theme.colors.text : theme.colors.textTertiary}
          />
        </Pressable>
      </View>

      <VoiceInput
        visible={showVoiceInput}
        onClose={() => setShowVoiceInput(false)}
        onConfirm={handleVoiceConfirm}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerButton: {
    padding: theme.spacing.sm,
  },
  messageList: {
    paddingVertical: theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    gap: theme.spacing.md,
  },
  emptyText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textTertiary,
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  loadingText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    maxHeight: 100,
  },
  micButton: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.surfaceLight,
  },
});
