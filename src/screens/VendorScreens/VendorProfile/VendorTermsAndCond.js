import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';

const VendorTermsAndCond = ({ navigation }) => {
    return (
        <ScrollView contentContainerStyle={styles.container}>

            <Text style={styles.paragraph}>
                Welcome to Book The Day! By using our app, you agree to comply with and be bound by the following Terms and Conditions. 
                Please read them carefully. These terms apply to all services provided through the Book The Day app, including venue bookings, 
                catering services, and wedding attire and jewelry rentals.
            </Text>

            <Text style={styles.subHeader}>1. Services Overview</Text>
            <Text style={styles.paragraph}>
                Book The Day provides a platform for booking function halls, catering services, and wedding-related attire and accessories. 
                We work with third-party vendors to fulfill these services. We strive to ensure that all services meet the quality and standards 
                expected by our users. However, the ultimate delivery and quality of services are the responsibility of the respective vendors.
            </Text>

            <Text style={styles.subHeader}>2. Booking and Payments</Text>
            <Text style={styles.paragraph}>
                All bookings made through the Book The Day app are subject to availability. Confirmations are issued only once payment is 
                successfully processed. Payments are to be made through the app’s payment gateway. A booking may be canceled if the payment 
                is incomplete or fails. Certain services may require a non-refundable deposit. Please review the specific terms associated 
                with each service at the time of booking.
            </Text>

            <Text style={styles.subHeader}>3. Cancellations and Refunds</Text>
            <Text style={styles.paragraph}>
                Cancellation policies vary depending on the specific service and vendor. Please check individual vendor policies before 
                making a booking. Refunds, if applicable, will be processed according to the cancellation policy. Book The Day reserves 
                the right to refuse refunds if cancellations are made after the deadline or if services have already been rendered.
            </Text>

            <Text style={styles.subHeader}>4. User Responsibilities</Text>
            <Text style={styles.paragraph}>
                Users are responsible for providing accurate information at the time of booking. Book The Day is not liable for any issues 
                arising from incorrect or incomplete information. Users must comply with all terms set forth by individual vendors, including 
                event timings, capacity limits, and other rules for venue use and catering.
            </Text>

            <Text style={styles.subHeader}>5. Vendor Responsibilities</Text>
            <Text style={styles.paragraph}>
                All vendors listed on Book The Day are responsible for delivering the services as described at the time of booking. Vendors 
                are solely liable for the quality, safety, and reliability of the services they provide. Book The Day acts solely as an 
                intermediary between users and vendors and does not assume responsibility for any discrepancies in service.
            </Text>

            <Text style={styles.subHeader}>6. Limitation of Liability</Text>
            <Text style={styles.paragraph}>
                Book The Day shall not be held liable for any damages, including but not limited to personal injury, property damage, or 
                financial loss, resulting from the use of our services or those provided by third-party vendors. In the event of a dispute 
                with a vendor, users agree to resolve the issue directly with the vendor. Book The Day may offer mediation but is not obligated 
                to assume responsibility for vendor issues.
            </Text>

            <Text style={styles.subHeader}>7. Privacy and Data Protection</Text>
            <Text style={styles.paragraph}>
                By using Book The Day, you consent to the collection and use of personal information as described in our Privacy Policy. 
                We are committed to protecting your data and ensuring your information is used responsibly.
            </Text>

            <Text style={styles.subHeader}>8. Amendments to Terms</Text>
            <Text style={styles.paragraph}>
                Book The Day reserves the right to amend these Terms and Conditions at any time. Changes will be communicated through the 
                app, and continued use after any modification constitutes acceptance of the updated terms.
            </Text>

            <Text style={styles.subHeader}>9. Governing Law</Text>
            <Text style={styles.paragraph}>
                These terms shall be governed by and construed in accordance with the laws of the applicable jurisdiction. Any disputes 
                arising from these terms will be subject to the exclusive jurisdiction of the courts in the specified region.
            </Text>

            <Text style={styles.paragraph}>
                Thank you for choosing Book The Day! We look forward to helping make your wedding day memorable and worry-free.
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
        // textAlign: 'center',
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
});

export default VendorTermsAndCond;
