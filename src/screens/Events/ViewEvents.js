import React, { useEffect, useState, useRef } from "react";
import { Alert, Text, View, Image, TextInput, Linking, StyleSheet, Dimensions, ScrollView, Button, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import axios from "axios";
import BASE_URL, { LocalHostUrl } from "../../apiconfig";
import { verticalScale } from "../../utils/scalingMetrics";
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import Modal from 'react-native-modal';
import themevariable from "../../utils/themevariable";
import LeftArrow from '../../assets/svgs/leftarrowWhite.svg';
import BookDatesButton from "../../components/GradientButton";
import { getUserAuthToken } from "../../utils/StoreAuthToken";
import CustomModal from "../../components/AlertModal";
import Icon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import ZoomImage from "../../components/ZoomImage";
import ZoomIcon from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';
import LinearGradient from "react-native-linear-gradient";
import { addRecentlyViewedVenue } from '../../utils/recentlyViewedVenues';

const { width, height } = Dimensions.get('window');

const ViewEvents = ({ route, navigation }) => {
  const [showModal, setShowModal] = useState(false);
  const [eventsDetails, setEventsDetails] = useState([])
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [noOfDays, setNoOfDays] = useState();
  const [subImages, setSubImages] = useState([]);
  const [menuImages, setMenuImages] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isTimeSlotModalVisible, setTimeSlotModalVisible] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [amenitiesData, setAmenitiesData] = useState();
  const [getUserAuth, setGetUserAuth] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const { categoryId } = route.params;
  const [functionHallDetails, setFunctionHallDetails] = useState([]);

  const [isCameraZoomImageModalVisible, setIsCameraZoomImageModalVisible] = useState(false);
  const [isMenuImageModalVisible, setIsMenuImageModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [menuImageCurrentIndex, setMenuImageCurrentIndex] = useState(0);
  const [menuQuantities, setMenuQuantities] = useState({});
  const [loading, setLoading] = useState(false);
  const [hallVideos, setHallVideos] = useState([]);
  const [videoPreview, setVideoPreview] = useState({ visible: false, uri: null });
  const [galleryImages, setGalleryImages] = useState([]);

  const includedGuests = Number(eventsDetails?.includedGuestCount);

  const showIncludedGuests =
    eventsDetails?.venueCategory === 'Farm House' &&
    !(menuImages?.length > 0) &&
    Number.isInteger(includedGuests) &&
    includedGuests > 0;

  const heroVideoRef = useRef(null);

  const openFullscreenVideo = (index) => {
    const video = hallVideos?.[index];
    if (video?.url) {
      setVideoPreview({ visible: true, uri: video.url });
    }
  };

  const HallDescription = 'Transform your special occasions into unforgettable memories with our exquisite function hall rentals! Whether you are hosting a grand wedding, a lively birthday bash, or a corporate event, our halls offer the perfect blend of elegance and comfort. With spacious layouts, stunning décor, and top-notch amenities, your guests will be impressed from the moment they arrive. Book with us today and let us help you create an event that exceeds all expectations!'

  const timeSlots = [
    '12:00 AM',
    '01:00 AM',
    '02:00 AM',
    '03:00 AM',
    '04:00 AM',
    '05:00 AM',
    '06:00 AM',
    '07:00 AM',
    '08:00 AM',
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
    '07:00 PM',
    '08:00 PM',
    '09:00 PM',
    '10:00 PM',
    '11:00 PM',
  ];

  const handleTimeSlotSelection = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setTimeSlotModalVisible(false);
  };


  useEffect(() => {
    getEventsDetails();
  }, []);

  const convertLocalhostUrls = (url) => {
    console.log("url is:::::::::::", url);
    return url?.replace("localhost", LocalHostUrl);
  };

  const handleQuantityChange = (menuKey, value) => {
    if (/^\d*$/.test(value)) {
      setMenuQuantities(prev => ({
        ...prev,
        [menuKey]: value
      }));
    }
  };

  const getMenuTypeTotal = (menuKey, menuPrice) => {
    const qty = parseInt(menuQuantities[menuKey] || '0', 10);
    const price = parseInt(menuPrice || '0', 10);
    return qty * price;
  };

  const totalAmountWithMenu = (menuImages || []).reduce((sum, img, index) => {
    const menuKey = `${img.menuType}_${img._id || index}`;
    return sum + getMenuTypeTotal(menuKey, img.menuPrice);
  }, 0);


  // Calculate total amount for all menu types
  const totalAdvacneAmountAfterPercentageCalculation = (totalAmountWithMenu * eventsDetails?.advanceAmountInPercentageForMenu) / 100;

  const CateringMenuSection = () => {
    if (menuImages.length === 0) return null;

    return (
      <View style={styles.menuContainer}>
        {/* Section header */}
        <View style={styles.menuSectionHeader}>
          <View style={styles.menuSectionTitleRow}>
            <View style={styles.menuSectionAccent} />
            <Text style={styles.menuSectionTitle}>In House Catering Menu</Text>
          </View>
          <Text style={styles.menuSectionSubtitle}>Tap image to preview • Set plates per menu</Text>
        </View>

        <FlatList
          data={menuImages}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={({ item, index }) => {
            const menuKey = `${item.menuType}_${item._id || index}`;
            const qty = parseInt(menuQuantities[menuKey] || '0', 10);
            const lineTotal = qty * parseInt(item.menuPrice || '0', 10);

            return (
              <View style={styles.menuCard}>
                {/* Image with overlay badges */}
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => { setMenuImageCurrentIndex(index); setIsMenuImageModalVisible(true); }}
                  style={styles.menuImageWrapper}>
                  <Image
                    source={{ uri: item.url }}
                    resizeMode="cover"
                    style={styles.menuImageStyle}
                  />
                  {/* Menu type badge top-left */}
                  <View style={styles.menuTypeBadge}>
                    <Text style={styles.menuTypeBadgeText}>{item.menuType}</Text>
                  </View>
                  {/* Price badge top-right */}
                  <View style={styles.menuPriceBadge}>
                    <Text style={styles.menuPriceBadgeText}>₹{item.menuPrice}<Text style={{ fontSize: 10 }}>/plate</Text></Text>
                  </View>
                  {/* Zoom hint */}
                  <View style={styles.menuZoomHint}>
                    <Text style={styles.menuZoomHintText}>🔍 Tap to zoom</Text>
                  </View>
                </TouchableOpacity>

                {/* Bottom action area */}
                <View style={styles.menuCardBody}>
                  {/* Plate count label */}
                  <View style={styles.menuPlateRow}>
                    <Text style={styles.menuPlateLabel}>Number of Plates</Text>
                    {qty > 0 && (
                      <View style={styles.menuSubtotalBadge}>
                        <Text style={styles.menuSubtotalText}>Subtotal: ₹{lineTotal.toLocaleString('en-IN')}</Text>
                      </View>
                    )}
                  </View>

                  {/* Plate input */}
                  <View style={styles.menuInputWrapper}>
                    <TextInput
                      style={styles.menuPlateInput}
                      placeholderTextColor="#BDBDBD"
                      placeholder="e.g. 150"
                      keyboardType="numeric"
                      value={menuQuantities[menuKey] || ''}
                      onChangeText={value => handleQuantityChange(menuKey, value)}
                    />
                    <View style={styles.menuInputSuffix}>
                      <Text style={styles.menuInputSuffixText}>plates</Text>
                    </View>
                  </View>

                  {qty === 0 && (
                    <Text style={styles.menuHintText}>Enter number of plates to include this menu</Text>
                  )}
                </View>
              </View>
            );
          }}
        />
      </View>
    );
  };

  // console.log('BASE_URL is ::>>>>>',BASE_URL);

  const getEventsDetails = async () => {
    setLoading(true);
    const token = await getUserAuthToken();
    setGetUserAuth(token);
    try {
      const response = await axios.get(`${BASE_URL}/getFunctionHallDetailsById/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEventsDetails(response?.data);

      // console.log("events resp details::::::::::", JSON.stringify(response?.data));

      const professionalImageUrl = response?.data?.professionalImage?.url;

      const imageUrls = [
        professionalImageUrl, // Add professional image as the first image
        ...response?.data?.additionalImages.flat().map(image => image?.url)
      ];

      setSubImages(imageUrls);

      const menuImagesArr = response?.data?.menuImages
        ?.flat()
        .map((image, index) => ({
          url: image?.url,
          menuType: image?.menuType,
          menuPrice: image?.menuPrice,
          _id: image?._id || index.toString(),
        }));
      setMenuImages(menuImagesArr);
      setHallVideos(response?.data?.hallVideos || []);

      const amenities = response?.data?.hallAmenities[0]?.split(',').map((item, index) => ({
        id: (index + 1).toString(),
        name: item.trim()
      }));
      setAmenitiesData(amenities);

      // console.log('response?.data?._id is ::>>',response?.data?._id);

      if (response?.data?._id) {
        await addRecentlyViewedVenue(
          response.data,
        );
      }

    } catch (error) {
      // console.log("events error::::::::::", error);

    } finally {
      setLoading(false); // Stop loader
    }
  }

  function formatAmount(amount) {
    const formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(amount);

    return `₹ ${formatted}`; // Note the space after ₹
  }


  const renderCalendar = () => {
    return (
      <Modal visible={isCalendarVisible} animationType="slide">
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={onDayPress}
            markedDates={{
              [selectedStartDate]: { startingDay: true, color: 'green', textColor: 'white' },
              [selectedEndDate]: { endingDay: true, color: 'green', textColor: 'white' },
            }}
          />
          <Button title="Close Calendar" onPress={() => setCalendarVisible(false)} />
        </View>
      </Modal>
    );
  };

  const formattedDates = (date) => {
    const formattedDate = moment(date).format("DD MMM YYYY");
    return formattedDate;
  }

  const onDayPress = (day) => {
    console.log('day is::>>', day)
    let startedDate;
    if (!selectedStartDate || selectedEndDate) {
      startedDate = day?.dateString;
      const formattedDate = formattedDates(day?.dateString);
      setSelectedStartDate(day?.dateString);
      setSelectedEndDate('');
    } else if (day.dateString < selectedStartDate) {
      startedDate = day?.dateString;
      const formattedDate = formattedDates(day?.dateString);
      setSelectedStartDate(day?.dateString);
    } else {
      const formattedDate = formattedDates(day?.dateString);
      setSelectedEndDate(formattedDate);
      const endedDate = day?.dateString;
      const startDate = new Date(selectedStartDate);
      const endDate = new Date(endedDate);
      console.log(selectedStartDate, endedDate, 'started and ednded dates::>>>')
      const diffInTime = endDate.getTime() - startDate.getTime();
      const diffInDays = diffInTime / (1000 * 3600 * 24);
      setNoOfDays(diffInDays);
      const formattedStartDate = formattedDates(selectedStartDate);
      setSelectedStartDate(formattedStartDate);
      console.log('Number of days:', diffInDays);
    }
  };

  const getIcon = (name) => {
    switch (name) {
      case 'Parking':
        return <FontAwesome5 name={'car'} size={24} color={'#FD813B'} />;
      case 'Restrooms/Toilets':
        return <FontAwesome5 name={'restroom'} size={24} color={'#FD813B'} />;
      case 'Wheelchair access':
        return <FontAwesome name='wheelchair' size={24} color={'#FD813B'} />;
      case 'Tables with basic covers':
        return <MaterialIcon name='table-restaurant' size={24} color={'#FD813B'} />;
      case 'Power Backup':
        return <Entypo name='power-plug' size={24} color={'#FD813B'} />;
      case 'Chairs':
        return <Icon name='chair' size={24} color={'#FD813B'} />;
      case 'Coolers / Fans':
        return <MaterialCommunityIcons name='fan' size={24} color={'#FD813B'} />;
      case 'Air Conditioners (AC)':
        return <MaterialCommunityIcons name='air-conditioner' size={24} color={'#FD813B'} />;
      case 'Bedrooms':
        return <IonIcons name={'bed-sharp'} size={24} color={'#FD813B'} />;
      case 'Lighting':
        return <MaterialCommunityIcons name='string-lights' size={24} color={'#FD813B'} />;
      case 'Kitchen Space':
        return <FontAwesome6 name={'kitchen-set'} size={24} color={'#FD813B'} />;
      case 'Bridal Room':
        return <IonIcons name={'bed-sharp'} size={24} color={'#FD813B'} />;
      case 'Sound/music license':
        return <MaterialIcon name='queue-music' size={25} color={'#FD813B'} />;
      default:
        return null;
    }
  };

  // Helper function to chunk data into rows of 4
  const chunkArray = (data, chunkSize) => {
    const result = [];
    for (let i = 0; i < data?.length; i += chunkSize) {
      result.push(data.slice(i, i + chunkSize));
    }
    return result;
  };

  const rows = chunkArray(amenitiesData, 3); // Three readable amenity cards per row

  const renderHallAmenities = ({ item }) => {

    return (
      <View style={styles.row}>
        {item.map((data) => (
          <View key={data?.id} style={styles.itemContainer}>
            {getIcon(data?.name)}
            <Text style={styles.itemText}>{data?.name}</Text>
          </View>
        ))}
      </View>
    )

  }

  const handleOpenURL = () => {
    setShowModal(false); // Close the modal
    Linking.openURL(`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${eventsDetails?.latitude},${eventsDetails?.longitude}`);
  };

  const showAlert = () => {
    Alert.alert(
      "Open Street View",
      "You are about to open the Street View in your browser. You can return to the app manually after viewing the link.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open", onPress: handleOpenURL }
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="#FD813B" />
      </View>
    );
  }

  return (
    <View style={styles.vdScreen}>
      <ScrollView
        style={styles.vdScroll}
        contentContainerStyle={styles.vdScrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ══ HERO ══
             • Has video  → autoplay video + play button + premium badge
             • No video   → first venue image as full-bleed hero
             Both cases share the same gradient overlay + name/address
        ══════════════════════════════════════════ */}
        <View style={styles.heroContainer}>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            style={styles.vdBackButton}
            accessibilityRole="button"
            accessibilityLabel="Go back">
            <IonIcon name="arrow-back" size={21} color="#FFFFFF" />
          </TouchableOpacity>

          {hallVideos?.length > 0 ? (
            /* ── VIDEO HERO ── */
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={() => openFullscreenVideo(0)}
            >
              <Video
                ref={heroVideoRef}
                source={{ uri: hallVideos[0]?.url }}
                style={styles.heroVideo}
                resizeMode="cover"
                muted
                repeat
                paused={false}
              />
              <LinearGradient
                colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.45)', 'rgba(0,0,0,0.82)']}
                style={styles.heroOverlay}
              >
                <View style={styles.premiumBadge}>
                  <IonIcon name="videocam" size={12} color="#fff" style={{ marginRight: 5 }} />
                  <Text style={styles.premiumText}>Watch Venue Tour</Text>
                </View>
                <View style={styles.playButton}>
                  <IonIcon name="play" size={34} color="#fff" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            /* ── IMAGE HERO (no video) ── */
            <View>
              {subImages.length > 0 ? (
                <Image
                  source={{ uri: subImages[0] }}
                  style={styles.heroVideo}
                  resizeMode="cover"
                />
              ) : (
                /* ── PLACEHOLDER (no images yet either) ── */
                <LinearGradient
                  colors={['#1a1a1a', '#2d2d2d']}
                  style={styles.heroVideo}
                >
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <IonIcon name="business-outline" size={52} color="rgba(255,255,255,0.2)" />
                  </View>
                </LinearGradient>
              )}
              <LinearGradient
                colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.78)']}
                style={styles.heroOverlay}
              >
                {/* photos-only badge */}
                <View style={styles.premiumBadge}>
                  <IonIcon name="images-outline" size={12} color="#fff" style={{ marginRight: 5 }} />
                  <Text style={styles.premiumText}>{subImages.length} Photos</Text>
                </View>
              </LinearGradient>
            </View>
          )}

          {/* name + address — always shown over the hero */}
          <View style={styles.heroContent}>
            <Text style={styles.hallName} numberOfLines={2}>
              {eventsDetails?.functionHallName}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 6 }}>
              <IonIcon name="location-outline" size={14} color="rgba(255,255,255,0.75)" style={{ marginTop: 1, marginRight: 4 }} />
              <Text style={styles.locationText} numberOfLines={2}>
                {eventsDetails?.functionHallAddress?.address}
              </Text>
            </View>
          </View>
        </View>

        {/* ══════════════════════════════════════════
             UNIFIED MEDIA SECTION
        ══════════════════════════════════════════ */}

        {/* ── WAVE CONNECTOR: hero → gallery ── */}
        <View style={styles.waveConnector}>
          <LinearGradient
            colors={['rgba(0,0,0,0.78)', 'rgba(0,0,0,0.0)']}
            style={styles.waveGradient}
          />
          {/* floating media-count pill */}
          <View style={styles.mediaCountPill}>
            <IonIcon name="images" size={13} color="#FD813B" />
            <Text style={styles.mediaCountText}>{subImages.length} Photos</Text>
            {hallVideos?.length > 0 && (
              <>
                <View style={styles.mediaCountDot} />
                <IonIcon name="videocam" size={13} color="#FD813B" />
                <Text style={styles.mediaCountText}>{hallVideos.length} Videos</Text>
              </>
            )}
          </View>
        </View>

        {/* ── MAIN GALLERY SWIPER ── */}
        <View style={styles.galleryCard}>
          {/* header row */}
          <View style={styles.galleryHeader}>
            <View style={styles.galleryHeaderLeft}>
              <View style={styles.galleryHeaderDot} />
              <Text style={styles.galleryHeaderTitle}>Venue Gallery</Text>
            </View>
            <TouchableOpacity
              onPress={() => [setCurrentIndex(0), setIsCameraZoomImageModalVisible(true)]}
              style={styles.viewAllBtn}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <IonIcon name="chevron-forward" size={13} color="#FD813B" />
            </TouchableOpacity>
          </View>

          {/* swiper */}
          <View style={styles.swiperWrapper}>
            <SwiperFlatList
              index={0}
              paginationDefaultColor="rgba(255,255,255,0.5)"
              paginationActiveColor="#FD813B"
              showPagination={true}
              paginationStyle={{ bottom: 12 }}
              paginationStyleItem={{ alignSelf: 'center' }}
              paginationStyleItemInactive={{ width: 6, height: 6 }}
              paginationStyleItemActive={{ width: 18, height: 6, borderRadius: 3 }}
              data={subImages}
              style={{ flex: 1, alignSelf: 'center' }}
              onChangeIndex={({ index }) => setCurrentIndex(index)}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  activeOpacity={0.92}
                  onPress={() => [setCurrentIndex(index), setIsCameraZoomImageModalVisible(true)]}
                  style={{ width: Dimensions.get('window').width - 32, height: 260 }}
                >
                  <Image
                    source={{ uri: item }}
                    style={styles.gallerySwipeImage}
                    resizeMethod="auto"
                    resizeMode="cover"
                  />
                  {/* top-right zoom chip */}
                  <View style={styles.zoomChip}>
                    <ZoomIcon name="zoom-out-map" size={14} color="#fff" />
                  </View>
                  {/* bottom-left index badge */}
                  <View style={styles.imageIndexBadge}>
                    <Text style={styles.imageIndexText}>
                      {index + 1} / {subImages.length}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* ── THUMBNAIL STRIP: videos first, then photos ── */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailStripContent}
            style={styles.thumbnailStrip}
          >
            {/* video thumbnails — first */}
            {hallVideos?.map((vid, idx) => (
              <TouchableOpacity
                key={`vid-${idx}`}
                onPress={() => openFullscreenVideo(idx)}
                style={[styles.thumbItem, styles.thumbVideoItem]}
                activeOpacity={0.8}
              >
                <Video
                  source={{ uri: vid?.url }}
                  style={styles.thumbImage}
                  resizeMode="cover"
                  paused
                  muted
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.6)']}
                  style={styles.thumbVideoOverlay}
                >
                  <View style={styles.thumbPlayCircle}>
                    <IonIcon name="play" size={14} color="#fff" />
                  </View>
                </LinearGradient>
                <View style={styles.thumbVideoLabel}>
                  <Text style={styles.thumbVideoLabelText}>VIDEO</Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* photo thumbnails — after videos */}
            {subImages.map((uri, idx) => (
              <TouchableOpacity
                key={`photo-${idx}`}
                onPress={() => { setCurrentIndex(idx); setIsCameraZoomImageModalVisible(true); }}
                style={[
                  styles.thumbItem,
                  currentIndex === idx && styles.thumbItemActive,
                ]}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri }}
                  style={styles.thumbImage}
                  resizeMode="cover"
                />
                {currentIndex === idx && (
                  <View style={styles.thumbActiveOverlay}>
                    <IonIcon name="eye" size={14} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ZoomImage
          visible={isCameraZoomImageModalVisible}
          onClose={() => setIsCameraZoomImageModalVisible(false)}
          images={subImages || []}
          initialIndex={currentIndex}
          tokenIs={getUserAuth}
        />

        <ZoomImage
          visible={isMenuImageModalVisible}
          onClose={() => setIsMenuImageModalVisible(false)}
          images={(menuImages || []).map(img => img.url)}
          initialIndex={menuImageCurrentIndex}
          tokenIs={getUserAuth}
        />


        {/* ── QUICK STATS BAR ── */}
        <View style={styles.quickStatsBar}>
          <View style={styles.quickStatItem}>
            <IonIcon name="people-outline" size={18} color="#FD813B" />
            <Text style={styles.quickStatValue}>{eventsDetails?.seatingCapacity || '—'}</Text>
            <Text style={styles.quickStatLabel}>Guests</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <IonIcon name="pricetag-outline" size={18} color="#FD813B" />
            <Text style={styles.quickStatValue}>
              {menuImages?.length > 0 ? 'Menu' : formatAmount(eventsDetails?.rentPricePerDay)}
            </Text>
            <Text style={styles.quickStatLabel}>{menuImages?.length > 0 ? 'Based' : 'Per Day'}</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <IonIcon name="restaurant-outline" size={18} color="#FD813B" />
            <Text style={styles.quickStatValue}>
              {eventsDetails?.foodType === 'Both' ? 'Veg & Non-Veg' : eventsDetails?.foodType === 'veg' ? 'Veg Only' : 'Non-Veg'}
            </Text>
            <Text style={styles.quickStatLabel}>Food</Text>
          </View>
        </View>

        <View style={styles.vdContent}>

          {/* ── VENUE NAME + VERIFIED BADGE ── */}
          <View style={styles.vdVenueHeaderCard}>
            <View style={styles.vdVenueTitleRow}>
            <View style={styles.vdVenueTitleCopy}>
              <Text style={styles.vdCategoryLabel}>
                {(eventsDetails?.venueCategory || 'Venue').toUpperCase()}
              </Text>
              <Text style={styles.vdVenueTitle}>{eventsDetails?.functionHallName}</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <IonIcon name="shield-checkmark" size={13} color="#009C4D" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>

          {/* ── ADDRESS + STREET VIEW ── */}
          <View style={styles.vdAddressRow}>
            <View style={styles.vdAddressIcon}>
              <IonIcon name="location-outline" size={18} color="#A54A20" />
            </View>
            <Text style={styles.vdAddressText}>
              {eventsDetails?.functionHallAddress?.address || 'Address unavailable'}
            </Text>
          </View>
          <TouchableOpacity onPress={showAlert} style={styles.vdMapButton}>
            <IonIcon name="map-outline" size={15} color="#93401B" />
            <Text style={styles.vdMapButtonText}>
              View Street View
            </Text>
            <IonIcon name="open-outline" size={13} color="#93401B" />
          </TouchableOpacity>
          </View>

          {/* ── PRICING CARD ── */}
          {/* ── PRICING CARD ── */}
          <View style={styles.pricingHighlightCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.pricingHighlightLabel}>
                {menuImages?.length > 0 ? 'Pricing' : 'Rent Price'}
              </Text>

              <Text style={styles.pricingHighlightValue}>
                {menuImages?.length > 0
                  ? 'Menu Based Pricing'
                  : `${formatAmount(eventsDetails?.rentPricePerDay)} / day`}
              </Text>

              {showIncludedGuests && (
                <View style={styles.includedGuestsBadge}>
                  <IonIcon
                    name="people-outline"
                    size={14}
                    color="#2F653B"
                  />

                  <Text style={styles.includedGuestsLabel}>
                    Includes {includedGuests}{' '}
                    {includedGuests === 1 ? 'guest' : 'guests'}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.pricingAdvanceBox}>
              <Text style={styles.pricingAdvanceLabel}>Advance</Text>

              <Text style={styles.pricingAdvanceValue}>
                {menuImages?.length > 0
                  ? `${eventsDetails?.advanceAmountInPercentageForMenu}%`
                  : formatAmount(eventsDetails?.advanceAmount)}
              </Text>
            </View>
          </View>


          {/* ── DESCRIPTION ── */}
          <View style={styles.vdSectionCard}>
            <View style={styles.vdSectionHeader}>
              <View style={styles.vdSectionIcon}>
                <IonIcon name="information-circle-outline" size={18} color="#A54A20" />
              </View>
              <View>
                <Text style={styles.vdSectionEyebrow}>VENUE INFORMATION</Text>
                <Text style={styles.vdSectionTitle}>About this venue</Text>
              </View>
            </View>
            <Text style={styles.vdDescription}>
              {eventsDetails?.description || HallDescription}
            </Text>
            {!!eventsDetails?.functionHallAreaInSft && (
              <View style={styles.areaChip}>
                <IonIcon name="expand-outline" size={14} color="#FD813B" />
                <Text style={styles.areaChipText}>Hall Area: {eventsDetails?.functionHallAreaInSft} Sqft</Text>
              </View>
            )}
          </View>

          {menuImages?.length > 0 && (
            CateringMenuSection()
          )}

          <View style={styles.vdSectionCard}>
            <View style={styles.vdSectionHeader}>
              <View style={styles.vdSectionIcon}>
                <IonIcon name="sparkles-outline" size={18} color="#A54A20" />
              </View>
              <View>
                <Text style={styles.vdSectionEyebrow}>WHAT IS AVAILABLE</Text>
                <Text style={styles.vdSectionTitle}>Venue amenities</Text>
              </View>
            </View>
            <FlatList
              data={rows}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderHallAmenities}
              contentContainerStyle={styles.vdAmenitiesList}
              scrollEnabled={false}
            />

          </View>

          {renderCalendar()}
          <View style={styles.vdBookingCard}>
            <View style={styles.vdSectionHeader}>
              <View style={[styles.vdSectionIcon, styles.vdBookingIcon]}>
                <IonIcon name="calendar-outline" size={18} color="#FFFFFF" />
              </View>
              <View style={styles.vdBookingHeadingCopy}>
                <Text style={styles.vdBookingEyebrow}>CHECK YOUR EVENT DATE</Text>
                <Text style={styles.vdBookingTitle}>Select booking details</Text>
                <Text style={styles.vdBookingSubtitle}>The vendor will confirm availability after your request.</Text>
              </View>
            </View>

            <Text style={styles.vdFieldLabel}>Booking date</Text>
            <TouchableOpacity style={styles.vdSelector} onPress={() => setIsVisible(true)}>
              <View style={styles.vdSelectorLeading}>
                <IonIcon name="calendar-clear-outline" size={18} color="#A54A20" />
                <Text style={[styles.vdSelectorText, selectedDate && styles.vdSelectorTextActive]}>
                  {selectedDate ? moment(selectedDate).format('DD MMM YYYY') : 'Choose event date'}
                </Text>
              </View>
              <IonIcon name="chevron-forward" size={17} color="#A98A79" />
            </TouchableOpacity>

            <Text style={styles.vdFieldLabel}>Booking time</Text>
            <TouchableOpacity style={styles.vdSelector} onPress={() => setTimeSlotModalVisible(true)}>
              <View style={styles.vdSelectorLeading}>
                <IonIcon name="time-outline" size={19} color="#A54A20" />
                <Text style={[styles.vdSelectorText, selectedTimeSlot && styles.vdSelectorTextActive]}>
                  {selectedTimeSlot || 'Choose time slot'}
                </Text>
              </View>
              <IonIcon name="chevron-forward" size={17} color="#A98A79" />
            </TouchableOpacity>
          </View>

          {/* ── BOOKING SUMMARY CARD ── */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryCardHeader}>
              <IonIcon name="receipt-outline" size={18} color="#FD813B" />
              <Text style={styles.summaryCardTitle}>Booking Summary</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryRowLabel}>Total Days</Text>
              <Text style={styles.summaryRowValue}>{noOfDays > 1 ? `${noOfDays} days` : '1 day'}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryRowLabel}>
                {menuImages?.length > 0 ? 'Advance %' : 'Advance Amount'}
              </Text>
              <Text style={styles.summaryRowValue}>
                {menuImages?.length > 0 ? `${eventsDetails?.advanceAmountInPercentageForMenu}%` : formatAmount(eventsDetails?.advanceAmount)}
              </Text>
            </View>

            {menuImages?.length > 0 && Number(totalAdvacneAmountAfterPercentageCalculation) > 0 && (
              <View style={styles.summaryRow}>
                <View>
                  <Text style={styles.summaryRowLabel}>Advance Payable</Text>
                  <Text style={[styles.summaryRowLabel, { fontSize: 11, color: '#939393', fontWeight: '400' }]}>
                    {`${eventsDetails?.advanceAmountInPercentageForMenu}% of total`}
                  </Text>
                </View>
                <Text style={styles.summaryRowValue}>
                  {formatAmount(Number(totalAdvacneAmountAfterPercentageCalculation) || 0)}
                </Text>
              </View>
            )}

            {(totalAmountWithMenu > 0 || eventsDetails?.rentPricePerDay > 0) && (
              <>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryRowLabel, { fontSize: 15, color: '#121212' }]}>Total Price</Text>
                  <Text style={styles.summaryTotalValue}>
                    {menuImages?.length > 0
                      ? formatAmount(totalAmountWithMenu > 0 ? totalAmountWithMenu : 0)
                      : formatAmount(eventsDetails?.rentPricePerDay || 0)}
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* ── MENU SELECTION SUMMARY (only for menu-based halls) ── */}
          {menuImages?.length > 0 && menuImages.some((img, index) => {
            const menuKey = `${img.menuType}_${img._id || index}`;
            return parseInt(menuQuantities[menuKey] || '0', 10) > 0;
          }) && (
              <View style={[styles.summaryCard, { marginTop: 12 }]}>
                <View style={styles.summaryCardHeader}>
                  <IonIcon name="restaurant-outline" size={18} color="#FD813B" />
                  <Text style={styles.summaryCardTitle}>Menu Selection</Text>
                </View>
                <View style={styles.summaryDivider} />
                {menuImages.map((img, index) => {
                  const menuKey = `${img.menuType}_${img._id || index}`;
                  const qty = parseInt(menuQuantities[menuKey] || '0', 10);
                  if (qty === 0) return null;
                  const lineTotal = qty * parseInt(img.menuPrice || '0', 10);
                  return (
                    <View key={menuKey} style={styles.summaryRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.summaryRowLabel}>{img.menuType}</Text>
                        <Text style={[styles.summaryRowLabel, { fontSize: 11, color: '#939393', fontWeight: '400' }]}>
                          {qty} {qty === 1 ? 'plate' : 'plates'} × ₹{img.menuPrice}
                        </Text>
                      </View>
                      <Text style={styles.summaryRowValue}>{formatAmount(lineTotal)}</Text>
                    </View>
                  );
                })}
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryRowLabel, { fontSize: 15, color: '#121212' }]}>Menu Total</Text>
                  <Text style={styles.summaryTotalValue}>{formatAmount(totalAmountWithMenu)}</Text>
                </View>
              </View>
            )}

          <View style={styles.vdBottomSpacer} />


        </View>

        <Modal
          isVisible={isVisible}
          backdropOpacity={0.9}
          backdropColor={themevariable.Color_000000}
          hideModalContentWhileAnimating={true}
          animationOutTiming={500}
          backdropTransitionInTiming={500}
          backdropTransitionOutTiming={500}
          animationInTiming={500}
          style={{
            flex: 1,
            width: "100%",
            alignSelf: "center"
            // top: 20,
            // margin: 0,
          }}
          onBackButtonPress={() => setIsVisible(false)}
          animationOut={'slideOutDown'}
          animationType={'slideInUp'}
        >
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", }}>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <LeftArrow style={{ marginTop: 3, marginHorizontal: 50 }} />
              </TouchableOpacity>
              <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "800", fontFamily: "ManropeRegular", }}>Select Date & Time</Text>
            </View>
            <Calendar
              onDayPress={(day) => setSelectedDate(day.dateString)}
              headerStyle={{ backgroundColor: '#FDEEBC' }}
              markedDates={{ [selectedDate]: { selected: true, marked: true, selectedColor: '#ED5065' } }}
              markingType="single"
              minDate={moment().format('YYYY-MM-DD')} // Disable past dates
              theme={{
                arrowColor: 'black',
                todayTextColor: '#ED5065',
                selectedDayBackgroundColor: '#ED5065',
              }}
              style={{ marginTop: 20, marginHorizontal: 25, borderRadius: 10 }}
            />

            <View style={{ flex: 1, bottom: 0, position: "absolute" }}>
              <BookDatesButton
                onPress={() => setIsVisible(false)}
                text={'Confirm Date'}
                padding={10}
              />
            </View>
          </View>
        </Modal>

        <Modal
          isVisible={isTimeSlotModalVisible}
          backdropOpacity={0.9}
          backdropColor={themevariable.Color_000000}
          onBackdropPress={() => setTimeSlotModalVisible(false)}
        >
          <View style={{
            backgroundColor: '#FFFFFF',
            padding: 20,
            borderRadius: 10
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              marginBottom: 10,
              color: "#121212",
              fontFamily: 'ManropeRegular',
            }}>Select Time Slot</Text>
            <FlatList
              data={timeSlots}
              numColumns={3}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const isSelected = selectedTimeSlot === item;
                return (
                  <TouchableOpacity
                    style={{
                      padding: 10,
                      paddingHorizontal: 10,
                      paddingVertical: 15,
                      borderRadius: 10,
                      borderColor: isSelected ? "#FD813B" : "#E8E8E8",
                      borderWidth: isSelected ? 2 : 1,
                      backgroundColor: isSelected ? "#FFF5EE" : "#FAFAFA",
                      marginHorizontal: 5,
                      marginVertical: 5,
                      flex: 1,
                      alignItems: 'center',
                    }}
                    onPress={() => handleTimeSlotSelection(item)}
                  >
                    <Text style={[styles.timeSlotText, { color: isSelected ? "#FD813B" : "#666666", fontWeight: isSelected ? "700" : "500" }]}>{item}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </Modal>

        <CustomModal
          visible={modalVisible}
          message={modalMessage}
          onClose={() => setModalVisible(false)}
        />

        {/* ══ VIDEO PREVIEW MODAL ══ */}
        <Modal
          isVisible={videoPreview.visible}
          backdropOpacity={1}
          backdropColor="#000"
          onBackButtonPress={() => setVideoPreview({ visible: false, uri: null })}
          onBackdropPress={() => setVideoPreview({ visible: false, uri: null })}
          style={{ margin: 0 }}
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInTiming={250}
          animationOutTiming={200}
          useNativeDriver
        >
          <View style={styles.videoModalContainer}>

            {/* ── top gradient bar with close ── */}
            <LinearGradient
              colors={['rgba(0,0,0,0.85)', 'transparent']}
              style={styles.videoModalTopBar}
            >
              <View style={styles.videoModalTitleRow}>
                <View style={styles.videoModalLiveDot} />
                <Text style={styles.videoModalTitle}>
                  {eventsDetails?.functionHallName || 'Venue Video'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setVideoPreview({ visible: false, uri: null })}
                style={styles.videoModalCloseBtn}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <IonIcon name="close" size={22} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>

            {/* ── video player ── */}
            {videoPreview.uri ? (
              <Video
                source={{ uri: videoPreview.uri }}
                style={styles.videoModalPlayer}
                resizeMode="contain"
                controls={true}
                paused={false}
                onError={(e) => console.error('Video error:', e)}
              />
            ) : null}

            {/* ── bottom gradient bar ── */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.75)']}
              style={styles.videoModalBottomBar}
            >
              <IonIcon name="videocam-outline" size={14} color="rgba(255,255,255,0.5)" />
              <Text style={styles.videoModalHint}>Swipe down or tap outside to close</Text>
            </LinearGradient>

          </View>
        </Modal>
      </ScrollView>
      <View style={styles.vdStickyFooter}>
        <BookDatesButton

          onPress={() => {
            const selectedMenus = menuImages
              .map(menu => {
                const menuKey = `${menu.menuType}_${menu._id}`;
                const qty = parseInt(menuQuantities[menuKey] || '0', 10);
                if (qty > 0) {
                  return {
                    menuType: menu.menuType,
                    price: menu.menuPrice,
                    plateCount: qty
                  };
                }
                return null;
              })
              .filter(Boolean);
            if (menuImages?.length > 0 && totalAdvacneAmountAfterPercentageCalculation == 0) {
              setModalMessage("Enter number of plates you need to place the order");
              setModalVisible(true);
              return;
            }
            if (selectedTimeSlot && selectedDate) {
              navigation.navigate('HallsBookingOverView', {
                categoryId: categoryId,
                timeSlot: selectedTimeSlot,
                bookingDate: moment(selectedDate).format('DD-MM-YYYY'),
                totalPrice: `${menuImages?.length > 0 ? (totalAmountWithMenu > 0 ? totalAmountWithMenu : 0) : eventsDetails?.rentPricePerDay}`,
                advanceAmount: `${menuImages?.length > 0 ? (Number(totalAdvacneAmountAfterPercentageCalculation) || 0) : (eventsDetails?.advanceAmount)}`,
                selectedMenus: selectedMenus,
              })
            } else if (!selectedDate) {
              setModalMessage("Please select the Date");
              setModalVisible(true);
            } else if (!selectedTimeSlot) {
              setModalMessage("Please select the Time Slot");
              setModalVisible(true);
            }
          }}
          text={'Continue Booking'}
          padding={10}
        />
      </View>
    </View>
  )
};


const styles = StyleSheet.create({
  vdScreen: {
    flex: 1,
    backgroundColor: '#F8F4F1',
  },
  vdScroll: {
    flex: 1,
    backgroundColor: '#F8F4F1',
  },
  vdScrollContent: {
    paddingBottom: verticalScale(112),
  },
  vdBackButton: {
    position: 'absolute',
    top: verticalScale(16),
    left: 16,
    zIndex: 30,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(35,22,15,0.56)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.36)',
  },
  vdContent: {
    marginTop: verticalScale(16),
    marginHorizontal: 16,
  },
  vdVenueHeaderCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8D9CF',
    borderRadius: 18,
    backgroundColor: '#FFFDFC',
    elevation: 2,
    shadowColor: '#56331F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 7,
  },
  vdVenueTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  vdVenueTitleCopy: {
    flex: 1,
    paddingRight: 10,
  },
  vdCategoryLabel: {
    marginBottom: 4,
    color: '#A65A35',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    fontFamily: 'ManropeRegular',
  },
  vdVenueTitle: {
    color: '#302621',
    fontSize: 21,
    lineHeight: 28,
    fontWeight: '800',
    fontFamily: 'ManropeRegular',
  },
  vdAddressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 13,
    paddingTop: 13,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E9DED7',
  },
  vdAddressIcon: {
    width: 30,
    height: 30,
    marginRight: 9,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0E7',
  },
  vdAddressText: {
    flex: 1,
    color: '#746760',
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'ManropeRegular',
  },
  vdMapButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 11,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#EDCDBA',
    borderRadius: 11,
    backgroundColor: '#FFF5EE',
  },
  vdMapButtonText: {
    marginHorizontal: 6,
    color: '#93401B',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'ManropeRegular',
  },
  vdSectionCard: {
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9DDD5',
    borderRadius: 17,
    backgroundColor: '#FFFDFC',
  },
  vdSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },
  vdSectionIcon: {
    width: 36,
    height: 36,
    marginRight: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0E7',
  },
  vdSectionEyebrow: {
    color: '#A36A4A',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.7,
    fontFamily: 'ManropeRegular',
  },
  vdSectionTitle: {
    marginTop: 2,
    color: '#332A26',
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'ManropeRegular',
  },
  vdDescription: {
    color: '#70645E',
    fontSize: 12.5,
    lineHeight: 20,
    fontFamily: 'ManropeRegular',
  },
  vdAmenitiesList: {
    paddingTop: 2,
  },
  vdBookingCard: {
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0B89F',
    borderRadius: 18,
    backgroundColor: '#F7E8DE',
  },
  vdBookingIcon: {
    backgroundColor: '#A54A20',
  },
  vdBookingHeadingCopy: {
    flex: 1,
  },
  vdBookingEyebrow: {
    color: '#8C4B2A',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.7,
    fontFamily: 'ManropeRegular',
  },
  vdBookingTitle: {
    marginTop: 2,
    color: '#44281B',
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'ManropeRegular',
  },
  vdBookingSubtitle: {
    marginTop: 3,
    color: '#806557',
    fontSize: 10,
    lineHeight: 15,
    fontFamily: 'ManropeRegular',
  },
  vdFieldLabel: {
    marginTop: 11,
    marginBottom: 7,
    color: '#5D4032',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'ManropeRegular',
  },
  vdSelector: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: '#DDBAA6',
    borderRadius: 13,
    backgroundColor: '#FFFDFC',
  },
  vdSelectorLeading: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  vdSelectorText: {
    flex: 1,
    marginLeft: 9,
    color: '#967E71',
    fontSize: 12,
    fontFamily: 'ManropeRegular',
  },
  vdSelectorTextActive: {
    color: '#382A24',
    fontWeight: '700',
  },
  vdBottomSpacer: {
    height: verticalScale(20),
  },
  vdStickyFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 7,
    paddingBottom: 8,
    backgroundColor: 'rgba(255,253,251,0.98)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E3D4CB',
    elevation: 12,
    shadowColor: '#432718',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center', backgroundColor: "#F9F9F9",
    height: 200,
  },
  container: { flex: 1, backgroundColor: 'white' },
  menuContainer: {
    marginTop: 8,
  },
  menuSectionHeader: {
    marginBottom: 16,
  },
  menuSectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  menuSectionAccent: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: '#FD813B',
    marginRight: 8,
  },
  menuSectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#100D25',
    fontFamily: 'ManropeRegular',
  },
  menuSectionSubtitle: {
    fontSize: 12,
    color: '#939393',
    fontFamily: 'ManropeRegular',
    marginLeft: 12,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  menuImageWrapper: {
    position: 'relative',
  },
  menuImageStyle: {
    width: '100%',
    height: 180,
  },
  menuTypeBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(16,13,37,0.75)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  menuTypeBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'ManropeRegular',
  },
  menuPriceBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FD813B',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  menuPriceBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    fontFamily: 'ManropeRegular',
  },
  menuZoomHint: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  menuZoomHintText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'ManropeRegular',
  },
  menuCardBody: {
    padding: 14,
  },
  menuPlateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuPlateLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#100D25',
    fontFamily: 'ManropeRegular',
  },
  menuSubtotalBadge: {
    backgroundColor: '#FFF3EA',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  menuSubtotalText: {
    color: '#FD813B',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'ManropeRegular',
  },
  menuInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  menuPlateInput: {
    flex: 1,
    height: 46,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '700',
    color: '#100D25',
    fontFamily: 'ManropeRegular',
  },
  menuInputSuffix: {
    height: 46,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#E0E0E0',
    backgroundColor: '#F7F7F7',
  },
  menuInputSuffixText: {
    color: '#606060',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'ManropeRegular',
  },
  menuHintText: {
    fontSize: 11,
    color: '#BDBDBD',
    fontFamily: 'ManropeRegular',
    marginTop: 6,
    textAlign: 'center',
  },
  // ── OLD DIVIDER (kept for reference, replaced by waveConnector) ──
  mediaDividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  mediaDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  mediaDividerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5EE',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 30,
    marginHorizontal: 12,
  },
  mediaDividerText: {
    marginLeft: 6,
    color: '#FD813B',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'ManropeRegular',
  },
  // ── WAVE CONNECTOR ──
  waveConnector: {
    height: 48,
    backgroundColor: '#F8F4F1',
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  waveGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mediaCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 7,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    gap: 5,
    position: 'absolute',
    bottom: -14,
    zIndex: 10,
  },
  mediaCountText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#121212',
    fontFamily: 'ManropeRegular',
  },
  mediaCountDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E8E8E8',
  },
  // ── GALLERY CARD ──
  galleryCard: {
    marginHorizontal: 16,
    marginTop: 26,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E7DCD5',
  },
  galleryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  galleryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  galleryHeaderDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FD813B',
  },
  galleryHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#121212',
    fontFamily: 'ManropeRegular',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FD813B',
    fontFamily: 'ManropeRegular',
  },
  swiperWrapper: {
    backgroundColor: '#000',
  },
  gallerySwipeImage: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  zoomChip: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 20,
    padding: 6,
  },
  imageIndexBadge: {
    position: 'absolute',
    bottom: 14,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  imageIndexText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'ManropeRegular',
  },
  // ── THUMBNAIL STRIP ──
  thumbnailStrip: {
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
  },
  thumbnailStripContent: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  thumbItem: {
    width: 60,
    height: 60,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbVideoItem: {
    borderColor: '#E8E8E8',
  },
  thumbItemActive: {
    borderColor: '#FD813B',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  thumbMoreOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  thumbMoreText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'ManropeRegular',
  },
  thumbVideoOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbPlayCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(160,20,62,0.88)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbActiveOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(160,20,62,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // ── VIDEO MODAL ──
  videoModalContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  videoModalTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 52,
    paddingBottom: 28,
    paddingHorizontal: 20,
  },
  videoModalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 12,
  },
  videoModalLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ECA73C',
  },
  videoModalTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'ManropeRegular',
    flexShrink: 1,
  },
  videoModalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoModalPlayer: {
    width: '100%',
    height: height * 0.55,
  },
  videoModalBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 28,
    paddingBottom: 36,
    paddingHorizontal: 20,
  },
  videoModalHint: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    fontFamily: 'ManropeRegular',
  },
  thumbVideoLabel: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#A0143E',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  thumbVideoLabelText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '800',
    fontFamily: 'ManropeRegular',
  },
  heroContainer: {
    height: 420,
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor:
      'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  premiumBadge: {
    position: 'absolute',
    top: 18,
    left: 18,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },

  premiumText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'ManropeRegular',
  },
  heroVideo: {
    width,
    height: 420,
  },
  hallName: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '800',
  },

  heroContent: {
    position: 'absolute',
    bottom: 28,
    left: 20,
    right: 20,
  },

  locationText: {
    color: '#ddd',
    marginTop: 8,
    fontSize: 14,
  },

  section: {
    marginTop: 28,
    paddingHorizontal: 16,
  },
  galleryImage: {
    width: width - 32,
    height: 260,
    borderRadius: 24,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  orangeText: {
    color: '#FD813B',
    fontWeight: '700',
  },

  videoCard: {
    width: 220,
    marginRight: 14,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#111',
  },

  videoThumbnail: {
    width: '100%',
    height: 260,
  },

  videoOverlay: {
    position: 'absolute',
    width: '100%',
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
  },

  smallPlayButton: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor:
      'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  videoBottom: {
    padding: 14,
  },

  videoTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  videoDuration: {
    color: '#999',
    marginTop: 5,
    fontSize: 12,
  },

  description: {
    color: '#555',
    lineHeight: 24,
    fontSize: 15,
  },

  pricingCard: {
    marginHorizontal: 16,
    marginTop: 28,
    backgroundColor: '#111',
    borderRadius: 26,
    padding: 22,
  },

  priceLabel: {
    color: '#999',
    fontSize: 15,
  },

  priceValue: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },

  advanceValue: {
    color: '#FD813B',
    fontSize: 22,
    fontWeight: '800',
  },

  menuTypeStyle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#121212',
    fontFamily: 'ManropeRegular',
  },
  menuPriceStyle: {
    fontSize: 16,
    color: '#FD813B',
    fontWeight: '800',
    fontFamily: 'ManropeRegular',
    textAlign: 'right',
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  text: { fontSize: 12, textAlign: 'center' },
  title: {
    fontFamily: 'ManropeRegular',
    fontSize: 14,
    color: "#121212",
    fontWeight: "700",
  },
  subTitle: { fontSize: 14, color: "#5a5c5a", fontWeight: "400", },
  status: {
    fontSize: 10,
    color: 'gray',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 8,
  },
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minHeight: 88,
    marginHorizontal: 4,
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#EADFD7',
    borderRadius: 12,
    backgroundColor: '#FAF6F3',
  },
  itemText: {
    fontSize: 9.5,
    lineHeight: 13,
    fontWeight: '600',
    color: '#5F544E',
    fontFamily: 'ManropeRegular',
    marginTop: 7,
    textAlign: 'center',
  },
  timeSlotText: {
    fontSize: 13,
    color: "#666666",
    fontWeight: "500",
    fontFamily: 'ManropeRegular',
  },
  calendarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(2),
  },
  zoomIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: 5,
    borderRadius: 15,
  },
  // ── QUICK STATS BAR ──
  quickStatsBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFDFC',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E8D9CF',
    elevation: 2,
    shadowColor: '#FD813B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  quickStatItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  quickStatValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#121212',
    fontFamily: 'ManropeRegular',
    marginTop: 4,
    textAlign: 'center',
  },
  quickStatLabel: {
    fontSize: 10,
    color: '#939393',
    fontFamily: 'ManropeRegular',
    fontWeight: '400',
  },
  quickStatDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#F5E7B6',
    alignSelf: 'center',
  },
  // ── VERIFIED BADGE ──
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,156,77,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#009C4D',
    fontFamily: 'ManropeRegular',
  },
  // ── PRICING HIGHLIGHT CARD ──
  pricingHighlightCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E9',
    borderRadius: 14,
    padding: 16,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#EAC8B2',
    alignItems: 'center',
  },
  pricingHighlightLabel: {
    fontSize: 11,
    color: '#939393',
    fontFamily: 'ManropeRegular',
    fontWeight: '400',
  },
  pricingHighlightValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FD813B',
    fontFamily: 'ManropeRegular',
    marginTop: 2,
  },
  pricingAdvanceBox: {
    backgroundColor: '#FFF5EE',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFEAC1',
  },
  pricingAdvanceLabel: {
    fontSize: 10,
    color: '#939393',
    fontFamily: 'ManropeRegular',
  },
  pricingAdvanceValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#DF6E12',
    fontFamily: 'ManropeRegular',
    marginTop: 2,
  },

  includedGuestsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#EAF5EC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
    marginRight: 8,
  },

  includedGuestsLabel: {
    flexShrink: 1,
    marginLeft: 6,
    color: '#2F653B',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'ManropeRegular',
  },
  // ── AREA CHIP ──
  areaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5EE',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 8,
    gap: 5,
  },
  areaChipText: {
    fontSize: 12,
    color: '#FD813B',
    fontWeight: '600',
    fontFamily: 'ManropeRegular',
  },
  // ── BOOKING SUMMARY CARD ──
  summaryCard: {
    backgroundColor: '#FFFDFC',
    borderRadius: 16,
    padding: 18,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E8D9CF',
  },
  summaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  summaryCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#121212',
    fontFamily: 'ManropeRegular',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#F5E7B6',
    marginVertical: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  summaryRowLabel: {
    fontSize: 13,
    color: '#606060',
    fontFamily: 'ManropeRegular',
    fontWeight: '600',
  },
  summaryRowValue: {
    fontSize: 13,
    color: '#121212',
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
  },
  summaryTotalValue: {
    fontSize: 18,
    color: '#FD813B',
    fontFamily: 'ManropeRegular',
    fontWeight: '800',
  },
  off: {
    fontSize: 13,
    color: "#ed890e",
    fontWeight: "bold"
  },
  strickedoffer: {
    fontSize: 12,
    color: "#ed890e",
    fontWeight: "400",
    marginLeft: 7,
    textDecorationLine: 'line-through'
  },
  card: {
    margin: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  listcard: {
    marginTop: 10,
    width: "90%",
    borderRadius: 20,
    alignSelf: "center",
    alignItems: "center"
  },
  image: {
    width: '100%',
    height: "95%",
    resizeMode: 'cover',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },
});

export default ViewEvents;