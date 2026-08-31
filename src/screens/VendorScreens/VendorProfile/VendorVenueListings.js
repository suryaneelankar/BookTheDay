import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

import BASE_URL from '../../../apiconfig';
import { getVendorAuthToken } from '../../../utils/StoreAuthToken';

const STATUS_THEME = {
    approved: { label: 'Approved', background: '#EAF7EF', color: '#27653A' },
    onhold: { label: 'On Hold', background: '#FFF5E8', color: '#9A531E' },
    rejected: { label: 'Rejected', background: '#FDECEC', color: '#A13A3A' },
};

const money = value => {
    const amount = Number(value);
    if (!Number.isFinite(amount) || amount <= 0) return 'Price on request';
    return `₹${amount.toLocaleString('en-IN')}`;
};

const locality = venue =>
    venue.county ||
    venue.functionHallAddress?.city ||
    'Location not available';

export default function VendorVenueListings({ navigation }) {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');

    const loadVenues = useCallback(async (refresh = false) => {
        refresh ? setRefreshing(true) : setLoading(true);
        setError('');

        try {
            const token = await getVendorAuthToken();
            const response = await axios.get(
                `${BASE_URL}/vendor/function-halls`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 20000,
                },
            );
            setVenues(Array.isArray(response.data?.data) ? response.data.data : []);
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                'Unable to load your venues. Pull down to retry.',
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadVenues();
        }, [loadVenues]),
    );

    const renderVenue = ({ item }) => {
        const status = STATUS_THEME[item.verificationStatus] || STATUS_THEME.onhold;
        const menuBased = item.menuAvailable === true || item.pricingType === 'menu_based';

        return (
            <View style={styles.card}>
                {item.professionalImage?.url ? (
                    <Image
                        source={{ uri: item.professionalImage.url }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={[styles.image, styles.placeholder]}>
                        <Text style={styles.placeholderText}>No photo</Text>
                    </View>
                )}

                <View style={styles.cardBody}>
                    <View style={styles.titleRow}>
                        <Text style={styles.name} numberOfLines={1}>
                            {item.functionHallName}
                        </Text>
                        <View style={[styles.status, { backgroundColor: status.background }]}>
                            <Text style={[styles.statusText, { color: status.color }]}>
                                {status.label}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.meta} numberOfLines={1}>
                        {item.venueCategory || 'Venue'} · {locality(item)}
                    </Text>
                    <Text style={styles.price}>
                        {menuBased ? 'Menu-based pricing' : `${money(item.rentPricePerDay)} / day`}
                    </Text>

                    <View style={styles.bottomRow}>
                        <Text style={styles.availability}>
                            {item.available ? 'Accepting enquiries' : 'Not accepting enquiries'}
                        </Text>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => navigation.navigate('EditFunctionHall', { hallId: item._id })}
                            accessibilityRole="button"
                            accessibilityLabel={`Edit ${item.functionHallName}`}
                        >
                            <Text style={styles.editButtonText}>Edit venue</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#FD813B" />
                <Text style={styles.loadingText}>Loading your venues…</Text>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <View style={styles.heading}>
                <Text style={styles.title}>My Listings</Text>
                <Text style={styles.subtitle}>
                    {venues.length} {venues.length === 1 ? 'venue' : 'venues'} linked to your account
                </Text>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <FlatList
                data={venues}
                keyExtractor={item => String(item._id)}
                renderItem={renderVenue}
                contentContainerStyle={venues.length ? styles.list : styles.emptyList}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => loadVenues(true)}
                        colors={['#FD813B']}
                        tintColor="#FD813B"
                    />
                }
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyTitle}>No linked venues yet</Text>
                        <Text style={styles.emptyText}>
                            Approved venues linked to your vendor account will appear here.
                        </Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#F7F7F8' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7F7F8' },
    loadingText: { marginTop: 10, color: '#71717A', fontSize: 13 },
    heading: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10 },
    title: { color: '#27272A', fontSize: 22, fontWeight: '800' },
    subtitle: { color: '#71717A', fontSize: 12, marginTop: 3 },
    error: { marginHorizontal: 16, marginBottom: 8, padding: 10, borderRadius: 8, color: '#9B2C2C', backgroundColor: '#FFF0F0' },
    list: { paddingHorizontal: 14, paddingBottom: 90 },
    emptyList: { flexGrow: 1, paddingHorizontal: 20 },
    card: { marginBottom: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#ECE7E3', borderRadius: 13, backgroundColor: '#FFFFFF' },
    image: { width: '100%', height: 155 },
    placeholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F1EF' },
    placeholderText: { color: '#8A817C', fontSize: 12 },
    cardBody: { padding: 12 },
    titleRow: { flexDirection: 'row', alignItems: 'center' },
    name: { flex: 1, marginRight: 8, color: '#27272A', fontSize: 16, fontWeight: '700' },
    status: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    statusText: { fontSize: 10, fontWeight: '700' },
    meta: { marginTop: 5, color: '#71717A', fontSize: 12 },
    price: { marginTop: 7, color: '#7C3E1D', fontSize: 13, fontWeight: '700' },
    bottomRow: { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    availability: { flex: 1, marginRight: 10, color: '#71717A', fontSize: 11 },
    editButton: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 8, backgroundColor: '#FFF0E5' },
    editButtonText: { color: '#9A431B', fontSize: 12, fontWeight: '700' },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 80 },
    emptyTitle: { color: '#3F3F46', fontSize: 17, fontWeight: '700' },
    emptyText: { marginTop: 6, color: '#71717A', fontSize: 12, lineHeight: 18, textAlign: 'center' },
});
