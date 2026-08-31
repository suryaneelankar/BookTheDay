// In-memory public venue cards only. Never store auth tokens, profiles or bookings.
export const HOME_FEED_TTL = 5 * 60 * 1000;
let cache = { latest: [], discovery: [], latestAt: 0, discoveryAt: 0,
  nearby: [], nearbyKey: '', nearbyAt: 0 };
export const readHomeVenueCache = () => cache;
export const updateHomeVenueCache = patch => { cache = { ...cache, ...patch }; };
export const isHomeFeedFresh = timestamp => timestamp > 0 && Date.now() - timestamp < HOME_FEED_TTL;
export const venueLocationKey = (latitude, longitude) => {
  if (latitude == null || longitude == null || String(latitude).trim() === '' ||
      String(longitude).trim() === '') return '';
  const lat = Number(latitude), lng = Number(longitude);
  return Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180
    ? `${lat},${lng}` : '';
};
