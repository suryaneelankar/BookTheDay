import * as Keychain from 'react-native-keychain';

const SERVICES = {
  USER_TOKEN:
    'com.booktheday.auth.user',

  VENDOR_TOKEN:
    'com.booktheday.auth.vendor',

  USER_MOBILE:
    'com.booktheday.mobile.user',

  VENDOR_MOBILE:
    'com.booktheday.mobile.vendor',

  ACTIVE_ROLE:
    'com.booktheday.auth.active-role',
};

const validateValue = (
  value,
  fieldName,
) => {
  if (
    typeof value !== 'string' ||
    !value.trim()
  ) {
    throw new Error(
      `${fieldName} is required.`,
    );
  }

  return value.trim();
};

/* --------------------------------------------------
 * User token
 * -------------------------------------------------- */

export const storeUserAuthToken =
  async token => {
    const validToken =
      validateValue(
        token,
        'User token',
      );

    await Keychain.setGenericPassword(
      'userToken',
      validToken,
      {
        service:
          SERVICES.USER_TOKEN,
      },
    );

    return true;
  };

export const getUserAuthToken =
  async () => {
    try {
      const credentials =
        await Keychain.getGenericPassword({
          service:
            SERVICES.USER_TOKEN,
        });

      if (
        credentials &&
        credentials.username ===
          'userToken'
      ) {
        return credentials.password;
      }

      return null;
    } catch (error) {
      console.error(
        'Error retrieving user token:',
        error,
      );

      return null;
    }
  };

export const removeUserAuthToken =
  async () => {
    await Keychain.resetGenericPassword({
      service:
        SERVICES.USER_TOKEN,
    });
  };

/* --------------------------------------------------
 * Vendor token
 * -------------------------------------------------- */

export const storeVendorAuthToken =
  async token => {
    const validToken =
      validateValue(
        token,
        'Vendor token',
      );

    await Keychain.setGenericPassword(
      'vendorToken',
      validToken,
      {
        service:
          SERVICES.VENDOR_TOKEN,
      },
    );

    return true;
  };

export const getVendorAuthToken =
  async () => {
    try {
      const credentials =
        await Keychain.getGenericPassword({
          service:
            SERVICES.VENDOR_TOKEN,
        });

      if (
        credentials &&
        credentials.username ===
          'vendorToken'
      ) {
        return credentials.password;
      }

      return null;
    } catch (error) {
      console.error(
        'Error retrieving vendor token:',
        error,
      );

      return null;
    }
  };

export const removeVendorAuthToken =
  async () => {
    await Keychain.resetGenericPassword({
      service:
        SERVICES.VENDOR_TOKEN,
    });
  };

/* --------------------------------------------------
 * User mobile number
 * -------------------------------------------------- */

export const storeUserMobileNumber =
  async number => {
    const mobileNumber =
      validateValue(
        String(number || ''),
        'User mobile number',
      );

    await Keychain.setGenericPassword(
      'userNumber',
      mobileNumber,
      {
        service:
          SERVICES.USER_MOBILE,
      },
    );

    return true;
  };

export const getUserMobileNumber =
  async () => {
    try {
      const credentials =
        await Keychain.getGenericPassword({
          service:
            SERVICES.USER_MOBILE,
        });

      if (
        credentials &&
        credentials.username ===
          'userNumber'
      ) {
        return credentials.password;
      }

      return null;
    } catch (error) {
      console.error(
        'Error retrieving user mobile number:',
        error,
      );

      return null;
    }
  };

export const removeUserMobileNumber =
  async () => {
    await Keychain.resetGenericPassword({
      service:
        SERVICES.USER_MOBILE,
    });
  };

/* --------------------------------------------------
 * Vendor mobile number
 * -------------------------------------------------- */

export const storeVendorMobileNumber =
  async number => {
    const mobileNumber =
      validateValue(
        String(number || ''),
        'Vendor mobile number',
      );

    await Keychain.setGenericPassword(
      'vendorNumber',
      mobileNumber,
      {
        service:
          SERVICES.VENDOR_MOBILE,
      },
    );

    return true;
  };

export const getVendorMobileNumber =
  async () => {
    try {
      const credentials =
        await Keychain.getGenericPassword({
          service:
            SERVICES.VENDOR_MOBILE,
        });

      if (
        credentials &&
        credentials.username ===
          'vendorNumber'
      ) {
        return credentials.password;
      }

      return null;
    } catch (error) {
      console.error(
        'Error retrieving vendor mobile number:',
        error,
      );

      return null;
    }
  };

export const removeVendorMobileNumber =
  async () => {
    await Keychain.resetGenericPassword({
      service:
        SERVICES.VENDOR_MOBILE,
    });
  };

/* --------------------------------------------------
 * Active login role
 * -------------------------------------------------- */

export const storeActiveRole =
  async role => {
    if (
      role !== 'user' &&
      role !== 'vendor'
    ) {
      throw new Error(
        'Active role must be user or vendor.',
      );
    }

    await Keychain.setGenericPassword(
      'activeRole',
      role,
      {
        service:
          SERVICES.ACTIVE_ROLE,
      },
    );

    return true;
  };

export const getActiveRole =
  async () => {
    try {
      const credentials =
        await Keychain.getGenericPassword({
          service:
            SERVICES.ACTIVE_ROLE,
        });

      if (
        credentials &&
        credentials.username ===
          'activeRole' &&
        (
          credentials.password ===
            'user' ||
          credentials.password ===
            'vendor'
        )
      ) {
        return credentials.password;
      }

      return null;
    } catch (error) {
      console.error(
        'Error retrieving active role:',
        error,
      );

      return null;
    }
  };

export const removeActiveRole =
  async () => {
    await Keychain.resetGenericPassword({
      service:
        SERVICES.ACTIVE_ROLE,
    });
  };

/* --------------------------------------------------
 * Complete session removal
 * -------------------------------------------------- */

export const clearUserSession =
  async () => {
    await Promise.all([
      removeUserAuthToken(),
      removeUserMobileNumber(),
    ]);
  };

export const clearVendorSession =
  async () => {
    await Promise.all([
      removeVendorAuthToken(),
      removeVendorMobileNumber(),
    ]);
  };

export const clearAllAuthSessions =
  async () => {
    await Promise.all([
      removeUserAuthToken(),
      removeUserMobileNumber(),
      removeVendorAuthToken(),
      removeVendorMobileNumber(),
      removeActiveRole(),
    ]);
  };