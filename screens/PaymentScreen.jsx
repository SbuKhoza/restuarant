import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ActivityIndicator, 
  TouchableOpacity, 
  Alert,
  BackHandler 
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import { 
  verifyPayment, 
  setReference, 
  resetPayment,
  createPaymentIntent, 
  confirmPaymentIntent 
} from '../redux/slices/paymentSlice';
import { resetReservation } from '../redux/slices/reservationSlice';

const PaymentScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  const { 
    isSuccess, 
    isProcessing,
    paymentStatus,
    lastPaymentError 
  } = useSelector(state => state.payment);
  
  // Extract reservation data from route params
  const { reservationData, total = 0 } = route.params || {};
  
  // Prevent accidental back navigation during payment
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (isProcessing || processing) {
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
  }, [isProcessing, processing]);
  
  // Initialize payment and validate amount
  useEffect(() => {
    const initializePayment = async () => {
      if (!reservationData || !reservationData.id) {
        setError('Invalid reservation data');
        return;
      }

      if (!total || total <= 0) {
        setError('Payment amount must be greater than 0');
        return;
      }

      try {
        setIsInitializing(true);
        setError(null);
        
        // Initialize payment with our backend
        const result = await dispatch(createPaymentIntent({
          ...reservationData,
          amount: total
        })).unwrap();
        
        // Set the payment URL from the response
        setPaymentUrl(result.authorizationUrl);
        
        setIsInitializing(false);
      } catch (err) {
        console.error('Payment initialization error:', err);
        setError(err.message || 'Failed to initialize payment');
        setIsInitializing(false);
      }
    };

    initializePayment();

    // Cleanup on unmount
    return () => {
      if (paymentStatus !== 'succeeded') {
        dispatch(resetPayment());
      }
    };
  }, [total, dispatch, reservationData]);

  const handleWebViewNavigationStateChange = (navState) => {
    const { url } = navState;
    
    // Check if the URL is our success/callback URL
    if (url.includes('success') || url.includes('callback')) {
      setProcessing(true);
      
      // Extract reference from URL if needed
      // This is a simplified example; you may need to parse the actual reference from URL
      const urlParams = new URL(url);
      const reference = urlParams.searchParams.get('reference') || '';
      
      if (reference) {
        handlePaymentSuccess({ data: { reference } });
      } else {
        setError('Payment reference not found');
        setProcessing(false);
      }
    }
  };
  
  // Handle payment success
  const handlePaymentSuccess = async (response) => {
    if (!response?.data?.reference) {
      setError('Invalid payment reference received');
      setProcessing(false);
      return;
    }

    dispatch(setReference(response.data.reference));

    try {
      // Verify payment with backend
      await dispatch(verifyPayment(response.data.reference)).unwrap();
      
      // Confirm payment with our reservation system
      await dispatch(confirmPaymentIntent({
        reservationId: reservationData.id,
        paymentReference: response.data.reference
      })).unwrap();

      // Reset reservation state
      dispatch(resetReservation());
      
      // Navigate to success screen
      navigation.replace('PaymentSuccess', { 
        reservationData,
        paymentReference: response.data.reference 
      });
    } catch (err) {
      handlePaymentError(err, response.data.reference);
    } finally {
      setProcessing(false);
    }
  };

  // Handle payment errors
  const handlePaymentError = (error, reference) => {
    const errorMessage = error?.message || 'An unexpected error occurred';
    setError(errorMessage);
    
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
        { text: 'Try Again', onPress: () => {
          dispatch(resetPayment());
          initializePayment();
        }},
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
        { text: 'Try Again', onPress: () => initializePayment() },
        { 
          text: 'Cancel Reservation', 
          style: 'destructive',
          onPress: () => {
            navigation.navigate('Home');
          }
        }
      ]
    );
  };

  // If there's an error, show error view
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Payment Error</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // If loading, show loading indicator
  if (isProcessing || isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.title}>
          {isInitializing ? 'Initializing Payment' : 'Processing Payment'}
        </Text>
        <ActivityIndicator size="large" color="#4682B4" />
        <Text style={styles.subtitle}>
          {isInitializing ? 'Please wait...' : 'Please wait while we confirm your payment...'}
        </Text>
      </View>
    );
  }
  
  // If processing payment confirmation
  if (processing) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.title}>Processing Payment</Text>
        <ActivityIndicator size="large" color="#4682B4" />
        <Text style={styles.subtitle}>Please wait while we confirm your payment...</Text>
      </View>
    );
  }
  
  // Render payment webview
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Complete Payment</Text>
        <Text style={styles.subtitle}>
          Reservation for {reservationData.guests} {parseInt(reservationData.guests) === 1 ? 'person' : 'people'} on {reservationData.date} at {reservationData.time}
        </Text>
        <Text style={styles.amountText}>Amount: R{total}</Text>
      </View>
      
      <View style={styles.webviewContainer}>
        <WebView
          source={{ uri: paymentUrl }}
          onNavigationStateChange={handleWebViewNavigationStateChange}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.webviewLoading}>
              <ActivityIndicator size="large" color="#4682B4" />
              <Text>Loading payment page...</Text>
            </View>
          )}
        />
      </View>
      
      <TouchableOpacity 
        style={styles.cancelButton} 
        onPress={() => {
          Alert.alert(
            'Cancel Payment',
            'Are you sure you want to cancel this payment? Your reservation will not be confirmed.',
            [
              { text: 'No', style: 'cancel' },
              { 
                text: 'Yes', 
                onPress: handlePaymentCancel 
              }
            ]
          );
        }}
      >
        <Text style={styles.cancelButtonText}>Cancel Payment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  webviewContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  webviewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  button: {
    backgroundColor: '#4682B4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#cc0000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#cc0000',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default PaymentScreen;