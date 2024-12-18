import React, { useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurants } from '../redux/slices/restuarantSlice';

const RestaurantScreen = () => {
  const dispatch = useDispatch();
  
  // Get restaurants and loading state from Redux store
  const { restaurants, isLoading, error } = useSelector((state) => state.restaurants);

  // Fetch restaurants when component mounts
  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  // Render individual restaurant item
  const renderRestaurantItem = ({ item }) => (
    <View style={styles.restaurantItem}>
      <View style={styles.restaurantDetails}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <Text style={styles.restaurantLocation}>{item.location}</Text>
        <Text style={styles.restaurantCuisine}>{item.cuisine}</Text>
      </View>
    </View>
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