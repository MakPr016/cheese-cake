import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AutomationStep } from '../types';
import { theme } from '../utils/theme';

interface ActionCardProps {
  step: AutomationStep;
  index: number;
}

const ACTION_ICONS: Record<AutomationStep['action'], keyof typeof Ionicons.glyphMap> = {
  tap: 'hand-left-outline',
  type: 'text-outline',
  swipe: 'arrow-forward-outline',
  scroll: 'arrow-down-outline',
  wait: 'time-outline',
  open_app: 'apps-outline',
};

const STATUS_COLORS = {
  pending: theme.colors.textSecondary,
  running: theme.colors.warning,
  completed: theme.colors.success,
  failed: theme.colors.danger,
};

export const ActionCard: React.FC<ActionCardProps> = ({ step, index }) => {
  const iconName = ACTION_ICONS[step.action];
  const statusColor = STATUS_COLORS[step.status || 'pending'];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name={iconName} size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.stepInfo}>
          <Text style={styles.stepNumber}>Step {index + 1}</Text>
          <Text style={styles.actionType}>{step.action.replace('_', ' ').toUpperCase()}</Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
      </View>

      <View style={styles.content}>
        <Text style={styles.target}>{step.target}</Text>
        {step.text && <Text style={styles.text}>Text: "{step.text}"</Text>}
        <Text style={styles.reasoning}>{step.reasoning}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    ...theme.shadows.small,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  stepInfo: {
    flex: 1,
  },
  stepNumber: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  actionType: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: theme.borderRadius.full,
  },
  content: {
    gap: theme.spacing.sm,
  },
  target: {
    fontSize: theme.fontSizes.md,
    fontWeight: '500',
    color: theme.colors.text,
  },
  text: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  reasoning: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textTertiary,
    lineHeight: 18,
  },
});
