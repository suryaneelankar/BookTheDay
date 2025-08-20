import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import axios from 'axios';
import BASE_URL from '../../../apiconfig';
import { getVendorAuthToken } from '../../../utils/StoreAuthToken';
import themevariable from '../../../utils/themevariable';
import CalendarIcon from '../../../assets/svgs/calendarOrangeIcon.svg';
import ServiceTime from '../../../assets/svgs/serviceTime.svg';
import ArrowRight from '../../../assets/vendorIcons/arrowRight.svg';

const MyBookings = ({ navigation }) => {
    const vendorLoggedInMobileNum = useSelector((state) => state.vendorLoggedInMobileNum);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetchPastBookings();
    }, []);

    const fetchPastBookings = async () => {
        const token = await getVendorAuthToken();
        try {
            const response = await axios.get(
                `${BASE_URL}/functionHallBookingsGotForVendor/${vendorLoggedInMobileNum}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const allBookings = response?.data?.data || [];

            // Filter for past & recent history (last 12 months, including today)
            const oneYearAgo = moment().subtract(12, 'months').startOf('day').toDate();
            const filtered = allBookings.filter(item => {
                const bookingDate = moment(item?.startDate, 'DD MMM YYYY').toDate();
                return bookingDate >= oneYearAgo;
            });

            setBookings(filtered.reverse()); // latest first
        } catch (err) {
            console.log('Error fetching past bookings:', err);
        }
    };

    const getStatusColors = (status) => {
        const map = {
            requested: { bg: '#FFF9DB', color: '#8A6E00' },
            approved: { bg: '#FFF8F0', color: 'orange' },
            rejected: { bg: '#FDEDED', color: '#EF0000' },
            cancelled: { bg: '#CCCCCC', color: 'grey' },
            'payment successful': { bg: '#E8F6E8', color: '#1B5E20' }
        };
        return map[status] || { bg: '#FFF8F0', color: '#57A64F' };
    };

    const renderBookingCard = ({ item }) => {
        const { bg, color } = getStatusColors(item?.bookingStatus);

        return (
            <TouchableOpacity
                style={[styles.card, { backgroundColor: '#FFF5E3' }]}
                onPress={() => { }}
            >
                <FastImage
                    source={{ uri: item?.professionalImage?.url }}
                    style={styles.image}
                />

                <View style={styles.details}>
                    <Text style={styles.name}>{item?.userFullName || 'Guest User'}</Text>

                    <View style={styles.row}>
                        <CalendarIcon width={14} height={14} />
                        <Text style={styles.infoText}>
                            {'  '}
                            {item?.startDate}
                        </Text>
                        <ServiceTime width={14} height={14} style={{ marginLeft: 12 }} />
                        <Text style={styles.infoText}>
                            {'  '}
                            {item?.bookingTime}
                        </Text>
                    </View>

                    <View style={styles.bottomRow}>
                        <Text style={styles.amount}>
                            ₹ {item?.totalAmount?.toLocaleString()}
                        </Text>
                        <Text style={[styles.status, { backgroundColor: bg, color }]}>
                            {item?.bookingStatus}
                        </Text>
                    </View>
                </View>

                {/* <ArrowRight width={16} height={16} style={{ marginLeft: 10 }} /> */}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={bookings}
                keyExtractor={(item, index) => item?.bookingId || index.toString()}
                renderItem={renderBookingCard}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No past bookings found</Text>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        padding: 16
    },
    card: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 20,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
        backgroundColor: '#FFF5E3',
        // marginHorizontal: 10

    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 12,
        backgroundColor: '#FFF5E3'

    },
    details: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        // marginRight: 10,
        // marginLeft: 10,
        // borderColor:"green",
        // borderWidth:1,
        backgroundColor: '#FFF5E3',
        // padding: 10,
        // borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,

    },
    name: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1F36',
        marginBottom: 4
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4
    },
    infoText: {
        fontSize: 13,
        color: '#555'
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // borderColor: "red",
        // borderWidth: 1
    },
    amount: {
        fontSize: 14,
        fontWeight: '600',
        color: themevariable.Color_000000
    },
    status: {
        fontSize: 12,
        fontWeight: '500',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        overflow: 'hidden',
        textTransform: 'capitalize'
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: Dimensions.get('window').height - 200
    },
    emptyText: {
        fontSize: 15,
        color: '#666'
    }
});

export default MyBookings;
