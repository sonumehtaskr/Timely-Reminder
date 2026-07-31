import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AddReminderScreen from '@/screen/AddReminder';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <AddReminderScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'red',
  }
});
