import { Image, StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'

export default function RestaurantCard() {
  // Get restaurants from Redux store
  const restaurants = useSelector((state) => state.restaurants.restaurants)

  // Render individual restaurant card
  const renderRestaurantCard = ({ item }) => (
    <View style={styles.restcard}>
      <Image 
        source={item.image} 
        style={styles.restaurantImage}
        resizeMode="cover"
      />
      <Text style={styles.textName}>{item.name}</Text>
      <View style={styles.CardOverlay} />
    </View>
  )

  return (
    <FlatList
      data={restaurants}
      renderItem={renderRestaurantCard}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  restcard: {
    width: '95%',
    height: 200,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'tomato',
    marginTop: 10,
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
  }
})