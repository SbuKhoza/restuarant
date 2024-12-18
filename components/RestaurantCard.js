import React, { useEffect } from 'react';
import { 
  Image, 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  ActivityIndicator 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurants } from '../redux/slices/restuarantSlice';

export default function RestaurantCard() {
  const dispatch = useDispatch();
  
  // Get restaurants, loading state, and error from Redux store
  const { restaurants, isLoading, error } = useSelector((state) => state.restaurants);

  // Fetch restaurants when component mounts
  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  // Render individual restaurant card
  const renderRestaurantCard = ({ item }) => (
    <View style={styles.restcard}>
      <Image 
        source={{ uri: item.imageUri }} 
        style={styles.restaurantImage}
        resizeMode="cover"
      />
      <Text style={styles.textName}>{item.name}</Text>
      <View style={styles.CardOverlay} />
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
    <FlatList
      data={restaurants}
      renderItem={renderRestaurantCard}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restcard: {
    width: '95%',
    height: 200,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'tomato',
    marginTop: 10,
    backgroundColor: 'black',
  },
  restaurantImage: {
    width: '100%',
    position: 'relative',
    height: '100%',
    borderRadius: 15,
  },
  CardOverlay: {
    width: '100%',
    height: 100,
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,.5)',
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  textName: {
    padding: 5,
    position: 'absolute',
    bottom: 50,
    color: 'white',
    zIndex: 1,
    fontWeight: 'bold',
    fontStyle: 'normal',
    fontSize: 30,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  }
});