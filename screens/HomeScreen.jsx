import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import Search from '../components/Search'
import RestuarentCard from '../components/RestuarentCard'


export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.maincont}>

        <View style={styles.searchComponent}>
            <Search/>
        </View>

        <View style={styles.restuarantCard}>
            <RestuarentCard/>
        </View>

        
      
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    maincont: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
        padding: 15,
    },

    restuarantCard: {
        width: '100%',
        alignItems: 'center',
    },

    searchComponent: {
        width: '100%',
        alignItems: 'center',
    }

})