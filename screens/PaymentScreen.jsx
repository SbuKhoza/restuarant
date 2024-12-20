// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   SafeAreaView,
//   TouchableOpacity,
// } from 'react-native';
// import {
//   CardField,
//   useStripe,
//   useConfirmPayment,
//   StripeProvider,
// } from '@stripe/stripe-react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { createPaymentIntent, confirmPaymentIntent, selectPaymentState } from '../redux/slices/paymentSlice';

// const STRIPE_PUBLISHABLE_KEY = 'pk_test_51QUonaLfnYH5WXDpSsRgB25dK0TSn5kv0Sd9X5aJVbnTugIB9gutHHJSDuVWVScJYrdMZpFlN5LsaFQMsQzOYkCF00jgXV0Wys';

// const PaymentScreenContent = ({ amount, onSuccess, onError, reservationData }) => {
//   const dispatch = useDispatch();
//   const { confirmPayment } = useConfirmPayment();
//   const [cardComplete, setCardComplete] = useState(false);
//   const [processing, setProcessing] = useState(false);
//   const { isProcessing, error, paymentStatus } = useSelector(selectPaymentState);

//   const handlePayment = async () => {
//     if (!cardComplete) {
//       Alert.alert('Error', 'Please complete card details');
//       return;
//     }

//     try {
//       setProcessing(true);

//       // Create payment intent through Redux
//       const paymentIntentResult = await dispatch(createPaymentIntent(reservationData)).unwrap();
      
//       // Confirm payment with Stripe
//       const { error: stripeError, paymentIntent } = await confirmPayment(
//         paymentIntentResult.clientSecret,
//         { paymentMethodType: 'Card' }
//       );

//       if (stripeError) {
//         Alert.alert('Payment Error', stripeError.message);
//         onError?.(stripeError);
//         return;
//       }

//       // Confirm payment on backend
//       if (paymentIntent.status === 'Succeeded') {
//         await dispatch(confirmPaymentIntent({
//           reservationId: paymentIntentResult.reservationId,
//           paymentIntentId: paymentIntent.id
//         })).unwrap();
        
//         onSuccess?.(paymentIntent);
//         Alert.alert('Success', 'Payment processed successfully');
//       }

//     } catch (error) {
//       Alert.alert('Error', error.message);
//       onError?.(error);
//     } finally {
//       setProcessing(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.card}>
//         <View style={styles.header}>
//           <Text style={styles.headerText}>Payment Details</Text>
//         </View>
        
//         <View style={styles.cardFieldContainer}>
//           <CardField
//             postalCodeEnabled={true}
//             placeholder={{
//               number: '4242 4242 4242 4242',
//             }}
//             cardStyle={styles.cardStyle}
//             style={styles.cardField}
//             onCardChange={(cardDetails) => {
//               setCardComplete(cardDetails.complete);
//             }}
//           />
//         </View>

//         <View style={styles.amountContainer}>
//           <Text style={styles.amountText}>
//             Amount to pay: {amount.toFixed(2)} ZAR
//           </Text>
//         </View>

//         <TouchableOpacity
//           style={[
//             styles.payButton,
//             (processing || !cardComplete) && styles.payButtonDisabled,
//           ]}
//           onPress={handlePayment}
//           disabled={processing || !cardComplete}
//         >
//           <Text style={styles.payButtonText}>
//             {processing ? 'Processing...' : 'Pay Now'}
//           </Text>
//         </TouchableOpacity>

//         {processing && (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color="#0070f3" />
//           </View>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// };

