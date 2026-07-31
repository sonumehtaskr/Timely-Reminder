// import DateTimePicker from '@react-native-community/datetimepicker';
import { CustomInput } from '@/components/CustomInput';
import { useReminderStore } from '@/services/reminder';
import { ReminderFormData, RepeatType } from '@/types/reminder.type';
import DateTimePicker from '@expo/ui/community/datetime-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export const AddReminderScreen = () => {
    const [formData, setFormData] = useState<ReminderFormData>({
        title: '',
        description: '',
        scheduledTime: new Date(Date.now() + 60 * 60 * 1000),
        isRecurring: false,
        repeatType: RepeatType.ONCE,
        repeatInterval: 1,
        callerName: '',
        callerImage: '',
        customRingtone: '',
        maxSnoozeCount: 3,
    });
    const { reminders, addReminder, updateReminder } = useReminderStore();
    const params = useLocalSearchParams<{ reminderId?: string }>();

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        if (params?.reminderId) {
            loadReminderForEdit(params.reminderId);
        }
    }, [params?.reminderId]);

    const loadReminderForEdit = async (reminderId: string) => {
        try {
            setIsLoading(true);
            const reminder = reminders.find(r => r.id === reminderId);
            if (reminder) {
                setFormData({
                    title: reminder.title,
                    description: reminder.description,
                    scheduledTime: reminder.scheduledTime,
                    isRecurring: reminder.isRecurring,
                    repeatType: reminder.repeatType,
                    repeatInterval: reminder.repeatInterval,
                    callerName: reminder.callerName || '',
                    callerImage: reminder.callerImage || '',
                    customRingtone: reminder.customRingtone || '',
                    maxSnoozeCount: reminder.maxSnoozeCount,
                });
                setIsEditMode(true);
            }
        } catch (error) {
            console.error('Error loading reminder:', error);
            Alert.alert('Error', 'Failed to load reminder');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.title.trim()) {
            Alert.alert('Error', 'Please enter a title for the reminder');
            return;
        }

        if (formData.scheduledTime <= new Date()) {
            Alert.alert('Error', 'Please select a future date and time');
            return;
        }

        try {
            setIsLoading(true);

            if (isEditMode && params?.reminderId) {
                updateReminder(formData, params.reminderId);
                Alert.alert('Success', 'Reminder updated successfully');
            } else {
                addReminder(formData);
                Alert.alert('Success', 'Reminder created successfully');
            }
            router.back();
        } catch (error) {
            console.error('Error saving reminder:', error);
            Alert.alert('Error', 'Failed to save reminder');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setFormData(prev => ({
                ...prev,
                scheduledTime: new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate(),
                    prev.scheduledTime.getHours(),
                    prev.scheduledTime.getMinutes()
                ),
            }));
        }
    };

    const handleTimeChange = (event: any, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (selectedTime) {
            setFormData(prev => ({
                ...prev,
                scheduledTime: new Date(
                    prev.scheduledTime.getFullYear(),
                    prev.scheduledTime.getMonth(),
                    prev.scheduledTime.getDate(),
                    selectedTime.getHours(),
                    selectedTime.getMinutes()
                ),
            }));
        }
    };

    const getRepeatTypeLabel = (type: RepeatType) => {
        switch (type) {
            case RepeatType.ONCE: return 'Once';
            case RepeatType.DAILY: return 'Daily';
            case RepeatType.WEEKLY: return 'Weekly';
            case RepeatType.MONTHLY: return 'Monthly';
            case RepeatType.CUSTOM: return 'Custom';
            default: return 'Once';
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {isEditMode ? 'Edit Reminder' : 'New Reminder'}
                </Text>
                <TouchableOpacity onPress={handleSave} disabled={isLoading} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Text style={[styles.saveButton, isLoading && styles.disabledButton]}>
                        {isLoading ? 'Saving...' : 'Save'}
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

                {/* SECTION 1: Main Info */}
                <View style={styles.section}>

                    <CustomInput
                        label="Title *"
                        variant="stacked"
                        value={formData.title}
                        onChangeText={(text: string) => setFormData(prev => ({ ...prev, title: text }))}
                        placeholder="What do you need to remember?"
                        style={{ fontSize: 20 }}
                    />

                    <View style={styles.divider} />

                    <CustomInput
                        label="Notes"
                        variant="stacked"
                        hideDivider
                        value={formData.description}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                        placeholder="Add any extra details here..."
                        multiline
                        numberOfLines={3}
                        style={{ minHeight: 70, textAlignVertical: 'top' }}
                    />
                </View>

                <Text style={styles.sectionHeader}>SCHEDULE</Text>
                <View style={styles.section}>
                    <TouchableOpacity style={styles.row} onPress={() => setShowDatePicker(true)} activeOpacity={0.6}>
                        <Text style={styles.rowLabel}>Date</Text>
                        <Text style={styles.rowValueText}>
                            {formData.scheduledTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.row} onPress={() => setShowTimePicker(true)} activeOpacity={0.6}>
                        <Text style={styles.rowLabel}>Time</Text>
                        <Text style={styles.rowValueText}>
                            {formData.scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* SECTION 3: Recurrence */}
                <Text style={styles.sectionHeader}>REPETITION</Text>
                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.row}
                        onPress={() => setFormData(prev => ({ ...prev, isRecurring: !prev.isRecurring }))}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.rowLabel}>Recurring Reminder</Text>
                        <View style={[styles.circleCheck, formData.isRecurring && styles.circleCheckActive]}>
                            {formData.isRecurring && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                    </TouchableOpacity>

                    {formData.isRecurring && (
                        <>
                            <View style={styles.divider} />
                            <View style={styles.segmentedControlContainer}>
                                {Object.values(RepeatType).map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.segmentButton,
                                            formData.repeatType === type && styles.segmentButtonActive
                                        ]}
                                        onPress={() => setFormData(prev => ({ ...prev, repeatType: type }))}
                                    >
                                        <Text style={[
                                            styles.segmentText,
                                            formData.repeatType === type && styles.segmentTextActive
                                        ]}>
                                            {getRepeatTypeLabel(type)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {formData.repeatType === RepeatType.CUSTOM && (
                                <>
                                    <View style={styles.divider} />
                                    <View style={styles.row}>
                                        <Text style={styles.rowLabel}>Interval</Text>
                                        <View style={styles.customIntervalRight}>
                                            <Text style={styles.intervalText}>Every</Text>
                                            <TextInput
                                                style={styles.intervalInput}
                                                value={formData.repeatInterval?.toString() || '1'}
                                                onChangeText={(text) => setFormData(prev => ({
                                                    ...prev,
                                                    repeatInterval: parseInt(text) || 1,
                                                }))}
                                                keyboardType="numeric"
                                                placeholder="1"
                                                maxLength={3}
                                            />
                                            <Text style={styles.intervalText}>days</Text>
                                        </View>
                                    </View>
                                </>
                            )}
                        </>
                    )}
                </View>

                {/* SECTION 4: Advanced Options */}
                <Text style={styles.sectionHeader}>ADVANCED OPTIONS</Text>
                <View style={styles.section}>
                    <CustomInput
                        label="Caller Name"
                        variant="inline"
                        value={formData.callerName}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, callerName: text }))}
                        placeholder="Optional"
                    />
                    <CustomInput
                        label="Max Snoozes"
                        subLabel="Limit delay attempts"
                        variant="inline"
                        hideDivider
                        value={formData.maxSnoozeCount.toString()}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, maxSnoozeCount: parseInt(text) || 3 }))}
                        keyboardType="numeric"
                        style={{ maxWidth: 50 }}
                    />
                </View>

                <View style={{ height: 60 }} />
            </ScrollView>

            {showDatePicker && (
                <DateTimePicker
                    value={formData.scheduledTime}
                    mode="date"
                    presentation="dialog"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                />
            )}

            {showTimePicker && (
                <DateTimePicker
                    value={formData.scheduledTime}
                    mode="time"
                    presentation="dialog"
                    minimumDate={new Date()}
                    onChange={handleTimeChange}
                    is24Hour={false}
                />
            )}
        </KeyboardAvoidingView>
    );
};

