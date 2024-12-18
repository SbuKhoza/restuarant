import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { loginUser, signupUser } from '../redux/slices/authSlice';

export default function AuthenticationScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setname] = useState('');

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleAuthentication = async () => {
    // Basic validation
    if (!email || !password || (!isLogin && !name)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      if (isLogin) {
        // Login flow using async thunk
        const result = await dispatch(loginUser({ 
          email, 
          password 
        })).unwrap();
        
        // Navigate to HomeScreen on successful login
        navigation.replace('MainApp');
      } else {
        // Register flow using async thunk
        const result = await dispatch(signupUser({ 
          name,
          email, 
          password 
        })).unwrap();
        
        // Navigate to HomeScreen on successful registration
        navigation.replace('MainApp');
      }
    } catch (err) {
      console.log("error msg:",err)
      
      Alert.alert('Authentication Error', err || 'An error occurred');

    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <View style={styles.authContainer}>
          <Text style={styles.title}>
            {isLogin ? 'Login' : 'Register'}
          </Text>

          {error && (
            <Text style={styles.errorText}>
              {error}
            </Text>
          )}

          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="name"
              value={name}
              onChangeText={setname}
              autoCapitalize="none"
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity 
            style={styles.authButton}
            onPress={handleAuthentication}
            disabled={isLoading}
          >
            <Text style={styles.authButtonText}>
              {isLoading 
                ? (isLogin ? 'Logging in...' : 'Creating Account...') 
                : (isLogin ? 'Login' : 'Create Account')
              }
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setIsLogin(!isLogin)}
            disabled={isLoading}
          >
            <Text style={styles.switchText}>
              {isLogin 
                ? "Don't have an account? Register" 
                : "Already have an account? Login"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9', // Soft light blue-gray background
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  authContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    marginHorizontal: 20,
    paddingVertical: 40,
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 25,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    color: '#495057',
  },
  authButton: {
    backgroundColor: '#007bff', // Vibrant blue
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#007bff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  authButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  switchText: {
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  errorText: {
    color: '#dc3545', // Bootstrap-like error red
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: '#6c757d', // Muted gray for disabled state
    opacity: 0.7,
  },
});
