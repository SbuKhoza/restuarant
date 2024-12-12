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
import { 
  loginStart, 
  loginSuccess, 
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure
} from '../redux/slices/authSlice';
import axios from 'axios'; // Assuming you'll use axios for API calls

export default function AuthenticationScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleAuthentication = async () => {
    // Basic validation
    if (!email || !password || (!isLogin && !username)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      if (isLogin) {
        // Login flow
        dispatch(loginStart());
        const response = await axios.post('/api/auth/login', { 
          email, 
          password 
        });
        
        dispatch(loginSuccess({
          user: response.data.user,
          token: response.data.token
        }));
      } else {
        // Signup flow
        dispatch(signupStart());
        const response = await axios.post('/api/auth/signup', { 
          username,
          email, 
          password 
        });
        
        dispatch(signupSuccess({
          user: response.data.user,
          token: response.data.token
        }));
      }
    } catch (err) {
      dispatch(isLogin ? loginFailure(err.response?.data?.message || 'Login failed') 
                       : signupFailure(err.response?.data?.message || 'Signup failed'));
      
      Alert.alert('Authentication Error', err.response?.data?.message || 'An error occurred');
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
            {isLogin ? 'Login' : 'Sign Up'}
          </Text>

          {error && (
            <Text style={styles.errorText}>
              {error}
            </Text>
          )}

          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
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
                ? "Don't have an account? Sign Up" 
                : "Already have an account? Login"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... (previous styles remain the same)
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 15,
  }
});