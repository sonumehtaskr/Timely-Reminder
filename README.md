# Timely Reminder App

A smart reminder app with fake call and Text-to-Speech (TTS) functionality that helps you never miss important tasks.

## Features

### 🔔 Core Features
- **Reminder Creation**: Add reminders with title, description, and scheduled time
- **Fake Incoming Call**: Realistic incoming call screen when reminders trigger
- **Text-to-Speech**: Speaks reminder text aloud when call is answered
- **Recurring Reminders**: Daily, weekly, monthly, or custom interval reminders
- **Snooze Functionality**: Snooze reminders for later
- **Offline Support**: Works completely offline with local storage

### 🎯 User Experience
- Clean, intuitive interface
- Realistic fake call screen with caller name and image
- Smart time formatting (e.g., "2h 30m from now")
- Priority-based color coding for urgent reminders
- Long-press actions for quick reminder management

## Installation

### Prerequisites
- Node.js (>= 20)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **iOS Setup** (if developing for iOS):
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Android Setup**:
   - Ensure Android SDK is installed
   - Create a virtual device or connect a physical device

4. **Run the app**:
   ```bash
   # For Android
   npm run android
   
   # For iOS
   npm run ios
   ```

## Usage

### Creating a Reminder
1. Tap the "+" button on the home screen
2. Enter reminder title and description
3. Select date and time
4. Choose recurring options if needed
5. Set caller name for the fake call
6. Tap "Save"

### Managing Reminders
- **View**: All upcoming reminders are shown on the home screen
- **Edit**: Tap any reminder to edit it
- **Complete**: Tap the checkmark button
- **Snooze**: Tap the clock button to snooze for 5 minutes
- **Delete**: Long-press a reminder and select "Delete"

### Fake Call Experience
When a reminder triggers:
1. A realistic incoming call screen appears
2. Shows caller name and reminder title
3. Options to Answer, Decline, or Snooze
4. Answering the call speaks the reminder aloud
5. Auto-answers after 10 seconds if not answered

## Technical Details

### Architecture
- **React Native**: Cross-platform mobile development
- **TypeScript**: Type-safe development
- **AsyncStorage**: Local data persistence
- **React Navigation**: Screen navigation
- **Push Notifications**: Background reminder scheduling
- **TTS**: Text-to-speech functionality

### Key Components
- `ReminderService`: Core business logic and data management
- `StorageService`: Local data persistence
- `FakeCallScreen`: Realistic incoming call UI
- `ReminderListScreen`: Main screen with reminder list
- `AddReminderScreen`: Reminder creation and editing

### Data Models
- `Reminder`: Core reminder data structure
- `RepeatType`: Enum for recurring options
- `ReminderFormData`: Form data structure

## Permissions

### Android
- `VIBRATE`: For notification vibration
- `WAKE_LOCK`: To wake device for notifications
- `RECEIVE_BOOT_COMPLETED`: To reschedule reminders after reboot
- `SYSTEM_ALERT_WINDOW`: For fake call overlay
- `USE_FULL_SCREEN_INTENT`: For full-screen notifications

### iOS
- Push notification permissions
- TTS permissions

## Development

### Project Structure
```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
├── services/           # Business logic services
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### Adding New Features
1. Create components in `src/components/`
2. Add screens in `src/screens/`
3. Extend services in `src/services/`
4. Update types in `src/types/`

## Troubleshooting

### Common Issues
1. **Notifications not working**: Check device notification permissions
2. **TTS not speaking**: Ensure device volume is up and TTS is enabled
3. **App crashes on startup**: Check that all dependencies are installed
4. **Fake call not appearing**: Verify notification permissions

### Debug Mode
Enable debug logging by setting `__DEV__ = true` in the app configuration.

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions, please create an issue in the repository.