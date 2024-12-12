import React, { useState } from 'react';
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
import DateTimePicker from '@react-native-community/datetimepicker';

const ReservationForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [guests, setGuests] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === 'ios');
    setTime(currentTime);
  };

  const submitReservation = () => {
    // Basic validation
    if (!name || !email || !phoneNumber || !guests) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Create reservation object
    const reservation = {
      name,
      email,
      phoneNumber,
      guests: parseInt(guests),
      date: date.toDateString(),
      time: time.toLocaleTimeString()
    };

    // Here you would typically send the reservation to a backend service
    Alert.alert('Reservation Submitted', JSON.stringify(reservation, null, 2));

    // Reset form
    setName('');
    setEmail('');
    setPhoneNumber('');
    setGuests('');
    setDate(new Date());
    setTime(new Date());
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Make a Reservation</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Number of Guests"
        keyboardType="numeric"
        value={guests}
        onChangeText={setGuests}
      />
      
      {/* Date Picker */}
      <TouchableOpacity 
        style={styles.input} 
        onPress={() => setShowDatePicker(true)}
      >
        <Text>{date.toLocaleDateString()}</Text>
      </TouchableOpacity>
      
      {showDatePicker && (
        <DateTimePicker
          testID="datePicker"
          value={date}
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
        <Text>{time.toLocaleTimeString()}</Text>
      </TouchableOpacity>
      
      {showTimePicker && (
        <DateTimePicker
          testID="timePicker"
          value={time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}
      
      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={submitReservation}
      >
        <Text style={styles.submitButtonText}>Submit Reservation</Text>
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