import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';

const AboutUsScreen = ({ navigation }) => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* <Text style={styles.header}>About Us</Text> */}
            <Text style={styles.paragraph}>
                Welcome to Book The Day, where we believe that every couple deserves a beautiful wedding 
                without the stress or high costs. Our mission is to make wedding planning easier and more 
                affordable for families by providing everything you need in one place.
            </Text>
            <Text style={styles.paragraph}>
                At Book The Day, we specialize in bringing together the essentials: from elegant function 
                halls to delicious catering, as well as attire, jewelry, and other wedding must-haves. 
                We understand that weddings are deeply personal, which is why we offer flexible, 
                budget-friendly packages designed to fit the unique needs of every couple and family.
            </Text>
            <Text style={styles.paragraph}>
                Our team works with trusted vendors to offer high-quality services, beautiful venues, and 
                a range of catering options, all at competitive prices. With our app, you can plan your 
                dream wedding with ease, knowing that we’re here to make every step as smooth and 
                memorable as possible.
            </Text>
            <Text style={styles.paragraph}>
                We’re honored to be a part of your special day, helping you celebrate love, family, and 
                tradition with style and simplicity. Thank you for choosing Book The Day!
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
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    paragraph: {
        fontSize: 16,
        // textAlign: 'center',
        marginBottom: 20,
        lineHeight: 24,
        color: '#555',
        fontFamily:'ManropeRegular',
    },
});

export default AboutUsScreen;
