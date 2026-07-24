import {useState, useRef, useCallback} from 'react';
import axios from 'axios';
import BASE_URL from '../apiconfig';
import {getUserAuthToken} from '../utils/StoreAuthToken';

/**
 * Shared hook for fetching paginated venue lists.
 * Used by Events, BanquetHalls, FarmHouse, LuxuryResorts screens.
 *
 * @param {string} venueCategory - 'Function Hall' | 'Banquet Hall' | 'Farm House' | 'Luxury Resort' | null (all)
 */
const useVenueList = (venueCategory = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  const isFetchingRef = useRef(false);
  const tokenRef = useRef(null);
  const lastFetchedRef = useRef(0);

  // Cache token to avoid repeated keychain reads
  const getToken = useCallback(async () => {
    if (!tokenRef.current) {
      tokenRef.current = await getUserAuthToken();
    }
    return tokenRef.current;
  }, []);

  // Invalidate token cache (call on logout or token refresh)
  const clearTokenCache = useCallback(() => {
    tokenRef.current = null;
  }, []);

  const fetchVenues = useCallback(
    async (page = 1, reset = false) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setLoading(true);

      const token = await getToken();
      const params = {page, limit: 10};
      if (venueCategory) {
        params.venueCategory = venueCategory;
      }

      try {
        const response = await axios.get(`${BASE_URL}/filterFunctionHalls`, {
          params,
          headers: {Authorization: `Bearer ${token}`},
        });

        const allData = Array.isArray(response?.data?.data)
          ? response.data.data
          : [];
        const newData = venueCategory
          ? allData.filter(item => item?.venueCategory === venueCategory)
          : allData;
        const total = response?.data?.totalPages ?? 0;

        setCurrentPage(page);
        setTotalPages(total);
        setHasMore(page < total);
        setData(prev => (reset || page === 1 ? newData : [...prev, ...newData]));
        lastFetchedRef.current = Date.now();
      } catch (error) {
        console.log(`useVenueList (${venueCategory}) error:`, error);
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
      }
    },
    [venueCategory, getToken],
  );

  const loadMore = useCallback(() => {
    if (!hasMore || isFetchingRef.current) return;
    fetchVenues(currentPage + 1);
  }, [hasMore, currentPage, fetchVenues]);

  const refresh = useCallback(() => {
    setData([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchVenues(1, true);
  }, [fetchVenues]);

  // Skip fetch if data was fetched less than `staleMs` ago
  const fetchIfStale = useCallback(
    (staleMs = 60000) => {
      const elapsed = Date.now() - lastFetchedRef.current;
      if (elapsed > staleMs || data.length === 0) {
        fetchVenues(1, true);
      }
    },
    [fetchVenues, data.length],
  );

  return {
    data,
    loading,
    hasMore,
    currentPage,
    totalPages,
    fetchVenues,
    loadMore,
    refresh,
    fetchIfStale,
    clearTokenCache,
  };
};

export default useVenueList;
