import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  Text,
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// replace this with actual restaurant data fetching method
const fetchRestaurants = async (query) => {
  // Example placeholder - replace with actual API or database call
  const allRestaurants = [
    { 
      id: '1', 
      name: 'Pasta Palace', 
      cuisine: 'Italian', 
      meals: ['Spaghetti Carbonara', 'Margherita Pizza'] 
    },
    { 
      id: '2', 
      name: 'Sushi Sensation', 
      cuisine: 'Japanese', 
      meals: ['Salmon Sashimi', 'Dragon Roll'] 
    },
    { 
      id: '3', 
      name: 'Burger Barn', 
      cuisine: 'American', 
      meals: ['Classic Cheeseburger', 'BBQ Pulled Pork Burger'] 
    }
  ];

  return allRestaurants.filter(restaurant => 
    restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(query.toLowerCase()) ||
    restaurant.meals.some(meal => 
      meal.toLowerCase().includes(query.toLowerCase())
    )
  );
};

const Search = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await fetchRestaurants(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      // Optionally set an error state to show to the user
    } finally {
      setIsLoading(false);
    }
  };

  const renderRestaurantResult = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.resultItem}
        onPress={() => navigation.navigate('RestaurantDetail', { 
          restaurantId: item.id,
          restaurantName: item.name
        })}
      >
        <View style={styles.resultTextContainer}>
          <Text style={styles.resultName}>{item.name}</Text>
          <Text style={styles.resultSubtitle}>
            {item.cuisine} • {item.meals.length} meals
          </Text>
        </View>
        <Ionicons 
          name="chevron-forward" 
          size={24} 
          color="#888" 
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons 
          name="search" 
          size={20} 
          color="#888" 
          style={styles.searchIcon} 
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants, cuisines, or meals..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            <Ionicons name="close" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderRestaurantResult}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            searchQuery.length > 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No restaurants or meals found
                </Text>
              </View>
            ) : null
          }
          style={styles.resultsList}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F7F7F7',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: 'tomato',
    borderRadius: 25,
    margin: 15,
    paddingHorizontal: 15,
    width: '90%',
    height: 45,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  clearButton: {
    padding: 10,
  },
  resultsList: {
    backgroundColor: '#F7F7F7',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  resultTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  loadingText: {
    color: '#888',
    fontSize: 16,
  },
});

export default Search;