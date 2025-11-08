import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/src/utils/theme';
import { AutomationStep } from '@/src/types';
import { ActionCard } from '@/src/components/ActionCard';
import { PolarisService } from '@/src/services/PolarisService';
import { AutomationService } from '@/src/services/AutomationService';
import { getApiKey } from '@/src/utils/storage';

export default function AutomationScreen() {
  const [taskInput, setTaskInput] = useState('');
  const [steps, setSteps] = useState<AutomationStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [polarisService, setPolarisService] = useState<PolarisService | null>(null);
  const automationService = new AutomationService();

  useEffect(() => {
    initializeServices();
  }, []);

  const initializeServices = async () => {
    const apiKey = await getApiKey();
    if (!apiKey) {
      Alert.alert('API Key Required', 'Please configure your API key in Settings first.');
      return;
    }

    setPolarisService(new PolarisService(apiKey));
  };

  const planTask = async () => {
    if (!taskInput.trim() || !polarisService) return;

    setLoading(true);
    try {
      const automationSteps = await polarisService.planTask(taskInput.trim());
      setSteps(automationSteps);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to plan task');
    } finally {
      setLoading(false);
    }
  };

  const executeAutomation = async () => {
    if (steps.length === 0) return;

    setExecuting(true);
    
    try {
      await automationService.executePlan(steps, (stepIndex, status) => {
        setSteps((prevSteps) => {
          const newSteps = [...prevSteps];
          newSteps[stepIndex] = { ...newSteps[stepIndex], status };
          return newSteps;
        });
      });

      Alert.alert('Success', 'Automation plan completed!');
    } catch (error) {
      Alert.alert('Error', 'Failed to execute automation');
    } finally {
      setExecuting(false);
    }
  };

  const clearPlan = () => {
    setSteps([]);
    setTaskInput('');
  };

  const estimatedTime = steps.length > 0 
    ? automationService.estimateExecutionTime(steps).toFixed(1) 
    : '0';

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Automation',
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text,
        }}
      />

      <View style={styles.inputSection}>
        <Text style={styles.label}>Task Description</Text>
        <TextInput
          style={styles.input}
          value={taskInput}
          onChangeText={setTaskInput}
          placeholder="E.g., Send a text to John saying hello"
          placeholderTextColor={theme.colors.textTertiary}
          multiline
          maxLength={200}
        />

        <Pressable
          style={[styles.button, styles.primaryButton, (!taskInput.trim() || loading) && styles.buttonDisabled]}
          onPress={planTask}
          disabled={!taskInput.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.text} />
          ) : (
            <>
              <Ionicons name="hammer" size={20} color={theme.colors.text} />
              <Text style={styles.buttonText}>Plan Task</Text>
            </>
          )}
        </Pressable>
      </View>

      {steps.length > 0 && (
        <View style={styles.infoBar}>
          <View style={styles.infoItem}>
            <Ionicons name="list" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.infoText}>{steps.length} steps</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="time" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.infoText}>~{estimatedTime}s</Text>
          </View>
          <Pressable onPress={clearPlan}>
            <Ionicons name="close-circle" size={24} color={theme.colors.danger} />
          </Pressable>
        </View>
      )}

      <ScrollView style={styles.stepsContainer} contentContainerStyle={styles.stepsContent}>
        {steps.length > 0 ? (
          <>
            {steps.map((step, index) => (
              <ActionCard key={index} step={step} index={index} />
            ))}

            <Pressable
              style={[styles.button, styles.executeButton, executing && styles.buttonDisabled]}
              onPress={executeAutomation}
              disabled={executing}
            >
              {executing ? (
                <ActivityIndicator size="small" color={theme.colors.text} />
              ) : (
                <>
                  <Ionicons name="play" size={20} color={theme.colors.text} />
                  <Text style={styles.buttonText}>Execute Automation</Text>
                </>
              )}
            </Pressable>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="construct-outline" size={64} color={theme.colors.textTertiary} />
            <Text style={styles.emptyText}>
              Describe a task and tap "Plan Task" to see the automation steps
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  inputSection: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  label: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    minHeight: 80,
    marginBottom: theme.spacing.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  executeButton: {
    backgroundColor: theme.colors.success,
    marginTop: theme.spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  infoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  stepsContainer: {
    flex: 1,
  },
  stepsContent: {
    padding: theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
    gap: theme.spacing.md,
  },
  emptyText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
});
