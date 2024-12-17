import React from 'react';
import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import { useSelector } from 'react-redux';

const RestaurantScreen = () => {
  // Get restaurants from Redux store
  const restaurants = useSelector((state) => state.restaurants.restaurants);

  // Render individual restaurant item
  const renderRestaurantItem = ({ item }) => (
    <View style={styles.restaurantItem}>
      {item.imageUri && (
        <Image 
          source={{ uri: item.imageUri }} 
          style={styles.restaurantImage} 
        />
      )}
      <View style={styles.restaurantDetails}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <Text style={styles.restaurantDescription}>{item.description}</Text>
        <Text style={styles.restaurantAddress}>{item.address}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {restaurants.length === 0 ? (
        <Text style={styles.emptyText}>No restaurants found</Text>
      ) : (
        <FlatList
          data={restaurants}
          renderItem={renderRestaurantItem}
          keyExtractor={(item) => item.id.toString()}
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
  listContainer: {
    padding: 16,
  },
  restaurantItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  restaurantDetails: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  restaurantDescription: {
    color: '#666',
    marginBottom: 4,
  },
  restaurantAddress: {
    color: '#999',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});

export default RestaurantScreen;