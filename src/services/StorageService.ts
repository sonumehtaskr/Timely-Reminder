import AsyncStorage from '@react-native-async-storage/async-storage';
import { Reminder } from '../types/Reminder';

const REMINDERS_KEY = 'reminders';

export class StorageService {
  static async saveReminders(reminders: Reminder[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(reminders);
      await AsyncStorage.setItem(REMINDERS_KEY, jsonValue);
    } catch (error) {
      console.error('Error saving reminders:', error);
      throw error;
    }
  }

  static async loadReminders(): Promise<Reminder[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(REMINDERS_KEY);
      if (jsonValue !== null) {
        const reminders = JSON.parse(jsonValue);
        // Convert date strings back to Date objects
        return reminders.map((reminder: any) => ({
          ...reminder,
          scheduledTime: new Date(reminder.scheduledTime),
          nextScheduledTime: reminder.nextScheduledTime ? new Date(reminder.nextScheduledTime) : undefined,
          createdAt: new Date(reminder.createdAt),
          updatedAt: new Date(reminder.updatedAt),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading reminders:', error);
      return [];
    }
  }

  static async saveReminder(reminder: Reminder): Promise<void> {
    try {
      const reminders = await this.loadReminders();
      const existingIndex = reminders.findIndex(r => r.id === reminder.id);
      
      if (existingIndex >= 0) {
        reminders[existingIndex] = reminder;
      } else {
        reminders.push(reminder);
      }
      
      await this.saveReminders(reminders);
    } catch (error) {
      console.error('Error saving reminder:', error);
      throw error;
    }
  }

  static async deleteReminder(reminderId: string): Promise<void> {
    try {
      const reminders = await this.loadReminders();
      const filteredReminders = reminders.filter(r => r.id !== reminderId);
      await this.saveReminders(filteredReminders);
    } catch (error) {
      console.error('Error deleting reminder:', error);
      throw error;
    }
  }

  static async getReminder(reminderId: string): Promise<Reminder | null> {
    try {
      const reminders = await this.loadReminders();
      return reminders.find(r => r.id === reminderId) || null;
    } catch (error) {
      console.error('Error getting reminder:', error);
      return null;
    }
  }
}
