import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import screens 
import SplashScreen from './screens/SplashScreen';
import AuthenticationScreen from './screens/AuthenticationScreen';
import HomeScreen from './screens/HomeScreen';
import ReservationScreen from './screens/ReservationScreen';
import RestaurantScreen from './screens/RestaurantScreen';
import ProfileScreen from './screens/ProfileScreen';
import { Provider } from 'react-redux';
import store from './redux/store';

// Hamburger Menu Component
const HamburgerMenu = ({ isOpen, toggleMenu }) => {
  const menuItems = [
    { label: 'Settings', icon: 'settings' },
    { label: 'Help', icon: 'help-circle' },
    { label: 'Logout', icon: 'log-out' }
  ];

  return isOpen ? (
    <View style={styles.hamburgerMenu}>
      {menuItems.map((item, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.menuItem}
          onPress={() => {
            console.log(`${item.label} pressed`);
            toggleMenu();
          }}
        >
          <Ionicons name={item.icon} size={24} color="black" />
          <Text style={styles.menuItemText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  ) : null;
};

// Main App Component with Bottom Tabs
const MainApp = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const Tab = createBottomTabNavigator();

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
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          headerRight: () => (
            <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
              <Ionicons name="menu" size={24} color="black" />
            </TouchableOpacity>
          )
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Reservation" component={ReservationScreen} />
        <Tab.Screen name="Restaurants" component={RestaurantScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>

      <HamburgerMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
    </View>
  );
};

// Root Stack Navigator
const App = () => {
  const Stack = createStackNavigator();

  return (
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="MainApp" component={MainApp} />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  menuButton: {
    marginRight: 15,
  },
  hamburgerMenu: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    marginLeft: 10,
    fontSize: 16,
  }
});