// // Wrapped component with StripeProvider
// const PaymentScreen = (props) => {
//   return (
//     <StripeProvider publishableKey={pk_test_51QUonaLfnYH5WXDpSsRgB25dK0TSn5kv0Sd9X5aJVbnTugIB9gutHHJSDuVWVScJYrdMZpFlN5LsaFQMsQzOYkCF00jgXV0Wys}>
//       <PaymentScreenContent {...props} />
//     </StripeProvider>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   card: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     margin: 16,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   header: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   headerText: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#333',
//   },
//   cardFieldContainer: {
//     padding: 16,
//   },
//   cardField: {
//     width: '100%',
//     height: 50,
//   },
//   cardStyle: {
//     backgroundColor: '#FFFFFF',
//     textColor: '#000000',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//   },
//   amountContainer: {
//     padding: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//   },
//   amountText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#333',
//   },
//   payButton: {
//     backgroundColor: '#0070f3',
//     margin: 16,
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   payButtonDisabled: {
//     backgroundColor: '#ccc',
//   },
//   payButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   loadingContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.8)',
//   },
// });

// export default PaymentScreen;

import React, { useEffect, useState } from 'react';
import { Paystack } from 'react-native-paystack-webview';
import { View, StyleSheet, Alert, ActivityIndicator, BackHandler } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { verifyPayment, setReference, resetPayment } from '../redux/slices/paymentSlice';
import { createPaymentIntent, confirmPaymentIntent } from '../redux/slices/paymentSlice';

const PaymentScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);
  const { total = 0, reservationData } = route.params || {};
  const { 
    isSuccess, 
    error, 
    isProcessing,
    paymentStatus,
    lastPaymentError 
  } = useSelector(state => state.payment);

  // Prevent accidental back navigation during payment
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (isProcessing) {
          Alert.alert(
            'Payment in Progress',
            'Please wait while your payment is being processed.',
            [{ text: 'OK' }]
          );
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [isProcessing]);

  // Initialize payment and validate amount
  useEffect(() => {
    const initializePayment = async () => {
      if (!total || total <= 0) {
        Alert.alert('Invalid Amount', 'Payment amount must be greater than 0');
        navigation.goBack();
        return;
      }

      try {
        await dispatch(createPaymentIntent({
          ...reservationData,
          amount: total
        })).unwrap();
        setIsInitializing(false);
      } catch (err) {
        Alert.alert(
          'Payment Initialization Failed',
          'Unable to initialize payment. Please try again.',
          [{ text: 'Go Back', onPress: () => navigation.goBack() }]
        );
      }
    };

    initializePayment();

    // Cleanup on unmount
    return () => {
      if (paymentStatus !== 'succeeded') {
        dispatch(resetPayment());
      }
    };
  }, [total, dispatch]);

  // Handle payment success
  const handlePaymentSuccess = async (response) => {
    if (!response?.data?.reference) {
      Alert.alert('Error', 'Invalid payment reference received');
      return;
    }

    dispatch(setReference(response.data.reference));

    try {
      // Verify payment with Paystack and confirm on our backend
      await dispatch(verifyPayment(response.data.reference)).unwrap();
      await dispatch(confirmPaymentIntent({
        reservationId: reservationData.id,
        paymentReference: response.data.reference
      })).unwrap();

      navigation.replace('PaymentSuccess', { 
        reservationData,
        paymentReference: response.data.reference 
      });
    } catch (err) {
      handlePaymentError(err, response.data.reference);
    }
  };

  // Handle payment errors
  const handlePaymentError = (error, reference) => {
    const errorMessage = error?.message || 'An unexpected error occurred';
    Alert.alert(
      'Payment Verification Failed',
      errorMessage,
      [
        { 
          text: 'Contact Support', 
          onPress: () => navigation.navigate('Support', { 
            reference,
            error: errorMessage
          })
        },
        { text: 'Try Again', onPress: () => dispatch(resetPayment()) },
        { text: 'Cancel', style: 'cancel', onPress: handlePaymentCancel }
      ]
    );
  };

  // Handle payment cancellation
  const handlePaymentCancel = () => {
    dispatch(resetPayment());
    Alert.alert(
      'Payment Cancelled',
      'Your reservation is not confirmed until payment is completed.',
      [
        { text: 'Try Again', onPress: () => null },
        { 
          text: 'Cancel Reservation', 
          style: 'destructive',
          onPress: () => {
            // Add cleanup logic here if needed
            navigation.navigate('Home');
          }
        }
      ]
    );
  };

  if (isProcessing || isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Paystack
        paystackKey={process.env.REACT_APP_PAYSTACK_PUBLIC_KEY}
        amount={total.toString()}
        currency="ZAR"
        billingEmail={reservationData?.email || ""}
        activityIndicatorColor="green"
        onCancel={handlePaymentCancel}
        onSuccess={handlePaymentSuccess}
        autoStart={true}
        channels={["card", "bank", "ussd", "qr", "mobile_money"]}
        metadata={{
          reservation_id: reservationData?.id,
          custom_fields: [
            {
              display_name: "Guest Name",
              variable_name: "guest_name",
              value: reservationData?.name
            },
            {
              display_name: "Number of Guests",
              variable_name: "guest_count",
              value: reservationData?.guests
            },
            {
              display_name: "Reservation Date",
              variable_name: "reservation_date",
              value: reservationData?.date
            }
          ]
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  }
});

export default PaymentScreen;