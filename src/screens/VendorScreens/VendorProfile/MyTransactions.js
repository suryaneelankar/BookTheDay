import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import OrderIcon from "../../../assets/OrderIcon.svg";
import BASE_URL from '../../../apiconfig';
import { useSelector } from 'react-redux';
import { getVendorAuthToken } from '../../../utils/StoreAuthToken';
import axios from "axios";
import { formatAmount } from '../../../utils/GlobalFunctions';
import themevariable from '../../../utils/themevariable';

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
        if (!item) return null; // Ensure item is valid

        return (
            <View style={styles.transactionItemContainer}>
                  <Text style={[styles.transactionOrderId,{color:"#666666",marginBottom:10}]}>
                        Order Id: {item?.OrderId || "N/A"}
                    </Text>
            <View style={styles.transactionItem}>
                <OrderIcon style={styles.orderIcon} />
                <View style={styles.transactionDetails}>
                    <Text  style={styles.transactionOrderId}>{item?.productName}</Text>
                    <Text style={styles.transactionDate}>
                        {item?.createdAt ? formatDateToDMY(item?.createdAt) : "Date Unavailable"}
                    </Text>
                    <Text style={{...styles.transactionStatus, color: item?.paymentStatus === "success" ? "#1BB003" : "#E64A19" }}>
                        {item?.paymentStatus ? item?.paymentStatus.charAt(0).toUpperCase() + item?.paymentStatus.slice(1) : "Status Unavailable"}
                    </Text>
                    {/* <Text style={styles.transactionOrderId}>User Name: {item?.userFullName}</Text> */}
                    <Text style={styles.userDetails}>
                        Booked By: {item?.userFullName || "N/A"}
                    </Text>

                    {/* <Text style={styles.transactionOrderId}>User Mobile.No: {item?.userMobileNumber}</Text> */}
                </View>
                <Text
                    style={[
                        styles.transactionAmount,
                        { color: item?.paymentStatus === "success" ? "#1BB003" : "#E64A19" },
                    ]}
                >
                    {formatAmount(`+${item?.orderAmount?.toFixed(2)}`)}
                </Text>
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
                    <View style={{ flex: 1, alignSelf: "center", justifyContent: "center", height: Dimensions.get('window').height - 100, width: "100%", alignItems: "center" }}>
                        <Text style={{color:themevariable.Color_000000,}}>No transactions are found</Text>
                    </View>
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
        marginBottom:10,

        // alignItems: 'center',
        // backgroundColor: '#FFF4CD',
        // borderRadius: 8,
        // padding: 16,
        // marginBottom: 12,
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        // elevation: 3,
    },
    transactionItemContainer: {
        backgroundColor: '#FFF5E3',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginHorizontal: 10,
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: '#FFF5E3',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
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
    userDetails: {
        fontSize: 14,
        color: '#222222',
        marginBottom: 4,
        fontFamily: 'ManropeRegular',
        textTransform: 'capitalize', // Ensures user details are displayed in lowercase
    },
    transactionOrderId: {
        fontSize: 14,
        color: '#222222',
        fontFamily: 'ManropeRegular',
        marginBottom: 4,
        textTransform: 'capitalize', // Uncomment if you want to force uppercase
    },
    transactionStatus: {
        fontSize: 12,
        color: '#A0A4B8',
        marginBottom: 4,
        fontFamily: 'ManropeRegular',
    },
    transactionAmount: {
        fontSize: 16,
        fontFamily: 'ManropeRegular',
        alignSelf: 'flex-end',
        // marginLeft: 'auto', // Aligns the amount to the right
        // marginTop: 4,
        // textAlign: 'right', // Aligns the text to the right
        // width: '30%', // Adjusts the width to fit the amount

    },
});

export default MyTransactions;
