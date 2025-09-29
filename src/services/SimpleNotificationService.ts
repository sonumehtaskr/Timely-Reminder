import { Alert } from 'react-native';

export class SimpleNotificationService {
  private static scheduledReminders: Map<string, NodeJS.Timeout> = new Map();

  static scheduleNotification(
    reminderId: string,
    title: string,
    message: string,
    scheduledTime: Date,
    onTrigger: (reminderId: string) => void
  ): void {
    // Cancel existing notification if any
    this.cancelNotification(reminderId);

    const now = new Date();
    const delay = scheduledTime.getTime() - now.getTime();

    if (delay <= 0) {
      // If the time has already passed, trigger immediately
      onTrigger(reminderId);
      return;
    }

    // Schedule the notification
    const timeoutId = setTimeout(() => {
      onTrigger(reminderId);
      this.scheduledReminders.delete(reminderId);
    }, delay);

    this.scheduledReminders.set(reminderId, timeoutId);
    console.log(`Scheduled notification for ${reminderId} at ${scheduledTime.toISOString()}`);
  }

  static cancelNotification(reminderId: string): void {
    const timeoutId = this.scheduledReminders.get(reminderId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.scheduledReminders.delete(reminderId);
      console.log(`Cancelled notification for ${reminderId}`);
    }
  }

  static cancelAllNotifications(): void {
    this.scheduledReminders.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    this.scheduledReminders.clear();
    console.log('Cancelled all notifications');
  }

  static showAlert(title: string, message: string): void {
    Alert.alert(title, message);
  }
}
