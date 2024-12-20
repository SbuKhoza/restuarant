import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {
  CardField,
  useStripe,
  useConfirmPayment,
} from '@stripe/stripe-react-native';

const PaymentScreen = ({ amount, onSuccess, onError }) => {
  const { confirmPayment, loading } = useConfirmPayment();
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    if (!cardComplete) {
      Alert.alert('Error', 'Please complete card details');
      return;
    }

    try {
      setProcessing(true);

      // Call your backend to create payment intent
      const response = await fetch('YOUR_BACKEND_URL/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'zar',
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm payment with Stripe
      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
      });

      if (error) {
        Alert.alert('Error', error.message);
        onError?.(error);
        return;
      }

      if (paymentIntent.status === 'Succeeded') {
        onSuccess?.(paymentIntent);
      }

    } catch (error) {
      Alert.alert('Error', error.message);
      onError?.(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Payment Details</Text>
        </View>
        
        <View style={styles.cardFieldContainer}>
          <CardField
            postalCodeEnabled={true}
            placeholder={{
              number: '4242 4242 4242 4242',
            }}
            cardStyle={styles.cardStyle}
            style={styles.cardField}
            onCardChange={(cardDetails) => {
              setCardComplete(cardDetails.complete);
            }}
          />
        </View>

        <View style={styles.amountContainer}>
          <Text style={styles.amountText}>
            Amount to pay: {amount.toFixed(2)} ZAR
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.payButton,
            (processing || !cardComplete) && styles.payButtonDisabled,
          ]}
          onPress={handlePayment}
          disabled={processing || !cardComplete}
        >
          <Text style={styles.payButtonText}>
            {processing ? 'Processing...' : 'Pay Now'}
          </Text>
        </TouchableOpacity>

        {processing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0070f3" />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  cardFieldContainer: {
    padding: 16,
  },
  cardField: {
    width: '100%',
    height: 50,
  },
  cardStyle: {
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  amountContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  payButton: {
    backgroundColor: '#0070f3',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#ccc',
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default PaymentScreen;