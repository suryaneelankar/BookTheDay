import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Animated,
  Platform,
  UIManager,
  BackHandler,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import BASE_URL from '../../apiconfig';
import {getUserAuthToken} from '../../utils/StoreAuthToken';
import FastImage from 'react-native-fast-image';
import {formatAmount} from '../../utils/GlobalFunctions';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HALL_TYPES = [
  {id: 'all', label: 'All'},
  {id: 'Function Hall', label: 'Function Hall'},
  {id: 'Banquet Hall', label: 'Banquet Hall'},
  {id: 'Farm House', label: 'Farm House'},
  {id: 'Luxury Resort', label: 'Luxury Resort'},
];

const getPriceRange = budgetVal => {
  const b = parseInt(budgetVal);
  if (b <= 50000) return '10k-50k';
  if (b <= 100000) return '50k-1L';
  if (b <= 200000) return '1L-2L';
  if (b <= 300000) return '2L-3L';
  if (b <= 500000) return '3L-5L';
  if (b <= 1000000) return '5L-10L';
  if (b <= 1500000) return '10L-15L';
  return '15L-20L';
};

// Parse seating capacity range like "200-400" → upper limit
const parseCapacity = (capStr) => {
  if (!capStr) return 0;
  if (typeof capStr === 'number') return capStr;
  const str = String(capStr);
  if (str.includes('-')) {
    const parts = str.split('-');
    return parseInt(parts[1]) || parseInt(parts[0]) || 0;
  }
  if (str.includes('+')) return parseInt(str) || 0;
  return parseInt(str) || 0;
};

const calculateMatchScore = (venue, budget, guestCount, userLocation) => {
  let score = 0;
  const budgetNum = parseInt(budget) || 0;
  const price = venue?.rentPricePerDay || 0;

  // Budget fit (40 points)
  if (budgetNum > 0 && price > 0) {
    if (price <= budgetNum) {
      const ratio = price / budgetNum;
      score += ratio >= 0.5 ? 40 : Math.round(ratio * 80);
    } else {
      const overRatio = price / budgetNum;
      if (overRatio <= 1.2) score += 25;
      else if (overRatio <= 1.5) score += 15;
      else score += 5;
    }
  } else if (price === 0) {
    score += 20;
  }

  // Capacity fit (20 points) — parse range strings like "200-400"
  const guests = parseInt(guestCount) || 0;
  const capacity = parseCapacity(venue?.seatingCapacity);
  if (guests > 0 && capacity > 0) {
    if (capacity >= guests && capacity <= guests * 2) score += 20;
    else if (capacity >= guests) score += 15;
    else if (capacity >= guests * 0.7) score += 10;
    else score += 5;
  } else {
    score += 10;
  }

  // Amenities (15 points)
  if (venue?.ac) score += 5;
  if (venue?.bedRooms > 0) score += 5;
  if (venue?.menuImages?.length > 0 || venue?.foodType) score += 5;

  // Location match (10 points)
  if (userLocation && venue?.functionHallAddress?.address) {
    const addr = venue.functionHallAddress.address.toLowerCase();
    if (addr.includes(userLocation.toLowerCase())) score += 10;
    else score += 3;
  } else {
    score += 5;
  }

  // Media (15 points) — include additionalImages
  if (venue?.hallVideos?.length > 0) score += 5;
  const imgCount =
    (venue?.additionalImages?.flat()?.length || 0) +
    (venue?.menuImages?.length || 0) +
    (venue?.professionalImage ? 1 : 0);
  if (imgCount >= 6) score += 10;
  else if (imgCount >= 4) score += 8;
  else if (imgCount >= 2) score += 5;
  else if (imgCount >= 1) score += 3;

  return Math.min(score, 100);
};

const getStarRating = score => {
  if (score >= 90) return 5;
  if (score >= 75) return 4;
  if (score >= 60) return 3.5;
  if (score >= 45) return 3;
  return 2.5;
};

const getBudgetHealth = (budget, avgPrice) => {
  if (avgPrice === 0) return {label: 'Unknown', color: '#7E8389', desc: 'No pricing data available.'};
  const ratio = budget / avgPrice;
  if (ratio >= 2) return {label: 'Excellent', color: '#059669', desc: 'Your budget comfortably covers most venues with room for extras like decoration and catering.'};
  if (ratio >= 1.3) return {label: 'Good', color: '#059669', desc: 'Your budget fits well within the average range. You have flexibility for add-ons.'};
  if (ratio >= 1) return {label: 'Tight', color: '#D97706', desc: 'Your budget just about covers the average venue. Consider trimming extras.'};
  return {label: 'Over Budget', color: '#DC2626', desc: 'The average venue exceeds your budget. Consider expanding your search area or adjusting expectations.'};
};

