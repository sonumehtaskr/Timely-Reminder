import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
} from 'react-native';

export interface CustomInputProps extends TextInputProps {
    label: string;
    subLabel?: string;
    variant?: 'stacked' | 'inline';
    hideDivider?: boolean;
}

export const CustomInput = ({
    label,
    subLabel,
    variant = 'inline',
    hideDivider = false,
    style,
    ...rest
}: CustomInputProps) => {
    if (variant === 'stacked') {
        return (
            <>
                <View style={styles.stackedContainer}>
                    <Text style={styles.microLabel}>{label.toUpperCase()}</Text>
                    <TextInput
                        style={[styles.stackedInput, style]}
                        placeholderTextColor="#999"
                        {...rest}
                    />
                </View>
                {!hideDivider && <View style={styles.divider} />}
            </>
        );
    }

    return (
        <>
            <View style={styles.inlineContainer}>
                <View style={styles.labelWrapper}>
                    <Text style={styles.inlineLabel}>{label}</Text>
                    {subLabel && <Text style={styles.subLabel}>{subLabel}</Text>}
                </View>
                <TextInput
                    style={[styles.inlineInput, style]}
                    placeholderTextColor="#999"
                    {...rest}
                />
            </View>
            {!hideDivider && <View style={styles.divider} />}
        </>
    );
};

const styles = StyleSheet.create({
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginLeft: 16,
    },
    // --- Stacked Variant Styles ---
    stackedContainer: {
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
    stackedInput: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        padding: 0,
    },
    // --- Inline Variant Styles ---
    inlineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    labelWrapper: {
        flexShrink: 0, // Prevents label from getting crushed by long text
    },
    inlineLabel: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    subLabel: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    inlineInput: {
        fontSize: 16,
        color: '#666',
        textAlign: 'right',
        flex: 1,
        padding: 0,
        marginLeft: 16,
    },
});