import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/src/utils/theme';
import { hasApiKey } from '@/src/utils/storage';

export default function HomeScreen() {
  const router = useRouter();
  const [apiKeyExists, setApiKeyExists] = useState(false);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    const exists = await hasApiKey();
    setApiKeyExists(exists);
  };

  const cards = [
    {
      title: 'Chat Mode',
      description: 'Ask questions and have conversations with AI',
      icon: 'chatbubbles' as const,
      color: theme.colors.primary,
      route: '/chat',
    },
    {
      title: 'Automation',
      description: 'Plan and execute automated tasks',
      icon: 'settings' as const,
      color: theme.colors.success,
      route: '/automation',
    },
    {
      title: 'API Setup',
      description: 'Configure your OpenRouter API key',
      icon: 'key' as const,
      color: theme.colors.warning,
      route: '/api-setup',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Assistant</Text>
        <Text style={styles.subtitle}>Your Android Automation Companion</Text>
      </View>

      <View style={styles.statusCard}>
        <Ionicons 
          name={apiKeyExists ? 'checkmark-circle' : 'alert-circle'} 
          size={24} 
          color={apiKeyExists ? theme.colors.success : theme.colors.warning} 
        />
        <Text style={styles.statusText}>
          {apiKeyExists ? 'API Key Configured' : 'API Key Required'}
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        {cards.map((card, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            onPress={() => router.push(card.route as any)}
          >
            <View style={[styles.iconContainer, { backgroundColor: card.color + '20' }]}>
              <Ionicons name={card.icon} size={32} color={card.color} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDescription}>{card.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
          </Pressable>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by Polaris Alpha</Text>
        <Text style={styles.footerSubtext}>Free tier available</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  statusText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    fontWeight: '500',
  },
  cardsContainer: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.medium,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  cardDescription: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
  },
  footerText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  footerSubtext: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.xs,
  },
});
