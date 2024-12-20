import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'
import React from 'react'
import Search from '../components/Search'
import RestaurantCard from '../components/RestaurantCard'


    export default function HomeScreen() {
        return (
            <>
                <View style={styles.quickMenu}>
                    <View style={styles.menu1}>
                        <Image
                            source={require('../assets/kota.jpg')}
                            style={styles.menuImage}
                            resizeMode="contain"
                        />
                    </View>

                    <View style={styles.menu1}>
                        <Image
                            source={require('../assets/cake.jpg')}
                            style={styles.menuImage}
                            resizeMode="contain"
                        />
                    </View>

                    <View style={styles.menu1}>
                        <Image
                            source={require('../assets/chevanon.jpg')}
                            style={styles.menuImage}
                            resizeMode="contain"
                        />
                    </View>

                    <View style={styles.menu1}>
                        <Image
                            source={require('../assets/drink.jpg')}
                            style={styles.menuImage}
                            resizeMode="contain"
                        />
                    </View>
                </View>

          <ScrollView 
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.searchComponent}>
              <Search/>
            </View>
      
            <View style={styles.restuarantCard}>
              <RestaurantCard/>
            </View>
          </ScrollView>
          </>
        )
}

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      alignItems: 'center',
      width: '100%',
      backgroundColor: 'white',
    //   padding: 15,
    },
    searchComponent: {
      width: '100%',
      alignItems: 'center',
      marginBottom: 5, 
    },
    restuarantCard: {
      width: '100%',
      alignItems: 'center',
    },

    quickMenu: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        paddingTop: 15,
        paddingLeft: 0,
        gap: 10,
        paddingBottom: 0,
        backgroundColor: 'white',
    },

    menu1: {
        width: 70,
        height: 70,
        borderRadius: '50%',
        borderWidth: 3,
        borderColor: '#17C1FF',
    },

    menuImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: 50,
    },

    
})