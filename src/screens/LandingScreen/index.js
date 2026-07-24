import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import IonIcon from 'react-native-vector-icons/Ionicons';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const LandingScreen = () => {
  const navigation = useNavigation();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const cardScale = useRef(new Animated.Value(0.9)).current;
  const btnFade = useRef(new Animated.Value(0)).current;
  const vendorFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(180, [
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(slideUpAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(btnFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(vendorFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const categories = [
    {icon: 'leaf-outline', label: 'Farm Houses', color: '#22C55E', bg: '#ECFDF5'},
    {icon: 'sparkles-outline', label: 'Luxury Resorts', color: '#8B5CF6', bg: '#F3E8FF'},
    {icon: 'business-outline', label: 'Function Halls', color: '#3B82F6', bg: '#EFF6FF'},
    {icon: 'ribbon-outline', label: 'Banquet Halls', color: '#F59E0B', bg: '#FEF9C3'},
  ];

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Soft background gradient */}
      <LinearGradient
        colors={['#FFFFFF', '#FFF8F4', '#FFF1EB']}
        start={{x: 0, y: 0}}
        end={{x: 0.3, y: 1}}
        style={styles.bgGradient}
      />

      {/* Decorative blobs */}
      <View style={styles.blobTopRight} />
      <View style={styles.blobBottomLeft} />

      {/* Content */}
      <View style={styles.content}>
        {/* Brand */}
        <Animated.View
          style={[
            styles.brandArea,
            {opacity: fadeAnim, transform: [{translateY: slideUpAnim}]},
          ]}>
          <View style={styles.logoBadge}>
            <IonIcon name="calendar" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.brandName}>BookTheDay</Text>
        </Animated.View>

        {/* Headline */}
        <Animated.View
          style={[
            styles.headlineArea,
            {opacity: fadeAnim, transform: [{translateY: slideUpAnim}]},
          ]}>
          <Text style={styles.headline}>
            Find Your{'\n'}Dream Venue
          </Text>
          <Text style={styles.subheadline}>
            Discover and book the perfect space for your celebrations — from rustic farm houses to grand banquet halls.
          </Text>
        </Animated.View>

        {/* Category cards */}
        <Animated.View
          style={[styles.categoriesGrid, {transform: [{scale: cardScale}]}]}>
          {categories.map((item, idx) => (
            <View key={idx} style={styles.categoryCard}>
              <View style={[styles.categoryIconBg, {backgroundColor: item.bg}]}>
                <IonIcon name={item.icon} size={22} color={item.color} />
              </View>
              <Text style={styles.categoryLabel}>{item.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* CTA Button */}
        <Animated.View style={[styles.ctaArea, {opacity: btnFade}]}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('LoginScreen', {type: 'user'})}
            style={styles.ctaWrapper}>
            <LinearGradient
              colors={['#FD813B', '#E8533C']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.ctaBtn}>
              <Text style={styles.ctaText}>Get Started</Text>
              <View style={styles.ctaArrow}>
                <IonIcon name="arrow-forward" size={16} color="#FD813B" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Trust signal */}
          <View style={styles.trustRow}>
            <IonIcon name="shield-checkmark" size={13} color="#22C55E" />
            <Text style={styles.trustText}>Trusted by 1000+ happy customers</Text>
          </View>
        </Animated.View>

        {/* Vendor CTA */}
        <Animated.View style={[styles.vendorArea, {opacity: vendorFade}]}>
          <View style={styles.vendorDivider} />
          <TouchableOpacity
            onPress={() => navigation.navigate('LoginScreen', {type: 'vendor'})}
            style={styles.vendorRow}
            activeOpacity={0.7}>
            <Text style={styles.vendorText}>Are you a venue owner?</Text>
            <View style={styles.vendorBtnPill}>
              <Text style={styles.vendorBtnText}>List Your Venue</Text>
              <IonIcon name="arrow-forward-circle" size={16} color="#FD813B" />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  bgGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  // Decorative
  blobTopRight: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(253, 129, 59, 0.08)',
  },
  blobBottomLeft: {
    position: 'absolute',
    bottom: -30,
    left: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
  },
  // Layout
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 24,
  },
  // Brand
  brandArea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FD813B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#FD813B',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  brandName: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 20,
    color: '#1A1E25',
  },
  // Headline
  headlineArea: {
    marginBottom: 32,
  },
  headline: {
    fontFamily: 'ManropeRegular',
    fontWeight: '800',
    fontSize: 34,
    color: '#1A1E25',
    lineHeight: 42,
    marginBottom: 12,
  },
  subheadline: {
    fontFamily: 'ManropeRegular',
    fontWeight: '500',
    fontSize: 15,
    color: '#7E8389',
    lineHeight: 22,
    paddingRight: 20,
  },
  // Categories
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 36,
  },
  categoryCard: {
    width: (SCREEN_WIDTH - 48 - 12) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  categoryIconBg: {
    width: 40,
    height: 40,
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
  // CTA
  ctaArea: {
    marginBottom: 20,
  },
  ctaWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#FD813B',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 17,
    borderRadius: 14,
  },
  ctaText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 10,
  },
  ctaArrow: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  trustText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '500',
    fontSize: 12,
    color: '#7E8389',
    marginLeft: 5,
  },
  // Vendor
  vendorArea: {
    alignItems: 'center',
  },
  vendorDivider: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    marginBottom: 16,
  },
  vendorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '500',
    fontSize: 13,
    color: '#7E8389',
    marginRight: 8,
  },
  vendorBtnPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(253, 129, 59, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(253, 129, 59, 0.2)',
  },
  vendorBtnText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 12,
    color: '#FD813B',
    marginRight: 4,
  },
});

export default LandingScreen;
