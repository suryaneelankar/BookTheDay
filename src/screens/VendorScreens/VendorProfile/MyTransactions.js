import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import BASE_URL from '../../../apiconfig';
import { useSelector } from 'react-redux';
import { getVendorAuthToken } from '../../../utils/StoreAuthToken';
import axios from "axios";
import { formatAmount } from '../../../utils/GlobalFunctions';
import IonIcon from 'react-native-vector-icons/Ionicons';

const MyTransactions = () => {
    const vendorLoggedInMobileNum = useSelector((state) => state.vendorLoggedInMobileNum);
    const [transactionsData, setTransactionsData] = useState([]);

    useEffect(() => {
        getTransactionsData();
    }, []);

    function formatDateToDMY(dateString) {
        console.log("date string is::", dateString)
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
    
        // Determine AM/PM and convert hours to 12-hour format
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        hours = String(hours).padStart(2, '0');
    
        return `${day}-${month}-${year},  ${hours}:${minutes}:${seconds} ${ampm}`;
        // return `${day}-${month}-${year}`;
    }

    const getTransactionsData = async () => {
        const vendorMobileNumber = vendorLoggedInMobileNum;
        const token = await getVendorAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/getPaymentsByVendorMobileNumber/${vendorMobileNumber}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setTransactionsData(response?.data?.data);
            console.log('response getTransactionsData is ::>>', response?.data?.data);
        } catch (error) {
            console.log("getTransactionsData error::::::::::", error);
        }
    }

    const TransactionItem = ({ item }) => {
        if (!item) return null;

        const isSuccess = item?.paymentStatus === 'success';

        return (
            <View style={styles.transactionItemContainer}>
                {/* Header row: Order ID + Amount */}
                <View style={styles.transactionHeader}>
                    <Text style={styles.transactionOrderIdLabel}>
                        Order ID: <Text style={styles.transactionOrderIdValue}>{item?.OrderId || 'N/A'}</Text>
                    </Text>
                    <Text style={[styles.transactionAmount, {color: isSuccess ? '#059669' : '#DC2626'}]}>
                        {formatAmount(`+${item?.orderAmount?.toFixed(2)}`)}
                    </Text>
                </View>

                {/* Body */}
                <View style={styles.transactionBody}>
                    <View style={[styles.statusDot, {backgroundColor: isSuccess ? '#059669' : '#DC2626'}]} />
                    <View style={styles.transactionDetails}>
                        <Text style={styles.transactionProductName}>{item?.productName}</Text>
                        <Text style={styles.transactionDate}>
                            {item?.createdAt ? formatDateToDMY(item?.createdAt) : 'Date Unavailable'}
                        </Text>
                        <Text style={styles.transactionUser}>
                            Booked by: {item?.userFullName || 'N/A'}
                        </Text>
                    </View>
                    <View style={[styles.statusPill, {backgroundColor: isSuccess ? '#ECFDF5' : '#FEF2F2'}]}>
                        <Text style={[styles.statusPillText, {color: isSuccess ? '#059669' : '#DC2626'}]}>
                            {isSuccess ? 'Success' : 'Failed'}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };


    return (
        <View style={styles.container}>
            <FlatList
               showsVerticalScrollIndicator={false}
                data={transactionsData}
                keyExtractor={(item) => item?._id || Math.random().toString()}
                renderItem={({ item }) => <TransactionItem item={item} />}
                ListEmptyComponent={() => (
                    <View style={styles.emptyState}>
                        <IonIcon name="receipt-outline" size={56} color="#D4D4D4" />
                        <Text style={styles.emptyTitle}>No Transactions Yet</Text>
                        <Text style={styles.emptySubtitle}>Your payment history will appear here once customers make bookings.</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        paddingTop: 16,
        paddingHorizontal: 16,
    },
    transactionItemContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    transactionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    transactionOrderIdLabel: {
        fontSize: 11,
        color: '#7E8389',
        fontFamily: 'ManropeRegular',
        fontWeight: '400',
    },
    transactionOrderIdValue: {
        fontWeight: '600',
        color: '#1A1E25',
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: '800',
        fontFamily: 'ManropeRegular',
    },
    transactionBody: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginTop: 5,
        marginRight: 10,
    },
    transactionDetails: {
        flex: 1,
    },
    transactionProductName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1E25',
        fontFamily: 'ManropeRegular',
        marginBottom: 3,
        textTransform: 'capitalize',
    },
    transactionDate: {
        fontSize: 11,
        color: '#7E8389',
        fontFamily: 'ManropeRegular',
        marginBottom: 4,
    },
    transactionUser: {
        fontSize: 12,
        color: '#555555',
        fontFamily: 'ManropeRegular',
        textTransform: 'capitalize',
    },
    statusPill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    statusPillText: {
        fontSize: 11,
        fontWeight: '700',
        fontFamily: 'ManropeRegular',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get('window').height - 150,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1E25',
        fontFamily: 'ManropeRegular',
        marginTop: 12,
    },
    emptySubtitle: {
        fontSize: 13,
        color: '#7E8389',
        fontFamily: 'ManropeRegular',
        textAlign: 'center',
        marginTop: 6,
        paddingHorizontal: 40,
        lineHeight: 18,
    },
});

export default MyTransactions;