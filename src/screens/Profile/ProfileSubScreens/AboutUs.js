import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const AboutUs = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.paragraph}>
                Welcome to BookTheDay Services, your trusted partner in making every occasion extraordinary. Whether you're planning the wedding of your dreams, a joyous celebration, or a professional gathering, we provide everything you need to turn your vision into reality.
            </Text>
            <Text style={styles.paragraph}>
                ✨ Clothes & Jewels Rental{'\n'}
                Dress for the occasion without compromise. Explore our handpicked collection of stunning attire and dazzling jewelry designed to add elegance to your special day. From traditional bridal wear to contemporary party outfits, we have something for everyone.
            </Text>
            <Text style={styles.paragraph}>
                🏢 Function Hall Bookings{'\n'}
                Finding the perfect venue has never been easier. Our carefully curated list of function halls ensures the ideal setting for your event—whether it’s a small, intimate gathering or a large, lavish celebration.
            </Text>
            <Text style={styles.paragraph}>
                🍴 Catering Services{'\n'}
                Delight your guests with a menu crafted to perfection. Our catering partners offer a wide variety of cuisines, from authentic local flavors to international delicacies, tailored to suit your preferences and event theme.
            </Text>
            <Text style={styles.paragraph}>
                At BookTheDay Services, we understand the importance of every detail. That’s why we strive to offer convenience, quality, and affordability in every service we provide. Our goal is to take the stress out of planning, so you can focus on what matters most—creating memories with your loved ones.
            </Text>
            <Text style={styles.paragraph}>
                With a passion for excellence and a commitment to customer satisfaction, BookTheDay Services is here to ensure your celebrations are as unique and unforgettable as the moments you cherish.
            </Text>
            <Text style={styles.paragraph}>
                Celebrate effortlessly, and make every day special with BookTheDay!
            </Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paragraph: {
        fontSize: 16,
        marginBottom: 20,
        lineHeight: 24,
        color: '#555',
        fontFamily: 'ManropeRegular',
    },
});

export default AboutUs;
