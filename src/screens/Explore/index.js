/**
 * ExploreScreen — Tab 2 of UserTabs
 *
 * Renders the full SearchVenues screen in "discover" mode so the user lands
 * on the Discover Venues feed (the same feed that lives in HomeVenueFeed with
 * mode="discover"). The top search bar, category tabs, filters and pagination
 * are all part of SearchVenues and work exactly as they do when launched from
 * Home.
 *
 * We pass a stable route-like object so SearchVenues picks up the right mode
 * without requiring a stack navigation push.
 */
import React, { useMemo } from 'react';
import SearchVenues from '../Search/SearchVenues';

// Stable object — never recreated, keeps SearchVenues from re-initialising
const EXPLORE_ROUTE = { params: { homeFeed: 'discover' } };

const ExploreScreen = ({ navigation }) => {
    return <SearchVenues route={EXPLORE_ROUTE} navigation={navigation} />;
};

export default ExploreScreen;
