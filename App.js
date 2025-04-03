import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { Provider } from 'react-redux';
import store from './redux/store';

// Import screens 
import SplashScreen from './screens/SplashScreen';
import AuthenticationScreen from './screens/AuthenticationScreen';
import HomeScreen from './screens/HomeScreen';
import ReservationScreen from './screens/ReservationScreen';
import RestaurantScreen from './screens/RestaurantScreen';
import ProfileScreen from './screens/ProfileScreen';
import Reserve from './screens/Reserve';
import PaymentScreen from './screens/PaymentScreen';

// Hamburger Menu Component
const HamburgerMenu = ({ isOpen, toggleMenu, navigation, isAuthenticated, dispatch }) => {
  const handleLogout = () => {
    // Import the logout action here to avoid circular dependencies
    const { logout } = require('./redux/slices/authSlice');
    dispatch(logout());
    toggleMenu();
    navigation.reset({
      index: 0,
      routes: [{ name: 'AuthenticationScreen' }],
    });
  };

  const menuItems = isAuthenticated 
    ? [
        { label: 'Settings', icon: 'settings', action: () => console.log('Settings pressed') },
        { label: 'Help', icon: 'help-circle', action: () => console.log('Help pressed') },
        { label: 'Logout', icon: 'log-out', action: handleLogout }
      ]
    : [
        { label: 'Login/Signup', icon: 'log-in', action: () => navigation.navigate('AuthenticationScreen') },
        { label: 'Help', icon: 'help-circle', action: () => console.log('Help pressed') }
      ];

  return isOpen ? (
    <View style={styles.hamburgerMenu}>
      {menuItems.map((item, index) => (
        <TouchableOpacity 
          key={index} 
          style={[
            styles.menuItem, 
            index === menuItems.length - 1 ? styles.menuItemLast : null
          ]}
          onPress={() => {
            item.action();
            toggleMenu();
          }}
          activeOpacity={0.7}
        >
          <Ionicons name={item.icon} size={24} color={item.label === 'Logout' ? '#e74c3c' : '#2c3e50'} />
          <Text 
            style={[
              styles.menuItemText, 
              item.label === 'Logout' ? styles.logoutText : null
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  ) : null;
};

// Main App Component with Bottom Tabs
const MainApp = ({ navigation }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const Tab = createBottomTabNavigator();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Reservation':
                iconName = focused ? 'calendar' : 'calendar-outline';
                break;
              case 'Restaurants':
                iconName = focused ? 'restaurant' : 'restaurant-outline';
                break;
              case 'Profile':
                iconName = focused ? 'person' : 'person-outline';
                break;
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#e67e22',
          tabBarInactiveTintColor: '#7f8c8d',
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerRight: () => (
            <TouchableOpacity 
              onPress={toggleMenu} 
              style={styles.menuButton}
              activeOpacity={0.7}
            >
              <Ionicons name="menu" size={24} color="#34495e" />
            </TouchableOpacity>
          )
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Reservation" component={ReservationScreen} />
        <Tab.Screen name="Restaurants" component={RestaurantScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>

      <HamburgerMenu 
        isOpen={isMenuOpen} 
        toggleMenu={toggleMenu} 
        navigation={navigation}
        isAuthenticated={isAuthenticated}
        dispatch={dispatch}
      />
    </View>
  );
};

// Auth Navigator to handle authentication flow
const AuthNavigator = () => {
  const Stack = createStackNavigator();
  
  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="AuthenticationScreen" component={AuthenticationScreen} />
    </Stack.Navigator>
  );
};

// Root App Component
const AppContent = () => {
  const Stack = createStackNavigator();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate splash screen delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds for splash screen

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName={isAuthenticated ? "MainApp" : "Auth"}
    >
      {isAuthenticated ? (
        // Authenticated user routes
        <>
          <Stack.Screen name="MainApp" component={MainApp} />
          <Stack.Screen name="Reserve" component={Reserve} />
          <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
        </>
      ) : (
        // Non-authenticated user routes
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

// Root component wrapped with Redux Provider
const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    height: '100%',
    width: '100%',
  },
  header: {
    backgroundColor: '#ffffff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    color: '#2c3e50',
    fontSize: 18,
    fontWeight: '600',
  },
  menuButton: {
    marginRight: 18,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(241, 242, 246, 0.7)',
  },
  hamburgerMenu: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 7,
    zIndex: 100,
    minWidth: 180,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '400',
  },
  logoutText: {
    color: '#e74c3c',
    fontWeight: '500',
  },
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 5,
    paddingBottom: 5,
    height: 60,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabBarLabel: {
    fontWeight: '500',
    fontSize: 12,
    paddingBottom: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  }
});