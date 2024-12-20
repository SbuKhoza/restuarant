import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitFeedback } from '../redux/slices/feedbackSlice';

const FeedbackForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.feedback);
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    dispatch(submitFeedback({ rating, comment }));
    setRating(5);
    setComment('');
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <TouchableOpacity 
        key={index} 
        onPress={() => setRating(index + 1)}
      >
        <Text style={[
          styles.star, 
          index < rating && styles.starSelected
        ]}>
          ★
        </Text>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Feedback</Text>
      
      <View style={styles.ratingContainer}>
        <Text style={styles.label}>Rating:</Text>
        <View style={styles.starsContainer}>
          {renderStars()}
        </View>
      </View>

      <Text style={styles.label}>Comments:</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        value={comment}
        onChangeText={setComment}
        placeholder="Tell us about your experience..."
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  ratingContainer: {
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  star: {
    fontSize: 30,
    marginRight: 8,
    color: '#ccc',
  },
  starSelected: {
    color: '#FFD700',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default FeedbackForm;