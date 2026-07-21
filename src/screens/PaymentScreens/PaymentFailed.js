import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const PaymentFailedScreen = () => {
  const navigation = useNavigation();

  const handleRetry = () => {
    navigation.goBack();
  };

  const handleHome = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* ── Top decorative gradient ── */}
        <LinearGradient
          colors={['#A0143E', '#D2453B', '#FD813B']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.topGradient}
        >
          <View style={styles.gradientCircle1} />
          <View style={styles.gradientCircle2} />
        </LinearGradient>

        {/* ── Main card ── */}
        <View style={styles.card}>

          {/* Icon circle */}
          <View style={styles.iconCircle}>
            <View style={styles.iconInner}>
              <Icon name="close" size={36} color="#A0143E" />
            </View>
          </View>

          {/* Status */}
          <Text style={styles.statusText}>Payment Failed</Text>
          <View style={styles.statusBadge}>
            <Icon name="alert-circle" size={14} color="#A0143E" />
            <Text style={styles.statusBadgeText}>Transaction Declined</Text>
          </View>

          {/* Description */}
          <Text style={styles.descText}>
            Your payment couldn't be processed. This may be due to insufficient funds, transaction limits, or a temporary issue.
          </Text>

          {/* Tips card */}
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>What you can do:</Text>
            <View style={styles.tipRow}>
              <Icon name="checkmark-circle" size={16} color="#FD813B" />
              <Text style={styles.tipText}>Check your bank balance</Text>
            </View>
            <View style={styles.tipRow}>
              <Icon name="checkmark-circle" size={16} color="#FD813B" />
              <Text style={styles.tipText}>Try a different payment method</Text>
            </View>
            <View style={styles.tipRow}>
              <Icon name="checkmark-circle" size={16} color="#FD813B" />
              <Text style={styles.tipText}>Contact your bank if the issue persists</Text>
            </View>
          </View>

          {/* Retry Button */}
          <TouchableOpacity onPress={handleRetry} style={styles.retryBtn} activeOpacity={0.88}>
            <LinearGradient
              colors={['#D2453B', '#A0143E']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.retryGradient}
            >
              <Icon name="refresh" size={18} color="#fff" />
              <Text style={styles.retryText}>Try Again</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Home Button */}
          <TouchableOpacity onPress={handleHome} style={styles.homeBtn} activeOpacity={0.8}>
            <Icon name="home-outline" size={16} color="#FD813B" />
            <Text style={styles.homeBtnText}>Back to Home</Text>
          </TouchableOpacity>

        </View>

        {/* ── Support text ── */}
        <View style={styles.supportRow}>
          <Icon name="headset-outline" size={14} color="#939393" />
          <Text style={styles.supportText}>Need help? Contact support</Text>
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFBF5' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },

  // ── TOP GRADIENT ──
  topGradient: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 220, borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  gradientCircle1: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.08)', top: -40, right: -30,
  },
  gradientCircle2: {
    position: 'absolute', width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)', top: 60, left: -20,
  },

  // ── CARD ──
  card: {
    backgroundColor: '#fff', borderRadius: 24, padding: 28, paddingTop: 50,
    width: width - 40, alignItems: 'center',
    elevation: 8, shadowColor: '#A0143E',
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 16,
  },

  // ── ICON ──
  iconCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(160,20,62,0.08)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
    borderWidth: 2, borderColor: 'rgba(160,20,62,0.15)',
  },
  iconInner: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(160,20,62,0.12)',
    justifyContent: 'center', alignItems: 'center',
  },

  // ── STATUS ──
  statusText: {
    fontFamily: 'ManropeRegular', fontSize: 24, fontWeight: '800',
    color: '#131313', marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(160,20,62,0.08)', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 5, marginBottom: 16,
  },
  statusBadgeText: {
    fontFamily: 'ManropeRegular', fontSize: 12, fontWeight: '600', color: '#A0143E',
  },

  // ── DESCRIPTION ──
  descText: {
    fontFamily: 'ManropeRegular', fontSize: 14, color: '#666',
    textAlign: 'center', lineHeight: 22, marginBottom: 20, paddingHorizontal: 4,
  },

  // ── TIPS ──
  tipsCard: {
    backgroundColor: '#FAFAFA', borderRadius: 14, padding: 16,
    width: '100%', marginBottom: 24, borderWidth: 1, borderColor: '#F1F1F1',
  },
  tipsTitle: {
    fontFamily: 'ManropeRegular', fontSize: 13, fontWeight: '700',
    color: '#131313', marginBottom: 10,
  },
  tipRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8,
  },
  tipText: {
    fontFamily: 'ManropeRegular', fontSize: 13, color: '#555', flex: 1,
  },

  // ── BUTTONS ──
  retryBtn: { width: '100%', borderRadius: 14, overflow: 'hidden', marginBottom: 12 },
  retryGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 15, gap: 8,
  },
  retryText: { fontFamily: 'ManropeRegular', fontSize: 15, fontWeight: '700', color: '#fff' },
  homeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 14, width: '100%',
    borderRadius: 14, borderWidth: 1.5, borderColor: '#FFEAC1',
    backgroundColor: '#FFF5EE',
  },
  homeBtnText: { fontFamily: 'ManropeRegular', fontSize: 14, fontWeight: '700', color: '#FD813B' },

  // ── SUPPORT ──
  supportRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 24,
  },
  supportText: { fontFamily: 'ManropeRegular', fontSize: 12, color: '#939393' },
});

export default PaymentFailedScreen;
