import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { GUEST_OPTIONS, SEARCH_COLORS } from '../constants';

/**
 * GuestSelector — chip-based guest count picker.
 * Wrapped in React.memo to prevent re-renders when parent state
 * (budget, date, etc.) changes but `selected` hasn't.
 */
const GuestSelector = memo(({ selected, onSelect }) => {
    // Stable callback ref per chip — avoids creating new functions on every render
    const handlePress = useCallback((option) => () => onSelect(option), [onSelect]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <IonIcon name="people-outline" size={18} color={SEARCH_COLORS.PRIMARY} />
                <Text style={styles.label}>Number of Guests</Text>
            </View>
            <View style={styles.grid}>
                {GUEST_OPTIONS.map(option => {
                    const isSelected = selected === option;
                    return (
                        <TouchableOpacity
                            key={option}
                            style={[styles.chip, isSelected && styles.chipSelected]}
                            onPress={handlePress(option)}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                                {option}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
});

GuestSelector.displayName = 'GuestSelector';

const styles = StyleSheet.create({
    container: { marginBottom: 20 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    label: { fontFamily: 'ManropeRegular', fontSize: 14, fontWeight: '700', color: SEARCH_COLORS.TEXT_PRIMARY },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    chip: {
        paddingHorizontal: 16, paddingVertical: 10,
        borderRadius: 12, backgroundColor: '#F5F5F5',
        borderWidth: 1.5, borderColor: 'transparent',
    },
    chipSelected: { backgroundColor: SEARCH_COLORS.TINT, borderColor: SEARCH_COLORS.PRIMARY },
    chipText: { fontFamily: 'ManropeRegular', fontSize: 13, color: '#555', fontWeight: '500' },
    chipTextSelected: { color: SEARCH_COLORS.PRIMARY, fontWeight: '700' },
});

export default GuestSelector;
