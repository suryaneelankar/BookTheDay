import React, { useState } from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import LinearGradient from
  'react-native-linear-gradient';

import {
  moderateScale,
} from '../../utils/scalingMetrics';

const PayNowButton = ({
  onPress,
  text,
  disabled = false,
}) => {
  const [loading, setLoading] =
    useState(false);

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

  const buttonDisabled =
    disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={buttonDisabled}
      style={styles.container}
      accessibilityRole="button"
      accessibilityState={{
        disabled: buttonDisabled,
        busy: loading,
      }}
    >
      <LinearGradient
        colors={
          buttonDisabled
            ? [
                '#D9D2C7',
                '#C8C0B5',
              ]
            : [
                '#A87205',
                '#CE951A',
                '#E4B946',
              ]
        }
        locations={
          buttonDisabled
            ? [0, 1]
            : [0, 0.55, 1]
        }
        start={{
          x: 0,
          y: 0.5,
        }}
        end={{
          x: 1,
          y: 0.5,
        }}
        style={styles.gradientButton}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color="#FFFFFF"
          />
        ) : (
          <Text
            style={[
              styles.buttonText,

              buttonDisabled &&
                styles.disabledButtonText,
            ]}
          >
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
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D7AA37',
    borderRadius: moderateScale(20),
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(10.5),
    fontWeight: '800',
    fontFamily: 'ManropeRegular',
    textAlign: 'center',
  },
  disabledButtonText: {
    color: '#746D65',
  },
});