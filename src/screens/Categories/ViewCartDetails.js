import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, BackHandler, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import EditButton from '../../assets/svgs/categories/editButton.svg';
import CalendarIcon from '../../assets/svgs/calendarOrangeIcon.svg';
import CartBanner from '../../assets/svgs/cartBanner.svg';
import ExclamationIcon from '../../assets/svgs/exclamationmark.svg';
import Modal from 'react-native-modal';
import themevariable from '../../utils/themevariable';
import LeftArrow from '../../assets/svgs/leftarrowWhite.svg';
import BASE_URL, { LocalHostUrl } from '../../apiconfig';
import axios from 'axios';
import { formatAmount } from '../../utils/GlobalFunctions';
import moment from 'moment';
import { getUserAuthToken } from '../../utils/StoreAuthToken';

const BookingDetailsScreen = ({ navigation, route }) => {



  const [thankyouCardVisible, setThankYouCardVisible] = useState(false);
  const [productDetails, setProductDetails] = useState();
  const [productImage, setProductImage] = useState();


  const { catId, NumOfDays, isDayOrMonthly, startDate, endDate, monthlyPrice } = route.params;
  console.log("RECIED PARMS::::::::, ", catId, NumOfDays, isDayOrMonthly, startDate, endDate)


  useEffect(() => {
    getSelectedProductDetails();
  }, []);

  const getSelectedProductDetails = async () => {
    console.log("IAM CALLING INSIDE CART")
    const token = await getUserAuthToken();
    try {
      const response = await axios.get(`${BASE_URL}/getClothJewelsById/${catId}`,{
        headers: {
            Authorization: `Bearer ${token}`,
          },
    });
      console.log(" selected product::::::::::", JSON.stringify(response?.data));
      setProductDetails(response?.data);
      const updatedImgUrl = response?.data?.professionalImage?.url !== undefined ? response?.data?.professionalImage?.url.replace('localhost', LocalHostUrl) : response?.data?.professionalImage?.url;
      setProductImage(updatedImgUrl);
    } catch (error) {
      console.log("categories::::::::::", error);
    }
  }

  // useEffect(() => {
  //   const backAction = () => {
  //     navigation.pop(2)
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );

  //   return () => backHandler.remove();
  // }, []);

  const formatDateRange = (startDate, endDate) => {
    const start = moment(startDate).format('DD MMM');
    const end = moment(endDate).format('DD MMM YYYY');
    return `${start} - ${end}`;
  };

  const calculateTotalPrice = () => {
    if (isDayOrMonthly === 'daily') {
      const days = NumOfDays || 0;
      const rentPricePerDay = productDetails?.rentPricePerDay || 0;
      return days * rentPricePerDay;
    } else {
      return monthlyPrice;
    }
  };

  const ConfirmBooking = async () => {
    const token = await getUserAuthToken();
    const payload = {
      productId: catId,
      startDate: moment(startDate).format('DD MMMM YYYY'),
      endDate: moment(endDate).format('DD MMMM YYYY'),
      numOfDays: NumOfDays,
      totalAmount: calculateTotalPrice()
    }
    try {
      const bookingResponse = await axios.post(`${BASE_URL}/create-cloth-jewel-booking`, payload,{
        headers: {
            Authorization: `Bearer ${token}`,
          },
    });
      if (bookingResponse?.status === 201) {
        setThankYouCardVisible(true)
      }
    } catch (error) {
      console.error("Error during booking:", error);
    }
  }

  console.log("product iamge :::::::", productImage)
  return (
    <ScrollView style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", }}>
        <TouchableOpacity onPress={() => navigation.pop(2)}>
          <LeftArrow style={{ marginTop: 3, marginHorizontal: 50 }} />
        </TouchableOpacity>

      </View>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: "#202020" }]}>Shipping Address</Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.address}>26, Duong So 2, Thao Dien Ward, An Phu, District 2, Ho Chi Minh city</Text>
          <EditButton />
        </View>
      </View>

      <View style={[styles.imgsection]}>
        <View style={styles.productContainer}>
          <Image source={{ uri: productImage }} style={styles.productImage} resizeMode='cover' />
          <View style={styles.productDetails}>
            <Text style={styles.productTitle}>{productDetails?.productName}</Text>
            <Text style={styles.productSubTitle}>Pink,{productDetails?.professionalImage?.size}</Text>
            <Text style={styles.productPrice}>{formatAmount(productDetails?.rentPricePerDay)}<Text style={styles.productPriceperDay}>/day</Text></Text>
            <View style={styles.dateContainer}>
              <CalendarIcon />
              {/* <Icon name="calendar-outline" size={14} color="#FFB156" /> */}
              <Text style={styles.dateText}>{formatDateRange(startDate, endDate)}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.Pricesection}>
        <Text style={[styles.sectionTitle, { color: "#202020" }]}>Price Details</Text>
        <View style={styles.priceDetailRow}>
          <Text style={styles.priceDetailLabel}>Rent / Day</Text>
          <Text style={styles.priceDetailValue}>{formatAmount(productDetails?.rentPricePerDay)}</Text>
        </View>
        <View style={{ width: "100%", borderColor: "#D8D8D8", borderWidth: 0.5, marginBottom: 5 }} />
        <View style={styles.priceDetailRow}>
          <Text style={styles.priceDetailLabel}>No. rental days</Text>
          <Text style={styles.priceDetailValue}>{isDayOrMonthly === 'daily' ? NumOfDays : 30} days</Text>
        </View>
        <View style={styles.priceDetailRow}>
          <Text style={styles.priceDetailLabel}>Total rent to be paid</Text>
          <Text style={styles.priceDetailValue}>{formatAmount(calculateTotalPrice())}</Text>
        </View>
        <View style={styles.priceDetailRow}>
          <Text style={styles.priceDetailLabel}>Delivery charges</Text>
          <Text style={styles.priceDetailValue}>₹ 400</Text>
        </View>
        <View style={{ width: "100%", borderColor: "#D8D8D8", borderWidth: 0.5, marginBottom: 5 }} />
        <View style={styles.priceDetailRow}>
          <View style={{}}>
            <Text style={styles.priceDetailLabel}>Grand Total</Text>
            <Text style={styles.note}>*Inclusive of all taxes and GST</Text>
          </View>
          <Text style={styles.finalpriceDetailValue}>{formatAmount(calculateTotalPrice())}</Text>
        </View>
      </View>

      <View style={styles.confrimSection}>
        <Text style={styles.sectionTitle}>Confirm Your Booking</Text>
        <View style={{ borderColor: "#FD813B", borderWidth: 1.5, marginTop: 10, marginHorizontal: 25 }} />

        <View style={{ backgroundColor: "white", borderRadius: 10, elevation: 3, paddingHorizontal: 5 }}>
          <View style={styles.priceDetailRow}>
            <Text style={styles.priceDetailLabel}>Security deposit</Text>
            <Text style={styles.priceDetailValue}>₹ 200</Text>
          </View>
          <View style={styles.priceDetailRow}>
            <Text style={styles.priceDetailLabel}>Platform charges</Text>
            <Text style={styles.priceDetailValue}>₹ 100</Text>
          </View>
          <View style={{ width: "90%", borderColor: "#D8D8D8", borderWidth: 0.5, marginVertical: 5, alignSelf: "center" }} />
          <View style={styles.priceDetailRow}>
            <Text style={styles.priceDetailLabel}>Total Deposit</Text>
            <Text style={styles.priceDetailValue}>₹ 300</Text>
          </View>
        </View>
      </View>

      {/* <Image source={require('../../assets/cartBanner/cartBanner.png')}/> */}
      <CartBanner style={{ alignSelf: "center", marginTop: 20 }} />


      <View style={styles.footer}>
        <View style={styles.footerNoteView}>
          <ExclamationIcon />
          <Text style={styles.footerNote} >Security Deposit confirms your order 90%</Text>
        </View>
        <View style={styles.footerButtons}>
          <TouchableOpacity style={[styles.button, { width: "35%" }]}>
            <Text style={styles.buttonText}>Pay Later</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => ConfirmBooking()} style={[styles.button, { width: "60%", marginLeft: 10, backgroundColor: "#D2453B" }]}>
            <Text style={[styles.buttonText, { color: "white" }]}>Confirm Booking | {formatAmount(calculateTotalPrice())}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        isVisible={thankyouCardVisible}
        onBackdropPress={() => setThankYouCardVisible(false)}
        backdropOpacity={0.9}
        backdropColor={themevariable.Color_000000}
        hideModalContentWhileAnimating={true}
        animationOutTiming={500}
        backdropTransitionInTiming={500}
        backdropTransitionOutTiming={500}
        animationInTiming={500}
        style={{
          flex: 1,
          bottom: "10%"
        }}
        onBackButtonPress={() => {
          setThankYouCardVisible(false)
        }}
        animationOut={'slideOutDown'}
        animationType={'slideInUp'}
      >
        <View style={styles.Thankcontainer}>
          <LinearGradient colors={['#D2453B', '#A0153E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: "55%", padding: 4, }}>
            {/* <View style={{borderWidth:4, width:"50%", }}/> */}
          </LinearGradient>

          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              {/* <Image source={{ uri: 'thumbs_up_icon_url' }} style={styles.icon} /> */}

            </View>
          </View>
          <Text style={styles.title}>Thank You!</Text>
          <Text style={styles.subtitle}>Your Booking Initiated.</Text>
          <Text style={styles.description}>Our team will deliver the update to you in less than 2 hours</Text>
          <LinearGradient colors={['#D2453B', '#A0153E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.doneButton}>
            <TouchableOpacity onPress={() => setThankYouCardVisible(false)}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </LinearGradient>
          <TouchableOpacity>
            <Text style={styles.trackProgressText}>Track your Booking Progress</Text>
          </TouchableOpacity>
        </View>

      </Modal>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  section: {
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 8,
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 10
  },
  confrimSection: {
    marginHorizontal: 20,
    marginTop: 10
  },
  Pricesection: {
    marginBottom: 10,
    marginHorizontal: 20,
    marginTop: 15
  },
  imgsection: {
    backgroundColor: 'white',
    paddingHorizontal: 5,
    paddingVertical: 5,
    marginBottom: 8,
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 10,
    elevation: 1.5
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: "#FD813B",
    fontFamily: "ManropeRegular",
  },
  address: {
    fontSize: 14,
    fontWeight: "400",
    color: '#000000',
    fontFamily: "ManropeRegular",
    width: "90%"
  },
  editIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: Dimensions.get('window').width / 4,
    height: Dimensions.get('window').height / 6,
    borderRadius: 8,
    marginRight: 16,
  },
  productDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: "#100D25",
    fontFamily: "ManropeRegular",
  },
  productSubTitle: {
    fontSize: 14,
    color: '#000000',
    fontFamily: "ManropeRegular",
    fontWeight: "500",
    marginTop: 2,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#202020',
    fontFamily: "ManropeRegular",
    marginTop: 10,
  },
  productPriceperDay: {
    fontSize: 18,
    fontWeight: '400',
    color: '#202020',
    fontFamily: "ManropeRegular",
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 12,
    color: '#FE8235',
    fontWeight: "600",
    fontFamily: "ManropeRegular",

  },
  priceDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
    marginVertical: 5
  },
  priceDetailLabel: {
    fontSize: 15,
    color: '#000000',
    fontWeight: "400",
    fontFamily: "ManropeRegular",
  },
  priceDetailValue: {
    fontSize: 15,
    color: '#000000',
    fontWeight: "400",
    fontFamily: "ManropeRegular",
  },
  finalpriceDetailValue: {
    fontSize: 16,
    color: '#1A1E25',
    fontWeight: "800",
    fontFamily: "ManropeRegular",
  },
  note: {
    fontSize: 10,
    color: '##ADADAD',
    fontWeight: "400",
    fontFamily: "ManropeRegular",
  },
  bannerImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  bannerText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  bannerSubText: {
    fontSize: 12,
    color: '#7E7E7E',
  },
  footer: {
    backgroundColor: '#FFF',
    marginTop: 8,
    borderRadius: 8,
  },
  footerNoteView: {
    backgroundColor: "#FFF4CF",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 40
  },
  footerNote: {
    fontSize: 14,
    color: '#000105',
    backgroundColor: "#FFF4CF",
    fontWeight: "700",
    textAlign: "center",
    marginLeft: 10
  },
  footerButtons: {
    flexDirection: 'row',
    marginHorizontal: 20,
    paddingVertical: 15
  },
  button: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderColor: "#D2453B",
    borderWidth: 1,
  },
  payLaterButton: {

  },
  confirmBookingButton: {
    backgroundColor: '#D9534F',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#D2453B',
    fontFamily: "ManropeRegular",

  },
  Thankcontainer: {
    marginTop: 30,
    alignItems: 'center',
    backgroundColor: 'white',
    // paddingVertical: 50,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  iconContainer: {
    margin: 20
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  icon: {
    width: 40,
    height: 40,
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  title: {
    fontSize: 27,
    fontWeight: '800',
    marginBottom: 10,
    color: "#333333",
    fontFamily: "ManropeRegular",
    marginTop: 20
  },
  subtitle: {
    fontSize: 14,
    color: '#FF730D',
    fontWeight: "500",
    fontFamily: "ManropeRegular",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#677294',
    marginBottom: 20,
    fontWeight: "500",
    fontFamily: "ManropeRegular",
    marginHorizontal: 20
  },
  doneButton: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  doneButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  trackProgressText: {
    color: '#FF730D',
    textDecorationLine: 'underline',
    fontWeight: "400",
    fontFamily: "ManropeRegular",
    fontSize: 12,
    marginBottom: 30
  },
});

export default BookingDetailsScreen;
