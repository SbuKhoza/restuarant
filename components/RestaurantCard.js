import React, { useEffect, useState } from 'react';
import { 
  Image, 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  ActivityIndicator,
  Dimensions,
  Platform,
  StatusBar,
  Modal,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurants } from '../redux/slices/restuarantSlice';
import { useNavigation } from '@react-navigation/native';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Calculate responsive sizes
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.25;
const NAME_FONT_SIZE = width * 0.07;
const DETAIL_FONT_SIZE = width * 0.04;

// Fallback image handling
const fallbackImages = {
  italian: require('../assets/images/kota.jpg'),
  mexican: require('../assets/images/cake.jpg'),
  chinese: require('../assets/images/african.jpeg'),
  default: require('../assets/images/african.jpeg'),
};

export default function RestaurantCard() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const { restaurants, isLoading, error } = useSelector((state) => state.restaurants);

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  const getFallbackImage = (cuisine) => {
    if (!cuisine) return fallbackImages.default;
    const lowerCuisine = cuisine.toLowerCase();
    for (let key in fallbackImages) {
      if (lowerCuisine.includes(key)) {
        return fallbackImages[key];
      }
    }
    return fallbackImages.default;
  };

  const handleCardPress = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowModal(true);
  };

  const handleReservePress = () => {
    setShowModal(false);
    navigation.navigate('Reserve', { restaurant: selectedRestaurant });
  };

  const renderRestaurantCard = ({ item }) => {
    let imageSource;
    try {
      imageSource = item.imageUri ? { uri: item.imageUri } : getFallbackImage(item.cuisine);
    } catch (error) {
      console.error('Image loading error:', error);
      imageSource = fallbackImages.default;
    }

    return (
      <TouchableOpacity 
        style={styles.restcard}
        onPress={() => handleCardPress(item)}
      >
        <Image 
          source={imageSource}
          style={styles.backgroundImage}
          resizeMode="cover"
          onError={(e) => {
            console.error('Image load error:', e.nativeEvent.error);
            imageSource = fallbackImages.default;
          }}
        />
        <View style={styles.CardOverlay}>
          <Text style={styles.textName} numberOfLines={2} adjustsFontSizeToFit>
            {item.name}
          </Text>
          <View style={styles.detailsContainer}>
            <Text style={styles.textLocation} numberOfLines={1}>
              {item.location}
            </Text>
            <Text style={styles.textCuisine} numberOfLines={1}>
              {item.cuisine}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Restaurants...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <>
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

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedRestaurant && (
              <ScrollView>
                <Image 
                  source={
                    selectedRestaurant.imageUri 
                      ? { uri: selectedRestaurant.imageUri }
                      : getFallbackImage(selectedRestaurant.cuisine)
                  }
                  style={styles.modalImage}
                  resizeMode="cover"
                />
                <View style={styles.modalDetails}>
                  <Text style={styles.modalName}>{selectedRestaurant.name}</Text>
                  <Text style={styles.modalText}>Location: {selectedRestaurant.location}</Text>
                  <Text style={styles.modalText}>Cuisine: {selectedRestaurant.cuisine}</Text>
                  {/* Add more restaurant details here */}
                </View>
                <TouchableOpacity 
                  style={styles.reserveButton}
                  onPress={handleReservePress}
                >
                  <Text style={styles.reserveButtonText}>Reserve Now</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: width * 0.9,
    maxHeight: height * 0.8,
    borderRadius: 15,
    overflow: 'hidden',
  },
  modalImage: {
    width: '100%',
    height: height * 0.3,
  },
  modalDetails: {
    padding: 20,
  },
  modalName: {
    fontSize: NAME_FONT_SIZE,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: DETAIL_FONT_SIZE,
    marginBottom: 5,
  },
  reserveButton: {
    backgroundColor: 'tomato',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  reserveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  closeButtonText: {
    fontSize: 16,
  },
  textName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: NAME_FONT_SIZE,
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
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
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  textCuisine: {
    color: 'white',
    fontSize: DETAIL_FONT_SIZE,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  }
});