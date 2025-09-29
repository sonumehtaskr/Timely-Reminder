/**
 * Timely Reminder App
 * Smart reminder app with fake call and TTS functionality
 */

import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ReminderListScreen } from './src/screens/ReminderListScreen';
import { AddReminderScreen } from './src/screens/AddReminderScreen';
import { FakeCallScreen } from './src/components/FakeCallScreen';
import { ReminderService } from './src/services/ReminderService';
import { Reminder } from './src/types/Reminder';
import { RootStackParamList } from './src/types/AppState';

const Stack = createStackNavigator<RootStackParamList>();

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFakeCallActive, setIsFakeCallActive] = useState(false);
  const [currentReminder, setCurrentReminder] = useState<Reminder | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const reminderService = ReminderService.getInstance();
      await reminderService.initialize();
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing app:', error);
      // Don't show alert for TTS errors, just continue
      setIsInitialized(true);
    }
  };

  const handleReminderNotification = (reminderId: string) => {
    const reminderService = ReminderService.getInstance();
    const reminder = reminderService.getReminders().find(r => r.id === reminderId);
    
    if (reminder) {
      console.log('Reminder triggered:', reminder.title);
      setCurrentReminder(reminder);
      setIsFakeCallActive(true);
    }
  };

  const handleAnswerCall = async () => {
    if (currentReminder) {
      const reminderService = ReminderService.getInstance();
      await reminderService.speakReminder(currentReminder);
    }
    setIsFakeCallActive(false);
    setCurrentReminder(null);
  };

  const handleDeclineCall = () => {
    setIsFakeCallActive(false);
    setCurrentReminder(null);
  };

  const handleSnoozeCall = async () => {
    if (currentReminder) {
      const reminderService = ReminderService.getInstance();
      await reminderService.snoozeReminder(currentReminder.id, 5);
    }
    setIsFakeCallActive(false);
    setCurrentReminder(null);
  };

  if (!isInitialized) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <StatusBar barStyle="dark-content" />
          {/* Loading screen would go here */}
        </View>
      </SafeAreaProvider>
    );
  }

  if (isFakeCallActive && currentReminder) {
    return (
      <SafeAreaProvider>
        <StatusBar hidden />
        <FakeCallScreen
          reminder={currentReminder}
          onAnswer={handleAnswerCall}
          onDecline={handleDeclineCall}
          onSnooze={handleSnoozeCall}
        />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={ReminderListScreen} />
          <Stack.Screen 
            name="AddReminder" 
            component={AddReminderScreen}
            options={{
              presentation: 'modal',
            }}
          />
          <Stack.Screen 
            name="EditReminder" 
            component={AddReminderScreen}
            options={{
              presentation: 'modal',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default App;
