import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ReservationForm = ({ route }) => {
  const { restaurant } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Make a Reservation</Text>
      <Text style={styles.restaurantName}>{restaurant.name}</Text>
      <ReservationFom/>

    </View>
  );
};
//
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  restaurantName: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default ReservationForm;