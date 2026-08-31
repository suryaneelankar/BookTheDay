import React, { useCallback } from 'react';

import {
  Alert,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

const SUPPORT_EMAIL =
  'bookthedaytechnologies@gmail.com';

const ContactUs = ({ navigation }) => {
  const openEmail = useCallback(async () => {
    const subject = encodeURIComponent(
      'BookTheDay Support Request',
    );

    const body = encodeURIComponent(
      [
        'Hello BookTheDay Support,',
        '',
        'I need assistance with:',
        '',
        '',
        'Thank you.',
      ].join('\n'),
    );

    const mailUrl =
      `mailto:${SUPPORT_EMAIL}` +
      `?subject=${subject}&body=${body}`;

    try {
      const canOpen =
        await Linking.canOpenURL(mailUrl);

      if (!canOpen) {
        Alert.alert(
          'Email app unavailable',
          `Please email us directly at ${SUPPORT_EMAIL}`,
        );

        return;
      }

      await Linking.openURL(mailUrl);
    } catch (error) {
      Alert.alert(
        'Unable to open email',
        `Please contact us at ${SUPPORT_EMAIL}`,
      );
    }
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFF8F3"
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={
          styles.contentContainer
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroIconContainer}>
            <Ionicons
              name="headset-outline"
              size={35}
              color="#C2541A"
            />
          </View>

          <Text style={styles.heroTitle}>
            How can we help?
          </Text>

          <Text style={styles.heroDescription}>
            Contact our support team for help with
            venue searches, booking requests,
            payments or your BookTheDay account.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Contact BookTheDay
        </Text>

        <TouchableOpacity
          style={styles.contactCard}
          onPress={openEmail}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel={`Email BookTheDay at ${SUPPORT_EMAIL}`}
        >
          <View style={styles.contactIcon}>
            <Ionicons
              name="mail-outline"
              size={24}
              color="#C2541A"
            />
          </View>

          <View style={styles.contactDetails}>
            <Text style={styles.contactLabel}>
              Email support
            </Text>

            <Text
              style={styles.contactValue}
              numberOfLines={2}
            >
              {SUPPORT_EMAIL}
            </Text>

            <Text style={styles.contactHint}>
              Tap to compose an email
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={21}
            color="#9A8174"
          />
        </TouchableOpacity>

        <View style={styles.responseCard}>
          <View style={styles.responseHeader}>
            <Ionicons
              name="time-outline"
              size={21}
              color="#256333"
            />

            <Text style={styles.responseTitle}>
              Response time
            </Text>
          </View>

          <Text style={styles.responseText}>
            We normally respond within one business
            day. Responses may take slightly longer
            on weekends and public holidays.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Before contacting us
        </Text>

        <View style={styles.helpCard}>
          <HelpItem
            icon="receipt-outline"
            title="Booking support"
            description="Include your booking or enquiry ID, if available."
          />

          <View style={styles.divider} />

          <HelpItem
            icon="business-outline"
            title="Venue listing support"
            description="Mention your venue name and registered mobile number."
          />

          <View style={styles.divider} />

          <HelpItem
            icon="card-outline"
            title="Payment support"
            description="Do not email your card number, PIN, OTP or password."
          />
        </View>

        <View style={styles.securityNotice}>
          <Ionicons
            name="shield-checkmark-outline"
            size={20}
            color="#8A5A12"
          />

          <Text style={styles.securityText}>
            BookTheDay will never ask for your OTP,
            password, UPI PIN or complete card
            details over email.
          </Text>
        </View>

        <Text style={styles.footerText}>
          BookTheDay Technologies
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const HelpItem = ({
  icon,
  title,
  description,
}) => (
  <View style={styles.helpItem}>
    <View style={styles.helpIcon}>
      <Ionicons
        name={icon}
        size={21}
        color="#6F4935"
      />
    </View>

    <View style={styles.helpContent}>
      <Text style={styles.helpTitle}>
        {title}
      </Text>

      <Text style={styles.helpDescription}>
        {description}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF8F3',
    paddingTop:
      Platform.OS === 'android'
        ? StatusBar.currentHeight
        : 0,
  },

  header: {
    minHeight: 58,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF8F3',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EADDD5',
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EADDD5',
  },

  headerTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: '#2D1B12',
  },

  headerPlaceholder: {
    width: 40,
  },

  container: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 36,
  },

  heroCard: {
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#F0DFD3',
  },

  heroIconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: '#FFF0E6',
  },

  heroTitle: {
    fontSize: 23,
    lineHeight: 30,
    fontWeight: '800',
    color: '#2D1B12',
    textAlign: 'center',
  },

  heroDescription: {
    marginTop: 9,
    fontSize: 14,
    lineHeight: 21,
    color: '#745F54',
    textAlign: 'center',
  },

  sectionTitle: {
    marginTop: 26,
    marginBottom: 12,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    color: '#35231A',
  },

  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECDDD4',
  },

  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0E6',
  },

  contactDetails: {
    flex: 1,
    marginHorizontal: 13,
  },

  contactLabel: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
    color: '#8A7367',
  },

  contactValue: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: '#B94A10',
  },

  contactHint: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 17,
    color: '#8A7367',
  },

  responseCard: {
    marginTop: 14,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#CDEEDD',
  },

  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  responseTitle: {
    marginLeft: 8,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: '#235B34',
  },

  responseText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
    color: '#416A4C',
  },

  helpCard: {
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECDDD4',
  },

  helpItem: {
    flexDirection: 'row',
    paddingVertical: 16,
  },

  helpIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8EEE8',
  },

  helpContent: {
    flex: 1,
    marginLeft: 12,
  },

  helpTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: '#38251C',
  },

  helpDescription: {
    marginTop: 3,
    fontSize: 13,
    lineHeight: 19,
    color: '#78655A',
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 51,
    backgroundColor: '#EDE1DA',
  },

  securityNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 18,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#FFF8E7',
    borderWidth: 1,
    borderColor: '#F1DFA8',
  },

  securityText: {
    flex: 1,
    marginLeft: 9,
    fontSize: 12,
    lineHeight: 18,
    color: '#75521A',
  },

  footerText: {
    marginTop: 28,
    fontSize: 12,
    color: '#99867C',
    textAlign: 'center',
  },
});

export default ContactUs;