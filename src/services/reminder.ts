import { Reminder, ReminderFormData } from '@/types/reminder.type';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from "./sorage";

export interface ReminderStore {
    reminders: Reminder[];
    addReminder: (reminder: ReminderFormData) => void;
    updateReminder: (updatedReminder: ReminderFormData, reminderId: string) => void;
    deleteReminder: (reminderId: string) => void;
}

export const useReminderStore = create<ReminderStore>()(persist(
    (set, get) => ({
        reminders: [] as Reminder[],
        addReminder: (reminder: ReminderFormData) => {
            console.log('Adding reminder:', reminder);
            set((state) => ({
                reminders: [...state.reminders, {
                    ...reminder, id: Date.now().toString(), createdAt: new Date(), updatedAt: new Date(),
                    nextScheduledTime: reminder.scheduledTime, snoozeCount: 0, isCompleted: false
                }],
            }));
        },
        updateReminder: (updatedReminder: ReminderFormData, reminderId: string) => {
            set((state) => ({
                reminders: state.reminders.map((reminder) => {
                    if (reminder.id === reminderId) {
                        return { ...reminder, ...updatedReminder, updatedAt: new Date() };
                    }
                    return reminder;
                }),
            }));
        },
        deleteReminder: (reminderId: string) => {
            set((state) => ({
                reminders: state.reminders.filter((reminder) => reminder.id !== reminderId),
            }));
        },
    }),
    {
        name: "reminders",
        storage: createJSONStorage(() => mmkvStorage),
    })
);