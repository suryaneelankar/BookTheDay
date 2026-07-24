import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const AboutUs = () => {
  const categories = [
    {icon: 'ribbon-outline', label: 'Banquet Halls', color: '#D97706'},
    {icon: 'business-outline', label: 'Function Halls', color: '#4F46E5'},
    {icon: 'leaf-outline', label: 'Farm Houses', color: '#059669'},
    {icon: 'sparkles-outline', label: 'Luxury Resorts', color: '#9333EA'},
  ];

  const trustPoints = [
    {icon: 'shield-checkmark', title: 'Verified Venues', desc: 'Every venue is personally visited and verified by our team'},
    {icon: 'flash', title: 'Instant Booking', desc: 'Get confirmed bookings immediately with no waiting time'},
    {icon: 'card', title: 'Secure Payments', desc: '100% safe transactions powered by Razorpay'},
    {icon: 'refresh', title: 'Easy Cancellation', desc: 'Flexible cancellation policy with hassle-free refunds'},
    {icon: 'headset', title: '24/7 Support', desc: 'Our dedicated team is always available to help you'},
    {icon: 'location', title: 'Local Expertise', desc: 'Deep knowledge of venues across Hyderabad'},
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
          <IonIcon name="calendar" size={28} color="rgba(255,255,255,0.9)" />
        </View>
        <Text style={styles.heroTitle}>BookTheDay</Text>
        <Text style={styles.heroTagline}>
          Your trusted partner for booking the perfect venue
        </Text>
      </LinearGradient>

      {/* Mission */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Who We Are</Text>
        <Text style={styles.paragraph}>
          BookTheDay is Hyderabad's premier event venue booking platform. We
          connect customers with the best banquet halls, function halls, farm
          houses, and luxury resorts — making it effortless to find and book the
          perfect space for weddings, receptions, birthday parties, corporate
          events, and all your celebrations.
        </Text>
        <Text style={styles.paragraph}>
          Founded with a mission to simplify event planning, we eliminate the
          stress of venue hunting by bringing all options to your fingertips
          with transparent pricing, real photos, and instant confirmation.
        </Text>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What We Offer</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((cat, idx) => (
            <View key={idx} style={styles.categoryCard}>
              <View style={[styles.categoryIcon, {backgroundColor: `${cat.color}12`}]}>
                <IonIcon name={cat.icon} size={22} color={cat.color} />
              </View>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Trust Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Trust Us</Text>
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

      {/* Stats */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>500+</Text>
          <Text style={styles.statLabel}>Venues Listed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>1000+</Text>
          <Text style={styles.statLabel}>Happy Customers</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>4.8★</Text>
          <Text style={styles.statLabel}>Avg. Rating</Text>
        </View>
      </View>

      {/* Closing */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Promise</Text>
        <Text style={styles.paragraph}>
          We believe every celebration deserves the perfect venue. That's why
          every listing on BookTheDay is personally verified, ensuring you get
          exactly what you see — no surprises, no hidden charges.
        </Text>
        <Text style={styles.paragraph}>
          Whether it's an intimate family gathering or a grand wedding
          celebration, BookTheDay is here to make your special moments
          unforgettable.
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <IonIcon name="heart" size={14} color="#D97706" />
        <Text style={styles.footerText}>
          Made with love in Hyderabad
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
    fontSize: 26,
    color: '#FFFFFF',
    marginBottom: 6,
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
  // Categories
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryCard: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  categoryIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  categoryLabel: {
    fontFamily: 'ManropeRegular',
    fontWeight: '600',
    fontSize: 12,
    color: '#1A1E25',
    flexShrink: 1,
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

export default AboutUs;
