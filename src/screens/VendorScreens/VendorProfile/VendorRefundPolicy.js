import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';

const VendorRefundPolicy = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <IonIcon name="wallet" size={20} color="#D97706" />
        </View>
        <Text style={styles.headerTitle}>Vendor Refund Policy</Text>
        <Text style={styles.headerSubtitle}>Last updated: July 2026</Text>
      </View>

      {/* Quick Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Quick Summary</Text>
        <View style={styles.summaryRow}>
          <IonIcon name="close-circle" size={16} color="#DC2626" />
          <Text style={styles.summaryText}>
            Vendor cancellations result in{' '}
            <Text style={styles.bold}>full refund to customer</Text>
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <IonIcon name="warning" size={16} color="#D97706" />
          <Text style={styles.summaryText}>
            Penalty fee deducted from{' '}
            <Text style={styles.bold}>next payout</Text> for vendor-initiated
            cancellations
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <IonIcon name="checkmark-circle" size={16} color="#059669" />
          <Text style={styles.summaryText}>
            Commission refunded if{' '}
            <Text style={styles.bold}>platform cancels</Text> the booking
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <IonIcon name="time" size={16} color="#4F46E5" />
          <Text style={styles.summaryText}>
            Disputes resolved within{' '}
            <Text style={styles.bold}>14 business days</Text>
          </Text>
        </View>
      </View>

      {/* Section 1 */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionNum}>
            <Text style={styles.sectionNumText}>1</Text>
          </View>
          <Text style={styles.sectionTitle}>Customer Refunds</Text>
        </View>
        <Text style={styles.sectionContent}>
          As a vendor, you are required to honor refund requests in the
          following scenarios:
        </Text>
        <View style={styles.bulletList}>
          <View style={styles.bulletRow}>
            <IonIcon name="arrow-forward-circle" size={14} color="#D97706" />
            <Text style={styles.bulletText}>
              You cancel a confirmed booking for any reason
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <IonIcon name="arrow-forward-circle" size={14} color="#D97706" />
            <Text style={styles.bulletText}>
              Services provided do not match what was described in the listing
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <IonIcon name="arrow-forward-circle" size={14} color="#D97706" />
            <Text style={styles.bulletText}>
              Venue is unavailable on the booked date due to vendor oversight
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <IonIcon name="arrow-forward-circle" size={14} color="#D97706" />
            <Text style={styles.bulletText}>
              Major amenities listed are not provided during the event
            </Text>
          </View>
        </View>
        <Text style={styles.sectionContent}>
          In all above cases, the customer receives a full refund including the
          advance payment.
        </Text>
      </View>

      {/* Section 2 */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionNum}>
            <Text style={styles.sectionNumText}>2</Text>
          </View>
          <Text style={styles.sectionTitle}>Vendor-Initiated Cancellations</Text>
        </View>
        <Text style={styles.sectionContent}>
          If you cancel a confirmed booking:
        </Text>
        <View style={styles.bulletList}>
          <View style={styles.bulletRow}>
            <IonIcon name="close-circle" size={14} color="#DC2626" />
            <Text style={[styles.bulletText, {color: '#DC2626'}]}>
              Customer receives a full refund of all payments
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <IonIcon name="close-circle" size={14} color="#DC2626" />
            <Text style={[styles.bulletText, {color: '#DC2626'}]}>
              A penalty fee (up to 10% of booking value) is deducted from your
              next payout
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <IonIcon name="close-circle" size={14} color="#DC2626" />
            <Text style={[styles.bulletText, {color: '#DC2626'}]}>
              3 or more cancellations in 30 days may result in account
              suspension
            </Text>
          </View>
        </View>
        <View style={styles.noteCard}>
          <IonIcon name="information-circle" size={16} color="#78350F" />
          <Text style={styles.noteText}>
            Emergency cancellations with valid documentation (natural disaster,
            government order) are reviewed on a case-by-case basis and may be
            exempt from penalties.
          </Text>
        </View>
      </View>

      {/* Section 3 */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionNum}>
            <Text style={styles.sectionNumText}>3</Text>
          </View>
          <Text style={styles.sectionTitle}>Commission on Refunds</Text>
        </View>
        <Text style={styles.sectionContent}>
          How platform commission is handled when a refund occurs:
        </Text>
        <View style={styles.bulletList}>
          <View style={styles.bulletRow}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>
              If the vendor cancels: Commission already deducted is not
              refunded to vendor
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>
              If the customer cancels (eligible refund): Commission is
              adjusted proportionally
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>
              If the platform cancels: Full commission is refunded to both
              parties
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>
              Partial refunds: Commission is recalculated on the final booking
              amount
            </Text>
          </View>
        </View>
      </View>

      {/* Section 4 */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionNum}>
            <Text style={styles.sectionNumText}>4</Text>
          </View>
          <Text style={styles.sectionTitle}>Payout Deductions</Text>
        </View>
        <Text style={styles.sectionContent}>
          When a refund is issued to a customer due to vendor fault:
        </Text>
        <View style={styles.processSteps}>
          <View style={styles.stepRow}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumText}>1</Text>
            </View>
            <Text style={styles.stepText}>
              Refund amount is calculated based on the booking value
            </Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepRow}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumText}>2</Text>
            </View>
            <Text style={styles.stepText}>
              Amount is deducted from your next scheduled payout
            </Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepRow}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumText}>3</Text>
            </View>
            <Text style={styles.stepText}>
              If payout is insufficient, deduction carries over to subsequent
              payouts
            </Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepRow}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumText}>4</Text>
            </View>
            <Text style={styles.stepText}>
              Detailed deduction breakdown visible in your Transactions
              dashboard
            </Text>
          </View>
        </View>
      </View>

      {/* Section 5 */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionNum}>
            <Text style={styles.sectionNumText}>5</Text>
          </View>
          <Text style={styles.sectionTitle}>Dispute Resolution</Text>
        </View>
        <Text style={styles.sectionContent}>
          If you disagree with a refund decision:
        </Text>
        <View style={styles.bulletList}>
          <View style={styles.bulletRow}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>
              Raise a dispute within 7 days of the refund notification
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>
              Provide supporting evidence (photos, communication records,
              documentation)
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>
              BookTheDay mediates between vendor and customer
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>
              Resolution provided within 14 business days
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>
              Platform's decision on disputes is final and binding
            </Text>
          </View>
        </View>
      </View>

      {/* Section 6 - Contact */}
      <View style={styles.contactCard}>
        <IonIcon name="help-circle" size={20} color="#D97706" />
        <View style={styles.contactTextArea}>
          <Text style={styles.contactTitle}>Need Help?</Text>
          <Text style={styles.contactDesc}>
            For refund queries, payout issues, or dispute resolution, contact
            us at support@booktheday.com or use the in-app vendor support chat.
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By listing your venue on BookTheDay, you acknowledge that you have
          read and agreed to this refund policy.
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
  // Summary
  summaryCard: {
    marginHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  summaryTitle: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 14,
    color: '#1A1E25',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 8,
  },
  summaryText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '400',
    fontSize: 13,
    color: '#555555',
    lineHeight: 18,
    flex: 1,
  },
  bold: {
    fontWeight: '700',
    color: '#1A1E25',
  },
  // Sections
  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionNum: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#FEF8EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sectionNumText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 12,
    color: '#D97706',
  },
  sectionTitle: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 15,
    color: '#1A1E25',
    flex: 1,
  },
  sectionContent: {
    fontFamily: 'ManropeRegular',
    fontWeight: '400',
    fontSize: 13,
    color: '#555555',
    lineHeight: 20,
    marginBottom: 8,
  },
  // Bullets
  bulletList: {
    marginTop: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D97706',
    marginTop: 6,
  },
  bulletText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '400',
    fontSize: 13,
    color: '#555555',
    lineHeight: 19,
    flex: 1,
  },
  // Note card
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF8EB',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    gap: 8,
  },
  noteText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '400',
    fontSize: 12,
    color: '#78350F',
    lineHeight: 17,
    flex: 1,
  },
  // Process steps
  processSteps: {
    marginTop: 4,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D97706',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 11,
    color: '#FFFFFF',
  },
  stepText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '400',
    fontSize: 13,
    color: '#555555',
    lineHeight: 19,
    flex: 1,
  },
  stepLine: {
    width: 1,
    height: 16,
    backgroundColor: '#D97706',
    marginLeft: 11.5,
    marginVertical: 2,
  },
  // Contact
  contactCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: '#FEF8EB',
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  contactTextArea: {
    flex: 1,
  },
  contactTitle: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 14,
    color: '#78350F',
    marginBottom: 4,
  },
  contactDesc: {
    fontFamily: 'ManropeRegular',
    fontWeight: '400',
    fontSize: 12,
    color: '#78350F',
    lineHeight: 17,
  },
  // Footer
  footer: {
    marginHorizontal: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '400',
    fontSize: 12,
    color: '#7E8389',
    textAlign: 'center',
    lineHeight: 17,
  },
});

export default VendorRefundPolicy;
