import React, { useEffect } from 'react';
import { 
  Image, 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  ActivityIndicator,
  Dimensions,
  Platform,
  StatusBar 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurants } from '../redux/slices/restuarantSlice';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Calculate responsive sizes
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.25;
const NAME_FONT_SIZE = width * 0.07;
const DETAIL_FONT_SIZE = width * 0.04;

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
      <View style={styles.CardOverlay}>
        <Text 
          style={styles.textName} 
          numberOfLines={2} 
          adjustsFontSizeToFit
        >
          {item.name}
        </Text>
        <View style={styles.detailsContainer}>
          <Text 
            style={styles.textLocation} 
            numberOfLines={1}
          >
            {item.location}
          </Text>
          <Text 
            style={styles.textCuisine} 
            numberOfLines={1}
          >
            {item.cuisine}
          </Text>
        </View>
      </View>
    </View>
  );

  // Handle loading state
  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator 
          size="large" 
          color="#0000ff" 
        />
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
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      initialNumToRender={5}
      getItemLayout={(data, index) => ({
        length: CARD_HEIGHT,
        offset: CARD_HEIGHT * index,
        index,
      })}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 20,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  restcard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'tomato',
    marginVertical: 10,
    backgroundColor: 'black',
    alignSelf: 'center',
    
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: 2 
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    
    // Elevation for Android
    elevation: 5,
  },
  CardOverlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,.5)',
    borderRadius: 15,
    padding: 15,
    justifyContent: 'space-between',
  },
  textName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: NAME_FONT_SIZE,
    marginBottom: 10,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  textLocation: {
    color: 'white',
    fontSize: DETAIL_FONT_SIZE,
    flex: 1,
    marginRight: 10,
  },
  textCuisine: {
    color: 'white',
    fontSize: DETAIL_FONT_SIZE,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  }
});