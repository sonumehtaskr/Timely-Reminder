export interface Reminder {
  id: string;
  title: string;
  description: string;
  scheduledTime: Date;
  isCompleted: boolean;
  isRecurring: boolean;
  repeatType: RepeatType;
  repeatInterval?: number; // For custom intervals (e.g., every 10 days)
  nextScheduledTime?: Date; // For recurring reminders
  callerName?: string;
  callerImage?: string;
  customRingtone?: string;
  snoozeCount: number;
  maxSnoozeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum RepeatType {
  ONCE = 'once',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom'
}

export interface ReminderFormData {
  title: string;
  description: string;
  scheduledTime: Date;
  isRecurring: boolean;
  repeatType: RepeatType;
  repeatInterval?: number;
  callerName?: string;
  callerImage?: string;
  customRingtone?: string;
  maxSnoozeCount: number;
}

export interface NotificationData {
  reminderId: string;
  title: string;
  description: string;
  callerName?: string;
  callerImage?: string;
}
