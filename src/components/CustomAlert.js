import React, {createContext, useContext, useState, useCallback} from 'react';
import {Modal, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import IonIcon from 'react-native-vector-icons/Ionicons';

// ─── Context ──────────────────────────────────────────────────────────────────
const AlertContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AlertProvider = ({children}) => {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState({
    title: '',
    message: '',
    buttons: [],
    type: 'info', // 'success' | 'error' | 'info' | 'warning'
  });

  const showAlert = useCallback((title, message, buttons, options) => {
    const type = options?.type || 'info';
    setConfig({
      title: title || '',
      message: message || '',
      buttons: buttons || [{text: 'OK'}],
      type,
    });
    setVisible(true);
  }, []);

  const hideAlert = useCallback(() => {
    setVisible(false);
  }, []);

  const handleButtonPress = useCallback(
    button => {
      hideAlert();
      if (button?.onPress) {
        button.onPress();
      }
    },
    [hideAlert],
  );

  const iconConfig = {
    success: {name: 'checkmark-circle', color: '#22C55E'},
    error: {name: 'close-circle', color: '#D0433C'},
    warning: {name: 'warning', color: '#F59E0B'},
    info: {name: 'information-circle', color: '#3B82F6'},
  };

  return (
    <AlertContext.Provider value={{showAlert}}>
      {children}
      <Modal
        transparent={true}
        animationType="fade"
        visible={visible}
        onRequestClose={hideAlert}>
        <View style={styles.overlay}>
          <View style={styles.card}>
            {/* Icon */}
            <View
              style={[
                styles.iconCircle,
                {backgroundColor: `${iconConfig[config.type]?.color}15`},
              ]}>
              <IonIcon
                name={iconConfig[config.type]?.name}
                size={32}
                color={iconConfig[config.type]?.color}
              />
            </View>

            {/* Title */}
            {config.title ? (
              <Text style={styles.title}>{config.title}</Text>
            ) : null}

            {/* Message */}
            {config.message ? (
              <Text style={styles.message}>{config.message}</Text>
            ) : null}

            {/* Buttons */}
            <View style={styles.buttonsRow}>
              {config.buttons.map((button, index) => {
                const isDestructive = button.style === 'destructive';
                const isCancel = button.style === 'cancel';

                if (isCancel) {
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleButtonPress(button)}
                      style={styles.cancelButton}
                      activeOpacity={0.7}>
                      <Text style={styles.cancelButtonText}>
                        {button.text || 'Cancel'}
                      </Text>
                    </TouchableOpacity>
                  );
                }

                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleButtonPress(button)}
                    activeOpacity={0.8}
                    style={styles.gradientBtnWrap}>
                    <LinearGradient
                      colors={
                        isDestructive
                          ? ['#D2453B', '#A0153E']
                          : ['#FD813B', '#D2453B']
                      }
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                      style={styles.gradientBtn}>
                      <Text style={styles.gradientBtnText}>
                        {button.text || 'OK'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </AlertContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    // Fallback: if provider not wrapped, use native Alert
    const {Alert} = require('react-native');
    return {showAlert: Alert.alert};
  }
  return context;
};

// ─── Drop-in replacement for Alert.alert ──────────────────────────────────────
// Usage: CustomAlert.alert('Title', 'Message', [{text: 'OK'}], {type: 'success'})
let _showAlert = null;

export const setAlertRef = showAlert => {
  _showAlert = showAlert;
};

const CustomAlert = {
  alert: (title, message, buttons, options) => {
    if (_showAlert) {
      _showAlert(title, message, buttons, options);
    } else {
      // Fallback to native
      const {Alert} = require('react-native');
      Alert.alert(title, message, buttons);
    }
  },
};

export default CustomAlert;

// ─── Bridge Component (put inside AlertProvider to capture ref) ────────────────
export const AlertBridge = () => {
  const {showAlert} = useAlert();
  React.useEffect(() => {
    setAlertRef(showAlert);
  }, [showAlert]);
  return null;
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  card: {
    width: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 17,
    color: '#1A1E25',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontFamily: 'ManropeRegular',
    fontWeight: '400',
    fontSize: 14,
    color: '#7E8389',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(126, 131, 137, 0.3)',
  },
  cancelButtonText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '600',
    fontSize: 14,
    color: '#7E8389',
  },
  gradientBtnWrap: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  gradientBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientBtnText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
