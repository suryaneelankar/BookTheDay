import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';

const TermsAndConditionsScreen = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* <Text style={styles.title}>Terms and Conditions</Text> */}

            <Text style={styles.paragraph}>
                Welcome to BookTheDay Services, your trusted partner in making every occasion extraordinary. By using our services, you agree to the following terms and conditions. Please read them carefully.
            </Text>

            <Text style={styles.sectionTitle}>1. General Terms</Text>
            <Text style={styles.paragraph}>
                These Terms and Conditions ("Agreement") govern your use of the BookTheDay Services platform and all related services. By accessing or using our platform, you agree to comply with and be bound by this Agreement.
            </Text>

            <Text style={styles.sectionTitle}>2. Service Offerings</Text>
            <Text style={styles.paragraph}>
                BookTheDay Services offers a range of services, including but not limited to clothing and jewelry rentals, function hall bookings, and catering services. The availability of these services may vary based on location and time.
            </Text>

            <Text style={styles.sectionTitle}>3. Booking and Payments</Text>
            <Text style={styles.paragraph}>
                All bookings must be made through our platform. Payments are required as per the payment terms specified at the time of booking. We reserve the right to cancel bookings that do not comply with our payment terms.
            </Text>

            <Text style={styles.sectionTitle}>4. Cancellation and Refunds</Text>
            <Text style={styles.paragraph}>
                Cancellations must be made in accordance with our cancellation policy. Refunds, if applicable, will be processed as per the terms outlined during the booking process. Certain bookings may be non-refundable.
            </Text>

            <Text style={styles.sectionTitle}>5. User Responsibilities</Text>
            <Text style={styles.paragraph}>
                Users are responsible for providing accurate information during the booking process. Any damages or loss incurred due to inaccurate information or negligence will be the responsibility of the user.
            </Text>

            <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
            <Text style={styles.paragraph}>
                BookTheDay Services is not liable for any direct, indirect, incidental, or consequential damages arising from the use of our platform or services. Our liability is limited to the extent permitted by law.
            </Text>

            <Text style={styles.sectionTitle}>7. Amendments</Text>
            <Text style={styles.paragraph}>
                We reserve the right to amend these Terms and Conditions at any time. Continued use of our platform after any amendments signifies your acceptance of the updated terms.
            </Text>

            <Text style={styles.sectionTitle}>8. Contact Information</Text>
            <Text style={styles.paragraph}>
                For any questions or concerns regarding these Terms and Conditions, please contact us at support@booktheday.com.
            </Text>

            <Text style={styles.footer}>
                Thank you for choosing BookTheDay Services. We look forward to making your special occasion unforgettable.
            </Text>
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
        color: '#333333',
        marginBottom: 20,
        textAlign: 'center',
        fontFamily:'ManropeRegular',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        fontFamily:'ManropeRegular',
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        color: '#555',
        marginBottom: 15,
        fontFamily:'ManropeRegular',

    },
    footer: {
        fontSize: 16,
        lineHeight: 24,
        color: '#555',
        textAlign: 'center',
        marginTop: 20,
        fontFamily:'ManropeRegular',

    },
});

export default TermsAndConditionsScreen;
