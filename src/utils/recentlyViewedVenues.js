import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@booktheday_recently_viewed_venues';
const MAX_RECENT_VENUES = 20;

const getImageUrl = venue => {
  const professionalImage =
    venue?.professionalImage?.url;

  if (professionalImage) {
    return professionalImage;
  }

  /*
   * Supports both:
   * additionalImages: [{ url }]
   *
   * and the older format:
   * additionalImages: [[{ url }]]
   */
  const additionalImages =
    venue?.additionalImages ?? [];

  for (const image of additionalImages) {
    if (image?.url) {
      return image.url;
    }

    if (Array.isArray(image) && image[0]?.url) {
      return image[0].url;
    }
  }

  return '';
};

const parseStoredVenues = value => {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch (error) {
    console.warn(
      'Invalid recently viewed venue data:',
      error,
    );

    return [];
  }
};

export const addRecentlyViewedVenue = async venue => {

  if (!venue?._id) {
    return;
  }


  try {
    const existingValue =
      await AsyncStorage.getItem(STORAGE_KEY);

    const existingVenues =
      parseStoredVenues(existingValue);

    const venueId = String(venue._id);

    /*
     * Store only what is required for a venue card.
     * Do not store the entire venue-details response.
     */
    const recentVenue = {
      _id: venueId,

      functionHallName:
        venue.functionHallName ?? '',

      venueCategory:
        venue.venueCategory ?? '',

      locality:
        venue.county ??
        venue.functionHallAddress?.city ??
        '',

      rentPricePerDay:
        Number(venue.rentPricePerDay) || 0,

      pricingType:
        venue.pricingType ?? 'fixed',

      menuAvailable:
        venue.menuAvailable === true,

      menuImages:
        Array.isArray(venue.menuImages)
          ? venue.menuImages
          : [],

      includedGuestCount:
        Number(venue.includedGuestCount) || null,

      seatingCapacity:
        venue.seatingCapacity ?? '',

      imageUrl:
        getImageUrl(venue),

      viewedAt:
        new Date().toISOString(),
    };

    /*
     * Remove an older occurrence of the same venue,
     * add it to the beginning, and keep only 20.
     */
    const updatedVenues = [
      recentVenue,

      ...existingVenues.filter(
        item =>
          String(item?._id) !== venueId,
      ),
    ].slice(0, MAX_RECENT_VENUES);

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedVenues),
    );
  } catch (error) {
    /*
     * Viewing the venue should continue even if
     * local storage fails.
     */
    console.warn(
      'Unable to save recently viewed venue:',
      error,
    );
  }
};

export const getRecentlyViewedVenues = async (
  limit = MAX_RECENT_VENUES,
) => {
  try {
    const value =
      await AsyncStorage.getItem(STORAGE_KEY);

    const venues =
      parseStoredVenues(value);

    return venues.slice(
      0,
      Math.min(
        Math.max(Number(limit) || 1, 1),
        MAX_RECENT_VENUES,
      ),
    );
  } catch (error) {
    console.warn(
      'Unable to load recently viewed venues:',
      error,
    );

    return [];
  }
};

export const removeRecentlyViewedVenue =
  async venueId => {
    if (!venueId) {
      return;
    }

    try {
      const venues =
        await getRecentlyViewedVenues();

      const updatedVenues =
        venues.filter(
          venue =>
            String(venue?._id) !==
            String(venueId),
        );

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedVenues),
      );
    } catch (error) {
      console.warn(
        'Unable to remove recently viewed venue:',
        error,
      );
    }
  };

export const clearRecentlyViewedVenues =
  async () => {
    try {
      await AsyncStorage.removeItem(
        STORAGE_KEY,
      );
    } catch (error) {
      console.warn(
        'Unable to clear recently viewed venues:',
        error,
      );
    }
  };