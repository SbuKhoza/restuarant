import React, { useEffect, useState } from 'react';
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
} from '../redux/slices/reservationSlice';

const ReservationForm = ({ navigation, route }) => {
  const dispatch = useDispatch();
  
  // Extract restaurant ID from various possible sources
  const routeRestaurantId = route?.params?.restaurantId || 
                         route?.params?.restaurant?._id ||
                         route?.params?.restaurant?.id;
                         
  // Get the selected restaurant from Redux store
  const selectedRestaurantFromStore = useSelector(state => 
    state.restaurants?.selectedRestaurant
  );
  
  // Get restaurant details from route params or Redux store
  const restaurantFromRoute = route?.params?.restaurant;
  const restaurantDetails = restaurantFromRoute || selectedRestaurantFromStore;
  
  // Use restaurant ID from route params or from Redux store
  const [restaurantId, setRestaurantId] = useState(
    routeRestaurantId || 
    selectedRestaurantFromStore?._id
  );
  
  // Get reservation state from Redux
  const {
    name,
    email,
    phoneNumber,
    guests,
    date,
    time,
    isSubmitting,
    error,
    reservationSuccess,
    reservationId
  } = useSelector((state) => state.reservation);

  // Date/time picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const STANDARD_RESERVATION_AMOUNT = 200;

  // Update restaurantId if it changes in the Redux store
  useEffect(() => {
    if (!restaurantId && selectedRestaurantFromStore) {
      console.log('Setting restaurant ID from Redux store:', selectedRestaurantFromStore._id);
      setRestaurantId(selectedRestaurantFromStore._id);
    }
  }, [restaurantId, selectedRestaurantFromStore]);

  // Check if we have a valid restaurantId
  useEffect(() => {
    console.log('Current restaurantId:', restaurantId);
    console.log('Current restaurant details:', restaurantDetails);
    
    // If we're missing restaurantId after component mount, show an alert
    if (!restaurantId) {
      console.log('No restaurant ID found. Please select a restaurant first.');
    }
  }, [restaurantId, restaurantDetails]);

  // Navigate to payment screen after successful reservation
  useEffect(() => {
    if (reservationSuccess && reservationId) {
      console.log('Reservation created successfully with ID:', reservationId);
      
      const reservationDataForPayment = {
        id: reservationId,
        restaurantId: restaurantId,
        name,
        email,
        phoneNumber,
        guests: parseInt(guests),
        date,
        time
      };
      
      console.log('Navigating to payment with data:', reservationDataForPayment);
      
      navigation.navigate('PaymentScreen', {
        total: STANDARD_RESERVATION_AMOUNT,
        reservationData: reservationDataForPayment
      });
    }
  }, [reservationSuccess, reservationId]);

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

    if (!restaurantId) {
      Alert.alert('Error', 'No restaurant selected. Please select a restaurant first.');
      return;
    }

    // Create reservation object
    const reservationData = {
      restaurantId: restaurantId,
      name,
      email,
      phoneNumber,
      guests: parseInt(guests),
      date,
      time
    };

    console.log('Submitting reservation data:', reservationData);

    try {
      await dispatch(submitReservation(reservationData)).unwrap();
    } catch (err) {
      console.error('Reservation submission error:', err);
      Alert.alert('Error', err.message || 'Failed to create reservation. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Make a Reservation</Text>
      
      {/* Restaurant Details Card */}
      {restaurantDetails && (
        <View style={styles.restaurantCard}>
          <Text style={styles.restaurantTitle}>Restaurant Details</Text>
          <Text style={styles.restaurantName}>{restaurantDetails.name}</Text>
          <Text style={styles.restaurantInfo}>Location: {restaurantDetails.location}</Text>
          <Text style={styles.restaurantInfo}>Cuisine: {restaurantDetails.cuisine}</Text>
        </View>
      )}
      
      {/* Debug info - can be removed in production */}
      {/* <View style={styles.debugInfo}>
        <Text style={styles.debugText}>Debug Info:</Text>
        <Text>RestaurantId: {restaurantId || 'None'}</Text>
        <Text>Reservation Success: {reservationSuccess ? 'Yes' : 'No'}</Text>
        <Text>Reservation ID: {reservationId || 'None'}</Text>
      </View> */}
      
      {/* If no restaurantId, show a warning */}
      {!restaurantId && (
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>No restaurant selected. Please go back and select a restaurant first.</Text>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      )}
      
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
          minimumDate={new Date()} // Prevent past dates
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
        disabled={isSubmitting || !restaurantId}
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
  restaurantCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: 'tomato',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  restaurantTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  restaurantInfo: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
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
  },
  debugInfo: {
    backgroundColor: '#ffffe0',
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 15,
    borderRadius: 5,
  },
  debugText: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  warningContainer: {
    backgroundColor: '#ffebe6',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  warningText: {
    color: '#cc0000',
    marginBottom: 10,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#4682B4',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReservationForm;