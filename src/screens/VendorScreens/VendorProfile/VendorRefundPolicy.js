import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';

const VendorRefundPolicy = ({ navigation }) => {
    return (
        <ScrollView contentContainerStyle={styles.container}>

            <Text style={styles.paragraph}>
                At Book The Day, we understand that plans can change. Our refund policy is designed to be fair and transparent, while also considering our commitment to vendors. Please read this policy carefully to understand your rights regarding refunds.
            </Text>

            <Text style={styles.subHeader}>1. General Refund Policy</Text>
            <Text style={styles.paragraph}>
                Refunds are subject to the specific cancellation and refund policies of each vendor listed on the Book The Day app. Book The Day acts as a platform to facilitate bookings, and while we strive to ensure a smooth experience, the final decision regarding refunds rests with the individual vendors. We recommend reviewing the vendor's refund and cancellation terms displayed at the time of booking.
            </Text>

            


            <Text style={styles.subHeader}>2. Cancellation Refunds</Text>
            <Text style={styles.paragraph}>
                <Text style={styles.bold}>Function Hall Bookings:</Text> Advance Payment is Non-Refundable: Once the advance is paid to confirm your booking, it cannot be refunded under any circumstances.
            </Text>

            <Text style={styles.paragraph}>
                <Text style={styles.bold}>Cancellation Timeline:</Text> If you cancel the booking, even days/weeks in advance, the advance amount will not be returned.
            </Text>

            <Text style={styles.paragraph}>
                <Text style={styles.bold}>Change of Date:</Text> In some cases, rescheduling may be possible based on vendor availability, but this is subject to approval and does not guarantee refund or credit if there is no availability for the new date.
            </Text>

            <Text style={styles.paragraph}>
                <Text style={styles.bold}>Vendor Cancellation:</Text> If the vendor cancels for any reason, the full amount (including advance) will be refunded to the customer.
            </Text>

            <Text style={styles.paragraph}>
                <Text style={styles.bold}>Disputes:</Text> All refund-related disputes are handled as per our Terms of Service.
            </Text>

            <Text style={styles.paragraph}>
                <Text style={styles.bold}>Catering Services:</Text> Cancellations made at least 14 days in advance may qualify for a full refund. Partial refunds may be issued if canceled within 14 days, subject to vendor terms. Cancellations within 7 days of the event may not be eligible for a refund due to advance preparation costs.
            </Text>
            <Text style={styles.paragraph}>
                <Text style={styles.bold}>Clothing and Jewellery Rentals:</Text> Cancellations made within 7 days of the scheduled rental date may not be eligible for a refund. Any cancellations prior to this period may qualify for a full or partial refund, as determined by the vendor.
            </Text>

            <Text style={styles.subHeader}>3. No-Show Policy</Text>
            <Text style={styles.paragraph}>
                No refunds will be issued for no-shows or missed events, as vendors reserve the date and prepare accordingly. Users are advised to notify the vendor promptly if changes to the event occur.
            </Text>

            <Text style={styles.subHeader}>4. Non-Refundable Deposits</Text>
            <Text style={styles.paragraph}>
                Some bookings may require a non-refundable deposit to secure the vendor’s services. Such deposits are non-refundable under all circumstances, as they cover initial preparation and reservation costs.
            </Text>

            <Text style={styles.subHeader}>5. Refund Processing Time</Text>
            <Text style={styles.paragraph}>
                Refunds, if approved, will be processed within 7-10 business days. Once processed, refunds will be credited back to the original payment method. Processing times may vary depending on your bank or payment provider.
            </Text>

            <Text style={styles.subHeader}>6. Vendor-Canceled Services</Text>
            <Text style={styles.paragraph}>
                In the event that a vendor cancels a booking, Book The Day will work to either reschedule the service or issue a full refund, including any non-refundable deposits paid for that service. Book The Day will assist in finding a suitable replacement if desired, but the final decision rests with the user.
            </Text>

            <Text style={styles.subHeader}>7. Special Circumstances</Text>
            <Text style={styles.paragraph}>
                In cases of unforeseen circumstances, such as extreme weather, natural disasters, or government restrictions, refunds or rescheduling options will be evaluated on a case-by-case basis in coordination with the vendors involved.
            </Text>

            <Text style={styles.subHeader}>8. How to Request a Refund</Text>
            <Text style={styles.paragraph}>
                To initiate a refund request, please contact our customer support team within the app. Be sure to include your booking ID, the reason for cancellation, and any relevant documentation. Refund eligibility will be reviewed according to the vendor's policy, and you will be notified of the outcome within 3 business days.
            </Text>

            <Text style={styles.subHeader}>9. Changes to Refund Policy</Text>
            <Text style={styles.paragraph}>
                Book The Day reserves the right to update or modify this Refund Policy at any time. Users will be notified of any significant changes via app notification or email.
            </Text>

            <Text style={styles.paragraph}>
                Thank you for choosing Book The Day. We’re committed to providing the best experience for your special day, and we’re here to support you in case of any changes to your plans.
            </Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
        // alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    subHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 5,
        color: '#333',
        fontFamily:'ManropeRegular',

    },
    paragraph: {
        fontSize: 16,
        textAlign: 'left',
        marginBottom: 15,
        lineHeight: 24,
        color: '#555',
        fontFamily:'ManropeRegular',

    },
    bold: {
        fontWeight: 'bold',
    },
});

export default VendorRefundPolicy;
