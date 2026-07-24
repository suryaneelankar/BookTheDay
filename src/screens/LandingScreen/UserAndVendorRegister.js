import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import BASE_URL from '../../apiconfig';
import axios from 'axios';
import {
  getCurrentLoggedInVendorMobileNum,
  getCurrentLoggedInUserMobileNum,
  getLoginUserId,
  checkIsTokenStored,
} from '../../../redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import {
  storeUserAuthToken,
  getVendorAuthToken,
  getUserAuthToken,
  storeVendorAuthToken,
  storeVendorMobileNumber,
  storeUserMobileNumber,
} from '../../utils/StoreAuthToken';
import IonIcon from 'react-native-vector-icons/Ionicons';
import CustomAlert from '../../components/CustomAlert';

const UserAndVendorRegister = ({route}) => {
  const {type} = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const deviceFCMToken = useSelector(state => state.deviceFCMToken);

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible(!isPasswordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

  const handlePasswordChange = text => {
    setPassword(text);
    if (confirmPassword && text !== confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = text => {
    setConfirmPassword(text);
    if (password !== text) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  const storeUserDeviceToken = async () => {
    const payload = {
      mobileNumber: String(phoneNumber),
      fcmToken: deviceFCMToken,
    };
    const token = await getUserAuthToken();
    try {
      await axios.post(`${BASE_URL}/addUserFCMToken`, payload, {
        headers: {Authorization: `Bearer ${token}`},
      });
    } catch (error) {
      console.error('Error during add user token:', error);
    }
  };

  const storeVendorDeviceToken = async () => {
    const payload = {
      mobileNumber: String(phoneNumber),
      fcmToken: deviceFCMToken,
    };
    const token = await getVendorAuthToken();
    try {
      await axios.post(`${BASE_URL}/addVendorFCMToken`, payload, {
        headers: {Authorization: `Bearer ${token}`},
      });
    } catch (error) {
      console.error('Error during add vendor token:', error);
    }
  };

  const getCheckUserValidation = async () => {
    if (!fullName || !phoneNumber || !password || !confirmPassword) {
      CustomAlert.alert(
        'Missing Fields',
        'Please fill all required fields',
        undefined,
        {type: 'warning'},
      );
      return;
    }

    if (password !== confirmPassword) {
      CustomAlert.alert(
        'Password Mismatch',
        'Passwords do not match. Please check and try again.',
        undefined,
        {type: 'warning'},
      );
      return;
    }

    setLoading(true);
    const payload = {
      mobileNumber: String(phoneNumber),
      password: String(password),
      fullName: fullName,
      role: type,
    };

    try {
      const RegisterRes = await axios.post(
        `${BASE_URL}/${type}/register`,
        payload,
      );
      if (RegisterRes?.data?.message) {
        // Auto-login after registration
        const loginPayload = {
          mobileNumber: String(phoneNumber),
          password: String(password),
        };
        try {
          const logineRes = await axios.post(
            `${BASE_URL}/${type}/login`,
            loginPayload,
          );
          if (logineRes?.status === 200) {
            if (type === 'vendor') {
              storeVendorDeviceToken();
              dispatch(getLoginUserId(true));
              dispatch(getCurrentLoggedInVendorMobileNum(phoneNumber));
              storeVendorAuthToken(logineRes?.data?.token);
              storeVendorMobileNumber(phoneNumber);
              if (logineRes?.data?.token) {
                dispatch(checkIsTokenStored(true));
              }
            } else {
              storeUserDeviceToken();
              dispatch(getLoginUserId(false));
              dispatch(getCurrentLoggedInUserMobileNum(phoneNumber));
              storeUserAuthToken(logineRes?.data?.token);
              storeUserMobileNumber(phoneNumber);
              if (logineRes?.data?.token) {
                dispatch(checkIsTokenStored(true));
              }
            }
          }
        } catch (error) {
          console.error('Error during auto-login:', error);
        }
      }
    } catch (error) {
      console.error('Error during register:', error);
      CustomAlert.alert(
        'Registration Failed',
        error.response?.data?.message || 'Please try again',
        undefined,
        {type: 'error'},
      );
    } finally {
      setLoading(false);
    }
  };

  const isVendor = type === 'vendor';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Back button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}>
            <IonIcon name="chevron-back" size={20} color="#1A1E25" />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.headerArea}>
            <View style={styles.typeBadge}>
              <IonIcon
                name={isVendor ? 'storefront-outline' : 'person-outline'}
                size={14}
                color="#FD813B"
              />
              <Text style={styles.typeBadgeText}>
                {isVendor ? 'Vendor' : 'Customer'}
              </Text>
            </View>

            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              {isVendor
                ? 'Register to list your venues and start receiving bookings.'
                : 'Sign up to discover and book venues for your celebrations.'}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formArea}>
            {/* Full Name */}
            <Text style={styles.fieldLabel}>
              Full Name<Text style={styles.requiredStar}> *</Text>
            </Text>
            <View style={styles.inputRow}>
              <IonIcon
                name="person-outline"
                size={18}
                color="#A0A5AB"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your full name"
                placeholderTextColor="#A0A5AB"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            {/* Phone Number */}
            <Text style={styles.fieldLabel}>
              Phone Number<Text style={styles.requiredStar}> *</Text>
            </Text>
            <View style={styles.phoneRow}>
              <View style={styles.countryCodeBox}>
                <Text style={styles.countryCodeText}>+91</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="Enter mobile number"
                placeholderTextColor="#A0A5AB"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            {/* Password */}
            <Text style={styles.fieldLabel}>
              Password<Text style={styles.requiredStar}> *</Text>
            </Text>
            <View style={styles.passwordRow}>
              <IonIcon
                name="lock-closed-outline"
                size={18}
                color="#A0A5AB"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Create a password"
                placeholderTextColor="#A0A5AB"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <IonIcon
                  name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#7E8389"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <Text style={styles.fieldLabel}>
              Confirm Password<Text style={styles.requiredStar}> *</Text>
            </Text>
            <View
              style={[
                styles.passwordRow,
                passwordError ? styles.inputError : null,
              ]}>
              <IonIcon
                name="lock-closed-outline"
                size={18}
                color="#A0A5AB"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Re-enter password"
                placeholderTextColor="#A0A5AB"
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                secureTextEntry={!isConfirmPasswordVisible}
              />
              <TouchableOpacity
                onPress={toggleConfirmPasswordVisibility}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <IonIcon
                  name={
                    isConfirmPasswordVisible ? 'eye-outline' : 'eye-off-outline'
                  }
                  size={20}
                  color="#7E8389"
                />
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <View style={styles.errorRow}>
                <IonIcon name="alert-circle" size={14} color="#E8533C" />
                <Text style={styles.errorText}>{passwordError}</Text>
              </View>
            ) : null}

            {/* Register button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={getCheckUserValidation}
              disabled={loading}
              style={styles.registerBtnWrapper}>
              <LinearGradient
                colors={['#FD813B', '#E8533C']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.registerBtn}>
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.registerBtnText}>Create Account</Text>
                    <IonIcon name="checkmark-circle" size={18} color="#FFFFFF" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footerArea}>
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.loginLink}
              activeOpacity={0.7}>
              <Text style={styles.loginLinkText}>
                Already have an account?{' '}
              </Text>
              <Text style={styles.loginLinkAccent}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  // Back
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  // Header
  headerArea: {
    marginBottom: 28,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(253, 129, 59, 0.08)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  typeBadgeText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '600',
    fontSize: 12,
    color: '#FD813B',
    marginLeft: 5,
  },
  title: {
    fontFamily: 'ManropeRegular',
    fontWeight: '800',
    fontSize: 28,
    color: '#1A1E25',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'ManropeRegular',
    fontWeight: '500',
    fontSize: 14,
    color: '#7E8389',
    lineHeight: 20,
  },
  // Form
  formArea: {
    marginBottom: 28,
  },
  fieldLabel: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 13,
    color: '#1A1E25',
    marginBottom: 8,
    marginTop: 14,
  },
  requiredStar: {
    color: '#E8533C',
    fontSize: 13,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EDEEF0',
    height: 50,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'ManropeRegular',
    color: '#1A1E25',
    paddingVertical: 0,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EDEEF0',
    height: 50,
    overflow: 'hidden',
  },
  countryCodeBox: {
    paddingHorizontal: 14,
    height: '100%',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#EDEEF0',
  },
  countryCodeText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '600',
    fontSize: 14,
    color: '#1A1E25',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 14,
    fontFamily: 'ManropeRegular',
    color: '#1A1E25',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EDEEF0',
    height: 50,
    paddingHorizontal: 14,
  },
  inputError: {
    borderColor: '#E8533C',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  errorText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '500',
    fontSize: 12,
    color: '#E8533C',
    marginLeft: 4,
  },
  // Register button
  registerBtnWrapper: {
    marginTop: 28,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#FD813B',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  registerBtnText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 16,
    color: '#FFFFFF',
  },
  // Footer
  footerArea: {
    alignItems: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EDEEF0',
  },
  dividerText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '500',
    fontSize: 12,
    color: '#A0A5AB',
    marginHorizontal: 12,
  },
  loginLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginLinkText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '500',
    fontSize: 14,
    color: '#7E8389',
  },
  loginLinkAccent: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 14,
    color: '#FD813B',
  },
});

export default UserAndVendorRegister;
