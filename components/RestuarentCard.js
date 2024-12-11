import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function RestuarentCard() {
  return (
    <View style={styles.restcard}>

    </View>
  )
}

const styles = StyleSheet.create({
    restcard: {
        width: '90%',
        height: 170,
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 15,
    },
})