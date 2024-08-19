import * as Keychain from 'react-native-keychain';

// Store the token securely
export const storeUserAuthToken = async (token) => {
  try {
    await Keychain.setGenericPassword('userToken', token);
  } catch (error) {
    console.error('Error storing the token securely', error);
  }
};

// Retrieve the token securely
export const getUserAuthToken = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials && credentials.username === 'userToken') {
        return credentials.password;
      }
    return null;
  } catch (error) {
    console.error('Error retrieving the token securely', error);
    return null;
  }
};

// Remove the token securely
export const removeUserAuthToken = async () => {
  try {
    await Keychain.resetGenericPassword();
  } catch (error) {
    console.error('Error removing the token securely', error);
  }
};

export const storeVendorAuthToken = async (token) => {
    try {
      await Keychain.setGenericPassword('vendorToken', token);
    } catch (error) {
      console.error('Error storing the token securely', error);
    }
  };
  
  // Retrieve the token securely
  export const getVendorAuthToken = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials && credentials.username === 'vendorToken') {
        return credentials.password;
      }
      return null;
    } catch (error) {
      console.error('Error retrieving the token securely', error);
      return null;
    }
  };
  
  // Remove the token securely
  export const removeVendorAuthToken = async () => {
    try {
      await Keychain.resetGenericPassword();
    } catch (error) {
      console.error('Error removing the token securely', error);
    }
  };