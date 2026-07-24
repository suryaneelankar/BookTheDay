import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';

const TermsAndConditionsScreen = () => {
  const sections = [
    {
      icon: 'document-text-outline',
      title: 'General Terms',
      content:
        'These Terms and Conditions govern your use of the BookTheDay platform and all related services including venue browsing, booking, and payment processing. By accessing or using our app, you agree to comply with and be bound by this Agreement. BookTheDay operates as a marketplace connecting customers with venue owners (vendors) for event space bookings.',
    },
    {
      icon: 'business-outline',
      title: 'Services We Offer',
      content:
        'BookTheDay facilitates bookings for Function Halls, Banquet Halls, Farm Houses, and Luxury Resorts. We act as an intermediary between customers and venue vendors. The availability, pricing, and amenities of venues are determined by the respective vendors and may vary.',
    },
    {
      icon: 'card-outline',
      title: 'Booking & Payments',
      content:
        'All bookings must be made through the BookTheDay app. An advance payment is required to confirm your booking. Payments are processed securely via Razorpay. The advance amount blocks your chosen date — remaining balance is payable directly to the vendor as per the venue policy. Booking is confirmed only upon successful advance payment.',
    },
    {
      icon: 'refresh-outline',
      title: 'Cancellation & Refunds',
      content:
        'Cancellations made 7 or more days before the booking date are eligible for processing as per the venue\'s refund policy. Cancellations within 7 days of the event date are not permitted through the app. The advance amount paid is non-refundable upon cancellation. Refunds, where applicable, will be processed within 7-10 business days to the original payment method.',
    },
    {
      icon: 'person-outline',
      title: 'User Responsibilities',
      content:
        'Users must provide accurate personal information and valid contact details during registration and booking. You are responsible for verifying venue details, capacity, and amenities before confirming a booking. Any damages to venue property during your event are your responsibility. Misuse of the platform, including fraudulent bookings, will result in account suspension.',
    },
    {
      icon: 'storefront-outline',
      title: 'Vendor Responsibilities',
      content:
        'Vendors are responsible for maintaining accurate listings including photos, pricing, availability, and amenities. Vendors must honor confirmed bookings and provide services as described. BookTheDay is not responsible for service quality disputes between customers and vendors, but will mediate where possible.',
    },
    {
      icon: 'shield-outline',
      title: 'Privacy & Data',
      content:
        'We collect personal data (name, phone number, location) to provide our services. Your data is stored securely and never shared with third parties without consent. Payment information is processed by Razorpay and not stored on our servers. You may request deletion of your account data by contacting support.',
    },
    {
      icon: 'warning-outline',
      title: 'Limitation of Liability',
      content:
        'BookTheDay acts solely as a booking platform and is not liable for venue conditions, service quality, or disputes with vendors. Our liability is limited to the platform fee charged. We are not responsible for force majeure events (natural disasters, government restrictions) that may affect your booking.',
    },
    {
      icon: 'create-outline',
      title: 'Amendments',
      content:
        'We reserve the right to modify these Terms and Conditions at any time. Users will be notified of significant changes via the app. Continued use of BookTheDay after amendments signifies acceptance of updated terms.',
    },
    {
      icon: 'mail-outline',
      title: 'Contact Us',
      content:
        'For questions, concerns, or disputes regarding these Terms and Conditions:\n\nEmail: support@booktheday.com\nPhone: Available in-app (24/7 support)\nAddress: Hyderabad, Telangana, India',
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <IonIcon name="document-text" size={20} color="#D97706" />
        </View>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <Text style={styles.headerSubtitle}>
          Last updated: July 2026
        </Text>
      </View>

      {/* Intro */}
      <View style={styles.introCard}>
        <IonIcon name="information-circle" size={18} color="#D97706" />
        <Text style={styles.introText}>
          By using BookTheDay, you agree to the following terms. Please read
          them carefully before making any bookings.
        </Text>
      </View>

      {/* Sections */}
      {sections.map((section, idx) => (
        <View key={idx} style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconWrap}>
              <IonIcon name={section.icon} size={16} color="#D97706" />
            </View>
            <Text style={styles.sectionTitle}>
              {idx + 1}. {section.title}
            </Text>
          </View>
          <Text style={styles.sectionContent}>{section.content}</Text>
        </View>
      ))}

      {/* Footer */}
      <View style={styles.footer}>
        <IonIcon name="heart" size={14} color="#D97706" />
        <Text style={styles.footerText}>
          Thank you for choosing BookTheDay
        </Text>
      </View>

      <View style={{height: 30}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  // Header
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FEF8EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontFamily: 'ManropeRegular',
    fontWeight: '800',
    fontSize: 22,
    color: '#1A1E25',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'ManropeRegular',
    fontWeight: '400',
    fontSize: 12,
    color: '#7E8389',
  },
  // Intro
  introCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF8EB',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    gap: 10,
  },
  introText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '500',
    fontSize: 13,
    color: '#78350F',
    lineHeight: 19,
    flex: 1,
  },
  // Sections
  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#FEF8EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sectionTitle: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 14,
    color: '#1A1E25',
    flex: 1,
  },
  sectionContent: {
    fontFamily: 'ManropeRegular',
    fontWeight: '400',
    fontSize: 13,
    color: '#555555',
    lineHeight: 20,
  },
  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 6,
  },
  footerText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '500',
    fontSize: 13,
    color: '#7E8389',
  },
});

export default TermsAndConditionsScreen;
