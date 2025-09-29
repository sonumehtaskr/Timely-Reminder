import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Reminder, RepeatType, ReminderFormData } from '../types/Reminder';
import { ReminderService } from '../services/ReminderService';

interface AddReminderScreenProps {
  navigation: any;
  route: {
    params?: {
      reminderId?: string;
    };
  };
}

export const AddReminderScreen: React.FC<AddReminderScreenProps> = ({
  navigation,
  route,
}) => {
  const [formData, setFormData] = useState<ReminderFormData>({
    title: '',
    description: '',
    scheduledTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
    isRecurring: false,
    repeatType: RepeatType.ONCE,
    repeatInterval: 1,
    callerName: '',
    callerImage: '',
    customRingtone: '',
    maxSnoozeCount: 3,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const reminderService = ReminderService.getInstance();

  useEffect(() => {
    if (route.params?.reminderId) {
      loadReminderForEdit(route.params.reminderId);
    }
  }, [route.params?.reminderId]);

  const loadReminderForEdit = async (reminderId: string) => {
    try {
      setIsLoading(true);
      const reminder = await reminderService.getReminder(reminderId);
      if (reminder) {
        setFormData({
          title: reminder.title,
          description: reminder.description,
          scheduledTime: reminder.scheduledTime,
          isRecurring: reminder.isRecurring,
          repeatType: reminder.repeatType,
          repeatInterval: reminder.repeatInterval,
          callerName: reminder.callerName || '',
          callerImage: reminder.callerImage || '',
          customRingtone: reminder.customRingtone || '',
          maxSnoozeCount: reminder.maxSnoozeCount,
        });
        setIsEditMode(true);
      }
    } catch (error) {
      console.error('Error loading reminder:', error);
      Alert.alert('Error', 'Failed to load reminder');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a title for the reminder');
      return;
    }

    if (formData.scheduledTime <= new Date()) {
      Alert.alert('Error', 'Please select a future date and time');
      return;
    }

    try {
      setIsLoading(true);

      if (isEditMode && route.params?.reminderId) {
        await reminderService.updateReminder(route.params.reminderId, {
          ...formData,
          updatedAt: new Date(),
        });
        Alert.alert('Success', 'Reminder updated successfully');
      } else {
        await reminderService.addReminder(formData);
        Alert.alert('Success', 'Reminder created successfully');
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error saving reminder:', error);
      Alert.alert('Error', 'Failed to save reminder');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        scheduledTime: new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          prev.scheduledTime.getHours(),
          prev.scheduledTime.getMinutes()
        ),
      }));
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setFormData(prev => ({
        ...prev,
        scheduledTime: new Date(
          prev.scheduledTime.getFullYear(),
          prev.scheduledTime.getMonth(),
          prev.scheduledTime.getDate(),
          selectedTime.getHours(),
          selectedTime.getMinutes()
        ),
      }));
    }
  };

  const getRepeatTypeLabel = (type: RepeatType) => {
    switch (type) {
      case RepeatType.ONCE:
        return 'Once';
      case RepeatType.DAILY:
        return 'Daily';
      case RepeatType.WEEKLY:
        return 'Weekly';
      case RepeatType.MONTHLY:
        return 'Monthly';
      case RepeatType.CUSTOM:
        return 'Custom';
      default:
        return 'Once';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {isEditMode ? 'Edit Reminder' : 'Add Reminder'}
          </Text>
          <TouchableOpacity onPress={handleSave} disabled={isLoading}>
            <Text style={[styles.saveButton, isLoading && styles.disabledButton]}>
              {isLoading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          {/* Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
              placeholder="Enter reminder title"
              maxLength={100}
            />
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              placeholder="Enter reminder description"
              multiline
              numberOfLines={3}
              maxLength={500}
            />
          </View>

          {/* Date and Time */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date & Time *</Text>
            <View style={styles.dateTimeContainer}>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateTimeText}>
                  {formData.scheduledTime.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.dateTimeText}>
                  {formData.scheduledTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recurring Options */}
          <View style={styles.inputGroup}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setFormData(prev => ({ ...prev, isRecurring: !prev.isRecurring }))}
            >
              <View style={[styles.checkbox, formData.isRecurring && styles.checkboxChecked]}>
                {formData.isRecurring && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Make this a recurring reminder</Text>
            </TouchableOpacity>

            {formData.isRecurring && (
              <View style={styles.recurringOptions}>
                <Text style={styles.label}>Repeat</Text>
                <View style={styles.repeatButtons}>
                  {Object.values(RepeatType).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.repeatButton,
                        formData.repeatType === type && styles.repeatButtonActive,
                      ]}
                      onPress={() => setFormData(prev => ({ ...prev, repeatType: type }))}
                    >
                      <Text
                        style={[
                          styles.repeatButtonText,
                          formData.repeatType === type && styles.repeatButtonTextActive,
                        ]}
                      >
                        {getRepeatTypeLabel(type)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {formData.repeatType === RepeatType.CUSTOM && (
                  <View style={styles.customIntervalContainer}>
                    <Text style={styles.label}>Every</Text>
                    <TextInput
                      style={[styles.input, styles.customIntervalInput]}
                      value={formData.repeatInterval?.toString() || '1'}
                      onChangeText={(text) => setFormData(prev => ({
                        ...prev,
                        repeatInterval: parseInt(text) || 1,
                      }))}
                      keyboardType="numeric"
                      placeholder="1"
                    />
                    <Text style={styles.intervalLabel}>days</Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Caller Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Caller Name</Text>
            <TextInput
              style={styles.input}
              value={formData.callerName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, callerName: text }))}
              placeholder="Name to display on fake call"
              maxLength={50}
            />
          </View>

          {/* Max Snooze Count */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Max Snooze Count</Text>
            <TextInput
              style={[styles.input, styles.snoozeInput]}
              value={formData.maxSnoozeCount.toString()}
              onChangeText={(text) => setFormData(prev => ({
                ...prev,
                maxSnoozeCount: parseInt(text) || 3,
              }))}
              keyboardType="numeric"
              placeholder="3"
            />
            <Text style={styles.helpText}>
              Maximum number of times this reminder can be snoozed
            </Text>
          </View>
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={formData.scheduledTime}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={formData.scheduledTime}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cancelButton: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  saveButton: {
    fontSize: 16,
    color: '#4a90e2',
    fontWeight: '600',
  },
  disabledButton: {
    color: '#ccc',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateTimeText: {
    fontSize: 16,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4a90e2',
    borderColor: '#4a90e2',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  recurringOptions: {
    marginTop: 16,
    paddingLeft: 36,
  },
  repeatButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  repeatButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  repeatButtonActive: {
    backgroundColor: '#4a90e2',
    borderColor: '#4a90e2',
  },
  repeatButtonText: {
    fontSize: 14,
    color: '#666',
  },
  repeatButtonTextActive: {
    color: '#fff',
  },
  customIntervalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  customIntervalInput: {
    width: 60,
    textAlign: 'center',
  },
  intervalLabel: {
    fontSize: 16,
    color: '#666',
  },
  snoozeInput: {
    width: 80,
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
