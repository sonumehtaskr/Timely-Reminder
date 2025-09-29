export interface AppState {
  reminders: Reminder[];
  isFakeCallActive: boolean;
  currentReminder?: Reminder;
  isLoading: boolean;
  error?: string;
}

export interface RootStackParamList {
  Home: undefined;
  AddReminder: { reminderId?: string };
  EditReminder: { reminderId: string };
  FakeCall: { reminderId: string };
}
