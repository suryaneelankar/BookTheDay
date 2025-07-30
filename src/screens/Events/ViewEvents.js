import React, { useEffect, useState } from "react";
import { Alert, Text, View, Image, TextInput, Linking, StyleSheet, Dimensions, ScrollView, Button, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import axios from "axios";
import BASE_URL, { LocalHostUrl } from "../../apiconfig";
import { verticalScale } from "../../utils/scalingMetrics";
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import MapMarkIcon from '../../assets/svgs/orangeMapMark.svg';
import CalendarIcon from '../../assets/svgs/calendarOrangeIcon.svg';
import Modal from 'react-native-modal';
import themevariable from "../../utils/themevariable";
import LeftArrow from '../../assets/svgs/leftarrowWhite.svg';
import BookDatesButton from "../../components/GradientButton";
import ServiceTime from '../../assets/svgs/serviceTime.svg';
import VegNonVegIcon from '../../assets/svgs/foodtype/vegNonveg.svg';
import VegIcon from '../../assets/svgs/foodtype/veg.svg';
import NonVegIcon from '../../assets/svgs/foodtype/NonVeg.svg';
import { getUserAuthToken } from "../../utils/StoreAuthToken";
import CustomModal from "../../components/AlertModal";
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import ZoomImage from "../../components/ZoomImage";
import ZoomIcon from 'react-native-vector-icons/MaterialIcons';

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

  const [isCameraZoomImageModalVisible, setIsCameraZoomImageModalVisible] = useState(false);
  const [isMenuImageModalVisible, setIsMenuImageModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [menuImageCurrentIndex, setMenuImageCurrentIndex] = useState(0);
  const [menuQuantities, setMenuQuantities] = useState({});
  const [loading, setLoading] = useState(false);

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

  const handleQuantityChange = (menuType, value) => {
    if (/^\d*$/.test(value)) {
      setMenuQuantities(prev => ({
        ...prev,
        [menuType]: value
      }));
    }
  };

  const getMenuTypeTotal = (menuType) => {
    const qty = parseInt(menuQuantities[menuType] || '0', 10);
    const menu = menuImages.find(img => img.menuType === menuType);
    const price = menu ? parseInt(menu.menuPrice || '0', 10) : 0;
    return qty * price;
  };


  const menuTypes = [...new Set((menuImages || []).map(img => img.menuType))];
  const totalAmountWithMenu = menuTypes.reduce((sum, type) => {
    return sum + getMenuTypeTotal(type);
  }, 0);


  // Calculate total amount for all menu types
  const totalAdvacneAmountAfterPercentageCalculation = (totalAmountWithMenu * eventsDetails?.advanceAmountInPercentageForMenu) / 100;

  const CateringMenuSection = () => {

    if (menuImages.length === 0) return null;

    return (
      <View style={styles.menuContainer}>
        <Text style={{ fontSize: 16, color: "#100D25", fontWeight: "700", fontFamily: 'ManropeRegular', marginBottom: 12 }}>In House Catering Menu</Text>
        <FlatList
          data={menuImages}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => [setMenuImageCurrentIndex(index), setIsMenuImageModalVisible(true)]}
              style={[{ height: 310, width: Dimensions.get("window").width }]}
            >
              <View style={styles.menuCard}>
                <Image
                  source={{
                    uri: item.url,
                    // headers: { Authorization: `Bearer ${getUserAuth}` }
                  }}
                  resizeMethod="auto"
                  resizeMode="cover"
                  style={styles.menuImageStyle}
                />
                <View style={{
                  padding: 8,
                  justifyContent: "space-between",
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  borderWidth: 1,
                  borderColor: '#E0E0E0', borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  marginRight: 39,
                }}>
                  <View style={{
                    justifyContent: "space-between",
                    flexDirection: "row"
                  }}>

                    <Text style={styles.menuTypeStyle}>{item.menuType}</Text>
                    <Text style={styles.menuPriceStyle}>₹ {item.menuPrice}/-</Text>
                  </View>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: '#FD813B',
                      borderRadius: 5,
                      padding: 8,
                      marginTop: 8,
                    }}
                    placeholderTextColor={"#939393"}
                    placeholder="Enter number of plates"
                    keyboardType="numeric"
                    value={menuQuantities[item.menuType] || ''}
                    onChangeText={value => handleQuantityChange(item.menuType, value)}
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

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

      console.log("events resp details::::::::::", JSON.stringify(response?.data));

      const professionalImageUrl = response?.data?.professionalImage?.url;

      const imageUrls = [
        professionalImageUrl, // Add professional image as the first image
        ...response?.data?.additionalImages.flat().map(image => image?.url)
      ];

      setSubImages(imageUrls);

      const menuImagesArr = response?.data?.menuImages
        ?.flat()
        .map(image => ({
          url: image?.url,
          menuType: image?.menuType,
          menuPrice: image?.menuPrice,
        }));
      setMenuImages(menuImagesArr);
      // console.log("hall amenities", JSON.stringify(response?.data))
      const amenities = response?.data?.hallAmenities[0]?.split(',').map((item, index) => ({
        id: (index + 1).toString(),
        name: item.trim()
      }));
      setAmenitiesData(amenities);

    } catch (error) {
      console.log("events error::::::::::", error);

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

  const rows = chunkArray(amenitiesData, 4); // Split data into rows of 4 items

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
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView style={{ backgroundColor: "white", marginBottom: 30 }}>
        <View style={styles.container}>
          <SwiperFlatList
            index={0}
            paginationDefaultColor='white'
            paginationActiveColor='white'
            showPagination={true}
            paginationStyle={{ bottom: 15 }}
            paginationStyleItem={{ alignSelf: 'center' }}
            paginationStyleItemInactive={{ width: 7, height: 7 }}
            paginationStyleItemActive={{ width: 12, height: 12 }}
            data={subImages}
            style={{ flex: 1, alignSelf: "center", }}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => [setCurrentIndex(index), setIsCameraZoomImageModalVisible(true)]}
                style={[{ width: Dimensions.get('window').width, height: 300 }]}>
                <Image source={{
                  uri: item,
                  // headers: { Authorization: `Bearer ${getUserAuth}` }
                }} style={styles.image}
                  resizeMethod="auto"
                  resizeMode="cover"
                />
                <View style={styles.zoomIconContainer}>
                  <ZoomIcon name="zoom-out-map" size={28} />
                </View>
              </TouchableOpacity>
            )}
          />
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


        <View style={{ flex: 1, marginTop: 10, marginHorizontal: 20 }}>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 20, color: "#100D25", fontWeight: "700", fontFamily: 'ManropeRegular', width: "55%" }}>{eventsDetails?.functionHallName}</Text>
            <Text style={{ color: "#FD813B", fontSize: 18, fontWeight: "700", fontFamily: 'ManropeRegular' }}>
              {menuImages?.length > 0
                ? 'Menu based'
                : <>
                  {formatAmount(eventsDetails?.rentPricePerDay)}
                  <Text style={{ fontWeight: "400", fontFamily: 'ManropeRegular' }}>/day</Text>
                </>
              }
            </Text>
          </View>

          <View style={{ flexDirection: "row", marginTop: 15, alignItems: "flex-start" }}>
            <MapMarkIcon style={{ marginTop: 2 }} />
            <Text style={{ color: "#939393", fontSize: 12, fontWeight: "400", fontFamily: 'ManropeRegular', marginLeft: 5 }}>{eventsDetails?.functionHallAddress?.address}</Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10, alignItems: "center" }}>
            <TouchableOpacity onPress={showAlert}>
              <Text style={{ color: "#FD813B", fontSize: 12, fontWeight: "400", textDecorationLine: "underline", fontFamily: 'ManropeRegular', marginLeft: 5 }}>
                Street View
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
            < View style={{}}>
              <Text style={{ fontSize: 14, color: "#100D25", fontWeight: "700", fontFamily: 'ManropeRegular' }}>Food Type Allowed</Text>
              <Text style={{ marginTop: 10 }}>{eventsDetails?.foodType == 'Both' ? <VegNonVegIcon /> : eventsDetails?.foodType == 'veg' ? <VegIcon /> : <NonVegIcon />}</Text>
            </View>
            <View style={{ backgroundColor: "#FEF7DE", height: 25 }}>
              <Text style={{ marginTop: 3, color: "#FD813B", fontSize: 14, fontWeight: "700", fontFamily: 'ManropeRegular', paddingHorizontal: 10, borderRadius: 5 }}> {eventsDetails?.seatingCapacity} pax</Text>
            </View>
          </View>

          <View style={{ marginTop: 20, marginBottom: 10 }}>
            <Text style={styles.title}>Description:</Text>
            <Text style={{ fontFamily: 'ManropeRegular', fontSize: 12, color: "#8B8B8B", fontWeight: "400", marginTop: 4, marginBottom: 10 }}>{HallDescription}</Text>
            <Text style={{ fontFamily: 'ManropeRegular', fontSize: 12, color: "#FD813B", fontWeight: "400", marginTop: 4 }}>{eventsDetails?.description}</Text>
            <Text style={{ fontFamily: 'ManropeRegular', fontSize: 12, color: "#FD813B", fontWeight: "400", marginTop: 4 }}>{eventsDetails?.functionHallAreaInSft? `* Hall Area: ${eventsDetails?.functionHallAreaInSft} Sqft` : ''}</Text>
          </View>
          {menuImages?.length > 0 && (
            CateringMenuSection()
          )}

          <View style={{ borderColor: "#F1F1F1", borderWidth: 1, width: "100%", marginTop: 5 }} />

          <View style={{ marginTop: 20 }}>
            <Text style={{ fontWeight: "700", color: "#121212", fontSize: 16, fontFamily: 'ManropeRegular' }}>Hall Amenities</Text>
            <FlatList
              data={rows}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderHallAmenities}
              contentContainerStyle={{ marginTop: 15 }}
            />

          </View>

          {renderCalendar()}
          <Text style={{ marginTop: 20, fontWeight: "700", color: "#121212", fontSize: 16, fontFamily: 'ManropeRegular' }}>Select Booking Details</Text>
          <View style={{ marginTop: 15 }}>
            <Text style={{ fontWeight: "600", color: "#121212", fontSize: 14, fontFamily: 'ManropeRegular' }}>Booking Date</Text>

            <TouchableOpacity style={{
              marginTop: 10, flexDirection: "row",
              alignItems: "center", justifyContent: "space-between",
              borderWidth: 1, borderColor: "#FD813B", borderRadius: 4,
              paddingHorizontal: 20, paddingVertical: 12
            }} onPress={() => setIsVisible(true)}>
              <Text style={{ fontSize: 13, fontFamily: 'ManropeRegular', fontWeight: "400", color: selectedDate ? "#121212" : "#8B8B8B", }}>{selectedDate ? moment(selectedDate).format('DD-MM-YYYY') : 'Pick A Date'}</Text>
              <CalendarIcon />
            </TouchableOpacity>

            <Text style={{ marginTop: 20, fontWeight: "600", color: "#121212", fontSize: 14, fontFamily: 'ManropeRegular' }}>Booking Time</Text>

            <TouchableOpacity style={{
              marginTop: 10, flexDirection: "row",
              alignItems: "center", justifyContent: "space-between",
              borderWidth: 1, borderColor: "#FD813B", borderRadius: 4,
              paddingHorizontal: 20, paddingVertical: 12
            }} onPress={() => setTimeSlotModalVisible(true)}>
              <Text style={{ fontSize: 13, fontFamily: 'ManropeRegular', fontWeight: "400", color: selectedDate ? "#121212" : "#8B8B8B", }}>{selectedTimeSlot ? selectedTimeSlot : 'Pick A Time'}</Text>
              <ServiceTime />
            </TouchableOpacity>
          </View>

          <View>
            <Text style={{ marginTop: 20, fontWeight: "900", color: "#121212", fontSize: 18, fontFamily: 'ManropeRegular' }}>Booking Summary</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>

            <Text style={[styles.title, { marginTop: 10 }]}>Total Days :</Text>
            <Text style={[styles.title, { marginTop: 10, fontWeight: "600", }]}>{noOfDays > 1 ? `${noOfDays} days` : '1 day'}</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, }}>
            <Text style={[styles.title, { marginTop: 10 }]}>{menuImages?.length > 0 ? 'Advance Amount Percentage % :' : 'Advance Amount :'}</Text>
            <Text style={[styles.title, { marginTop: 10, fontWeight: "600" }]}>{menuImages?.length > 0 ? `${eventsDetails?.advanceAmountInPercentageForMenu} %` : formatAmount(eventsDetails?.advanceAmount)}</Text>
          </View>

          {menuImages?.length > 0 && (Number(totalAdvacneAmountAfterPercentageCalculation)) > 0 ?
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <View>
                <Text style={[styles.title, { marginTop: 10 }]}>Advacne Payable :</Text>
                <Text style={[styles.title, { marginTop: 10 }]}>{`${eventsDetails?.advanceAmountInPercentageForMenu}% of Total Amount`}</Text>
              </View>
              <Text style={[styles.title, { marginTop: 10, fontWeight: "600" }]}>
                {formatAmount(Number(totalAdvacneAmountAfterPercentageCalculation) || 0)}
              </Text>
            </View>
            : null}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: "20%" }}>
            {(totalAmountWithMenu > 0 || eventsDetails?.rentPricePerDay > 0) ?
              <>
                <Text style={[styles.title, { marginTop: 10 }]}>Total Price :</Text>
                <Text style={[styles.title, { marginTop: 10, fontWeight: "600" }]}>
                  {menuImages?.length > 0
                    ? formatAmount(totalAmountWithMenu > 0 ? totalAmountWithMenu : 0)
                    : formatAmount(eventsDetails?.rentPricePerDay || 0)}
                </Text>
              </>
              : null}

          </View>


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
              color: "#666666"
            }}>Select Time Slot</Text>
            <FlatList
              data={timeSlots}
              numColumns={3}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    padding: 10,
                    paddingHorizontal: 10,
                    paddingVertical: 15,
                    borderRadius: 10,
                    borderColor: "pink",
                    borderWidth: 1,
                    marginHorizontal: 10,
                    marginVertical: 5
                  }}
                  onPress={() => handleTimeSlotSelection(item)}
                >
                  <Text style={styles.timeSlotText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>

        <CustomModal
          visible={modalVisible}
          message={modalMessage}
          onClose={() => setModalVisible(false)}
        />
      </ScrollView>
      {console.log('totalAdvacneAmountAfterPercentageCalculation is ::>>', totalAdvacneAmountAfterPercentageCalculation)}
      <View style={{ flex: 1, bottom: 0, position: "absolute" }}>
        <BookDatesButton

          onPress={() => {
            const selectedMenus = menuImages
            .map(menu => {
              const qty = parseInt(menuQuantities[menu.menuType] || '0', 10);
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
            console.log("selectedMenus are::>>", selectedMenus);
            if (menuImages?.length > 0 && totalAdvacneAmountAfterPercentageCalculation == 0) {
              setModalMessage("Select number of plates you need to place the order");
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
              setModalMessage("Please select the Dates");
              setModalVisible(true);
            } else if (!selectedTimeSlot) {
              setModalMessage("Please select the Time Slot");
              setModalVisible(true);
            }
          }}
          text={menuImages?.length > 0 ? `${formatAmount(Number(totalAdvacneAmountAfterPercentageCalculation) || 0)} View Cart` : `${formatAmount(eventsDetails?.advanceAmount)} View Cart`}
          padding={10}
        />
      </View>
    </View>
  )
};


const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center', backgroundColor: "yellow",
    height: 200, // Adjust the height as needed
  },
  container: { flex: 1, backgroundColor: 'white' },
  menuContainer: {
    marginTop: 8,
    width: Dimensions.get("window").width,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // borderWidth: 1,
    // borderColor: '#E0E0E0',
    // overflow: 'hidden',
    // elevation: 2,
    // width: Dimensions.get("window").width - 20,
    // alignSelf: 'center',
    // alignItems: 'center',
  },
  menuImageStyle: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: "90%",
    height: 200,
    // padding: 16,
    resizeMode: 'cover',
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
    // justifyContent: 'space-between',
    alignItems: "center",
    marginTop: 5,
    justifyContent: "flex-start"
  },
  itemContainer: {
    alignItems: 'center',
    width: Dimensions.get('window').width / 5,
    marginRight: 10
  },
  itemText: {
    fontSize: 10,
    fontWeight: "400",
    color: "#606060",
    fontFamily: 'ManropeRegular',
    marginTop: 5,
    height: 30,
    textAlign: "center"

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