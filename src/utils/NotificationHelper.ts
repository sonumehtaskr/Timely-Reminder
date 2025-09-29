import PushNotification from 'react-native-push-notification';

export class NotificationHelper {
  static configure() {
    PushNotification.configure({
      onNotification: (notification) => {
        console.log('Notification received:', notification);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }

  static scheduleNotification(reminderId: string, title: string, message: string, date: Date) {
    PushNotification.localNotificationSchedule({
      id: reminderId,
      title,
      message,
      date,
      userInfo: { reminderId },
      soundName: 'default',
      playSound: true,
      vibrate: true,
    });
  }

  static cancelNotification(reminderId: string) {
    PushNotification.cancelLocalNotifications({ id: reminderId });
  }

  static cancelAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }
}
