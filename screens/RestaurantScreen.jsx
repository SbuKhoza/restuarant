import React, { useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurants, selectRestaurant } from '../redux/slices/restuarantSlice';
import { useNavigation } from '@react-navigation/native';

const RestaurantScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  
  // Get restaurants and loading state from Redux store
  const { restaurants, isLoading, error } = useSelector((state) => state.restaurants);

  // Fetch restaurants when component mounts
  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  // Handle restaurant selection and navigation
  const handleSelectRestaurant = (restaurant) => {
    // Store the selected restaurant in Redux
    dispatch(selectRestaurant(restaurant));
    console.log('Selected restaurant:', restaurant);
    
    // Navigate to reservation form with all restaurant details
    navigation.navigate('Reserve', { 
      restaurant: restaurant,
      restaurantId: restaurant._id // Explicitly pass restaurantId for clarity
    });
  };

  // Render individual restaurant item
  const renderRestaurantItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.restaurantItem}
      onPress={() => handleSelectRestaurant(item)}
    >
      <View style={styles.restaurantDetails}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <Text style={styles.restaurantLocation}>{item.location}</Text>
        <Text style={styles.restaurantCuisine}>{item.cuisine}</Text>
        <TouchableOpacity 
          style={styles.reserveButton}
          onPress={() => handleSelectRestaurant(item)}
        >
          <Text style={styles.reserveButtonText}>Reserve Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Handle loading state
  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Restaurants...</Text>
      </View>
    );
  }

  // Handle error state
  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {restaurants.length === 0 ? (
        <Text style={styles.emptyText}>No restaurants found</Text>
      ) : (
        <FlatList
          data={restaurants}
          renderItem={renderRestaurantItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  restaurantItem: {
    backgroundColor: 'white',
    marginBottom: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 15,
  },
  restaurantDetails: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  restaurantLocation: {
    color: '#666',
    marginBottom: 4,
  },
  restaurantCuisine: {
    color: '#999',
    marginBottom: 10,
  },
  reserveButton: {
    backgroundColor: 'tomato',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  reserveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  }
});

export default RestaurantScreen;