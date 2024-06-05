import React, { useState, } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import LinearGradient from 'react-native-linear-gradient';
import BookDatesButton from '../../components/GradientButton';
import ClockIcon from '../../assets/svgs/clock.svg';
import { horizontalScale, moderateScale, verticalScale } from '../../utils/scalingMetrics';
import Modal from 'react-native-modal';
import themevariable from '../../utils/themevariable';
import LeftArrow from '../../assets/svgs/leftarrowWhite.svg';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const SelectDateTimeScreen = ({ route }) => {
  const { productNav } = route.params;
  console.log("product nav is:::::", productNav);
  const [selectedDate, setSelectedDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const navigation = useNavigation();
  const [thankyouCardVisible, setThankYouCardVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleDateConfirm = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setSelectedDate(formattedDate);
    setDatePickerVisibility(false);
  };

  const handleTimeConfirm = (time) => {
    const formattedTime = `${time.getHours()}:${time.getMinutes()}`;
    setSelectedTime(formattedTime);
    setDatePickerVisibility(false);
  };

  const showTimePicker = () => {
    setDatePickerVisibility(true);
  };

  const touchCoordinates = new Animated.Value(0);

  const callNavigation =() =>{
    navigation.navigate('BookingDetailsScreen')
  }

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        isVisible={isVisible}
        // onBackdropPress={() =>  navigation.goBack()}
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
        onBackButtonPress={() => {
          navigation.goBack()
        }}
        animationOut={'slideOutDown'}
        animationType={'slideInUp'}
      >
        <View style={{ flex: 1, }}>
          <View style={{ flexDirection: "row", alignItems: "center", }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <LeftArrow style={{ marginTop: 3, marginHorizontal: 50 }} />
            </TouchableOpacity>
            <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "800", fontFamily: "ManropeRegular", }}>Select Date & Time</Text>

          </View>

          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            headerStyle={{ backgroundColor: "#FDEEBC" }}
            // customHeaderTitle={}
            markedDates={{ [selectedDate]: { selected: true, marked: true, selectedColor: '#ED5065' } }}
            theme={{
              arrowColor: 'black',
              todayTextColor: '#ED5065',
              selectedDayBackgroundColor: '#FFC107',
            }}
            style={{ marginTop: 20, marginHorizontal: 25, borderRadius: 10 }}
          />

          <Animated.View
            style={{
              flex: 1,
              top: touchCoordinates,
              bottom: 0,
            }}>
            <View
              onStartShouldSetResponder={() => true}
              onResponderMove={e => {
                touchCoordinates.setValue(e.nativeEvent.pageY - 30);
              }}
              onResponderRelease={e => {
                if (e.nativeEvent.pageY > 500) {
                  setIsVisible(false)
                }
                Animated.spring(touchCoordinates, {
                  toValue: 0,
                  delay: 50,
                  useNativeDriver: false,
                }).start();
              }}
              >
              <View style={{
                alignSelf: 'center',
                backgroundColor: themevariable.Color_CCCCCC,
                height: verticalScale(5),
                width: horizontalScale(57),
                borderRadius: moderateScale(20),
                top: 80,
                position: 'absolute',
              }} />
            </View>
            <View style={{
              flex: 1,
              // borderRadius: moderateScale(10),
              borderTopLeftRadius: moderateScale(10),
              borderTopRightRadius: moderateScale(10),
              backgroundColor: themevariable.Color_FFFFFF,
              paddingHorizontal: horizontalScale(20),
              paddingVertical: verticalScale(20),
              width: "100%",
              bottom:0,
              position:'absolute',
              // marginTop: 100,
              shadowColor: '#000000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.17,
              shadowRadius: 2.54,
              alignSelf:'center',
              alignItems:'center',
              bottom:-20
              //  top: 0
            }}>
              <Text style={{ color: "#333333", fontSize: 16, fontWeight: "700", fontFamily: "ManropeRegular", }}>Select Time Slot</Text>
              <Text style={{ marginTop: 10, color: "#333333", fontSize: 16, fontWeight: "500", fontFamily: "ManropeRegular", }}>Preferred Time</Text>

                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginBottom: 40, marginTop: 10, padding: 10, borderRadius: 5, borderColor: '#CFD0D5', borderWidth: 1 }}>
                  <Text style={{ width: "90%", color: "#ABABAB", fontSize: 14, fontWeight: "400", fontFamily: "ManropeRegular", }}>Pick A Time</Text>
                  <ClockIcon />
                </TouchableOpacity>
              <BookDatesButton onPress={() => {
                if (productNav) {
                  callNavigation()
                } else {
                  setThankYouCardVisible(true);
                }
              }} 
               text={'Submit'} padding={10} />
            </View>


          </Animated.View>

        </View>

      </Modal>


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
          // bottom: "10%"
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
  header: {
    padding: 15,
    backgroundColor: '#2E2E2E',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  calendarContainer: {
    margin: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  timePickerContainer: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 15,
    borderRadius: 10,
  },
  timePickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timePicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  timePickerText: {
    color: '#6A6A6A',
  },
  submitButton: {
    margin: 15,
    borderRadius: 25,
    overflow: 'hidden',
  },
  // gradient: {
    // paddingVertical: 15,
    // paddingHorizontal: 30,
    // borderRadius: 25,
    // justifyContent: 'center',
    // alignItems: 'center',
  // },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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

export default SelectDateTimeScreen;
