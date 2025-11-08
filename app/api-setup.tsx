import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/src/utils/theme';
import { saveApiKey, getApiKey } from '@/src/utils/storage';

export default function ApiSetupScreen() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasExistingKey, setHasExistingKey] = useState(false);

  useEffect(() => {
    checkExistingKey();
  }, []);

  const checkExistingKey = async () => {
    const existingKey = await getApiKey();
    setHasExistingKey(!!existingKey);
  };

  const handleSave = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter an API key');
      return;
    }

    setLoading(true);
    try {
      await saveApiKey(apiKey.trim());
      Alert.alert('Success', 'API key saved successfully!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save API key');
    } finally {
      setLoading(false);
    }
  };

  const openOpenRouter = () => {
    Linking.openURL('https://openrouter.ai/keys');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen
        options={{
          title: 'API Setup',
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text,
        }}
      />

      <View style={styles.header}>
        <Ionicons name="key" size={48} color={theme.colors.primary} />
        <Text style={styles.title}>OpenRouter API Key</Text>
        <Text style={styles.subtitle}>
          Configure your API key to start using the AI assistant
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={24} color={theme.colors.primary} />
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>Polaris Alpha is FREE</Text>
          <Text style={styles.infoText}>
            No credit card required. Create a free account at OpenRouter to get started.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>API Key</Text>
        <TextInput
          style={styles.input}
          value={apiKey}
          onChangeText={setApiKey}
          placeholder="sk-or-v1-..."
          placeholderTextColor={theme.colors.textTertiary}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <Pressable style={styles.linkButton} onPress={openOpenRouter}>
        <Ionicons name="link" size={20} color={theme.colors.primary} />
        <Text style={styles.linkButtonText}>Get API Key from OpenRouter</Text>
        <Ionicons name="arrow-forward" size={20} color={theme.colors.primary} />
      </Pressable>

      <Pressable
        style={[styles.saveButton, !apiKey.trim() && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={!apiKey.trim() || loading}
      >
        <Ionicons
          name={hasExistingKey ? 'checkmark-circle' : 'save'}
          size={20}
          color={theme.colors.text}
        />
        <Text style={styles.saveButtonText}>
          {hasExistingKey ? 'Update API Key' : 'Save API Key'}
        </Text>
      </Pressable>

      <View style={styles.steps}>
        <Text style={styles.stepsTitle}>How to Get Started:</Text>
        {[
          'Visit openrouter.ai and create a free account',
          'Navigate to the API Keys section',
          'Create a new API key',
          'Copy and paste it above',
          'Start chatting with your AI assistant!',
        ].map((step, index) => (
          <View key={index} style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Your API key is stored securely on your device and is never shared.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
  },
  header: {
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary + '20',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  infoText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  linkButtonText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  steps: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  stepsTitle: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: theme.fontSizes.xs,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  stepText: {
    flex: 1,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  footerText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textTertiary,
    textAlign: 'center',
  },
});
