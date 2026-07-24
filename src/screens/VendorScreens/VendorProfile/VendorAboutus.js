import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const VendorAboutus = () => {
  const trustPoints = [
    {icon: 'globe', title: 'Wider Reach', desc: 'Get discovered by thousands of customers actively searching for venues in your area'},
    {icon: 'flash', title: 'Instant Bookings', desc: 'Receive booking requests directly — no middlemen, no delays'},
    {icon: 'card', title: 'Secure Payments', desc: 'Guaranteed payouts via Razorpay with transparent commission structure'},
    {icon: 'bar-chart', title: 'Dashboard Analytics', desc: 'Track your bookings, earnings, and performance with real-time insights'},
    {icon: 'headset', title: '24/7 Support', desc: 'Dedicated vendor support team available round the clock to assist you'},
    {icon: 'pricetag', title: 'Zero Setup Fee', desc: 'List your venue for free — no upfront charges, no hidden costs'},
  ];

  const howItWorks = [
    {step: '1', title: 'List Your Venue', desc: 'Add your venue details, photos, pricing, and availability calendar'},
    {step: '2', title: 'Get Bookings', desc: 'Customers discover your venue and send booking requests'},
    {step: '3', title: 'Accept or Reject', desc: 'Review each request and confirm or decline within 24 hours'},
    {step: '4', title: 'Receive Payments', desc: 'Get paid securely to your bank account after successful events'},
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <LinearGradient
        colors={['#92400E', '#D97706', '#FBBF24']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.heroBanner}>
        <View style={styles.heroIconWrap}>
          <IonIcon name="storefront" size={28} color="rgba(255,255,255,0.9)" />
        </View>
        <Text style={styles.heroTitle}>BookTheDay for Vendors</Text>
        <Text style={styles.heroTagline}>
          Grow your venue business with India's trusted booking platform
        </Text>
      </LinearGradient>

      {/* Who We Are */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Who We Are</Text>
        <Text style={styles.paragraph}>
          BookTheDay is a venue marketplace platform that connects venue owners
          and event service vendors with customers looking to book spaces for
          weddings, receptions, corporate events, birthdays, and celebrations.
        </Text>
        <Text style={styles.paragraph}>
          We provide vendors with a powerful digital storefront to showcase
          their venues, manage bookings effortlessly, and grow their business
          — all from one simple dashboard.
        </Text>
      </View>

      {/* Why Partner With Us */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Partner With Us</Text>
        {trustPoints.map((point, idx) => (
          <View key={idx} style={styles.trustRow}>
            <View style={styles.trustIconWrap}>
              <IonIcon name={point.icon} size={18} color="#D97706" />
            </View>
            <View style={styles.trustTextArea}>
              <Text style={styles.trustTitle}>{point.title}</Text>
              <Text style={styles.trustDesc}>{point.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* How It Works */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How It Works for Vendors</Text>
        <View style={styles.processSteps}>
          {howItWorks.map((item, idx) => (
            <React.Fragment key={idx}>
              <View style={styles.stepRow}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepNum}>{item.step}</Text>
                </View>
                <View style={styles.stepTextArea}>
                  <Text style={styles.stepTitle}>{item.title}</Text>
                  <Text style={styles.stepDesc}>{item.desc}</Text>
                </View>
              </View>
              {idx < howItWorks.length - 1 && <View style={styles.stepLine} />}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>1000+</Text>
          <Text style={styles.statLabel}>Customers</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>500+</Text>
          <Text style={styles.statLabel}>Venues Listed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>📍</Text>
          <Text style={styles.statLabel}>Hyderabad</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <IonIcon name="heart" size={14} color="#D97706" />
        <Text style={styles.footerText}>Made with love in Hyderabad</Text>
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
  // Hero
  heroBanner: {
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroTitle: {
    fontFamily: 'ManropeRegular',
    fontWeight: '800',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign: 'center',
  },
  heroTagline: {
    fontFamily: 'ManropeRegular',
    fontWeight: '500',
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  // Sections
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontFamily: 'ManropeRegular',
    fontWeight: '800',
    fontSize: 18,
    color: '#1A1E25',
    marginBottom: 12,
  },
  paragraph: {
    fontFamily: 'ManropeRegular',
    fontWeight: '400',
    fontSize: 14,
    color: '#555555',
    lineHeight: 22,
    marginBottom: 10,
  },
  // Trust
  trustRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  trustIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FEF8EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  trustTextArea: {
    flex: 1,
  },
  trustTitle: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 14,
    color: '#1A1E25',
    marginBottom: 2,
  },
  trustDesc: {
    fontFamily: 'ManropeRegular',
    fontWeight: '400',
    fontSize: 12,
    color: '#7E8389',
    lineHeight: 17,
  },
  // How It Works
  processSteps: {
    marginTop: 4,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D97706',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNum: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 12,
    color: '#FFFFFF',
  },
  stepTextArea: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 14,
    color: '#1A1E25',
    marginBottom: 2,
  },
  stepDesc: {
    fontFamily: 'ManropeRegular',
    fontWeight: '400',
    fontSize: 12,
    color: '#7E8389',
    lineHeight: 17,
  },
  stepLine: {
    width: 1,
    height: 16,
    backgroundColor: '#D97706',
    marginLeft: 13.5,
    marginVertical: 4,
  },
  // Stats
  statsSection: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statNum: {
    fontFamily: 'ManropeRegular',
    fontWeight: '800',
    fontSize: 18,
    color: '#D97706',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'ManropeRegular',
    fontWeight: '500',
    fontSize: 11,
    color: '#7E8389',
  },
  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    gap: 6,
  },
  footerText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '500',
    fontSize: 13,
    color: '#7E8389',
  },
});

export default VendorAboutus;
