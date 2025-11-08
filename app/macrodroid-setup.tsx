import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '../src/utils/theme';

interface WebhookInfo {
  key: string;
  name: string;
  description: string;
}

export default function MacroDroidSetup() {
  const [copiedWebhook, setCopiedWebhook] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'setup' | 'macros' | 'test'>('setup');

  const webhooks: WebhookInfo[] = [
    { key: 'open_browser', name: 'Open Browser', description: 'Opens default browser app' },
    { key: 'search_google', name: 'Google Search', description: 'Search on Google' },
    { key: 'open_url', name: 'Open URL', description: 'Open specific URL in browser' },
    { key: 'make_call', name: 'Make Call', description: 'Dial phone number' },
    { key: 'send_sms', name: 'Send SMS', description: 'Send text message' },
    { key: 'open_app', name: 'Open App', description: 'Launch any installed app' },
    { key: 'tap', name: 'Tap Screen', description: 'Simulate screen tap' },
    { key: 'type', name: 'Type Text', description: 'Type text input' },
    { key: 'swipe', name: 'Swipe', description: 'Swipe gesture' },
    { key: 'scroll', name: 'Scroll', description: 'Scroll screen' },
    { key: 'go_back', name: 'Go Back', description: 'Press back button' },
    { key: 'go_home', name: 'Go Home', description: 'Go to home screen' },
    { key: 'wait', name: 'Wait', description: 'Wait for duration' },
  ];

  const macroTemplates = [
    {
      name: 'Open Browser',
      trigger: 'Webhook (Cloud)',
      actions: [
        { type: 'Applications', action: 'Launch Application', config: 'Chrome/Browser' }
      ]
    },
    {
      name: 'Google Search',
      trigger: 'Webhook (Cloud)',
      actions: [
        { type: 'Applications', action: 'Launch Application', config: 'Chrome/Browser' },
        { type: 'Wait', action: 'Wait', config: '1 second' },
        { type: 'UI Interaction', action: 'Set Text/Value', config: 'Search bar' },
        { type: 'UI Interaction', action: 'Press Enter', config: '' }
      ]
    },
    {
      name: 'Make Call',
      trigger: 'Webhook (Cloud)',
      actions: [
        { type: 'Phone', action: 'Make Call', config: 'Variable: contact_name' }
      ]
    },
    {
      name: 'Send SMS',
      trigger: 'Webhook (Cloud)',
      actions: [
        { type: 'Phone', action: 'Send SMS', config: 'To: [contact], Message: [text]' }
      ]
    },
  ];

  const copyWebhookId = (key: string) => {
    const webhookId = `WEBHOOK_${key.toUpperCase()}`;
    setCopiedWebhook(key);
    setTimeout(() => setCopiedWebhook(null), 2000);
    Alert.alert(
      'Webhook ID', 
      `Use this ID when naming your MacroDroid webhook:\n\n${webhookId}\n\nAfter creating the macro, MacroDroid will give you a unique webhook URL to use.`
    );
  };

  const openPlayStore = () => {
    Linking.openURL('https://play.google.com/store/apps/details?id=com.arlosoft.macrodroid');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>MacroDroid Setup</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabs}>
        {(['setup', 'macros', 'test'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === 'setup' && '1. Setup'}
              {tab === 'macros' && '2. Macros'}
              {tab === 'test' && '3. Test'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'setup' && (
          <View style={styles.section}>
            <View style={styles.step}>
              <View style={styles.stepHeader}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepTitle}>Install MacroDroid</Text>
              </View>
              <Text style={styles.stepDescription}>
                Download and install MacroDroid from Google Play Store
              </Text>
              <TouchableOpacity style={styles.button} onPress={openPlayStore}>
                <Ionicons name="logo-google-playstore" size={20} color="#fff" />
                <Text style={styles.buttonText}>Open Play Store</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.step}>
              <View style={styles.stepHeader}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepTitle}>Enable Accessibility</Text>
              </View>
              <Text style={styles.stepDescription}>
                MacroDroid needs accessibility permissions to control your device:
              </Text>
              <View style={styles.list}>
                <Text style={styles.listItem}>• Open MacroDroid app</Text>
                <Text style={styles.listItem}>• Go to Settings → Accessibility</Text>
                <Text style={styles.listItem}>• Enable "MacroDroid Accessibility Service"</Text>
                <Text style={styles.listItem}>• Grant all requested permissions</Text>
              </View>
              <View style={styles.warning}>
                <Ionicons name="warning" size={20} color="#FFA500" />
                <Text style={styles.warningText}>
                  This is required for MacroDroid to interact with apps
                </Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={styles.stepHeader}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepTitle}>Enable Cloud Webhooks</Text>
              </View>
              <Text style={styles.stepDescription}>
                Webhooks allow your app to trigger MacroDroid macros:
              </Text>
              <View style={styles.list}>
                <Text style={styles.listItem}>• Open MacroDroid → Settings</Text>
                <Text style={styles.listItem}>• Scroll to "Cloud Services"</Text>
                <Text style={styles.listItem}>• Enable "Webhook Trigger"</Text>
                <Text style={styles.listItem}>• Sign up for free MacroDroid Cloud account if needed</Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={styles.stepHeader}>
                <Ionicons name="list" size={24} color={theme.colors.primary} />
                <Text style={styles.stepTitle}>Required Webhooks</Text>
              </View>
              <Text style={styles.stepDescription}>
                You'll create macros for these automation actions:
              </Text>
              {webhooks.map((webhook) => (
                <TouchableOpacity
                  key={webhook.key}
                  style={styles.webhookCard}
                  onPress={() => copyWebhookId(webhook.key)}
                >
                  <View style={styles.webhookInfo}>
                    <Text style={styles.webhookName}>{webhook.name}</Text>
                    <Text style={styles.webhookDesc}>{webhook.description}</Text>
                  </View>
                  <Ionicons 
                    name={copiedWebhook === webhook.key ? "checkmark-circle" : "copy"} 
                    size={20} 
                    color={copiedWebhook === webhook.key ? theme.colors.success : theme.colors.primary} 
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'macros' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Creating Macros in MacroDroid</Text>
            <Text style={styles.sectionDescription}>
              For each automation action, create a macro following this pattern:
            </Text>

            {macroTemplates.map((template, idx) => (
              <View key={idx} style={styles.macroCard}>
                <Text style={styles.macroTitle}>{template.name}</Text>
                
                <View style={styles.macroSection}>
                  <Text style={styles.macroLabel}>TRIGGER:</Text>
                  <View style={[styles.macroItem, { backgroundColor: '#1e3a8a30' }]}>
                    <Text style={styles.macroItemText}>{template.trigger}</Text>
                    <Text style={styles.macroItemDesc}>Name it: "{template.name}"</Text>
                  </View>
                </View>

                <View style={styles.macroSection}>
                  <Text style={styles.macroLabel}>ACTIONS:</Text>
                  {template.actions.map((action, actionIdx) => (
                    <View key={actionIdx} style={[styles.macroItem, { backgroundColor: '#16a34a30' }]}>
                      <Text style={styles.macroItemText}>{action.action}</Text>
                      <Text style={styles.macroItemDesc}>Category: {action.type}</Text>
                      {action.config && (
                        <Text style={styles.macroItemDesc}>Config: {action.config}</Text>
                      )}
                    </View>
                  ))}
                </View>

                <View style={styles.macroSteps}>
                  <Text style={styles.macroStepsTitle}>Quick Steps:</Text>
                  <Text style={styles.macroStep}>1. Tap "+" to create new macro</Text>
                  <Text style={styles.macroStep}>2. Add trigger → Webhook (Cloud)</Text>
                  <Text style={styles.macroStep}>3. Add actions as shown above</Text>
                  <Text style={styles.macroStep}>4. Save and copy webhook ID</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'test' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Testing Your Setup</Text>
            <Text style={styles.sectionDescription}>
              Follow these steps to test your MacroDroid integration:
            </Text>

            <View style={styles.testCard}>
              <Ionicons name="flask" size={32} color={theme.colors.primary} />
              <Text style={styles.testTitle}>1. Test Individual Webhooks</Text>
              <Text style={styles.testDesc}>
                Use MacroDroid's built-in test button for each webhook to verify it works
              </Text>
            </View>

            <View style={styles.testCard}>
              <Ionicons name="rocket" size={32} color={theme.colors.primary} />
              <Text style={styles.testTitle}>2. Try Simple Automation</Text>
              <Text style={styles.testDesc}>
                Go to Automation screen and try: "Open browser"
              </Text>
            </View>

            <View style={styles.testCard}>
              <Ionicons name="star" size={32} color={theme.colors.primary} />
              <Text style={styles.testTitle}>3. Test Complex Tasks</Text>
              <Text style={styles.testDesc}>
                Try: "Search for pizza places" or "Open YouTube and search for music"
              </Text>
            </View>

            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]} 
              onPress={() => router.push('/automation')}
            >
              <Ionicons name="play-circle" size={20} color="#fff" />
              <Text style={styles.buttonText}>Go to Automation</Text>
            </TouchableOpacity>

            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={24} color={theme.colors.primary} />
              <Text style={styles.infoText}>
                <Text style={{ fontWeight: 'bold' }}>Important:{' '}</Text>
                This app currently uses placeholder webhook URLs. For production use, you'll need to configure your actual MacroDroid webhook URLs after creating the macros. Each webhook URL is unique to your MacroDroid account.
              </Text>
            </View>
            
            <View style={styles.infoBox}>
              <Ionicons name="help-circle" size={24} color={theme.colors.primary} />
              <Text style={styles.infoText}>
                Troubleshooting: If webhooks don't work, check internet connection, 
                MacroDroid Cloud login, and ensure accessibility permissions are granted.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface.dark,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface.dark,
    paddingHorizontal: theme.spacing.md,
  },
  tab: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginRight: theme.spacing.sm,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.secondary,
  },
  activeTabText: {
    color: theme.colors.primary,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  sectionDescription: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
  },
  step: {
    backgroundColor: theme.colors.surface.default,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.surface.dark,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    flex: 1,
  },
  stepDescription: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  list: {
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  listItem: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface.dark,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    marginTop: theme.spacing.lg,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFA50020',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  warningText: {
    fontSize: 13,
    color: '#FFA500',
    flex: 1,
  },
  webhookCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface.dark,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
  },
  webhookInfo: {
    flex: 1,
  },
  webhookName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  webhookDesc: {
    fontSize: 13,
    color: theme.colors.text.secondary,
  },
  macroCard: {
    backgroundColor: theme.colors.surface.default,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.surface.dark,
  },
  macroTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  macroSection: {
    marginBottom: theme.spacing.md,
  },
  macroLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  macroItem: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xs,
  },
  macroItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  macroItemDesc: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  macroSteps: {
    backgroundColor: theme.colors.surface.dark,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  macroStepsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  macroStep: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  testCard: {
    backgroundColor: theme.colors.surface.default,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.surface.dark,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  testDesc: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface.default,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  infoText: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    flex: 1,
  },
});
