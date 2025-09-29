import { ReminderService } from '../services/ReminderService';
import { Reminder, RepeatType } from '../types/Reminder';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

// Mock PushNotification
jest.mock('react-native-push-notification', () => ({
  configure: jest.fn(),
  localNotificationSchedule: jest.fn(),
  cancelLocalNotifications: jest.fn(),
}));

// Mock TTS
jest.mock('react-native-tts', () => ({
  setDefaultLanguage: jest.fn(() => Promise.resolve()),
  setDefaultRate: jest.fn(() => Promise.resolve()),
  setDefaultPitch: jest.fn(() => Promise.resolve()),
  speak: jest.fn(() => Promise.resolve()),
}));

describe('ReminderService', () => {
  let reminderService: ReminderService;

  beforeEach(() => {
    reminderService = ReminderService.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create a reminder', async () => {
    const reminderData = {
      title: 'Test Reminder',
      description: 'This is a test reminder',
      scheduledTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      isRecurring: false,
      repeatType: RepeatType.ONCE,
      maxSnoozeCount: 3,
    };

    const reminder = await reminderService.addReminder(reminderData);

    expect(reminder).toBeDefined();
    expect(reminder.title).toBe('Test Reminder');
    expect(reminder.id).toBeDefined();
    expect(reminder.createdAt).toBeDefined();
  });

  test('should get upcoming reminders', async () => {
    // Clear any existing reminders
    const allReminders = reminderService.getReminders();
    for (const reminder of allReminders) {
      await reminderService.deleteReminder(reminder.id);
    }

    const futureTime = new Date(Date.now() + 60 * 60 * 1000);
    const reminderData = {
      title: 'Future Reminder',
      description: 'This is a future reminder',
      scheduledTime: futureTime,
      isRecurring: false,
      repeatType: RepeatType.ONCE,
      maxSnoozeCount: 3,
    };

    await reminderService.addReminder(reminderData);
    const upcomingReminders = reminderService.getUpcomingReminders();

    expect(upcomingReminders).toHaveLength(1);
    expect(upcomingReminders[0].title).toBe('Future Reminder');
  });

  test('should calculate next scheduled time for daily reminder', () => {
    const now = new Date();
    const reminder: Reminder = {
      id: '1',
      title: 'Daily Reminder',
      description: 'Test',
      scheduledTime: now,
      isRecurring: true,
      repeatType: RepeatType.DAILY,
      maxSnoozeCount: 3,
      snoozeCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    const nextTime = reminderService['calculateNextScheduledTime'](reminder);
    expect(nextTime).toBeDefined();
    expect(nextTime!.getTime()).toBeGreaterThan(now.getTime());
  });

  test('should handle snooze functionality', async () => {
    const originalTime = new Date(Date.now() + 60 * 60 * 1000);
    const reminderData = {
      title: 'Snooze Test',
      description: 'This reminder can be snoozed',
      scheduledTime: originalTime,
      isRecurring: false,
      repeatType: RepeatType.ONCE,
      maxSnoozeCount: 3,
    };

    const reminder = await reminderService.addReminder(reminderData);
    const snoozedReminder = await reminderService.snoozeReminder(reminder.id, 5);

    expect(snoozedReminder).toBeDefined();
    expect(snoozedReminder!.snoozeCount).toBe(1);
    // Check that the snoozed time is approximately 5 minutes after the original time
    const timeDiff = snoozedReminder!.scheduledTime.getTime() - originalTime.getTime();
    expect(timeDiff).toBeGreaterThan(4 * 60 * 1000); // At least 4 minutes
    expect(timeDiff).toBeLessThan(6 * 60 * 1000); // At most 6 minutes
  });
});
