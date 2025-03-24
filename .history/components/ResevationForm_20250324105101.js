import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Platform,
  Alert 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  updateName,
  updateEmail,
  updatePhoneNumber,
  updateGuests,
  updateDate,
  updateTime,
  submitReservation,
  resetReservation
} from '../redux/slices/resevationSlice';
import { ... } from '../redux/slices/resevationSlice';

const ReservationForm = ({ navigation }) => {
  const dispatch = useDispatch();
  const {
    name,
    email,
    phoneNumber,
    guests,
    date,
    time,
    isSubmitting,
    error,
    reservationSuccess
  } = useSelector((state) => state.reservation);

  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  const STANDARD_RESERVATION_AMOUNT = 200;

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date(date);
    setShowDatePicker(Platform.OS === 'ios');
    dispatch(updateDate(currentDate.toDateString()));
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || new Date(time);
    setShowTimePicker(Platform.OS === 'ios');
    dispatch(updateTime(currentTime.toLocaleTimeString()));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!name || !email || !phoneNumber || !guests) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Create reservation object
    const reservationData = {
      name,
      email,
      phoneNumber,
      guests: parseInt(guests),
      date,
      time
    };

    try {
      // Dispatch submission
      await dispatch(submitReservation(reservationData)).unwrap();
      
      // Navigate to payment screen with the standard amount
      navigation.navigate('PaymentScreen', {
        total: STANDARD_RESERVATION_AMOUNT,
        reservationData // Pass the reservation data in case needed in payment screen
      });
    } catch (err) {
      Alert.alert('Error', 'Failed to create reservation. Please try again.');
    }
  };

  // Handle submission error
  React.useEffect(() => {
    if (error) {
      Alert.alert('Submission Error', error);
    }
  }, [error]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Make a Reservation</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={(text) => dispatch(updateName(text))}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => dispatch(updateEmail(text))}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={(text) => dispatch(updatePhoneNumber(text))}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Number of Guests"
        keyboardType="numeric"
        value={guests}
        onChangeText={(text) => dispatch(updateGuests(text))}
      />
      
      {/* Date Picker */}
      <TouchableOpacity 
        style={styles.input} 
        onPress={() => setShowDatePicker(true)}
      >
        <Text>{date}</Text>
      </TouchableOpacity>
      
      {showDatePicker && (
        <DateTimePicker
          testID="datePicker"
          value={new Date(date)}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
        />
      )}
      
      {/* Time Picker */}
      <TouchableOpacity 
        style={styles.input} 
        onPress={() => setShowTimePicker(true)}
      >
        <Text>{time}</Text>
      </TouchableOpacity>
      
      {showTimePicker && (
        <DateTimePicker
          testID="timePicker"
          value={new Date(time)}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}
      
      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Submitting...' : 'Proceed to Payment (R200)'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: 'tomato',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default ReservationForm;