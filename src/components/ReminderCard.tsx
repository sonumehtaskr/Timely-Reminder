import { Reminder, RepeatType } from '@/types/reminder.type';
import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ReminderCardProps {
  reminder: Reminder;
  onEdit: () => void;
  onComplete: () => void;
  onDelete: () => void;
  onSnooze: () => void;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  onEdit,
  onComplete,
  onDelete,
  onSnooze,
}) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 24) {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} from now`;
    } else if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m from now`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} from now`;
    } else {
      return 'Now';
    }
  };

  const getRepeatText = (reminder: Reminder) => {
    if (!reminder.isRecurring) return '';

    switch (reminder.repeatType) {
      case RepeatType.DAILY:
        return 'Daily';
      case RepeatType.WEEKLY:
        return 'Weekly';
      case RepeatType.MONTHLY:
        return 'Monthly';
      case RepeatType.CUSTOM:
        return `Every ${reminder.repeatInterval || 1} day${(reminder.repeatInterval || 1) !== 1 ? 's' : ''}`;
      default:
        return '';
    }
  };

  const getPriorityColor = (reminder: Reminder) => {
    const now = new Date();
    const diffMs = reminder.scheduledTime.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 1) return '#ff4444'; // Red for urgent
    if (diffHours < 24) return '#ff9800'; // Orange for today
    return '#4a90e2'; // Blue for future
  };

  const handleLongPress = () => {
    Alert.alert(
      'Reminder Options',
      'What would you like to do with this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Edit', onPress: onEdit },
        { text: 'Complete', onPress: onComplete },
        { text: 'Snooze', onPress: onSnooze },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, { borderLeftColor: getPriorityColor(reminder) }]}
      onPress={onEdit}
      onLongPress={handleLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {reminder.title}
          </Text>
          <Text style={styles.timeText}>
            {formatTime(reminder.scheduledTime)}
          </Text>
        </View>

        {reminder.description && (
          <Text style={styles.description} numberOfLines={2}>
            {reminder.description}
          </Text>
        )}

        <View style={styles.footer}>
          <View style={styles.metaInfo}>
            {reminder.isRecurring && (
              <View style={styles.repeatBadge}>
                <Text style={styles.repeatText}>
                  {getRepeatText(reminder)}
                </Text>
              </View>
            )}

            {reminder.snoozeCount > 0 && (
              <View style={styles.snoozeBadge}>
                <Text style={styles.snoozeText}>
                  Snoozed {reminder.snoozeCount} time{reminder.snoozeCount !== 1 ? 's' : ''}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.dateText}>
            {reminder.scheduledTime.toLocaleDateString()} at{' '}
            {reminder.scheduledTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.completeButton]}
          onPress={onComplete}
        >
          <Text style={styles.actionButtonText}>✓</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.snoozeButton]}
          onPress={onSnooze}
        >
          <Text style={styles.actionButtonText}>⏰</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    padding: 16,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  repeatBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  repeatText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  snoozeBadge: {
    backgroundColor: '#fff3e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  snoozeText: {
    fontSize: 12,
    color: '#f57c00',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
    paddingRight: 16,
    paddingBottom: 16,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  snoozeButton: {
    backgroundColor: '#ff9800',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
