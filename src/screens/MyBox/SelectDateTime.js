import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/FontAwesome';

const SelectDateTimeScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Select Date & Time</Text>
      </View>
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{ [selectedDate]: { selected: true, marked: true, selectedColor: 'red' } }}
          theme={{
            arrowColor: 'black',
            todayTextColor: 'red',
            selectedDayBackgroundColor: '#FFC107',
          }}
        />
      </View>
      <View style={styles.timePickerContainer}>
        <Text style={styles.timePickerLabel}>Select Time Slot</Text>
        <TouchableOpacity style={styles.timePicker} onPress={showTimePicker}>
          <Text style={styles.timePickerText}>
            {selectedTime ? selectedTime : 'Pick A Time'}
          </Text>
          {/* <Icon name="clock-o" size={20} color="#6A6A6A" /> */}
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="time"
          onConfirm={handleTimeConfirm}
          onCancel={() => setDatePickerVisibility(false)}
        />
      </View>
      <TouchableOpacity style={styles.submitButton}>
        <LinearGradient
          colors={['#FF7E5F', '#FD297B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  gradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SelectDateTimeScreen;
