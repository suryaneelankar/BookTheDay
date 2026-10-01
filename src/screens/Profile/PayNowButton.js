import React, {useState} from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import {moderateScale} from '../../utils/scalingMetrics';

const PayNowButton = ({
  onPress,
  text,
  disabled = false,
  gradientColors,
  textColor,
  borderColor,
}) => {
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    if (
      disabled ||
      loading ||
      typeof onPress !== 'function'
    ) {
      return;
    }

    setLoading(true);

    try {
      await onPress();
    } catch (error) {
      console.error(
        'Pay Now action failed:',
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  const buttonDisabled = disabled || loading;

  const hasCustomStatusColors =
    Array.isArray(gradientColors) &&
    gradientColors.length >= 2;

  /*
   * Custom colours are used for completed,
   * cancelled, rejected, expired and pending statuses.
   *
   * Pay ₹999 receives no custom colours, so it keeps
   * the original BookTheDay gold gradient.
   */
  const resolvedGradientColors =
    hasCustomStatusColors
      ? gradientColors
      : buttonDisabled
        ? ['#D9D2C7', '#C8C0B5']
        : ['#A87205', '#CE951A', '#E4B946'];

  const resolvedLocations =
    resolvedGradientColors.length === 3
      ? [0, 0.55, 1]
      : [0, 1];

  const resolvedTextColor =
    textColor ??
    (buttonDisabled ? '#746D65' : '#FFFFFF');

  const resolvedBorderColor =
    borderColor ??
    (buttonDisabled ? '#C8C0B5' : '#D7AA37');

  return (
    <TouchableOpacity
      activeOpacity={buttonDisabled ? 1 : 0.8}
      onPress={handlePress}
      disabled={buttonDisabled}
      style={styles.container}
      accessibilityRole="button"
      accessibilityLabel={text}
      accessibilityState={{
        disabled: buttonDisabled,
        busy: loading,
      }}>
      <LinearGradient
        colors={resolvedGradientColors}
        locations={resolvedLocations}
        start={{
          x: 0,
          y: 0.5,
        }}
        end={{
          x: 1,
          y: 0.5,
        }}
        style={[
          styles.gradientButton,
          {
            borderColor: resolvedBorderColor,
          },
        ]}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={resolvedTextColor}
          />
        ) : (
          <Text
            numberOfLines={1}
            style={[
              styles.buttonText,
              {
                color: resolvedTextColor,
              },
            ]}>
            {text}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default PayNowButton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 0,
    minHeight: 36,
  },

  gradientButton: {
    flex: 1,
    width: '100%',
    minHeight: 36,
    paddingHorizontal: moderateScale(8),

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderRadius: moderateScale(20),
  },

  buttonText: {
    fontSize: moderateScale(10.5),
    fontWeight: '800',
    fontFamily: 'ManropeRegular',
    textAlign: 'center',
  },
});