import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { useSelector } from 'react-redux';

const ReservationsScreen = () => {
  // Simulated reservations - in a real app, this would come from your backend/state management
  const [reservations, setReservations] = useState([
    {
      id: '1',
      name: 'Phumzile Ngwenya',
      guests: '2',
      date: '2024-03-15',
      time: '7:00 PM',
      status: 'Confirmed'
    },
    {
      id: '2',
      name: 'Sbuda Malloya',
      guests: '4',
      date: '2024-04-20',
      time: '6:30 PM',
      status: 'Pending'
    }
  ]);

  const handleCancelReservation = (reservationId) => {
    Alert.alert(
      'Cancel Reservation',
      'Are you sure you want to cancel this reservation?',
      [
        {
          text: 'No',
          style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: () => {
            // In a real app, this would be an API call
            setReservations(currentReservations => 
              currentReservations.filter(res => res.id !== reservationId)
            );
            Alert.alert('Reservation Cancelled', 'Your reservation has been cancelled.');
          }
        }
      ]
    );
  };

  const renderReservationItem = ({ item }) => (
    <View style={styles.reservationCard}>
      <View style={styles.reservationHeader}>
        <Text style={styles.reservationName}>{item.name}</Text>
        <Text 
          style={[
            styles.reservationStatus, 
            item.status === 'Confirmed' 
              ? styles.confirmedStatus 
              : styles.pendingStatus
          ]}
        >
          {item.status}
        </Text>
      </View>
      <View style={styles.reservationDetails}>
        <Text>Guests: {item.guests}</Text>
        <Text>Date: {item.date}</Text>
        <Text>Time: {item.time}</Text>
      </View>
      <TouchableOpacity 
        style={styles.cancelButton}
        onPress={() => handleCancelReservation(item.id)}
      >
        <Text style={styles.cancelButtonText}>Cancel Reservation</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Reservations</Text>
      
      {reservations.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No reservations found</Text>
        </View>
      ) : (
        <FlatList
          data={reservations}
          renderItem={renderReservationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.reservationList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  reservationList: {
    paddingBottom: 20
  },
  reservationCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  reservationName: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  reservationStatus: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5
  },
  confirmedStatus: {
    backgroundColor: '#e6f3e6',
    color: 'green'
  },
  pendingStatus: {
    backgroundColor: '#fff3e0',
    color: 'orange'
  },
  reservationDetails: {
    marginBottom: 10
  },
  cancelButton: {
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center'
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyStateText: {
    fontSize: 18,
    color: '#888'
  }
});

export default ReservationsScreen;