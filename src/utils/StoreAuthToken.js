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


   // store  the vendor mobile number securely
  export const storeVendorMobileNumber = async (number) => {
    try {
      await Keychain.setGenericPassword('vendorNumber', number, { service: 'vendorMobileNumber' });
    } catch (error) {
      console.error('Error storing the vendor number securely', error);
    }
  };

   // Retrieve the vendor mobile number securely
export const getVendorMobileNumber = async () => {
  try {
    const credentials = await Keychain.getGenericPassword({ service: 'vendorMobileNumber' });
    if (credentials && credentials.username === 'vendorNumber') {
      return credentials.password;
    }
    return null;
  } catch (error) {
    console.error('Error retrieving the vendor number securely', error);
    return null;
  }
};

// Remove the vendor mobile number securely
export const removeVendorMobileNumber = async () => {
  try {
    await Keychain.resetGenericPassword({ service: 'vendorMobileNumber' });
  } catch (error) {
    console.error('Error removing the vendor number securely', error);
  }
};

// Store the user's mobile number securely
export const storeUserMobileNumber = async (number) => {
  try {
    await Keychain.setGenericPassword('userNumber', number, { service: 'userMobileNumber' });
  } catch (error) {
    console.error('Error storing the user mobile number securely', error);
  }
};

// Retrieve the user's mobile number securely
export const getUserMobileNumber = async () => {
  try {
    const credentials = await Keychain.getGenericPassword({ service: 'userMobileNumber' });
    if (credentials && credentials.username === 'userNumber') {
      return credentials.password;
    }
    return null;
  } catch (error) {
    console.error('Error retrieving the user mobile number securely', error);
    return null;
  }
};

// Remove the user's mobile number securely
export const removeUserMobileNumber = async () => {
  try {
    await Keychain.resetGenericPassword({ service: 'userMobileNumber' });
  } catch (error) {
    console.error('Error removing the user mobile number securely', error);
  }
};