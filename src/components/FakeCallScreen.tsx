import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Reminder } from '../types/Reminder';
import { ReminderService } from '../services/ReminderService';

interface FakeCallScreenProps {
  reminder: Reminder;
  onAnswer: () => void;
  onDecline: () => void;
  onSnooze: () => void;
}

const { width, height } = Dimensions.get('window');

export const FakeCallScreen: React.FC<FakeCallScreenProps> = ({
  reminder,
  onAnswer,
  onDecline,
  onSnooze,
}) => {
  const [isRinging, setIsRinging] = useState(true);
  const [slideAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Slide up animation
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Pulse animation for the call button
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    // Auto-answer after 10 seconds if not answered
    const autoAnswerTimer = setTimeout(() => {
      onAnswer();
    }, 10000);

    return () => {
      pulseAnimation.stop();
      clearTimeout(autoAnswerTimer);
    };
  }, []);

  const handleAnswer = () => {
    setIsRinging(false);
    onAnswer();
  };

  const handleDecline = () => {
    onDecline();
  };

  const handleSnooze = () => {
    onSnooze();
  };

  const slideUp = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
  });

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Background with gradient effect */}
      <View style={styles.background} />
      
      <Animated.View style={[styles.content, { transform: [{ translateY: slideUp }] }]}>
        {/* Caller Info */}
        <View style={styles.callerInfo}>
          {reminder.callerImage ? (
            <Image source={{ uri: reminder.callerImage }} style={styles.callerImage} />
          ) : (
            <View style={styles.defaultCallerImage}>
              <Text style={styles.defaultCallerInitial}>
                {(reminder.callerName || reminder.title).charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          
          <Text style={styles.callerName}>
            {reminder.callerName || 'Reminder'}
          </Text>
          
          <Text style={styles.reminderTitle}>
            {reminder.title}
          </Text>
          
          {isRinging && (
            <Text style={styles.ringingText}>Ringing...</Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {/* Decline Button */}
          <TouchableOpacity
            style={[styles.actionButton, styles.declineButton]}
            onPress={handleDecline}
          >
            <Text style={styles.declineIcon}>📞</Text>
            <Text style={styles.buttonText}>Decline</Text>
          </TouchableOpacity>

          {/* Answer Button */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={[styles.actionButton, styles.answerButton]}
              onPress={handleAnswer}
            >
              <Text style={styles.answerIcon}>📞</Text>
              <Text style={styles.buttonText}>Answer</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Snooze Button */}
          <TouchableOpacity
            style={[styles.actionButton, styles.snoozeButton]}
            onPress={handleSnooze}
          >
            <Text style={styles.snoozeIcon}>⏰</Text>
            <Text style={styles.buttonText}>Snooze</Text>
          </TouchableOpacity>
        </View>

        {/* Reminder Description */}
        {reminder.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>
              {reminder.description}
            </Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  callerInfo: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  callerImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  defaultCallerImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  defaultCallerInitial: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  callerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  reminderTitle: {
    fontSize: 18,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
  },
  ringingText: {
    fontSize: 16,
    color: '#4a90e2',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 40,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  declineButton: {
    backgroundColor: '#ff4444',
  },
  answerButton: {
    backgroundColor: '#4CAF50',
  },
  snoozeButton: {
    backgroundColor: '#ff9800',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  declineIcon: {
    fontSize: 24,
  },
  answerIcon: {
    fontSize: 24,
  },
  snoozeIcon: {
    fontSize: 24,
  },
  descriptionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
  },
  descriptionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});
