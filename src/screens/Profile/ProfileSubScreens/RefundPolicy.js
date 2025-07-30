import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';

const RefundPolicy = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>

            <Text style={styles.paragraph}>
                At BookTheDay Services, we aim to provide the best experience for our customers. Our refund policy is designed to be fair and transparent, ensuring clarity on cancellations and refunds.
            </Text>

            <Text style={styles.sectionTitle}>1. Advance Payments</Text>
            <Text style={styles.paragraph}>
                1.1. Advance payments made at the time of booking are non-refundable under normal circumstances.
            </Text>
            <Text style={styles.paragraph}>
                1.2. Refunds for advance payments will only be considered in the following exceptional cases:
            </Text>
            <Text style={styles.listItem}>
                • The service provider is unable to deliver the service due to unforeseen circumstances.
            </Text>
            <Text style={styles.listItem}>
                • The booking was canceled by BookTheDay Services.
            </Text>

            <Text style={styles.sectionTitle}>2. Cancellations by the Customer</Text>
            <Text style={styles.paragraph}>
                2.1. If the customer cancels a booking:
            </Text>
            <Text style={styles.listItem}>
                • Advance payments will not be refunded.
            </Text>
            <Text style={styles.listItem}>
                • Any additional payments made beyond the advance may be refunded, subject to deductions for administrative charges or expenses already incurred.
            </Text>

            <Text style={styles.sectionTitle}>3. Cancellations by BookTheDay Services</Text>
            <Text style={styles.paragraph}>
                3.1. In rare cases where BookTheDay Services cancels a booking due to unavoidable reasons:
            </Text>
            <Text style={styles.listItem}>
                • The customer will receive a full refund of all payments made, including the advance.
            </Text>
            <Text style={styles.paragraph}>
                3.2. If a suitable alternative service is provided and accepted by the customer, no refund will be issued.
            </Text>

            <Text style={styles.sectionTitle}>4. Process for Refunds</Text>
            <Text style={styles.paragraph}>
                4.1. Refund requests must be submitted in writing or through our official communication channels, along with proof of payment and booking details.
            </Text>
            <Text style={styles.paragraph}>
                4.2. Approved refunds will be processed within 7-14 business days from the date of approval.
            </Text>
            <Text style={styles.paragraph}>
                4.3. Refunds will be credited to the original payment method unless otherwise agreed upon.
            </Text>

            <Text style={styles.sectionTitle}>5. No-Refund Conditions</Text>
            <Text style={styles.paragraph}>
                5.1. Refunds will not be issued if:
            </Text>
            <Text style={styles.listItem}>
                • The customer fails to provide accurate information or necessary documents.
            </Text>
            <Text style={styles.listItem}>
                • The customer does not comply with the terms and conditions of the booking.
            </Text>
            <Text style={styles.listItem}>
                • Cancellations are made after the agreed cancellation window, as mentioned in the service agreement.
            </Text>

            <Text style={styles.sectionTitle}>6. Disputes</Text>
            <Text style={styles.paragraph}>
                6.1. For any disputes regarding refunds, the decision of BookTheDay Services will be final and binding.
            </Text>

            <Text style={styles.footer}>
                By making a booking, you acknowledge that you have read, understood, and agreed to this refund policy. For further assistance, please contact our customer support team.
            </Text>

            <Text style={styles.footer}>Thank you for choosing BookTheDay Services.</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FD813B',
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'ManropeRegular',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        fontFamily: 'ManropeRegular',
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        color: '#555',
        marginBottom: 15,
        fontFamily: 'ManropeRegular',
    },
    listItem: {
        fontSize: 16,
        lineHeight: 24,
        color: '#555',
        marginLeft: 10,
        marginBottom: 10,
        fontFamily: 'ManropeRegular',
    },
    footer: {
        fontSize: 16,
        lineHeight: 24,
        color: '#555',
        textAlign: 'center',
        marginTop: 20,
        fontFamily: 'ManropeRegular',
    },
});

export default RefundPolicy;
