import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function RestuarentCard() {
  return (
    <>
    <View style={styles.restcard}>
      <Image 
        source={require('../assets/images/african.jpeg')} 
        style={styles.restuarentImage}
        resizeMode="contain"
      />
      <Text style={styles.textName}>Ukhamba Eatery</Text>
      <View style={styles.CardOverlay}>

      </View>

    </View>

<View style={styles.restcard}>
<Image 
  source={require('../assets/images/shawerma.jpeg')} 
  style={styles.restuarentImage}
  resizeMode="contain"
/>
<Text style={styles.textName}>Wrapped Up</Text>
<View style={styles.CardOverlay}>

</View>

</View>
</>
    
  )
}

const styles = StyleSheet.create({
    restcard: {
        width: '95%',
        height: 200,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: 'tomato',
        marginTop: 10,
    },

    restuarentImage: {
      width: '100%',
      position: 'relative',
      height: '100%',
      objectFit: 'cover',
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