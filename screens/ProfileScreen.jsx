import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  TextInput 
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile } from '../redux/slices/userSlice';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(currentUser?.name || '');
  const [editedBio, setEditedBio] = useState(currentUser?.bio || '');

  const handleSaveProfile = () => {
    if (currentUser) {
      dispatch(updateUserProfile({
        name: editedName,
        bio: editedBio
      }));
      setIsEditing(false);
    }
  };

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.noUserText}>No user logged in</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image 
          source={{ uri: currentUser.avatar || 'https://via.placeholder.com/150' }}
          style={styles.avatar}
        />
        <TouchableOpacity 
          onPress={() => setIsEditing(!isEditing)}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Profile Details */}
      <View style={styles.profileDetails}>
        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Name"
            />
            <TextInput
              style={styles.input}
              value={editedBio}
              onChangeText={setEditedBio}
              placeholder="Bio"
              multiline
            />
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveProfile}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.nameText}>{currentUser.name}</Text>
            <Text style={styles.emailText}>{currentUser.email}</Text>
            {currentUser.bio && (
              <Text style={styles.bioText}>{currentUser.bio}</Text>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  profileDetails: {
    padding: 20,
    backgroundColor: 'white',
    marginTop: 10,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  emailText: {
    color: '#666',
    marginBottom: 10,
  },
  bioText: {
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noUserText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
  }
});

export default ProfileScreen;