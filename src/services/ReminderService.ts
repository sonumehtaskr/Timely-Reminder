import { Reminder, RepeatType } from '../types/Reminder';
import { StorageService } from './StorageService';
import { TTSHelper } from '../utils/TTSHelper';
import { SimpleNotificationService } from './SimpleNotificationService';

export class ReminderService {
  private static instance: ReminderService;
  private reminders: Reminder[] = [];
  private isInitialized = false;

  static getInstance(): ReminderService {
    if (!ReminderService.instance) {
      ReminderService.instance = new ReminderService();
    }
    return ReminderService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize TTS with proper error handling
      try {
        await TTSHelper.initialize();
        console.log('TTS initialized successfully');
      } catch (ttsError) {
        console.warn('TTS initialization failed, continuing without TTS:', ttsError);
        // Continue without TTS - the app will still work for other features
      }

      // Simple notification service doesn't need configuration
      console.log('Simple notification service ready');

      // Load existing reminders
      this.reminders = await StorageService.loadReminders();
      this.scheduleAllReminders();
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing ReminderService:', error);
      // Don't throw error, just log it and continue
      this.isInitialized = true;
    }
  }

  async addReminder(reminderData: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt' | 'snoozeCount'>): Promise<Reminder> {
    const reminder: Reminder = {
      ...reminderData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      snoozeCount: 0,
    };

    this.reminders.push(reminder);
    await StorageService.saveReminder(reminder);
    this.scheduleReminder(reminder);

    return reminder;
  }

  async updateReminder(reminderId: string, updates: Partial<Reminder>): Promise<Reminder | null> {
    const index = this.reminders.findIndex(r => r.id === reminderId);
    if (index === -1) return null;

    const updatedReminder = {
      ...this.reminders[index],
      ...updates,
      updatedAt: new Date(),
    };

    this.reminders[index] = updatedReminder;
    await StorageService.saveReminder(updatedReminder);
    
    // Cancel existing notification and reschedule
    SimpleNotificationService.cancelNotification(reminderId);
    this.scheduleReminder(updatedReminder);

    return updatedReminder;
  }

  async deleteReminder(reminderId: string): Promise<boolean> {
    const index = this.reminders.findIndex(r => r.id === reminderId);
    if (index === -1) return false;

    this.reminders.splice(index, 1);
    await StorageService.deleteReminder(reminderId);
    SimpleNotificationService.cancelNotification(reminderId);

    return true;
  }

  async completeReminder(reminderId: string): Promise<Reminder | null> {
    const reminder = this.reminders.find(r => r.id === reminderId);
    if (!reminder) return null;

    if (reminder.isRecurring) {
      // For recurring reminders, schedule the next occurrence
      const nextTime = this.calculateNextScheduledTime(reminder);
      if (nextTime) {
        return this.updateReminder(reminderId, {
          scheduledTime: nextTime,
          nextScheduledTime: nextTime,
          snoozeCount: 0,
        });
      }
    }

    return this.updateReminder(reminderId, { isCompleted: true });
  }

  async snoozeReminder(reminderId: string, snoozeMinutes: number = 5): Promise<Reminder | null> {
    const reminder = this.reminders.find(r => r.id === reminderId);
    if (!reminder || reminder.snoozeCount >= reminder.maxSnoozeCount) return null;

    const snoozeTime = new Date(reminder.scheduledTime.getTime() + snoozeMinutes * 60 * 1000);
    
    return this.updateReminder(reminderId, {
      scheduledTime: snoozeTime,
      snoozeCount: reminder.snoozeCount + 1,
    });
  }

  getReminders(): Reminder[] {
    return [...this.reminders];
  }

  getReminder(reminderId: string): Reminder | null {
    return this.reminders.find(r => r.id === reminderId) || null;
  }

  getUpcomingReminders(): Reminder[] {
    const now = new Date();
    return this.reminders
      .filter(r => !r.isCompleted && r.scheduledTime > now)
      .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());
  }

  private scheduleReminder(reminder: Reminder): void {
    if (reminder.isCompleted) return;

    const now = new Date();
    const scheduledTime = reminder.scheduledTime;

    if (scheduledTime <= now) return;

    SimpleNotificationService.scheduleNotification(
      reminder.id,
      reminder.callerName || 'Reminder',
      reminder.title,
      scheduledTime,
      (reminderId) => this.handleReminderNotification(reminderId)
    );
  }

  private scheduleAllReminders(): void {
    this.reminders
      .filter(r => !r.isCompleted)
      .forEach(reminder => this.scheduleReminder(reminder));
  }

  private calculateNextScheduledTime(reminder: Reminder): Date | null {
    const now = new Date();
    const currentTime = reminder.scheduledTime;

    switch (reminder.repeatType) {
      case RepeatType.DAILY:
        return new Date(currentTime.getTime() + 24 * 60 * 60 * 1000);
      
      case RepeatType.WEEKLY:
        return new Date(currentTime.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      case RepeatType.MONTHLY:
        const nextMonth = new Date(currentTime);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return nextMonth;
      
      case RepeatType.CUSTOM:
        if (reminder.repeatInterval) {
          return new Date(currentTime.getTime() + reminder.repeatInterval * 24 * 60 * 60 * 1000);
        }
        return null;
      
      default:
        return null;
    }
  }

  private async handleReminderNotification(reminderId: string): Promise<void> {
    const reminder = this.reminders.find(r => r.id === reminderId);
    if (!reminder) return;

    // Trigger fake call screen
    // This will be handled by the UI layer
    console.log('Reminder triggered:', reminder.title);
  }

  async speakReminder(reminder: Reminder): Promise<void> {
    try {
      const text = `Reminder: ${reminder.title}. ${reminder.description}`;
      await TTSHelper.speak(text);
    } catch (error) {
      console.warn('TTS: Could not speak reminder, TTS may not be available:', error);
    }
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
