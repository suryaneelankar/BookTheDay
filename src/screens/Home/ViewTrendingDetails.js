import React, { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, Dimensions, ScrollView, Modal, Button, TouchableOpacity } from "react-native";
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import axios from "axios";
import BASE_URL from "../../apiconfig";
import { verticalScale, moderateScale, horizontalScale } from "../../utils/scalingMetrics";
import { Calendar } from 'react-native-calendars';

const ViewTrendingDetails = ({ route }) => {
  const { width } = Dimensions.get('window');
  const [categoriesDetails, setCategoriesDetails] = useState([])
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [noOfDays, setNoOfDays] = useState();


  const { categoryId } = route.params;
  console.log("CATEID I::::::", categoryId)

  useEffect(() => {
    getCategoriesDetails();
  }, []);

  const getCategoriesDetails = async () => {
    console.log("IAM CALLING API")
    try {
      const response = await axios.get(`${BASE_URL}/getCategory/${categoryId}`);
      // console.log("categories details ::::::::::", response?.data?.data);
      setCategoriesDetails(response?.data?.data)
    } catch (error) {
      console.log("categories::::::::::", error);

    }
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

  const onDayPress = (day) => {
    if (!selectedStartDate || selectedEndDate) {
      setSelectedStartDate(day.dateString);
      setSelectedEndDate('');
    } else if (day.dateString < selectedStartDate) {
      setSelectedStartDate(day.dateString);
    } else {
      setSelectedEndDate(day.dateString);

      const startDate = new Date(selectedStartDate);
      const endDate = new Date(day.dateString);
      const diffInTime = endDate.getTime() - startDate.getTime();
      const diffInDays = diffInTime / (1000 * 3600 * 24);
      setNoOfDays(diffInDays)
      console.log('Number of days:', diffInDays);
    }
  };

  console.log("selected ates:::::::::", selectedStartDate, selectedEndDate)

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white", marginBottom: 40 }}>
      <View style={styles.container}>
        <SwiperFlatList
          // autoplay
          // autoplayDelay={2}
          // autoplayLoop
          index={0}
          showPagination={true}
          data={categoriesDetails?.categoryImages}
          style={{ flex: 1, alignSelf: "center", marginTop: 10 }}
          renderItem={({ item }) => (
            <View style={[{ width: Dimensions.get('window').width, justifyContent: 'center', height: 400 }]}>
              <Image source={{ uri: item }} style={styles.image}
                resizeMethod="auto"
                resizeMode="contain"
              />
            </View>
          )}
        />
      </View>
      <View style={{ flex: 1, marginTop: 30, marginHorizontal: 20 }}>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 16, color: "black", fontWeight: "600" }}>{categoriesDetails?.name}</Text>
          <Text style={{ fontSize: 16, color: "#6e6d6d", marginLeft: 5 }}>{categoriesDetails?.title}</Text>

        </View>

        <View style={styles.priceContainer}>
          <Text style={{
            fontSize: 12,
            color: "black",
            fontWeight: "200"
          }}>MRP</Text>
          <Text style={{ color: "black", fontSize: 12, fontWeight: "700" }}> ₹1000/day</Text>
          <Text style={styles.strickedoffer}>₹1800</Text>
          <Text style={styles.off}> (20% off) </Text>
        </View>

        <View style={{ marginTop: 20, flexDirection: "row", alignItems: "center", backgroundColor: "#e6fcfc", borderRadius: 10, justifyContent: "space-between" }}>
          <Image source={require('../../assets/offerIcon.png')}
            style={{ height: 50, width: 50, }}
          />
          <Text style={{ marginRight: 10 }}>5% Discount on First Order</Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
          <Text style={styles.title}>Size available :</Text>
          <Text style={styles.subTitle}>{categoriesDetails?.catType == 'cloth' ? ' XS  S  M  L' : 'Free Size'}</Text>
        </View>

        {renderCalendar()}
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity onPress={() => setCalendarVisible(true)}>
            <Text style={styles.title}>From Date: {selectedStartDate}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginTop: 10 }} onPress={() => setCalendarVisible(true)}>
            <Text style={styles.title}>To  Date: {selectedEndDate}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.title,{ marginTop:10}]}>Total Price : {noOfDays ? 1000 * noOfDays : 1000}</Text>
        <Text style={styles.title}>Extra Hrs Price :  20/Hr</Text>


        <View style={{ marginTop: 20 }}>
          <Text style={styles.title}>Description</Text>
          <Text style={{ fontSize: 14, color: "#5a5c5a", fontWeight: "400", marginTop: 10, marginBottom: 10 }}>{categoriesDetails?.description}</Text>
        </View>

        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 14, color: "black", fontWeight: "400", marginTop: 20, marginBottom: 10 }}>Product Details</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", margin: 5 }}>
            <Text style={styles.title}>Retail Price :</Text>
            <Text style={styles.subTitle}>100</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", margin: 5 }}>
            <Text style={styles.title}>Fit :</Text>
            <Text style={styles.subTitle}>regular</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", margin: 5 }}>
            <Text style={styles.title}>Inner Lining :</Text>
            <Text style={styles.subTitle}>yes</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", margin: 5 }}>
            <Text style={styles.title}>Stretchability :</Text>
            <Text style={styles.subTitle}>Yes</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", margin: 5 }}>
            <Text style={styles.title}>Thickness :</Text>
            <Text style={styles.subTitle}>Yes</Text>
          </View>
        </View>

      </View>

    </ScrollView>
  )
};


const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center', backgroundColor: "yellow",
    height: 200, // Adjust the height as needed
  },
  container: { flex: 1, backgroundColor: 'white' },
  text: { fontSize: 12, textAlign: 'center' },
  title: { fontSize: 14, color: "black", fontWeight: "400" },
  subTitle: { fontSize: 14, color: "#5a5c5a", fontWeight: "400", },
  status: {
    fontSize: 10,
    color: 'gray',
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
    marginTop: 10
  },
  off: {
    fontSize: 13,
    color: "#ed890e",
    fontWeight: "bold"
  },
  strickedoffer: {
    fontSize: 12,
    color: "black",
    fontWeight: "200",
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
});

export default ViewTrendingDetails;