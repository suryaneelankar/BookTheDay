import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import OrderIcon from "../../../assets/OrderIcon.svg";
import BASE_URL from '../../../apiconfig';
import { useSelector } from 'react-redux';
import { getVendorAuthToken } from '../../../utils/StoreAuthToken';
import axios from "axios";
import { formatAmount } from '../../../utils/GlobalFunctions';

const MyTransactions = () => {
    const vendorLoggedInMobileNum = useSelector((state) => state.vendorLoggedInMobileNum);
    const [transactionsData, setTransactionsData] = useState([]);

    useEffect(() => {
        getTransactionsData();
    }, []);

    function formatDateToDMY(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
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

    const TransactionItem = ({ date, orderId, amount, paymentStatus }) => (
        <View style={styles.transactionItem}>
            <OrderIcon style={styles.orderIcon} />
            <View style={styles.transactionDetails}>
                <Text style={styles.transactionDate}>
                    {date ? formatDateToDMY(date) : "Date Unavailable"}
                </Text>
                <Text style={styles.transactionOrderId}>
                    Order {orderId || "N/A"}
                </Text>
            </View>
            <Text
                style={[
                    styles.transactionAmount,
                    { color: paymentStatus === "success" ? '#1BB003' : '#E64A19' }
                ]}
            >
                {paymentStatus === "success" ? formatAmount(`+${amount.toFixed(2)}`) : `-${formatAmount(amount.toFixed(2))}`}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={transactionsData}
                keyExtractor={(item) => item._id || Math.random().toString()}
                renderItem={({ item }) => (
                    <TransactionItem
                        date={item.createdAt}
                        orderId={item.OrderId}
                        amount={item.orderAmount}
                        paymentStatus={item.paymentStatus}
                    />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
        paddingHorizontal: 16,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF4CD',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    orderIcon: {
        marginRight: 12,
    },
    transactionDetails: {
        flex: 1,
        paddingLeft: 10,
    },
    transactionDate: {
        fontSize: 12,
        color: '#A0A4B8', // Updated color to a classic gray
        fontStyle: 'italic', // Added italic style for date
        marginBottom: 4,
    },
    transactionOrderId: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#3E4A68',
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MyTransactions;
