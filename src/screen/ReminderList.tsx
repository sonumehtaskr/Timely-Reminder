import { ReminderCard } from '@/components/ReminderCard';
import { useReminderStore } from '@/services/reminder';
import { Reminder } from '@/types/reminder.type';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export const ReminderListScreen = () => {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const { reminders: storedReminders } = useReminderStore();

     if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading reminders...</Text>
            </View>
        );
    }

    const loadReminders = useCallback(async () => {
        try {
            setIsLoading(true);
            setReminders(storedReminders);
        } catch (error) {
            console.error('Error loading reminders:', error);
            Alert.alert('Error', 'Failed to load reminders');
        } finally {
            setIsLoading(false);
        }
    }, [storedReminders]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadReminders();
        setRefreshing(false);
    }, [loadReminders]);


    const handleAddReminder = () => {
        console.log('Navigate to Add Reminder screen');
        router.push('/add-reminder');
    };

    const handleEditReminder = (reminderId: string) => {
        console.log('Edit reminder with ID:', reminderId);
    };

    const handleCompleteReminder = async (reminderId: string) => {
        try {
           console.log('Complete reminder with ID:', reminderId);
        } catch (error) {
            console.error('Error completing reminder:', error);
            Alert.alert('Error', 'Failed to complete reminder');
        }
    };

    const handleDeleteReminder = (reminderId: string) => {
        Alert.alert(
            'Delete Reminder',
            'Are you sure you want to delete this reminder?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                           console.log('Delete reminder with ID:', reminderId);
                        } catch (error) {
                            console.error('Error deleting reminder:', error);
                            Alert.alert('Error', 'Failed to delete reminder');
                        }
                    },
                },
            ]
        );
    };

    const handleSnoozeReminder = async (reminderId: string) => {
        try {
            console.log('Snooze reminder with ID:', reminderId);
        } catch (error) {
            console.error('Error snoozing reminder:', error);
            Alert.alert('Error', 'Failed to snooze reminder');
        }
    };

    const renderReminder = ({ item }: { item: Reminder }) => (
        <ReminderCard
            reminder={item}
            onEdit={() => handleEditReminder(item.id)}
            onComplete={() => handleCompleteReminder(item.id)}
            onDelete={() => handleDeleteReminder(item.id)}
            onSnooze={() => handleSnoozeReminder(item.id)}
        />
    );

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>⏰</Text>
            <Text style={styles.emptyStateTitle}>No Reminders</Text>
            <Text style={styles.emptyStateText}>
                You don't have any upcoming reminders.{'\n'}
                Tap the + button to add your first reminder.
            </Text>
        </View>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading reminders...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Timely Reminder</Text>
                <Text style={styles.subtitle}>
                    {reminders.length} upcoming reminder{reminders.length !== 1 ? 's' : ''}
                </Text>
            </View>

            <FlatList
                data={reminders}
                renderItem={renderReminder}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={renderEmptyState}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity style={styles.addButton} onPress={handleAddReminder}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ReminderListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    header: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    listContainer: {
        padding: 16,
        flexGrow: 1,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyStateIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyStateTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
    },
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4a90e2',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    addButtonText: {
        fontSize: 32,
        color: '#fff',
        fontWeight: '300',
    },
});
