import React, {
  useCallback,
  useState,
} from 'react';

import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  useFocusEffect,
} from '@react-navigation/native';

import IonIcon from
  'react-native-vector-icons/Ionicons';

import { getRecentlyViewedVenues,clearRecentlyViewedVenues } from '../../utils/recentlyViewedVenues';

const RecentlyViewedVenues = ({
  navigation,
}) => {
  const [venues, setVenues] =
    useState([]);

  const loadVenues =
    useCallback(async () => {
      const storedVenues =
        await getRecentlyViewedVenues();

      setVenues(storedVenues);
    }, []);

  useFocusEffect(
    useCallback(() => {
      loadVenues();
    }, [loadVenues]),
  );

  const clearHistory = async () => {
    await clearRecentlyViewedVenues();
    setVenues([]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={() =>
        navigation.navigate(
          'ViewEvents',
          {
            categoryId: item._id,
          },
        )
      }
    >
      {item.imageUrl ? (
        <Image
          source={{
            uri: item.imageUrl,
          }}
          style={styles.image}
        />
      ) : (
        <View
          style={[
            styles.image,
            styles.placeholder,
          ]}
        >
          <IonIcon
            name="image-outline"
            size={26}
            color="#A28E82"
          />
        </View>
      )}

      <View style={styles.content}>
        <Text
          style={styles.name}
          numberOfLines={1}
        >
          {item.functionHallName}
        </Text>

        <Text
          style={styles.meta}
          numberOfLines={1}
        >
          {item.venueCategory ||
            'Venue'}
          {item.locality
            ? ` • ${item.locality}`
            : ''}
        </Text>

        <Text style={styles.price}>
          {item.menuAvailable ||
          item.pricingType ===
            'menu_based'
            ? 'Menu based'
            : Number(
                  item.rentPricePerDay,
                ) > 0
              ? `₹${Number(
                  item.rentPricePerDay,
                ).toLocaleString(
                  'en-IN',
                )}`
              : 'Price on request'}
        </Text>
      </View>

      <IonIcon
        name="chevron-forward"
        size={18}
        color="#A44A1F"
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.goBack()
          }
        >
          <IonIcon
            name="arrow-back"
            size={22}
            color="#352A25"
          />
        </TouchableOpacity>

        <View style={styles.headerCopy}>
          <Text style={styles.title}>
            Recently viewed
          </Text>

          <Text style={styles.subtitle}>
            {venues.length}{' '}
            {venues.length === 1
              ? 'venue'
              : 'venues'}
          </Text>
        </View>

        {venues.length > 0 && (
          <TouchableOpacity
            onPress={clearHistory}
          >
            <Text style={styles.clearText}>
              Clear
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={venues}
        keyExtractor={item =>
          String(item._id)
        }
        renderItem={renderItem}
        contentContainerStyle={
          venues.length
            ? styles.list
            : styles.emptyList
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <IonIcon
              name="time-outline"
              size={42}
              color="#B49C8E"
            />

            <Text style={styles.emptyTitle}>
              No recently viewed venues
            </Text>

            <Text style={styles.emptyText}>
              Venues you open will appear
              here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FAF7F4',
  },

  header: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth:
      StyleSheet.hairlineWidth,
    borderBottomColor: '#E8DDD6',
    backgroundColor: '#FFFFFF',
  },

  backButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: '#F8EEE8',
  },

  headerCopy: {
    flex: 1,
    marginLeft: 12,
  },

  title: {
    color: '#312824',
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'ManropeRegular',
  },

  subtitle: {
    marginTop: 1,
    color: '#81736B',
    fontSize: 10,
    fontFamily: 'ManropeRegular',
  },

  clearText: {
    color: '#A44A1F',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'ManropeRegular',
  },

  list: {
    padding: 16,
  },

  card: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
    padding: 9,
    borderWidth: 1,
    borderColor: '#E8DDD6',
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
  },

  image: {
    width: 82,
    height: 72,
    borderRadius: 11,
    backgroundColor: '#F2EBE6',
  },

  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flex: 1,
    marginHorizontal: 11,
  },

  name: {
    color: '#332A26',
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'ManropeRegular',
  },

  meta: {
    marginTop: 4,
    color: '#81736B',
    fontSize: 10,
    fontFamily: 'ManropeRegular',
  },

  price: {
    marginTop: 7,
    color: '#98431C',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'ManropeRegular',
  },

  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  empty: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  emptyTitle: {
    marginTop: 12,
    color: '#392F2A',
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'ManropeRegular',
  },

  emptyText: {
    marginTop: 5,
    color: '#82756E',
    fontSize: 11,
    textAlign: 'center',
    fontFamily: 'ManropeRegular',
  },
});

export default RecentlyViewedVenues;