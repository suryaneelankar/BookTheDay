import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { BUDGET_RANGES, SEARCH_COLORS } from '../constants';

/**
 * BudgetSelector — chip-based budget range picker.
 * Uses predefined ranges instead of sliders for faster, thumb-friendly interaction.
 */
const BudgetSelector = memo(({ selected, onSelect }) => {
    const handlePress = useCallback((option) => () => onSelect(option), [onSelect]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <IonIcon name="wallet-outline" size={18} color={SEARCH_COLORS.SECONDARY} />
                <Text style={styles.label}>Budget Range</Text>
            </View>
            <View style={styles.grid}>
                {BUDGET_RANGES.map(option => {
                    const isSelected = selected === option.value;
                    return (
                        <TouchableOpacity
                            key={option.value}
                            style={[styles.chip, isSelected && styles.chipSelected]}
                            onPress={handlePress(option.value)}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
});

BudgetSelector.displayName = 'BudgetSelector';

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
    chipSelected: { backgroundColor: '#FEF8E8', borderColor: SEARCH_COLORS.SECONDARY },
    chipText: { fontFamily: 'ManropeRegular', fontSize: 13, color: '#555', fontWeight: '500' },
    chipTextSelected: { color: '#B8860B', fontWeight: '700' },
});

export default BudgetSelector;
