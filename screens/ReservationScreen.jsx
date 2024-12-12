import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ReservationForm from '../components/ResevationForm'

const ReservationScreen = () => {
  return (
    <View style={styles.ResForm}>
      <ReservationForm/>
    </View>
  )
}

export default ReservationScreen

const styles = StyleSheet.create({
  ResForm: {
    height: '100%',
  }
})