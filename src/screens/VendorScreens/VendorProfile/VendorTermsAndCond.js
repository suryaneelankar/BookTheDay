import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';

const VendorTermsAndCond = () => {
  const sections = [
    {
      icon: 'document-text-outline',
      title: 'General Terms',
      content:
        'These Terms and Conditions constitute a binding agreement between you ("Vendor") and BookTheDay ("Platform"). By registering as a vendor and listing your venue on our platform, you agree to comply with all terms outlined herein. BookTheDay operates as a marketplace connecting venue owners with customers seeking event spaces.',
    },
    {
      icon: 'checkmark-shield-outline',
      title: 'Vendor Obligations',
      content:
        'As a registered vendor on BookTheDay, you are required to:\n\n• Provide accurate and up-to-date information about your venue\n• Honor all confirmed bookings and deliver services as described\n• Maintain the quality and standards shown in your listing\n• Respond to booking requests within 24 hours\n• Keep your availability calendar updated at all times\n• Comply with all local laws and regulations applicable to your venue',
    },
    {
      icon: 'images-outline',
      title: 'Listing & Content',
      content:
        'All photos, descriptions, and pricing on your listing must be accurate and represent the current state of your venue. You must not use misleading images or descriptions. Pricing must include all mandatory charges — hidden fees are not permitted. BookTheDay reserves the right to remove or edit listings that violate content guidelines or receive repeated customer complaints.',
    },
    {
      icon: 'calendar-outline',
      title: 'Booking Management',
      content:
        'When a customer places a booking request:\n\n• You must accept or reject the request within 24 hours\n• Once accepted, the booking is confirmed and binding\n• Confirmed bookings must be honored — failure to do so will result in penalties\n• You must keep your calendar updated to avoid double bookings\n• In case of genuine emergencies, contact BookTheDay support immediately for assistance with rescheduling',
    },
    {
      icon: 'wallet-outline',
      title: 'Payments & Commission',
      content:
        'All payments are processed securely via Razorpay:\n\n• Customers pay an advance amount to confirm bookings\n• BookTheDay deducts a platform commission from each transaction\n• Remaining payout is transferred to your registered bank account\n• Payouts are processed within 3-5 business days after the event date\n• Commission rates are communicated at the time of onboarding and may be revised with prior notice\n• GST and applicable taxes are handled as per government regulations',
    },
    {
      icon: 'close-circle-outline',
      title: 'Cancellation by Vendor',
      content:
        'Vendor-initiated cancellations are taken seriously:\n\n• If you cancel a confirmed booking, the customer receives a full refund\n• Repeated cancellations (3 or more in 30 days) may result in account suspension\n• A penalty fee may be deducted from your next payout for each vendor-initiated cancellation\n• Emergency cancellations must be communicated to BookTheDay support with valid documentation\n• Platform reserves the right to deprioritize listings of vendors with high cancellation rates',
    },
    {
      icon: 'ban-outline',
      title: 'Account Suspension',
      content:
        'BookTheDay reserves the right to suspend or terminate vendor accounts for:\n\n• Fake or misleading venue listings\n• Repeated booking rejections without valid reason\n• Multiple customer complaints regarding service quality\n• Failure to honor confirmed bookings\n• Violation of platform policies or these terms\n• Fraudulent activity or misrepresentation\n\nSuspended vendors will be notified via email and may appeal within 7 days.',
    },
    {
      icon: 'lock-closed-outline',
      title: 'Privacy & Data',
      content:
        'You will have access to customer information (name, phone number) only for booking-related communication. You must:\n\n• Not share customer data with third parties\n• Not use customer information for unsolicited marketing\n• Not contact customers outside the BookTheDay platform for transactions\n• Comply with applicable data protection regulations\n\nViolation of customer data privacy will result in immediate account suspension.',
    },
    {
      icon: 'create-outline',
      title: 'Amendments',
      content:
        'BookTheDay reserves the right to modify these Terms and Conditions at any time. Vendors will be notified of significant changes via the app and registered email. Continued use of the platform after amendments constitutes acceptance of the updated terms. Material changes to commission structure will be communicated at least 14 days in advance.',
    },
    {
      icon: 'mail-outline',
      title: 'Contact',
      content:
        'For questions, concerns, or disputes regarding these Terms and Conditions:\n\nEmail: support@booktheday.com\nVendor Support: Available in-app (24/7)\nAddress: Hyderabad, Telangana, India\n\nWe aim to respond to all vendor queries within 24 hours.',
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
        <Text style={styles.headerTitle}>Vendor Terms & Conditions</Text>
        <Text style={styles.headerSubtitle}>Last updated: July 2026</Text>
      </View>

      {/* Intro */}
      <View style={styles.introCard}>
        <IonIcon name="information-circle" size={18} color="#D97706" />
        <Text style={styles.introText}>
          By listing your venue on BookTheDay, you agree to the following
          terms. These govern your relationship with the platform and your
          responsibilities as a vendor partner.
        </Text>
      </View>

      {/* Sections */}
      {sections.map((section, idx) => (
        <View key={idx} style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>{idx + 1}</Text>
            </View>
            <View style={styles.sectionIconWrap}>
              <IonIcon name={section.icon} size={16} color="#D97706" />
            </View>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
          <Text style={styles.sectionContent}>{section.content}</Text>
        </View>
      ))}

      {/* Footer */}
      <View style={styles.footer}>
        <IonIcon name="heart" size={14} color="#D97706" />
        <Text style={styles.footerText}>
          Thank you for partnering with BookTheDay
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
  sectionBadge: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#D97706',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  sectionBadgeText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 11,
    color: '#FFFFFF',
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

export default VendorTermsAndCond;