const BudgetPlanner = () => {
  const navigation = useNavigation();

  // State machine
  const [phase, setPhase] = useState('input');

  // Input state
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [hallType, setHallType] = useState('all');
  const [locations, setLocations] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Data state
  const [results, setResults] = useState([]);
  const [totalVenues, setTotalVenues] = useState(0);

  // Analyzing animation
  const [analyzingText, setAnalyzingText] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const dotAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if (phase === 'analyzing') {
      runAnalyzingAnimation();
    }
  }, [phase]);

  // Handle Android back button
  useEffect(() => {
    const handleBack = () => {
      if (phase === 'recommendations') {
        setPhase('report');
        return true;
      } else if (phase === 'report') {
        setPhase('input');
        return true;
      }
      return false; // let navigation handle it (go back to home)
    };
    BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => BackHandler.removeEventListener('hardwareBackPress', handleBack);
  }, [phase]);

  const fetchLocations = async () => {
    try {
      const token = await getUserAuthToken();
      const response = await axios.get(`${BASE_URL}/user/locationList`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      if (response?.data?.data) {
        setLocations(response.data.data);
      }
    } catch (err) {
      console.log('Location fetch error:', err);
    }
  };

  const handleLocationChange = text => {
    setLocation(text);
    if (text.length > 1) {
      const filtered = locations.filter(loc =>
        loc.value.toLowerCase().includes(text.toLowerCase()),
      );
      setLocationSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectLocation = loc => {
    setLocation(loc.value);
    setShowSuggestions(false);
  };

  const runAnalyzingAnimation = () => {
    const messages = [
      `Analyzing 248 venues near ${location || 'you'}...`,
      'Calculating budget match...',
      'Preparing your personalized report...',
    ];
    let index = 0;
    setAnalyzingText(messages[0]);

    const interval = setInterval(() => {
      index++;
      if (index < messages.length) {
        setAnalyzingText(messages[index]);
      } else {
        clearInterval(interval);
      }
    }, 700);

    // Dot animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim, {toValue: 1, duration: 400, useNativeDriver: true}),
        Animated.timing(dotAnim, {toValue: 0, duration: 400, useNativeDriver: true}),
      ]),
    ).start();

    return () => clearInterval(interval);
  };

  const fetchVenues = async () => {
    if (!budget) return;
    setPhase('analyzing');

    const token = await getUserAuthToken();
    const priceRange = getPriceRange(budget);
    const params = {page: 1, limit: 50, priceRanges: priceRange};
    if (hallType !== 'all') {
      params.venueCategory = hallType;
    }

    try {
      const response = await axios.get(`${BASE_URL}/filterFunctionHalls`, {
        params,
        headers: {Authorization: `Bearer ${token}`},
      });

      const allData = Array.isArray(response?.data?.data)
        ? response.data.data
        : [];

      let filtered = allData;
      if (location.trim()) {
        const locFiltered = allData.filter(item =>
          item?.functionHallAddress?.address
            ?.toLowerCase()
            .includes(location.toLowerCase()),
        );
        if (locFiltered.length > 0) filtered = locFiltered;
      }

      const scored = filtered.map(venue => ({
        ...venue,
        matchScore: calculateMatchScore(venue, budget, guestCount, location),
      }));
      scored.sort((a, b) => b.matchScore - a.matchScore);

      setResults(scored);
      setTotalVenues(allData.length);

      // 2-second premium delay
      setTimeout(() => {
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
        setPhase('report');
      }, 2000);
    } catch (error) {
      console.log('AI Venue Planner error:', error);
      setResults([]);
      setTotalVenues(0);
      setTimeout(() => setPhase('report'), 2000);
    }
  };

  const getReportStats = useCallback(() => {
    const prices = results
      .filter(v => v.rentPricePerDay > 0)
      .map(v => v.rentPricePerDay);
    const avgPrice =
      prices.length > 0
        ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
        : 0;
    const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const highestMatch = results.length > 0 ? results[0].matchScore : 0;
    const budgetNum = parseInt(budget) || 0;
    const remaining = budgetNum - avgPrice;

    return {avgPrice, lowestPrice, highestMatch, budgetNum, remaining, count: results.length};
  }, [results, budget]);

  const getVenueReasons = venue => {
    const reasons = [];
    const budgetNum = parseInt(budget) || 0;
    const price = venue?.rentPricePerDay || 0;
    if (price > 0 && price <= budgetNum) reasons.push('Fits your budget');
    const guests = parseInt(guestCount) || 0;
    const capacity = venue?.seatingCapacity || 0;
    if (guests > 0 && capacity >= guests) reasons.push('Perfect capacity');
    if (
      location &&
      venue?.functionHallAddress?.address
        ?.toLowerCase()
        .includes(location.toLowerCase())
    ) {
      reasons.push('In your area');
    }
    if (venue?.ac) reasons.push('AC available');
    if (venue?.bedRooms > 0) reasons.push('Includes rooms');
    if (venue?.menuImages?.length > 0 || venue?.foodType)
      reasons.push('Food options');
    if (venue?.hallVideos?.length > 0) reasons.push('Video tour available');
    return reasons;
  };

  const renderStars = score => {
    const rating = getStarRating(score);
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const stars = [];
    for (let i = 0; i < full; i++) {
      stars.push(
        <IonIcon key={`f${i}`} name="star" size={12} color="#FBBF24" />,
      );
    }
    if (half)
      stars.push(
        <IonIcon key="h" name="star-half" size={12} color="#FBBF24" />,
      );
    const empty = 5 - full - (half ? 1 : 0);
    for (let i = 0; i < empty; i++) {
      stars.push(
        <IonIcon key={`e${i}`} name="star-outline" size={12} color="#E5E7EB" />,
      );
    }
    return <View style={styles.starsRow}>{stars}</View>;
  };

  const handleRetryRelaxed = () => {
    const newBudget = String(Math.round((parseInt(budget) || 100000) * 1.3));
    setBudget(newBudget);
    setHallType('all');
    setPhase('input');
  };

  // ═══════════════════════════════════════════
  // PHASE: INPUT
  // ═══════════════════════════════════════════
  const renderInputPhase = () => (
    <View style={styles.inputCard}>
      <Text style={styles.inputSectionTitle}>Tell us about your event</Text>

      {/* Budget */}
      <Text style={styles.inputLabel}>Budget (required)</Text>
      <View style={styles.budgetInputRow}>
        <Text style={styles.currencySymbol}>₹</Text>
        <TextInput
          style={styles.budgetInput}
          placeholder="e.g. 200000"
          placeholderTextColor="#A0A5AB"
          value={budget}
          onChangeText={setBudget}
          keyboardType="numeric"
        />
      </View>

      {/* Location */}
      <Text style={[styles.inputLabel, {marginTop: 16}]}>Location</Text>
      <View style={styles.locationInputRow}>
        <IonIcon name="location-outline" size={16} color="#7E8389" />
        <TextInput
          style={styles.locationInput}
          placeholder="e.g. Hyderabad, Kukatpally"
          placeholderTextColor="#A0A5AB"
          value={location}
          onChangeText={handleLocationChange}
          onFocus={() =>
            location.length > 1 &&
            setShowSuggestions(locationSuggestions.length > 0)
          }
        />
      </View>
      {showSuggestions && (
        <View style={styles.suggestionsBox}>
          {locationSuggestions.slice(0, 5).map(loc => (
            <TouchableOpacity
              key={loc._id}
              style={styles.suggestionItem}
              onPress={() => selectLocation(loc)}>
              <IonIcon name="location" size={14} color="#D97706" />
              <Text style={styles.suggestionText}>{loc.value}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Guest Count */}
      <Text style={[styles.inputLabel, {marginTop: 16}]}>Guest Count (optional)</Text>
      <View style={styles.locationInputRow}>
        <IonIcon name="people-outline" size={16} color="#7E8389" />
        <TextInput
          style={styles.locationInput}
          placeholder="e.g. 300"
          placeholderTextColor="#A0A5AB"
          value={guestCount}
          onChangeText={setGuestCount}
          keyboardType="numeric"
        />
      </View>

      {/* Hall Type Chips */}
      <Text style={[styles.inputLabel, {marginTop: 16}]}>Hall Type</Text>
      <View style={styles.chipsRow}>
        {HALL_TYPES.map(type => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.chip,
              hallType === type.id && styles.chipActive,
            ]}
            onPress={() => setHallType(type.id)}>
            <Text
              style={[
                styles.chipText,
                hallType === type.id && styles.chipTextActive,
              ]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CTA Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={fetchVenues}
        disabled={!budget}
        style={[styles.ctaWrap, !budget && {opacity: 0.5}]}>
        <LinearGradient
          colors={['#D97706', '#92400E']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.ctaBtn}>
          <Text style={styles.ctaBtnText}>Analyze & Find Venues ✨</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  // ═══════════════════════════════════════════
  // PHASE: ANALYZING
  // ═══════════════════════════════════════════
  const renderAnalyzingPhase = () => (
    <View style={styles.analyzingContainer}>
      <View style={styles.analyzingCard}>
        <View style={styles.analyzingIconWrap}>
          <Animated.View
            style={{
              transform: [
                {
                  scale: dotAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.2],
                  }),
                },
              ],
            }}>
            <IonIcon name="sparkles" size={40} color="#D97706" />
          </Animated.View>
        </View>
        <Text style={styles.analyzingTitle}>AI Venue Planner</Text>
        <Text style={styles.analyzingText}>{analyzingText}</Text>
        <View style={styles.analyzingDots}>
          <Animated.View
            style={[
              styles.dot,
              {opacity: dotAnim.interpolate({inputRange: [0, 1], outputRange: [0.3, 1]})},
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              {opacity: dotAnim.interpolate({inputRange: [0, 1], outputRange: [0.6, 0.3]})},
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              {opacity: dotAnim.interpolate({inputRange: [0, 1], outputRange: [1, 0.6]})},
            ]}
          />
        </View>
      </View>
    </View>
  );

  // ═══════════════════════════════════════════
  // PHASE: REPORT
  // ═══════════════════════════════════════════
  const renderReportPhase = () => {
    const stats = getReportStats();
    const health = getBudgetHealth(stats.budgetNum, stats.avgPrice);

    if (results.length === 0) {
      return renderNoResultsReport(stats);
    }

    const budgetProgress =
      stats.budgetNum > 0
        ? Math.min(stats.avgPrice / stats.budgetNum, 1.5) / 1.5
        : 0;
    const increaseAmount = Math.round(stats.budgetNum * 0.25);

    return (
      <Animated.View style={[styles.reportContainer, {opacity: fadeAnim}]}>
        {/* AI Summary Card — the hero */}
        {results.length > 0 && (
          <View style={styles.aiSummaryCard}>
            <LinearGradient
              colors={['#92400E', '#D97706']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.aiSummaryGradient}>
              <Text style={styles.aiSummaryEmoji}>🤖</Text>
              <Text style={styles.aiSummaryTitle}>AI Recommendation</Text>
              <Text style={styles.aiSummaryInputs}>
                Budget: {formatAmount(parseInt(budget))}  •  {guestCount ? `Guests: ${guestCount}  •  ` : ''}{location || 'All Areas'}
              </Text>
              <Text style={styles.aiSummaryAnalyzed}>
                We analyzed {totalVenues} venues.
              </Text>
              <View style={styles.aiSummaryDivider} />
              <Text style={styles.aiSummaryBest}>
                🏆 Best Match: {results[0]?.functionHallName}
              </Text>
              <Text style={styles.aiSummaryMatch}>
                {results[0]?.matchScore}% Match
              </Text>
              {results[0]?.rentPricePerDay > 0 && (
                <Text style={styles.aiSummaryCost}>
                  Estimated Cost: {formatAmount(results[0].rentPricePerDay)}
                  {parseInt(budget) > results[0].rentPricePerDay
                    ? `  •  💰 You save: ${formatAmount(parseInt(budget) - results[0].rentPricePerDay)}`
                    : ''}
                </Text>
              )}
              <View style={styles.aiSummaryReasons}>
                {results[0]?.rentPricePerDay <= parseInt(budget) && (
                  <Text style={styles.aiSummaryReason}>✔ Within budget</Text>
                )}
                {parseCapacity(results[0]?.seatingCapacity) >= (parseInt(guestCount) || 0) && parseInt(guestCount) > 0 && (
                  <Text style={styles.aiSummaryReason}>✔ Perfect capacity</Text>
                )}
                {location && results[0]?.functionHallAddress?.address?.toLowerCase().includes(location.toLowerCase()) && (
                  <Text style={styles.aiSummaryReason}>✔ In your area</Text>
                )}
                {results[0]?.ac && <Text style={styles.aiSummaryReason}>✔ AC Hall</Text>}
                {results[0]?.bedRooms > 0 && (
                  <Text style={styles.aiSummaryReason}>✔ {results[0].bedRooms} Rooms</Text>
                )}
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Report Header */}
        <View style={styles.reportHeader}>
          <Text style={styles.reportHeaderEmoji}>✨</Text>
          <Text style={styles.reportHeaderTitle}>AI Venue Planner</Text>
          <Text style={styles.reportHeaderSub}>
            We've analyzed {totalVenues} venues near {location || 'you'}
          </Text>
        </View>

        {/* Budget Match Section */}
        <View style={styles.reportSection}>
          <Text style={styles.reportSectionTitle}>🎯 Perfect Budget Match</Text>
          <View style={styles.reportDivider} />
          <View style={styles.reportRow}>
            <Text style={styles.reportLabel}>Your Budget</Text>
            <Text style={styles.reportValue}>{formatAmount(stats.budgetNum)}</Text>
          </View>
          <View style={styles.reportRow}>
            <Text style={styles.reportLabel}>Estimated Hall Cost</Text>
            <Text style={styles.reportValue}>{formatAmount(stats.avgPrice)}</Text>
          </View>
          <View style={styles.reportRow}>
            <Text style={styles.reportLabel}>You Save</Text>
            <Text
              style={[
                styles.reportValue,
                {color: stats.remaining >= 0 ? '#059669' : '#DC2626'},
              ]}>
              {stats.remaining >= 0
                ? formatAmount(stats.remaining)
                : `- ${formatAmount(Math.abs(stats.remaining))}`}
            </Text>
          </View>
          {/* Progress bar */}
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${Math.min(budgetProgress * 100, 100)}%`,
                  backgroundColor: stats.remaining >= 0 ? '#059669' : '#DC2626',
                },
              ]}
            />
          </View>
        </View>

        {/* Planning Summary */}
        <View style={styles.reportSection}>
          <Text style={styles.reportSectionTitle}>📊 Planning Summary</Text>
          <View style={styles.reportDivider} />
          <View style={styles.summaryRow}>
            <IonIcon name="checkmark-circle" size={16} color="#059669" />
            <Text style={styles.summaryText}>
              {stats.count} matching halls found
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <IonIcon name="checkmark-circle" size={16} color="#059669" />
            <Text style={styles.summaryText}>
              Best price: {formatAmount(stats.lowestPrice)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <IonIcon name="checkmark-circle" size={16} color="#059669" />
            <Text style={styles.summaryText}>
              Average price: {formatAmount(stats.avgPrice)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <IonIcon name="checkmark-circle" size={16} color="#059669" />
            <Text style={styles.summaryText}>
              Highest rated: {stats.highestMatch}% match
            </Text>
          </View>
        </View>

        {/* Budget Health */}
        <View style={styles.reportSection}>
          <View style={styles.healthRow}>
            <Text style={styles.reportSectionTitle}>
              {health.color === '#059669' ? '🟢' : health.color === '#D97706' ? '🟡' : '🔴'}{' '}
              Budget Health: {health.label}
            </Text>
          </View>
          <View style={styles.reportDivider} />
          <Text style={styles.healthDesc}>{health.desc}</Text>
        </View>

        {/* AI Insights */}
        <View style={styles.reportSection}>
          <Text style={styles.reportSectionTitle}>✨ AI Insights</Text>
          <View style={styles.reportDivider} />
          <Text style={styles.insightText}>
            💡 If you stretch your budget by just ₹10,000 - ₹15,000, you can unlock halls with better parking, larger capacity, and premium amenities.
          </Text>
          {results.filter(v => v.rentPricePerDay > stats.budgetNum && v.rentPricePerDay <= stats.budgetNum + 15000).length > 0 && (
            <View style={{marginTop: 10, backgroundColor: '#FEF8EB', borderRadius: 10, padding: 12}}>
              <Text style={{fontFamily: 'ManropeRegular', fontWeight: '700', fontSize: 13, color: '#92400E', marginBottom: 4}}>
                🔥 Just above your budget:
              </Text>
              <Text style={{fontFamily: 'ManropeRegular', fontSize: 12, color: '#1A1E25'}}>
                {results.filter(v => v.rentPricePerDay > stats.budgetNum && v.rentPricePerDay <= stats.budgetNum + 15000).length} hall(s) available within ₹10K-15K more — with better reviews & amenities
              </Text>
            </View>
          )}
        </View>

        {/* View Recommendations Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            setPhase('recommendations');
            fadeAnim.setValue(1);
          }}
          style={styles.ctaWrap}>
          <LinearGradient
            colors={['#D97706', '#92400E']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.ctaBtn}>
            <Text style={styles.ctaBtnText}>View AI Recommendations →</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderNoResultsReport = stats => {
    const expandBudget = Math.round((parseInt(budget) || 100000) * 1.3);
    const reduceGuests = Math.max(50, Math.round((parseInt(guestCount) || 200) * 0.6));

    return (
      <Animated.View style={[styles.reportContainer, {opacity: fadeAnim}]}>
        <View style={styles.reportHeader}>
          <Text style={styles.reportHeaderEmoji}>😔</Text>
          <Text style={styles.reportHeaderTitle}>No Halls Found</Text>
          <Text style={styles.reportHeaderSub}>
            No halls found matching your criteria.
          </Text>
        </View>

        <View style={styles.reportSection}>
          <Text style={styles.reportSectionTitle}>💡 AI Suggestions</Text>
          <View style={styles.reportDivider} />
          <View style={styles.suggestionAiRow}>
            <Text style={styles.suggestionAiIcon}>📍</Text>
            <Text style={styles.suggestionAiText}>
              Expand area — more halls in nearby locations
            </Text>
          </View>
          <View style={styles.suggestionAiRow}>
            <Text style={styles.suggestionAiIcon}>💰</Text>
            <Text style={styles.suggestionAiText}>
              Increase budget to {formatAmount(expandBudget)} for more options
            </Text>
          </View>
          {guestCount ? (
            <View style={styles.suggestionAiRow}>
              <Text style={styles.suggestionAiIcon}>👥</Text>
              <Text style={styles.suggestionAiText}>
                Reduce guests to {reduceGuests} for smaller, budget-friendly venues
              </Text>
            </View>
          ) : null}
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleRetryRelaxed}
          style={styles.ctaWrap}>
          <LinearGradient
            colors={['#D97706', '#92400E']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.ctaBtn}>
            <Text style={styles.ctaBtnText}>Show Alternatives</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // ═══════════════════════════════════════════
  // PHASE: RECOMMENDATIONS
  // ═══════════════════════════════════════════
  const renderRecommendationsPhase = () => {
    const stats = getReportStats();
    const topPicks = results.slice(0, 10);
    const comparison = getSmartComparison();

    return (
      <Animated.View style={[styles.recsContainer, {opacity: fadeAnim}]}>
        {/* Header */}
        <View style={styles.recsHeader}>
          <Text style={styles.recsHeaderText}>
            🤖 AI Recommendations • Based on your profile
          </Text>
        </View>

        {/* Top 3 Cards with medals */}
        {topPicks.map((item, index) => renderRecommendationCard(item, index))}

        {/* AI Winner Comparison */}
        {comparison && (
          <View style={styles.comparisonCard}>
            <Text style={styles.comparisonTitle}>AI Winner 🏆</Text>
            <View style={styles.comparisonGrid}>
              <View style={styles.comparisonItem}>
                <Text style={styles.comparisonLabel}>💰 Cheapest</Text>
                <Text style={styles.comparisonValue} numberOfLines={1}>
                  {comparison.cheapest?.functionHallName}
                </Text>
              </View>
              <View style={styles.comparisonItem}>
                <Text style={styles.comparisonLabel}>👥 Largest</Text>
                <Text style={styles.comparisonValue} numberOfLines={1}>
                  {comparison.largest?.functionHallName}
                </Text>
              </View>
              <View style={styles.comparisonItem}>
                <Text style={styles.comparisonLabel}>⭐ Best Amenities</Text>
                <Text style={styles.comparisonValue} numberOfLines={1}>
                  {comparison.bestAmenities?.functionHallName}
                </Text>
              </View>
              <View style={[styles.comparisonItem, styles.comparisonHighlight]}>
                <Text style={styles.comparisonLabel}>🏆 Recommended</Text>
                <Text
                  style={[styles.comparisonValue, {color: '#D97706'}]}
                  numberOfLines={1}>
                  {comparison.recommended?.functionHallName}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* AI Confidence */}
        {results.length > 0 && (
          <View style={styles.confidenceCard}>
            <Text style={styles.confidenceTitle}>AI Confidence Statement</Text>
            <Text style={styles.confidenceText}>
              Based on budget, guests, location — {results[0].functionHallName} is
              our best pick. Match: {results[0].matchScore}%.{' '}
              {results[0].rentPricePerDay > 0 &&
              parseInt(budget) > results[0].rentPricePerDay
                ? `Savings: ${formatAmount(parseInt(budget) - results[0].rentPricePerDay)}.`
                : ''}{' '}
              Confidence: ⭐⭐⭐⭐⭐
            </Text>
          </View>
        )}

        {/* Not satisfied */}
        <TouchableOpacity
          style={styles.notSatisfiedBtn}
          onPress={handleRetryRelaxed}
          activeOpacity={0.7}>
          <Text style={styles.notSatisfiedText}>
            Not satisfied? Tap here to search with relaxed criteria
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const getSmartComparison = () => {
    if (results.length < 3) return null;
    const cheapest = [...results].sort(
      (a, b) => (a.rentPricePerDay || 0) - (b.rentPricePerDay || 0),
    )[0];
    const largest = [...results].sort(
      (a, b) => (b.seatingCapacity || 0) - (a.seatingCapacity || 0),
    )[0];
    const bestAmenities = [...results].sort((a, b) => {
      const scoreA =
        (a.ac ? 1 : 0) + (a.bedRooms || 0) + (a.menuImages?.length || 0);
      const scoreB =
        (b.ac ? 1 : 0) + (b.bedRooms || 0) + (b.menuImages?.length || 0);
      return scoreB - scoreA;
    })[0];
    const recommended = results[0];
    return {cheapest, largest, bestAmenities, recommended};
  };

  const getMedalInfo = index => {
    if (index === 0)
      return {medal: '🥇', title: 'AI Top Pick', color: '#D97706'};
    if (index === 1)
      return {medal: '🥈', title: 'Luxury Upgrade', color: '#6D28D9'};
    if (index === 2)
      return {medal: '🥉', title: 'Best Value', color: '#059669'};
    return null;
  };

  const renderRecommendationCard = (item, index) => {
    const medalInfo = getMedalInfo(index);
    const budgetNum = parseInt(budget) || 0;
    const price = item?.rentPricePerDay || 0;
    const budgetDiff = budgetNum - price;
    const reasons = getVenueReasons(item);
    const imgUrl = item?.professionalImage?.url;

    return (
      <View key={item._id} style={styles.recCard}>
        {/* Medal Header */}
        {medalInfo && (
          <View
            style={[styles.medalHeader, {backgroundColor: `${medalInfo.color}10`}]}>
            <Text style={styles.medalText}>
              {medalInfo.medal} {medalInfo.title} • {item.matchScore}% Match
            </Text>
            {index === 1 && price > budgetNum && (
              <Text style={styles.medalSubtext}>
                Only {formatAmount(price - budgetNum)} above - better amenities
              </Text>
            )}
            {index === 2 && budgetDiff > 0 && (
              <Text style={styles.medalSubtext}>
                Save {formatAmount(budgetDiff)}
              </Text>
            )}
          </View>
        )}

        {/* Image with match badge */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            navigation.navigate('ViewEvents', {categoryId: item._id})
          }>
          <View style={styles.cardImageWrap}>
            <FastImage
              source={{uri: imgUrl, priority: FastImage.priority.normal}}
              style={styles.cardImage}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View style={styles.matchBadge}>
              <Text style={styles.matchBadgeText}>{item.matchScore}%</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Card Body */}
        <View style={styles.recCardBody}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.functionHallName}
            </Text>
            {renderStars(item.matchScore)}
          </View>

          <Text style={styles.cardPrice}>
            {price > 0 ? `${formatAmount(price)}/day` : 'Menu Based'}
          </Text>

          {/* Quick Info */}
          <View style={styles.quickInfoRow}>
            <View style={styles.quickInfoItem}>
              <IonIcon name="location-sharp" size={12} color="#D97706" />
              <Text style={styles.quickInfoText} numberOfLines={1}>
                {item?.functionHallAddress?.address?.split(',')[0] || 'N/A'}
              </Text>
            </View>
            {item.seatingCapacity > 0 && (
              <View style={styles.quickInfoItem}>
                <IonIcon name="people" size={12} color="#D97706" />
                <Text style={styles.quickInfoText}>{item.seatingCapacity}</Text>
              </View>
            )}
            {item.ac && (
              <View style={styles.quickInfoItem}>
                <IonIcon name="snow" size={12} color="#D97706" />
                <Text style={styles.quickInfoText}>AC</Text>
              </View>
            )}
          </View>

          {/* Why AI recommends */}
          {reasons.length > 0 && (
            <View style={styles.reasonsSection}>
              <Text style={styles.reasonsTitle}>Why AI recommends:</Text>
              {reasons.slice(0, 4).map((reason, i) => (
                <View key={i} style={styles.reasonItem}>
                  <IonIcon name="checkmark-circle" size={13} color="#059669" />
                  <Text style={styles.reasonText}>{reason}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Budget diff */}
          {price > 0 && budgetDiff > 0 && (
            <View style={styles.savingsTag}>
              <Text style={styles.savingsText}>
                💰 {formatAmount(budgetDiff)} under budget
              </Text>
            </View>
          )}
          {price > 0 && budgetDiff < 0 && Math.abs(budgetDiff) <= budgetNum * 0.2 && (
            <View style={[styles.savingsTag, {backgroundColor: '#FEF3E2'}]}>
              <Text style={[styles.savingsText, {color: '#D97706'}]}>
                Only {formatAmount(Math.abs(budgetDiff))} above — better amenities
              </Text>
            </View>
          )}

          {/* View Details Button */}
          <TouchableOpacity
            style={styles.viewDetailsBtn}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('ViewEvents', {categoryId: item._id})
            }>
            <Text style={styles.viewDetailsBtnText}>View Details</Text>
            <IonIcon name="arrow-forward" size={14} color="#D97706" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // ═══════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (phase === 'recommendations') {
              setPhase('report');
            } else if (phase === 'report') {
              setPhase('input');
            } else {
              navigation.goBack();
            }
          }}
          style={styles.backBtn}>
          <IonIcon name="chevron-back" size={22} color="#1A1E25" />
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <Text style={styles.headerTitle}>✨ AI Venue Planner</Text>
        </View>
        <View style={styles.aiBadge}>
          <IonIcon name="sparkles" size={12} color="#D97706" />
          <Text style={styles.aiBadgeText}>AI</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        {phase === 'input' && renderInputPhase()}
        {phase === 'analyzing' && renderAnalyzingPhase()}
        {phase === 'report' && renderReportPhase()}
        {phase === 'recommendations' && renderRecommendationsPhase()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8F9FA'},
  scrollContent: {paddingBottom: 50},

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 18,
    color: '#1A1E25',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3E2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  aiBadgeText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 11,
    color: '#D97706',
  },

  // Input Phase
  inputCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  inputSectionTitle: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 16,
    color: '#1A1E25',
    marginBottom: 18,
  },
  inputLabel: {
    fontFamily: 'ManropeRegular',
    fontWeight: '600',
    fontSize: 13,
    color: '#1A1E25',
    marginBottom: 8,
  },
  budgetInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1,
    borderColor: '#EDEEF0',
  },
  currencySymbol: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 20,
    color: '#D97706',
    marginRight: 8,
  },
  budgetInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'ManropeRegular',
    fontWeight: '600',
    color: '#1A1E25',
  },
  locationInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: '#EDEEF0',
  },
  locationInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'ManropeRegular',
    color: '#1A1E25',
    marginLeft: 8,
  },

  suggestionsBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#EDEEF0',
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  suggestionText: {
    fontFamily: 'ManropeRegular',
    fontSize: 13,
    color: '#1A1E25',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#FEF3E2',
    borderWidth: 1,
    borderColor: '#FEF3E2',
  },
  chipActive: {
    backgroundColor: '#D97706',
    borderColor: '#D97706',
  },
  chipText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '600',
    fontSize: 12,
    color: '#92400E',
  },
  chipTextActive: {
    color: '#fff',
  },
  ctaWrap: {
    marginTop: 22,
    borderRadius: 14,
    overflow: 'hidden',
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
  },
  ctaBtnText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 16,
    color: '#fff',
  },

  // Analyzing Phase
  analyzingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  analyzingCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 40,
    marginHorizontal: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  analyzingIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  analyzingTitle: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 18,
    color: '#1A1E25',
    marginBottom: 12,
  },
  analyzingText: {
    fontFamily: 'ManropeRegular',
    fontSize: 14,
    color: '#7E8389',
    textAlign: 'center',
    lineHeight: 20,
  },
  analyzingDots: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D97706',
  },

  // Report Phase
  reportContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  // AI Summary Card
  aiSummaryCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
  },
  aiSummaryGradient: {
    padding: 20,
    borderRadius: 16,
  },
  aiSummaryEmoji: {fontSize: 28, marginBottom: 6},
  aiSummaryTitle: {fontFamily: 'ManropeRegular', fontWeight: '700', fontSize: 18, color: '#fff', marginBottom: 6},
  aiSummaryInputs: {fontFamily: 'ManropeRegular', fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 4},
  aiSummaryAnalyzed: {fontFamily: 'ManropeRegular', fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 10},
  aiSummaryDivider: {height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginBottom: 10},
  aiSummaryBest: {fontFamily: 'ManropeRegular', fontWeight: '700', fontSize: 15, color: '#FBBF24', marginBottom: 4},
  aiSummaryMatch: {fontFamily: 'ManropeRegular', fontWeight: '700', fontSize: 13, color: '#fff', marginBottom: 4},
  aiSummaryCost: {fontFamily: 'ManropeRegular', fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 10},
  aiSummaryReasons: {gap: 3},
  aiSummaryReason: {fontFamily: 'ManropeRegular', fontSize: 12, fontWeight: '500', color: 'rgba(255,255,255,0.9)'},
  reportHeader: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  reportHeaderEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  reportHeaderTitle: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 20,
    color: '#1A1E25',
    marginBottom: 6,
  },
  reportHeaderSub: {
    fontFamily: 'ManropeRegular',
    fontSize: 13,
    color: '#7E8389',
    textAlign: 'center',
  },
  reportSection: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  reportSectionTitle: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 15,
    color: '#1A1E25',
    marginBottom: 8,
  },
  reportDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 12,
  },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reportLabel: {
    fontFamily: 'ManropeRegular',
    fontSize: 13,
    color: '#7E8389',
  },
  reportValue: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 14,
    color: '#1A1E25',
  },

  progressBarBg: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    backgroundColor: '#D97706',
    borderRadius: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  summaryText: {
    fontFamily: 'ManropeRegular',
    fontSize: 13,
    color: '#1A1E25',
  },
  healthRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthDesc: {
    fontFamily: 'ManropeRegular',
    fontSize: 13,
    color: '#7E8389',
    lineHeight: 19,
  },
  insightText: {
    fontFamily: 'ManropeRegular',
    fontSize: 13,
    color: '#7E8389',
    lineHeight: 19,
  },
  suggestionAiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  suggestionAiIcon: {
    fontSize: 16,
  },
  suggestionAiText: {
    fontFamily: 'ManropeRegular',
    fontSize: 13,
    color: '#1A1E25',
    flex: 1,
  },

  // Recommendations Phase
  recsContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  recsHeader: {
    backgroundColor: '#FEF3E2',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  recsHeaderText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 14,
    color: '#92400E',
    textAlign: 'center',
  },
  recCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  medalHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  medalText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 13,
    color: '#1A1E25',
  },
  medalSubtext: {
    fontFamily: 'ManropeRegular',
    fontSize: 11,
    color: '#7E8389',
    marginTop: 2,
  },
  cardImageWrap: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  matchBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#D97706',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
  },
  matchBadgeText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 13,
    color: '#fff',
  },

  recCardBody: {
    padding: 16,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 16,
    color: '#1A1E25',
    flex: 1,
    marginRight: 8,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  cardPrice: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 15,
    color: '#D97706',
    marginBottom: 10,
  },
  quickInfoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  quickInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quickInfoText: {
    fontFamily: 'ManropeRegular',
    fontSize: 12,
    color: '#7E8389',
  },
  reasonsSection: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  reasonsTitle: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 12,
    color: '#1A1E25',
    marginBottom: 6,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  reasonText: {
    fontFamily: 'ManropeRegular',
    fontSize: 12,
    color: '#1A1E25',
  },

  savingsTag: {
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  savingsText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '600',
    fontSize: 12,
    color: '#059669',
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#D97706',
    borderRadius: 10,
    paddingVertical: 10,
  },
  viewDetailsBtnText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 13,
    color: '#D97706',
  },

  // Comparison Card
  comparisonCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  comparisonTitle: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 15,
    color: '#1A1E25',
    marginBottom: 14,
  },
  comparisonGrid: {
    gap: 10,
  },
  comparisonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  comparisonHighlight: {
    backgroundColor: '#FEF3E2',
    borderWidth: 1,
    borderColor: '#D97706',
  },
  comparisonLabel: {
    fontFamily: 'ManropeRegular',
    fontWeight: '600',
    fontSize: 12,
    color: '#7E8389',
  },
  comparisonValue: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 13,
    color: '#1A1E25',
    maxWidth: SCREEN_WIDTH * 0.45,
  },

  // Confidence Card
  confidenceCard: {
    backgroundColor: '#FEF3E2',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D97706',
  },
  confidenceTitle: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 14,
    color: '#92400E',
    marginBottom: 8,
  },
  confidenceText: {
    fontFamily: 'ManropeRegular',
    fontSize: 13,
    color: '#1A1E25',
    lineHeight: 19,
  },

  // Not Satisfied
  notSatisfiedBtn: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 20,
  },
  notSatisfiedText: {
    fontFamily: 'ManropeRegular',
    fontSize: 13,
    color: '#D97706',
    textDecorationLine: 'underline',
  },
});

export default BudgetPlanner;