export default AddReminderScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5', // Maintained strict theme
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 56 : 20,
        paddingBottom: 16,
        backgroundColor: '#f5f5f5', // Blends smoothly into background
    },
    cancelButton: {
        fontSize: 17,
        color: '#666',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#333',
    },
    saveButton: {
        fontSize: 17,
        color: '#4a90e2',
        fontWeight: '700',
    },
    disabledButton: {
        color: '#ccc',
    },
    scrollView: {
        flex: 1,
    },
    sectionHeader: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666',
        marginLeft: 24,
        marginBottom: 8,
        marginTop: 24,
        letterSpacing: 0.5,
    },
    section: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        overflow: 'hidden',
        marginTop: 16, // Top margin for the first section
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginLeft: 16,
    },
    inputContainerStack: {
        padding: 16,
        backgroundColor: '#fff',
    },
    microLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#4a90e2',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    titleInput: {
        fontSize: 20,
        color: '#333',
        fontWeight: '500',
        padding: 0,
    },
    textArea: {
        fontSize: 16,
        color: '#333',
        minHeight: 70,
        textAlignVertical: 'top',
        padding: 0,
        marginTop: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    rowLabel: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    rowSubLabel: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    rowValueText: {
        fontSize: 16,
        color: '#4a90e2',
        fontWeight: '500',
    },
    rightAlignedInput: {
        fontSize: 16,
        color: '#666',
        textAlign: 'right',
        flex: 1,
        padding: 0,
        marginLeft: 16,
    },
    circleCheck: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    circleCheckActive: {
        backgroundColor: '#4a90e2',
        borderColor: '#4a90e2',
    },
    checkmark: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    segmentedControlContainer: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#fff',
        gap: 8,
        flexWrap: 'wrap',
    },
    segmentButton: {
        flex: 1,
        minWidth: '30%',
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
    },
    segmentButtonActive: {
        backgroundColor: '#4a90e2',
    },
    segmentText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    segmentTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    customIntervalRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    intervalText: {
        fontSize: 16,
        color: '#666',
    },
    intervalInput: {
        fontSize: 16,
        color: '#333',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        textAlign: 'center',
        minWidth: 45,
    },
});